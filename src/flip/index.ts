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

const createScopedSelector = (
  element?: HTMLElement,
  portalKey?: string
): ScopedSelector => {
  if (portalKey) {
    return (selector: string) =>
      toArray(
        document.querySelectorAll(
          `[${constants.DATA_PORTAL_KEY}=${portalKey}]${selector}`
        )
      )
  } else if (element) {
    return (selector: string) => toArray(element.querySelectorAll(selector))
  } else {
    return () => []
  }
}

const createGetElementFunc = (
  element?: HTMLElement,
  portalKey?: string
): GetElement => {
  // this should only ever return 1 element
  if (!element && !portalKey) {
    throw new Error('either portalKey or element must be provided')
  }
  return (id: string) =>
    createScopedSelector(element, portalKey)(
      `[${constants.DATA_FLIP_ID}="${id}"]`
    )[0]
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
  onComplete
}: OnFlipKeyUpdateArgs) => {
  const flippedElementPositionsAfterUpdate = getFlippedElementPositionsAfterUpdate(
    {
      element: containerEl,
      portalKey
    }
  )

  const scopedSelector = createScopedSelector(containerEl, portalKey)
  const getElement = createGetElementFunc(containerEl, portalKey)

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

  // @ts-ignore
  const animateUnFlippedElementsArgs: AnimateUnflippedElementsArgs = assign(
    {},
    baseArgs,
    {
      unflippedIds
    }
  )

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
  unflippedIds
    .filter(id => flippedElementPositionsAfterUpdate[id])
    .forEach(id => {
      const element = getElement(id)
      if (element) {
        element.removeAttribute(constants.DATA_IS_APPEARING)
      }
    })

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
