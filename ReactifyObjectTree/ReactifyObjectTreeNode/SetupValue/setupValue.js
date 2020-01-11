const setupObjectView = require("./setupObjectView")
const setupArrayView = require("./setupArrayView")
const noValueSymbol = require("./noValueSymbol")
/**
 * Setup up value of the TreeNode
 */
function setupValue() {
  if (this.isLeaf === false) {
    if (this.config.properties) {
      this.value = {}
      setupObjectView(this.value, this)
    } else if (this.config.items) setupArrayView(this)
  } else {
    let value =
      this.copyFrom !== noValueSymbol ? this.copyFrom : this.object !== noValueSymbol ? this.object : this.default
    if (this.validator(value) === false) throw TypeError(`${this.path} cannot initiated by ${value}`)
    this.value = this.clone(value)
  }
}

module.exports = setupValue
