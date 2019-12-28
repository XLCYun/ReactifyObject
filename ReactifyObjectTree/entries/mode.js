const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")

function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  let mode = treeNode.config.mode
  if (mode !== undefined) {
    if (typeof mode !== "string") throw TypeError(`Process "mode" failed: should be string`)
    if (mode !== "sync" && mode !== "async")
      throw Error(`Process "mode" failed: invalid value, should be "sync" or "async"`)
  }
}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')
  treeNode.mode = treeNode.config.mode || "sync"
}

module.exports = {
  preprocess: preprocess,
  process: process
}
