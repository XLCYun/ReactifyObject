const _ = require("lodash")

class TreeNode {
  constructor(config, name = "", parent = null) {
    if (parent && parent instanceof TreeNode === false) throw new TypeError(`Parent should be a TreeNode`)
    if (!config) throw new ReferenceError("Config inaccessable")
    if (_.isPlainObject(config) === false) throw new TypeError("Config should be an plained object")
    if (_.isPlainObject(config.properties) === false) throw new TypeError('"properties" should be an object')
    if (typeof name !== "string") throw new TypeError("name of a property should be string")

    // set type
    if (!parent) this.type = "root"
    else if (config.properties) this.type = "node"
    else this.type = "leaf"

    // set name
    this.name = name

    // set parent
    this.parent = parent instanceof TreeNode ? parent : null

    this.children = {}

    // set config
    this.config = this.isRoot ? { properties: config } : config
  }

  get isRoot() {
    return this.type === "root"
  }
  get isNode() {
    return this.type === "node"
  }
  get isLeaf() {
    return this.type === "leaf"
  }
  get root() {
    return this.isRoot ? this : this.parent.root
  }
  get path() {
    return this.isRoot ? this.path : this.parent.path + "." + this.name
  }
}

module.exports = TreeNode
