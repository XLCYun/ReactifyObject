const assert = require("assert")
const TreeNode = require("../../../ReactifyObjectTree/TreeNode/TreeNode")
const MixType = require("../../helper/mixType")
const _ = require("lodash")

describe("TreeNode", function() {
  describe("argument", function() {
    it("no argument", function() {
      assert.throws(() => new TreeNode(), TypeError, "should throw TypeError, yet did not")
    })

    it("one argument, invalid config", function() {
      for (let i of MixType.getAll().filter(e => _.isPlainObject(e) === false))
        assert.throws(() => new TreeNode(), TypeError, "should throw TypeError, yet did not")
    })

    it("one argument, valid config, yet has a invalid type of properties", function() {
      for (let i of MixType.getAll().filter(e => _.isPlainObject(e) === false && e !== undefined))
        assert.throws(() => new TreeNode({ properties: i }), TypeError, "should throw TypeError, yet did not")
    })

    it("one argument, valid config", function() {
      assert.doesNotThrow(() => new TreeNode({}), TypeError, "should not throw TypeError, yet did.")
    })

    it("two argument, invalid name", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "string" && e !== undefined))
        assert.throws(() => new TreeNode({}, i), TypeError, "should throw TypeError, yet did not")
    })

    it("two argument, valid name", function() {
      for (let i of MixType.string)
        assert.doesNotThrow(() => new TreeNode({}, i), TypeError, "should not throw TypeError, yet did")
    })

    it("three argument, invalid parent", function() {
      for (let i of MixType.getAll().filter(e => e !== undefined && e !== null))
        assert.throws(() => new TreeNode({}, "", i), TypeError, "should throw TypeError, yet did not")
    })

    it("three argument, valid parent", function() {
      assert.doesNotThrow(
        () => new TreeNode({}, "", new TreeNode({}, "", null)),
        TypeError,
        "should not throw TypeError, yet did"
      )
    })
  })

  describe("functionality", function() {
    it("test name", function() {
      let one = new TreeNode({}, "aName", null)
      assert.equal(one.name, "aName", null)
    })

    it("test parent", function() {
      let one = new TreeNode({}, "parent", null)
      let child = new TreeNode({}, "child", one)
      assert.equal(one.parent, null, "one.parent should be null")
      assert.equal(child.parent, one, "child.parent shoudl be one")
      assert.equal(one.children.child, child, "one.children.child should be child")
    })

    it("test config", function() {
      let one = new TreeNode({}, "parent", null)
      let child = new TreeNode({}, "child", one)
      assert.deepEqual(one.config, { properties: {} })
      assert.deepEqual(child.config, {})
    })

    it("test config, a root's config will be wrapped to { properties: config } ", function() {
      let one = new TreeNode({ child: { properties: {} } })
      assert.deepEqual(one.config, { properties: { child: { properties: {} } } })
    })

    describe("nodeType", function() {
      it("nodeType should be root", function() {
        let one = new TreeNode({}, "", null)
        assert.equal(one.nodeType, "root")
      })

      it("nodeType should be node", function() {
        let one = new TreeNode({ a: {} }, "", null)
        let child = new TreeNode({ properties: {} }, "", one)
        assert.equal(child.nodeType, "node")
      })

      it("nodeType should be leaf", function() {
        let one = new TreeNode({ a: {} }, "", null)
        let child = new TreeNode({}, "", one)
        assert.equal(child.nodeType, "leaf")
      })
    })

    describe("isRoot/isNode/isLeaf", function() {
      it("nodeType should be root", function() {
        let one = new TreeNode({}, "", null)
        assert.ok(one.isRoot)
        assert.ok(!one.isNode)
        assert.ok(!one.isLeaf)
      })

      it("nodeType should be node", function() {
        let one = new TreeNode({ a: {} }, "", null)
        let child = new TreeNode({ properties: {} }, "", one)
        assert.ok(one.isRoot)
        assert.ok(!one.isNode)
        assert.ok(!one.isLeaf)

        assert.ok(!child.isRoot)
        assert.ok(child.isNode)
        assert.ok(!child.isLeaf)
      })

      it("nodeType should be leaf", function() {
        let one = new TreeNode({ a: {} }, "", null)
        let child = new TreeNode({}, "", one)
        assert.ok(one.isRoot)
        assert.ok(!one.isNode)
        assert.ok(!one.isLeaf)

        assert.ok(!child.isRoot)
        assert.ok(!child.isNode)
        assert.ok(child.isLeaf)
      })

      it("root/path", function() {
        let one = new TreeNode(
          {
            two: {
              properties: { three: { properties: { four: { properties: { five: { properties: { six: {} } } } } } } }
            }
          },
          "one",
          null
        )
        let two = new TreeNode(
          {
            properties: { three: { properties: { four: { properties: { five: { properties: { six: {} } } } } } } }
          },
          "two",
          one
        )
        let three = new TreeNode(
          {
            properties: { four: { properties: { five: { properties: { six: {} } } } } }
          },
          "three",
          two
        )
        let four = new TreeNode({ properties: { five: { properties: { six: {} } } } }, "four", three)
        let five = new TreeNode({ properties: { five: { properties: { six: {} } } } }, "five", four)
        let six = new TreeNode({}, "six", five)
        let seven = new TreeNode({}, "seven", six)
        assert.equal(seven.root, one)
        assert.equal(one.path, "one")
        assert.equal(two.path, "one.two")
        assert.equal(three.path, "one.two.three")
        assert.equal(four.path, "one.two.three.four")
        assert.equal(five.path, "one.two.three.four.five")
        assert.equal(six.path, "one.two.three.four.five.six")
        assert.equal(seven.path, "one.two.three.four.five.six.seven")
      })
    })
    describe("setParent", function() {
      it("no argument", function() {
        let one = new TreeNode({}, "", null)
        assert.throws(() => one.setParent(), TypeError, "should throw TypeError, yet did not")
      })

      it("one argument, invalid", function() {
        let one = new TreeNode({}, "one", null)
        for (let i of MixType.getAll())
          assert.throws(() => one.setParent(i), TypeError, "should throw TypeError, yet did not")
      })

      it("functionality", function() {
        let one = new TreeNode({}, "one", null)
        let two = new TreeNode({}, "two", null)
        let three = new TreeNode({}, "three", null)

        // one -> two -> three
        three.setParent(two)
        two.setParent(one)
        assert.equal(one.parent, null)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, undefined)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, three)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, two)
        assert.equal(three.children.one, undefined)
        assert.equal(three.children.two, undefined)

        // one -> two, one -> three
        three.setParent(one)
        assert.equal(one.parent, null)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, three)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, undefined)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, one)
        assert.equal(three.children.one, undefined)
        assert.equal(three.children.two, undefined)

        // three -> one -> two
        delete one.children.three
        three.parent = null
        one.setParent(three)
        assert.equal(one.parent, three)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, undefined)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, undefined)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, null)
        assert.equal(three.children.one, one)
        assert.equal(three.children.two, undefined)

        // check circular
        one = new TreeNode({}, "one", null)
        two = new TreeNode({}, "two", null)
        three = new TreeNode({}, "three", null)
        //   one->two->three => two->three->two
        three.setParent(two)
        two.setParent(one)
        //   will cause circular
        assert.ok(two.setParent(three) instanceof ReferenceError)
        //   three.setParent fail, will restore to one->two->three
        assert.equal(one.parent, null)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, undefined)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, three)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, two)
        assert.equal(three.children.one, undefined)
        assert.equal(three.children.two, undefined)

        // check circular
        one = new TreeNode({}, "one", null)
        two = new TreeNode({}, "two", null)
        three = new TreeNode({}, "three", null)
        // one->two->three->one
        three.setParent(two)
        two.setParent(one)
        assert.ok(one.setParent(three) instanceof ReferenceError)
        assert.equal(one.parent, null)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, undefined)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, three)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, two)
        assert.equal(three.children.one, undefined)
        assert.equal(three.children.two, undefined)

        // set one's parent to one
        one = new TreeNode({}, "one", null)
        assert.ok(one.setParent(one) instanceof ReferenceError)
      })
    })

    describe("appendChild", function() {
      it("no argument", function() {
        let one = new TreeNode({}, "", null)
        assert.throws(() => one.appendChild(), TypeError, "should throw TypeError, yet did not")
      })

      it("one argument, invalid", function() {
        let one = new TreeNode({}, "one", null)
        for (let i of MixType.getAll())
          assert.throws(() => one.appendChild(i), TypeError, "should throw TypeError, yet did not")
      })

      it("functionality", function() {
        let one = new TreeNode({}, "one", null)
        let two = new TreeNode({}, "two", null)
        let three = new TreeNode({}, "three", null)

        // one -> two -> three
        one.appendChild(two)
        two.appendChild(three)
        assert.equal(one.parent, null)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, undefined)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, three)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, two)
        assert.equal(three.children.one, undefined)
        assert.equal(three.children.two, undefined)

        // one -> two, one -> three
        one.appendChild(three)
        assert.equal(one.parent, null)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, three)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, undefined)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, one)
        assert.equal(three.children.one, undefined)
        assert.equal(three.children.two, undefined)

        // three -> one -> two
        delete one.children.three
        three.parent = null
        three.appendChild(one)
        assert.equal(one.parent, three)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, undefined)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, undefined)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, null)
        assert.equal(three.children.one, one)
        assert.equal(three.children.two, undefined)

        // check circular
        one = new TreeNode({}, "one", null)
        two = new TreeNode({}, "two", null)
        three = new TreeNode({}, "three", null)
        //   one->two->three => two->three->two
        one.appendChild(two)
        two.appendChild(three)
        //   will cause circular
        assert.ok(three.appendChild(two) instanceof ReferenceError)
        //   three.setParent fail, will restore to one->two->three
        assert.equal(one.parent, null)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, undefined)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, three)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, two)
        assert.equal(three.children.one, undefined)
        assert.equal(three.children.two, undefined)

        // check circular
        one = new TreeNode({}, "one", null)
        two = new TreeNode({}, "two", null)
        three = new TreeNode({}, "three", null)
        // one->two->three->one
        one.appendChild(two)
        two.appendChild(three)
        assert.ok(three.appendChild(one) instanceof ReferenceError)
        assert.equal(one.parent, null)
        assert.equal(one.children.two, two)
        assert.equal(one.children.three, undefined)
        assert.equal(two.parent, one)
        assert.equal(two.children.three, three)
        assert.equal(two.children.one, undefined)
        assert.equal(three.parent, two)
        assert.equal(three.children.one, undefined)
        assert.equal(three.children.two, undefined)
      })
    })

    describe("checkCircular", function() {
      let a = undefined
      let b = undefined
      let c = undefined
      let d = undefined
      beforeEach(function() {
        a = new TreeNode({}, "a", null)
        b = new TreeNode({}, "a", null)
        c = new TreeNode({}, "a", null)
        d = new TreeNode({}, "a", null)
      })

      it("no argument, valid", function() {
        assert.doesNotThrow(() => a.checkCircular(), TypeError)
      })

      it("no argument, functionality", function() {
        assert.ok(!a.checkCircular())
      })

      it("one argument, invalid", function() {
        for (let i of MixType.getAll().filter(e => Array.isArray(e) === false && e !== undefined))
          assert.throws(() => a.checkCircular(i), TypeError)
      })

      it("exists loop: a->b->d->a", function() {
        a.children.b = b
        b.parent = a
        b.children.c = c
        c.parent = b
        d.parent = b
        b.children.d = d
        a.parent = d
        d.children.d = d
        assert.ok(c.checkCircular())
        assert.ok(b.checkCircular())
        assert.ok(a.checkCircular())
        assert.ok(d.checkCircular())
      })

      it("exists loop: b->c->b", function() {
        b.children.c = c
        c.parent = b
        c.children.b = b
        b.parent = c

        b.children.a = a
        a.parent = b
        c.children.d = d
        d.parent = c
        assert.ok(c.checkCircular())
        assert.ok(b.checkCircular())
        assert.ok(a.checkCircular())
        assert.ok(d.checkCircular())
      })
    })
  })
})
