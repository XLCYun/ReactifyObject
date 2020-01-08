const assert = require("assert")
const ReactifyObjectTreeNode = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const getTreeNodeByPath = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/getTreeNodeByPath")
describe("getTreeNodeByPath", function() {
  let config = {
    a: { properties: { b: {}, c: {} } },
    a2: { properties: { b2: {}, c2: {} } }
  }
  let object = {}
  let object2 = {}
  let treeNode = undefined
  let treeNode2 = undefined
  let arrayConfig = undefined
  let arrayObject = undefined
  let arrayTreeNode = undefined
  beforeEach(function() {
    object = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    object2 = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    treeNode = new ReactifyObjectTreeNode(object, config, "", null)
    treeNode2 = new ReactifyObjectTreeNode(object2, config, "", null)

    arrayConfig = {
      a: { items: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } } },
      a2: { mode: "sync" }
    }
    arrayObject = {
      a: [
        { b: { c: {}, c2: "I am c2" }, b2: "I am b2" },
        { b: { c: {}, c2: "I am c22" }, b2: "I am b22" }
      ],
      a2: "I am a2"
    }
    arrayTreeNode = new ReactifyObjectTreeNode(arrayObject, arrayConfig, "", null)
    a = arrayTreeNode.children.a
  })

  it("empty path array, return itself", function() {
    assert.equal(getTreeNodeByPath.call(treeNode, []), treeNode)
  })

  it("get property from a leaf, will return undefined", function() {
    assert.equal(undefined, getTreeNodeByPath.call(treeNode, ["a", "b", "notExists"]))
    assert.equal(undefined, getTreeNodeByPath.call(treeNode, ["a", "c", "notExists"]))
    assert.equal(undefined, getTreeNodeByPath.call(treeNode, ["a2", "b2", "notExists"]))
    assert.equal(undefined, getTreeNodeByPath.call(treeNode, ["a2", "c2", "notExists"]))
  })

  it("get element from array, yet index is invalid, will return undefined", function() {
    assert.equal(undefined, getTreeNodeByPath.call(arrayTreeNode, ["a", "notGoodIndex"]))
    assert.equal(undefined, getTreeNodeByPath.call(arrayTreeNode, ["a", "notGoodIndex", "other"]))
  })

  it("get element from array, yet index is not in [0, length), return undefined", function() {
    assert.equal(undefined, getTreeNodeByPath.call(arrayTreeNode, ["a", "-10"]))
    assert.equal(undefined, getTreeNodeByPath.call(arrayTreeNode, ["a", "3", "other"]))
  })

  it("get tree node from object, yet property is not exist, return undefined", function() {
    assert.equal(undefined, getTreeNodeByPath.call(treeNode, ["a", "notExists"]))
    assert.equal(undefined, getTreeNodeByPath.call(treeNode, ["a2", "notExists"]))
  })

  it("get tree node from object", function() {
    assert.equal(treeNode.children.a.children.b, getTreeNodeByPath.call(treeNode, ["a", "b"]))
    assert.equal(treeNode.children.a.children.c, getTreeNodeByPath.call(treeNode, ["a", "c"]))
    assert.equal(treeNode.children.a2.children.b2, getTreeNodeByPath.call(treeNode, ["a2", "b2"]))
    assert.equal(treeNode.children.a2.children.c2, getTreeNodeByPath.call(treeNode, ["a2", "c2"]))
  })

  it("get tree node from array", function() {
    assert.equal(arrayTreeNode.children.a.value[0].$roTree.children.b, getTreeNodeByPath.call(arrayTreeNode, ["a", "0", "b"]))
    assert.equal(arrayTreeNode.children.a.value[0].$roTree.children.b2, getTreeNodeByPath.call(arrayTreeNode, ["a", "0", "b2"]))
    assert.equal(arrayTreeNode.children.a.value[0].$roTree.children.b.children.c, getTreeNodeByPath.call(arrayTreeNode, ["a", "0", "b", "c"]))
    assert.equal(arrayTreeNode.children.a.value[0].$roTree.children.b.children.c2, getTreeNodeByPath.call(arrayTreeNode, ["a", "0", "b", "c2"]))
    assert.equal(arrayTreeNode.children.a.value[1].$roTree.children.b, getTreeNodeByPath.call(arrayTreeNode, ["a", "1", "b"]))
    assert.equal(arrayTreeNode.children.a.value[1].$roTree.children.b2, getTreeNodeByPath.call(arrayTreeNode, ["a", "1", "b2"]))
    assert.equal(arrayTreeNode.children.a.value[1].$roTree.children.b.children.c, getTreeNodeByPath.call(arrayTreeNode, ["a", "1", "b", "c"]))
    assert.equal(arrayTreeNode.children.a.value[1].$roTree.children.b.children.c2, getTreeNodeByPath.call(arrayTreeNode, ["a", "1", "b", "c2"]))
  })
})
