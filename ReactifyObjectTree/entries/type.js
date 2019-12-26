const validator = require("../../validator/validator")

const equalType = {
  object: "object",
  array: "array",
  number: "double",
  boolean: "bool",
  string: "string",
  null: "null"
}

function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  let types = []
  if (Array.isArray(config.type)) types = treeNode.config.type
  else types = [treeNode.config.type]

  if (!treeNode.type) treeNode.type = []
  if (!treeNode.bsonType) treeNode.bsonType = []

  treeNode.type = validator.typeFilter(
    types.map(e => equalType[e]),
    true
  )
  treeNode.bsonType = treeNode.bsonType.concat(treeNode.type)
}

function process(treeNode) {}

module.exports = {
  preprocess,
  process
}

const ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode")
