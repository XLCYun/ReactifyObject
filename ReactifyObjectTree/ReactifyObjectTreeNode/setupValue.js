const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("./ReactifyObjectTreeNode.js")
const setupObjectView = require("./setupObjectView")

/**
 * Setup up value of the TreeNode
 */
function setupValue() {
  if (this.isLeaf === false) {
    this.value = {}
    setupObjectView(this.value, this)
  } else if (this.object === undefined) this.value = undefined
  else if (this.validator(this.object) === false) throw TypeError(`${this.path} cannot initiated by ${this.object}`)
  else this.value = this.object
}

module.exports = setupValue
