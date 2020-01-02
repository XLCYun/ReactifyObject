const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode.js")
const getTreeNode = require("./getTreeNode")

/**
 * sync version function used to set a new value to target property
 * Only called by the function `set`
 * @param {ReactifyObjectTreeNode} treeNode target property's ReactifyObjectTreeNode
 * @param {Any} newValue new value
 */
function setSync(treeNode, newValue) {
  let oldValue = treeNode.value
  // The function `set` already make sure it has parent
  let result = treeNode.beforeSet.call(treeNode.parent.value, newValue, oldValue)
  if (result === false) return
  treeNode.event.emit("beforeSet", treeNode.parent.value, newValue, oldValue).once
  treeNode.value = newValue
  treeNode.afterSet.call(treeNode.parent.value, newValue, oldValue)
  treeNode.event.emit("afterSet", treeNode.parent.value, newValue, oldValue).once
}

/**
 * async version function used to set a new value to target property
 * Only called by the function `set`
 * @param {ReactifyObjectTreeNode} treeNode target property's ReactifyObjectTreeNode
 * @param {Any} newValue new value
 */
async function setAsync(treeNode, newValue) {
  try {
    let oldValue = treeNode.value
    // The function `set` already make sure it has parent
    let result = await treeNode.beforeSet.call(treeNode.parent.value, newValue, oldValue)
    if (result === false) return
    await treeNode.event.emit("beforeSet", treeNode.parent.value, newValue, oldValue).once
    treeNode.value = newValue
    await treeNode.afterSet.call(treeNode.parent.value, newValue, oldValue)
    await treeNode.event.emit("afterSet", treeNode.parent.value, newValue, oldValue).once
  } catch (e) {
    throw e
  }
}

// TODO add supoort of passing tree node directly
// TODO add support of passing array and index
/**
 * According mode to call setSync or setAsync function
 * to set a new value to the target property
 * @param {ReactifyObject} object Reactify object which has $roTree
 * @param {String} index target property's name
 * @param {Any} newValue new value
 * @param {String} mode "async" or "sync"
 */
function set(object, index, newValue, mode) {
  if (!object) throw TypeError("set property value failed: invalid reactify object")
  let parentTreeNode = object.$roTree
  if (parentTreeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError("Cannot find the ReactifyObjectTreeNode($roTree) of the object")
  if (parentTreeNode.config.properties && typeof index !== "string") throw TypeError("property's name should be string")
  if (parentTreeNode.config.items && typeof index !== "number") throw TypeError("array's index should be number")
  if (mode !== "sync" && mode !== "async") throw Error("mode has to be 'async' or 'sync'")

  if (parentTreeNode.config.items) index = parentTreeNode.itemSymbols[index]
  let treeNode = parentTreeNode.children[index]
  if (!treeNode) throw ReferenceError(`Set property value failed: property ${index} not exists`)

  if (treeNode.validator(newValue) === false) throw TypeError("Cannot set new value: Validation failed")
  if (treeNode.compare(treeNode.value, newValue)) return

  return mode === "sync" ? setSync(treeNode, newValue) : setAsync(treeNode, newValue)
}
// TODO add new ReactifyObjectTreeNode if it's a 'node'(object or array)

module.exports = set
