const valid = [
  "double",
  "string",
  "object",
  "array",
  "objectId",
  "bool",
  "date",
  "null",
  "regex",
  "int",
  "timestamp",
  "long",
  "decimal",
  "minKey",
  "maxKey"
]

const deprecated = ["undefined", "dbPointer", "symbol"]
const notYetSupport = ["binData", "javascript", "javascriptWithScope"]

function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "bsonType" failed: should be ReactifyObjectTreeNode')

  let bsonType = []
  if (Array.isArray(treeNode.config.bsonType)) bsonType = treeNode.config.bsonType
  else bsonType = [treeNode.config.bsonType]

  if (!treeNode.bsonType) treeNode.bsonType = []

  for (let type of bsonType) {
    if (typeof type !== "string") throw new TypeError("bsonType must be a string")
    if (type === "integer") throw new Error(`"integer" is not supported as bsonTyp, use "int"`)
    if (deprecated.includes(type)) throw new Error(`${type} is deprecated`)
    if (notYetSupport.includes(type)) throw new Error(`${type} is not yet supported`)
    if (valid.includes(config.type) === false) throw new Error(`Not supported type: ${config.type}`)
    treeNode.bsonType.push(type)
  }
}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "bsonType" failed: should be ReactifyObjectTreeNode')
}

module.exports = {
  preprocess,
  process
}
