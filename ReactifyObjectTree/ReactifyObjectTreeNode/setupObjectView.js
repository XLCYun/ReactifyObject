const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode.js")

/**
 * setup a object view, that is inject the getter and setter
 * which related to the property(current node)
 * @param {Object} object object to inject the view
 * @param {ReactifyObjectTreeNode} treeNode object to inject the view
 */
function setupObjectView(object, treeNode) {
  if (!object || typeof object !== "object") throw TypeError("Invalid object")
  if (treeNode instanceof ReactifyObjectTreeNode.module === false)
    throw TypeError("Invalid treeNode, should be an instance of ReactifyObjectTreeNode")

  // $roTree/$set/$register/$root
  object.$roTree = treeNode
  object.$set = treeNode.set.bind(treeNode)
  object.$register = treeNode.register.bind(treeNode)
  Object.defineProperty(object, "$root", {
    get: Object.getOwnPropertyDescriptor(ReactifyObjectTreeNode.module.prototype, "$root").get.bind(treeNode)
  })
  // properties's getter and setter
  let keys = Object.keys(treeNode.children).map(e => treeNode.children[e].name)
  for (let key of keys) {
    Object.defineProperty(object, key, {
      get: Object.getOwnPropertyDescriptor(ReactifyObjectTreeNode.module.prototype, "getter").get.bind(
        treeNode.children[key]
      ),
      set: Object.getOwnPropertyDescriptor(ReactifyObjectTreeNode.module.prototype, "setter").set.bind(
        treeNode.children[key]
      )
    })
  }
}

module.exports = setupObjectView
