const ReactifyObjectTreeNode = require("./ReactifyObjectTree/ReactifyObjectTreeNode")
const validtor = require("./validator/validator")
const compare = require("./compare/compare")

class ReactifyObject {}

ReactifyObject.inject = function(object, config, name = "", parent = null) {
  new ReactifyObjectTreeNode(object, config, name, parent)
}

ReactifyObject.entry = entry
ReactifyObject.validtor = validtor
ReactifyObject.validtor = validtor.compare

module.exports = ReactifyObject
