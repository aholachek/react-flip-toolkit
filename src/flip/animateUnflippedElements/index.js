/**
 * animate any un-FLIP-ped elements with onAppear, onDelayedAppear,
 * or onExit callbacks
 */
const animateUnflippedElements = ({
  unflippedIds,
  flipCallbacks,
  getElement,
  newFlipChildrenPositions,
  cachedFlipChildrenPositions,
  inProgressAnimations
}) => {
  // simple onAppear callbacks
  unflippedIds
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

  // cache onDelayedAppear callbacks for later
  const onDelayedAppearCallbacks = unflippedIds
    // filter to only brand new elements with an onAppear callback
    .filter(
      id =>
        newFlipChildrenPositions[id] &&
        flipCallbacks[id] &&
        flipCallbacks[id].onDelayedAppear
    )
    .map((id, i) => {
      const element = getElement(id)
      element.style.opacity = "0"

      return () => {
        flipCallbacks[id].onDelayedAppear(element, i)
      }
    })

  // to help sequence onExit and onDelayedAppear callbacks
  const exitingElements = []

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

  const fragmentTuples = []
  // we need to wait to trigger onExit callbacks until the elements are
  // back in the DOM, so store them here and call them after the fragments
  // have been appended

  // onExit for non-flipped elements
  const onExitCallbacks = unflippedIds
    // filter to only exited elements with an onExit callback
    .filter(
      id =>
        cachedFlipChildrenPositions[id] &&
        flipCallbacks[id] &&
        flipCallbacks[id].onExit
    )
    .map((id, i) => {
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
      inProgressAnimations[id] = { stop }
      return () => flipCallbacks[id].onExit(element, i, stop)
    })

  // now append all the fragments from the onExit callbacks
  // (we use fragments for performance)
  fragmentTuples.forEach(t => {
    const parent = t[0]
    const fragment = t[1]
    parent.appendChild(fragment)
  })

  onExitCallbacks.forEach(c => c())

  // if nothing exited, just call onDelayedAppear callbacks immediately
  if (exitingElements.length === 0) {
    onDelayedAppearCallbacks.forEach(c => c())
  }
}

export default animateUnflippedElements
