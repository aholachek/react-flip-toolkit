import { addTupleToObject, getAllElements, getRects } from '../utilities'
import * as constants from '../../../constants'
import { toArray, assign } from '../../../utilities'
import {
  FlippedElementPositionsBeforeUpdateReturnVals,
  FlippedElementPositionDatumBeforeUpdate,
  GetFlippedElementPositionsBeforeUpdateArgs,
  ParentBCRs,
  ChildIdsToParentBCRs,
  ChildIdsToParents
} from './types'
import { InProgressAnimations } from '../../../types'

export const cancelInProgressAnimations = (
  inProgressAnimations: InProgressAnimations,
  animatingElements: HTMLElement[]
) => {
  Object.keys(inProgressAnimations).forEach(id => {
    if (inProgressAnimations[id].destroy) {
      inProgressAnimations[id].destroy!()
    }
    if (inProgressAnimations[id].onAnimationEnd) {
      inProgressAnimations[id].onAnimationEnd!(true)
    }
    delete inProgressAnimations[id]
  })
  animatingElements.forEach(el => {
    el.style.transform = ''
    el.style.opacity = ''
  })
}

const getFlippedElementPositionsBeforeUpdate = ({
  element,
  flipCallbacks = {},
  inProgressAnimations = {},
  portalKey
}: GetFlippedElementPositionsBeforeUpdateArgs): FlippedElementPositionsBeforeUpdateReturnVals => {
  const flippedElements = getAllElements(element, portalKey)

  const inverseFlippedElements = toArray(
    element.querySelectorAll(`[${constants.DATA_INVERSE_FLIP_ID}]`)
  )

  const childIdsToParentBCRs: ChildIdsToParentBCRs = {}
  const parentBCRs: ParentBCRs = []
  const childIdsToParents: ChildIdsToParents = {}
  // this is for exit animations so we can re-insert exiting elements in the
  // DOM later
  flippedElements
    .filter(
      el =>
        flipCallbacks &&
        flipCallbacks[el.dataset.flipId!] &&
        flipCallbacks[el.dataset.flipId!].onExit
    )
    .forEach(el => {
      let parent = el.parentNode as HTMLElement
      // this won't work for IE11
      if (el.closest) {
        const exitContainer = el.closest(
          `[${constants.DATA_EXIT_CONTAINER}]`
        ) as HTMLElement
        if (exitContainer) {
          parent = exitContainer
        }
      }
      let bcrIndex = parentBCRs.findIndex(n => n[0] === parent)
      if (bcrIndex === -1) {
        parentBCRs.push([parent, parent.getBoundingClientRect()])
        bcrIndex = parentBCRs.length - 1
      }
      childIdsToParentBCRs[el.dataset.flipId!] = parentBCRs[bcrIndex][1]
      childIdsToParents[el.dataset.flipId!] = parent
    })

  const filteredFlippedElements = getRects(flippedElements)

  const flippedElementPositionsTupleArray: [
    string,
    FlippedElementPositionDatumBeforeUpdate
  ][] = filteredFlippedElements.map(([child, childBCR]) => {
    const domDataForExitAnimations = {}

    // only cache extra data for exit animations
    // if the element has an onExit listener
    if (
      flipCallbacks &&
      flipCallbacks[child.dataset.flipId!] &&
      flipCallbacks[child.dataset.flipId!].onExit
    ) {
      const parentBCR = childIdsToParentBCRs[child.dataset.flipId!]

      assign(domDataForExitAnimations, {
        element: child,
        parent: childIdsToParents[child.dataset.flipId!],
        childPosition: {
          top: childBCR.top - parentBCR.top,
          left: childBCR.left - parentBCR.left,
          width: childBCR.width,
          height: childBCR.height
        }
      })
    }

    return [
      child.dataset.flipId!,
      {
        rect: childBCR,
        opacity: parseFloat(window.getComputedStyle(child).opacity || '1'),
        domDataForExitAnimations
      }
    ]
  }) as [string, FlippedElementPositionDatumBeforeUpdate][]

  const flippedElementPositions = flippedElementPositionsTupleArray.reduce(
    addTupleToObject,
    {}
  )

  // do this at the very end since we want to cache positions of elements
  // while they are mid-transition
  cancelInProgressAnimations(
    inProgressAnimations,
    flippedElements.concat(inverseFlippedElements)
  )

  return {
    flippedElementPositions,
    cachedOrderedFlipIds: filteredFlippedElements.map(
      ([el]) => el.dataset.flipId!
    )
  }
}

export default getFlippedElementPositionsBeforeUpdate
