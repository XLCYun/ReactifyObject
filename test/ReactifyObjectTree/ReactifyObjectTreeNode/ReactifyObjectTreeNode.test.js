const _ = require("lodash")
const assert = require("assert")
const EventMan = require("@xlcyun/event-man")
const ReactifyObjectTreeNode = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const MixType = require("../../helper/mixType")
const entry = require("../../../ReactifyObjectTree/entries/entry")

describe("ReactifyObjectTreeNode", function() {
  let config = {
    a: { properties: { b: {}, c: {} } },
    a2: { properties: { b2: {}, c2: {} } }
  }
  let object = {}
  let object2 = {}
  let treeNode = undefined
  let treeNode2 = undefined
  beforeEach(function() {
    object = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    object2 = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    treeNode = new ReactifyObjectTreeNode(object, config, "", null)
    treeNode2 = new ReactifyObjectTreeNode(object2, config, "", null)
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
        assert.throws(() => treeNode2.register(treeNode.children.a.value, "notExistsPropertyName"))
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
