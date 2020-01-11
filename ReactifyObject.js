const ReactifyObjectTreeNode = require("./ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
const validator = require("./validator/validator")
const compare = require("./compare/compare")
const entry = require("./ReactifyObjectTree/entries/entry")
const noValueSymbol = require("./ReactifyObjectTree/ReactifyObjectTreeNode/SetupValue/noValueSymbol")
class ReactifyObject {}

ReactifyObject.inject = function(object, config, name, parent, copyFrom) {
  return new ReactifyObjectTreeNode(object, config, name, parent, copyFrom)
}

ReactifyObject.entry = entry
ReactifyObject.validator = validator
ReactifyObject.compare = compare
ReactifyObject.Tree = ReactifyObjectTreeNode
ReactifyObject.noValueSymbol = noValueSymbol

module.exports = ReactifyObject
