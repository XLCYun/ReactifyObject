const assert = require("assert")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require(
  "../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode"
)

const Default = require("../../../ReactifyObjectTree/entries/default")

describe("default", function() {
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
      assert.throws(() => Default.preprocess(), TypeError, "should throw TypeError, yet did not")
    })

    it("invalid argument", function() {
      assert.throws(() => Default.preprocess(1), TypeError, "should throw TypeError, yet did not")
    })

    it("valid argument", function() {
      assert.doesNotThrow(() => Default.preprocess(propTreeNode), TypeError, "should not throw TypeError, yet did")
    })

    it("config has not default, will set to undefined", function() {
      delete propTreeNode.config.default
      delete propTreeNode.default
      Default.preprocess(propTreeNode)
      assert.equal(propTreeNode.default, undefined)
    })

    it("config has default, it's undefined, will set to undefined", function() {
      propTreeNode.config.default = undefined
      delete propTreeNode.default
      Default.preprocess(propTreeNode)
      assert.equal(propTreeNode.default, undefined)
    })

    it("config has default, it's undefined, will set to undefined", function() {
      propTreeNode.config.default = "test default"
      delete propTreeNode.default
      Default.preprocess(propTreeNode)
      assert.equal(propTreeNode.default, "test default")
    })
  })
})
