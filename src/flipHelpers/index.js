import * as Rematrix from "rematrix"
import springUpdate from "./springUpdate"
import tweenUpdate from "./tweenUpdate"
import { parseMatrix, convertMatrix3dArrayTo2dString } from "./matrixHelpers"

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
    debugger
    const matrixVals = parseMatrix(matrix)

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

const toArray = arrayLike => Array.prototype.slice.apply(arrayLike)

export const getFlippedElementPositions = ({ element, removeTransforms }) => {
  const flippedElements = toArray(element.querySelectorAll("[data-flip-id]"))

  const inverseFlippedElements = toArray(
    element.querySelectorAll("[data-inverse-flip-id]")
  )
  // allow fully interruptible animations by stripping inline style transforms
  // if we are reading the final position of the element
  // this should also fix the issue if rematrix applied an inline style
  // to a previous state of an element
  if (removeTransforms) {
    flippedElements.concat(inverseFlippedElements).forEach(el => {
      if (el.style.transform) el.style.transform = ""
    })
  }
  return flippedElements
    .map(child => [
      child.dataset.flipId,
      {
        rect: child.getBoundingClientRect(),
        opacity: parseFloat(window.getComputedStyle(child).opacity),
        flipComponentId: child.dataset.flipComponentId
      }
    ])
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
    removeTransforms: true
  })

  const getElement = id => containerEl.querySelector(`*[data-flip-id="${id}"]`)

  const isFlipped = id =>
    cachedFlipChildrenPositions[id] && newFlipChildrenPositions[id]

  // animate in any non-flipped elements that requested it
  Object.keys(newFlipChildrenPositions)
    .filter(id => !isFlipped(id))
    // filter to only brand new elements with an onAppear callback
    .filter(
      id =>
        newFlipChildrenPositions[id] &&
        flipCallbacks[id] &&
        flipCallbacks[id].onAppear
    )
    .forEach((id, i) => {
      flipCallbacks[id].onAppear(getElement(id), i)
    })

  Object.keys(newFlipChildrenPositions)
    .filter(isFlipped)
    .forEach(id => {
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
          Rematrix.scaleX(prevRect.width / Math.max(currentRect.width, 0.0001))
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

      debugger

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

      let onComplete = () => {}
      if (flipCallbacks[id] && flipCallbacks[id].onComplete) {
        // cache it in case it gets overridden if for instance
        // someone is rapidly toggling the animation back and forth
        const cachedOnComplete = flipCallbacks[id].onComplete
        onComplete = () => cachedOnComplete(element, flipStartId)
      }

      const delay = parseFloat(element.dataset.flipDelay)

      const onUpdate = stop => ({ matrix, opacity }) => {
        if (!body.contains(element)) {
          stop()
          return
        }
        applyStyles(element, { opacity, matrix })
        // for children that requested it, cancel out
        // the transform by applying the inverse transform
        invertTransformsForChildren(getInvertedChildren(element, id), matrix, {
          flipStartId,
          flipEndId
        })
      }

      let stop

      const onAnimationEnd = () => {
        delete inProgressAnimations[id]
        onComplete()
      }

      if (true) {
        stop = springUpdate({
          fromVals,
          toVals,
          delay,
          onUpdate,
          onAnimationEnd
        })
      } else {
        stop = tweenUpdate({
          fromVals,
          toVals,
          duration: parseFloat(element.dataset.flipDuration || duration),
          easing: element.dataset.flipEase || ease,
          delay,
          element,
          onUpdate,
          onAnimationEnd
        })
      }

      // in case we have to cancel
      inProgressAnimations[id] = {
        stop,
        onComplete
      }
    })

  return inProgressAnimations
}
