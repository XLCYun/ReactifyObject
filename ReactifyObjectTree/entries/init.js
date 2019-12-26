const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("init"),
  process: functionEntryWrapper.process("init")
}
