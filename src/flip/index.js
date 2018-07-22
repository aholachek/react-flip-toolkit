import animateUnflippedElements from "./animateUnflippedElements"
import animateFlippedElements from "./animateFlippedElements"
import { getFlippedElementPositionsAfterUpdate } from "./getFlippedElementPositions"
import * as constants from "../constants"

const createGetElementFunc = (element, portalKey) => {
  if (portalKey) {
    return id =>
      document.querySelector(
        `[${constants.DATA_FLIP_ID}="${id}"][${
          constants.DATA_PORTAL_KEY
        }=${portalKey}]`
      )
  } else {
    return id => element.querySelector(`[${constants.DATA_FLIP_ID}="${id}"]`)
  }
}

const onFlipKeyUpdate = ({
  inProgressAnimations,
  cachedFlipChildrenPositions = {},
  flipCallbacks = {},
  containerEl,
  duration,
  ease,
  applyTransformOrigin,
  spring,
  debug,
  portalKey
}) => {
  const newFlipChildrenPositions = getFlippedElementPositionsAfterUpdate({
    element: containerEl,
    portalKey
  })

  const getElement = createGetElementFunc(containerEl, portalKey)

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
