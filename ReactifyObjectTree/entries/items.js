const defer_require = require("defer-require")
const _ = require("lodash")
const ReactifyObjectTreeNode = defer_require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const ArrayValueClass = require("../ReactifyObjectTreeNode/ArrayValueClass/ArrayValueClass")
const noValueSymbol = require("../ReactifyObjectTreeNode/SetupValue/noValueSymbol")

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
    let arrays = [treeNode.copyFrom, treeNode.object, []]
    let index = _.isArray(treeNode.copyFrom) ? 0 : _.isArray(treeNode.object) ? 1 : 2
    for (let item of arrays[index]) {
      let res = ArrayValueClass.addChild(
        treeNode,
        index === 1 ? item : noValueSymbol, // object
        index === 0 ? item : noValueSymbol // copyFrom
      )
      treeNode.itemSymbols.push(res.symbol)
    }
  }
}

module.exports = {
  preprocess: preprocess,
  process: process
}
