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
  } else if (this.object === undefined) this.value = undefined
  else if (this.validator(this.object) === false) throw TypeError(`${this.path} cannot initiated by ${this.object}`)
  else this.value = this.object
}

module.exports = setupValue
