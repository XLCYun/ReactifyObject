const setupObjectView = require("./SetupValue/setupObjectView")

/**
 * Inject object view to top level object.
 * Only called by the constructor of ReactifyObjectTreeNode
 */
function injectToObject() {
  if (this.isRoot) {
    if (!this.object || typeof this.object !== "object") throw TypeError("Invalid object to inject.")
    setupObjectView(this.object, this)
  }
}

module.exports = injectToObject
