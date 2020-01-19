const _ = require("lodash")
const assert = require("assert")
const processConfig = require("../../../ReactifyObjectTree/ReactifyObjectTreeNode/processConfig")
const entry = require("../../../ReactifyObjectTree/entries/entry")
const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire(
  "../../../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode.js"
)

describe("processConfig", function() {
  let config = {
    a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
    a2: {}
  }
  let object = {}
  let treeNode = undefined

  beforeEach(function() {
    object = {}
    treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
  })

  it("functionality", function() {
    let oldEntry = _.clone(entry)

    let sum = 0
    entry.type = {
      preprocess: () => (sum += 1 << 0),
      process: () => (sum += 1 << 1)
    }
    entry.bsonType = {
      preprocess: () => (sum += 1 << 2),
      process: () => (sum += 1 << 3)
    }
    entry.beforeGet = {
      preprocess: () => (sum += 1 << 4),
      process: () => (sum += 1 << 5)
    }
    entry.afterGet = {
      preprocess: () => (sum += 1 << 6),
      process: () => (sum += 1 << 7)
    }
    entry.beforeSet = {
      preprocess: () => (sum += 1 << 8),
      process: () => (sum += 1 << 9)
    }
    entry.afterSet = {
      preprocess: () => (sum += 1 << 10),
      process: () => (sum += 1 << 11)
    }
    entry.update = {
      preprocess: () => (sum += 1 << 12),
      process: () => (sum += 1 << 13)
    }
    entry.beforeUpdate = {
      preprocess: () => (sum += 1 << 14),
      process: () => (sum += 1 << 15)
    }
    entry.afterUpdate = {
      preprocess: () => (sum += 1 << 16),
      process: () => (sum += 1 << 17)
    }
    entry.mode = {
      preprocess: () => (sum += 1 << 18),
      process: () => (sum += 1 << 19)
    }
    entry.init = {
      preprocess: () => (sum += 1 << 20),
      process: () => (sum += 1 << 21)
    }
    entry.properties = {
      preprocess: () => (sum += 1 << 22),
      process: () => (sum += 1 << 23)
    }

    processConfig.call(treeNode)
    assert.equal(sum, (1 << 24) - 1)

    for (let key of Object.keys(entry)) entry[key] = oldEntry[key]
  })

  it("illegal entry, should throw Error", function() {
    treeNode.config.illegalConfigEntry = 3
    assert.throws(() => processConfig.call(treeNode), Error)
  })

  describe("otherValidEntries will not throw Error", function() {
    let config = {}
    let object = {}
    let treeNode = {}

    beforeEach(function() {
      config = {
        a: { properties: { b: { properties: { c: { properties: {} }, c2: {} } }, b2: {} } },
        a2: {}
      }
      treeNode = undefined
      object = {}
      treeNode = new ReactifyObjectTreeNode.module(object, config, "", null)
    })

    it("clone is valid key, will not throw Error", function() {
      treeNode.config.properties.a.properties.b2.clone = e => e
      assert.doesNotThrow(() => processConfig.call(treeNode))
    })

    it("validator is valid key, will not throw Error", function() {
      treeNode.config.properties.a.properties.b2.validator = () => true
      assert.doesNotThrow(() => processConfig.call(treeNode))
    })

    it("compare is valid key, will not throw Error", function() {
      treeNode.config.properties.a.properties.b2.compare = () => true
      assert.doesNotThrow(() => processConfig.call(treeNode))
    })
  })
})
