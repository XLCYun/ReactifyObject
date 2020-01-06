const ArrayValueClass = require("../ReactifyObjectTreeNode/ArrayValueClass/ArrayValueClass")

/**
 * Convert this reactify tree to an object
 * Only call by ReactifyObjectTreeNode.prototype.toObject function
 * @param {Object} object object to store current node's value
 * @param {Boolean} clone use clone function to clone property
 */
function toObject(object, clone) {
  if (this.isLeaf) {
    object[this.name] = clone ? this.clone(this.value) : this.value
    return
  }
  let value = this.value
  if (value instanceof ArrayValueClass) {
    let arr = (object[this.name] = [])
    for (let i = 0; i < this.itemSymbols.length; i++) toObject.call(this.children[this.itemSymbols[i]], arr, clone)
  } else {
    let obj = (object[this.name] = {})
    for (let i of Object.keys(this.children)) toObject.call(this.children[i], obj, clone)
  }
}

module.exports = toObject
