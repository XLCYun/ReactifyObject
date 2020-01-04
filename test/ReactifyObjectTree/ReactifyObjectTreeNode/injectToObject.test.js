const deferRequire = require("defer-require")
const assert = require("assert")
const injectToObject = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/injectToObject")
const ReactifyObjectTreeNode = deferRequire(
  "../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode.js"
)

describe("injectToObject", function() {
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

  it("`this` is not root, change nothing", function() {
    let oldValue = treeNode.children.a.value
    injectToObject.call(treeNode.children.a)
    assert.equal(treeNode.children.a.value, oldValue)
  })

  it("`this.object` is not a valid object, should throw TypeError", function() {
    treeNode.object = null
    assert.throws(() => injectToObject.call(treeNode), TypeError)
  })

  it("functionality", function() {
    assert.equal(object.$roTree, treeNode)
    assert.equal(object.a, treeNode.children.a.value)
    assert.equal(object.a2, treeNode.children.a2.value)
    assert.equal(object.a.b, treeNode.children.a.children.b.value)
    assert.equal(object.a.b2, treeNode.children.a.children.b2.value)
    assert.equal(object.a.b.c, treeNode.children.a.children.b.children.c.value)
    assert.equal(object.a.b.c2, treeNode.children.a.children.b.children.c2.value)

    object.$set("a2", "a2")
    assert.equal(object.a2, "a2")

    assert.equal(object.$roTree, treeNode)
  })
})
