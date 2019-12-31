const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode.js")

/**
 * sync version function used to set a new value to target property
 * Only called by the function `set`
 * @param {ReactifyObjectTreeNode} treeNode target property's ReactifyObjectTreeNode
 * @param {Any} newValue new value
 */
function setSync(treeNode, newValue) {
  let oldValue = treeNode.value
  // The function `set` already make sure it has parent
  let result = treeNode.beforeSet.call(treeNode.parent.value, newValue)
  if (result === false) return
  treeNode.event.emit("beforeSet", treeNode.parent.value, newValue, oldValue).once 
  treeNode.value = newValue
  treeNode.afterSet.call(treeNode.parent.value)
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
    let result = await treeNode.beforeSet.call(treeNode.parent.value)
    if (result === false) return
    await treeNode.event.emit("beforeSet", treeNode.parent.value, newValue, oldValue).once
    treeNode.value = newValue
    await treeNode.afterSet.call(treeNode.parent.value)
    await treeNode.event.emit("afterSet", treeNode.parent.value, newValue, oldValue).once 
  } catch (e) {
    throw e
  }
}

/**
 * According mode to call setSync or setAsync function
 * to set a new value to the target property
 * @param {ReactifyObject} object Reactify object which has $roTree
 * @param {String} propertyName target property's name
 * @param {Any} newValue new value
 * @param {String} mode "async" or "sync"
 */
function set(object, propertyName, newValue, mode) {
  if (!object) throw TypeError("set property value failed: invalid reactify object")
  if (object.$roTree instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError("Cannot find the ReactifyObjectTreeNode($roTree) of the object")
  if (typeof propertyName !== "string") throw TypeError("property's name should be string")
  if (mode !== "sync" && mode !== "async") throw Error("mode has to be 'async' or 'sync'")

  let treeNode = object.$roTree.children[propertyName]
  if (!treeNode) throw ReferenceError(`Set property value failed: property ${propertyName} not exists`)

  if (treeNode.validator(newValue) === false) throw TypeError("Cannot set new value: Validation failed")
  if (treeNode.compare(treeNode.value, newValue)) return

  return mode === "sync" ? setSync(treeNode, newValue) : setAsync(treeNode, newValue)
}

module.exports = set
