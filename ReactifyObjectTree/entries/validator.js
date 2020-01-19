const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("validator"),
  process: functionEntryWrapper.process("validator", () => {})
}
