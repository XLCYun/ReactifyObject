const functionEntryWrapper = require("./functionEntryWrapper")

module.exports = {
  preprocess: functionEntryWrapper.preprocess("beforeUpdate"),
  process: functionEntryWrapper.process("beforeUpdate", () => {})
}
