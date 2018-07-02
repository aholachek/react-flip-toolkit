import { Tweenable } from "shifty"
import * as Rematrix from "rematrix"

// animejs' influence
Tweenable.formulas.easeOutElastic = function(t) {
  var p = 0.99
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
}

Tweenable.formulas.easeOutElasticBig = function(t) {
  var p = 0.6
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
}

const getInvertedChildren = (element, id) =>
  [].slice.call(element.querySelectorAll(`[data-inverse-flip-id="${id}"]`))

const passesComponentFilter = (flipFilters, flipId) => {
  if (typeof flipFilters === "string") {
    flipFilters = flipFilters.split(",").filter(x => x)
    if (!flipFilters.some(f => f === flipId)) {
      return false
    }
  }
  return true
}

// 3d transforms were causing weird issues in chrome,
// especially when opacity was also being tweened,
// so convert to a 2d matrix
const convertMatrix3dArrayTo2dString = matrix =>
  `matrix(${[
    matrix[0],
    matrix[1],
    matrix[4],
    matrix[5],
    // translation X
    matrix[12],
    // translation Y
    matrix[13]
  ].join(", ")})`

const applyStyles = (element, { matrix, opacity }) => {
  element.style.transform = matrix
  element.style.opacity = opacity
}

const shouldApplyTransform = (element, flipStartId, flipEndId) => {
  if (
    element.dataset.flipComponentIdFilter &&
    !passesComponentFilter(
      element.dataset.flipComponentIdFilter,
      flipStartId
    ) &&
    !passesComponentFilter(element.dataset.flipComponentIdFilter, flipEndId)
  ) {
    return false
  }
  return true
}

// if we're scaling an element and we have element children with data-inverse-flip-ids,
// apply the inverse of the transforms so that the children don't distort
const invertTransformsForChildren = (
  childElements,
  matrix,
  { flipStartId, flipEndId } = {}
) => {
  childElements.forEach(child => {
    if (!shouldApplyTransform(child, flipStartId, flipEndId)) return

    const matrixVals = matrix.match(/-?\d+\.?\d*/g).map(parseFloat)

    const scaleX = matrixVals[0]
    const scaleY = matrixVals[3]
    const translateX = matrixVals[4]
    const translateY = matrixVals[5]

    const inverseVals = { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 }
    let transformString = ""
    if (child.dataset.flipTranslate) {
      inverseVals.translateX = -translateX / scaleX
      inverseVals.translateY = -translateY / scaleY
      transformString += `translate(${inverseVals.translateX}px, ${
        inverseVals.translateY
      }px)`
    }
    if (child.dataset.flipScale) {
      inverseVals.scaleX = 1 / scaleX
      inverseVals.scaleY = 1 / scaleY
      transformString += ` scale(${inverseVals.scaleX}, ${inverseVals.scaleY})`
    }
    child.style.transform = transformString
  })
}

export const getEasingName = (flippedEase, flipperEase) => {
  let easeToApply = flippedEase || flipperEase

  if (!Tweenable.formulas[easeToApply]) {
    console.error(
      `${easeToApply} was not recognized as a valid easing option, falling back to easeOutSine`
    )
    easeToApply = "easeOutSine"
  }
  return easeToApply
}

export const getFlippedElementPositions = ({
  element,
  flipCallbacks,
  onUpdate
}) => {
  const flippedElements = [].slice.apply(
    element.querySelectorAll("[data-flip-id]")
  )

  const inverseFlippedElements = [].slice.apply(
    element.querySelectorAll("[data-inverse-flip-id]")
  )
  // allow fully interruptible animations by stripping inline style transforms
  // if we are reading the final position of the element
  // this should also fix the issue if rematrix applied an inline style
  // to a previous state of an element
  if (onUpdate) {
    flippedElements.concat(inverseFlippedElements).forEach(el => {
      if (el.style.transform) el.style.transform = ""
    })
  } else {
    // this is all for exit animations so we can re-insert exiting elements in the
    // DOM later
    const nodesByParent = {}
    flippedElements
      .filter(el => flipCallbacks && flipCallbacks[el.dataset.flipId].onExit)
      .forEach(el => {
        if (nodesByParent[el.parentNode]) nodesByParent[el.parentNode].push(el)
        else nodesByParent[el.parentNode] = [el]
      })

    Object.keys(nodesByParent).forEach(p => {
      nodesByParent[p].forEach((el, i) => (el.dataset.flipIndex = i))
    })
  }

  return flippedElements
    .map(child => {
      let domData = {}
      if (
        !onUpdate &&
        flipCallbacks &&
        flipCallbacks[child.dataset.flipId].onExit
      ) {
        Object.assign(domData, {
          element: child,
          parent: child.parentNode
        })
      }

      return [
        child.dataset.flipId,
        {
          rect: child.getBoundingClientRect(),
          opacity: parseFloat(window.getComputedStyle(child).opacity),
          flipComponentId: child.dataset.flipComponentId,
          domData
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

export const animateMove = ({
  inProgressAnimations = {},
  cachedFlipChildrenPositions = {},
  flipCallbacks = {},
  containerEl,
  duration,
  ease,
  applyTransformOrigin
}) => {
  const body = document.querySelector("body")
  const newFlipChildrenPositions = getFlippedElementPositions({
    element: containerEl,
    inProgressAnimations,
    onUpdate: true
  })

  const getElement = id => containerEl.querySelector(`*[data-flip-id="${id}"]`)

  const isFlipped = id =>
    cachedFlipChildrenPositions[id] && newFlipChildrenPositions[id]

  const appearingElementIds = Object.keys(newFlipChildrenPositions)
    .filter(id => !isFlipped(id))
    .filter(
      id =>
        newFlipChildrenPositions[id] &&
        flipCallbacks[id] &&
        flipCallbacks[id].onAppear
    )

  appearingElementIds.forEach(id => (getElement(id).style.display = "none"))

  // onExit callback
  const exitingElements = Object.keys(cachedFlipChildrenPositions)
    .filter(id => !isFlipped(id))
    .filter(
      id =>
        cachedFlipChildrenPositions[id] &&
        cachedFlipChildrenPositions[id].domData &&
        flipCallbacks[id] &&
        flipCallbacks[id].onExit
    )

  const parentNodes = Array.from(
    new Set(
      exitingElements.map(id => cachedFlipChildrenPositions[id].domData.parent)
    )
  )

  // not going to happen too often, but make sure to handle updates
  // when elements left multiple different parents in the DOM
  const groupedExitingElements = parentNodes.map(p =>
    exitingElements.filter(
      id => cachedFlipChildrenPositions[id].domData.parent === p
    )
  )

  const exitPromises = []
  const exitRemovalCallbacks = []

  // called when onExit animation completes
  const removeElement = (el, resolve) => () => {
    exitRemovalCallbacks.push(() => el.parentNode.removeChild(el))
    resolve && resolve()
  }

  groupedExitingElements.forEach(childArray => {
    childArray
      .sort((a, b) => {
        const aIndex =
          cachedFlipChildrenPositions[a].domData.element.dataset.flipIndex
        const bIndex =
          cachedFlipChildrenPositions[b].domData.element.dataset.flipIndex
        return aIndex - bIndex
      })
      // insert back into the DOM
      .map(id => {
        const { element, parent } = cachedFlipChildrenPositions[id].domData
        const prevElement = parent.querySelector(
          `[data-flip-index="${parseInt(element.dataset.flipIndex) - 1}"]`
        )
        if (!prevElement) {
          parent.insertBefore(element, parent.firstChild)
        } else if (parent.contains(prevElement)) {
          parent.insertBefore(element, prevElement.nextSibling)
        }
        return { id, element }
      })
      // wait until all exiting elements have been put back in the DOM
      .forEach(({ id, element }, i) => {
        let r
        exitPromises.push(
          new Promise(resolve => {
            r = resolve
          })
        )
        flipCallbacks[id].onExit(element, i, removeElement(element, r))
        // in case we have to cancel
        inProgressAnimations[id] = {
          stop: () => removeElement(element)
        }
      })
  })

  Promise.all(exitPromises)
    .then(() => {
      exitRemovalCallbacks.forEach(f => f())
      // now, we need appearing elements to be back in the DOM flow
      // but still invisible
      appearingElementIds.forEach(id => {
        const el = getElement(id)
        el.style.opacity = "0"
        el.style.display = ""
      })
    })
    .then(() => {
      const tweenPromises = []
      Object.keys(newFlipChildrenPositions)
        .filter(isFlipped)
        .forEach((id, i) => {
          const prevRect = cachedFlipChildrenPositions[id].rect
          const currentRect = newFlipChildrenPositions[id].rect
          const prevOpacity = cachedFlipChildrenPositions[id].opacity
          const currentOpacity = newFlipChildrenPositions[id].opacity
          // don't animate invisible elements
          if (!rectInViewport(prevRect) && !rectInViewport(currentRect)) {
            return
          }
          // don't animate elements that didn't change
          if (
            prevRect.left === currentRect.left &&
            prevRect.top === currentRect.top &&
            prevRect.width === currentRect.width &&
            prevRect.height === currentRect.height &&
            prevOpacity === currentOpacity
          ) {
            return
          }

          const element = getElement(id)

          const flipStartId = cachedFlipChildrenPositions[id].flipComponentId
          const flipEndId = element.dataset.flipComponentId

          if (!shouldApplyTransform(element, flipStartId, flipEndId)) return

          if (inProgressAnimations[id]) {
            inProgressAnimations[id].stop()

            inProgressAnimations[id].onComplete &&
              inProgressAnimations[id].onComplete()
            delete inProgressAnimations[id]
          }

          const currentTransform = Rematrix.parse(
            getComputedStyle(element)["transform"]
          )

          const toVals = { matrix: currentTransform, opacity: 1 }

          const fromVals = { opacity: 1 }
          const transformsArray = [currentTransform]
          // we're only going to animate the values that the child wants animated,
          // based on its data-* attributes
          if (element.dataset.flipTranslate) {
            transformsArray.push(
              Rematrix.translateX(prevRect.left - currentRect.left)
            )
            transformsArray.push(
              Rematrix.translateY(prevRect.top - currentRect.top)
            )
          }

          if (element.dataset.flipScale) {
            transformsArray.push(
              Rematrix.scaleX(
                prevRect.width / Math.max(currentRect.width, 0.0001)
              )
            )
            transformsArray.push(
              Rematrix.scaleY(
                prevRect.height / Math.max(currentRect.height, 0.0001)
              )
            )
          }

          if (element.dataset.flipOpacity) {
            fromVals.opacity = prevOpacity
            toVals.opacity = currentOpacity
          }

          // transform-origin normalization
          if (element.dataset.transformOrigin) {
            element.style.transformOrigin = element.dataset.transformOrigin
          } else if (applyTransformOrigin) {
            element.style.transformOrigin = "0 0"
          }

          getInvertedChildren(element, id).forEach(child => {
            if (child.dataset.transformOrigin) {
              child.style.transformOrigin = child.dataset.transformOrigin
            } else if (applyTransformOrigin) {
              child.style.transformOrigin = "0 0"
            }
          })

          fromVals.matrix = transformsArray.reduce(Rematrix.multiply)

          // prepare for animation by turning matrix into a string
          fromVals.matrix = convertMatrix3dArrayTo2dString(fromVals.matrix)
          toVals.matrix = convertMatrix3dArrayTo2dString(toVals.matrix)

          // before animating, immediately apply FLIP styles to prevent flicker
          applyStyles(element, fromVals)
          invertTransformsForChildren(
            getInvertedChildren(element, id),
            fromVals.matrix,
            {
              flipStartId,
              flipEndId
            }
          )

          if (flipCallbacks[id] && flipCallbacks[id].onStart)
            flipCallbacks[id].onStart(element, flipStartId)

          let onComplete
          if (flipCallbacks[id] && flipCallbacks[id].onComplete) {
            // cache it in case it gets overridden if for instance
            // someone is rapidly toggling the animation back and forth
            const cachedOnComplete = flipCallbacks[id].onComplete
            onComplete = () => cachedOnComplete(element, flipStartId)
          }

          // now start the animation
          const tweenable = new Tweenable()

          tweenable.setConfig({
            from: fromVals,
            to: toVals,
            duration: parseFloat(element.dataset.flipDuration || duration),
            easing: {
              opacity: "linear",
              matrix: getEasingName(element.dataset.flipEase, ease)
            },
            delay: flipCallbacks[id].delay(i),
            step: ({ matrix, opacity }) => {
              if (!body.contains(element)) {
                tweenable.stop()
                return
              }
              applyStyles(element, { opacity, matrix })

              // for children that requested it, cancel out
              // the transform by applying the inverse transform
              invertTransformsForChildren(
                getInvertedChildren(element, id),
                matrix,
                {
                  flipStartId,
                  flipEndId
                }
              )
            }
          })

          let r

          tweenPromises.push(
            new Promise(resolve => {
              r = resolve
            })
          )

          tweenable
            .tween()
            .then(() => {
              delete inProgressAnimations[id]
              onComplete()
              r()
            })
            .catch(e => {
              // unclear why this would error but it happened a few times
            })

          // in case we have to cancel
          inProgressAnimations[id] = {
            stop: tweenable.stop.bind(tweenable),
            onComplete
          }
        })
      return Promise.all(tweenPromises)
    })
    .then(() => {
      appearingElementIds.forEach((id, i) => {
        debugger
        const element = getElement(id)
        element.style.opacity = ""
        flipCallbacks[id].onAppear(element, i)
      })
    })
}
