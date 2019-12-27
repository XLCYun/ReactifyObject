const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("beforeSet"),
  process: functionEntryWrapper.process("beforeSet")
}
