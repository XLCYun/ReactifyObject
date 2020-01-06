const _ = require("lodash")
const assert = require("assert")
const setupObjectView = require("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/SetupValue/setupObjectView")
const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const mixType = require("../../../helper/mixType")

describe("setupObjectView", function() {
  let config = {
    a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
    a2: {}
  }
  let object = {}
  let setupObject = {}
  let treeNode = undefined

  beforeEach(function() {
    object = { a: { b: { c: {}, c2: "I am c2" }, b2: "I am b2" }, a2: "I am a2" }
    setupObject = {}
    treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
  })

  it("no argument, throw TypeError", function() {
    assert.throws(() => setupObjectView(), TypeError, "no arguemnt, should throw TypeError")
  })

  it("one argument, not object, should throw TypeError", function() {
    for (let i of mixType.getAll().filter(e => typeof e !== "object" && e !== undefined))
      assert.throws(() => setupObjectView(i), TypeError)
  })

  it("two argument, invalid treeNode, should throw TypeError", function() {
    for (let i of mixType.getAll()) assert.throws(() => setupObjectView(i), TypeError)
  })

  it("$roTree", function() {
    setupObjectView(setupObject, treeNode)
    assert.equal(setupObject.$roTree, treeNode)
  })

  it("$set", function() {
    treeNode.set = function() {
      assert.equal(this, treeNode)
      this.testSet = "testSet"
      return "testSet"
    }
    setupObjectView(setupObject, treeNode)
    assert.equal(setupObject.$set(), "testSet")
    assert.equal(treeNode.testSet, "testSet")
  })

  it("$root", function() {
    delete treeNode.value.$root
    setupObjectView(setupObject, treeNode)
    assert.equal(setupObject.$root, treeNode.value)
  })

  it("properties' getter", function() {
    let oldGet = Object.getOwnPropertyDescriptor(ReactifyObjectTreeNode.module.prototype, "getter")
    Object.defineProperty(ReactifyObjectTreeNode.module.prototype, "getter", {
      get: function() {
        this.testGetter = "test getter"
        assert.equal(this, treeNode.children.a)
        return "test getter"
      }
    })
    setupObjectView(setupObject, treeNode)
    assert.equal(setupObject.a, "test getter")
    assert.equal(treeNode.children.a.testGetter, "test getter")

    Object.defineProperty(ReactifyObjectTreeNode.module.prototype, "getter", oldGet)
  })

  it("properties' setter", function() {
    let oldSet = Object.getOwnPropertyDescriptor(ReactifyObjectTreeNode.module.prototype, "setter")
    Object.defineProperty(ReactifyObjectTreeNode.module.prototype, "setter", {
      set: function(value) {
        this.testSetter = value
        assert.equal(value, "test setter")
        assert.equal(this, treeNode.children.a)
      }
    })
    setupObjectView(setupObject, treeNode)
    setupObject.a = "test setter"
    assert.equal(treeNode.children.a.testSetter, "test setter")

    Object.defineProperty(ReactifyObjectTreeNode.module.prototype, "setter", oldSet)
  })

  it("getter's functionality", function() {
    setupObjectView(setupObject, treeNode)
    assert.equal(setupObject.a.b.c2, "I am c2")
    assert.equal(setupObject.a.b2, "I am b2")
    assert.equal(setupObject.a2, "I am a2")
  })

  it("setter's functionality", function() {
    setupObjectView(setupObject, treeNode)
    setupObject.a.b.c2 = "I am new c2"
    setupObject.a.b2 = "I am new b2"
    setupObject.a2 = "I am new a2"
    assert.equal(setupObject.a.b.c2, "I am new c2")
    assert.equal(setupObject.a.b2, "I am new b2")
    assert.equal(setupObject.a2, "I am new a2")
  })

  it("set a object(node) to leaf", function() {
    let config = {
      a: { type: "object", properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
      a2: {}
    }
    setupObject = {}
    object = {}
    treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    setupObjectView(setupObject, treeNode)
    assert.throws(() => (setupObject.a = "I am leaf a now"), TypeError)
  })
})
