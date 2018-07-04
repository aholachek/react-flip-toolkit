import { Tweenable } from "shifty"
import * as Rematrix from "rematrix"

const toArray = arrayLike => Array.prototype.slice.apply(arrayLike)

// animejs' influence
Tweenable.formulas.easeOutElastic = function(t) {
  var p = 0.99
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
}

Tweenable.formulas.easeOutElasticBig = function(t) {
  const p = 0.6
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
}

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

const shouldApplyTransform = (
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

// if we're scaling an element and we have element children with data-inverse-flip-ids,
// apply the inverse of the transforms so that the children don't distort
const invertTransformsForChildren = ({
  invertedChildren,
  matrix,
  body,
  flipStartId,
  flipEndId
}) => {
  invertedChildren.forEach(([child, childFlipConfig]) => {
    if (
      !shouldApplyTransform(
        childFlipConfig.componentIdFilter,
        flipStartId,
        flipEndId
      )
    )
      return

    if (!body.contains(child)) {
      return
    }

    const matrixVals = matrix.match(/-?\d+\.?\d*/g).map(parseFloat)

    const scaleX = matrixVals[0]
    const scaleY = matrixVals[3]
    const translateX = matrixVals[4]
    const translateY = matrixVals[5]

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

const createApplyStylesFunc = ({
  element,
  invertedChildren,
  body,
  flipStartId,
  flipEndId
}) => ({ matrix, opacity }) => {
  element.style.transform = matrix
  element.style.opacity = opacity

  invertTransformsForChildren({
    invertedChildren,
    matrix,
    body,
    flipStartId,
    flipEndId
  })
}

export const getEasingName = (flippedEase, flipperEase) => {
  let easeToApply = flippedEase || flipperEase

  if (!Tweenable.formulas[easeToApply]) {
    const defaultEase = "easeOutExpo"
    console.error(
      `${easeToApply} was not recognized as a valid easing option, falling back to ${defaultEase}`
    )
    easeToApply = defaultEase
  }
  return easeToApply
}

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

      if (inProgressAnimations[id]) {
        inProgressAnimations[id].stop()

        inProgressAnimations[id].onComplete()
        delete inProgressAnimations[id]
      }

      const currentTransform = Rematrix.parse(
        getComputedStyle(element).transform
      )

      const toVals = { matrix: currentTransform, opacity: 1 }

      const fromVals = { opacity: 1 }
      const transformsArray = [currentTransform]

      // we're only going to animate the values that the child wants animated,
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
          Rematrix.scaleX(prevRect.width / Math.max(currentRect.width, 0.0001))
        )
        transformsArray.push(
          Rematrix.scaleY(
            prevRect.height / Math.max(currentRect.height, 0.0001)
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
      const invertedChildren = getInvertedChildren(element, id).map(c => [
        c,
        JSON.parse(c.dataset.flipConfig)
      ])

      invertedChildren.forEach(([child, childFlipConfig]) => {
        if (childFlipConfig.transformOrigin) {
          child.style.transformOrigin = childFlipConfig.transformOrigin
        } else if (applyTransformOrigin) {
          child.style.transformOrigin = "0 0"
        }
      })

      fromVals.matrix = transformsArray.reduce(Rematrix.multiply)

      // prepare for animation by turning matrix into a string
      fromVals.matrix = convertMatrix3dArrayTo2dString(fromVals.matrix)
      toVals.matrix = convertMatrix3dArrayTo2dString(toVals.matrix)

      const applyStyles = createApplyStylesFunc({
        element,
        invertedChildren,
        body,
        flipStartId,
        flipEndId
      })

      // before animating, immediately apply FLIP styles to prevent flicker
      applyStyles({
        matrix: fromVals.matrix,
        opacity: fromVals.opacity
      })

      if (flipCallbacks[id] && flipCallbacks[id].onStart)
        flipCallbacks[id].onStart(element, flipStartId)

      let onComplete = () => {}
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
        duration: parseFloat(flipConfig.duration || duration),
        easing: {
          opacity: "linear",
          matrix: getEasingName(flipConfig.ease, ease)
        },
        delay: parseFloat(flipConfig.delay),
        step: ({ matrix, opacity }) => {
          if (!body.contains(element)) {
            tweenable.stop()
            return
          }
          applyStyles({
            matrix,
            opacity
          })
        }
      })

      tweenable
        .tween()
        .then(() => {
          delete inProgressAnimations[id]
          onComplete()
        })
        .catch(e => {
          // hmm
        })

      // in case we have to cancel
      inProgressAnimations[id] = {
        stop: tweenable.stop.bind(tweenable),
        onComplete
      }
    })

  return inProgressAnimations
}
