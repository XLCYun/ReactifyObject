const _ = require("lodash")

const tripleEqual = (a, b) => a === b

const functions = {
  double: tripleEqual,
  string: tripleEqual,
  object: _.isEqual,
  array: _.isEqual,
  date: _.isEqual,
  null: tripleEqual,
  regex: _.isEqual,
  int: tripleEqual,
  timestamp: tripleEqual,
  long: tripleEqual
}

function getTypes() {
  return Object.keys(functions)
}

function compare(value1, value2, passibleType) {
  if (_.isArray(passibleType) === false) throw TypeError("Validate failed, passibleType should be an array")
  if (passibleType.length <= 0) return value1 === value2

  passibleType = typeFilter(passibleType, true)

  for (let type of passibleType) if (functions[type](value1, value2) === true) return true
  return false
}

function typeFilter(typeArray, throwError = true) {
  if (_.isArray(typeArray) === false) throw TypeError("typeError should be an array")

  let validType = getTypes()
  let res = []
  for (let type of typeArray) {
    if (validType.includes(config.type) === false) {
      if (throwError === true) throw new Error(`Not supported type: ${config.type}`)
      continue
    }
    if (res.includes(type) === false) res.push(type)
  }
  return res
}

function defineCompare(type, func) {
  if (typeof type !== "string") throw TypeError("type should be a string")
  if (typeof func !== "function") throw TypeError("validator should be a function")
  functions[type] = func
}
module.exports = {
  functions: functions,
  compare: compare,
  typeFilter: typeFilter,
  defineCompare: defineCompare
}
