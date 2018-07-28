export const isNumber = x => typeof x === "number"
export const isFunction = x => typeof x === "function"
export const isObject = x =>
  Object.prototype.toString.call(x) === "[object Object]"
export const toArray = arrayLike => Array.prototype.slice.apply(arrayLike)
