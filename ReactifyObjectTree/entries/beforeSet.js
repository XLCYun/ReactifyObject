const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("afterSet"),
  process: functionEntryWrapper.process("afterSet")
}
