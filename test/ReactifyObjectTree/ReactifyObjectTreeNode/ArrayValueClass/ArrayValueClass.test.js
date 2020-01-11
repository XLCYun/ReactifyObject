const assert = require("assert")
const _ = require("lodash")
const ArrayValueClass = require("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/ArrayValueClass/ArrayValueClass")
const ReactifyObjectTreeNode = require("../../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const MixType = require("../../../helper/mixType")

describe("ArrayValueClass", function() {
  let config = undefined
  let object = {}
  let treeNode = undefined
  let a = undefined
  beforeEach(function() {
    config = {
      a: { items: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } } },
      a2: { mode: "sync" }
    }
    object = {
      a: [
        { b: { c: {}, c2: "I am c2" }, b2: "I am b2" },
        { b: { c: {}, c2: "I am c22" }, b2: "I am b22" }
      ],
      a2: "I am a2"
    }
    setupObject = {}
    treeNode = new ReactifyObjectTreeNode(object, config, "", null)
    a = treeNode.children.a
  })

  describe("constructor", function() {
    it("if treeNode is not an instance of ReactifyObjectTreeNode, throw TypeError", function() {
      for (let i of MixType.getAll()) assert.throws(() => new ArrayValueClass(i), TypeError)
    })

    it("if treeNode does not have itemSymbols or it's not array, will throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => Array.isArray(e) === false))
        assert.throws(() => new ArrayValueClass(i), TypeError)
      for (let i of MixType.getAll().filter(e => Array.isArray(e) === false)) {
        a.itemSymbols = i
        assert.throws(() => new ArrayValueClass(a), TypeError)
      }
    })

    it("instance will have $roTree, which refer to treeNode", function() {
      let instance = new ArrayValueClass(a)
      assert.equal(a, instance.$roTree)
    })

    it("a.value will be the instance of it", function() {
      let inst = new ArrayValueClass(a)
      assert.equal(inst, a.value)
    })

    it("set of a will be injected as $set in the instance", function() {
      let test = false
      a.set = function() {
        test = true
        assert.equal(this, a)
      }
      let res = new ArrayValueClass(a)
      res.$set()
      assert.equal(test, true)
    })

    it("update length", function() {
      a.itemSymbols.push(Symbol())
      let res = new ArrayValueClass(a)
      assert.equal(res.length, 3)
    })
  })

  describe("$root", function() {
    it("$root will referer to the treeNode's $root, which is root.value", function() {
      let res = new ArrayValueClass(a)
      assert.equal(res.$root, treeNode.value)
      assert.equal(res.$root, a.$root)
    })
  })

  describe("emit", function() {
    it("eventName is not a string, throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "string"))
        assert.throws(() => object.a.emit("", i), TypeError)
    })

    it("sync: will return result", function() {
      let res = a.value.emit("result", "event name")
      assert.equal(res, "result")
    })

    it("sync: will emit event", function() {
      let test = false
      a.event.on("test emit", function() {
        test = true
      })
      a.value.emit("", "test emit")
      assert.equal(test, true)
    })

    it("Listener will get the result as the first argument", function() {
      let test = false
      a.event.on("test emit", function(result) {
        test = true
        assert.equal(result, "test emit result")
      })
      a.value.emit("test emit result", "test emit").once
      assert.ok(test)
    })

    it("listener will throw error", function() {
      let test = false
      a.event.on("test emit", function(result) {
        test = true
        assert.equal(result, "test emit result")
        throw Error()
      })
      assert.throws(() => a.value.emit("test emit result", "test emit"))
      assert.ok(test)
    })

    it("async: will return result", async function() {
      a.mode = "async"
      let res = await a.value.emit("result", "event name")
      assert.equal(res, "result")
    })

    it("async: will emit event", async function() {
      let test = false
      a.mode = "async"
      a.event.on("test emit", async function() {
        test = true
      })
      await a.value.emit("", "test emit")
      assert.equal(test, true)
    })

    it("Async, listener will get the result as the first argument", async function() {
      a.mode = "async"
      let test = false
      a.event.on("test emit", async function(result) {
        test = true
        assert.equal(result, "test emit result")
      })
      await a.value.emit("test emit result", "test emit").once
      assert.ok(test)
    })

    it("Async, listener will throw error", async function() {
      a.mode = "async"
      let test = false
      a.event.on("test emit", async function(result) {
        test = true
        assert.equal(result, "test emit result")
        throw Error()
      })
      assert.rejects(a.value.emit("test emit result", "test emit"))
      assert.ok(test)
    })
  })

  describe("pop", function() {
    it("return undefined if array is empty", function() {
      a.itemSymbols = []
      let res = new ArrayValueClass(a)
      assert.equal(res.pop(), undefined)
    })

    it("return undefined if cannot find last item", function() {
      a.itemSymbols.push(Symbol())
      let res = new ArrayValueClass(a)
      assert.equal(res.pop(), undefined)
    })

    it("return item's value if not empty", function() {
      let popResult = a.children[a.itemSymbols[1]].value
      let instance = new ArrayValueClass(a)
      let res = instance.pop()
      assert.equal(instance.length, 1)
      assert.equal(a.itemSymbols.length, 1)
      assert.equal(Object.getOwnPropertySymbols(a.children).length, 1)
      assert.equal(res, popResult)
    })
  })

  describe("shift", function() {
    it("return undefined if array is empty", function() {
      a.itemSymbols = []
      let res = new ArrayValueClass(a)
      assert.equal(res.shift(), undefined)
    })

    it("return undefined if cannot find last item", function() {
      a.itemSymbols[0] = Symbol()
      let res = new ArrayValueClass(a)
      assert.equal(res.shift(), undefined)
    })

    it("removes first item and returns its value", function() {
      let shiftResult = a.children[a.itemSymbols[0]].value
      let instance = new ArrayValueClass(a)
      let res = instance.shift()
      assert.equal(instance.length, 1)
      assert.equal(a.itemSymbols.length, 1)
      assert.equal(Object.getOwnPropertySymbols(a.children).length, 1)
      assert.equal(res, shiftResult)
    })
  })

  describe("unshift: add items in front of the array, return new length of the array", function() {
    const wrapper = function(i) {
      return function() {
        let unshiftItems = []
        for (let j = 0; j < i; j++) unshiftItems.push({ b: { c: {}, c2: `test ${j}` }, b2: `test ${j}` })
        let instance = new ArrayValueClass(a)
        let newLength = instance.length + i
        let res = instance.unshift(...unshiftItems)
        assert.equal(instance.length, newLength)
        assert.equal(a.itemSymbols.length, newLength)
        assert.equal(Object.getOwnPropertySymbols(a.children).length, newLength)
        assert.equal(res, newLength)
        for (let j = 0; j < i; j++) {
          assert.equal(instance[j].b.c2, `test ${j}`)
          assert.equal(instance[j].b2, `test ${j}`)
        }
      }
    }
    for (let i = 0; i < 5; i++) it(`add ${i} item`, wrapper(i))
  })

  describe("splice", function() {
    let config = { a: { items: {} } }
    let object = {}
    let treeNode = new ReactifyObjectTreeNode(object, config, "", null)

    this.beforeEach(() => {
      config = { a: { items: {} } }
      object = {}
      treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      a = treeNode.children.a
    })

    const wrapper = function(start, deleteCount, pushItemCount) {
      return function() {
        let init = []
        for (let i = 0; i < start * 2; i++) {
          object.a.push(`init${i}`)
          init.push(`init${i}`)
        }
        let pushItems = []
        for (let i = 0; i < pushItemCount; i++) pushItems.push(`new item ${i}`)
        init.splice(start, deleteCount, ...pushItems)
        object.a.splice(start, deleteCount, ...pushItems)
        let arr = []
        for (let i = 0; i < object.a.length; i++) arr.push(object.a[i])
        assert.deepEqual(init, arr)
      }
    }

    for (let start = 0; start < 3; start++)
      for (let deleteCount = 0; deleteCount < 3; deleteCount++)
        for (let pushItemCount = 0; pushItemCount < 3; pushItemCount++) {
          it(`splice(${start}, ${deleteCount}, ${pushItemCount} item(s))`, wrapper(start, deleteCount, pushItemCount))
        }

    it("If deletedItem actually not exists, will return as undefined in array(when this happen, something's wrong)", function() {
      object.a.push(1)
      object.a.push(2)
      object.a.push(3)
      a.children = {}
      assert.deepEqual(object.a.splice(0, 3), [undefined, undefined, undefined])
    })
  })

  describe("push", function() {
    let config = {}
    let object = {}
    let treeNode = null
    let a = null

    this.beforeEach(() => {
      config = { a: { items: {} } }
      object = {}
      treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      a = treeNode.children.a
    })

    it("push item", function() {
      for (let i = 1; i < 100; i++) {
        assert.equal(object.a.push(i), i)
        assert.equal(object.a.length, i)
        assert.equal(a.itemSymbols.length, i)
        assert.equal(Object.getOwnPropertySymbols(a.children).length, i)
      }
    })
  })

  describe("copyWithin", function() {
    let config = {}
    let object = {}
    let treeNode = null
    let a = null

    this.beforeEach(() => {
      config = { a: { items: {} } }
      object = {}
      treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      a = treeNode.children.a
    })

    const wrapper = function(target, start, end) {
      return function() {
        let init = []
        for (let i = 0; i < target * 2; i++) {
          object.a.push(`init${i}`)
          init.push(`init${i}`)
        }

        init.copyWithin(target, start, end)
        object.a.copyWithin(target, start, end)
        let arr = []
        for (let i = 0; i < object.a.length; i++) arr.push(object.a[i])
        assert.deepEqual(init, arr)
      }
    }

    for (let target = 0; target < 3; target++)
      for (let start = 0; start < 3; start++)
        for (let end = 0; end < 3; end++) {
          it(`copyWithin(${target}, ${start}, ${end} item(s))`, wrapper(target, start, end))
        }
  })

  describe("reverse", function() {
    let test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let config = {}
    let object = {}
    let treeNode = null
    let a = null

    this.beforeEach(() => {
      config = { a: { items: {} } }
      object = {}
      treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      a = treeNode.children.a
    })

    const wrapper = function(i) {
      return function() {
        let testArray = test.slice(0, i)
        testArray.forEach(e => object.a.push(e))
        testArray.reverse()
        object.a.reverse()
        let arr = []
        for (let i = 0; i < object.a.length; i++) arr.push(object.a[i])
        assert.deepEqual(arr, testArray)
      }
    }

    for (let i = 0; i <= test.length; i++) it(`reverse ${i} items`, wrapper(i))
  })

  describe("fill", function() {
    let config = { a: { items: {} } }
    let object = {}
    let treeNode = new ReactifyObjectTreeNode(object, config, "", null)

    this.beforeEach(() => {
      config = { a: { items: {} } }
      object = {}
      treeNode = new ReactifyObjectTreeNode(object, config, "", null)
    })

    const wrapper = function(value, start, end) {
      return function() {
        let init = []
        for (let i = 0; i < start * 2; i++) {
          object.a.push(`init${i}`)
          init.push(`init${i}`)
        }
        let pushItems = []
        for (let i = 0; i < end; i++) pushItems.push(`new item ${i}`)
        init.fill(value, start, end)
        object.a.fill(value, start, end)
        let arr = []
        for (let i = 0; i < object.a.length; i++) arr.push(object.a[i])
        assert.deepEqual(init, arr)
      }
    }

    for (let value = 0; value < 3; value++)
      for (let start = 0; start < 3; start++)
        for (let end = 0; end < 3; end++) it(`fill(${value}, ${start}, ${end} item(s))`, wrapper(value, start, end))
  })

  describe("sort", function() {
    let test = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    let config = {}
    let object = {}
    let treeNode = null
    let a = null

    this.beforeEach(() => {
      config = { a: { items: {} } }
      object = {}
      treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      a = treeNode.children.a
    })

    const wrapper = function(i) {
      return function() {
        let testArray = test.slice(0, i)
        testArray.forEach(e => object.a.push(e))
        testArray.sort()
        object.a.sort()
        let arr = []
        for (let i = 0; i < object.a.length; i++) arr.push(object.a[i])
        assert.deepEqual(arr, testArray)
      }
    }

    for (let i = 0; i <= test.length; i++) it(`reverse ${i} items`, wrapper(i))
  })

  describe("update/updateLength/updateChildren", function() {
    let config = {}
    let object = {}
    let treeNode = null
    let a = null

    this.beforeEach(() => {
      config = { a: { items: {} } }
      object = { a: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
      treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      a = treeNode.children.a
    })

    it("update", function() {
      for (let i = 10; i > 0; i--) {
        object.a.update()
        assert.equal(object.a.length, i)
        assert.equal(a.itemSymbols.length, i)
        assert.equal(Object.getOwnPropertySymbols(a.children).length, i)
        a.itemSymbols.pop()
      }
    })

    it("updateLength", function() {
      for (let i = 10; i > 0; i--) {
        object.a.updateLength()
        assert.equal(object.a.length, i)
        assert.equal(a.itemSymbols.length, i)
        // assert.equal(Object.getOwnPropertySymbols(a.children).length, i)
        a.itemSymbols.pop()
      }
    })

    it("updateLength", function() {
      for (let i = 10; i > 0; i--) {
        object.a.updateLength()
        assert.equal(object.a.length, i)
        assert.equal(a.itemSymbols.length, i)
        // assert.equal(Object.getOwnPropertySymbols(a.children).length, i)
        a.itemSymbols.pop()
      }
    })

    it("updateChildren", function() {
      for (let i = 10; i > 0; i--) {
        object.a.updateChildren()
        // assert.equal(object.a.length, i)
        assert.equal(a.itemSymbols.length, i)
        assert.equal(Object.getOwnPropertySymbols(a.children).length, i)
        a.itemSymbols.pop()
      }
    })
  })

  describe("removeChild", function() {
    it("argument should be a Symbol", function() {
      for (let i of MixType.getAll().filter(e => typeof e !== "symbol")) assert.throws(() => object.a.removeChild(i))
    })

    it("if the tree node is not exist, return undefined", function() {
      assert.equal(object.a.removeChild(Symbol()), undefined)
    })

    it("if the tree node exists, removed it, and return it", function() {
      let symbols = Object.getOwnPropertySymbols(object.a.$roTree.children)
      for (let i of symbols) {
        let removeTreeNode = object.a.$roTree.children[i]
        let res = object.a.removeChild(i)
        assert.equal(res, removeTreeNode)
        assert.ok(!Object.getOwnPropertySymbols(object.a.$roTree.children).includes(i))
      }
    })
  })

  describe("addChild", function() {
    it("treeNode should be a instance of ReactifyObjectTreeNode", function() {
      for (let i of MixType.getAll()) assert.throws(() => ArrayValueClass.addChild(i))
    })

    it("treeNode should have `items` in config", function() {
      delete treeNode.config.items
      assert.throws(() => ArrayValueClass.addChild(treeNode))
    })

    it("will add children to treeNode.children", function() {
      for (let i = 0; i < 10; i++) {
        let treeNode = object.a.$roTree
        let old = Object.getOwnPropertySymbols(treeNode.children).length
        let child = ArrayValueClass.addChild(treeNode, i, i)
        assert.equal(treeNode.children[child.symbol], child)
        let newLen = Object.getOwnPropertySymbols(treeNode.children).length
        assert.equal(old + 1, newLen)
      }
    })

    describe("child's name will be defined as getter/setter", function() {
      it("add child, but symbol has not push into itemSymbols, name return -1", function() {
        let item = ArrayValueClass.addChild(a, 1, 1)
        assert.equal(item.name, -1)
        a.itemSymbols.push(item.symbol)
        assert.equal(item.name, 2)
      })
      it("add child, symbol has push into itemSymbols, name return 2", function() {
        let item = ArrayValueClass.addChild(a, 1, 1)
        a.itemSymbols.push(item.symbol)
        assert.equal(item.name, 2)
      })
      it("child is remove from parent, become dangling array item, return string as name", function() {
        let item = ArrayValueClass.addChild(a, 1, 1)
        item.parent = null
        assert.equal(item.name, "DanglingArrayItem" + item.id)
      })
      it("parent does not have itemSymbols, become dangling array item, return string as name", function() {
        let item = ArrayValueClass.addChild(a, 1, 1)
        item.parent.itemSymbols = null
        assert.equal(item.name, "DanglingArrayItem" + item.id)
      })
      it("Not dangling array item cannot set its name", function() {
        let item = ArrayValueClass.addChild(a, 1, 1)
        assert.throws(() => (item.name = 1))
      })
      it("dangling without parent, set a new name can delete its getter/setter therefore permanently change its name", function() {
        let item = ArrayValueClass.addChild(a, 1, 1)
        item.parent = null
        item.name = "new name"
        assert.equal(item.name, "new name")
      })
      it("dangling without parent.itemSymbols, set a new name can delete its getter/setter therefore permanently change its name", function() {
        let item = ArrayValueClass.addChild(a, 1, 1)
        item.parent.itemSymbols = null
        item.name = "new name"
        assert.equal(item.name, "new name")
      })
    })
  })

  describe("getTreeNodeByIndex", function() {
    let config = {}
    let object = {}
    let treeNode = null
    let a = null

    this.beforeEach(() => {
      config = { a: { items: {} } }
      object = { a: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
      treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      a = treeNode.children.a
    })
    it("If index is not integer, throw TypeError", function() {
      for (let i of MixType.getAll().filter(e => _.isInteger(e) === false))
        assert.throws(() => a.value.getTreeNodeByIndex(i), TypeError)
    })
    it("If not exists, throw RangeError", function() {
      assert.throws(() => a.value.getTreeNodeByIndex(-1), RangeError)
      assert.throws(() => a.value.getTreeNodeByIndex(10), RangeError)
    })
    it("If exists, return the found tree node", function() {
      for (let i = 0; i < 10; i++) {
        let symbol = a.itemSymbols[i]
        assert.equal(a.value.getTreeNodeByIndex(i), a.children[symbol])
      }
    })
  })

  describe("generateGetterSetter", function() {
    it("test getter", function() {
      let first = a.children[a.itemSymbols[0]]
      let second = a.children[a.itemSymbols[1]]
      let firstObj = a.value.generateGetterSetter(0)
      let secondObj = a.value.generateGetterSetter(1)
      assert.equal(firstObj.get(), first.value)
      assert.equal(secondObj.get(), second.value)
    })
    it("test setter", function() {
      let first = a.children[a.itemSymbols[0]]
      let second = a.children[a.itemSymbols[1]]
      let firstObj = a.value.generateGetterSetter(0)
      let secondObj = a.value.generateGetterSetter(1)
      firstObj.set(second.value)
      firstObj.set(first.value)
      assert.equal(firstObj.get(), second.value)
      assert.equal(secondObj.get(), first.value)
    })
    it("testing getter when items is simply number", function() {
      let config = { a: { items: {} } }
      let object = { a: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
      let treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      let a = treeNode.children.a
      for (let i = 0; i < 10; i++) {
        let symbol = a.itemSymbols[i]
        let target = a.children[symbol]
        let getterSetter = a.value.generateGetterSetter(i)
        assert.equal(getterSetter.get(), target.value)
      }
    })

    it("testing setter when items is simply number", function() {
      let config = { a: { items: {} } }
      let object = { a: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
      let treeNode = new ReactifyObjectTreeNode(object, config, "", null)
      let a = treeNode.children.a
      for (let i = 0; i < 10; i++) {
        let getterSetter = a.value.generateGetterSetter(i)
        getterSetter.set(i.toString())
        assert.equal(getterSetter.get(i), i.toString())
      }
    })
  })
  describe("species is Array", function() {
    it("species is Array", function() {
      assert.equal(object.a[Symbol.species], Array)
    })
  })
})
