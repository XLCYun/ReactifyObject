require("mocha")
const assert = require("assert")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../../../ReactifyObjectTree/ReactifyObjectTreeNode")
const mixType = require("../../helper/mixType")

const afterUpdate = require("../../../ReactifyObjectTree/entries/afterUpdate")

describe("afterUpdate", function() {
  describe("preprocess", function() {
    describe("functionality", function() {
      let treeNode = undefined
      this.beforeEach(() => {
        treeNode = new ReactifyObjectTreeNode.module(
          {},
          {
            prop: {
              afterUpdate: function() {
                return "test"
              }
            }
          },
          "",
          null
        )
      })

      it("test returned function's arguement", function() {
        let func = afterUpdate.preprocess
        for (let i of mixType.getAll().concat([undefined]))
          try {
            func(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "should throw TypeError with not treeNode argument")
          }
        assert.doesNotThrow(() => func(treeNode), TypeError, "pass treeNode, should not throw TypeError")
      })

      it("afterUpdate is not a function, should throw TypeError", function() {
        let func = afterUpdate.preprocess
        treeNode.children.prop.config.afterUpdate = 5
        assert.throws(() => func(treeNode.children.prop), TypeError, "afterUpdate is not function, should throw TypeError")
      })

      it("afterUpdate is a function, should not throw TypeError", function() {
        let func = afterUpdate.preprocess
        assert.doesNotThrow(
          () => func(treeNode.children.prop),
          TypeError,
          "afterUpdate is a function, should bnot throw TypeError"
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
              afterUpdate: function() {
                return "test"
              }
            }
          },
          "",
          null
        )
      })

      it("test returned function's arguement", function() {
        let func = afterUpdate.process
        for (let i of mixType.getAll().concat([undefined]))
          assert.throws(() => func(i), TypeError, "should throw TypeError with not treeNode argument")
        assert.doesNotThrow(() => func(treeNode), TypeError, "pass treeNode, should not throw TypeError")
      })

      it("afterUpdate will be inject to treeNode", function() {
        let func = afterUpdate.process
        func(treeNode.children.prop)
        assert.equal(treeNode.children.prop.afterUpdate(), "test")
      })

      it("afterUpdate is not existed in config, a default function will be injected, which return undefined", function() {
        treeNode = new ReactifyObjectTreeNode.module({}, { prop: {} }, "", null)
        let func = afterUpdate.process
        func(treeNode.children.prop)
        assert.ok(typeof treeNode.children.prop.afterUpdate === "function")
        assert.equal(treeNode.children.prop.afterUpdate(), undefined)
      })
    })
  })
})
