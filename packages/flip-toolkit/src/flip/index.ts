import animateUnflippedElements from './animateUnflippedElements/index.js'
import animateFlippedElements from './animateFlippedElements/index.js'
import getFlippedElementPositionsAfterUpdate from './getFlippedElementPositions/getFlippedElementPositionsAfterUpdate/index.js'
import * as constants from '../constants.js'
import { assign, toArray } from '../utilities/index.js'
import {
  GetElement,
  BaseFlipArgs,
  OnFlipKeyUpdateArgs,
  FlippedIds
} from './types.js'
import { AnimateUnflippedElementsArgs } from './animateUnflippedElements/types.js'
import {
  AnimateFlippedElementsArgs,
  ScopedSelector
} from './animateFlippedElements/types.js'

let enabled = true

export const disableFlip = () => (enabled = false)

export const enableFlip = () => (enabled = true)

export const isFlipEnabled = () => enabled

const createPortalScopedSelector =
  (portalKey: string) => (selector: string) => {
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

export const onFlipKeyUpdate = ({
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
  onComplete,
  onStart
}: OnFlipKeyUpdateArgs) => {
  if (!enabled) return
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (mediaQuery.matches) return
  const flippedElementPositionsAfterUpdate =
    getFlippedElementPositionsAfterUpdate({
      element: containerEl,
      portalKey
    })

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
    inProgressAnimations,
    decisionData
  }

  const animateUnFlippedElementsArgs = assign({}, baseArgs, {
    unflippedIds
  }) as AnimateUnflippedElementsArgs

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
      containerEl,
      flippedIds,
      applyTransformOrigin,
      spring,
      debug,
      staggerConfig,
      scopedSelector,
      onComplete
    }
  )
  if (onStart) onStart(containerEl, decisionData)

  // the function handles putting flipped elements back in their original positions
  // and returns another function to actually call the flip animation
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

