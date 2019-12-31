const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")

function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  // add "object" type for root
  if (treeNode.isRoot) {
    if (!treeNode.bsonType) treeNode.bsonType = ["object"]
    else if (treeNode.bsonType.includes("object") === false) treeNode.bsonType.push("object")
  }
}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  let properties = treeNode.config.properties
  if (typeof properties === "object" && properties !== null) {
    if (treeNode.bsonType.includes("object") === false && treeNode.bsonType.length !== 0)
      throw Error(`${treeNode.path} is not an "object" according the config, should not have "properties".`)
  } else if (properties !== undefined) throw Error("config or the `properties` of config should be a object")

  if (treeNode.isLeaf === false) {
    let properties = Object.keys(treeNode.config.properties)
    for (let prop of properties)
      treeNode.children[prop] = new ReactifyObjectTreeNode.module(
        typeof treeNode.object === "object" && treeNode.object !== null ? treeNode.object[prop] : undefined,
        treeNode.config.properties[prop],
        prop,
        treeNode
      )
  }
}

module.exports = {
  preprocess: preprocess,
  process: process
}
