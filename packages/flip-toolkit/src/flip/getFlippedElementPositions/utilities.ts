import { toArray, assign } from '../../utilities/index.js'
import * as constants from '../../constants.js'
import { BoundingClientRect } from './types.js'

export const addTupleToObject = <T>(
  acc: Record<string, T>,
  curr: [string, T]
): Record<string, T> => assign(acc, { [curr[0]]: curr[1] })

export const getAllElements = (
  element?: HTMLElement,
  portalKey?: string
): HTMLElement[] => {
  if (portalKey) {
    return toArray(
      document.querySelectorAll(`[${constants.DATA_PORTAL_KEY}="${portalKey}"]`)
    )
  } else {
    return toArray(element!.querySelectorAll(`[${constants.DATA_FLIP_ID}]`))
  }
}
export const getRects = (
  flippedElements: HTMLElement[]
): [HTMLElement, BoundingClientRect][] => {
  return flippedElements.map(
    (child: HTMLElement): [HTMLElement, BoundingClientRect] => [
      child,
      child.getBoundingClientRect()
    ]
  )
}
