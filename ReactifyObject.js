const ReactifyObjectTreeNode = require("./ReactifyObjectTree/ReactifyObjectTreeNode")

class ReactifyObject {}
module.exports = ReactifyObject

ReactifyObject.inject = function(object, config, name = "", parent = null) {
  new ReactifyObjectTreeNode(object, config, name, parent)
}

ReactifyObject.entry = entry
