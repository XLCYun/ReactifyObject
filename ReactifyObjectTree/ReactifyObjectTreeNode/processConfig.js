const entry = require("../entries/entry")

const otherValidEntries = ["validator", "clone", "compare"]

/**
 * should only call from the constructor of ReactifyObjectTree
 * `this` will bind to the instance of ReactifyObjectTree
 * Call config's entry function to preprocess and process the corresponding config entry
 * throw Error if there is a invalid config entry
 */
function processConfig() {
  let config = this.config
  let entryKeys = Object.keys(entry)
  let configKeys = Object.keys(config).filter(e => otherValidEntries.includes(e) === false)
  for (let key of configKeys)
    if (entryKeys.includes(key) === false)
      throw Error(`Config for property at '${this.path}' has not illegal config entry: ${key}'`)

  for (let key of entryKeys) entry[key].preprocess(this)
  for (let key of entryKeys) entry[key].process(this)
}

module.exports = processConfig
