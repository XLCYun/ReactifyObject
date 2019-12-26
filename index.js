const ReactifyObject = require("./ReactifyObject")

function inject(Class, config) {
  ReactifyObject.inject(Class, config)
}

module.exports = {
  inject: inject
}
