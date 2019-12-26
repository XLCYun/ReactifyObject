const type = require("./entries/type")
const bsonType = require("./entries/bsonType")
const beforeGet = require("./entries/beforeGet")
const afterGet = require("./entries/afterGet")
const beforeSet = require("./entries/beforeSet")
const afterSet = require("./entries/afterSet")
const update = require("./entries/update")
const beforeUpdate = require("./entries/beforeUpdate")
const afterUpdate = require("./entries/afterUpdate")
const mode = require("./entries/mode")
const init = require("./entries/init")

module.exports = {
  type,
  bsonType,
  beforeGet,
  afterGet,
  beforeSet,
  afterSet,
  update,
  beforeUpdate,
  afterUpdate,
  mode,
  init
}
