const _ = require("lodash")

/**
 * Base class for ReactifyObjectTreeNode
 * Will not create circularly by config, therefore calling new TreeNode({ a: {} })
 * will only create a TreeNode for {a: {}}, but will not create a corresponding TreeNode instance for `a`
 * let alone set `a` to a children of the created TreeNode
 */
class TreeNode {
  constructor(config, name = "", parent = null) {
    if (_.isPlainObject(config) === false) throw new TypeError("Config should be an plained object")
    if (typeof name !== "string") throw new TypeError("name of a property should be string")
    if (parent !== null && parent instanceof TreeNode === false) throw new TypeError(`Parent should be a TreeNode`)
    if (config.properties !== undefined && _.isPlainObject(config.properties) === false)
      throw new TypeError('"properties" should be an object')

    this.id = _.uniqueId()
    this.name = name
    this.children = {}
    this.parent = null
    if (parent !== null) this.setParent(parent)
    this.config = this.parent === null && !config.properties ? { properties: config } : config
  }

  /**
   * get node's type
   * @return {string} "root"/"node"/"leaf"
   */
  get nodeType() {
    if (!this.parent) return "root"
    return this.config.properties || this.config.items ? "node" : "leaf"
  }

  /**
   * test if node's type is root
   * @return {boolean} true if is, false if not
   */
  get isRoot() {
    return this.nodeType === "root"
  }

  /**
   * test if node's type is node
   * @return {boolean} true if is, false if not
   */
  get isNode() {
    return this.nodeType === "node"
  }

  /**
   * test if node's type is leaf
   * @return {boolean} true if is, false if not
   */
  get isLeaf() {
    return this.nodeType === "leaf"
  }

  /**
   * get the root
   * @return {TreeNode} root of this tree
   */
  get root() {
    return this.isRoot ? this : this.parent.root
  }

  /**
   * get the path of this node
   * @return {boolean} true if is a root, false if not
   */
  get path() {
    return this.isRoot ? this.name : this.parent.path + "." + this.name
  }

  /**
   * set a parent to this node
   * @param {TreeNode} parent parent
   * @return {ReferenceError|undefined} return ReferenceError if this operation cause a circular reference
   */
  setParent(parent) {
    if (parent instanceof TreeNode === false) throw TypeError("parent should be an instance of TreeNode")
    return parent.appendChild(this)
  }

  /**
   * append a child node to this node
   * @param {TreeNode} child child to append
   * @return {ReferenceError|undefined} return ReferenceError if such operation cause a circular reference
   */
  appendChild(child) {
    if (child instanceof TreeNode === false) throw TypeError("child should be an instance of TreeNode")
    let oldParent = child.parent
    let oldChild = this.children[child.name]

    if (child.parent) delete child.parent.children[child.name]
    this.children[child.name] = child
    child.parent = this
    if (this.checkCircular()) {
      child.parent = oldParent
      this.children[child.name] = oldChild
      if (oldParent) oldParent.children[child.name] = child
      return ReferenceError("Circular")
    }
  }

  /**
   * check if there is a loop in the tree
   * @param {undefined|Array} track array use to track the nodes that has been visit
   * @return {boolean} true if circular reference exists, else false
   */
  checkCircular(track) {
    if (track === undefined) track = []
    else if (Array.isArray(track) === false) throw TypeError("track should be an array")
    if (track.includes(this)) return true
    if (this.parent === null) return false
    track.push(this)
    return this.parent.checkCircular(track)
  }
  // TODO search(name) use to search a TreeNode by name
}

module.exports = TreeNode
