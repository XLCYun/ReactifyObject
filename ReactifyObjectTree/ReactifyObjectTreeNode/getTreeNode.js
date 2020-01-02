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
  // TODO 添加数组相关的判断
  if (_.isObject(object) === false) throw TypeError(`Invalid argument, first argument should be a Array or Object`)
  if (_.isArray(object)) {
    if (_.isNumber(index) === false)
      throw TypeError(`Invalid index argument, should be a number when object is an array`)
  } else if (_.isString(index) === false)
    throw TypeError(`Invalid index argument, should be a string when object is not an array`)

  let $roTree = object.$roTree
  if ($roTree instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError("Cannot find the ReactifyObjectTreeNode($roTree) of the object")
  let treeNode = $roTree.children[index]
  if (!treeNode) throw ReferenceError(`get property value failed: property does not exist`)
  return treeNode
}

module.exports = getTreeNode
