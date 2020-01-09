const setupObjectView = require("./setupObjectView")
const setupArrayView = require("./setupArrayView")
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
    let value = this.object === undefined ? this.default : this.object
    if(this.validator(value) === false) throw TypeError(`${this.path} cannot initiated by ${value.toString()}`)
    this.value = this.clone(value)
  }
  // else if (this.object === undefined) this.value = this.clone(this.default)
  // else if (this.validator(this.object) === false) throw TypeError(`${this.path} cannot initiated by ${this.object}`)
  // else this.value = this.clone(object)
}

module.exports = setupValue
