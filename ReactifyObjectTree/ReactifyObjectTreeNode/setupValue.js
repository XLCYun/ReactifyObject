const deferRequire = require("defer-require")
const ReactifyObjectTreeNode = deferRequire("./ReactifyObjectTreeNode.js")

function setupValue() {
  if (this.isLeaf === false) {
    this.value = {
      $roTree: this,
      $set: ReactifyObjectTreeNode.module.set,
      $register: ReactifyObjectTreeNode.module.register
    }
    this.value.$set = ReactifyObjectTreeNode.module.set
    this.value

    Object.defineProperty(this.value, "$register", {
      get: function() {
        return this.$roTree.register
      }
    })

    let keys = Object.keys(this.config.properties)
    for (let key of keys) {
      this.children[key] = new ReactifyObjectTreeNode.module(
        this.object && this.object[key] !== undefined ? this.object[key] : undefined,
        this.config.properties[key],
        key,
        this
      )
      // 构造 getter/setter
      Object.defineProperty(this.value, key, {
        get: () => this.get,
        set: value => {
          if (this.mode === "async")
            throw new Error("Async mode property, should not use setter, use $set function to change its value.")
          this.set(value)
        }
      })
    }
  } else if (this.object === undefined) this.value = undefined
  else if (this.validator(this.object) === false) throw TypeError(`${this.path} cannot initiated by ${this.object}`)
  else this.value = this.object
}

module.exports = setupValue
