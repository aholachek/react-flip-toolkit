import { AnimateUnflippedElementsArgs, FragmentTuple } from './types'

const animateUnflippedElements = ({
  unflippedIds,
  flipCallbacks,
  getElement,
  flippedElementPositionsBeforeUpdate,
  flippedElementPositionsAfterUpdate,
  inProgressAnimations
}: AnimateUnflippedElementsArgs) => {
  const enteringElements = unflippedIds.filter(
    id => flippedElementPositionsAfterUpdate[id] && flipCallbacks[id]
  )

  const exitingElementIds = unflippedIds.filter(
    id =>
      flippedElementPositionsBeforeUpdate[id] &&
      flipCallbacks[id] &&
      flipCallbacks[id].onExit
  )

  const hideEnteringElements = () => {
    enteringElements.forEach(id => {
      if (flipCallbacks[id] && flipCallbacks[id].onAppear) {
        const element = getElement(id)
        element.style.opacity = '0'
      }
    })
  }

  const animateEnteringElements = () => {
    enteringElements.forEach((id, i) => {
      const element = getElement(id)
      if (flipCallbacks[id] && flipCallbacks[id].onAppear) {
        flipCallbacks[id].onAppear!(element, i)
      }
    })
  }

  let closureResolve: () => void

  const promiseToReturn: Promise<void> = new Promise(resolve => {
    closureResolve = resolve
  })

  const fragmentTuples: FragmentTuple[] = []
  let exitingElementCount = 0

  const onExitCallbacks = exitingElementIds.map((id, i) => {
    const {
      domDataForExitAnimations: {
        element,
        parent,
        childPosition: { top, left, width, height }
      }
    } = flippedElementPositionsBeforeUpdate[id]
    // insert back into dom
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative'
    }
    element.style.transform = 'matrix(1, 0, 0, 1, 0, 0)'
    element.style.position = 'absolute'
    element.style.top = top + 'px'
    element.style.left = left + 'px'
    // taken out of the dom flow, the element might have lost these dimensions
    element.style.height = height + 'px'
    element.style.width = width + 'px'
    let fragmentTuple: FragmentTuple | undefined = fragmentTuples.filter(
      t => t[0] === parent
    )[0]
    if (!fragmentTuple) {
      fragmentTuple = [parent, document.createDocumentFragment()]
      fragmentTuples.push(fragmentTuple)
    }
    fragmentTuple[1].appendChild(element)

    exitingElementCount += 1

    const stop = () => {
      try {
        parent.removeChild(element)
        exitingElementCount -= 1
        if (exitingElementCount === 0) {
          closureResolve()
        }
      } catch (DOMException) {
        // the element is already gone
      }
    }
    inProgressAnimations[id] = { stop }
    return () => flipCallbacks[id].onExit!(element, i, stop)
  })

  // now append all the fragments from the onExit callbacks
  // (we use fragments for performance)
  fragmentTuples.forEach(t => {
    const parent = t[0]
    const fragment = t[1]
    parent.appendChild(fragment)
  })

  if (!onExitCallbacks.length) {
    closureResolve!()
  }

  const animateExitingElements = () => {
    onExitCallbacks.forEach(c => c())
    return promiseToReturn
  }

  return {
    hideEnteringElements,
    animateEnteringElements,
    animateExitingElements
  }
}

export default animateUnflippedElements
