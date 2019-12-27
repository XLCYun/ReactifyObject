require("mocha")
const assert = require("assert")
const mixType = require("../helper/mixType")
const validator = require("../../validator/validator")

const validType = ["double", "string", "object", "array", "date", "null", "regex", "int", "timestamp", "long"]

describe("test validator.js", function() {
  describe("validate", function() {
    describe("argument test", function() {
      it("no argument", function() {
        try {
          validator.validate()
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
      })

      it("one argument", function() {
        for (let i of mixType.getAll())
          try {
            validator.validate(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError)
          }
      })

      it("two argument, invalid passibleType", function() {
        for (let i of mixType.getAll().filter(e => Array.isArray(e) === false))
          try {
            validator.validate(undefined, i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError)
          }
      })

      it("two argument, valid passibleType", function() {
        for (let i of mixType.getAll().filter(e => Array.isArray(e) === false))
          try {
            assert.ok(typeof validator.validate(i, []) === "boolean", "return should be boolean")
          } catch (e) {
            assert.fail("should not be executed")
          }
      })
    })
    describe("functionality", function() {
      it("double", function() {
        assert.ok(validator.validate(4, ["double"]))
        assert.ok(validator.validate(4.33, ["double"]))
        for (let i of mixType.getAll().filter(e => typeof e !== "number"))
          assert.ok(!validator.validate(i, ["double"]), "not number value is not ok for double validator")
      })

      it("string", function() {
        assert.ok(validator.validate("", ["string"]))
        assert.ok(
          !validator.validate(new String(""), ["string"]),
          "use new String() to create a string is ok for string validator "
        )
        for (let i of mixType.getAll().filter(e => typeof e !== "string"))
          assert.ok(!validator.validate(i, ["string"]), "not string value is not ok for double validator")
      })
      it("object", function() {
        assert.ok(!validator.validate(null, ["object"]), "null is not ok for object validator")
        assert.ok(validator.validate({}, ["object"]), "plained object {} is ok for object validator")
        assert.ok(validator.validate({ a: 3 }, ["object"]), "plained object {} is ok for object validator")
        for (let i of mixType.getAll().filter(e => typeof e !== "object" && e !== null && Array.isArray(e))) {
          if (validator.validate(i, ["object"])) console.log("%j", i)
          assert.ok(
            !validator.validate(i, ["object"]),
            "value is not null and object, should not be ok for object validator"
          )
        }
      })
      it("array", function() {
        assert.ok(!validator.validate(null, ["array"]), "null is not ok for array validator")
        assert.ok(!validator.validate({}, ["array"]), "plained object {} is not ok for array validator")
        assert.ok(!validator.validate({ a: 3 }, ["array"]), "plained object {} is not ok for object validator")
        assert.ok(validator.validate([], ["array"]), "[] is ok for object validator")
        assert.ok(validator.validate(Array(), ["array"]), "Array() is ok for object validator")
        assert.ok(validator.validate([3, 4], ["array"]), "[3, 4] is  ok for object validator")
        for (let i of mixType.getAll().filter(e => Array.isArray(e) === false)) {
          assert.ok(
            !validator.validate(i, ["array"]),
            "value is not null and object, should not be ok for object validator"
          )
        }
      })
      it("bool", function() {
        assert.ok(validator.validate(true, ["bool"]), "true is ok for bool validator")
        assert.ok(validator.validate(false, ["bool"]), "false is ok for bool validator")
        for (let i of mixType.getAll().filter(e => typeof e !== "boolean"))
          assert.ok(!validator.validate(i, ["bool"]), "not boolean variable is not ok for bool validator")
      })
      it("date", function() {
        assert.ok(validator.validate(new Date(), ["date"]), "new Date() is ok for date validator")
        for (let i of mixType.getAll().filter(e => e instanceof Date === false))
          assert.ok(
            !validator.validate(i, ["date"]),
            "variable is not instanceof Date, should not be ok for date validator"
          )
      })
      it("null", function() {
        assert.ok(validator.validate(null, ["null"]), "null is ok for null validator")
        for (let i of mixType.getAll().filter(e => e !== null))
          assert.ok(!validator.validate(i, ["null"]), "variable is not null, should not be ok for bool validator")
      })
      it("regex", function() {
        assert.ok(validator.validate(RegExp(), ["regex"]), "RegExp() is ok for regex validator")
        assert.ok(validator.validate(new RegExp(), ["regex"]), "new RegExp() is ok for regex validator")
        assert.ok(validator.validate(/a/, ["regex"]), "/a/ is ok for null validator")
        for (let i of mixType.getAll().filter(e => e instanceof RegExp === false))
          assert.ok(
            !validator.validate(i, ["regex"]),
            "variable is not RegExp instance, should not be ok for regex validator"
          )
      })
      it("int", function() {
        assert.ok(validator.validate(4, ["int"]), "4 is ok for int validator")
        assert.ok(validator.validate(0, ["int"]), "0 is ok for int validator")
        assert.ok(validator.validate(-4, ["int"]), "-4 is ok for int validator")
        assert.ok(!validator.validate(4.33, ["int"]), "4.33 is not ok for int validator")
        assert.ok(!validator.validate(-Infinity, ["int"]), "-Infinity is not ok for int validator")
        assert.ok(!validator.validate(Number.MIN_VALUE, ["int"]), "Number.MIN_VALUE is not ok for int validator")
        for (let i of mixType.getAll().filter(e => typeof e !== "number"))
          assert.ok(!validator.validate(i, ["int"]), "not number value is not ok for int validator")
      })
      it("timestamp", function() {
        assert.ok(validator.validate(4, ["timestamp"]), "4 is ok for timestamp validator")
        assert.ok(!validator.validate(0, ["timestamp"]), "0 is not ok for timestamp validator")
        assert.ok(!validator.validate(-4, ["timestamp"]), "-4 is not ok for timestamp validator")
        assert.ok(!validator.validate(4.33, ["timestamp"]), "4.33 is not ok for timestamp validator")
        assert.ok(!validator.validate(-Infinity, ["timestamp"]), "-Infinity is not ok for timestamp validator")
        assert.ok(!validator.validate(Infinity, ["timestamp"]), "Infinity is not ok for timestamp validator")
        assert.ok(
          !validator.validate(Number.MIN_VALUE, ["timestamp"]),
          "Number.MIN_VALUE is not ok for timestamp validator"
        )
        for (let i of mixType.getAll().filter(e => typeof e !== "number"))
          assert.ok(!validator.validate(i, ["timestamp"]), "not number value is not ok for timestamp validator")
      })
      it("long", function() {
        assert.ok(validator.validate(4, ["long"]), "4 is ok for int validator")
        assert.ok(validator.validate(0, ["long"]), "0 is ok for int validator")
        assert.ok(validator.validate(-4, ["long"]), "-4 is ok for int validator")
        assert.ok(!validator.validate(4.33, ["long"]), "4.33 is not ok for int validator")
        assert.ok(!validator.validate(-Infinity, ["long"]), "-Infinity is not ok for int validator")
        assert.ok(!validator.validate(Number.MIN_VALUE, ["long"]), "Number.MIN_VALUE is not ok for int validator")
        for (let i of mixType.getAll().filter(e => typeof e !== "number"))
          assert.ok(!validator.validate(i, ["long"]), "not number value is not ok for int validator")
      })

      it("type is not limited", function() {
        for (let i of mixType.getAll())
          assert.ok(validator.validate(i, []), "will always be accepted if type given(empty array)")
      })

      it("multiple type, string and double", function() {
        for (let i of mixType.number.concat(mixType.string))
          if (validator.validate(i, ["string", "double"]) === false)
            assert.ok(validator.validate(i, ["string", "double"]))
      })
    })
  })
  describe("typeFilter", function() {
    it("invalid, no argument", function() {
      try {
        validator.typeFilter()
        assert.fail("should not be executed")
      } catch (e) {
        assert.ok(e instanceof TypeError)
      }
    })

    it("invalid, 1 argument, not array", function() {
      for (let i of mixType.getAll().filter(e => Array.isArray(e) === false))
        try {
          validator.typeFilter(i)
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
    })

    it("invalid, 2 argument, throwError, no boolean", function() {
      for (let i of mixType.getAll().filter(e => typeof e !== "boolean" && e !== undefined))
        try {
          validator.typeFilter([], i)
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError)
        }
    })

    describe("functionality", function() {
      it("all invalid type in array", function() {
        let all = mixType
          .getAll()
          .filter(e => validType.includes(e) === false)
          .concat(validator.deprecatedType)
          .concat(validator.notYetSupportType)
        try {
          validator.typeFilter(all)
          assert.fail("should not be executed")
        } catch (e) {}

        try {
          validator.typeFilter(all, true)
          assert.fail("should not be executed")
        } catch (e) {}

        let res = validator.typeFilter(all, false)
        assert.equal(0, res.filter(e => validType.includes(e)).length)
      })

      it("partial invalid type in array", function() {
        let all = mixType
          .getAll()
          .concat(validType)
          .concat(validType)
          .concat(validator.deprecatedType)
          .concat(validator.notYetSupportType)

        try {
          validator.typeFilter(all)
          assert.fail("should not be executed")
        } catch (e) {}

        try {
          validator.typeFilter(all, true)
          assert.fail("should not be executed")
        } catch (e) {}

        let res = validator.typeFilter(all, false)
        assert.equal(validType.length, res.filter(e => validType.includes(e)).length)
      })

      it("all valid, no repeated value", function() {
        let res = validator.typeFilter(validType, true)
        assert.equal(res.length, validType.length)
      })

      it("all valid, has repeated value", function() {
        let res = validator.typeFilter(validType.concat(validType), true)
        assert.equal(res.length, validType.length)
      })

      it("empty typeError", function() {
        assert.equal(validator.typeFilter([]).length, 0)
      })

      it("integer is not support, throw TypeError suggesting use 'int'", function() {
        assert.throws(() => validator.typeFilter(validator.getTypes().concat(["integer"])), Error)
        assert.doesNotThrow(
          () => validator.typeFilter(validator.getTypes().concat(["integer"]), false),
          Error,
          "set throwError to false, will not throw Error"
        )
      })

      it("deprecated bsonType, show throw TypeError", function() {
        for (let i of validator.deprecatedType) {
          assert.throws(() => validator.typeFilter(validator.getTypes().concat([i])), Error)
          assert.doesNotThrow(
            () => validator.typeFilter(validator.getTypes().concat([i]), false),
            Error,
            "set throwError to false, will not throw Error"
          )
        }
      })

      it("deprecated bsonType, show throw TypeError", function() {
        for (let i of validator.notYetSupportType) {
          assert.throws(() => validator.typeFilter(validator.getTypes().concat([i])), Error)
          assert.doesNotThrow(
            () => validator.typeFilter(validator.getTypes().concat([i]), false),
            Error,
            "set throwError to false, will not throw Error"
          )
        }
      })
    })
  })

  describe("defineValidator", function() {
    describe("argument", function() {
      it("one arguemnt", function() {
        let invalidType = mixType.getAll().filter(e => typeof e !== "string")
        for (let i of invalidType)
          try {
            validator.defineValidator(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "not string type should throw TypeError")
          }
      })

      it("no arguemnt", function() {
        try {
          validator.defineValidator()
          assert.fail("should not be executed")
        } catch (e) {
          assert.ok(e instanceof TypeError, "not string type should throw TypeError")
        }
      })

      it("two arguemnt, invalid func", function() {
        let invalidType = mixType.getAll().filter(e => typeof e !== "function")
        for (let i of invalidType)
          try {
            validator.defineValidator(i)
            assert.fail("should not be executed")
          } catch (e) {
            assert.ok(e instanceof TypeError, "func is not a function should throw TypeError")
          }
      })
    })

    it("functionality", function() {
      let func = Function()
      validator.defineValidator("", func)
      assert.equal(validator.functions[""], func)
      func = () => {}
      validator.defineValidator("", func)
      assert.equal(validator.functions[""], func)
    })
  })

  it("define a validtor which only allow NaN and a string 'NaN'", function() {
    let name = "likeNaN"
    let func = e => Number.isNaN(e) || e === "NaN"
    validator.defineValidator(name, func)
    assert.ok(validator.validate(NaN, [name]), "NaN is good for our likeNaN validator")
    assert.ok(validator.validate("NaN", [name]), "'NaN' is good for our validator")
    assert.ok(!validator.validate("GG", [name]), "'GG' is not good for our validator")
    assert.ok(!validator.validate(null, [name]), "null is not good for our validator")
    assert.ok(!validator.validate(undefined, [name]), "undefined is not good for our validator")
  })
})
