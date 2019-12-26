const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("afterGet"),
  process: functionEntryWrapper.process("afterGet")
}
