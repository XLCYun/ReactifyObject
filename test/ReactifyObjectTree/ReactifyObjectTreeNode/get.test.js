const _ = require("lodash")
const assert = require("assert")
const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const get = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/get")

describe("get.js", function() {
  describe("sync get", function() {
    let config = {
      a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
      a2: { mode: "sync" }
    }
    let object = {}
    let treeNode = undefined

    beforeEach(function() {
      object = { a: { b: { c: {}, c2: "I am c2" }, b2: "I am b2" }, a2: "I am a2" }
      setupObject = {}
      treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    })

    it("beforeGet and afterGet bind to injected object", function() {
      let beforeGet = false
      let afterGet = false
      treeNode.beforeGet = function() {
        beforeGet = true
        assert.equal(this, treeNode.object)
      }
      treeNode.afterGet = function() {
        afterGet = true
        assert.equal(this, treeNode.object)
      }
      get.call(treeNode)
      assert.ok(beforeGet)
      assert.ok(afterGet)
    })

    it("beforeGet and afterGet bind to parent.value", function() {
      let beforeGetFlag = false
      let afterGetFlag = false
      treeNode.children.a2.beforeGet = function() {
        beforeGetFlag = true
        assert.equal(this, treeNode.value)
      }
      treeNode.children.a2.afterGet = function() {
        afterGetFlag = true
        assert.equal(this, treeNode.value)
      }
      get.call(treeNode.children.a2)
      assert.ok(beforeGetFlag)
      assert.ok(afterGetFlag)
    })

    it("beforeGet return undefined, will get property's value, and emit 'beforeGet' event", function() {
      let test = false
      treeNode.children.a2.beforeGet = function() {
        test = true
      }
      let event = false
      treeNode.children.a2.event.on("beforeGet", function(value) {
        event = true
        assert.equal(value, "I am a2")
        assert.equal(this, treeNode.value)
      })
      assert.equal(object.a2, treeNode.children.a2.value)
      assert.equal(test, true)
      assert.equal(event, true)
    })

    it("beforeGet return a value, will get this returned value, and emit 'beforeGet' event", function() {
      let test = false
      treeNode.children.a2.beforeGet = function() {
        test = true
        return "get.test.js: beforeGet return a value"
      }
      let event = false
      treeNode.children.a2.event.on("beforeGet", function(value) {
        event = true
        assert.equal(value, "get.test.js: beforeGet return a value")
        assert.equal(this, treeNode.value)
      })
      assert.equal(object.a2, "get.test.js: beforeGet return a value")
      assert.equal(test, true)
      assert.equal(event, true)
    })

    it("afterGet return undefined, will get property's value, and emit 'beforeGet' event", function() {
      let test = false
      treeNode.children.a2.afterGet = function() {
        test = true
      }
      let event = false
      treeNode.children.a2.event.on("afterGet", function(value) {
        event = true
        assert.equal(value, "I am a2")
        assert.equal(this, treeNode.value)
      })
      assert.equal(object.a2, treeNode.children.a2.value)
      assert.equal(test, true)
      assert.ok(event)
    })

    it("afterGet return a value, will get this returned value, and emit 'afterGet' event", function() {
      let test = false
      treeNode.children.a2.afterGet = function() {
        test = true
        return "get.test.js: afterGet return a value"
      }
      let event = false
      treeNode.children.a2.event.on("afterGet", function(value) {
        event = true
        assert.equal(value, "get.test.js: afterGet return a value")
        assert.equal(this, treeNode.value)
      })
      assert.equal(object.a2, "get.test.js: afterGet return a value")
      assert.equal(test, true)
      assert.ok(event)
    })

    it("catch beforeGet's error", function() {
      let test = false
      treeNode.children.a.beforeGet = function() {
        test = true
        throw Error("get.test.js, sync beforeGet throw Error")
      }
      try {
        object.a
        assert.fail("should not be executed")
      } catch (e) {
        assert.ok(e instanceof Error)
        assert.equal(e.message, "get.test.js, sync beforeGet throw Error")
        assert.ok(test)
      }
    })

    it("catch afterGet's error", function() {
      let test = false
      treeNode.children.a.afterGet = function() {
        test = true
        throw Error("get.test.js, sync afterGet throw Error")
      }
      try {
        object.a
        assert.fail("should not be executed")
      } catch (e) {
        assert.ok(e instanceof Error)
        assert.equal(e.message, "get.test.js, sync afterGet throw Error")
        assert.ok(test)
      }
    })
  })

  /* ---------------------- async get ---------------------- */

  describe("async get", function() {
    let config = {
      a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
      a2: { mode: "async" }
    }
    let object = {}
    let treeNode = undefined

    beforeEach(function() {
      object = { a: { b: { c: {}, c2: "I am c2" }, b2: "I am b2" }, a2: "I am a2" }
      setupObject = {}
      treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    })

    it("beforeGet and afterGet bind to injected object", async function() {
      let beforeGet = false
      let afterGet = false
      treeNode.beforeGet = async function() {
        beforeGet = true
        assert.equal(this, treeNode.object)
      }
      treeNode.afterGet = async function() {
        afterGet = true
        assert.equal(this, treeNode.object)
      }
      treeNode.mode = "async"
      await get.call(treeNode)
      assert.ok(beforeGet)
      assert.ok(afterGet)
    })

    it("beforeGet and afterGet bind to parent.value", async function() {
      let beforeGet = false
      let afterGet = false
      treeNode.children.a2.beforeGet = async function() {
        beforeGet = true
        assert.equal(this, treeNode.value)
      }
      treeNode.children.a2.afterGet = async function() {
        afterGet = true
        assert.equal(this, treeNode.value)
      }
      await get.call(treeNode.children.a2)
      assert.ok(beforeGet)
      assert.ok(afterGet)
    })

    it("beforeGet return undefined, will get property's value, and emit 'beforeGet' event", async function() {
      let test = false
      treeNode.children.a2.beforeGet = async function() {
        test = true
      }
      let event = false
      treeNode.children.a2.event.on("beforeGet", async function(value) {
        event = true
        assert.equal(value, "I am a2")
        assert.equal(this, treeNode.value)
      })
      assert.equal(await object.a2, treeNode.children.a2.value)
      assert.equal(test, true)
      assert.equal(event, true)
    })

    it("beforeGet return a value, will get this returned value, and emit 'beforeGet' event", async function() {
      let test = false
      treeNode.children.a2.beforeGet = async function() {
        test = true
        return "get.test.js: beforeGet return a value"
      }
      let event = false
      treeNode.children.a2.event.on("beforeGet", async function(value) {
        event = true
        assert.equal(value, "get.test.js: beforeGet return a value")
        assert.equal(this, treeNode.value)
      })
      assert.equal(await object.a2, "get.test.js: beforeGet return a value")
      assert.equal(test, true)
      assert.equal(event, true)
    })

    it("afterGet return undefined, will get property's value, and emit 'beforeGet' event", async function() {
      let test = false
      treeNode.children.a2.afterGet = async function() {
        test = true
      }
      let event = false
      treeNode.children.a2.event.on("afterGet", async function(value) {
        event = true
        assert.equal(value, "I am a2")
        assert.equal(this, treeNode.value)
      })
      assert.equal(await object.a2, treeNode.children.a2.value)
      assert.equal(test, true)
      assert.ok(event)
    })

    it("afterGet return a value, will get this returned value, and emit 'afterGet' event", async function() {
      let test = false
      treeNode.children.a2.afterGet = async function() {
        test = true
        return "get.test.js: afterGet return a value"
      }
      let event = false
      treeNode.children.a2.event.on("afterGet", async function(newValue) {
        event = true
        assert.equal(newValue, "get.test.js: afterGet return a value")
        assert.equal(this, treeNode.value)
      })
      assert.equal(await object.a2, "get.test.js: afterGet return a value")
      assert.equal(test, true)
      assert.ok(event)
    })

    it("catch beforeGet's error", async function() {
      let test = false
      treeNode.children.a2.beforeGet = async function() {
        test = true
        throw Error("get.test.js, sync beforeGet throw Error")
      }
      try {
        await object.a2
        assert.fail("should not be executed")
      } catch (e) {
        assert.ok(e instanceof Error)
        assert.equal(e.message, "get.test.js, sync beforeGet throw Error")
        assert.ok(test)
      }
    })

    it("catch afterGet's error", async function() {
      let test = false
      treeNode.children.a2.afterGet = async function() {
        test = true
        throw Error("get.test.js, async afterGet throw Error")
      }
      try {
        await object.a2
        assert.fail("should not be executed")
      } catch (e) {
        assert.ok(e instanceof Error)
        assert.equal(e.message, "get.test.js, async afterGet throw Error")
        assert.ok(test)
      }
    })
  })
})
