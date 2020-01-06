require("mocha")
const assert = require("assert")
const mixType = require("../helper/mixType")
const clone = require("../../clone/clone")
const validator = require("../../validator/validator")

const validType = ["double", "string", "object", "array", "date", "null", "regex", "int", "timestamp", "long"]

describe("clone", function() {
  describe("typeFilter", function() {
    it("invalid, no argument", function() {
      try {
        clone.typeFilter()
        assert.fail("should not be executed")
      } catch (e) {
        assert.ok(e instanceof TypeError)
      }
    })

    it("invalid, 1 argument, not array", function() {
      for (let i of mixType.getAll().filter(e => Array.isArray(e) === false))
        try {
          clone.typeFilter(i)
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
    })

    it("invalid, 2 argument, throwError, no boolean", function() {
      for (let i of mixType.getAll().filter(e => typeof e !== "boolean" && e !== undefined))
        try {
          clone.typeFilter([], i)
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
    })

    describe("functionality", function() {
      it("all invalid type in array", function() {
        let all = mixType.getAll().filter(e => validType.includes(e) === false)
        try {
          clone.typeFilter(all)
          assert.fail("should not be executed")
        } catch (e) {}

        try {
          clone.typeFilter(all, true)
          assert.fail("should not be executed")
        } catch (e) {}

        let res = clone.typeFilter(all, false)
        assert.equal(0, res.filter(e => validType.includes(e)).length)
      })

      it("partial invalid type in array", function() {
        let all = mixType
          .getAll()
          .concat(validType)
          .concat(validType)

        try {
          clone.typeFilter(all)
          assert.fail("should not be executed")
        } catch (e) {}

        try {
          clone.typeFilter(all, true)
          assert.fail("should not be executed")
        } catch (e) {}

        let res = clone.typeFilter(all, false)
        assert.equal(validType.length, res.filter(e => validType.includes(e)).length)
      })

      it("all valid, no repeated value", function() {
        let res = clone.typeFilter(validType, true)
        assert.equal(res.length, validType.length)
      })

      it("all valid, has repeated value", function() {
        let res = clone.typeFilter(validType.concat(validType), true)
        assert.equal(res.length, validType.length)
      })

      it("empty typeError", function() {
        assert.equal(clone.typeFilter([]).length, 0)
      })
    })
  })

  describe("clone", function() {
    describe("argument", function() {
      it("invalid passibleType", function() {
        try {
          clone.clone()
          assert.fail("should not execucted")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }

        try {
          clone.clone(1)
          assert.fail("should not execucted")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }

        try {
          clone.clone(1, 1)
          assert.fail("should not execucted")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
      })
    })
    describe("functionality", function() {
      it("double", function() {
        assert.equal(clone.clone(1.34, ["double"]), 1.34)
        for (let i of mixType.getAll().filter(e => typeof e === "number" && Number.isNaN(e) === false)) {
          let res = clone.clone(i, ["double"])
          assert.equal(res, i)
        }
      })

      it("string", function() {
        for (let i of mixType.getAll().filter(e => typeof e === "string")) assert.equal(clone.clone(i, ["string"]), i)
      })

      it("object", function() {
        assert.deepEqual(clone.clone({ 1: 1, 2: 2, 3: 3 }, ["object"]), { 1: 1, 2: 2, 3: 3 })
        assert.deepEqual(clone.clone({ 1: 1, 2: 2, 3: 3, 4: 4 }, ["object"]), { 1: 1, 2: 2, 3: 3, 4: 4 })
      })

      it("array", function() {
        class a {}
        assert.deepEqual(clone.clone([1, 2, 3, a], ["array"]), [1, 2, 3, a])
        assert.deepEqual(clone.clone([1, 2, a, 3], ["array"]), [1, 2, a, 3])
      })

      it("date", function() {
        assert.equal(
          clone.clone(new Date("2019-12-27T08:28:14.345Z"), ["date"]).getTime(),
          new Date("2019-12-27T08:28:14.345Z").getTime()
        )
        assert.equal(clone.clone(new Date(1577435294345), ["date"]).getTime(), new Date(1577435294345).getTime())
      })

      it("null", function() {
        assert.equal(clone.clone(null, ["null"]), null)
      })

      it("regex", function() {
        assert.equal(clone.clone(/a/, ["regex"]).source, /a/.source)
      })

      it("int", function() {
        assert.equal(clone.clone(3, ["int"]), 3)
      })

      it("timestamp", function() {
        let time = new Date().getTime()
        assert.equal(clone.clone(time, ["timestamp"]), time)
      })

      it("long", function() {
        assert.equal(clone.clone(3000000, ["long"]), 3000000)
      })

      it("multiple type", function() {
        assert.equal(clone.clone(3.4, ["string", "double"]), 3.4)
        assert.equal(clone.clone("3.4", ["string", "double"]), "3.4")
        assert.equal(clone.clone(true, ["string", "bool"]), true)
      })

      it("no type, will be clone by lodash.clone or object create by lodash.cloneDeep", function() {
        assert.equal(clone.clone(3.4, []), 3.4)
        assert.equal(clone.clone("3.4", []), "3.4")
        assert.ok(Number.isNaN(clone.clone(NaN, [])))
        assert.deepEqual(clone.clone({ a: 3 }, []), { a: 3 })
        let symbol = Symbol()
        assert.equal(clone.clone(symbol, []), symbol)
      })
    })
  })

  describe("defineClone", function() {
    describe("argument", function() {
      it("one arguemnt", function() {
        let invalidType = mixType.getAll().filter(e => typeof e !== "string")
        for (let i of invalidType)
          try {
            clone.defineClone(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "not string type should throw TypeError")
          }
      })

      it("no arguemnt", function() {
        try {
          clone.defineClone()
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError, "not string type should throw TypeError")
        }
      })

      it("two arguemnt, invalid func", function() {
        let invalidType = mixType.getAll().filter(e => typeof e !== "function")
        for (let i of invalidType)
          try {
            clone.defineClone(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "func is not a function should throw TypeError")
          }
      })
    })

    describe("functionality", function() {
      it("new clone", function() {
        let func = Function()
        clone.defineClone("", func)
        assert.equal(clone.functions[""], func)
      })
    })
  })

  it("customize clone function: return 'test clone'", function() {
    let func = () => "test clone"
    validator.defineValidator("testClone", () => true)
    clone.defineClone("testClone", func)
    assert.equal(clone.clone(NaN, ["testClone"]), "test clone")
    delete validator.functions.testClone
    delete clone.functions.testClone
  })
})
