const _ = require("lodash")
const assert = require("assert")
const setupValue = require("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/setupValue/setupValue")
const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const ArrayValueClass = require("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/ArrayValueClass/ArrayValueClass")

describe("setupValue", function() {
  let config = {
    a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
    a2: {}
  }
  let object = {}
  let treeNode = undefined

  beforeEach(function() {
    object = {}
    treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
  })

  /** Actually testing the same function like setupObjectView.test.js, starting here */
  it("$roTree", function() {
    delete treeNode.value.$roTree
    setupValue.call(treeNode)
    assert.equal(treeNode.value.$roTree, treeNode)
  })

  it("$set", function() {
    delete treeNode.value.$set
    treeNode.set = function() {
      assert.equal(this, treeNode)
      this.testSet = "testSet"
      return "testSet"
    }
    setupValue.call(treeNode)
    assert.equal(treeNode.value.$set(), "testSet")
    assert.equal(treeNode.testSet, "testSet")
  })

  it("$root", function() {
    delete treeNode.value.$root
    setupValue.call(treeNode)
    assert.equal(treeNode.value.$root, treeNode.value)
    assert.equal(treeNode.children.a.value.$root, treeNode.value)
    assert.equal(treeNode.value.a.b.c.$root, treeNode.value)
  })

  it("properties' getter", function() {
    delete treeNode.value
    let oldGet = Object.getOwnPropertyDescriptor(ReactifyObjectTreeNode.module.prototype, "getter")
    Object.defineProperty(ReactifyObjectTreeNode.module.prototype, "getter", {
      get: function() {
        this.testGetter = "test getter"
        assert.equal(this, treeNode.children.a)
        return "test getter"
      }
    })
    setupValue.call(treeNode)
    assert.equal(treeNode.value.a, "test getter")
    assert.equal(treeNode.children.a.testGetter, "test getter")

    Object.defineProperty(ReactifyObjectTreeNode.module.prototype, "getter", oldGet)
  })

  it("properties' setter", function() {
    delete treeNode.value
    let oldSet = Object.getOwnPropertyDescriptor(ReactifyObjectTreeNode.module.prototype, "setter")
    Object.defineProperty(ReactifyObjectTreeNode.module.prototype, "setter", {
      set: function(value) {
        this.testSetter = value
        assert.equal(value, "test setter")
        assert.equal(this, treeNode.children.a)
      }
    })
    setupValue.call(treeNode)
    treeNode.value.a = "test setter"
    assert.equal(treeNode.children.a.testSetter, "test setter")

    Object.defineProperty(ReactifyObjectTreeNode.module.prototype, "setter", oldSet)
  })
  /** Actually testing the same function like setupObjectView.test.js, end here */

  it("this.object is undefined, this.value should be undefined as well", function() {
    let object = {}
    let config = { a: { properties: {} }, b: {} }
    let treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    delete treeNode.children.a.value
    setupValue(treeNode)
    assert.equal(treeNode.children.a.value, undefined)
  })

  it("this.object is not undefined, yet the value of it, will rejected by validated", function() {
    let object = { a: "invalid value" }
    let config = { a: {}, b: {} }
    let treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    delete treeNode.children.a.value
    let test = false
    treeNode.children.a.validator = function(value) {
      test = true
      return false
    }
    assert.throws(() => setupValue.call(treeNode.children.a), TypeError)
    assert.equal(test, true)
  })

  it("this.object is not undefined, validation passed, will assign to value", function() {
    let object = { a: "good value" }
    let config = { a: {}, b: {} }
    let treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    delete treeNode.children.a.value
    let test = false
    treeNode.children.a.validator = function(value) {
      test = true
      return value === "good value"
    }
    assert.doesNotThrow(() => setupValue.call(treeNode.children.a), TypeError)
    assert.equal(test, true)
    assert.equal(treeNode.children.a.value, "good value")
    assert.equal(treeNode.value.a, "good value")
  })

  describe("this.config.items exists, will call setupArrayView", function() {
    it("this.value will be an instance of ArrayValueClass", function() {
      let a = treeNode.children.a
      delete a.value
      setupValue.call(a)
      assert.ok(a.value, ArrayValueClass)
    })
  })
})
