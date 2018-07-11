import { toArray } from "./typeHelpers"

const cancelInProgressAnimations = inProgressAnimations => {
  Object.keys(inProgressAnimations).forEach(id => {
    if (inProgressAnimations[id].stop) inProgressAnimations[id].stop()
    delete inProgressAnimations[id]
  })
}

// called in getSnapshotBeforeUpdate
export const getFlippedElementPositionsBeforeUpdate = ({
  element,
  flipCallbacks,
  inProgressAnimations
}) => {
  const flippedElements = toArray(element.querySelectorAll("[data-flip-id]"))
  const inverseFlippedElements = toArray(
    element.querySelectorAll("[data-inverse-flip-id]")
  )

  const childIdsToParentBCRs = {}
  const parentBCRs = []
  // this is for exit animations so we can re-insert exiting elements in the
  // DOM later
  flippedElements
    .filter(
      el =>
        flipCallbacks &&
        flipCallbacks[el.dataset.flipId] &&
        flipCallbacks[el.dataset.flipId].onExit
    )
    .forEach(el => {
      const parent = el.parentNode
      let bcrIndex = parentBCRs.findIndex(n => n[0] === parent)
      if (bcrIndex === -1) {
        parentBCRs.push([parent, parent.getBoundingClientRect()])
        bcrIndex = parentBCRs.length - 1
      }
      childIdsToParentBCRs[el.dataset.flipId] = parentBCRs[bcrIndex][1]
    })

  const flippedElementPositions = flippedElements
    .map(child => {
      let domData = {}
      const childBCR = child.getBoundingClientRect()

      if (
        flipCallbacks &&
        flipCallbacks[child.dataset.flipId] &&
        flipCallbacks[child.dataset.flipId].onExit
      ) {
        const parentBCR = childIdsToParentBCRs[child.dataset.flipId]

        Object.assign(domData, {
          element: child,
          parent: child.parentNode,
          childPosition: {
            top: childBCR.top - parentBCR.top,
            left: childBCR.left - parentBCR.left,
            width: childBCR.width,
            height: childBCR.height
          }
        })
      }

      return [
        child.dataset.flipId,
        {
          rect: childBCR,
          opacity: parseFloat(window.getComputedStyle(child).opacity),
          flipComponentId: child.dataset.flipComponentId,
          domData
        }
      ]
    })
    .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})

  // do this at the very end since we want to cache positions of elements
  // while they are mid-transition
  cancelInProgressAnimations(inProgressAnimations)
  flippedElements.concat(inverseFlippedElements).forEach(el => {
    el.style.transform = ""
    el.style.opacity = ""
  })

  return flippedElementPositions
}

// called in animateMove (which is called in componentDidUpdate)
export const getFlippedElementPositionsAfterUpdate = ({ element }) => {
  return toArray(element.querySelectorAll("[data-flip-id]"))
    .map(child => {
      const computedStyle = window.getComputedStyle(child)
      return [
        child.dataset.flipId,
        {
          rect: child.getBoundingClientRect(),
          opacity: parseFloat(computedStyle.opacity),
          domData: {},
          transform: computedStyle.transform
        }
      ]
    })
    .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})
}

export const rectInViewport = ({ top, bottom, left, right }) => {
  return (
    top < window.innerHeight &&
    bottom > 0 &&
    left < window.innerWidth &&
    right > 0
  )
}
