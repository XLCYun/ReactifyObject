function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "afterSet" failed: should be ReactifyObjectTreeNode')

  if (typeof treeNode.config.afterSet !== "function")
    throw TypeError('Procecss "afterSet" failed: should be a function')
}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "afterSet" failed: should be ReactifyObjectTreeNode')

  treeNode.afterSet = treeNode.config.afterSet || (() => {})
}

const ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode")
