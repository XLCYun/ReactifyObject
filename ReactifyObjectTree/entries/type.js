
const validType = ["object", "array", "number", "boolean", "string", "null"]

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

  for (let type of types) {
    if (typeof type !== "string") throw new TypeError("type must be a string")
    if (type === "integer") throw new Error(`"integer" is not supported as type, use "int"`)
    if (validType.includes(config.type) === false) throw new Error(`Not supported type: ${config.type}`)
    treeNode.type.push(equalType[type])
  }
}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  if (!treeNode.bsonType) treeNode.bsonType = []

  let type = treeNode.type
  let bsonType = treeNode.bsonType
  if (type) treeNode.bsonType = bsonType.concat(type.filter(e => bsonType.includes(e) === false))
}

module.exports = {
  preprocess,
  process
}

const ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode")
