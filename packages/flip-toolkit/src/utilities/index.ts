import { IndexableObject } from './types'

export const isNumber = (x: any) => typeof x === 'number'

export const isFunction = (x: any) => typeof x === 'function'

export const isObject = (x: any) =>
  Object.prototype.toString.call(x) === '[object Object]'

export const toArray = (arrayLike: ArrayLike<any>) =>
  Array.prototype.slice.apply(arrayLike)

export const getDuplicateValsAsStrings = (arr: string[]): string[] => {
  const baseObj: IndexableObject = {}
  const obj = arr.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1
    return acc
  }, baseObj)
  return Object.keys(obj).filter(val => obj[val] > 1)
}

// tslint only likes this with a regular function, not an arrow function
export function assign(target: IndexableObject, ...args: IndexableObject[]) {
  args.forEach(arg => {
    if (!arg) {
      return
    }
    // Skip over if undefined or null
    for (const nextKey in arg) {
      // Avoid bugs when hasOwnProperty is shadowed
      if (Object.prototype.hasOwnProperty.call(arg, nextKey)) {
        target[nextKey] = arg[nextKey]
      }
    }
  })
  return target
}

export const tweenProp = (start: number, end: number, position: number) =>
  start + (end - start) * position
