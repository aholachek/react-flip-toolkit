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
  cachedOrderedFlipIds = [],
  inProgressAnimations = {},
  cachedFlipChildrenPositions = {},
  flipCallbacks = {},
  containerEl,
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

  const unflippedIds = Object.keys(cachedFlipChildrenPositions)
    .concat(Object.keys(newFlipChildrenPositions))
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

  const flippedIds = cachedOrderedFlipIds.filter(isFlipped)

  const readyToBeFlippedIds = flippedIds.filter(
    id => newFlipChildrenPositions[id] !== "unloadedImg"
  )

  animateFlippedElements({
    flippedIds: readyToBeFlippedIds,
    ...baseArgs,
    applyTransformOrigin,
    spring,
    debug
  })

  const waitATickIds = flippedIds.filter(
    id => newFlipChildrenPositions[id] === "unloadedImg"
  )

  if (waitATickIds.length) {
    setTimeout(() => {
      // we'll re-measure size in the DOM, hopefully the image is rendered by now
      const newFlipChildrenPositions = getFlippedElementPositionsAfterUpdate({
        element: containerEl,
        portalKey,
        ids: waitATickIds
      })
      const loadedImgIds = waitATickIds.filter(
        id => newFlipChildrenPositions[id] !== "unloadedImg"
      )
      animateFlippedElements({
        ...baseArgs,
        applyTransformOrigin,
        spring,
        debug,
        flippedIds: loadedImgIds,
        newFlipChildrenPositions
      })
    })
  }
}

export default onFlipKeyUpdate
