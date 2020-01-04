const deferRequire = require("defer-require")
const _ = require("lodash")

const ReactifyObjectTreeNode = deferRequire("../ReactifyObjectTreeNode.js")

/**
 * Class extended from Array used to provide a view for a reactify array
 */
class ArrayValueClass extends Array {
  /**
   * Construct a ArrayValue as a view for a reactify array
   * Set connect TreeNode with this ArrayValue
   * and setup the initial items in the TreeNode
   * @param {ReactifyObjectTreeNode} treeNode TreeNode that is a array
   */
  constructor(treeNode) {
    if (treeNode instanceof ReactifyObjectTreeNode.module === false)
      throw TypeError("ArrayValueClass receives and only receives a instance of ReactifyObjectTreeNode")
    let msg = "Cannot find item's symbol array in ReactifyObjectTreeNode, are you sure it's a TreeNode for array?"
    super()

    if (_.isArray(treeNode.itemSymbols) === false) throw TypeError(msg)

    // $roTree/$set/$root
    this.$roTree = treeNode
    treeNode.value = this
    this.$set = treeNode.set.bind(treeNode)
    this.updateLength()
  }

  get $root() {
    return this.$roTree.$root
  }

  get [Symbol.species]() {
    return Array
  }

  /**
   * pop last item of array, return undefined if array is empty
   * remove last item and return its value if if otherwise
   */
  pop() {
    let symbol = this.$roTree.itemSymbols.pop()
    if (symbol === undefined) return undefined
    let res = this.removeChild(symbol)
    this.updateLength()
    return res === undefined ? undefined : res.value
  }

  /**
   * Removes first item and returns its value
   * return undefined if array is empty
   */
  shift() {
    let symbol = this.$roTree.itemSymbols.shift()
    if (symbol === undefined) return undefined
    let res = this.removeChild(symbol)
    this.updateLength()
    return res === undefined ? undefined : res.value
  }

  /**
   * add items in front of the array
   * return new length of the array
   * @param  {...any} addItems items to add
   */
  unshift(...addItems) {
    addItems = addItems.map(e => ArrayValueClass.addChild(this.$roTree, e)).map(e => e.symbol)
    this.$roTree.itemSymbols.unshift(...addItems)
    return this.updateLength()
  }

  /**
   * Delete items at given `start` position and add new items at there.
   * @param {Number} start start position
   * @param {Number} deleteCount number of the items started at start position which will be remove
   * @param  {...any} pushItems items to add
   * @return {Array} return removed items in a array
   */
  splice(start, deleteCount, ...pushItems) {
    pushItems = pushItems.map(e => ArrayValueClass.addChild(this.$roTree, e)).map(e => e.symbol)
    let deleteItems = this.$roTree.itemSymbols.splice(start, deleteCount, ...pushItems)
    let res = []
    deleteItems.forEach(e => {
      let removeRes = this.removeChild(e)
      res.push(removeRes === undefined ? undefined : removeRes.value)
    })
    this.updateLength()
    return res
  }

  /**
   * push a item at the end of the array, return new length
   * @param {Any} value value to push
   */
  push(value) {
    let res = ArrayValueClass.addChild(this.$roTree, value)
    this.$roTree.itemSymbols.push(res.symbol)
    return this.updateLength()
  }

  /**
   * Shallow copies part of an array to another location in the same array and returns it without modifying its length.
   * @param {Number} target Zero-based index at which to copy the sequence to.
   * @param {Number} start Zero-based index at which to start copying elements from.
   * @param {Number} end Zero-based index at which to end copying elements from.
   */
  copyWithin(target, start, end) {
    this.$roTree.itemSymbols.copyWithin(target, start, end)
    this.update()
    return this
  }

  /**
   * Reverses an array in place
   * @return return reversed array
   */
  reverse() {
    this.$roTree.itemSymbols.reverse()
    return this
  }

  /**
   * changes all elements in an array to a static value
   * @param {*} value Value to fill the array with.
   * @param {*} start Start index, default 0.
   * @param {*} end End index, default arr.length.
   */
  fill(value, start, end) {
    let treeNode = ArrayValueClass.addChild(this.$roTree, value)
    this.$roTree.itemSymbols.fill(treeNode.symbol, start, end)
    this.update()
    return this
  }

  /**
   * According treeNode.itemSymbols's length to update this instance's length
   * and clear children of treeNode those are not in the array anymore
   */
  update() {
    this.updateLength()
    this.updateChildren()
  }

  /**
   * According treeNode.itemSymbols' length to update this instance's length
   */
  updateLength() {
    let newLength = this.$roTree.itemSymbols.length
    let min = Math.min(newLength, this.length)
    let max = Math.max(newLength, this.length)
    for (let i = min; i < max; i++)
      max === newLength ? Object.defineProperty(this, i, this.generateGetterSetter(i)) : delete this[i]
    this.length = newLength
    return this.length
  }

  /**
   * Clear children of treeNode those are not in this array anymore
   */
  updateChildren() {
    let currentChildrenSymbols = Object.getOwnPropertySymbols(this.$roTree.children)
    currentChildrenSymbols.filter(e => this.$roTree.itemSymbols.includes(e) === false).forEach(e => this.removeChild(e))
  }

  /**
   * Remove a child in the tree node's children
   * @param {Symbol} symbol symbol as index to find target child
   */
  removeChild(symbol) {
    if (typeof symbol !== "symbol") throw TypeError("symbol should be an instance of Symbol")
    let res = this.$roTree.children[symbol]
    delete this.$roTree.children[symbol]
    return res
  }

  /**
   * Add a child into the tree node
   * @param {*} treeNode tree node to add child
   * @param {*} value value to generate a child tree node
   */
  static addChild(treeNode, value) {
    if (treeNode instanceof ReactifyObjectTreeNode.module === false)
      throw TypeError("treeNode should be instance of ReactifyObjectTreeNode")
    if (!treeNode.config.items)
      throw Error("Cannot find `items` config in treeNode, are you sure it's a array tree node?")
    let symbol = Symbol()
    let itemTreeNode = new ReactifyObjectTreeNode.module(value, treeNode.config.items, "[]", treeNode)

    itemTreeNode.symbol = symbol
    treeNode.children[symbol] = itemTreeNode
    Object.defineProperty(itemTreeNode, "name", {
      get: function() {
        if (this.parent && this.parent.itemSymbols) return this.parent.itemSymbols.indexOf(this.symbol)
        return "DanglingArrayItem" + this.id
      },
      set: function(setValue) {
        if (this.parent && this.parent.itemSymbols)
          throw Error("Name cannot be set for it will refer as a index in the array tree node")
        delete this.name
        this.name = setValue
      },
      configurable: true
    })
    return itemTreeNode
  }

  /**
   * get corresponding tree node by index
   * @param {Number} index index use to find the index of the tree node
   */
  getTreeNodeByIndex(index) {
    if (_.isInteger(index) === false) throw TypeError("index should be a integer")
    let symbol = this.$roTree.itemSymbols[index]
    let target = this.$roTree.children[symbol]
    if (target instanceof ReactifyObjectTreeNode.module === false)
      throw RangeError(`Cannot get value of ${this.$roTree.path}[${index}]`)
    return target
  }

  /**
   * generate a getter and setter which use to get and set tree node's value
   * @param {Number} index index that getter/setter related to
   */
  generateGetterSetter(index) {
    let self = this
    return {
      get: function() {
        let treeNode = self.getTreeNodeByIndex(index)
        return treeNode.getter
      },
      set: function(value) {
        let treeNode = self.getTreeNodeByIndex(index)
        return (treeNode.setter = value)
      },
      configurable: true
    }
  }
}

module.exports = ArrayValueClass
