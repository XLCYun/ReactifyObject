function preprocess(name) {
  return function(treeNode) {
    if (treeNode instanceof ReactifyObjectTreeNode === false)
      throw TypeError(`Process "${name}" failed: should be ReactifyObjectTreeNode`)

    if (typeof treeNode.config[name] !== "function") throw TypeError(`Procecss "${name}" failed: should be a function`)
  }
}

function process(name) {
  return function(treeNode) {
    if (treeNode instanceof ReactifyObjectTreeNode === false)
      throw TypeError(`Process "${name}" failed: should be ReactifyObjectTreeNode`)

    treeNode[name] = treeNode.config[name] || (() => {})
  }
}


module.exports = { preprocess: preprocess, process: process }

const ReactifyObjectTreeNode = require("../ReactifyObjectTreeNode")