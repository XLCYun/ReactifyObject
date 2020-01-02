const defer_require = require("defer-require")
const _ = require("lodash")
const ReactifyObjectTreeNode = defer_require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const ArrayValueClass = require("../ReactifyObjectTreeNode/ArrayValueClass/ArrayValueClass")

function preprocess() {}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  let items = treeNode.config.items
  if (typeof items === "object" && items !== null) {
    if (treeNode.bsonType.includes("array") === false && treeNode.bsonType.length !== 0)
      throw Error(`${treeNode.path} is not an "array" according the config, should not have "items".`)
  } else if (items !== undefined) throw Error("config or the `items` of config should be a object")

  if (treeNode.isLeaf === false && treeNode.config.items) {
    treeNode.itemSymbols = []
    if (_.isArray(treeNode.object))
      for (let item of treeNode.object) {
        let res = ArrayValueClass.addChild(treeNode, item)
        treeNode.itemSymbols.push(res.symbol)
      }
  }
}

module.exports = {
  preprocess: preprocess,
  process: process
}
