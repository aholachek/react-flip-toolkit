import animateUnflippedElements from "./animateUnflippedElements"
import animateFlippedElements from "./animateFlippedElements"
import { getFlippedElementPositionsAfterUpdate } from "./getFlippedElementPositions"

const onFlipKeyUpdate = ({
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
  const newFlipChildrenPositions = getFlippedElementPositionsAfterUpdate({
    element: containerEl
  })

  const getElement = id => containerEl.querySelector(`*[data-flip-id="${id}"]`)

  const isFlipped = id =>
    cachedFlipChildrenPositions[id] && newFlipChildrenPositions[id]

  const unflippedIds = Object.keys(newFlipChildrenPositions)
    .concat(Object.keys(cachedFlipChildrenPositions))
    .filter(id => !isFlipped(id))

  const baseArgs = {
    flipCallbacks,
    getElement,
    cachedFlipChildrenPositions,
    newFlipChildrenPositions,
    inProgressAnimations
  }

  animateUnflippedElements({
    unflippedIds,
    ...baseArgs
  })

  const flippedIds = Object.keys(newFlipChildrenPositions).filter(isFlipped)

  animateFlippedElements({
    flippedIds,
    ...baseArgs,
    duration,
    ease,
    applyTransformOrigin,
    spring,
    debug
  })
}

export default onFlipKeyUpdate
