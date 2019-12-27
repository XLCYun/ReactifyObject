require("mocha")
const assert = require("assert")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../../../ReactifyObjectTree/ReactifyObjectTreeNode")
const mixType = require("../../helper/mixType")

const mode = require("../../../ReactifyObjectTree/entries/mode")

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

    it("no argument, should throw Error", function() {
      assert.throws(() => mode.preprocess(), TypeError, "should throw TypeError, yet did not")
    })

    it("invalid argument", function() {
      assert.throws(() => mode.preprocess(1), TypeError, "should throw TypeError, yet did not")
    })

    it("valid argument", function() {
      assert.doesNotThrow(() => mode.preprocess(propTreeNode), TypeError, "should not throw TypeError, yet did")
    })

    it("config has not mode", function() {
      delete propTreeNode.config.mode
      delete propTreeNode.mode
      assert.doesNotThrow(() => mode.preprocess(propTreeNode))
    })

    it("config has mode, yet not 'sync' or 'async'", function() {
      delete propTreeNode.config.mode
      delete propTreeNode.mode
      propTreeNode.config.mode = 0
      assert.throws(() => mode.preprocess(propTreeNode), TypeError, "should throw TypeError, yet did not")
      propTreeNode.config.mode = "async "
      assert.throws(() => mode.preprocess(propTreeNode), Error, "should throw Error, yet did not")
    })

    it("config has mode, 'sync' or 'async'", function() {
      delete propTreeNode.config.mode
      delete propTreeNode.mode
      propTreeNode.config.mode = "sync"
      assert.doesNotThrow(() => mode.preprocess(propTreeNode), TypeError, "should not throw Error, yet did")
      propTreeNode.config.mode = "async"
      assert.doesNotThrow(() => mode.preprocess(propTreeNode), TypeError, "should not throw Error, yet did")
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

    it("no argument, should throw Error", function() {
      assert.throws(() => mode.process(), TypeError, "should throw TypeError, yet did not")
    })

    it("invalid argument", function() {
      assert.throws(() => mode.process(1), TypeError, "should throw TypeError, yet did not")
    })

    it("valid argument", function() {
      assert.doesNotThrow(() => mode.preprocess(propTreeNode), TypeError, "should not throw TypeError, yet did")
    })

    it("config has not mode, set to default 'sync'", function() {
      delete propTreeNode.config.mode
      delete propTreeNode.mode
      mode.preprocess(propTreeNode)
      assert.doesNotThrow(() => mode.process(propTreeNode))
      assert.equal(propTreeNode.mode, "sync")
    })

    it("config has mode, 'sync' or 'async'", function() {
      delete propTreeNode.config.mode
      delete propTreeNode.mode
      propTreeNode.config.mode = "sync"
      assert.doesNotThrow(() => mode.preprocess(propTreeNode), TypeError, "should not throw Error, yet did")
      mode.process(propTreeNode)
      assert.equal(propTreeNode.mode, "sync")
      propTreeNode.config.mode = "async"
      assert.doesNotThrow(() => mode.preprocess(propTreeNode), TypeError, "should not throw Error, yet did")
      mode.process(propTreeNode)
      assert.equal(propTreeNode.mode, "async")
    })
  })
})
