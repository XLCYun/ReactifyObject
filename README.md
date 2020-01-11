# reactify-object

`reactify-object` is a event-driven, lazy-update and flexible tool use to reactify object by injecting accessors(getter/setter) into object according the given configuration.

`This README.md is not finished. More features have not revealed in here.`

## Installation

```
npm install --save reactify-object
```

## Getting Start

Let's say we have a config object like this:

```js
let config = {
  origin: { type: "string" }
}
```

Which tell us the object will have a property name `origin` and its type is "string". Now we also need a property name `clone` which will update and has same value of `origin`. That means every time `origin` changed, we need to updates its value to `origin` by giving `update` a function in config object like this:

```js
let config = {
  origin: { type: "string" },
  clone: {
    update: function() {
      this.clone = this.origin
    }
  }z
}
```

Then we register the dependence of these two properties in `init` function:

```js
let config = {
  origin: { type: "string" },
  clone: {
    init: function(self) {
      self.register(this.origin, "origin")
    },
    update: function() {
      this.clone = this.origin
    }
  }
}
```

Last step, call `inject` function to reactify the object:

```js
let object = {}
ReactifyObject.inject(object, config)
object.origin = "Origin"
console.log(object.clone)
```

Output:

```
Origin
```

value:

- Find from `copyFrom`
- Find from `object`
- Find from `default`
- undefined

First time to setup the tree, `$roTree.copyFrom` will be the value from the argument `copyFrom` that passed to the `inject` function.

```js
let object = { a: "value from object", b: 2 }
let copyFrom = { a: "value from copyFrom" }
let $roTree = ReactifyObject.inject(object, { a: {}, b: {} }, "root", null, copyFrom)
$roTree.children.a.copyFrom === "value from copyFrom" // true
$roTree.children.a.object === "value from object" // true
$roTree.children.b.object === 2 // true
$roTree.children.b.copyFrom === ReactifyObject.noValueSymbol // true
```

When you add a item to an array(through `splice`/`push`/`shift`), it's `ReactifyObjectTreeNode`'s copyFrom and object will be the same one, that is, the item:

```js
let object = { a: [0, 1, 2] }
let $roTree = ReactifyObject.inject(object, { a: { items: {} } }, "root", null)
object.a.push(3)
object.a.getTreeNodeByIndex(3).object === 3 // true
object.a.getTreeNodeByIndex(3).copyFrom === 3 // true
```


