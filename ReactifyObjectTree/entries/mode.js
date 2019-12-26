function preprocess(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')

  let mode = treeNode.config.mode
  if (mode !== undefined) {
    if (typeof mode !== "string") throw TypeError(`Process "mode" failed: should be string`)
    if (mode !== "sync" && mode !== "async")
      throw Error(`Process "mode" failed: invalid value, should be "sync" or "async"`)
  }
}

function process(treeNode) {
  if (treeNode instanceof ReactifyObjectTreeNode === false)
    throw TypeError('Process "type" failed: should be ReactifyObjectTreeNode')
  treeNode.mode = treeNode.config.mode || "sync"
}

const ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode")

module.exports = {
  preprocess: preprocess,
  process: process
}
