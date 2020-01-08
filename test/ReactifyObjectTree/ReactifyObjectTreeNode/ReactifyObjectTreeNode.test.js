const _ = require("lodash")
const assert = require("assert")
const EventMan = require("@xlcyun/event-man")
const ReactifyObjectTreeNode = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const MixType = require("../../helper/mixType")
const entry = require("../../../ReactifyObjectTree/entries/entry")
const revision = require("../../../ReactifyObjectTree/revision/revision")

describe("ReactifyObjectTreeNode", function() {
  let config = {
    a: { properties: { b: {}, c: {} } },
    a2: { properties: { b2: {}, c2: {} } }
  }
  let object = {}
  let object2 = {}
  let treeNode = undefined
  let treeNode2 = undefined
  let arrayConfig = undefined
  let arrayObject = undefined
  let arrayTreeNode = undefined
  let asyncConfig = undefined
  let asyncObject = undefined
  let asyncTreeNode = undefined
  beforeEach(function() {
    object = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    object2 = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    treeNode = new ReactifyObjectTreeNode(object, config, "", null)
    treeNode2 = new ReactifyObjectTreeNode(object2, config, "", null)

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
    arrayTreeNode = new ReactifyObjectTreeNode(arrayObject, arrayConfig, "", null)
    a = arrayTreeNode.children.a

    asyncConfig = {
      a: {
        mode: "async",
        items: {
          mode: "async",
          properties: {
            b: {
              mode: "async",
              properties: { c: { mode: "async", properties: {} }, c2: { mode: "async" } }
            },
            b2: { mode: "async" }
          }
        }
      },
      a2: { mode: "async" }
    }
    asyncObject = {
      a: [
        { b: { c: {}, c2: "I am c2" }, b2: "I am b2" },
        { b: { c: {}, c2: "I am c22" }, b2: "I am b22" }
      ],
      a2: "I am a2"
    }
    asyncTreeNode = new ReactifyObjectTreeNode(asyncObject, asyncConfig, "", null)
  })

  describe("constructor", function() {
    describe("argument", function() {
      it("invalid object", function() {
        for (let i of MixType.getAll().filter(e => typeof e !== "object" || e === null))
          assert.throws(() => new ReactifyObjectTreeNode(i))
      })

      it("invalid config", function() {
        for (let i of MixType.getAll().filter(e => typeof e !== "object" || e === null))
          assert.throws(() => new ReactifyObjectTreeNode({}, i))
      })

      it("invalid name", function() {
        for (let i of MixType.getAll().filter(e => typeof e !== "string" && e !== undefined))
          assert.throws(() => new ReactifyObjectTreeNode({}, {}, i))
      })

      it("invalid parent", function() {
        for (let i of MixType.getAll().filter(e => e !== null && e !== undefined)) {
          assert.throws(() => new ReactifyObjectTreeNode({}, {}, "name", i))
        }
      })
    })
    describe("functionality", function() {
      it("test event", function() {
        assert.ok(treeNode.event instanceof EventMan)
        assert.ok(treeNode.children.a.event instanceof EventMan)
        assert.ok(treeNode.children.a2.event instanceof EventMan)
        assert.ok(treeNode.children.a.children.b.event instanceof EventMan)
        assert.ok(treeNode.children.a.children.c.event instanceof EventMan)
        assert.ok(treeNode.children.a2.children.b2.event instanceof EventMan)
        assert.ok(treeNode.children.a2.children.c2.event instanceof EventMan)
      })

      it("processConfig", function() {
        let preprocess = false
        let process = false
        entry.test = {
          preprocess: () => (preprocess = true),
          process: () => (process = true)
        }
        treeNode = new ReactifyObjectTreeNode({}, config, "", null)
        assert.ok(process)
        assert.ok(preprocess)
        delete entry.test
      })

      it("setupValue", function() {
        assert.equal(treeNode.value.a.b, "b")
        assert.equal(treeNode.value.a.c, "c")
        assert.equal(treeNode.value.a2.b2, "b2")
        assert.equal(treeNode.value.a2.c2, "c2")
      })

      it("injectToObject", function() {
        assert.equal(object.$roTree, treeNode)
        assert.ok(typeof object.$set === "function")
        assert.equal(object.$root, treeNode.value)
        assert.equal(object.a, treeNode.children.a.value)
        assert.equal(object.a2, treeNode.children.a2.value)
      })

      it("call init", function() {
        let a = false
        let a2 = false
        let b = false
        let c = false
        let b2 = false
        let c2 = false
        let object = {}
        let config = {
          a: {
            init: function(self) {
              a = true
              assert.equal(self, object.$roTree.children.a)
              assert.equal(this, object.$roTree.value)
            },
            properties: {
              b: {
                init: function(self) {
                  b = true
                  assert.equal(self, object.$roTree.children.a.children.b)
                  assert.equal(this, object.a)
                }
              },
              c: {
                init: function(self) {
                  c = true
                  assert.equal(self, object.$roTree.children.a.children.c)
                  assert.equal(this, object.a)
                }
              }
            }
          },
          a2: {
            init: function(self) {
              a2 = true
              assert.equal(self, object.$roTree.children.a2)
              assert.equal(this, object.$roTree.value)
            },
            properties: {
              b2: {
                init: function(self) {
                  b2 = true
                  assert.equal(self, object.$roTree.children.a2.children.b2)
                  assert.equal(this, object.a2)
                }
              },
              c2: {
                init: function(self) {
                  c2 = true
                  assert.equal(self, object.$roTree.children.a2.children.c2)
                  assert.equal(this, object.a2)
                }
              }
            }
          }
        }
        treeNode = new ReactifyObjectTreeNode(object, config, "", null)
        assert.ok(a)
        assert.ok(b)
        assert.ok(c)
        assert.ok(a2)
        assert.ok(b2)
        assert.ok(c2)
      })
    })
  })

  describe("setupRevision", function() {
    it("before setupRevision, revision should be undefined", function() {
      assert.equal(undefined, treeNode.revision)
    })

    it("after setupRevision, revision should be an instance of revision", function() {
      treeNode.setupRevision()
      assert.ok(treeNode.revision instanceof revision)
    })

    it("after setupRevision, revision.tree is treeNode", function() {
      treeNode.setupRevision()
      assert.equal(treeNode.revision.tree, treeNode)
    })

    it("setupRevision with a function to generate revision info", function() {
      treeNode.setupRevision(() => "test setupRevision")
      assert.equal(treeNode.revision.revisionInfoFunc(), "test setupRevision")
    })
  })

  describe("setParent", function() {
    it("invalid argument", function() {
      for (let i of MixType.getAll()) assert.throws(() => treeNode.setParent(i), TypeError)
    })

    it("set treeNode as treeNode2's parent, .root will get treeNode", function() {
      treeNode2.setParent(treeNode)
      assert.equal(treeNode2.root, treeNode)
      assert.equal(treeNode2.parent, treeNode)
    })

    it("set treeNode as treeNode's parent, will throw ReferenceError", function() {
      assert.throws(() => treeNode.setParent(treeNode), ReferenceError)
    })

    it("setParent trigger circular reference, throw ReferenceError", function() {
      assert.throws(() => treeNode.setParent(treeNode.children.a))
    })
  })

  describe("appendChild", function() {
    it("invalid argument", function() {
      for (let i of MixType.getAll()) assert.throws(() => treeNode.appendChild(i), TypeError)
    })

    it("Throw TypeError if the node is a leaf and its value is not an object", function() {
      assert.throws(() => treeNode.children.a.children.b.appendChild(treeNode2), TypeError)
    })

    it("set treeNode as treeNode's children, will throw ReferenceError", function() {
      assert.throws(() => treeNode.appendChild(treeNode), ReferenceError)
    })

    it("Trigger circular reference, throw ReferenceError", function() {
      assert.throws(() => treeNode.children.a.appendChild(treeNode))
    })
  })

  describe("isArrayNode", function() {
    it("{a: items: ..., a2}", function() {
      assert.ok(a.isArrayNode)
    })

    it("{a: {items:{}}}", function() {
      let config = { a: { items: {} } }
      let object = { a: [1, 2, 3] }
      let treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      assert.ok(treeNode.children.a.isArrayNode)
      treeNode.children.a.value = 3
      assert.ok(!treeNode.children.a.isArrayNode)
    })

    it("test a leaf is not array node", function() {
      assert.ok(!treeNode.children.a.children.b.isArrayNode)
    })
  })

  describe("isObjectNode", function() {
    it("isObjectNode", function() {
      assert.ok(treeNode.isObjectNode)
      assert.ok(treeNode.children.a.isObjectNode)
      assert.ok(treeNode.children.a2.isObjectNode)
      assert.ok(!treeNode.children.a.children.b.isObjectNode)
      assert.ok(!treeNode.children.a.children.c.isObjectNode)
      assert.ok(!treeNode.children.a2.children.b2.isObjectNode)
      assert.ok(!treeNode.children.a2.children.c2.isObjectNode)
      assert.ok(!a.isObjectNode)
    })
  })

  describe("getTreeNodeByPath", function() {
    it("path is not string, throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "string")) assert.throws(() => a.getTreeNodeByPath(i))
    })

    it("return target treeNode", function() {
      let res = a.getTreeNodeByPath("a.0")
      assert.equal(res, a.value[0].$roTree)
    })

    it("Target tree node is itself", function() {
      let res = a.getTreeNodeByPath("a")
      assert.equal(res, a)
    })

    it("not exists, return undefined", function() {
      let res = a.getTreeNodeByPath("b.0")
      assert.equal(res, undefined)
    })
  })

  describe("getParentTreeNodeByPath", function() {
    it("path is not string, throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "string"))
        assert.throws(() => a.getParentTreeNodeByPath(i))
    })
    it("path has not . inside, and not equal to root's name, return undefined", function() {
      arrayTreeNode.name = "$root"
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath(""))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("Not Root's Name"))
    })
    it("path has not . inside, and it's root's name, still return undefined", function() {
      arrayTreeNode.name = "$root"
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root"))
    })
    it("path has . inside, but first one is not root's name, still return undefined", function() {
      arrayTreeNode.name = "$root"
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("NotRoot.a"))
    })
    it("path has . inside, but first one is root's name, target node not exists, still return root", function() {
      arrayTreeNode.name = "$root"
      assert.equal(arrayTreeNode, arrayTreeNode.getParentTreeNodeByPath("$root.notExist"))
    })
    it("target node not exists, parent is leaf, return undefined", function() {
      arrayTreeNode.name = "$root"
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b2.notExist"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.c2.notExist"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b2.notExist"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.c2.notExist"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a2.notExist"))
    })
    it("target node not exists, parent is not leaf, return parent", function() {
      arrayTreeNode.name = "$root"
      assert.equal(arrayObject.a.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.notExist"))
      assert.equal(arrayObject.a[0].$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.notExist"))
      assert.equal(arrayObject.a[0].b.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.notExist"))
      assert.equal(arrayObject.a[0].b.c.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.c.notExist"))
      assert.equal(arrayObject.a[1].$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.notExist"))
      assert.equal(arrayObject.a[1].b.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.notExist"))
      assert.equal(arrayObject.a[1].b.c.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.c.notExist"))
    })
    it("target node exists, parent exists, return parent", function() {
      arrayTreeNode.name = "$root"
      assert.equal(arrayTreeNode, arrayTreeNode.getParentTreeNodeByPath("$root.a"))
      assert.equal(arrayTreeNode, arrayTreeNode.getParentTreeNodeByPath("$root.a2"))
      assert.equal(arrayObject.a[0].$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b"))
      assert.equal(arrayObject.a[0].$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b2"))
      assert.equal(arrayObject.a[0].b.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.c"))
      assert.equal(arrayObject.a[0].b.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.c2"))
      assert.equal(arrayObject.a[1].$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b"))
      assert.equal(arrayObject.a[1].$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b2"))
      assert.equal(arrayObject.a[1].b.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.c"))
      assert.equal(arrayObject.a[1].b.$roTree, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.c2"))
    })
    it("target node not exists, parent not exists, return undefined", function() {
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("notExist.a"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("notExist.a2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("notExist.notExist2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.notExist.a"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.notExist.a2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.notExist.a"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.notExist.a2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.2.notExist.a"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.2.notExist.a2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.2.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.notExist.b"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.notExist.b2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.notExist.b"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.notExist.b2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.notExist.c"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.notExist.c2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.notExist.c"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.notExist.c2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.c.notExist.c"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.c.notExist.c2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b.c.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.c.notExist.c"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.c.notExist.c2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b.c.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b2.notExist.c"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b2.notExist.c2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.0.b2.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b2.notExist.c"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b2.notExist.c2"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a.1.b2.notExist.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a2.0.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a2.c.notExists"))
      assert.equal(undefined, arrayTreeNode.getParentTreeNodeByPath("$root.a2.notExist.notExists"))
    })
  })
  it("$root", function() {
    let value = treeNode.value
    assert.equal(treeNode.value.$root, value)
    assert.equal(object.$root, value)
    assert.equal(treeNode.children.a.$root, value)
    assert.equal(object.a.$root, value)
    assert.equal(treeNode.children.a.children.b.$root, value)
    assert.equal(treeNode.children.a.children.c.$root, value)

    assert.equal(treeNode.children.a2.$root, value)
    assert.equal(object.a2.$root, value)
    assert.equal(treeNode.children.a2.children.b2.$root, value)
    assert.equal(treeNode.children.a2.children.c2.$root, value)
  })

  describe("register", function() {
    describe("argument", function() {
      it("deep is not boolean, throw TypeError", function() {
        for (let i of MixType.getAll().filter(e => typeof e !== "boolean" && e !== undefined))
          assert.throws(() => treeNode.register(object.a, "name", i), TypeError)
      })
    })
    describe("functionality", function() {
      it("object.$roTree does not have a child property name `name`, throw TypeError", function() {
        assert.throws(() => treeNode2.register(treeNode.children.a.value, "notExistPropertyName"))
      })

      it("after register, this.update will be called after the target property is set to a new value", function() {
        let count = 0
        treeNode.update = function() {
          count++
        }
        treeNode.register(object, "a", true)
        object.a.b = 1
        assert.equal(count, 1)
        object.a.c = 2
        assert.equal(count, 2)
        object.a.b = 3
        assert.equal(count, 3)
        object.a.c = 4
        assert.equal(count, 4)
        object.a2.b2 = 5
        assert.equal(count, 4)
        object.a2.c2 = 6
        assert.equal(count, 4)
        object.a = 7
        assert.equal(count, 5)
      })

      it("register by tree node, this.update will be called after the target property is set to a new value", function() {
        let count = 0
        treeNode.update = function() {
          count++
        }
        treeNode.register(treeNode.children.a, true)
        object.a.b = 1
        assert.equal(count, 1)
        object.a.c = 2
        assert.equal(count, 2)
        object.a.b = 3
        assert.equal(count, 3)
        object.a.c = 4
        assert.equal(count, 4)
        object.a2.b2 = 5
        assert.equal(count, 4)
        object.a2.c2 = 6
        assert.equal(count, 4)
        object.a = 7
        assert.equal(count, 5)
      })

      it("register to a non-exists property should throw TypeError", function() {
        assert.throws(() => treeNode.register(object, "noExistsPropertyName"))
      })
    })
  })

  describe("getter", function() {
    it("root.getter === root.value", function() {
      assert.equal(treeNode.getter, treeNode.value)
    })
    it("node/leaf.getter === node/leaf.value === parent.object.property", function() {
      assert.equal(treeNode.children.a.getter, treeNode.children.a.value)
      assert.equal(treeNode.children.a.getter, object.a)

      assert.equal(treeNode.children.a.children.b.getter, treeNode.children.a.children.b.value)
      assert.equal(treeNode.children.a.children.b.getter, object.a.b)

      assert.equal(treeNode.children.a.children.c.getter, treeNode.children.a.children.c.value)
      assert.equal(treeNode.children.a.children.c.getter, object.a.c)

      assert.equal(treeNode.children.a2.getter, treeNode.children.a2.value)
      assert.equal(treeNode.children.a2.getter, object.a2)

      assert.equal(treeNode.children.a2.children.b2.getter, treeNode.children.a2.children.b2.value)
      assert.equal(treeNode.children.a2.children.b2.getter, object.a2.b2)

      assert.equal(treeNode.children.a2.children.c2.getter, treeNode.children.a2.children.c2.value)
      assert.equal(treeNode.children.a2.children.c2.getter, object.a2.c2)
    })
  })

  describe("setter", function() {
    it("'async' mode, use setter will throw Error", function() {
      treeNode.children.a.mode = "async"
      assert.throws(() => (treeNode.children.a.setter = 3))
    })

    it("use root's setter will throw Error", function() {
      assert.throws(() => (treeNode.setter = 3))
    })

    it("use root's setter will throw Error", function() {
      assert.throws(() => (treeNode.setter = 3))
    })

    it("use setter to set value", function() {
      treeNode.children.a.children.b.setter = 3
      assert.equal(object.a.b, 3)
      assert.equal(treeNode.children.a.children.b.value, 3)

      treeNode.children.a.children.c.setter = 3
      assert.equal(object.a.c, 3)
      assert.equal(treeNode.children.a.children.c.value, 3)

      treeNode.children.a2.children.b2.setter = 3
      assert.equal(object.a2.b2, 3)
      assert.equal(treeNode.children.a2.children.b2.value, 3)

      treeNode.children.a2.children.c2.setter = 3
      assert.equal(object.a2.c2, 3)
      assert.equal(treeNode.children.a2.children.c2.value, 3)
    })
  })

  describe("get function", function() {
    it("invalid propertyName, will throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "string")) assert.throws(() => treeNode.get(i), TypeError)
    })

    it("If node is leaf, will throw Error", function() {
      assert.throws(() => treeNode.children.a.children.b.get(""))
    })

    it("If property is not exists, will throw ReferenceError", function() {
      assert.throws(() => treeNode.get("Non-exists property name"))
    })

    it("get property's value", function() {
      assert.equal(treeNode.get("a"), object.a)
      assert.equal(treeNode.get("a"), treeNode.children.a.value)

      assert.equal(treeNode.get("a2"), object.a2)
      assert.equal(treeNode.get("a2"), treeNode.children.a2.value)

      assert.equal(treeNode.children.a.get("b"), object.a.b)
      assert.equal(treeNode.children.a.get("b"), treeNode.children.a.children.b.value)

      assert.equal(treeNode.children.a.get("c"), object.a.c)
      assert.equal(treeNode.children.a.get("c"), treeNode.children.a.children.c.value)

      assert.equal(treeNode.children.a2.get("b2"), object.a2.b2)
      assert.equal(treeNode.children.a2.get("b2"), treeNode.children.a2.children.b2.value)

      assert.equal(treeNode.children.a2.get("c2"), object.a2.c2)
      assert.equal(treeNode.children.a2.get("c2"), treeNode.children.a2.children.c2.value)
    })
  })

  describe("set function", function() {
    it("invalid propertyName, will throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "string")) assert.throws(() => treeNode.set(i))
    })

    it("call a leaf's set function, will throw Error", function() {
      assert.throws(() => treeNode.children.a.children.b.set(""))
      assert.throws(() => treeNode.children.a.children.c.set(""))
      assert.throws(() => treeNode.children.a2.children.c2.set(""))
      assert.throws(() => treeNode.children.a2.children.b2.set(""))
    })

    it("set property's value", function() {
      treeNode.children.a.set("b", "new b")
      assert.equal(object.a.b, "new b")
      assert.equal(treeNode.children.a.children.b.value, "new b")

      treeNode.children.a.set("c", "new c")
      assert.equal(object.a.c, "new c")
      assert.equal(treeNode.children.a.children.c.value, "new c")

      treeNode.children.a2.set("b2", "new b2")
      assert.equal(object.a2.b2, "new b2")
      assert.equal(treeNode.children.a2.children.b2.value, "new b2")

      treeNode.children.a2.set("c2", "new c2")
      assert.equal(object.a2.c2, "new c2")
      assert.equal(treeNode.children.a2.children.c2.value, "new c2")

      treeNode.set("a", "new a")
      assert.equal(object.a, "new a")
      assert.equal(treeNode.children.a.value, "new a")

      treeNode.set("a2", "new a2")
      assert.equal(object.a2, "new a2")
      assert.equal(treeNode.children.a2.value, "new a2")
    })

    it("set property's value in async mode, will return Promise", function() {
      let res = asyncTreeNode.set("a2", "new a2")
      assert.equal(Promise.resolve(res), res)
    })
  })

  describe("toObject", function() {
    it("argument, clone is not boolean", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "boolean" && e !== undefined))
        assert.throws(() => treeNode.toObject(i), TypeError)
    })

    it("functionality", function() {
      assert.deepEqual(treeNode.toObject(), { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } })
      assert.deepEqual(treeNode.children.a.toObject(), { b: "b", c: "c" })
      assert.deepEqual(treeNode.children.a.children.b.toObject(), "b")
      assert.deepEqual(treeNode.children.a.children.c.toObject(), "c")
      assert.deepEqual(treeNode.children.a2.toObject(), { b2: "b2", c2: "c2" })
      assert.deepEqual(treeNode.children.a2.children.b2.toObject(), "b2")
      assert.deepEqual(treeNode.children.a2.children.c2.toObject(), "c2")
    })
  })

  describe("setSequence", function() {
    it("sync, pass non-array value for an array property, should throw TypeError", function() {
      assert.throws(() => {
        for (let seq of arrayTreeNode.setSequence({ a: "not array" }));
      }, TypeError)
    })

    it("sync, pass non-object value for an object property, should throw TypeError", function() {
      assert.throws(() => {
        for (let seq of treeNode.setSequence({ a: "not object" }));
      })
    })

    it("sync, functionality, change leaf's value through object", function() {
      for (let seq of treeNode.setSequence({ a: { b: "new b" }, a2: { c2: "new c2" } }));
      assert.equal(object.a.b, "new b")
      assert.equal(object.a.c, "c", "no change")
      assert.equal(object.a2.c2, "new c2")
      assert.equal(object.a2.b2, "b2")
    })

    it("sync, functionality, change leaf's value through object, yet property does not exist", function() {
      assert.throws(() => {
        for (let seq of treeNode.setSequence({ a: { notexists: "new b" }, a2: { c2: "new c2" } }));
      }, ReferenceError)
    })

    it("sync, functionality, change leaf's value through array", function() {
      for (let seq of arrayTreeNode.setSequence({ a: { 0: { b: { c2: "new c" } }, 1: { b2: "new b2" } } }));
      assert.equal(arrayObject.a[0].b.c2, "new c")
      assert.equal(arrayObject.a[1].b2, "new b2")
    })

    it("sync, functionality, change leaf's value through array yet index is invalid", function() {
      assert.throws(() => {
        for (let seq of arrayTreeNode.setSequence({ a: { 0.3: { b: { c2: "new c" } } } }));
      }, TypeError)
      assert.throws(() => {
        for (let seq of arrayTreeNode.setSequence({ a: { "4": { b: { c2: "new c" } } } }));
      }, RangeError)
    })

    it("sync, functionality, manipulates element of an array", function() {
      let old = arrayTreeNode.children.a.value[0].$roTree.value
      for (let seq of arrayTreeNode.setSequence({
        a: [0, 1, { b: { c: {}, c2: "new c2" }, b2: "new b2" }, { b: { c: {}, c2: "new c2" }, b2: "new b2" }]
      })) {
        let result = seq
        assert.equal(result.length, 1)
        assert.equal(result[0], old)
      }
      assert.equal(arrayObject.a.length, 3)
      assert.equal(arrayObject.a[0].b.c2, "new c2")
      assert.equal(arrayObject.a[0].b2, "new b2")
      assert.equal(arrayObject.a[1].b.c2, "new c2")
      assert.equal(arrayObject.a[1].b2, "new b2")
    })

    it("async, functionality, change leaf's value through object", async function() {
      for (let seq of asyncTreeNode.setSequence({ a: { 0: { b2: "new b" } }, a2: { c2: "new c2" } })) {
        assert.equal(Promise.resolve(seq), seq)
        await seq
      }
      let a = await asyncObject.a
      let a0 = await a[0]
      let b2 = await a0.b2
      let a2 = await asyncObject.a2
      let c2 = await a2.c2
      assert.equal(b2, "new b")
      assert.equal(c2, "new c2")
    })
  })

  it("a2 reflect to a1, using update and init in config", function() {
    let config = {
      a: {
        properties: {
          b: {},
          c: {}
        }
      },
      a2: {
        properties: {
          b2: {
            init: function(self) {
              self.register(this.$root.a, "b")
            },
            update: function() {
              this.b2 = this.$root.a.b
            }
          },
          c2: {
            init: function(self) {
              self.register(this.$root.a, "c")
            },
            update: function() {
              this.c2 = this.$root.a.c
            }
          }
        }
      }
    }
    let object = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    new ReactifyObjectTreeNode(object, config, "", null)
    object.a.b = "I am b"
    assert.equal(object.a2.b2, "I am b")
    object.a.c = "I am c"
    assert.equal(object.a2.c2, "I am c")
  })
})
