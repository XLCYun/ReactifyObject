/**
 * get a tree node by the given path
 * @param {Array} pathArray array contains the path to the target tree node
 */
const _ = require("lodash")

/**
 * get tree node by the given path array
 * @param {Array} pathArray array contains the nodes' name from this current node to the target node
 * @return {ReactifyObjectTreeNode|undefined} return tree node if find target node, else undefined
 */
function getTreeNodeByPath(pathArray) {
  let len = pathArray.length
  if (len === 0) return this
  if (this.isLeaf) return undefined
  if (this.isArrayNode) {
    let first = pathArray[0]
    if (first.match(/^[1-9]\d*|0$/) === null) return undefined
    let index = _.toInteger(first)
    if (index < 0 || index >= this.value.length) return undefined
    return getTreeNodeByPath.call(this.value.getTreeNodeByIndex(index), pathArray.slice(1, pathArray.length))
  } else {
    let keys = Object.keys(this.children)
    for (let i = 1; i <= len; i++) {
      let tryName = pathArray.slice(0, i).join(".")
      if (keys.includes(tryName)) return getTreeNodeByPath.call(this.children[tryName], pathArray.slice(i, len))
    }
    return undefined
  }
}

module.exports = getTreeNodeByPath
