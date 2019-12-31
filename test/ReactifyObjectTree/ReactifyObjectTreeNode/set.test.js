const _ = require("lodash")
const assert = require("assert")
const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const set = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/set")
const MixType = require("../../helper/mixType")

describe("set.js", function() {
  let config = {
    a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
    a2: {}
  }
  let object = {}
  let treeNode = undefined

  beforeEach(function() {
    object = { a: { b: { c: {}, c2: "I am c2" }, b2: "I am b2" }, a2: "I am a2" }
    treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
  })

  describe("argument", function() {
    it("no argument, should throw TypeError", function() {
      assert.throws(() => set(), TypeError)
    })

    it("object without $roTree which should be an instance of ReactifyObjectTreeNode", function() {
      for (let i of MixType.getAll()) assert.throws(() => set(i), TypeError)
    })

    it("argument propertyName is invalid, throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "string")) assert.throws(() => set(treeNode.value, i))
    })

    it("invalid mode, throw Error", async function() {
      for (let i of MixType.getAll()) assert.throws(() => set(treeNode.value, "", "", i))
      treeNode.children.a2.value = "a2"
      assert.doesNotThrow(
        () => set(treeNode.value, "a2", "new value", "sync"),
        "set to 'sync' should not throw Error, caused by other Error is passible"
      )
      treeNode.children.a2.value = "a2"
      let promise = set(treeNode.value, "a2", "new value", "async")
      await assert.doesNotReject(promise, "set to 'async' should not throw Error, caused by other Error is passible")
    })
  })

  describe("functionality", function() {
    it("property does not exists, throw ReferenceError", function() {
      assert.throws(() => set(treeNode.value, "notExistsPropertyName", "", "sync"))
    })

    it("validator rejects new value, throw TypeError", function() {
      let config = {
        a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
        a2: { bsonType: "string" }
      }
      let object = {}
      treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
      treeNode.children.a2.validator = () => false
      assert.throws(() => set(treeNode.value, "a2", null, "sync"), TypeError)
    })

    it("compare reject new value, will not change the value", function() {
      treeNode.children.a2.value = "original value"
      treeNode.children.a2.compare = () => true
      set(treeNode.value, "a2", "a new value", "sync")
      assert.equal(treeNode.children.a2.value, "original value")
    })

    it("mode is sync, will return undefined", function() {
      assert.equal(set(treeNode.value, "a2", "a new value", "sync"), undefined)
    })

    it("mode is async, will return a Promise", function() {
      let res = set(treeNode.value, "a2", "a new value", "async")
      assert.equal(Promise.resolve(res), res)
    })

    describe("setSync", function() {
      it("beforeSet is called and its `this` bind to the target object", function() {
        let test = false
        treeNode.children.a2.beforeSet = function() {
          assert.equal(this, treeNode.value)
          test = true
        }
        set(treeNode.value, "a2", "new value", "sync")
        assert.ok(test)
      })

      it("afterSet is called and its `this` bind to the target object", function() {
        let test = false
        treeNode.children.a2.afterSet = function() {
          assert.equal(this, treeNode.value)
          test = true
        }
        set(treeNode.value, "a2", "new value", "sync")
        assert.ok(test)
      })

      it("beforeSet is called, first argument is new value, second argument is current value", function() {
        let test = false
        treeNode.children.a2.beforeSet = function(newValue, oldValue) {
          assert.equal(newValue, "new value")
          assert.equal(oldValue, "I am a2")
          test = true
        }
        set(treeNode.value, "a2", "new value", "sync")
        assert.ok(test)
      })

      it("afterSet is called, first argument is new value, second argument is old value", function() {
        let test = false
        treeNode.children.a2.afterSet = function(newValue, oldValue) {
          assert.equal(newValue, "new value")
          assert.equal(oldValue, "I am a2")
          test = true
        }
        set(treeNode.value, "a2", "new value", "sync")
        assert.ok(test)
      })

      it("beforeSet return false, will abort the set function", function() {
        treeNode.children.a2.value = "a2 value"
        treeNode.children.a2.beforeSet = () => false
        set(treeNode.value, "a2", "new value", "sync")
        assert.equal(treeNode.children.a2.value, "a2 value")
      })

      it("set a2 to a new value, will emit event 'beforeSet', first argument will be the target object", function() {
        treeNode.name = "$root"
        let theOldValue = (treeNode.children.a2.value = "a2 value")
        let theNewValue = "new value"
        let test = false
        treeNode.children.a2.event.on("beforeSet", function(object, newValue, oldValue) {
          test = true
          assert.equal(object, treeNode.value, "first argument of the listener function should be target object")
          assert.equal(newValue, theNewValue, "second argument of the listener function should be the new value")
          assert.equal(oldValue, theOldValue, "thrid argument of listener fucntion should be the old value")
        })
        set(treeNode.value, "a2", "new value", "sync")
        assert.ok(test)
      })

      it("set a2 to a new value, will emit event 'afterSet', first argument will be the target object", function() {
        treeNode.name = "$root"
        let theOldValue = (treeNode.children.a2.value = "a2 value")
        let theNewValue = "new value"
        let test = false
        treeNode.children.a2.event.on("afterSet", function(object, newValue, oldValue) {
          test = true
          assert.equal(object, treeNode.value, "first argument of the listener function should be target object")
          assert.equal(newValue, theNewValue, "second argument of the listener function should be the new value")
          assert.equal(oldValue, theOldValue, "thrid argument of listener fucntion should be the old value")
        })
        set(treeNode.value, "a2", "new value", "sync")
        assert.ok(test)
      })

      it("can catch error from beforeSet", function() {
        let test = false
        treeNode.children.a2.beforeSet = () => {
          test = true
          throw Error("test catch error")
        }
        assert.throws(() => set(treeNode.value, "a2", "new value", "sync"))
        assert.ok(test)
      })

      it("can catch error from afterSet", function() {
        let test = false
        treeNode.children.a2.afterSet = () => {
          test = true
          throw Error("test catch error")
        }
        assert.throws(() => set(treeNode.value, "a2", "new value", "sync"))
        assert.ok(test)
      })
    })

    /* setAsync */
    describe("setAsync", function() {
      let config = {
        a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
        a2: { mode: "async" }
      }
      let object = {}
      let treeNode = undefined

      beforeEach(function() {
        object = { a: { b: { c: {}, c2: "I am c2" }, b2: "I am b2" }, a2: "I am a2" }
        treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
      })

      it("beforeSet's `this` bind to the target object", async function() {
        let test = false
        treeNode.children.a2.beforeSet = async function() {
          assert.equal(this, treeNode.value)
          test = true
        }
        await set(treeNode.value, "a2", "new value", "async")
        assert.ok(test)
      })

      it("afterSet's `this` bind to the target object", async function() {
        let test = false
        treeNode.children.a2.afterSet = async function() {
          assert.equal(this, treeNode.value)
          test = true
        }
        await set(treeNode.value, "a2", "new value", "async")
        assert.ok(test)
      })

      it("beforeSet is called, first argument is new value, second argument is current value",async function() {
        let test = false
        treeNode.children.a2.beforeSet = async function(newValue, oldValue) {
          assert.equal(newValue, "new value")
          assert.equal(oldValue, "I am a2")
          test = true
        }
        await set(treeNode.value, "a2", "new value", "async")
        assert.ok(test)
      })

      it("afterSet is called, first argument is new value, second argument is old value",async function() {
        let test = false
        treeNode.children.a2.afterSet = async function(newValue, oldValue) {
          assert.equal(newValue, "new value")
          assert.equal(oldValue, "I am a2")
          test = true
        }
        await set(treeNode.value, "a2", "new value", "async")
        assert.ok(test)
      })


      it("beforeSet return false, will abort the set function", async function() {
        treeNode.children.a2.value = "a2 value"
        treeNode.children.a2.beforeSet = async () => false
        await set(treeNode.value, "a2", "new value", "async")
        assert.equal(treeNode.children.a2.value, "a2 value")
      })

      it("before set a2 to a new value, will emit event 'beforeSet', first argument will be the target object", async function() {
        treeNode.name = "$root"
        let theOldValue = (treeNode.children.a2.value = "a2 value")
        let theNewValue = "new value"
        let test = false
        treeNode.children.a2.event.on("beforeSet", async function(object, newValue, oldValue) {
          test = true
          assert.equal(object, treeNode.value, "first argument of the listener function should be target object")
          assert.equal(newValue, theNewValue, "second argument of the listener function should be the new value")
          assert.equal(oldValue, theOldValue, "thrid argument of listener fucntion should be the old value")
        })
        await set(treeNode.value, "a2", "new value", "async")
        assert.ok(test)
      })

      it("set a2 to a new value, will emit event 'afterSet', first argument will be the target object", async function() {
        treeNode.name = "$root"
        let theOldValue = (treeNode.children.a2.value = "a2 value")
        let theNewValue = "new value"
        let test = false
        treeNode.children.a2.event.on("afterSet", async function(object, newValue, oldValue) {
          test = true
          assert.equal(object, treeNode.value, "first argument of the listener function should be target object")
          assert.equal(newValue, theNewValue, "second argument of the listener function should be the new value")
          assert.equal(oldValue, theOldValue, "thrid argument of listener fucntion should be the old value")
        })
        await set(treeNode.value, "a2", "new value", "async")
        assert.ok(test)
      })

      it("can catch error from beforeSet", async function() {
        let test = false
        treeNode.children.a2.beforeSet = async () => {
          test = true
          throw Error("test catch error")
        }
        await assert.rejects(set(treeNode.value, "a2", "new value", "async"))
        assert.ok(test)
      })

      it("can catch error from afterSet", async function() {
        let test = false
        treeNode.children.a2.afterSet = async () => {
          test = true
          throw Error("test catch error")
        }
        await assert.rejects(set(treeNode.value, "a2", "new value", "async"))
        assert.ok(test)
      })
    })
  })
})
