# reactify-object

`reactify-object` is a event-driven tool use to reactify object by injecting accessors(getter/setter) into object according the given configuration.

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



