require("mocha")
const assert = require("assert")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../../../ReactifyObjectTree/ReactifyObjectTreeNode")
const mixType = require("../../helper/mixType")

const type = require("../../../ReactifyObjectTree/entries/type")

describe("type", function() {
  describe("preprocess", function() {
    let treeNode = undefined
    let propTreeNode = undefined
    this.beforeEach(() => {
      treeNode = new ReactifyObjectTreeNode.module(
        {},
        {
          prop: {}
        },
        "",
        null
      )
      propTreeNode = treeNode.children.prop
    })

    it("no argument, should throw Error", function() {
      assert.throws(() => type.preprocess(), TypeError, "should throw TypeError, yet did not")
    })

    it("invalid argument", function() {
      assert.throws(() => type.preprocess(1), TypeError, "should throw TypeError, yet did not")
    })

    it("valid argument", function() {
      assert.doesNotThrow(() => type.preprocess(propTreeNode), TypeError, "should not throw TypeError, yet did")
    })

    it("config has not type", function() {
      delete propTreeNode.config.type
      delete propTreeNode.type
      type.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.type, [])
      assert.deepEqual(propTreeNode.bsonType, [])
    })

    it("config has not type, yet treeNode.type already has content", function() {
      delete propTreeNode.config.type
      delete propTreeNode.type
      propTreeNode.type = ["object", "array"]
      type.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.type, ["object", "array"])
      assert.deepEqual(propTreeNode.bsonType, ["object", "array"])
    })

    it("config has not type, yet treeNode.bsonType, treeNode.type already has content", function() {
      delete propTreeNode.config.type
      delete propTreeNode.type
      propTreeNode.bsonType = ["array", "string"]
      propTreeNode.type = ["object", "array"]
      type.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.type, ["object", "array"])
      assert.equal(propTreeNode.bsonType.length, 3)
      assert.ok(propTreeNode.bsonType.includes("object"))
      assert.ok(propTreeNode.bsonType.includes("array"))
      assert.ok(propTreeNode.bsonType.includes("string"))
    })

    it("config has not type, yet treeNode.bsonType already has content", function() {
      delete propTreeNode.config.type
      delete propTreeNode.type
      propTreeNode.bsonType = ["array", "string"]
      type.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.bsonType, ["array", "string"])
    })

    it("config has type, yet invalid", function() {
      delete propTreeNode.config.type
      delete propTreeNode.type
      propTreeNode.config.type = [0, NaN, "notGoodType"]
      assert.throws(() => type.preprocess(propTreeNode), Error, "should throw TypeError, yet not")
    })

    it("config has type, convert to equal bsonType", function() {
      const validType = ["object", "array", "number", "boolean", "string", "null"]
      const equalBsonType = ["object", "array", "double", "bool", "string", "null"]
      delete propTreeNode.config.type
      delete propTreeNode.type
      propTreeNode.config.type = validType
      type.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.type, equalBsonType)

      for (let i = 0; i < validType.length; i++) {
        delete propTreeNode.config.type
        delete propTreeNode.type
        propTreeNode.config.type = validType[i]
        type.preprocess(propTreeNode)
        assert.deepEqual(propTreeNode.type, [equalBsonType[i]])
      }
    })

    it("config has type, treeNode has type and bsonType", function() {
      delete propTreeNode.config.type
      delete propTreeNode.type
      propTreeNode.type = [1, 2, 3]
      propTreeNode.bsonType = [2, 4, 5, 6]
      propTreeNode.config.type = ["string", "array"]
      type.preprocess(propTreeNode)
      assert.equal(propTreeNode.type.length, 5)
      assert.ok(propTreeNode.type.includes(1))
      assert.ok(propTreeNode.type.includes(2))
      assert.ok(propTreeNode.type.includes(3))
      assert.ok(propTreeNode.type.includes("string"))
      assert.ok(propTreeNode.type.includes("array"))

      assert.equal(propTreeNode.bsonType.length, 8)
      assert.ok(propTreeNode.bsonType.includes(1))
      assert.ok(propTreeNode.bsonType.includes(2))
      assert.ok(propTreeNode.bsonType.includes(3))
      assert.ok(propTreeNode.bsonType.includes(4))
      assert.ok(propTreeNode.bsonType.includes(5))
      assert.ok(propTreeNode.bsonType.includes(6))
      assert.ok(propTreeNode.bsonType.includes("string"))
      assert.ok(propTreeNode.bsonType.includes("array"))
    })
  })

  describe("process", function() {
    it("process", function() {
      type.process()
    })
  })
})
