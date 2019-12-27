require("mocha")
const assert = require("assert")
const mixType = require("../helper/mixType")
const compare = require("../../compare/compare")

const validType = ["double", "string", "object", "array", "date", "null", "regex", "int", "timestamp", "long"]

describe("compare.test.js", function() {
  describe("typeFilter", function() {
    it("invalid, no argument", function() {
      try {
        compare.typeFilter()
        assert.fail("should not be executed")
      } catch (e) {
        assert.ok(e instanceof TypeError)
      }
    })

    it("invalid, 1 argument, not array", function() {
      for (let i of mixType.getAll().filter(e => Array.isArray(e) === false))
        try {
          compare.typeFilter(i)
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
    })

    it("invalid, 2 argument, throwError, no boolean", function() {
      for (let i of mixType.getAll().filter(e => typeof e !== "boolean" && e !== undefined))
        try {
          compare.typeFilter([], i)
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
    })

    describe("functionality", function() {
      it("all invalid type in array", function() {
        let all = mixType.getAll().filter(e => validType.includes(e) === false)
        try {
          compare.typeFilter(all)
          assert.fail("should not be executed")
        } catch (e) {}

        try {
          compare.typeFilter(all, true)
          assert.fail("should not be executed")
        } catch (e) {}

        let res = compare.typeFilter(all, false)
        assert.equal(0, res.filter(e => validType.includes(e)).length)
      })

      it("partial invalid type in array", function() {
        let all = mixType
          .getAll()
          .concat(validType)
          .concat(validType)

        try {
          compare.typeFilter(all)
          assert.fail("should not be executed")
        } catch (e) {}

        try {
          compare.typeFilter(all, true)
          assert.fail("should not be executed")
        } catch (e) {}

        let res = compare.typeFilter(all, false)
        assert.equal(validType.length, res.filter(e => validType.includes(e)).length)
      })

      it("all valid, no repeated value", function() {
        let res = compare.typeFilter(validType, true)
        assert.equal(res.length, validType.length)
      })

      it("all valid, has repeated value", function() {
        let res = compare.typeFilter(validType.concat(validType), true)
        assert.equal(res.length, validType.length)
      })

      it("empty typeError", function() {
        assert.equal(compare.typeFilter([]).length, 0)
      })
    })
  })

  describe("compare", function() {
    describe("argument", function() {
      it("invalid passibleType", function() {
        try {
          compare.compare()
          assert.fail("should not execucted")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }

        try {
          compare.compare(1)
          assert.fail("should not execucted")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }

        try {
          compare.compare(1, 1)
          assert.fail("should not execucted")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
      })
    })
    describe("functionality", function() {
      it("double", function() {
        assert.ok(compare.compare(1.34, 1.34, ["double"]))
        for (let i of mixType.getAll().filter(e => typeof e !== "number")) {
          let res = compare.compare(0, i, ["double"])
          assert.ok(!res)
        }
      })

      it("string", function() {
        assert.ok(!compare.compare("", " ", ["string"]), "empty string with one space string should not be equal")
        assert.ok(compare.compare("", "", ["string"]), "empty string and empty string should be equal")
        assert.ok(compare.compare("string", "string", ["string"]), "two string with same content should be equal")
        assert.ok(
          !compare.compare("string", new String("string"), ["string"]),
          "string and string created by String should not be equal"
        )
        for (let i of mixType.getAll().filter(e => e !== "")) assert.ok(!compare.compare("", i, ["string"]))
      })

      it("object", function() {
        assert.ok(
          compare.compare({ 1: 1, 2: 2, 3: 3 }, { 2: 2, 1: 1, 3: 3 }, ["object"]),
          "plained object with same own property should be equal"
        )

        assert.ok(
          !compare.compare({ 1: 1, 2: 2, 3: 3, 4: 4 }, { 2: 2, 1: 1, 3: 3 }, ["object"]),
          "plained object with same own property should be equal"
        )

        assert.ok(!compare.compare([], { 2: 2, 1: 1, 3: 3 }, ["object"]), "plained object and array is not equal")

        assert.ok(!compare.compare("", { 2: 2, 1: 1, 3: 3 }, ["object"]), "plained object and string is not equal")

        class a {}
        a.a = 3

        assert.ok(!compare.compare(a, { a: 3 }, ["object"]), "plained object and class is not equal")
        assert.ok(!compare.compare(a.prototype, { a: 3 }, ["object"]), "plained object and class is not equal")

        class b {}
        b.a = 3
        assert.ok(!compare.compare(a, b, ["object"], "class with same property should not be equal"))

        b.c = 4
        assert.ok(!compare.compare(a, b, ["object"], "class with different property should not be equal"))

        assert.ok(a, a, ["object"], "object compare with itself should be equal")
      })

      it("array", function() {
        class a {}
        assert.ok(compare.compare([1, 2, 3, a], [1, 2, 3, a], ["array"]), "array with same content should be equal")
        assert.ok(
          !compare.compare([1, 2, a, 3], [1, 2, 3, a], ["array"]),
          "array with same content but different index should not be equal"
        )
        assert.ok(
          compare.compare([1, 2, a, 3, { a: 1, b: [1, 2, 3] }], [1, 2, a, 3, { a: 1, b: [1, 2, 3] }], ["array"]),
          "deep equal: array with same content which contains nested object also should be equal"
        )
        assert.ok(compare.compare([], [], ["array"]), "empty array should be equal")
        assert.ok(!compare.compare([], "string", ["array"]), "array and string should not be equal")
      })

      it("date", function() {
        assert.ok(
          compare.compare(new Date("2019-12-27T08:28:14.345Z"), new Date(1577435294345), ["date"]),
          "date created by string and created by timestamp should be equal"
        )

        assert.ok(
          !compare.compare(new Date("2019-12-27T08:28:14.345Z"), new Date(), ["date"]),
          "history date should not be equal to now"
        )

        assert.ok(
          !compare.compare("2019-12-27T08:28:14.345Z", new Date(1577435294345), ["date"]),
          "string and date should not be equal"
        )
      })

      it("null", function() {
        assert.ok(compare.compare(null, null, ["null"], "null and null should be equal"))
        assert.ok(!compare.compare(null, undefined, ["null"], "null and undefined should be equal"))
        for (let i of mixType.getAll().filter(e => e !== null))
          assert.ok(!compare.compare(null, i, ["null"], "null and not null value should not be equal"))
      })

      it("regex", function() {
        assert.ok(compare.compare(/a/, /a/, ["regex"], "/a/ /a/ should be equal"))
        assert.ok(!compare.compare(/a/, /ab/, ["regex"], "/a/ /ab/ should not be equal"))
        for (let i of mixType.getAll().filter(e => e instanceof RegExp === false))
          assert.ok(!compare.compare(/a/, i, ["regex"], "/a/ /ab/ should not be equal"))
      })

      it("int", function() {
        assert.ok(compare.compare(3.4, 3.4, ["int"]), "3.4 should equal to 3.4")
        assert.ok(!compare.compare(NaN, NaN, ["int"]), "NaN should equal to NaN")
        assert.ok(!compare.compare(3.4, "3.4", ["int"]), "3.4 should not equal to '3.4'")
        for (let i of mixType.getAll()) assert.ok(!compare.compare(i, 234.123455683, ["int"]), "should not equal")
      })

      it("timestamp", function() {
        assert.ok(compare.compare(3.4, 3.4, ["timestamp"]), "3.4 should equal to 3.4")
        assert.ok(!compare.compare(NaN, NaN, ["timestamp"]), "NaN should equal to NaN")
        assert.ok(!compare.compare(3.4, "3.4", ["timestamp"]), "3.4 should not equal to '3.4'")
        for (let i of mixType.getAll()) assert.ok(!compare.compare(i, 234.123455683, ["int"]), "should not equal")
      })

      it("long", function() {
        assert.ok(compare.compare(3.4, 3.4, ["timestamp"]), "3.4 should equal to 3.4")
        assert.ok(!compare.compare(NaN, NaN, ["timestamp"]), "NaN should equal to NaN")
        assert.ok(!compare.compare(3.4, "3.4", ["timestamp"]), "3.4 should not equal to '3.4'")
        for (let i of mixType.getAll()) assert.ok(!compare.compare(i, 234.123455683, ["int"]), "should not equal")
      })

      it("multiple type, string and double", function() {
        assert.ok(compare.compare(3.4, 3.4, ["string", "double"]), "3.4 should equal 3.4")
        assert.ok(compare.compare("3.4", "3.4", ["string", "double"]), "'3.4' should equal '3.4'")
        assert.ok(!compare.compare(3.4, "3.4", ["string", "double"]), "3.4 should not equal '3.4'")
      })

      it("no type, will be compare by ===", function() {
        assert.ok(compare.compare(3.4, 3.4, []), "3.4 === 3.4")
        assert.ok(!compare.compare(3.4, "3.4", []), "3.4 !== '3.4'")
        assert.ok(!compare.compare(NaN, NaN, []), "NaN !== NaN")
        assert.ok(!compare.compare({}, {}, []), "{} !== {}")
        assert.ok(!compare.compare(Symbol(), Symbol(), []), "Symbol() !== Symbol()")
      })
    })
  })

  describe("definceCompare", function() {
    describe("argument", function() {
      it("one arguemnt", function() {
        let invalidType = mixType.getAll().filter(e => typeof e !== "string")
        for (let i of invalidType)
          try {
            compare.defineCompare(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "not string type should throw TypeError")
          }
      })

      it("no arguemnt", function() {
        try {
          compare.defineCompare()
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError, "not string type should throw TypeError")
        }
      })

      it("two arguemnt, invalid func", function() {
        let invalidType = mixType.getAll().filter(e => typeof e !== "function")
        for (let i of invalidType)
          try {
            compare.defineCompare(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "func is not a function should throw TypeError")
          }
      })
    })

    describe("functionality", function() {
      it("new compare", function() {
        let func = Function()
        compare.defineCompare("", func)
        assert.equal(compare.functions[""], func)
      })
    })
  })

  it("customize compare function: NaN now equal NaN", function() {
    let func = (a, b) => isNaN(a) && isNaN(b)
    compare.defineCompare("NaN", func)
    assert.ok(compare.compare(NaN, NaN, ["NaN"]), "NaN should equal to NaN by our customized compare function")
    assert.ok(
      compare.compare(NaN, "string", ["NaN"]),
      "NaN should not equal to string by our customized compare function"
    )
  })
})
