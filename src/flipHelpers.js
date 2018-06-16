import tween from "popmotion/animations/tween"
import { easing as popmotionEasing } from "popmotion"

const getInvertedChildren = (element, id) =>
  [].slice.call(element.querySelectorAll(`*[data-inverse-flip-id="${id}"]`))

const passesComponentFilter = (flipFilters, flipId) => {
  if (typeof flipFilters === "string") {
    flipFilters = flipFilters.split(",").filter(x => x)
    if (!flipFilters.some(f => f === flipId)) {
      return false
    }
  }
  return true
}

const applyStyles = (
  element,
  { opacity, translateX, translateY, scaleX, scaleY }
) => {
  element.style.opacity = opacity
  element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`
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
  { translateX, translateY, scaleY, scaleX },
  { flipStartId, flipEndId } = {}
) => {
  childElements.forEach(child => {
    if (!shouldApplyTransform(child, flipStartId, flipEndId)) return

    const inverseVals = {}
    if (child.dataset.translateX) inverseVals.translateX = -translateX / scaleX
    if (child.dataset.translateY) inverseVals.translateY = -translateY / scaleY
    if (child.dataset.scaleX) inverseVals.scaleX = 1 / scaleX
    if (child.dataset.scaleY) inverseVals.scaleY = 1 / scaleY

    child.style.transform = `translate(${inverseVals.translateX}px, ${
      inverseVals.translateY
    }px) scale(${inverseVals.scaleX}, ${inverseVals.scaleY})`
  })
}

export const getFlippedElementPositions = element => {
  return [].slice
    .apply(element.querySelectorAll("*[data-flip-key]"))
    .map(child => [
      child.dataset.flipKey,
      {
        rect: child.getBoundingClientRect(),
        opacity: parseFloat(window.getComputedStyle(child).opacity),
        flipComponentId: child.dataset.flipComponentId
      }
    ])
    .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})
}

const rectInViewport = ({ top, bottom, left, right }) => {
  return (
    bottom > 0 &&
    top < window.innerHeight &&
    right > 0 &&
    left < window.innerWidth
  )
}

export const animateMove = ({
  inProgressAnimations = {},
  cachedFlipChildrenPositions = {},
  flipCallbacks = {},
  containerEl,
  duration,
  ease
}) => {
  const body = document.querySelector("body")
  const newFlipChildrenPositions = getFlippedElementPositions(containerEl)
  const defaultVals = {
    translateX: 0,
    translateY: 0,
    scaleY: 1,
    scaleX: 1,
    opacity: 1
  }

  Object.keys(newFlipChildrenPositions).forEach(id => {
    if (!cachedFlipChildrenPositions[id] || !newFlipChildrenPositions[id]) {
      return
    }

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

    const element = containerEl.querySelector(`*[data-flip-key="${id}"]`)
    const flipStartId = cachedFlipChildrenPositions[id].flipComponentId
    const flipEndId = element.dataset.flipComponentId

    if (!shouldApplyTransform(element, flipStartId, flipEndId)) return

    const toVals = { ...defaultVals }
    if (element.dataset.opacity) toVals.opacity = currentOpacity
    const fromVals = { ...defaultVals }
    // we're only going to animate the values that the child wants animated,
    // based on its data-* attributes
    if (element.dataset.translateX)
      fromVals.translateX = prevRect.left - currentRect.left
    if (element.dataset.translateY)
      fromVals.translateY = prevRect.top - currentRect.top
    if (element.dataset.scaleX)
      fromVals.scaleX = prevRect.width / Math.max(currentRect.width, 0.0001)
    if (element.dataset.scaleY)
      fromVals.scaleY = prevRect.height / Math.max(currentRect.height, 0.0001)
    if (element.dataset.opacity) fromVals.opacity = prevOpacity

    if (element.dataset.transformOrigin) {
      element.style.transformOrigin = element.dataset.transformOrigin
    }
    getInvertedChildren(element, id).forEach(child => {
      if (child.dataset.transformOrigin) {
        child.style.transformOrigin = child.dataset.transformOrigin
      }
    })

    if (inProgressAnimations[id]) {
      inProgressAnimations[id].stop()
      delete inProgressAnimations[id]
    }

    // const elementAlreadyHasTransform = window
    //   .getComputedStyle(element)
    //   .getPropertyValue("transform")
    //   .match(/matrix\(1, 0, 0, 1, (.*), (.*)\)/)
    // if (elementAlreadyHasTransform) {
    //   toVals.translateX = parseFloat(elementAlreadyHasTransform[1])
    //   fromVals.translateX = fromVals.translateX + toVals.translateX
    //   toVals.translateY = parseFloat(elementAlreadyHasTransform[2])
    //   fromVals.translateY = fromVals.translateY + toVals.translateY
    // }

    // before animating, immediately apply FLIP styles to prevent flicker
    // (which was only detectable on Safari)
    // not sure why but opacity transforms break when included in this first render
    applyStyles(element, fromVals)
    invertTransformsForChildren(getInvertedChildren(element, id), fromVals, {
      flipStartId,
      flipEndId
    })

    if (flipCallbacks[id] && flipCallbacks[id].onStart)
      flipCallbacks[id].onStart(element, flipStartId)

    // now start the animation
    const { stop } = tween({
      from: fromVals,
      to: toVals,
      // element can specify its own duration
      duration: element.dataset.flipDuration || duration,
      // element can specify its own easing
      ease:
        (element.dataset.flipEase &&
          popmotionEasing[element.dataset.flipEase]) ||
        popmotionEasing[ease]
    }).start({
      // transforms can include opacity
      update: tweenVals => {
        // just to be safe: if the component has been removed from the DOM
        // immediately cancel any in-progress animations
        if (!body.contains(element)) {
          stop && stop()
          return
        }

        applyStyles(element, tweenVals)

        // for children that requested it, cancel out the transform by applying the inverse transform
        invertTransformsForChildren(
          getInvertedChildren(element, id),
          tweenVals,
          { flipStartId, flipEndId }
        )
      },
      complete: () => {
        delete inProgressAnimations[id]
        requestAnimationFrame(() => {
          element.style.transform = ""
        })
        if (flipCallbacks[id] && flipCallbacks[id].onComplete)
          flipCallbacks[id].onComplete(element, flipStartId)
      }
    })
    // in case we have to cancel
    inProgressAnimations[id] = { stop }
  })
  return inProgressAnimations
}
