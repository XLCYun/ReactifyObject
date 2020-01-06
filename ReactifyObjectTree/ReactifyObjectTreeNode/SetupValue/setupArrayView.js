const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../ReactifyObjectTreeNode.js")
const ArrayValueClass = require("../ArrayValueClass/ArrayValueClass")

/**
 * setup a array view as value
 * @param {ReactifyObjectTreeNode} treeNode object to inject the view
 */
function setupArrayView(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError("Invalid treeNode, should be an instance of ReactifyObjectTreeNode")
  return new ArrayValueClass(treeNode)
}

module.exports = setupArrayView
