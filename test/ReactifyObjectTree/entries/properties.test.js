require("mocha")
const assert = require("assert")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require(
  "../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode"
)
const mixType = require("../../helper/mixType")
const noValueSymbol = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/SetupValue/noValueSymbol")
const properties = require("../../../ReactifyObjectTree/entries/properties")

describe("properties", function() {
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
  describe("preprocess", function() {
    it("no argument, should throw Error", function() {
      assert.throws(() => properties.preprocess(), TypeError, "should throw TypeError, yet did not")
    })

    it("invalid argument", function() {
      for (let i of mixType.getAll())
        assert.throws(() => properties.preprocess(i), TypeError, "should throw TypeError, yet did not")
    })

    it("valid argument", function() {
      assert.doesNotThrow(() => properties.preprocess(propTreeNode), TypeError, "should not throw TypeError, yet did")
    })

    it("functionality, treeNode is root, should add a 'object' to bsonType array", function() {
      treeNode.bsonType = undefined
      properties.preprocess(treeNode)
      assert.deepEqual(treeNode.bsonType, ["object"])

      treeNode.bsonType = []
      properties.preprocess(treeNode)
      assert.deepEqual(treeNode.bsonType, ["object"])

      treeNode.bsonType = ["object"]
      properties.preprocess(treeNode)
      assert.deepEqual(treeNode.bsonType, ["object"])
    })

    it("throw Error if there is both properties and items", function() {
      assert.throws(() => new ReactifyObjectTreeNode.module({}, { a: { properties: {}, items: {} } }))
    })
  })
  describe("process", function() {
    it("no argument, should throw Error", function() {
      assert.throws(() => properties.process(), TypeError, "should throw TypeError, yet did not")
    })

    it("invalid argument", function() {
      for (let i of mixType.getAll())
        assert.throws(() => properties.process(i), TypeError, "should throw TypeError, yet did not")
    })

    it("valid argument", function() {
      assert.doesNotThrow(() => properties.process(propTreeNode), TypeError, "should not throw TypeError, yet did")
    })

    it("has properties, but is invalid", function() {
      for (let i of mixType.getAll().filter(e => typeof e !== "object" && e !== undefined)) {
        let old = treeNode.config.properties
        treeNode.config.properties = i
        assert.throws(() => properties.process(treeNode), Error)
        assert.properties = old
      }
    })

    it("has valid properties, but bsonType has not 'object' and it's not empty", function() {
      treeNode.bsonType = ["string"]
      assert.throws(() => properties.process(treeNode), Error)
    })

    it("has valid properties, bsonType it's empty", function() {
      treeNode.bsonType = []
      assert.doesNotThrow(() => properties.process(treeNode), Error)
    })

    it("has valid properties, bsonType has 'object'", function() {
      treeNode.bsonType = ["object"]
      assert.doesNotThrow(() => properties.process(treeNode), Error)
    })

    it("functionality", function() {
      treeNode.object = {
        a: {
          a1: "a1",
          a2: "a2"
        },
        b: {
          b1: "b1",
          b2: "b2"
        }
      }
      treeNode.config.properties = {
        a: {
          type: "object",
          properties: {
            a1: {},
            a2: {}
          }
        },
        b: {
          type: "object",
          properties: {
            b1: {},
            b2: {}
          }
        },
        c: {}
      }
      properties.process(treeNode)
      // ReactifyObjectTreeNode
      assert.ok(treeNode.children.a instanceof ReactifyObjectTreeNode.module)
      assert.ok(treeNode.children.b instanceof ReactifyObjectTreeNode.module)
      assert.ok(treeNode.children.a.children.a1 instanceof ReactifyObjectTreeNode.module)
      assert.ok(treeNode.children.b.children.b1 instanceof ReactifyObjectTreeNode.module)
      // name
      assert.equal(treeNode.children.a.name, "a")
      assert.equal(treeNode.children.b.name, "b")
      assert.equal(treeNode.children.a.children.a1.name, "a1")
      assert.equal(treeNode.children.a.children.a2.name, "a2")
      assert.equal(treeNode.children.b.children.b1.name, "b1")
      assert.equal(treeNode.children.b.children.b2.name, "b2")
      assert.equal(treeNode.children.c.value, undefined)

      // object
      assert.equal(treeNode.children.a.object, treeNode.object.a)
      assert.equal(treeNode.children.b.object, treeNode.object.b)
      assert.equal(treeNode.children.a.children.a1.object, treeNode.object.a.a1)
      assert.equal(treeNode.children.a.children.a2.object, treeNode.object.a.a2)
      assert.equal(treeNode.children.b.children.b1.object, treeNode.object.b.b1)
      assert.equal(treeNode.children.b.children.b2.object, treeNode.object.b.b2)
      assert.equal(treeNode.children.c.object, noValueSymbol)

      // config
      assert.equal(treeNode.children.a.config, treeNode.config.properties.a)
      assert.equal(treeNode.children.b.config, treeNode.config.properties.b)
      assert.equal(treeNode.children.a.children.a1.config, treeNode.config.properties.a.properties.a1)
      assert.equal(treeNode.children.a.children.a2.config, treeNode.config.properties.a.properties.a2)
      assert.equal(treeNode.children.b.children.b1.config, treeNode.config.properties.b.properties.b1)
      assert.equal(treeNode.children.b.children.b2.config, treeNode.config.properties.b.properties.b2)
      assert.equal(treeNode.children.c.config, treeNode.config.properties.c)

      // parent
      assert.equal(treeNode.children.a.parent, treeNode)
      assert.equal(treeNode.children.b.parent, treeNode)
      assert.equal(treeNode.children.c.parent, treeNode)
      assert.equal(treeNode.children.a.children.a1.parent, treeNode.children.a)
      assert.equal(treeNode.children.a.children.a2.parent, treeNode.children.a)
      assert.equal(treeNode.children.b.children.b1.parent, treeNode.children.b)
      assert.equal(treeNode.children.b.children.b2.parent, treeNode.children.b)
    })

    it("object.a === undefined, still will set to undefined", function() {
      let treeNode = new ReactifyObjectTreeNode.module({ a: undefined }, { a: {} }, "root", null)
      assert.equal(treeNode.children.a.value, undefined)
    })

    it("copyFrom.a === undefined, still will set to undefined", function() {
      let treeNode = new ReactifyObjectTreeNode.module({ a: "object a" }, { a: {} }, "root", null, { a: undefined })
      assert.equal(treeNode.children.a.value, undefined)
    })
  })
})
