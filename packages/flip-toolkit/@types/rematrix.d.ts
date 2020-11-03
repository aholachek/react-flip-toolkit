declare module 'rematrix' {
  export function parse(string: string): number[]
  export function translateX(num: number): number[]
  export function translateY(num: number): number[]
  export function scaleX(num: number): number[]
  export function scaleY(num: number): number[]
  export function multiply(arr1: number[], arr2: number[]): number[]
}

