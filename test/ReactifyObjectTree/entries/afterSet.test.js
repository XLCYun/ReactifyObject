require("mocha")
const assert = require("assert")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const mixType = require("../../helper/mixType")

const afterSet = require("../../../ReactifyObjectTree/entries/afterSet")

describe("afterSet", function() {
  describe("preprocess", function() {
    describe("functionality", function() {
      let treeNode = undefined
      this.beforeEach(() => {
        treeNode = new ReactifyObjectTreeNode.module(
          {},
          {
            prop: {
              afterSet: function() {
                return "test"
              }
            }
          },
          "",
          null
        )
      })

      it("test returned function's arguement", function() {
        let func = afterSet.preprocess
        for (let i of mixType.getAll().concat([undefined]))
          try {
            func(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "should throw TypeError with not treeNode argument")
          }
        assert.doesNotThrow(() => func(treeNode), TypeError, "pass treeNode, should not throw TypeError")
      })

      it("afterSet is not a function, should throw TypeError", function() {
        let func = afterSet.preprocess
        treeNode.children.prop.config.afterSet = 5
        assert.throws(() => func(treeNode.children.prop), TypeError, "afterSet is not function, should throw TypeError")
      })

      it("afterSet is a function, should not throw TypeError", function() {
        let func = afterSet.preprocess
        assert.doesNotThrow(
          () => func(treeNode.children.prop),
          TypeError,
          "afterSet is a function, should bnot throw TypeError"
        )
      })
    })
  })

  describe("process", function() {
    describe("functionality", function() {
      let treeNode = undefined
      this.beforeEach(() => {
        treeNode = new ReactifyObjectTreeNode.module(
          {},
          {
            prop: {
              afterSet: function() {
                return "test"
              }
            }
          },
          "",
          null
        )
      })

      it("test returned function's arguement", function() {
        let func = afterSet.process
        for (let i of mixType.getAll().concat([undefined]))
          assert.throws(() => func(i), TypeError, "should throw TypeError with not treeNode argument")
        assert.doesNotThrow(() => func(treeNode), TypeError, "pass treeNode, should not throw TypeError")
      })

      it("afterSet will be inject to treeNode", function() {
        let func = afterSet.process
        func(treeNode.children.prop)
        assert.equal(treeNode.children.prop.afterSet(), "test")
      })

      it("afterSet is not existed in config, a default function will be injected, which return undefined", function() {
        treeNode = new ReactifyObjectTreeNode.module({}, { prop: {} }, "", null)
        let func = afterSet.process
        func(treeNode.children.prop)
        assert.ok(typeof treeNode.children.prop.afterSet === "function")
        assert.equal(treeNode.children.prop.afterSet(), undefined)
      })
    })
  })
})
