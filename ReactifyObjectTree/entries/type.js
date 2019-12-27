const validator = require("../../validator/validator")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../ReactifyObjectTreeNode")

const equalType = {
  object: "object",
  array: "array",
  number: "double",
  boolean: "bool",
  string: "string",
  null: "null"
}

function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  let types = []
  if (treeNode.config.type !== undefined) {
    if (Array.isArray(treeNode.config.type)) types = treeNode.config.type
    else types = [treeNode.config.type]
  }

  if (!treeNode.type) treeNode.type = []
  if (!treeNode.bsonType) treeNode.bsonType = []

  treeNode.type = validator
    .typeFilter(types.map(e => equalType[e]))
    .filter(e => treeNode.type.includes(e) === false)
    .concat(treeNode.type)
  treeNode.bsonType = treeNode.bsonType.concat(treeNode.type.filter(e => treeNode.bsonType.includes(e) === false))
}

function process() {}

module.exports = {
  preprocess,
  process
}
