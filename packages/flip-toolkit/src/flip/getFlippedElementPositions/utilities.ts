import { toArray, assign } from '../../utilities'
import * as constants from '../../constants'
import { BoundingClientRect } from './types'

export const addTupleToObject = (acc: {}, curr: [any, any]) =>
  assign(acc, { [curr[0]]: curr[1] })

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
// if there are duplicate flipIds but some are display:none, we can safely ignore them
// this enables some optimizations and more complex animations
export const filterInvisibleElements = (flippedElements: HTMLElement[]) => {
  return (
    flippedElements
      .map((child: HTMLElement): [HTMLElement, BoundingClientRect] => [
        child,
        child.getBoundingClientRect()
      ])
      // @ts-ignore
      .filter(data => {
        return data[1].width + data[1].height !== 0
      })
  )
}
