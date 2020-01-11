const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../ReactifyObjectTreeNode/ReactifyObjectTreeNode.js")
const revisionInfoFunc = require("./revisionInfoFunc")
const rollbackPatchItem = require("./rollbackPatchItem")
const op = require("./op")
const ArrayValueClass = require("../ReactifyObjectTreeNode/ArrayValueClass/ArrayValueClass")
const _ = require("lodash")

class revision {
  constructor(tree, generateRevisionInfoFunction) {
    if (tree instanceof ReactifyObjectTreeNode.module === false)
      throw TypeError("`tree` should be an instance of ReactifyObjectTreeNode")
    if (generateRevisionInfoFunction !== undefined && typeof generateRevisionInfoFunction !== "function")
      throw TypeError("`second argument: Should receive a function to generate revision info")
    this.revisionInfoFunc = generateRevisionInfoFunction || revisionInfoFunc
    this.base = undefined
    this.baseSet = false
    this.tree = tree
  }

  /**
   * Set current value to be the base of revision
   */
  refreshBase() {
    this.base = this.tree.toObject(true)
    this.baseSet = true
  }

  /**
   * Get patch that can be applied to transform current revision to the base revision
   */
  getRollbackPatch() {
    if (this.baseSet === false) throw Error("Base revision has never set, cannot get rollback patch")
    let res = []
    rollbackPatchItem.generatePatchItem(res, this.base, this.tree)
    return {
      revisionInfo: this.revisionInfoFunc.call(this.tree.value, this.tree),
      patch: res
    }
  }

  /**
   * apply a patch to current revision
   * @param {Object} patch patch to apply
   */
  applyPatch(patch) {
    if (_.isObject(patch) === false) throw TypeError("patch should be an object")
    let patchArray = patch.patch
    if (_.isArray(patchArray) === false) throw TypeError("Cannot find the revision record array in patch")

    const modify = (node, value) => {
      if (node.validator(value) === false)
        throw Error(`Apply patch failed: ${node.path} expects ${node.bsonType} got ${value.toString()}`)
      node.value = value
    }

    for (let item of patchArray) {
      rollbackPatchItem.validatePatchItemObject(item)
      let node = this.tree.getTreeNodeByPath(item.path)
      let parent = this.tree.getParentTreeNodeByPath(item.path)

      if (!parent) throw ReferenceError(`Apply patch failed: cannot get parent tree node of ${item.path}`)
      if (parent.isObjectNode) {
        if (item.op === op.enum.REMOVE)
          throw Error(`Apply patch failed: cannot remove ${item.path}, required property.`)
        else if (!node) throw Error(`Apply patch failed: cannot modify ${item.path}, not exists`)
        modify(node, item.value)
      } else if (parent.isArrayNode) {
        if (item.op === op.enum.REMOVE) {
          if (!node) throw Error(`Apply patch failed: cannot remove ${item.path}, not exists`)
          // Pop element
          let index = parent.itemSymbols.indexOf(node.symbol)
          let lastOneIndex = parent.itemSymbols.length - 1
          if (index !== lastOneIndex)
            throw Error(`Apply patch failed: Pop ${item.path} is not the last element(at ${lastOneIndex})`)
          parent.value.removeChild(parent.itemSymbols.pop())
          parent.value.updateLength()
        } else {
          // ADD
          if (!node) {
            // push new element
            let index = item.path.split(".")
            index = index[index.length - 1]
            if (parent.value.length.toString() !== index)
              throw Error(`Apply patch failed: Push ${item.path} whose index should be ${parent.value.length}.`)
            let addChild = ArrayValueClass.addChild(parent, item.value, item.value)
            parent.itemSymbols.push(addChild.symbol)
            parent.value.updateLength()
          } else modify(node, item.value)
        }
      }
    }
  }
}

module.exports = revision
