const _ = require("lodash")
const deferRequire = require("defer-require")
const op = require("./op.js")
const ReactifyObjectTreeNode = deferRequire("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")
/**
 * generate a patch item object
 * @param {ReactifyObjectTreeNode} treeNode current tree node
 * @param {Any} value value to store in patch
 * @param {String} op add operation or remove operation
 */
function generatePatchItemObject(treeNode, value, op) {
  return {
    path: treeNode.path,
    value: treeNode.clone(value),
    op: op
  }
}

/**
 * Throw TypeError if object is not a valid patch item object
 * @param {Object} obj patch item object
 */
function validatePatchItemObject(obj) {
  if (_.isObject(obj) === false) throw TypeError("Invalid patch item: should be an object")
  if (typeof obj.path !== "string") throw TypeError("Invalid patch item, path should be a string")
  if (Object.keys(obj).includes("value") === false) throw TypeError("Invalid patch item: `value` does not exist")
  if (op.array.includes(obj.op) === false) throw TypeError("Invalid patch item: unknown `op`")
}

/**
 * Generate patch items by compare the values of base and cureent tree node
 * @param {Array} patchArray array used to store patch item
 * @param {Any} base current node's corresponding value in base revision
 * @param {ReactifyObjectTreeNode} treeNode currnet node
 */
function generatePatchItem(patchArray, base, treeNode) {
  let current = treeNode.value
  if (treeNode.isLeaf) {
    if (treeNode.compare(base, current) === false) patchArray.push(generatePatchItemObject(treeNode, base, op.enum.ADD))
    return
  }
  if (treeNode.isArrayNode) {
    if (_.isArray(base) === false) {
      patchArray.push(generatePatchItemObject(treeNode, base, op.enum.ADD))
      // throw TypeError(`${treeNode.path} is an array node, required a array in base object`)
      return
    }

    let currentLength = treeNode.itemSymbols.length
    let baseLength = base.length
    let min = Math.min(currentLength, baseLength)
    let max = Math.max(currentLength, baseLength)
    let operation = baseLength > currentLength ? op.enum.ADD : op.enum.REMOVE
    for (let i = 0; i < min; i++) generatePatchItem(patchArray, base[i], current.getTreeNodeByIndex(i))
    if (operation === op.enum.ADD) {
      // if is ADD operation, push patches in ascending order
      for (let i = min; i < max; i++) {
        let fakeTreeNode = new ReactifyObjectTreeNode.module({ fake: base[i] }, { fake: treeNode.config.items })
        patchArray.push({
          path: `${treeNode.path}.${i}`,
          op: operation,
          value: fakeTreeNode.children.fake.toObject(true)
        })
      }
    } else {
      // if is REMOVE operation, push patches in descending order
      for (let i = max -1; i >= min; i--)
        patchArray.push({
          path: `${treeNode.path}.${i}`,
          op: operation,
          value: treeNode.value.getTreeNodeByIndex(i).toObject(true)
        })
    }
  } else {
    if (_.isObject(base) === false) {
      patchArray.push(generatePatchItemObject(treeNode, base, op.enum.ADD))
      return
    }
    for (let prop of Object.keys(treeNode.children)) generatePatchItem(patchArray, base[prop], treeNode.children[prop])
  }
}

module.exports = {
  generatePatchItemObject: generatePatchItemObject,
  generatePatchItem: generatePatchItem,
  validatePatchItemObject: validatePatchItemObject
}
