const assert = require("assert")
const ReactifyObject = require("../ReactifyObject")
const entry = require("../ReactifyObjectTree/entries/entry")
const compare = require("../compare/compare")
const validator = require("../validator/validator")
const ReactifyObjectTreeNode = require("../ReactifyObjectTree/ReactifyObjectTreeNode/ReactifyObjectTreeNode")
describe("ReactifyObject", function() {
  it("entry refers to entry module", function() {
    assert.equal(entry, ReactifyObject.entry)
  })

  it("validator refers to validator module", function() {
    assert.equal(validator, ReactifyObject.validator)
  })

  it("compare refers to compare module", function() {
    assert.equal(compare, ReactifyObject.compare)
  })

  it("inject function", function() {
    let config = {
      a: { properties: { b: {}, c: {} } },
      a2: { properties: { b2: {}, c2: {} } }
    }
    let object = { a: { b: "b", c: "c" }, a2: { b2: "b2", c2: "c2" } }
    let treeNode = ReactifyObject.inject(object, config)
    assert.ok(treeNode instanceof ReactifyObjectTreeNode)
    assert.equal(object.a, treeNode.children.a.value)
    assert.equal(object.a2, treeNode.children.a2.value)
  })
})
