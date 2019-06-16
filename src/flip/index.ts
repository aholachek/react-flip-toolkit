import animateUnflippedElements from './animateUnflippedElements'
import animateFlippedElements from './animateFlippedElements'
import getFlippedElementPositionsAfterUpdate from './getFlippedElementPositions/getFlippedElementPositionsAfterUpdate'
import * as constants from '../constants'
import { assign, toArray } from '../utilities'
import {
  GetElement,
  BaseFlipArgs,
  OnFlipKeyUpdateArgs,
  FlippedIds
} from './types'
import { AnimateUnflippedElementsArgs } from './animateUnflippedElements/types'
import {
  AnimateFlippedElementsArgs,
  ScopedSelector
} from './animateFlippedElements/types'

const createPortalScopedSelector = (portalKey: string) => (
  selector: string
) => {
  return toArray(
    document.querySelectorAll(
      `[${constants.DATA_PORTAL_KEY}="${portalKey}"]${selector}`
    )
  )
}
const createFlipperScopedSelector = (containerEl: HTMLElement) => {
  const tempFlipperId = Math.random().toFixed(5)
  containerEl.dataset.flipperId = tempFlipperId

  return (selector: string) => {
    return toArray(
      containerEl.querySelectorAll(
        `[data-flipper-id="${tempFlipperId}"] ${selector}`
      )
    )
  }
}
const createScopedSelector = ({
  containerEl,
  portalKey
}: {
  containerEl?: HTMLElement
  portalKey?: string
}): ScopedSelector => {
  if (portalKey) {
    return createPortalScopedSelector(portalKey)
  } else if (containerEl) {
    return createFlipperScopedSelector(containerEl)
  } else {
    return () => []
  }
}

const createGetElementFunc = (scopedSelector: ScopedSelector): GetElement => {
  return (id: string) => {
    return scopedSelector(`[${constants.DATA_FLIP_ID}="${id}"]`)[0]
  }
}

const onFlipKeyUpdate = ({
  cachedOrderedFlipIds = [],
  inProgressAnimations = {},
  flippedElementPositionsBeforeUpdate = {},
  flipCallbacks = {},
  containerEl,
  applyTransformOrigin,
  spring,
  debug,
  portalKey,
  staggerConfig = {},
  decisionData = {},
  handleEnterUpdateDelete,
  retainTransform,
  isGestureControlled,
  onComplete
}: OnFlipKeyUpdateArgs) => {
  const flippedElementPositionsAfterUpdate = getFlippedElementPositionsAfterUpdate(
    {
      element: containerEl,
      portalKey
    }
  )

  const scopedSelector = createScopedSelector({
    containerEl,
    portalKey
  })
  const getElement = createGetElementFunc(scopedSelector)

  const isFlipped = (id: string) =>
    flippedElementPositionsBeforeUpdate[id] &&
    flippedElementPositionsAfterUpdate[id]

  const unflippedIds = Object.keys(flippedElementPositionsBeforeUpdate)
    .concat(Object.keys(flippedElementPositionsAfterUpdate))
    .filter(id => !isFlipped(id))

  const baseArgs: BaseFlipArgs = {
    flipCallbacks,
    getElement,
    flippedElementPositionsBeforeUpdate,
    flippedElementPositionsAfterUpdate,
    inProgressAnimations
  }

  const animateUnFlippedElementsArgs = assign(
    {},
    baseArgs,
    {
      unflippedIds
    }
  ) as AnimateUnflippedElementsArgs

  const {
    hideEnteringElements,
    animateEnteringElements,
    animateExitingElements
  } = animateUnflippedElements(animateUnFlippedElementsArgs)

  const flippedIds: FlippedIds = cachedOrderedFlipIds.filter(isFlipped)
  // @ts-ignore
  const animateFlippedElementsArgs: AnimateFlippedElementsArgs = assign(
    {},
    baseArgs,
    {
      isGestureControlled,
      flippedIds,
      applyTransformOrigin,
      spring,
      debug,
      staggerConfig,
      decisionData,
      scopedSelector,
      retainTransform,
      onComplete
    }
  )

  // the function handles putting flipped elements back in their original positions
  // and returns another function to actually call the flip animation
  const flip = animateFlippedElements(animateFlippedElementsArgs)

  // clear temp markup that was added to facilitate FLIP
  // namely, in the filterFlipDescendants function
  const cleanupTempDataAttributes = () => {
    unflippedIds
      .filter(id => flippedElementPositionsAfterUpdate[id])
      .forEach(id => {
        const element = getElement(id)
        if (element) {
          element.removeAttribute(constants.DATA_IS_APPEARING)
        }
      })
  }

  cleanupTempDataAttributes()

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
