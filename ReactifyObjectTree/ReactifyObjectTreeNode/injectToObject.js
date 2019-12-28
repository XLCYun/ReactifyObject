const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("./ReactifyObjectTreeNode.js")

function injectToObject() {
  if (this.isRoot) {
    if (!this.object || typeof this.object !== "object") throw TypeError("Invalid object to inject.")
    this.object.$roTree = this
    this.object.$set = ReactifyObjectTreeNode.module.set
    this.object.register = ReactifyObjectTreeNode.module.register
    let keys = Object.keys(this.config.properties)
    for (let key of keys)
      Object.defineProperty(this.object, key, {
        get: Object.getOwnPropertyDescriptor(this.value, key).get,
        set: Object.getOwnPropertyDescriptor(this.value, key).set
      })
  }
}

module.exports = injectToObject
