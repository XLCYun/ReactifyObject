const _ = require("lodash")
const validator = require("../validator/validator")

const functions = {
  double: _.clone,
  string: _.clone,
  object: _.cloneDeep,
  array: _.clone,
  bool: _.clone,
  date: _.clone,
  null: _.clone,
  regex: _.clone,
  int: _.clone,
  timestamp: _.clone,
  long: _.clone
}

function getTypes() {
  return Object.keys(functions)
}

function clone(value, passibleType) {
  if (_.isArray(passibleType) === false) throw TypeError("Validate failed, passibleType should be an array")
  if (passibleType.length <= 0) return _.isObject(value) ? _.cloneDeep(value) : _.clone(value)

  passibleType = typeFilter(passibleType, true)
  for (let type of passibleType) if (validator.validate(value, [type])) return functions[type](value)
  throw Error(`Cannot find clone function for ${value}, its config type is ${passibleType}`)
}

function typeFilter(typeArray, throwError = true) {
  if (_.isArray(typeArray) === false) throw TypeError("typeError should be an array")
  if (_.isBoolean(throwError) === false) throw TypeError("throwError should be a specific boolean")

  let validType = getTypes()
  let res = []
  for (let type of typeArray) {
    if (validType.includes(type) === false) {
      if (throwError === true) throw new Error(`Not supported type: ${type}`)
      continue
    }
    if (res.includes(type) === false) res.push(type)
  }
  return res
}

function defineClone(type, func) {
  if (typeof type !== "string") throw TypeError("type should be a string")
  if (typeof func !== "function") throw TypeError("validator should be a function")
  functions[type] = func
}

module.exports = {
  functions: functions,
  getTypes: getTypes,
  clone: clone,
  typeFilter: typeFilter,
  defineClone: defineClone
}
