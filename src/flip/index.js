import animateUnflippedElements from "./animateUnflippedElements"
import animateFlippedElements from "./animateFlippedElements"
import { getFlippedElementPositionsAfterUpdate } from "./getFlippedElementPositions"
import * as constants from "../constants"
import { assign } from "../utilities"

const createScopedSelector = (element, portalKey) => {
  if (portalKey) {
    return selector =>
      document.querySelectorAll(
        `[${constants.DATA_PORTAL_KEY}=${portalKey}]${selector}`
      )
  } else {
    return selector => element.querySelectorAll(selector)
  }
}

const createGetElementFunc = (element, portalKey) => {
  // this should only ever return 1 element
  return id =>
    createScopedSelector(element, portalKey)(
      `[${constants.DATA_FLIP_ID}="${id}"]`
    )[0]
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
  portalKey,
  staggerConfig = {},
  decisionData = {},
  handleEnterUpdateDelete
}) => {
  const newFlipChildrenPositions = getFlippedElementPositionsAfterUpdate({
    element: containerEl,
    portalKey
  })

  const scopedSelector = createScopedSelector(containerEl, portalKey)
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

  const {
    hideEnteringElements,
    animateEnteringElements,
    animateExitingElements
  } = animateUnflippedElements(
    assign({}, baseArgs, {
      unflippedIds
    })
  )

  const flippedIds = cachedOrderedFlipIds.filter(isFlipped)
  const animateFlippedElementsArgs = assign({}, baseArgs, {
    flippedIds,
    applyTransformOrigin,
    spring,
    debug,
    staggerConfig,
    decisionData,
    scopedSelector
  })

  // the function handles putting flipped elements back in their original positions
  // and returns another function to actually call flip
  const flip = animateFlippedElements(animateFlippedElementsArgs)

  if (handleEnterUpdateDelete) {
    handleEnterUpdateDelete({
      hideEnteringElements,
      animateEnteringElements,
      animateExitingElements,
      animateFlippedElements: flip
    })
  } else {
    hideEnteringElements()
    animateExitingElements().then(animateEnteringElements)
    flip()
  }
}

export default onFlipKeyUpdate
