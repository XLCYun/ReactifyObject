const validator = require("../../validator/validator")
const compare = require("../../compare/compare")

function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "bsonType" failed: should be ReactifyObjectTreeNode')

  let bsonType = []
  if (Array.isArray(treeNode.config.bsonType)) bsonType = treeNode.config.bsonType
  else bsonType = [treeNode.config.bsonType]
  if (!treeNode.bsonType) treeNode.bsonType = []

  treeNode.bsonType = treeNode.bsonType.concat(validator.typeFilter(bsonType, true))
}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "bsonType" failed: should be ReactifyObjectTreeNode')

  if (treeNode.config.validator) {
    if (typeof treeNode.config.validator === "function") treeNode.validator = treeNode.config.validator
    else throw TypeError(`"validtor" should be a function`)
  } else treeNode.validator = e => validator.validate(e, treeNode.bsonType)

  if (treeNode.config.compare) {
    if (typeof treeNode.config.compare === "function") treeNode.compare = treeNode.config.compare
    else throw TypeError(`"compare" should be a function`)
  } else treeNode.compare = (v1, v2) => compare.compare(v1, v2, treeNode.bsonType)
}

module.exports = {
  preprocess,
  process
}
