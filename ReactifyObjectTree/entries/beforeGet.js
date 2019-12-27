const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("beforeGet"),
  process: functionEntryWrapper.process("beforeGet")
}
