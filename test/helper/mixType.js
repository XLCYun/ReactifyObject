/* istanbul ignore file */

const number = [-1, 0, 1, Number.MAX_SAFE_INTEGER, Number.MAX_VALUE, Number.MIN_SAFE_INTEGER, Number.MIN_VALUE]
const float = [-1.1, 0, 1.1, 1.00000000001, -1.000000000001]
const string = ["", "string", ".", "/", "\t", "\n", "string\n", " string \t"]
const object = [null, new Array([1, 2, 3]), new Date(), /1/]
const functions = [new Function(), () => {}, function() {}]
const date = [new Date(), new Date("2019-12-27")]
const bizzard = [NaN, Infinity, -Infinity, undefined]

function getAll() {
  return number
    .concat(float)
    .concat(string)
    .concat(object)
    .concat(functions)
    .concat(date)
    .concat(bizzard)
}

module.exports = {
  getAll: getAll,
  number: number,
  float: float,
  string: string,
  object: object,
  functions: functions,
  date: date,
  bizzard: bizzard
}
