import * as Rematrix from "rematrix"
import springUpdate from "./springUpdate"
import tweenUpdate from "./tweenUpdate"
import { interpolate } from "shifty/src/interpolate"
import { convertMatrix3dArrayTo2dArray } from "./matrixHelpers"
import { isNumber, isFunction, toArray } from "./typeHelpers"
import {
  getFlippedElementPositionsAfterUpdate,
  rectInViewport
} from "./DOMMeasurementHelpers"
import { createApplyStylesFunc } from "./styleHelpers"

const getInvertedChildren = (element, id) =>
  toArray(element.querySelectorAll(`[data-inverse-flip-id="${id}"]`))

const passesComponentFilter = (flipFilters, flipId) => {
  if (typeof flipFilters === "string") {
    if (flipFilters !== flipId) return false
  } else if (Array.isArray(flipFilters)) {
    if (!flipFilters.some(f => f === flipId)) {
      return false
    }
  }
  return true
}

export const shouldApplyTransform = (
  flipComponentIdFilter,
  flipStartId,
  flipEndId
) => {
  if (
    flipComponentIdFilter &&
    !passesComponentFilter(flipComponentIdFilter, flipStartId) &&
    !passesComponentFilter(flipComponentIdFilter, flipEndId)
  ) {
    return false
  }
  return true
}

/**
 * this is where the FLIP magic happens
 * it's called in the Flipper component's componentDidUpdate
 * @param {Object} args
 * @param {Object} args.inProgressAnimations
 * @param {Object} args.cachedFlipChildrenPositions
 * @param {Object} args.flipCallbacks
 * @param {HTMLElement} args.containerEl - the ref for the parent Flipper component
 * @param {Number} args.duration - optional duration, only relevant if an ease is also provided
 * @param {String} args.ease - optional
 * @param {Boolean} args.applyTransformOrigin
 * @param {Object} args.spring
 * @param {Boolean} args.debug
 */
export const animateMove = ({
  inProgressAnimations,
  cachedFlipChildrenPositions = {},
  flipCallbacks = {},
  containerEl,
  duration,
  ease,
  applyTransformOrigin,
  spring,
  debug
}) => {
  const body = document.querySelector("body")

  const newFlipChildrenPositions = getFlippedElementPositionsAfterUpdate({
    element: containerEl
  })

  const getElement = id => containerEl.querySelector(`*[data-flip-id="${id}"]`)
  const isFlipped = id =>
    cachedFlipChildrenPositions[id] && newFlipChildrenPositions[id]

  // to help sequence onExit and onDelayedAppear callbacks
  const exitingElements = []
  const onDelayedAppearCallbacks = []

  const onElementExited = element => {
    // prevent duplicate calls
    if (!exitingElements.length) return
    const elementIndex = exitingElements.indexOf(element)
    if (elementIndex !== -1) {
      exitingElements.splice(elementIndex, 1)
      if (!exitingElements.length) {
        onDelayedAppearCallbacks.forEach(c => c())
      }
    }
  }

  // onAppear for non-flipped elements
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
      const element = getElement(id)
      flipCallbacks[id].onAppear(element, i)
    })

  // onDelayedAppear for non-flipped elements
  Object.keys(newFlipChildrenPositions)
    .filter(id => !isFlipped(id))
    // filter to only brand new elements with an onAppear callback
    .filter(
      id =>
        newFlipChildrenPositions[id] &&
        flipCallbacks[id] &&
        flipCallbacks[id].onDelayedAppear
    )
    .forEach((id, i) => {
      const element = getElement(id)
      element.style.opacity = "0"

      onDelayedAppearCallbacks.push(() => {
        flipCallbacks[id].onDelayedAppear(element, i)
      })
    })

  const fragmentTuples = []
  // we need to wait to trigger onExit callbacks until the elements are
  // back in the DOM, so store them here and call them after the fragments
  // have been appended
  const exitCallbacks = []

  // onExit for non-flipped elements
  Object.keys(cachedFlipChildrenPositions)
    .filter(id => !isFlipped(id))
    // filter to only exited elements with an onExit callback
    .filter(
      id =>
        cachedFlipChildrenPositions[id] &&
        flipCallbacks[id] &&
        flipCallbacks[id].onExit
    )
    .forEach((id, i) => {
      const {
        domData: {
          element,
          parent,
          childPosition: { top, left, width, height }
        }
      } = cachedFlipChildrenPositions[id]
      // insert back into dom
      if (getComputedStyle(parent).position === "static") {
        parent.style.position = "relative"
      }
      element.style.position = "absolute"
      element.style.top = top + "px"
      element.style.left = left + "px"
      // taken out of the dom flow, the element might have lost these dimensions
      element.style.height = height + "px"
      element.style.width = width + "px"
      let fragmentTuple = fragmentTuples.filter(t => t[0] === parent)[0]
      if (!fragmentTuple) {
        fragmentTuple = [parent, document.createDocumentFragment()]
        fragmentTuples.push(fragmentTuple)
      }
      fragmentTuple[1].appendChild(element)

      exitingElements.push(element)

      const stop = () => {
        try {
          onElementExited(element)
          parent.removeChild(element)
        } catch (DOMException) {
          // the element is already gone
        }
      }
      exitCallbacks.push(() => flipCallbacks[id].onExit(element, i, stop))
      inProgressAnimations[id] = { stop }
    })

  // now append all the fragments from the onExit callbacks
  // (we use fragments for performance)
  fragmentTuples.forEach(t => {
    const parent = t[0]
    const fragment = t[1]
    parent.appendChild(fragment)
  })

  exitCallbacks.forEach(c => c())

  // if nothing exited, just call onDelayedAppear callbacks immediately
  if (exitingElements.length === 0) {
    onDelayedAppearCallbacks.forEach(c => c())
  }

  if (debug) {
    console.error(
      'The "debug" prop is set to true. All FLIP animations will return at the beginning of the transition.'
    )
  }

  // finally, let's FLIP the rest
  Object.keys(newFlipChildrenPositions)
    .filter(isFlipped)
    // take all the measurements we need
    // do all the set up work
    // and return a startAnimation function
    .map(id => {
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

      // this might happen if we are rapidly adding & removing elements(?)
      if (!element) return

      const flipConfig = JSON.parse(element.dataset.flipConfig)

      const flipStartId = cachedFlipChildrenPositions[id].flipComponentId
      const flipEndId = flipConfig.componentId

      if (
        !shouldApplyTransform(
          flipConfig.componentIdFilter,
          flipStartId,
          flipEndId
        )
      )
        return

      const currentTransform = Rematrix.parse(
        newFlipChildrenPositions[id].transform
      )

      const toVals = { matrix: currentTransform }

      const fromVals = {}
      const transformsArray = [currentTransform]

      // we're only going to animate the values that the child wants animated
      if (flipConfig.translate) {
        transformsArray.push(
          Rematrix.translateX(prevRect.left - currentRect.left)
        )
        transformsArray.push(
          Rematrix.translateY(prevRect.top - currentRect.top)
        )
      }

      if (flipConfig.scale) {
        transformsArray.push(
          Rematrix.scaleX(prevRect.width / Math.max(currentRect.width, 0.01))
        )
        transformsArray.push(
          Rematrix.scaleY(prevRect.height / Math.max(currentRect.height, 0.01))
        )
      }

      if (flipConfig.opacity) {
        fromVals.opacity = prevOpacity
        toVals.opacity = currentOpacity
      }

      if (flipConfig.transformOrigin) {
        element.style.transformOrigin = flipConfig.transformOrigin
      } else if (applyTransformOrigin) {
        element.style.transformOrigin = "0 0"
      }

      // we're going to pass around the children in this weird [child, childData]
      // structure because we only want to parse the children's config data 1x
      const invertedChildren = getInvertedChildren(element, id)
        .map(c => [c, JSON.parse(c.dataset.flipConfig)])
        .filter(([child, childFlipConfig]) =>
          shouldApplyTransform(
            childFlipConfig.componentIdFilter,
            flipStartId,
            flipEndId
          )
        )

      invertedChildren.forEach(([child, childFlipConfig]) => {
        if (childFlipConfig.transformOrigin) {
          child.style.transformOrigin = childFlipConfig.transformOrigin
        } else if (applyTransformOrigin) {
          child.style.transformOrigin = "0 0"
        }
      })

      fromVals.matrix = transformsArray.reduce(Rematrix.multiply)

      fromVals.matrix = convertMatrix3dArrayTo2dArray(fromVals.matrix)
      toVals.matrix = convertMatrix3dArrayTo2dArray(toVals.matrix)

      const applyStyles = createApplyStylesFunc({
        element,
        invertedChildren,
        body
      })

      let onComplete
      if (flipCallbacks[id] && flipCallbacks[id].onComplete) {
        onComplete = () => flipCallbacks[id].onComplete(element, flipStartId)
      }

      const delay = parseFloat(flipConfig.delay)

      // this should be called when animation ends naturally
      // but also when it is interrupted
      // when it is called, the animation has already been cancelled
      const onAnimationEnd = () => {
        delete inProgressAnimations[id]
        isFunction(onComplete) && onComplete()
      }

      let easingType
      if (flipConfig.spring) easingType = "spring"
      else if (flipConfig.ease) easingType = "tween"
      else if (ease) easingType = "tween"
      else easingType = "spring"

      const animateOpacity =
        isNumber(fromVals.opacity) && fromVals.opacity !== toVals.opacity

      const getOnUpdateFunc = stop => ({ currentValue }) => {
        if (!body.contains(element)) {
          stop()
          return
        }
        const vals = {
          matrix: interpolate(fromVals.matrix, toVals.matrix, currentValue)
        }
        if (animateOpacity) {
          // interpolate requires an object
          vals.opacity = interpolate(
            { opacity: fromVals.opacity },
            { opacity: toVals.opacity },
            currentValue
          ).opacity
        }
        applyStyles(vals)
      }

      return function startAnimation() {
        // before animating, immediately apply FLIP styles to prevent flicker
        applyStyles({
          matrix: fromVals.matrix,
          opacity: animateOpacity && fromVals.opacity
        })

        if (debug) return

        if (flipCallbacks[id] && flipCallbacks[id].onStart)
          flipCallbacks[id].onStart(element, flipStartId)

        let stop

        if (easingType === "spring") {
          stop = springUpdate({
            springConfig: flipConfig.spring || spring,
            delay,
            getOnUpdateFunc,
            onAnimationEnd
          })
        } else {
          stop = tweenUpdate({
            duration: parseFloat(flipConfig.duration || duration),
            easing: flipConfig.ease || ease,
            delay,
            getOnUpdateFunc,
            onAnimationEnd
          })
        }

        // in case we have to cancel
        inProgressAnimations[id] = {
          stop,
          onComplete
        }
      }
    })
    // actually start updating the DOM
    // do this last to attempt to thwart the layout thrashing demon
    // not every item in the array will have returned a startAnimation func
    .forEach(startAnimation => startAnimation && startAnimation())
}
