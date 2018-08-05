import * as Rematrix from "rematrix"
import springUpdate from "./spring"
import { getSpringConfig } from "../../springSettings"
import { toArray, isFunction, isNumber } from "../utilities"
import * as constants from "../../constants"

// 3d transforms were causing weird issues in chrome,
// especially when opacity was also being tweened,
// so convert to a 2d matrix
export const convertMatrix3dArrayTo2dArray = matrix => [
  // scale X
  matrix[0],
  matrix[1],
  matrix[4],
  // scale Y
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
  opacity,
  forceMinHeight,
  forceMinWidth
}) => {
  if (isNumber(opacity)) {
    element.style.opacity = opacity
  }

  if (forceMinHeight) {
    element.style.minHeight = "1px"
  }
  if (forceMinWidth) {
    element.style.minWidth = "1px"
  }

  if (!matrix) return
  element.style.transform = convertMatrix2dArrayToString(matrix)

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
  toArray(
    element.querySelectorAll(`[${constants.DATA_INVERSE_FLIP_ID}="${id}"]`)
  )

export const tweenProp = (start, end, position) =>
  start + (end - start) * position

const animateFlippedElements = ({
  flippedIds,
  flipCallbacks,
  inProgressAnimations,
  cachedFlipChildrenPositions,
  newFlipChildrenPositions,
  applyTransformOrigin,
  spring,
  getElement,
  jitterFix,
  debug
}) => {
  const body = document.querySelector("body")

  if (debug) {
    console.error(
      'The "debug" prop is set to true. All FLIP animations will return at the beginning of the transition.'
    )
  }

  const startFlipFunctions = flippedIds
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

      const springConfig = getSpringConfig({
        flipperSpring: spring,
        flippedSpring: flipConfig.spring
      })
      let stagger = flipConfig.stagger === true ? "all" : flipConfig.stagger
      if (debug) stagger = false

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
      // going any smaller than 1px breaks transitions in Chrome
      if (flipConfig.scale) {
        transformsArray.push(
          Rematrix.scaleX(
            Math.max(prevRect.width, 1) / Math.max(currentRect.width, 1)
          )
        )
        transformsArray.push(
          Rematrix.scaleY(
            Math.max(prevRect.height, 1) / Math.max(currentRect.height, 1)
          )
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
        // must cache or else this could cause an error
        const cachedOnComplete = flipCallbacks[id].onComplete
        onComplete = () => cachedOnComplete(element, flipStartId)
      }

      // this should be called when animation ends naturally
      // but also when it is interrupted
      // when it is called, the animation has already been cancelled
      const onAnimationEnd = () => {
        delete inProgressAnimations[id]
        isFunction(onComplete) && onComplete()
      }

      const animateOpacity =
        isNumber(fromVals.opacity) && fromVals.opacity !== toVals.opacity

      let updateNextFuncParams

      const getOnUpdateFunc = nextFunc => stop => ({ currentValue }) => {
        if (!body.contains(element)) {
          stop()
          return
        }

        //stagger
        if (nextFunc && !updateNextFuncParams && currentValue > 0.05) {
          updateNextFuncParams = nextFunc()
        }

        if (updateNextFuncParams) {
          updateNextFuncParams(Math.min(currentValue * 1.5, 1))
        }

        const vals = {}

        /**
         * the currentValue !== 1 thing is stupid but seems necessary for now.
         * In chrome, once you transition to a totally 0 transform (matrix(1, 0, 0, 1, 0, 1))
         * you get a 1px jump for some reason
         * I've tried transform 3d, will-change, translateZ hacks and none of them make a difference
         * so we're going to stop on the penultimate update instead
         */
        if (!(currentValue === 1 && jitterFix)) {
          vals.matrix = fromVals.matrix.map((fromVal, index) =>
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

      const startAnimation = nextFunc => {
        // before animating, immediately apply FLIP styles to prevent flicker
        applyStyles({
          matrix: fromVals.matrix,
          opacity: animateOpacity && fromVals.opacity
        })

        return () => {
          if (debug) {
            const round = n => Math.round(n * 100) / 100
            const xAdjust = round(1 / fromVals.matrix[0])
            const yAdjust = round(1 / fromVals.matrix[3])
            const boxShadowLeft = `${xAdjust * 3}px 0 0 -${xAdjust}px #e2606b`
            const boxShadowRight = `-${xAdjust * 3}px 0 0 -${xAdjust}px #e2606b`
            const boxShadowTop = `0 ${yAdjust * 3}px 0 -${yAdjust}px #e2606b`
            const boxShadowBottom = `0 -${yAdjust *
              3}px 0 -${yAdjust}px #e2606b`

            const boxShadow =
              boxShadowLeft +
              ", " +
              boxShadowRight +
              ", " +
              boxShadowTop +
              ", " +
              boxShadowBottom

            element.style.boxShadow = boxShadow
            return
          }

          if (flipCallbacks[id] && flipCallbacks[id].onStart)
            flipCallbacks[id].onStart(element, flipStartId)

          const spring = springUpdate({
            springConfig,
            getOnUpdateFunc: getOnUpdateFunc(nextFunc),
            onAnimationEnd
          })

          // in case we have to cancel
          inProgressAnimations[id] = {
            stop: () => spring.stop(),
            onComplete
          }
          return toValue => {
            spring.updateConfig({
              toValue
            })
          }
        }
      }
      return [stagger, startAnimation]
    })
    // some functions might return undefined
    .filter(x => x)

  // staggered funcs need to be grouped and provided a reference to the next func
  const staggeredFunctions = startFlipFunctions
    .filter(arr => arr[0])
    .reduce((acc, curr) => {
      if (acc[curr[0]]) acc[curr[0]].push(curr[1])
      else acc[curr[0]] = [curr[1]]
      return acc
    }, {})

  Object.keys(staggeredFunctions).forEach(stagger => {
    const funcs = staggeredFunctions[stagger]
    // call with reference to the following function and information about
    // placement in the order
    const startFunc = funcs
      .reverse()
      .reduce((prev, curr) => curr(prev), () => {})
    startFunc()
  })

  // just call unstaggered functions directly
  startFlipFunctions
    .filter(arr => !arr[0])
    .map(arr => arr[1])
    .forEach(func => {
      func()()
    })
}

export default animateFlippedElements
