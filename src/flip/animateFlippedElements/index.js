import * as Rematrix from "rematrix"
import { createSpring, staggeredSprings } from "./spring"
import { getSpringConfig } from "../../springSettings"
import {
  toArray,
  isFunction,
  isNumber,
  getDuplicateValsAsStrings
} from "../../utilities"
import * as constants from "../../constants"

// 3d transforms were causing weird issues in chrome,
// especially when opacity was also being tweened,
// so convert to a 2d matrix
export const convertMatrix3dArrayTo2dArray = matrix =>
  [0, 1, 4, 5, 12, 13].map(index => matrix[index])

export const convertMatrix2dArrayToString = matrix =>
  `matrix(${matrix.join(", ")})`

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
  forceMinVals
}) => {
  if (isNumber(opacity)) {
    element.style.opacity = opacity
  }

  if (forceMinVals) {
    element.style.minHeight = "1px"
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
  debug
}) => {
  const body = document.querySelector("body")

  if (debug) {
    // eslint-disable-next-line no-console
    console.error(
      '[react-flip-toolkit]\nThe "debug" prop is set to true. All FLIP animations will return at the beginning of the transition.'
    )
  }

  const duplicateFlipIds = getDuplicateValsAsStrings(flippedIds)
  if (duplicateFlipIds.length) {
    // eslint-disable-next-line no-console
    console.error(
      `[react-flip-toolkit]\nThere are currently multiple elements with the same flipId on the page.\nThe animation will only work if each Flipped component has a unique flipId.\nDuplicate flipId${
        duplicateFlipIds.length > 1 ? "s" : ""
      }: ${duplicateFlipIds.join("\n")}`
    )
  }

  const flipData = flippedIds
    // take all the measurements we need
    // do all the set up work
    // and return a startAnimation function
    .map(id => {
      const prevRect = cachedFlipChildrenPositions[id].rect
      const currentRect = newFlipChildrenPositions[id].rect
      const prevOpacity = cachedFlipChildrenPositions[id].opacity
      const currentOpacity = newFlipChildrenPositions[id].opacity
      const needsForcedMinVals = currentRect.width < 1 || currentRect.height < 1

      // don't initiateImmediateAnimations elements outside of the user's viewport
      if (!rectInViewport(prevRect) && !rectInViewport(currentRect)) {
        return false
      }
      // it's never going to be visible, so dont initiateImmediateAnimations it
      if (
        (prevRect.width === 0 && currentRect.width === 0) ||
        (prevRect.height === 0 && currentRect.height === 0)
      ) {
        return false
      }

      const element = getElement(id)

      // this might happen if we are rapidly adding & removing elements(?)
      if (!element) return false

      const flipConfig = JSON.parse(element.dataset.flipConfig)

      const springConfig = getSpringConfig({
        flipperSpring: spring,
        flippedSpring: flipConfig.spring
      })

      const stagger = debug
        ? false
        : flipConfig.stagger === true
          ? "all"
          : flipConfig.stagger

      const toReturn = {
        element,
        id,
        stagger,
        springConfig,
        noOp: true
      }

      const flipStartId = cachedFlipChildrenPositions[id].flipComponentId
      const flipEndId = flipConfig.componentId

      if (
        !shouldApplyTransform(
          flipConfig.componentIdFilter,
          flipStartId,
          flipEndId
        )
      )
        // this element wont be animated, but its children might be
        return toReturn

      // don't initiateImmediateAnimations elements that didn't change
      // but we might want to initiateImmediateAnimations children
      if (
        prevRect.left === currentRect.left &&
        prevRect.top === currentRect.top &&
        prevRect.width === currentRect.width &&
        prevRect.height === currentRect.height &&
        prevOpacity === currentOpacity
      ) {
        // this element wont be animated, but its children might be
        return toReturn
      }

      toReturn.noOp = false

      const currentTransform = Rematrix.parse(
        newFlipChildrenPositions[id].transform
      )

      const toVals = { matrix: currentTransform }

      const fromVals = {}
      const transformsArray = [currentTransform]

      // we're only going to initiateImmediateAnimations the values that the child wants animated
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

      fromVals.matrix = convertMatrix3dArrayTo2dArray(
        transformsArray.reduce(Rematrix.multiply)
      )

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
        if (needsForcedMinVals && element) {
          element.style.minHeight = ""
          element.style.minWidth = ""
        }
        isFunction(onComplete) && onComplete()
      }

      const animateOpacity =
        isNumber(fromVals.opacity) && fromVals.opacity !== toVals.opacity

      const getOnUpdateFunc = stop => {
        // in case we have to cancel
        inProgressAnimations[id] = {
          stop,
          onComplete
        }
        return spring => {
          const currentValue = spring.getCurrentValue()

          if (!body.contains(element)) {
            stop()
            return
          }

          const vals = {}

          vals.matrix = fromVals.matrix.map((fromVal, index) =>
            tweenProp(fromVal, toVals.matrix[index], currentValue)
          )

          if (animateOpacity) {
            vals.opacity = tweenProp(
              fromVals.opacity,
              toVals.opacity,
              currentValue
            )
          }
          applyStyles(vals)
        }
      }

      const onStart = () => {
        // before animating, nodely apply FLIP styles to prevent flicker
        applyStyles({
          matrix: fromVals.matrix,
          opacity: animateOpacity && fromVals.opacity,
          forceMinVals: needsForcedMinVals
        })
        // and batch any other style updates if necessary
        if (flipConfig.transformOrigin) {
          element.style.transformOrigin = flipConfig.transformOrigin
        } else if (applyTransformOrigin) {
          element.style.transformOrigin = "0 0"
        }

        invertedChildren.forEach(([child, childFlipConfig]) => {
          if (childFlipConfig.transformOrigin) {
            child.style.transformOrigin = childFlipConfig.transformOrigin
          } else if (applyTransformOrigin) {
            child.style.transformOrigin = "0 0"
          }
        })

        if (flipCallbacks[id] && flipCallbacks[id].onStart)
          flipCallbacks[id].onStart(element, flipStartId)
      }

      return {
        ...toReturn,
        stagger,
        springConfig,
        getOnUpdateFunc,
        onStart,
        onAnimationEnd
      }
    })
    .filter(x => x)

  // call this immediately to put items back in place
  flipData.forEach(({ onStart }) => onStart && onStart())

  const flipDict = flipData.reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {})

  // now, dealing with stagger which could be recursively scheduled
  // depending on the depth of the stagger tree
  const selectFlipChildIds = (base, selector) =>
    toArray(base.querySelectorAll(selector)).map(el => el.dataset.flipId)

  // building this helps grab only immediate Flipped children later on
  const levelToChildren = {}
  const baseSelector = `[${constants.DATA_FLIP_ID}]`

  const buildHierarchy = (selector, level, oldResult) => {
    const newSelector = `${selector} ${baseSelector}`
    const newResult = selectFlipChildIds(document, newSelector)

    const oldLevelChildren = oldResult.filter(
      id => newResult.indexOf(id) === -1
    )
    levelToChildren[level] = oldLevelChildren
    oldLevelChildren.forEach(childId => {
      if (flipDict[childId]) {
        flipDict[childId].level = level
      }
    })

    if (newResult.length !== 0)
      buildHierarchy(newSelector, level + 1, newResult)
  }

  buildHierarchy(baseSelector, 0, selectFlipChildIds(document, baseSelector))

  // now make sure childIds in each flippedData contains only direct children
  Object.keys(flipDict).forEach(flipId => {
    const data = flipDict[flipId]
    data.childIds = selectFlipChildIds(data.element, baseSelector).filter(
      id => levelToChildren[data.level + 1].indexOf(id) > -1
    )
  })

  const initiateImmediateAnimations = immediate => {
    if (!immediate) return
    immediate.forEach(flipped => {
      createSpring(flipped)
      initiateImmediateAnimations(flipped.immediate)
    })
  }

  const initiateStaggeredAnimations = staggered => {
    Object.keys(staggered).forEach(staggerKey => {
      staggeredSprings(staggered[staggerKey])
    })
  }

  //build a data struct to run the springs
  const d = {
    root: {
      staggered: {},
      immediate: []
    }
  }

  // helper function to build the nested structure
  const appendChild = (node, flipId) => {
    const flipData = flipDict[flipId]
    // might have been filtered (e.g. because it was off screen)
    if (!flipData) return
    flipData.staggered = {}
    flipData.immediate = []
    if (flipData.stagger) {
      node.staggered[flipData.stagger]
        ? node.staggered[flipData.stagger].push(flipDict[flipId])
        : (node.staggered[flipData.stagger] = [flipDict[flipId]])
    } else node.immediate.push(flipDict[flipId])

    // only when the spring is first activated, activate the child animations as well
    // this enables nested stagger
    flipData.onSpringActivate = () => {
      initiateImmediateAnimations(flipData.immediate)
      initiateStaggeredAnimations(flipData.staggered)
    }

    flipData.childIds.forEach(childId => appendChild(flipDict[flipId], childId))
  }

  // create the nested structure
  levelToChildren["0"].forEach(c => {
    appendChild(d.root, c)
  })

  initiateImmediateAnimations(d.root.immediate)
  initiateStaggeredAnimations(d.root.staggered)
}

export default animateFlippedElements
