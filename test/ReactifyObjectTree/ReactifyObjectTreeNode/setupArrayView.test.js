const _ = require("lodash")
const assert = require("assert")
const setupArrayView = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/setupArrayView")
const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const mixType = require("../../helper/mixType")
const ArrayValueClass = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ArrayValueClass/ArrayValueClass")

describe("setupArrayView", function() {
  let config = undefined
  let object = {}
  let treeNode = undefined
  let a = undefined
  beforeEach(function() {
    config = {
      a: { items: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } } },
      a2: { mode: "sync" }
    }
    object = {
      a: [
        { b: { c: {}, c2: "I am c2" }, b2: "I am b2" },
        { b: { c: {}, c2: "I am c22" }, b2: "I am b22" }
      ],
      a2: "I am a2"
    }
    setupObject = {}
    treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    a = treeNode.children.a
  })

  it("if treeNode is an instance of ReactifyObjectTreeNode, throw Error", function() {
    for (let i of mixType.getAll()) assert.throws(() => setupArrayView(i))
  })

  it("value will be an instance of ArrayValueClass", function() {
    a.value = undefined
    setupArrayView(a)
    assert.ok(a.value instanceof ArrayValueClass)
  })

  it("value will be injected with $roTree", function() {
    delete a.value
    setupArrayView(a)
    assert.equal(a, a.value.$roTree)
  })

  it("value will be injected with $set, which will be binded to a", function() {
    let test = false
    a.set = function() {
      assert.equal(this, a)
      test = true
    }
    setupArrayView(a)
    a.value.$set()
    assert.equal(test, true)
  })

  it("value will be injected with $root, which refer to $root.value", function() {
    assert.equal(a.value.$root, treeNode.value)
  })
})
