const _ = require("lodash")
const entry = require("./entry")
const EventMan = require("@xlcyun/event-man")
const TreeNode = require("./TreeNode")

class ReactifyObjectTreeNode extends TreeNode {
  constructor(object, config, name, parent) {
    super(config, name, parent)

    this.object = object

    // set event
    if (this.isRoot) this.eventMan = new EventMan()

    // set children, value
    this.children = {}
    if (this.isLeaf === false) {
      this.value = {
        $roTree: this,
        $set: ReactifyObjectTreeNode.set,
        $register: ReactifyObjectTreeNode.register
      }
      this.value.$set = ReactifyObjectTreeNode.set
      this.value

      Object.defineProperty(this.value, "$register", {
        get: function() {
          return this.$roTree.register
        }
      })

      let keys = Object.keys(this.config.properties)
      for (let key of keys) {
        this.children[key] = new ReactifyObjectTreeNode(
          object && object[key] !== undefined ? object[key] : undefined,
          this.config.properties[key],
          key,
          this
        )
        // 构造 getter/setter
        Object.defineProperty(this.value, key, {
          get: () => this.get,
          set: value => {
            if (this.mode === "async")
              throw new Error("Async mode property, should not use setter, use $set function to change its value.")
            this.set(value)
          }
        })
      }
    } else this.value = object // validate ?

    // prepocess/process
    let entryKeys = Object.keys(entry)
    for (let key of entryKeys) entry[key].preprocess(this)
    for (let key of entryKeys) entry[key].process(this)

    // call init
    this.init.call(this.value)

    // inject to object
    if (this.isRoot) {
      if (!object || typeof object !== "object") throw TypeError("Invalid object to inject.")
      this.object.$roTree = this
      this.object.$set = ReactifyObjectTreeNode.set
      this.object.register = ReactifyObjectTreeNode.register
      let keys = Object.keys(this.config.properties)
      for (let key of keys)
        Object.defineProperty(this.object, key, {
          get: Object.getOwnPropertyDescriptor(this.value, key).get,
          set: Object.getOwnPropertyDescriptor(this.value, key).set
        })
    }
  }

  get event() {
    return treeNode.isRoot ? treeNode.eventMan : treeNode.parent.event
  }

  collectChildrenPath() {
    let keys = Object.keys(treeNode.children)
    let res = [treeNode.path]

    if (treeNode.isLeaf) return res
    for (let key of keys) res = res.concat(treeNode.children[key].collectChildrenPath())
    return res
  }

  static register(object, name, deep = false) {
    let targetTreeNode = object.$roTree.children[name]
    if (!object) throw ReferenceError("Register failed, target object is not accessible")
    if (object.$roTree instanceof ReactifyObjectTreeNode === false)
      throw TypeError("Register failed, target object is not a valid $roTree")
    if (targetTreeNode instanceof ReactifyObjectTreeNode === false)
      throw TypeError("Register failed, cannot find the corresponding $roTree of the target")

    let eventName = deep === true ? targetTreeNode.collectChildrenPath() : [targetTreeNode.path]
    this.event.on(eventName, targetTreeNode.update)
  }

  register(object, name, deep) {
    ReactifyObjectTreeNode.register(object, name, deep)
  }

  async asyncAfterGet(returnedPromise, value) {
    try {
      let afterGetResult = await returnedPromise
      return afterGetResult === undefined ? value : afterGetResult
    } catch (e) {
      throw e
    }
  }

  async asyncBeforeGet(returnedPromise, value) {
    try {
      let beforeGetResult = await returnedPromise
      if (beforeGetResult !== undefined) value = beforeGetResult
      // call afterGetFunc
      let afterGetResult = this.afterGet.call(this.root.value, value)
      if (Promise.resolve(afterGetResult) === afterGetResult) return await this.asyncAfterGet(afterGetResult, value)
      else return afterGetResult === undefined ? value : afterGetResult
    } catch (e) {
      throw e
    }
  }

  get get() {
    let value = this.value
    let result = this.beforeSet.call(this.root.value)

    // beforeGet return a Promise
    if (Promise.resolve(result) === result) return this.asyncBeforeGet(result, value)
    else if (result !== undefined) value = result

    result = this.afterGet.call(this.root.value, value)
    // afterGet reuturn a Promise
    if (Promise.resolve(result) === result) return this.asyncAfterGet(result, value)
    else if (result !== undefined) value = result

    return value
  }

  static async set(treeNode, newValue) {
    if (treeNode instanceof ReactifyObjectTreeNode === false)
      throw TypeError("Set new value failed, target's $roTree should be an instanceof ReactifyObjectTreeNode")

    if (treeNode.validator(newValue) === false) throw TypeError("Cannot set new value: Validation failed")
    if (treeNode.compare(oldValue, newValue)) return

    try {
      let oldValue = treeNode.value
      let result = await treeNode.beforeSet.call(treeNode.root.value, newValue)
      if (result === false) return
      treeNode.value = newValue
      await treeNode.afterSet.call(this.root.value)
      await treeNode.event.emit(treeNode.path, treeNode.root, newValue, oldValue).once
    } catch (e) {
      throw e
    }
  }

  async set(newValue) {
    try {
      ReactifyObjectTreeNode.set(this, newValue)
    } catch (e) {
      throw e
    }
  }
}

module.exports = ReactifyObjectTreeNode
