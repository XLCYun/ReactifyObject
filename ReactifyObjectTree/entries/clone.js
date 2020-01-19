const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("clone"),
  process: functionEntryWrapper.process("clone", () => {})
}
