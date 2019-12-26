const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("update"),
  process: functionEntryWrapper.process("update")
}
