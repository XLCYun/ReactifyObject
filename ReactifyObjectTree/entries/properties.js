const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const noValueSymbol = require("../ReactifyObjectTreeNode/SetupValue/noValueSymbol")

function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  // add "object" type for root
  if (treeNode.isRoot) {
    if (!treeNode.bsonType) treeNode.bsonType = ["object"]
    else if (treeNode.bsonType.includes("object") === false) treeNode.bsonType.push("object")
  }

  // if has "preporties" and "items" throw error
  if (treeNode.config.properties !== undefined && treeNode.config.items !== undefined)
    throw Error("Cannot have properties and items at the same time")
}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  let properties = treeNode.config.properties
  if (typeof properties === "object" && properties !== null) {
    if (treeNode.bsonType.includes("object") === false && treeNode.bsonType.length !== 0)
      throw Error(`${treeNode.path} is not an "object" according the config, should not have "properties".`)
  } else if (properties !== undefined) throw Error("config or the `properties` of config should be a object")

  if (treeNode.isLeaf === false && treeNode.config.properties) {
    let properties = Object.keys(treeNode.config.properties)
    for (let prop of properties)
      treeNode.children[prop] = new ReactifyObjectTreeNode.module(
        typeof treeNode.object === "object" && treeNode.object !== null && Object.keys(treeNode.object).includes(prop)
          ? treeNode.object[prop]
          : noValueSymbol,
        treeNode.config.properties[prop],
        prop,
        treeNode,
        typeof treeNode.copyFrom === "object" &&
        treeNode.copyFrom !== null &&
        Object.keys(treeNode.copyFrom).includes(prop)
          ? treeNode.copyFrom[prop]
          : noValueSymbol
      )
  }
}

module.exports = {
  preprocess: preprocess,
  process: process
}
