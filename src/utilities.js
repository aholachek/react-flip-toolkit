export const isNumber = x => typeof x === "number"

export const isFunction = x => typeof x === "function"

export const isObject = x =>
  Object.prototype.toString.call(x) === "[object Object]"

export const toArray = arrayLike => Array.prototype.slice.apply(arrayLike)

export const getDuplicateValsAsStrings = arr => {
  const obj = arr.reduce((acc, curr) => {
    acc[curr] = acc[curr] ? acc[curr] + 1 : 1
    return acc
  }, {})
  return Object.keys(obj).filter(val => obj[val] > 1)
}

// adapted from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
export const assign = (target, ...args) => {
  for (var index = 0; index < args.length; index++) {
    var nextSource = args[index]

    if (nextSource != null) {
      // Skip over if undefined or null
      for (var nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          target[nextKey] = nextSource[nextKey]
        }
      }
    }
  }
  return target
}
