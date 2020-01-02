const assert = require("assert")
const MixType = require("../../helper/mixType")
const items = require("../../../ReactifyObjectTree/entries/items")
const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire(
  "../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode.js"
)

describe("items", function() {
  let config = undefined
  let object = {}
  let treeNode = undefined

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
  })

  describe("process", function() {
    it("argument is not ReactifyObjectTreeNode, throw Error", function() {
      for (let i of MixType.getAll()) assert.throws(() => items.process(i))
    })

    it("If items exists, bsonType is empty, will not throw Error", function() {
      treeNode.children.a.bsonType = []
      assert.doesNotThrow(() => items.process(treeNode.children.a))
    })

    it("If items exists, bsonType does not has 'array', throw Error", function() {
      treeNode.children.a.bsonType = "object"
      assert.throws(() => items.process(treeNode.children.a))
    })

    it("If `items` is not object, throw Error", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "object" && e !== undefined)) {
        treeNode.config.items = i
        assert.throws(() => items.process(treeNode))
      }
    })

    describe("If a property is array, and has existed items, will setup items by config", function() {
      it("will setup itemSymbols in treeNode", function() {
        treeNode.children.a.itemSymbols = undefined
        items.process(treeNode.children.a)
        assert.ok(Array.isArray(treeNode.children.a.itemSymbols))
      })

      it("will setup items by config", function() {
        treeNode.children.a.object = [
          { b: { c: {}, c2: "test items: c2" }, b2: "test items: b2" },
          { b: { c: {}, c2: "test items: c2" }, b2: "test items: b2" }
        ]
        treeNode.children.a.itemSymbols = undefined
        treeNode.children.a.children = {}
        items.process(treeNode.children.a)

        assert.ok(Array.isArray(treeNode.children.a.itemSymbols))
        assert.equal(treeNode.children.a.itemSymbols.length, 2)
        assert.equal(Object.getOwnPropertySymbols(treeNode.children.a.children).length, 2)
        for (let symbol of treeNode.children.a.itemSymbols) {
          let itemTreeNode = treeNode.children.a.children[symbol]
          assert.ok(itemTreeNode instanceof ReactifyObjectTreeNode.module)
          assert.equal(itemTreeNode.value.b2, "test items: b2")
          assert.equal(itemTreeNode.value.b.c2, "test items: c2")
        }
      })
    })
  })
})
