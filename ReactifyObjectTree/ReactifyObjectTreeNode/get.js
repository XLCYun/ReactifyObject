/**
 * Async function for get
 * Only called by function `get`
 */
async function getAsync() {
  try {
    let value = this.value
    let bindThis = this.isRoot ? this.object : this.parent.value

    let result = await this.beforeGet.call(bindThis, value)
    if (result !== undefined) value = result
    await this.event.emit("beforeGet", value).once

    result = await this.afterGet.call(bindThis, value)
    if (result !== undefined) value = result
    await this.event.emit("afterGet", value).once

    return value
  } catch (e) {
    throw e
  }
}

/**
 * Sync function for get
 * Only called by function `get`
 */
function getSync() {
  let value = this.value
  let bindThis = this.isRoot ? this.object : this.parent.value

  let result = this.beforeGet.call(bindThis, value)
  if (result !== undefined) value = result
  this.event.emit("beforeGet", value).once

  result = this.afterGet.call(bindThis, value)
  if (result !== undefined) value = result
  this.event.emit("afterGet", value).once

  return value
}

/**
 * getter for current node's value
 */
function get() {
  /**
   * 2020-03-02 Dispite 'async' mode, reading a properties will always return value directly
   * If you need a property that is compute by others properties, created it as a real property,
   * and register the dependcies and use update function to update its value.
   */
  return this.mode === "sync" ? getSync.call(this) : getSync.call(this)
}

module.exports = get
