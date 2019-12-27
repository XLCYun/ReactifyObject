const _ = require("lodash")

const functions = {
  double: _.isNumber,
  string: e => e instanceof String === false && _.isString(e) === true,
  object: _.isObject,
  array: _.isArray,
  bool: _.isBoolean,
  date: _.isDate,
  null: _.isNull,
  regex: _.isRegExp,
  int: _.isInteger,
  timestamp: a => _.isSafeInteger(a) && a > 0,
  long: _.isInteger
}

const deprecated = ["undefined", "dbPointer", "symbol"]

const notYetSupport = ["binData", "javascript", "javascriptWithScope"]

function getTypes() {
  return Object.keys(functions)
}

function validate(value, passibleType) {
  if (_.isArray(passibleType) === false) throw TypeError("Validate failed, passibleType should be an array")
  if (passibleType.length <= 0) return true

  passibleType = typeFilter(passibleType, true)

  for (let type of passibleType) if (functions[type](value) === true) return true
  return false
}

function typeFilter(typeArray, throwError = true) {
  if (_.isArray(typeArray) === false) throw TypeError("typeError should be an array")
  if (_.isBoolean(throwError) === false) throw TypeError("throwError should be a specific boolean")
  let validType = getTypes()
  let res = []
  for (let type of typeArray) {
    if (type === "integer") {
      if (throwError === true) throw new Error(`"integer" is not supported as bsonType, use "int"`)
      continue
    }
    if (deprecated.includes(type)) {
      if (throwError === true) throw new Error(`${type} is deprecated`)
      continue
    }
    if (notYetSupport.includes(type)) {
      if (throwError === true) throw new Error(`${type} is not yet supported`)
      continue
    }
    if (validType.includes(type) === false) {
      if (throwError === true) throw new Error(`Not supported type: ${type}`)
      continue
    }
    if (res.includes(type) === false) res.push(type)
  }
  return res
}

function defineValidator(type, func) {
  if (typeof type !== "string") throw TypeError("type should be a string")
  if (typeof func !== "function") throw TypeError("validator should be a function")
  functions[type] = func
}

module.exports = {
  functions: functions,
  getTypes: getTypes,
  validate: validate,
  deprecatedType: deprecated,
  notYetSupportType: notYetSupport,
  typeFilter: typeFilter,
  defineValidator: defineValidator
}
