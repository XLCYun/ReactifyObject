const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("afterUpdate"),
  process: functionEntryWrapper.process("afterUpdate")
}
