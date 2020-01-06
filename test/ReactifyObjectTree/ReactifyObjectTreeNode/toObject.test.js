const _ = require("lodash")
const assert = require("assert")
const ReactifyObjectTreeNode = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const MixType = require("../../helper/mixType")
const toObject = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/toObject")

describe("toObject", function() {
  let config = undefined
  let object = {}
  let treeNode = undefined
  let a = undefined
  let originalObject = {
    a: [
      { b: { c: {}, c2: "I am c2" }, b2: "I am b2" },
      { b: { c: {}, c2: "I am c22" }, b2: "I am b22" }
    ],
    a2: "I am a2"
  }
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
    treeNode = new ReactifyObjectTreeNode(object, config, "$root", null)
    a = treeNode.children.a
  })
  it("object.a[0].b.c, clone = false", function() {
    let res = {}
    object.a[0].b.c2 = {}
    toObject.call(treeNode.children.a.value.getTreeNodeByIndex(0).children.b.children.c2, res, false)
    assert.equal(res.c2, object.a[0].b.c2)
  })
  it("object.a[0].b2, clone = true", function() {
    let res = {}
    object.a[0].b.c2 = {}
    toObject.call(treeNode.children.a.value.getTreeNodeByIndex(0).children.b.children.c2, res, true)
    assert.notEqual(res.c2, object.a[0].b.c2)
  })

  it("object", function() {
    let res = {}
    toObject.call(treeNode, res)
    assert.deepEqual(res.$root, originalObject)
  })

  it("object.a", function() {
    let res = {}
    toObject.call(treeNode.children.a, res)
    assert.deepEqual(res.a, originalObject.a)
  })

  it("object.a2", function() {
    let res = {}
    toObject.call(treeNode.children.a2, res)
    assert.deepEqual(res.a2, originalObject.a2)
  })
  it("object.a[0]", function() {
    let res = {}
    toObject.call(treeNode.children.a.value.getTreeNodeByIndex(0), res)
    assert.deepEqual(res[0], originalObject.a[0])
  })
  it("object.a[1]", function() {
    let res = {}
    toObject.call(treeNode.children.a.value.getTreeNodeByIndex(1), res)
    assert.deepEqual(res[1], originalObject.a[1])
  })
  it("object.a[0].b", function() {
    let res = {}
    toObject.call(treeNode.children.a.value.getTreeNodeByIndex(0).children.b, res)
    assert.deepEqual(res.b, originalObject.a[0].b)
  })
  it("object.a[0].b2", function() {
    let res = {}
    toObject.call(treeNode.children.a.value.getTreeNodeByIndex(0).children.b2, res)
    assert.deepEqual(res.b2, originalObject.a[0].b2)
  })
  it("object.a[0].b.c", function() {
    let res = {}
    toObject.call(treeNode.children.a.value.getTreeNodeByIndex(0).children.b.children.c, res)
    assert.deepEqual(res.c, originalObject.a[0].b.c)
  })
  it("object.a[0].b.c2", function() {
    let res = {}
    toObject.call(treeNode.children.a.value.getTreeNodeByIndex(0).children.b.children.c2, res)
    assert.deepEqual(res.c2, originalObject.a[0].b.c2)
  })
})
