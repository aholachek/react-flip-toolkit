import tween from "popmotion/animations/tween"
import styler from "stylefire"
import { easing } from "popmotion"

const getInvertedChildren = (element, id) =>
  [].slice.call(element.querySelectorAll(`*[data-inverse-flip-id="${id}"]`))

// if we're scaling an element and we have element children with data-inverse-flip-ids,
// apply the inverse of the transforms so that the children don't distort
const invertTransformsForChildren = (
  childElements,
  { translateX, translateY, scaleY, scaleX },
  options = {}
) => {
  childElements.forEach(child => {
    const inverseVals = {}
    if (child.dataset.translateX) inverseVals.translateX = -translateX / scaleX
    if (child.dataset.translateY) inverseVals.translateY = -translateY / scaleY
    if (child.dataset.scaleX) inverseVals.scaleX = 1 / scaleX
    if (child.dataset.scaleY) inverseVals.scaleY = 1 / scaleY
    if (child.dataset.transformOriginTopLeft)
      inverseVals.transformOrigin = "0 0"

    const setter = styler(child).set(inverseVals)
    if (options.immediate) setter.render()
  })
}

export const getFlippedElementPositions = element => {
  return [].slice
    .apply(element.querySelectorAll("*[data-flip-key]"))
    .map(child => [child.dataset.flipKey, child.getBoundingClientRect()])
    .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})
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
    const prevRect = cachedFlipChildrenPositions[id]
    const currentRect = newFlipChildrenPositions[id]
    if (!prevRect || !currentRect) return
    const element = containerEl.querySelector(`*[data-flip-key="${id}"]`)

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

    if (element.dataset.transformOriginTopLeft) fromVals.transformOrigin = "0 0"

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
    elStyler.set(fromVals).render()
    invertTransformsForChildren(getInvertedChildren(element, id), fromVals, {
      immediate: true
    })

    if (flipCallbacks[id] && flipCallbacks[id].onStart)
      flipCallbacks[id].onStart(element)

    // now start the animation
    const { stop } = tween({
      from: fromVals,
      to: toVals,
      duration,
      ease: easing.linear
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
          transforms
        )
      },
      complete: () => {
        delete inProgressAnimations[id]
        requestAnimationFrame(() => {
          element.style.transform = ""
        })
        if (flipCallbacks[id] && flipCallbacks[id].onComplete)
          flipCallbacks[id].onComplete(element)
      }
    })
    inProgressAnimations[id] = { stop }
  })
  return inProgressAnimations
}
