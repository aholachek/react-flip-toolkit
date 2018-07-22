import * as Rematrix from "rematrix"
import springUpdate from "./spring"
import tweenUpdate from "./tween"
import { toArray, isFunction, isNumber } from "../utilities"

// 3d transforms were causing weird issues in chrome,
// especially when opacity was also being tweened,
// so convert to a 2d matrix
export const convertMatrix3dArrayTo2dArray = matrix => [
  // scale X
  matrix[0],
  matrix[1],
  // scale Y
  matrix[4],
  matrix[5],
  // translation X
  matrix[12],
  // translation Y
  matrix[13]
]

export const convertMatrix2dArrayToString = matrix =>
  `matrix(${[
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5]
  ].join(", ")})`

export const invertTransformsForChildren = ({
  invertedChildren,
  matrix,
  body
}) => {
  invertedChildren.forEach(([child, childFlipConfig]) => {
    if (!body.contains(child)) {
      return
    }

    const scaleX = matrix[0]
    const scaleY = matrix[3]
    const translateX = matrix[4]
    const translateY = matrix[5]

    const inverseVals = { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 }
    let transformString = ""
    if (childFlipConfig.translate) {
      inverseVals.translateX = -translateX / scaleX
      inverseVals.translateY = -translateY / scaleY
      transformString += `translate(${inverseVals.translateX}px, ${
        inverseVals.translateY
      }px)`
    }
    if (childFlipConfig.scale) {
      inverseVals.scaleX = 1 / scaleX
      inverseVals.scaleY = 1 / scaleY
      transformString += ` scale(${inverseVals.scaleX}, ${inverseVals.scaleY})`
    }
    child.style.transform = transformString
  })
}

export const createApplyStylesFunc = ({ element, invertedChildren, body }) => ({
  matrix,
  opacity
}) => {
  element.style.transform = convertMatrix2dArrayToString(matrix)
  if (isNumber(opacity)) {
    element.style.opacity = opacity
  }

  if (invertedChildren) {
    invertTransformsForChildren({
      invertedChildren,
      matrix,
      body
    })
  }
}

export const rectInViewport = ({ top, bottom, left, right }) => {
  return (
    top < window.innerHeight &&
    bottom > 0 &&
    left < window.innerWidth &&
    right > 0
  )
}

const passesComponentFilter = (flipComponentIdFilter, flipId) => {
  if (typeof flipComponentIdFilter === "string") {
    if (flipComponentIdFilter !== flipId) return false
  } else if (Array.isArray(flipComponentIdFilter)) {
    if (!flipComponentIdFilter.some(f => f === flipId)) {
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

const getInvertedChildren = (element, id) =>
  toArray(element.querySelectorAll(`[data-inverse-flip-id="${id}"]`))

export const tweenProp = (start, end, position) =>
  start + (end - start) * position

const animateFlippedElements = ({
  flippedIds,
  flipCallbacks,
  inProgressAnimations,
  cachedFlipChildrenPositions,
  newFlipChildrenPositions,
  duration,
  ease,
  applyTransformOrigin,
  getElement,
  spring,
  debug
}) => {
  const body = document.querySelector("body")

  if (debug) {
    console.error(
      'The "debug" prop is set to true. All FLIP animations will return at the beginning of the transition.'
    )
  }

  flippedIds
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
      const transformsArray = []

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

      transformsArray.push(currentTransform)

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
        // must cache or else this could cause an error
        const cachedOnComplete = flipCallbacks[id].onComplete
        onComplete = () => cachedOnComplete(element, flipStartId)
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
          matrix: fromVals.matrix.map((fromVal, index) =>
            tweenProp(fromVal, toVals.matrix[index], currentValue)
          )
        }
        if (animateOpacity) {
          vals.opacity = tweenProp(
            fromVals.opacity,
            toVals.opacity,
            currentValue
          )
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
    // not every item in the array will have returned a startAnimation func
    .filter(x => x)
    // actually start updating the DOM
    // do this last to attempt to thwart the layout thrashing demon
    .forEach(startAnimation => startAnimation())
}

export default animateFlippedElements
