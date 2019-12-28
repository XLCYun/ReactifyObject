require("mocha")
const assert = require("assert")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const mixType = require("../../helper/mixType")

const bsonType = require("../../../ReactifyObjectTree/entries/bsonType")

describe("bsonType", function() {
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

    it("no argument", function() {
      assert.throws(() => bsonType.preprocess(), TypeError, "should throw TypeError, yet not.")
    })

    it("one invalid argument", function() {
      for (let i of mixType.getAll())
        assert.throws(() => bsonType.preprocess(i), TypeError, "should throw TypeError, yet not.")
    })

    it("one valid argument", function() {
      assert.doesNotThrow(() => bsonType.preprocess(propTreeNode), TypeError, "should not throw Error, but did.")
    })

    it("functionality, config has bsonType, and it's a array", function() {
      delete propTreeNode.bsonType
      propTreeNode.config.bsonType = ["string", "bool"]
      bsonType.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.bsonType, ["string", "bool"])
    })

    it("functionality, config has bsonType, and it's not a array", function() {
      delete propTreeNode.bsonType
      propTreeNode.config.bsonType = "string"
      bsonType.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.bsonType, ["string"])
    })

    it("functionality, config has not bsonType", function() {
      delete propTreeNode.bsonType
      delete propTreeNode.config.bsonType
      bsonType.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.bsonType, [])
    })

    it("functionality, bsonType combine with others existed", function() {
      delete propTreeNode.bsonType
      delete propTreeNode.config.bsonType
      propTreeNode.bsonType = [1, 2, 3]
      propTreeNode.config.bsonType = ["string", "bool"]
      bsonType.preprocess(propTreeNode)
      assert.deepEqual(propTreeNode.bsonType, [1, 2, 3, "string", "bool"])
    })
  })

  describe("process", function() {
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

    it("no argument", function() {
      assert.throws(() => bsonType.process(), TypeError, "should throw TypeError, yet not.")
    })

    it("valid argument", function() {
      assert.doesNotThrow(() => bsonType.process(propTreeNode), TypeError, "should not throw TypeError, yet did.")
    })

    it("config has a validator, yet not function", function() {
      propTreeNode.config.validator = 0
      assert.throws(() => bsonType.process(propTreeNode), TypeError, "should throw TypeError, yet not")
    })

    it("config has a validator, and it is a function", function() {
      propTreeNode.config.validator = function() {
        return "test"
      }
      assert.doesNotThrow(() => bsonType.process(propTreeNode), TypeError, "should not throw TypeError, yet did")
      assert.equal(propTreeNode.validator(), "test")
      assert.equal(propTreeNode.validator, propTreeNode.config.validator)
    })

    it("config has not validator, use bsonType to generate a validator", function() {
      propTreeNode.bsonType = ["string", "bool"]
      bsonType.process(propTreeNode)
      assert.ok(propTreeNode.validator("hello"))
      assert.ok(propTreeNode.validator(""))
      assert.ok(propTreeNode.validator(true))
      assert.ok(propTreeNode.validator(false))
      assert.ok(!propTreeNode.validator(new Date()))
      assert.ok(!propTreeNode.validator(NaN))
    })

    it("config has a compare, yet not function", function() {
      propTreeNode.config.compare = 0
      assert.throws(() => bsonType.process(propTreeNode), TypeError, "should throw TypeError, yet not.")
    })

    it("config has a validator, and it is a function, should attach to treeNode", function() {
      propTreeNode.config.compare = function() {
        return "test"
      }
      assert.doesNotThrow(() => bsonType.process(propTreeNode), TypeError, "should not throw TypeError, yet did.")
      assert.equal(propTreeNode.compare, propTreeNode.config.compare)
      assert.equal(propTreeNode.compare(), "test")
    })

    it("config has not compare, use bsonType to generate a validator", function() {
      propTreeNode.bsonType = ["string", "bool"]
      bsonType.process(propTreeNode)
      assert.ok(propTreeNode.compare("hello", "hello"))
      assert.ok(propTreeNode.compare("", ""))
      assert.ok(!propTreeNode.compare("hello", ""))
      assert.ok(!propTreeNode.compare("hello", true))
      assert.ok(!propTreeNode.compare("hello", false))
      assert.ok(!propTreeNode.compare("hello", NaN))
      assert.ok(!propTreeNode.compare("hello", new Object()))
      assert.ok(propTreeNode.compare(true, true))
      assert.ok(!propTreeNode.compare(true, false))
      assert.ok(propTreeNode.compare(false, false))
    })
  })
})
