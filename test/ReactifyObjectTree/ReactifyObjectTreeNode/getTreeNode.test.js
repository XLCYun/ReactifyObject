const MixType = require("../../helper/mixType")
const _ = require("lodash")
const getTreeNode = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/getTreeNode")
const assert = require("assert")
const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")

describe("getTreeNode", function() {
  let config = undefined
  let object = {}
  let treeNode = undefined
  let a = undefined
  beforeEach(function() {
    config = {
      a: { items: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } } },
      a2: { mode: "sync" },
      a3: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } }
    }
    object = {
      a: [
        { b: { c: {}, c2: "I am c2" }, b2: "I am b2" },
        { b: { c: {}, c2: "I am c22" }, b2: "I am b22" }
      ],
      a2: "I am a2",
      a3: { b: { c: {}, c2: "I am c2 in a3" }, b2: "I am b2 in a3" }
    }
    setupObject = {}
    treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    a = treeNode.children.a
  })

  it("If object is not an object, throw TypeError", function() {
    for (let i of MixType.getAll().filter(e => typeof e !== "object" || e === null))
      assert.throws(() => getTreeNode(i), TypeError)
  })

  it("If object is ReactifyObjectTreeNode, return it", function() {
    assert.equal(getTreeNode(treeNode), treeNode)
    assert.equal(getTreeNode(treeNode.children.a), treeNode.children.a)
    assert.equal(getTreeNode(treeNode.children.a2), treeNode.children.a2)
  })

  it("If object.$roTree is not an instance of ReactifyObjectTreeNode, throw TypeError", function() {
    for (let i of MixType.getAll()) assert.throws(() => getTreeNode({ $roTree: i }))
  })

  it("If object.$roTree.config does not have `items` and `properties`(i.e. is leaf), throw Error", function() {
    assert.throws(() => getTreeNode({ $roTree: treeNode.children.a2 }))
  })

  it("If object.$roTree.config has `items` but index is not number, throw Error", function() {
    assert.throws(() => getTreeNode(treeNode.children.a.value, "string index"))
  })

  it("If object.$roTree.config has properties, but index is not string, throw error", function() {
    assert.throws(() => getTreeNode(treeNode.children.a3.value, 0))
  })

  it("get tree node of a object's property by name", function() {
    assert.equal(getTreeNode(treeNode.value, "a"), treeNode.children.a)
    assert.equal(getTreeNode(treeNode.value, "a2"), treeNode.children.a2)
    assert.equal(getTreeNode(treeNode.value, "a3"), treeNode.children.a3)
    assert.equal(getTreeNode(treeNode.children.a3.value, "b"), treeNode.children.a3.children.b)
    assert.equal(getTreeNode(treeNode.children.a3.value, "b2"), treeNode.children.a3.children.b2)
    assert.equal(getTreeNode(treeNode.children.a3.children.b.value, "c"), treeNode.children.a3.children.b.children.c)
    assert.equal(getTreeNode(treeNode.children.a3.children.b.value, "c2"), treeNode.children.a3.children.b.children.c2)

    assert.equal(getTreeNode(object, "a"), treeNode.children.a)
    assert.equal(getTreeNode(object, "a2"), treeNode.children.a2)
    assert.equal(getTreeNode(object, "a3"), treeNode.children.a3)
    assert.equal(getTreeNode(object.a3, "b"), treeNode.children.a3.children.b)
    assert.equal(getTreeNode(object.a3, "b2"), treeNode.children.a3.children.b2)
    assert.equal(getTreeNode(object.a3.b, "c"), treeNode.children.a3.children.b.children.c)
    assert.equal(getTreeNode(object.a3.b, "c2"), treeNode.children.a3.children.b.children.c2)
  })

  it("get tree node by a array's index", function() {
    let a = treeNode.children.a
    let first = a.children[a.itemSymbols[0]]
    let second = a.children[a.itemSymbols[1]]
    assert.equal(first, getTreeNode(treeNode.children.a.value, 0))
    assert.equal(second, getTreeNode(treeNode.children.a.value, 1))
    assert.equal(first, getTreeNode(object.a, 0))
    assert.equal(second, getTreeNode(object.a, 1))
  })

  it("If target tree node is not exists, throw ReferenceError", function() {
    assert.throws(() => getTreeNode(treeNode.value, "notExists"), ReferenceError)
    assert.throws(() => getTreeNode(object, "notExists"), ReferenceError)
    assert.throws(() => getTreeNode(object.a, -1), ReferenceError)
    assert.throws(() => getTreeNode(treeNode.children.a.value, -1), ReferenceError)
    assert.throws(() => getTreeNode(object.a, 3), ReferenceError)
    assert.throws(() => getTreeNode(treeNode.children.a.value, 3), ReferenceError)
  })
})
