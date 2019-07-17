import { toArray, assign } from '../../utilities'
import * as constants from '../../constants'

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
export const filterInvisibleDuplicates = (flippedElements) => {
  const elementDict = flippedElements
    .map((child: HTMLElement) => [child, child.getBoundingClientRect()])
    // try to resolve the case with multiple flipIds where some are in a display:none container
    .reduce((acc, curr) => {
      const flipId = curr[0].dataset.flipId
      if (acc[flipId]) {
        if (acc[flipId][1].width === 0 && acc[flipId][1].height === 0) {
          acc[flipId] = curr
        }
      } else acc[flipId] = curr
      return acc
    }, {})
  return Object.keys(elementDict).map(flipId => elementDict[flipId])
}
