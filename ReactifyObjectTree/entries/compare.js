const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("compare"),
  process: functionEntryWrapper.process("compare", () => {})
}
