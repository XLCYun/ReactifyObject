const assert = require("assert")
const ReactifyObjectTreeNode = require("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const MixType = require("../../../helper/mixType")
const rollBackPatchItem = require("../../../../ReactifyObjectTree/revision/rollbackPatchItem")
const op = require("../../../../ReactifyObjectTree/revision/op")
describe("rollBackPatchItem", function() {
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

  describe("generatePatchItemObject", function() {
    it("functionality", function() {
      assert.deepEqual(rollBackPatchItem.generatePatchItemObject(treeNode.children.a, "new value", "op"), {
        path: treeNode.children.a.path,
        value: "new value",
        op: "op"
      })
    })
  })

  describe("validatePatchItemObject", function() {
    it("obj is not object, throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "object" || e === null))
        assert.throws(e => rollBackPatchItem.validatePatchItemObject(i), TypeError)
    })
    it("obj.path is not string, throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "string"))
        assert.throws(
          e => rollBackPatchItem.validatePatchItemObject({ path: i, value: "", op: op.enum.ADD }),
          TypeError
        )
      assert.throws(e => rollBackPatchItem.validatePatchItemObject({ value: "", op: op.enum.ADD }), TypeError)
    })
    it("obj.value does not exist, throw TypeError", function() {
      assert.throws(e => rollBackPatchItem.validatePatchItemObject({ path: "", op: op.enum.ADD }), TypeError)
    })
    it("obj.value can be a specific undefined", function() {
      assert.doesNotThrow(
        e => rollBackPatchItem.validatePatchItemObject({ path: "", value: undefined, op: op.enum.ADD }),
        TypeError
      )
    })
    it("obj.op is depend on op.array", function() {
      for (let i of op.array)
        assert.doesNotThrow(
          e => rollBackPatchItem.validatePatchItemObject({ path: "", value: undefined, op: i }),
          TypeError
        )
      for (let i of MixType.getAll())
        assert.throws(e => rollBackPatchItem.validatePatchItemObject({ path: "", value: undefined, op: i }), TypeError)
    })
  })

  describe("generatePatchItem", function() {
    it("tree node is leaf, test generated patch item", function() {
      let res = []
      rollBackPatchItem.generatePatchItem(res, "new value", treeNode.children.a.children.b)
      assert.deepEqual(res[0], { path: ".a.b", value: "new value", op: op.enum.ADD })
    })
    it("tree node is array, base is not array, will directly record base's value", function() {
      let res = []
      rollBackPatchItem.generatePatchItem(res, { a: "new value" }, arrayTreeNode.children.a)
      assert.deepEqual(res[0], { path: ".a", value: { a: "new value" }, op: op.enum.ADD })
    })
    it("tree node is array, base is not object, will directly record base's value", function() {
      let res = []
      rollBackPatchItem.generatePatchItem(res, "new value", treeNode.children.a)
      assert.deepEqual(res[0], { path: ".a", value: "new value", op: op.enum.ADD })
    })
    it("Diffiences exists inside an object", function() {
      let base = { a: { b: "new b", c: "new c" }, a2: { b2: "new b2", c2: "new c2" } }
      let res = []
      rollBackPatchItem.generatePatchItem(res, base, treeNode)
      assert.deepEqual(res[0], { path: ".a.b", value: "new b", op: op.enum.ADD })
      assert.deepEqual(res[1], { path: ".a.c", value: "new c", op: op.enum.ADD })
      assert.deepEqual(res[2], { path: ".a2.b2", value: "new b2", op: op.enum.ADD })
      assert.deepEqual(res[3], { path: ".a2.c2", value: "new c2", op: op.enum.ADD })
    })
    it("Differences exists inside an array's items", function() {
      let base = {
        a: [
          { b: { c2: "new c2 index 0", c: {} }, b2: "new b2 index 0" },
          { b: { c2: "new c2 index 1", c: {} }, b2: "new b2 index 1" }
        ],
        a2: "I am a2"
      }
      let res = []
      rollBackPatchItem.generatePatchItem(res, base, arrayTreeNode)
      assert.deepEqual(res[0], { path: ".a.0.b.c2", value: "new c2 index 0", op: op.enum.ADD })
      assert.deepEqual(res[1], { path: ".a.0.b2", value: "new b2 index 0", op: op.enum.ADD })
      assert.deepEqual(res[2], { path: ".a.1.b.c2", value: "new c2 index 1", op: op.enum.ADD })
      assert.deepEqual(res[3], { path: ".a.1.b2", value: "new b2 index 1", op: op.enum.ADD })
    })
    it("array push new items", function() {
      let base = {
        a: [
          { b: { c: {}, c2: "I am c2" }, b2: "I am b2" },
          { b: { c: {}, c2: "I am c22" }, b2: "I am b22" },
          { b: { c: {}, c2: "new index 2" }, b2: "new index 2" },
          { b: { c: {}, c2: "new index 3" }, b2: "new index 3" }
        ],
        a2: "I am a2"
      }
      let res = []
      rollBackPatchItem.generatePatchItem(res, base, arrayTreeNode)
      assert.deepEqual(res[0], {
        path: ".a.2",
        value: { b: { c: {}, c2: "new index 2" }, b2: "new index 2" },
        op: op.enum.ADD
      })
      assert.deepEqual(res[1], {
        path: ".a.3",
        value: { b: { c: {}, c2: "new index 3" }, b2: "new index 3" },
        op: op.enum.ADD
      })
    })
    it("array pop items", function() {
      let base = {
        a: [{ b: { c: {}, c2: "I am c2" }, b2: "I am b2" }],
        a2: "I am a2"
      }
      let res = []
      rollBackPatchItem.generatePatchItem(res, base, arrayTreeNode)
      assert.deepEqual(res[0], {
        path: ".a.1",
        value: { b: { c: {}, c2: "I am c22" }, b2: "I am b22" },
        op: op.enum.REMOVE
      })
    })
  })
})
