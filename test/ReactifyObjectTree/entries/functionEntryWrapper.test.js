require("mocha")
const assert = require("assert")
const functionEntryWrapper = require("../../../ReactifyObjectTree/entries/functionEntryWrapper")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../../../ReactifyObjectTree/ReactifyObjectTreeNode")
const mixType = require("../../helper/mixType")

describe("functionEntryWrapper", function() {
  describe("preprocess", function() {
    describe("argument", function() {
      it("no argument", function() {
        try {
          functionEntryWrapper.preprocess()
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
      })

      it("invalid argument", function() {
        for (let i of mixType.getAll().filter(e => typeof e !== "string"))
          try {
            functionEntryWrapper.preprocess(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError)
          }
      })
    })

    describe("functionality", function() {
      let treeNode = undefined
      this.beforeEach(() => {
        treeNode = new ReactifyObjectTreeNode.module(
          {},
          {
            prop: {
              testFunction: function() {
                return "test"
              },
              testVariable: 5
            }
          },
          "",
          null
        )
      })

      it("test returned function's arguement", function() {
        let func = functionEntryWrapper.preprocess("testFunction")
        for (let i of mixType.getAll().concat([undefined]))
          try {
            func(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "should throw TypeError with not treeNode argument")
          }
        assert.doesNotThrow(() => func(treeNode), TypeError, "pass treeNode, should not throw TypeError")
      })

      it("testVariable is not a function, should throw TypeError", function() {
        let func = functionEntryWrapper.preprocess("testVariable")
        assert.throws(
          () => func(treeNode.children.prop),
          TypeError,
          "testVariable is not function, should throw TypeError"
        )
      })

      it("testFunction is a function, should not throw TypeError", function() {
        let func = functionEntryWrapper.preprocess("testFunction")
        assert.doesNotThrow(
          () => func(treeNode.children.prop),
          TypeError,
          "testFunction is a function, should bnot throw TypeError"
        )
      })
    })
  })

  describe("process", function() {
    describe("argument", function() {
      it("no argument", function() {
        try {
          functionEntryWrapper.process()
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
      })

      it("invalid argument", function() {
        for (let i of mixType.getAll().filter(e => typeof e !== "string"))
          try {
            functionEntryWrapper.process(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError)
          }
      })
    })

    describe("functionality", function() {
      let treeNode = undefined
      this.beforeEach(() => {
        treeNode = new ReactifyObjectTreeNode.module(
          {},
          {
            prop: {
              testFunction: function() {
                return "test"
              },
              testVariable: 5
            }
          },
          "",
          null
        )
      })

      it("test returned function's arguement", function() {
        let func = functionEntryWrapper.process("testFunction")
        for (let i of mixType.getAll().concat([undefined]))
          assert.throws(() => func(i), TypeError, "should throw TypeError with not treeNode argument")
        assert.doesNotThrow(() => func(treeNode), TypeError, "pass treeNode, should not throw TypeError")
      })

      it("testFunction will be inject to treeNode", function() {
        let func = functionEntryWrapper.process("testFunction")
        func(treeNode.children.prop)
        assert.equal(treeNode.children.prop.testFunction(), "test")
      })

      it("entry is not existed in config, a default function will be injected, which return undefined", function() {
        let func = functionEntryWrapper.process("notExistedConfigEntryName")
        func(treeNode.children.prop)
        assert.ok(typeof treeNode.children.prop.notExistedConfigEntryName === "function")
        assert.equal(treeNode.children.prop.notExistedConfigEntryName(), undefined)
      })
    })
  })
})
