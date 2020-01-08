const assert = require("assert")
const _ = require("lodash")
const ReactifyObjectTreeNode = require("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const MixType = require("../../../helper/mixType")
const op = require("../../../../ReactifyObjectTree/revision/op")
const revision = require("../../../../ReactifyObjectTree/revision/revision")

describe("revision", function() {
  let config = {
    a: { properties: { b: { bsonType: "string" }, c: {} } },
    a2: { properties: { b2: { bsonType: "string" }, c2: {} } }
  }
  let object = {}
  let object2 = {}
  let treeNode = undefined
  let treeNode2 = undefined
  let arrayConfig = undefined
  let arrayObject = undefined
  let arrayTreeNode = undefined
  let objectRevision = undefined
  let object2Revision = undefined
  let arrayRevision = undefined
  beforeEach(function() {
    object = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    object2 = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    treeNode = new ReactifyObjectTreeNode(object, config, "$root", null)
    treeNode2 = new ReactifyObjectTreeNode(object2, config, "$root", null)
    objectRevision = new revision(treeNode)
    object2Revision = new revision(treeNode2)
    arrayConfig = {
      a: { items: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } } },
      a2: { mode: "sync" }
    }
    arrayObject = {
      a: [
        { b: { c: {}, c2: "I am c2" }, b2: "I am b2" },
        { b: { c: {}, c2: "I am c22" }, b2: "I am b22" }
      ],
      a2: "I am a2"
    }
    arrayTreeNode = new ReactifyObjectTreeNode(arrayObject, arrayConfig, "$root", null)
    arrayRevision = new revision(arrayTreeNode)
    a = arrayTreeNode.children.a
  })

  describe("constructor", function() {
    it("tree is not an instance of ReactifyObjectTreeNode, throw TypeError", function() {
      for (let i of MixType.getAll()) assert.throws(() => new revision(i, () => {}), TypeError)
    })

    it("generateRevisionInfoFunction is not an function, throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "function" && e !== undefined))
        assert.throws(() => new revision(treeNode, i), TypeError)
    })

    it("don't specific generateRevisionInfoFunction, will get a default one", function() {
      let revisionInstance = new revision(treeNode)
      let info = revisionInstance.revisionInfoFunc()
      assert.ok(info.create_date instanceof Date)
      assert.equal(info.name, treeNode.name)
      assert.equal(info.path, treeNode.path)
    })

    it("Specific generateRevisionInfoFunction, ", function() {
      let revisionInstance = new revision(treeNode, () => "test")
      let info = revisionInstance.revisionInfoFunc()
      assert.equal(info, "test")
    })

    it("save tree inside the revision instance", function() {
      let revisionInstance = new revision(treeNode)
      assert.equal(revisionInstance.tree, treeNode)
    })

    it("baseSet is false at the beginning", function() {
      let revisionInstance = new revision(treeNode)
      assert.equal(revisionInstance.baseSet, false)
    })

    it("base is undefined at the beginning", function() {
      let revisionInstance = new revision(treeNode)
      assert.equal(revisionInstance.base, undefined)
    })
  })

  describe("refreshBase", function() {
    it("after refreshBase, baseSet will be true", function() {
      let revisionInstance = new revision(treeNode)
      revisionInstance.refreshBase()
      assert.ok(revisionInstance.baseSet)
    })

    it("after refreshBase, base will be a clone of current node's value", function() {
      let revisionInstance = new revision(treeNode)
      revisionInstance.refreshBase()
      assert.deepEqual(revisionInstance.base, { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } })
    })
  })

  describe("getRollbackPatch", function() {
    it("If the base is set yet, throw Error", function() {
      let revisionInstance = new revision(treeNode)
      assert.throws(() => revisionInstance.getRollbackPatch())
    })

    it("Test result", function() {
      let revisionInstance = new revision(treeNode, () => "revision info")
      revisionInstance.refreshBase()
      object.a.b = "new b"
      let res = revisionInstance.getRollbackPatch()
      assert.deepEqual(res, {
        revisionInfo: "revision info",
        patch: [
          {
            path: "$root.a.b",
            value: "b",
            op: op.enum.ADD
          }
        ]
      })
    })
  })

  describe("applyPatch", function() {
    describe("argument", function() {
      it("patch is not an object, throw TypeError", function() {
        for (let i of MixType.getAll().filter(e => typeof e !== "object" || e === null))
          assert.throws(() => arrayRevision.applyPatch(i), TypeError)
      })
      it("patch array inside is not an array, throw TypeError", function() {
        for (let i of MixType.getAll().filter(e => Array.isArray(e) === false))
          assert.throws(() => arrayRevision.applyPatch({ patch: i }), TypeError)
      })
    })
    describe("functionality", function() {
      it("Throw error if patch item is not valid", function() {
        assert.throws(() => arrayRevision.applyPatch({ patch: [{ path: null, op: "invalid op" }] }))
      })
      it("Cannot find patch item's parent tree node, throw ReferenceError", function() {
        assert.throws(
          () => arrayRevision.applyPatch({ patch: [{ path: "$root", op: op.enum.ADD, value: "" }] }),
          ReferenceError
        )
        assert.throws(
          () => arrayRevision.applyPatch({ patch: [{ path: "$root.a.2.notExists", op: op.enum.ADD, value: "" }] }),
          ReferenceError
        )
        assert.throws(
          () =>
            arrayRevision.applyPatch({ patch: [{ path: "$root.a.notExists.notExists", op: op.enum.ADD, value: "" }] }),
          ReferenceError
        )
      })
      it("parent is a leaf, throw ReferenceError", function() {
        assert.throws(
          () => arrayRevision.applyPatch({ patch: [{ path: "$root.a2.notExists", op: op.enum.ADD, value: "" }] }),
          ReferenceError
        )
        assert.throws(
          () => arrayRevision.applyPatch({ patch: [{ path: "$root.a.0.b.c2.notExists", op: op.enum.ADD, value: "" }] }),
          ReferenceError
        )
        assert.throws(
          () => arrayRevision.applyPatch({ patch: [{ path: "$root.a.0.b2.notExists", op: op.enum.ADD, value: "" }] }),
          ReferenceError
        )
        assert.throws(
          () => arrayRevision.applyPatch({ patch: [{ path: "$root.a.1.b.c2.notExists", op: op.enum.ADD, value: "" }] }),
          ReferenceError
        )
        assert.throws(
          () => arrayRevision.applyPatch({ patch: [{ path: "$root.a.1.b2.notExists", op: op.enum.ADD, value: "" }] }),
          ReferenceError
        )
      })
    })
    describe("Apply patch to a object(parent node is a Object Node", function() {
      describe("REMOVE operation", function() {
        describe("target node exists", function() {
          it("should throw Error", function() {
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a.b", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a.c", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a2.b2", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a2.c2", op: op.enum.REMOVE, value: "" }] })
            )
          })
        })
        describe("target node not exists", function() {
          it("should throw Error", function() {
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.notExists", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a.notExists", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a.notExists", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a2.notExists", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a2.notExists", op: op.enum.REMOVE, value: "" }] })
            )
          })
        })
      })
      describe("ADD operation: is modify operation", function() {
        describe("target node exists: is modify", function() {
          it("modify value", function() {
            objectRevision.applyPatch({ patch: [{ path: "$root.a.b", op: op.enum.ADD, value: "test value" }] })
            assert.equal(object.a.b, "test value")
            objectRevision.applyPatch({ patch: [{ path: "$root.a.c", op: op.enum.ADD, value: "test value" }] })
            assert.equal(object.a.c, "test value")
            objectRevision.applyPatch({ patch: [{ path: "$root.a2.b2", op: op.enum.ADD, value: "test value" }] })
            assert.equal(object.a2.b2, "test value")
            objectRevision.applyPatch({ patch: [{ path: "$root.a2.c2", op: op.enum.ADD, value: "test value" }] })
            assert.equal(object.a2.c2, "test value")
          })
          it("Value validated failed, throw Error", function() {
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a.b", op: op.enum.ADD, value: null }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a2.b2", op: op.enum.ADD, value: {} }] })
            )
          })
        })
        describe("target node not exists", function() {
          it("should throw Error", function() {
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.notExists", op: op.enum.ADD, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a.notExists", op: op.enum.ADD, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a.notExists", op: op.enum.ADD, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a2.notExists", op: op.enum.ADD, value: "" }] })
            )
            assert.throws(() =>
              objectRevision.applyPatch({ patch: [{ path: "$root.a2.notExists", op: op.enum.ADD, value: "" }] })
            )
          })
        })
      })
    })
    describe("Apply patch to a object(parent node is a Array Node", function() {
      let primativeArrayConfig = undefined
      let primativeArrayObject = undefined
      let primativeArrayTreeNode = undefined
      let primativeArrayRevision = undefined
      beforeEach(function() {
        primativeArrayConfig = {
          a: { items: {} },
          a2: { mode: "sync" },
          a3: { items: { bsonType: "int" } }
        }
        primativeArrayObject = {
          a: [0, 1, 2, 3, "4", "5", "6"],
          a2: "I am a2",
          a3: [0, 1, 2, 3]
        }
        primativeArrayTreeNode = new ReactifyObjectTreeNode(primativeArrayObject, primativeArrayConfig, "$root", null)
        primativeArrayRevision = new revision(primativeArrayTreeNode)
      })
      describe("ADD operation: push new element or modify existing element", function() {
        describe("target node exists: modify existing element", function() {
          it("modify existing element", function() {
            arrayRevision.applyPatch({
              patch: [
                { path: "$root.a.0", op: op.enum.ADD, value: { b: { c: {}, c2: "I am new c2" }, b2: "I am new b2" } },
                { path: "$root.a.1", op: op.enum.ADD, value: { b: { c: {}, c2: "I am new c2" }, b2: "I am new b2" } }
              ]
            })
            assert.deepEqual(arrayObject.a[0], { b: { c: {}, c2: "I am new c2" }, b2: "I am new b2" })
            assert.deepEqual(arrayObject.a[1], { b: { c: {}, c2: "I am new c2" }, b2: "I am new b2" })
            primativeArrayRevision.applyPatch({
              patch: [
                { path: "$root.a.0", op: op.enum.ADD, value: "$root.a.0" },
                { path: "$root.a.1", op: op.enum.ADD, value: "$root.a.1" },
                { path: "$root.a.2", op: op.enum.ADD, value: "$root.a.2" },
                { path: "$root.a.3", op: op.enum.ADD, value: "$root.a.3" },
                { path: "$root.a.4", op: op.enum.ADD, value: "$root.a.4" },
                { path: "$root.a.5", op: op.enum.ADD, value: "$root.a.5" },
                { path: "$root.a.6", op: op.enum.ADD, value: "$root.a.6" }
              ]
            })
            assert.equal(primativeArrayObject.a[0], "$root.a.0")
            assert.equal(primativeArrayObject.a[1], "$root.a.1")
            assert.equal(primativeArrayObject.a[2], "$root.a.2")
            assert.equal(primativeArrayObject.a[3], "$root.a.3")
            assert.equal(primativeArrayObject.a[4], "$root.a.4")
            assert.equal(primativeArrayObject.a[5], "$root.a.5")
            assert.equal(primativeArrayObject.a[6], "$root.a.6")
          })
        })
        describe("target node not exists: push into array", function() {
          it("target node's index !== parent array's length, throw Error", function() {
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.notExists", op: op.enum.ADD, value: "" }] })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.-1", op: op.enum.ADD, value: "" }] })
            )
            // parent's length = 7
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.8", op: op.enum.ADD, value: "" }] })
            )
          })
          describe("target node's index === parent array's length, push into array", function() {
            it("validation failed", function() {
              // parent's length = 4
              assert.throws(() =>
                primativeArrayRevision.applyPatch({
                  patch: [{ path: "$root.a3.4", op: op.enum.ADD, value: "not int, should throw Error" }]
                })
              )
            })
            it("push into parent array", function() {
              primativeArrayRevision.applyPatch({
                patch: [
                  { path: "$root.a.7", op: op.enum.ADD, value: "$root.a.7" },
                  { path: "$root.a.8", op: op.enum.ADD, value: "$root.a.8" },
                  { path: "$root.a.9", op: op.enum.ADD, value: "$root.a.9" },
                  { path: "$root.a.10", op: op.enum.ADD, value: "$root.a.10" },
                  { path: "$root.a.11", op: op.enum.ADD, value: "$root.a.11" },
                  { path: "$root.a.12", op: op.enum.ADD, value: "$root.a.12" },
                  { path: "$root.a.13", op: op.enum.ADD, value: "$root.a.13" }
                ]
              })
              assert.equal(primativeArrayObject.a[7], "$root.a.7")
              assert.equal(primativeArrayObject.a[8], "$root.a.8")
              assert.equal(primativeArrayObject.a[9], "$root.a.9")
              assert.equal(primativeArrayObject.a[10], "$root.a.10")
              assert.equal(primativeArrayObject.a[11], "$root.a.11")
              assert.equal(primativeArrayObject.a[12], "$root.a.12")
              assert.equal(primativeArrayObject.a[13], "$root.a.13")
            })
          })
        })
      })
      describe("REMOVE operation: pop existing element", function() {
        describe("target node exists", function() {
          it("target node's index !== parent array's length - 1(not last one), throw Error", function() {
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.0", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.1", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.2", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.3", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.4", op: op.enum.REMOVE, value: "" }] })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({ patch: [{ path: "$root.a.5", op: op.enum.REMOVE, value: "" }] })
            )
            // parent's length - 1 = 6
          })
          it("target node's index === parent array's length - 1(last one), pop out of array", function() {
            primativeArrayRevision.applyPatch({
              patch: [
                { path: "$root.a.6", op: op.enum.REMOVE, value: "$root.a.6" },
                { path: "$root.a.5", op: op.enum.REMOVE, value: "$root.a.5" },
                { path: "$root.a.4", op: op.enum.REMOVE, value: "$root.a.4" },
                { path: "$root.a.3", op: op.enum.REMOVE, value: "$root.a.3" },
                { path: "$root.a.2", op: op.enum.REMOVE, value: "$root.a.2" }
              ]
            })
            assert.equal(primativeArrayObject.a.length, 2)
            primativeArrayRevision.applyPatch({
              patch: [{ path: "$root.a.1", op: op.enum.REMOVE, value: "$root.a.2" }]
            })
            assert.equal(primativeArrayObject.a.length, 1)
            primativeArrayRevision.applyPatch({
              patch: [{ path: "$root.a.0", op: op.enum.REMOVE, value: "$root.a.2" }]
            })
            assert.equal(primativeArrayObject.a.length, 0)
          })
        })
        describe("target node not exists", function() {
          it("Cannot pop non-exists element, throw Error", function() {
            assert.throws(() =>
              primativeArrayRevision.applyPatch({
                patch: [{ path: "$root.a.notExist", op: op.enum.REMOVE, value: "" }]
              })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({
                patch: [{ path: "$root.a.-1", op: op.enum.REMOVE, value: "" }]
              })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({
                patch: [{ path: "$root.a.7", op: op.enum.REMOVE, value: "" }]
              })
            )
            assert.throws(() =>
              primativeArrayRevision.applyPatch({
                patch: [{ path: "$root.a.8", op: op.enum.REMOVE, value: "" }]
              })
            )
          })
        })
      })
    })
  })
})
