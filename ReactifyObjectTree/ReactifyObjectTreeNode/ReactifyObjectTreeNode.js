const _ = require("lodash")
const TreeNode = require("../TreeNode/TreeNode")
const processConfig = require("./processConfig")
const setupValue = require("./SetupValue/setupValue")
const injectToObject = require("./injectToObject")
const setFunction = require("./set")
const getFunction = require("./get")
const EventMan = require("@xlcyun/event-man")
const getTreeNode = require("./getTreeNode")
const toObject = require("./toObject")
const ArrayValueClass = require("./ArrayValueClass/ArrayValueClass")
const getTreeNodeByPath = require("./getTreeNodeByPath")
const revision = require("../revision/revision")

// copyFrom -> object -> default -> undefined
class ReactifyObjectTreeNode extends TreeNode {
  constructor(object, config, name, parent, copyFrom) {
    super(config, name, parent)
    this.object = object
    this.copyFrom = copyFrom

    this.event = new EventMan()
    // prepocess/process config
    processConfig.call(this)
    // setup value
    setupValue.call(this)
    // inject to object if it's root
    injectToObject.call(this)
    delete this.event.thisArg
    Object.defineProperty(this.event, "thisArg", {
      get: () => (this.isRoot ? this.object : this.parent.value)
    })

    // register 'init' event
    this.event.on("init", function(self) {
      self.init.call(this, self)
      // emit 'init' for children
      for (let key of Object.keys(self.children)) self.children[key].event.emit("init", self.children[key]).once
    })
    // Root node triggers 'init' event
    if (this.isRoot) this.event.emit("init", this).once
  }

  setupRevision(generateRevisionInfoFunction) {
    this.revision = new revision(this, generateRevisionInfoFunction)
  }

  /**
   * set the parent of this TreeNode
   * @param {ReactifyObjectTreeNode} parent parent
   */
  setParent(parent) {
    if (parent instanceof ReactifyObjectTreeNode === false)
      throw new TypeError("parent should be an instance of ReactifyObjectTreeNode")
    parent.appendChild(this)
  }

  /**
   * append a child to this TreeNode
   * @param {ReactifyObjectTreeNode} child child
   */
  appendChild(child) {
    if (child instanceof ReactifyObjectTreeNode === false)
      throw new TypeError("child should be an instance of ReactifyObjectTreeNode")
    if (this.isLeaf && _.isObject(this.value) === false)
      throw new TypeError("leaf(property) with non-object value cannot append a child")
    let e = super.appendChild(child)
    if (e instanceof Error) throw e
  }

  /**
   * get root's value
   */
  get $root() {
    return this.root.value
  }

  /**
   * return true if this a array node
   */
  get isArrayNode() {
    return this.isLeaf ? false : this.value instanceof ArrayValueClass ? true : false
  }

  /**
   * Return true if this is a object node
   */
  get isObjectNode() {
    return this.isLeaf ? false : this.value instanceof ArrayValueClass ? false : true
  }

  /**
   * get a tree node by path
   * @param {string} path path to located tree node
   */
  getTreeNodeByPath(path) {
    if (typeof path !== "string") throw TypeError("path should be a string")
    path = path.split(".")
    if (path[0] !== this.name) return undefined
    if (path.length === 1) return this
    return getTreeNodeByPath.call(this, path.slice(1, path.length))
  }

  /**
   * return the parent of target tree node even if the target not exists
   * @param {string} path path to located the tree node
   * @return {ReactifyObjectTreeNode|undefined} if the parent of the target tree node exists, return it, else return undefined
   */
  getParentTreeNodeByPath(path) {
    if (typeof path !== "string") throw TypeError("path should be a string")
    path = path.split(".")
    if (path.length === 1) return undefined
    path = path.slice(0, path.length - 1)
    let result = this.getTreeNodeByPath(path.join("."))
    if (result instanceof ReactifyObjectTreeNode && result.isLeaf) return undefined
    return result
  }

  /**
   * register the property's dependence on object[name]
   * @param {Object} object targent's parent object
   * @param {String} index targent's name in its parent
   * @param {Boolean} deep if true, register the dependences to its children as well
   */
  register(object, index, deep = false) {
    if (_.isBoolean(deep) === false) throw TypeError("Register failed: deep should be a boolean")

    let targetTreeNode = getTreeNode(object, index)
    if (targetTreeNode === object) deep = index

    targetTreeNode.event.on("afterSet", this.update.bind(this.isRoot ? this.object : this.parent.value))
    if (deep === true)
      for (let prop of Object.keys(targetTreeNode.children)) this.register(targetTreeNode.value, prop, true)
  }

  /**
   * getter for current node's value
   */
  get getter() {
    return getFunction.call(this)
  }

  /**
   * setter for the currnet node's value
   */
  set setter(newValue) {
    if (this.mode === "async")
      throw new Error("Async mode property, should not use setter, use set or $set function to change its value.")
    if (this.isRoot) throw Error("You cannot change the value of the top level object")
    setFunction.call(this, this.parent.value, this.name, newValue, this.mode)
  }

  /**
   * get value of the property of this current node
   * @param {String} propertyName property's name
   */
  get(propertyName) {
    if (this.isLeaf)
      throw Error("Get property value failed: current object at bottom level, which have no reactify property")
    if (typeof propertyName !== "string") throw TypeError("Property name should be a string")
    let treeNode = this.children[propertyName]
    if (!treeNode)
      throw ReferenceError(`Cannot find the property ${propertyName}, are you sure it's reactified in config?`)
    return treeNode.getter
  }

  /**
   * Set value of the property of the current node
   * @param {*} newValue
   */
  set(propertyName, newValue) {
    if (this.isLeaf)
      throw Error("Set property value failed: current object at bottom level, which have no reactify property")
    return setFunction.call(this, this.value, propertyName, newValue)
  }

  /**
   * Convert this reactify tree to an objectg
   * @param {Boolean} clone use clone function to clone property
   */
  toObject(clone = false) {
    if (typeof clone !== "boolean") throw TypeError("argument `clone` should be boolean")
    let res = {}
    toObject.call(this, res, clone)
    return res[this.name]
  }

  /**
   * Use `object` to update value of this tree
   * To change an array, use: [start, deleteCount, ...pushItems] to manipulate its elements
   * Or use: {[[index]]: newValue} to change the value of the element located by index
   * @param {Any} object object to update
   * @return {Generator} return a generator which will yield the every result of every set operation
   */
  *setSequence(object) {
    if (this.isLeaf) {
      yield this.parent.set(this.name, object)
      return
    }
    if (this.isArrayNode) {
      if (_.isObject(object) === false)
        throw TypeError(`Set operation failed: new value for ${this.path} should be an object or array`)
      // [start, deleteCount, ...pushItems]
      if (_.isArray(object)) yield this.value.splice(object[0], object[1], ...object.slice(2, object.length))
      // { [[index]]: newValue }
      else
        for (let key of Object.keys(object)) {
          let index = _.toInteger(key)
          if (index.toString() !== key) throw TypeError(`Invalid index: ${key}, should be a integer`)
          let node = this.value.getTreeNodeByIndex(index)
          for (let seq of node.setSequence(object[key])) yield seq
        }
    } else {
      if (_.isObject(object) === false)
        throw TypeError(`Set operation failed: new value for ${this.path} should be an object`)
      for (let prop of Object.keys(object)) {
        if (!this.children[prop])
          throw ReferenceError(`Set operation failed: ${this.path}.${prop} doesn't exist in reactify object`)
        for (let seq of this.children[prop].setSequence(object[prop])) yield seq
      }
    }
  }
}

module.exports = ReactifyObjectTreeNode
