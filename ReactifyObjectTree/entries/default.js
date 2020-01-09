const validator = require("../../validator/validator")
const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")

function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')
  if (Object.keys(treeNode.config).includes("default")) treeNode.default = treeNode.config.default
  else treeNode.default = undefined
}

function process() {}

module.exports = {
  preprocess,
  process
}
