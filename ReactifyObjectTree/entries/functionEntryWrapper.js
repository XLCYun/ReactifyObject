const defer_require = require("defer-require")
const ReactifyObjectTreeNode = defer_require("../ReactifyObjectTreeNode/ReactifyObjectTreeNode")

function preprocess(name) {
  if (typeof name !== "string") throw new TypeError("name for the preprocess wrapper should be a string")
  return function(treeNode) {
    if (treeNode instanceof ReactifyObjectTreeNode.module === false)
      throw TypeError(`Process "${name}" failed: should be ReactifyObjectTreeNode`)

    if (treeNode.config[name] !== undefined && typeof treeNode.config[name] !== "function")
      throw TypeError(`Procecss "${name}" failed: should be a function`)
  }
}

function process(name, defaultFunction) {
  if (typeof name !== "string") throw TypeError("name for the process wrapper should be a string")
  if (typeof defaultFunction !== "function") throw TypeError("defaultFunction should be a function")
  return function(treeNode) {
    if (treeNode instanceof ReactifyObjectTreeNode.module === false)
      throw TypeError(`Process "${name}" failed: should be ReactifyObjectTreeNode`)
    treeNode[name] = treeNode.config[name] || defaultFunction
  }
}

module.exports = { preprocess: preprocess, process: process }
