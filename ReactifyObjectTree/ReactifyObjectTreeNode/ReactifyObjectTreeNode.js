const _ = require("lodash")
const TreeNode = require("../TreeNode/TreeNode")
const processConfig = require("./processConfig")
const setupValue = require("./setupValue")
const injectToObject = require("./injectToObject")
const setFunction = require("./set")
const getFunction = require("./get")
const EventMan = require("@xlcyun/event-man")

class ReactifyObjectTreeNode extends TreeNode {
  constructor(object, config, name, parent) {
    super(config, name, parent)
    this.object = object

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

  // TODO add support of passing tree node directly
  /**
   * register the property's dependence on object[name]
   * @param {Object} object targent's parent object
   * @param {String} name targent's name in its parent
   * @param {Boolean} deep if true, register the dependences to its children as well
   */
  register(object, name, deep = false) {
    if (_.isObject(object) === false) throw TypeError(`Register failed: Invalid object, received ${object}`)
    if (_.isString(name) === false) throw TypeError("Register failed: name should be a string")
    if (_.isBoolean(deep) === false) throw TypeError("Register failed: deep should be a boolean")

    if (object.$roTree instanceof ReactifyObjectTreeNode === false)
      throw TypeError("Cannot find $roTree in target object, are you sure it's reactified in config object?")

    let targetTreeNode = object.$roTree.children[name]
    if (targetTreeNode instanceof ReactifyObjectTreeNode === false)
      throw TypeError(
        `Register failed: canot find ${name} in ${object.$roTree.path}, are you sure it's reactified in config object?`
      )

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
    setFunction.call(this, this.value, propertyName, newValue, this.mode)
  }
}

module.exports = ReactifyObjectTreeNode
