const entry = require("../entries/entry")

/**
 * should only call from the constructor of ReactifyObjectTree
 * this will bind to the instance of ReactifyObjectTree
 */
function processConfig() {
  let entryKeys = Object.keys(entry)
  for (let key of entryKeys) entry[key].preprocess(this)
  for (let key of entryKeys) entry[key].process(this)
}

module.exports = processConfig
