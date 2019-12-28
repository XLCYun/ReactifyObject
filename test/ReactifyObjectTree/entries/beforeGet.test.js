require("mocha")
const assert = require("assert")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const mixType = require("../../helper/mixType")

const beforeGet = require("../../../ReactifyObjectTree/entries/beforeGet")

describe("beforeGet", function() {
  describe("preprocess", function() {
    describe("functionality", function() {
      let treeNode = undefined
      this.beforeEach(() => {
        treeNode = new ReactifyObjectTreeNode.module(
          {},
          {
            prop: {
              beforeGet: function() {
                return "test"
              }
            }
          },
          "",
          null
        )
      })

      it("test returned function's arguement", function() {
        let func = beforeGet.preprocess
        for (let i of mixType.getAll().concat([undefined]))
          try {
            func(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "should throw TypeError with not treeNode argument")
          }
        assert.doesNotThrow(() => func(treeNode), TypeError, "pass treeNode, should not throw TypeError")
      })

      it("beforeGet is not a function, should throw TypeError", function() {
        let func = beforeGet.preprocess
        treeNode.children.prop.config.beforeGet = 5
        assert.throws(() => func(treeNode.children.prop), TypeError, "beforeGet is not function, should throw TypeError")
      })

      it("beforeGet is a function, should not throw TypeError", function() {
        let func = beforeGet.preprocess
        assert.doesNotThrow(
          () => func(treeNode.children.prop),
          TypeError,
          "beforeGet is a function, should bnot throw TypeError"
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
              beforeGet: function() {
                return "test"
              }
            }
          },
          "",
          null
        )
      })

      it("test returned function's arguement", function() {
        let func = beforeGet.process
        for (let i of mixType.getAll().concat([undefined]))
          assert.throws(() => func(i), TypeError, "should throw TypeError with not treeNode argument")
        assert.doesNotThrow(() => func(treeNode), TypeError, "pass treeNode, should not throw TypeError")
      })

      it("beforeGet will be inject to treeNode", function() {
        let func = beforeGet.process
        func(treeNode.children.prop)
        assert.equal(treeNode.children.prop.beforeGet(), "test")
      })

      it("beforeGet is not existed in config, a default function will be injected, which return undefined", function() {
        treeNode = new ReactifyObjectTreeNode.module({}, { prop: {} }, "", null)
        let func = beforeGet.process
        func(treeNode.children.prop)
        assert.ok(typeof treeNode.children.prop.beforeGet === "function")
        assert.equal(treeNode.children.prop.beforeGet(), undefined)
      })
    })
  })
})
