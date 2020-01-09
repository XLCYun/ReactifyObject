const ReactifyObjectTreeNode = require("./ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const validator = require("./validator/validator")
const compare = require("./compare/compare")
const entry = require("./ReactifyObjectTree/entries/entry")

class ReactifyObject {}

ReactifyObject.inject = function(object, config, name, parent) {
  return new ReactifyObjectTreeNode(object, config, name, parent)
}

ReactifyObject.entry = entry
ReactifyObject.validator = validator
ReactifyObject.compare = compare
ReactifyObject.Tree = ReactifyObjectTreeNode

module.exports = ReactifyObject
