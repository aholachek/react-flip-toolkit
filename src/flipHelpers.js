import tween from "popmotion/animations/tween"
import styler from "stylefire"
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

const shouldApplyTransform = (element, flipStartId, flipEndId) => {
  if (
    element.dataset.flipComponentIdFilter &&
    !passesComponentFilter(element.dataset.flipComponentIdFilter, flipStartId) &&
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
  { flipStartId, flipEndId, immediate } = {}
) => {
  childElements.forEach(child => {
    if (!shouldApplyTransform(child, flipStartId, flipEndId)) return

    const inverseVals = {}
    if (child.dataset.translateX) inverseVals.translateX = -translateX / scaleX
    if (child.dataset.translateY) inverseVals.translateY = -translateY / scaleY
    if (child.dataset.scaleX) inverseVals.scaleX = 1 / scaleX
    if (child.dataset.scaleY) inverseVals.scaleY = 1 / scaleY

    const setter = styler(child).set(inverseVals)
    if (immediate) setter.render()
  })
}

export const getFlippedElementPositions = element => {
  return [].slice
    .apply(element.querySelectorAll("*[data-flip-key]"))
    .map(child => [
      child.dataset.flipKey,
      {
        rect: child.getBoundingClientRect(),
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
  const defaultVals = { translateX: 0, translateY: 0, scaleY: 1, scaleX: 1 }

  Object.keys(newFlipChildrenPositions).forEach(id => {
    if (!cachedFlipChildrenPositions[id] || !newFlipChildrenPositions[id]) {
      return
    }
    const prevRect = cachedFlipChildrenPositions[id].rect
    const currentRect = newFlipChildrenPositions[id].rect
    // don't animate invisible elements
    if (!rectInViewport(prevRect) && !rectInViewport(currentRect)) {
      return
    }
    // don't animate elements that didn't move
    if (
      prevRect.left === currentRect.left &&
      prevRect.top === currentRect.top &&
      prevRect.width === currentRect.width &&
      prevRect.height === currentRect.height
    ) {
      return
    }

    const element = containerEl.querySelector(`*[data-flip-key="${id}"]`)
    const flipStartId = cachedFlipChildrenPositions[id].flipComponentId
    const flipEndId = element.dataset.flipComponentId

    if (!shouldApplyTransform(element, flipStartId, flipEndId)) return

    const elStyler = styler(element)
    const toVals = { ...defaultVals }
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

    let cachedTransformOrigin
    if (element.dataset.transformOrigin) {
      cachedTransformOrigin = element.style.transformOrigin
      element.style.transformOrigin = element.dataset.transformOrigin || "0 0"
    }

    if (inProgressAnimations[id]) {
      inProgressAnimations[id].stop()
      delete inProgressAnimations[id]
    }

    debugger

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
    elStyler.set(fromVals).render()
    invertTransformsForChildren(getInvertedChildren(element, id), fromVals, {
      immediate: true,
      flipStartId,
      flipEndId
    })

    if (flipCallbacks[id] && flipCallbacks[id].onStart)
      flipCallbacks[id].onStart(element, flipStartId)

    // now start the animation
    const { stop } = tween({
      from: fromVals,
      to: toVals,
      duration,
      ease: popmotionEasing[ease]
    }).start({
      update: transforms => {
        // just to be safe: if the component has been removed from the DOM
        // immediately cancel any in-progress animations
        if (!body.contains(element)) {
          stop && stop()
          return
        }
        elStyler.set(transforms)
        // for children that requested it, cancel out the transform by applying the inverse transform
        invertTransformsForChildren(
          getInvertedChildren(element, id),
          transforms,
          { flipStartId, flipEndId }
        )
      },
      complete: () => {
        delete inProgressAnimations[id]
        requestAnimationFrame(() => {
          element.style.transform = ""
          element.style.transformOrigin = cachedTransformOrigin
        })
        if (flipCallbacks[id] && flipCallbacks[id].onComplete)
          flipCallbacks[id].onComplete(element, flipStartId)
      }
    })
    inProgressAnimations[id] = { stop }
  })
  return inProgressAnimations
}
