const deferRequire = require("defer-require")
const _ = require("lodash")

const ReactifyObjectTreeNode = deferRequire("./ReactifyObjectTreeNode.js")

/**
 * get ReactifyObjectTreeNode by given arguments. There's three argument combination:
 * 1. object, propertyName
 * 2. array, index
 * 3. ReactifyObjectTreeNode
 * @param {Array|Object|ReactifyObjectTreeNode} object where the target tree node is, if passed a ReactifyObjectTreeNode, will return itself.
 * @param {String|Number} index index use to retrieve target tree node from the array or object
 */
function getTreeNode(object, index) {
  if (object instanceof ReactifyObjectTreeNode.module) return object
  if (!object) throw TypeError("object is not accessible, cannot get its tree node.")

  let $roTree = object.$roTree
  if ($roTree instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError("Cannot find the ReactifyObjectTreeNode($roTree) of the object")

  if (!$roTree.config.items && !$roTree.config.properties)
    throw ReferenceError(`${$roTree.path} does not have reactify property`)
  if ($roTree.config.properties && typeof index !== "string") throw TypeError("property's name should be string")
  if ($roTree.config.items && typeof index !== "number") throw TypeError("array's index should be number")

  if ($roTree.config.items) index = $roTree.itemSymbols[index]
  let treeNode = $roTree.children[index]

  if (!treeNode) throw ReferenceError(`get property's tree node failed: property ${index} does not exist`)

  return treeNode
}

module.exports = getTreeNode
