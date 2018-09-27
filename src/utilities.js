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

export const assign = (target, ...args) => {
  args.forEach(arg => {
    if (!arg) return
    // Skip over if undefined or null
    for (var nextKey in arg) {
      // Avoid bugs when hasOwnProperty is shadowed
      if (Object.prototype.hasOwnProperty.call(arg, nextKey)) {
        target[nextKey] = arg[nextKey]
      }
    }
  })
  return target
}
