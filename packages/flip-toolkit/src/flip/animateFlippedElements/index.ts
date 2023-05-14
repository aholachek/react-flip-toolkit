import * as Rematrix from 'rematrix'
import { getSpringConfig } from '../../springSettings'
import {
  toArray,
  isFunction,
  isNumber,
  getDuplicateValsAsStrings,
  assign,
  tweenProp
} from '../../utilities'
import * as constants from '../../constants'
import {
  GetOnUpdateFunc,
  OnUpdate,
  Matrix,
  InvertedChildren,
  AnimateFlippedElementsArgs,
  AnimatedVals,
  FlipDataArray,
  FlipData,
  InitializeFlip
} from './types'
import { BoundingClientRect } from '../getFlippedElementPositions/types'
import { FlippedIds } from '../types'
import { createSpring, createStaggeredSprings } from './spring'
import { IndexableObject } from '../../utilities/types'
import { FlipId } from '../../types'

// 3d transforms were causing weird issues in chrome,
// especially when opacity was also being tweened,
// so convert to a 2d matrix
export const convertMatrix3dArrayTo2dArray = (matrix: Matrix): Matrix =>
  [0, 1, 4, 5, 12, 13].map(index => matrix[index])

export const convertMatrix2dArrayToString = (matrix: Matrix) =>
  `matrix(${matrix.join(', ')})`

export const invertTransformsForChildren = ({
  invertedChildren,
  matrix,
  body
}: {
  matrix: Matrix
  body: HTMLBodyElement
  invertedChildren: InvertedChildren
}) => {
  invertedChildren.forEach(([child, childFlipConfig]) => {
    if (!body.contains(child)) {
      return
    }
    const scaleX = matrix[0]
    const scaleY = matrix[3]
    const translateX = matrix[4]
    const translateY = matrix[5]

    const inverseVals = { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 }
    let transformString = ''
    if (childFlipConfig.translate) {
      inverseVals.translateX = -translateX / scaleX
      inverseVals.translateY = -translateY / scaleY
      transformString += `translate(${inverseVals.translateX}px, ${inverseVals.translateY}px)`
    }
    if (childFlipConfig.scale) {
      inverseVals.scaleX = 1 / scaleX
      inverseVals.scaleY = 1 / scaleY
      transformString += ` scale(${inverseVals.scaleX}, ${inverseVals.scaleY})`
    }
    child.style.transform = transformString
  })
}

export const createApplyStylesFunc =
  ({
    element,
    invertedChildren,
    body
  }: {
    element: HTMLElement
    invertedChildren: InvertedChildren
    body: HTMLBodyElement
  }) =>
  ({
    matrix,
    opacity,
    forceMinVals
  }: {
    matrix: Matrix
    opacity?: number
    forceMinVals?: boolean
  }) => {
    if (isNumber(opacity)) {
      element.style.opacity = opacity + ''
    }

    if (forceMinVals) {
      element.style.minHeight = '1px'
      element.style.minWidth = '1px'
    }

    if (!matrix) {
      return
    }

    const stringTransform = convertMatrix2dArrayToString(matrix)

    // always apply transform, even if identity,
    // because identity might be the starting state in a FLIP
    // transition, if the element's position is controlled by transforms
    element.style.transform = stringTransform

    if (invertedChildren) {
      invertTransformsForChildren({
        invertedChildren,
        matrix,
        body
      })
    }
  }

export const rectInViewport = ({
  top,
  bottom,
  left,
  right
}: BoundingClientRect) => {
  return (
    top < window.innerHeight &&
    bottom > 0 &&
    left < window.innerWidth &&
    right > 0
  )
}

const getInvertedChildren = (element: HTMLElement, id: string) =>
  toArray(
    element.querySelectorAll(`[${constants.DATA_INVERSE_FLIP_ID}="${id}"]`)
  )

function extractFlipConfig(element: HTMLElement) {
  const flipConfig = JSON.parse(element.dataset.flipConfig || '{}')
  return flipConfig
}

export default ({
  flippedIds,
  flipCallbacks,
  inProgressAnimations,
  flippedElementPositionsBeforeUpdate,
  flippedElementPositionsAfterUpdate,
  applyTransformOrigin,
  spring,
  getElement,
  debug,
  staggerConfig = {},
  decisionData = {},
  onComplete,
  containerEl
}: AnimateFlippedElementsArgs) => {
  // the stuff below is used so we can return a promise that resolves when all FLIP animations have
  // completed
  let closureResolve: (flipIds: FlippedIds) => void

  const flipCompletedPromise: Promise<FlippedIds> = new Promise(resolve => {
    closureResolve = resolve
  })
  // hook for users of lib to attach logic when all flip animations have completed
  if (onComplete) {
    flipCompletedPromise.then(() => onComplete(containerEl, decisionData))
  }
  if (!flippedIds.length) {
    return () => {
      closureResolve!([])
      return flipCompletedPromise
    }
  }

  const completedAnimationIds: FlippedIds = []

  const firstElement: HTMLElement = getElement(flippedIds[0])
  // special handling for iframes
  const body = firstElement
    ? firstElement.ownerDocument!.querySelector('body')!
    : document.querySelector('body')!

  if (process.env.NODE_ENV !== 'production') {
    if (debug) {
      // eslint-disable-next-line no-console
      console.error(
        '[react-flip-toolkit]\nThe "debug" prop is set to true. All FLIP animations will return at the beginning of the transition.'
      )
    }
  }

  const duplicateFlipIds = getDuplicateValsAsStrings(flippedIds)
  if (process.env.NODE_ENV !== 'production') {
    if (duplicateFlipIds.length) {
      // eslint-disable-next-line no-console
      console.error(
        `[react-flip-toolkit]\nThere are currently multiple elements with the same flipId on the page.\nThe animation will only work if each Flipped component has a unique flipId.\nDuplicate flipId${
          duplicateFlipIds.length > 1 ? 's' : ''
        }: ${duplicateFlipIds.join('\n')}`
      )
    }
  }

  const flipDataArray: FlipDataArray = flippedIds

    // take all the measurements we need
    // and return an object with animation functions + necessary data
    .map(id => {
      const prevRect = flippedElementPositionsBeforeUpdate[id].rect
      const currentRect = flippedElementPositionsAfterUpdate[id].rect
      const prevOpacity = flippedElementPositionsBeforeUpdate[id].opacity
      const currentOpacity = flippedElementPositionsAfterUpdate[id].opacity
      const needsForcedMinVals = currentRect.width < 1 || currentRect.height < 1
      const element = flippedElementPositionsAfterUpdate[id].element

      // don't animate elements outside of the user's viewport
      if (!rectInViewport(prevRect) && !rectInViewport(currentRect)) {
        return false
      }

      // this might happen if we are rapidly adding & removing elements(?)
      if (!element) {
        return false
      }

      const flipConfig = extractFlipConfig(element)

      const springConfig = getSpringConfig({
        flipperSpring: spring,
        flippedSpring: flipConfig.spring
      })

      const stagger =
        flipConfig.stagger === true ? 'default' : flipConfig.stagger

      const toReturn = {
        element,
        id,
        stagger,
        springConfig
      }

      if (flipCallbacks[id] && flipCallbacks[id].shouldFlip) {
        const elementShouldFlip = flipCallbacks[id].shouldFlip!(
          decisionData.previous,
          decisionData.current
        )
        if (!elementShouldFlip) {
          return false
        }
      }

      // don't animate elements that didn't visibly change
      // but possibly animate their children

      const translateXDifference = Math.abs(prevRect.left - currentRect.left)
      const translateYDifference = Math.abs(prevRect.top - currentRect.top)

      const translateDifference = translateXDifference + translateYDifference

      const scaleXDifference = Math.abs(prevRect.width - currentRect.width)
      const scaleYDifference = Math.abs(prevRect.height - currentRect.height)

      const scaleDifference = scaleXDifference + scaleYDifference

      const opacityDifference = Math.abs(currentOpacity - prevOpacity)
      const differenceTooSmall =
        translateDifference < 0.5 &&
        scaleDifference < 0.5 &&
        opacityDifference < 0.01

      const hiddenDueToDimensions =
        (prevRect.height === 0 && currentRect.height === 0) ||
        (prevRect.width === 0 && currentRect.width === 0)
      if (hiddenDueToDimensions || differenceTooSmall) {
        return false
      }

      const currentTransform = Rematrix.parse(
        flippedElementPositionsAfterUpdate[id].transform
      )

      const toVals: AnimatedVals = { matrix: currentTransform }

      const fromVals: AnimatedVals = { matrix: [] }
      const transformsArray = [currentTransform]

      // we're only going to animate the values that the child wants animated
      if (flipConfig.translate) {
        transformsArray.push(
          Rematrix.translateX(prevRect.left - currentRect.left)
        )
        transformsArray.push(
          Rematrix.translateY(prevRect.top - currentRect.top)
        )
      }
      // going any smaller than 1px breaks transitions in Chrome
      if (flipConfig.scale) {
        transformsArray.push(
          Rematrix.scaleX(
            Math.max(prevRect.width, 1) / Math.max(currentRect.width, 1)
          )
        )
        transformsArray.push(
          Rematrix.scaleY(
            Math.max(prevRect.height, 1) / Math.max(currentRect.height, 1)
          )
        )
      }

      if (flipConfig.opacity) {
        fromVals.opacity = prevOpacity
        toVals.opacity = currentOpacity
      }

      let invertedChildren: InvertedChildren = []

      if (
        !flipCallbacks[id] ||
        !flipCallbacks[id].shouldInvert ||
        flipCallbacks[id].shouldInvert!(
          decisionData.previous,
          decisionData.current
        )
      ) {
        const invertedChildElements = getInvertedChildren(element, id)
        invertedChildren = invertedChildElements.map(c => [
          c,
          extractFlipConfig(c)
        ]) as InvertedChildren
      }

      fromVals.matrix = convertMatrix3dArrayTo2dArray(
        transformsArray.reduce(Rematrix.multiply)
      )

      toVals.matrix = convertMatrix3dArrayTo2dArray(toVals.matrix)

      const applyStyles = createApplyStylesFunc({
        element,
        invertedChildren,
        body
      })

      let onComplete: () => void
      if (flipCallbacks[id] && flipCallbacks[id].onComplete) {
        // must cache or else this could cause an error
        const cachedOnComplete = flipCallbacks[id].onComplete
        onComplete = () => cachedOnComplete!(element, decisionData)
      }

      // this should be called when animation ends naturally
      // but also when it is interrupted
      // when it is called, the animation has already been cancelled
      const onAnimationEnd = (isCancellation: boolean) => {
        delete inProgressAnimations[id]
        if (isFunction(onComplete)) {
          onComplete()
        }
        // remove identity transform -- this should have no effect on layout
        element.style.transform = ''
        invertedChildren.forEach(([element]) => {
          element.style.transform = ''
        })
        if (needsForcedMinVals && element) {
          element.style.minHeight = ''
          element.style.minWidth = ''
        }
        if (isCancellation) return

        completedAnimationIds.push(id)

        if (completedAnimationIds.length >= flipDataArray.length) {
          // we can theoretically call multiple times since a promise only resolves 1x
          // but that shouldnt happen
          closureResolve(completedAnimationIds)
        }
      }

      const animateOpacity =
        isNumber(fromVals.opacity) &&
        isNumber(toVals.opacity) &&
        fromVals.opacity !== toVals.opacity

      let onStartCalled = false

      const getOnUpdateFunc: GetOnUpdateFunc = ({ spring, onAnimationEnd }) => {
        inProgressAnimations[id] = {
          destroy: spring.destroy.bind(spring),
          onAnimationEnd
        }
        const onUpdate: OnUpdate = spring => {
          if (flipCallbacks[id] && flipCallbacks[id].onSpringUpdate) {
            flipCallbacks[id].onSpringUpdate!(spring.getCurrentValue())
          }
          // trigger the user provided onStart function
          if (!onStartCalled) {
            onStartCalled = true
            if (flipCallbacks[id] && flipCallbacks[id].onStart) {
              flipCallbacks[id].onStart!(element, decisionData)
            }
          }

          const currentValue = spring.getCurrentValue()
          if (!body.contains(element)) {
            spring.destroy()
            return
          }

          const vals: AnimatedVals = { matrix: [] }

          vals.matrix = fromVals.matrix.map((fromVal, index) =>
            tweenProp(fromVal, toVals.matrix[index], currentValue)
          )

          if (animateOpacity) {
            vals.opacity = tweenProp(
              fromVals.opacity!,
              toVals.opacity!,
              currentValue
            )
          }
          applyStyles(vals)
        }
        return onUpdate
      }

      const initializeFlip: InitializeFlip = () => {
        // before animating, immediately apply FLIP styles to prevent flicker
        applyStyles({
          matrix: fromVals.matrix,
          opacity: animateOpacity ? fromVals.opacity : undefined,
          forceMinVals: needsForcedMinVals
        })

        if (flipCallbacks[id] && flipCallbacks[id].onStartImmediate) {
          flipCallbacks[id].onStartImmediate!(element, decisionData)
        }
        // and batch any other style updates if necessary
        if (flipConfig.transformOrigin) {
          element.style.transformOrigin = flipConfig.transformOrigin
        } else if (applyTransformOrigin) {
          element.style.transformOrigin = '0 0'
        }

        invertedChildren.forEach(([child, childFlipConfig]) => {
          if (childFlipConfig.transformOrigin) {
            child.style.transformOrigin = childFlipConfig.transformOrigin
          } else if (applyTransformOrigin) {
            child.style.transformOrigin = '0 0'
          }
        })
      }

      return assign({}, toReturn, {
        stagger,
        springConfig,
        getOnUpdateFunc,
        initializeFlip,
        onAnimationEnd,
        delayUntil: flipConfig.delayUntil
      }) as FlipData
    })
    // filter out data for all non-animated elements first
    .filter(Boolean) as FlipDataArray

  flipDataArray.forEach(({ initializeFlip }) => initializeFlip())

  if (debug) {
    return () => {}
  }

  const elementIsFlipped = (flipId: FlipId) =>
    flipDataArray.filter(f => f.id === flipId).length

  const delayedFlip = flipDataArray.filter(
    f => f.delayUntil && elementIsFlipped(f.delayUntil)
  )

  // key: flipId value: flip to delay until key is called
  const delayUntilSprings = {} as IndexableObject
  // key: flipId value: stagger to delay until key is called
  const delayUntilStaggers = {} as IndexableObject
  // key: stagger value: true
  const delayedStaggerKeys = {} as IndexableObject

  delayedFlip.forEach(flip => {
    if (flip.stagger) {
      delayedStaggerKeys[flip.stagger] = true
      if (delayUntilStaggers[flip.delayUntil!])
        delayUntilStaggers[flip.delayUntil!].push(flip.stagger)
      else delayUntilStaggers[flip.delayUntil!] = [flip.stagger]
    } else {
      if (delayUntilSprings[flip.delayUntil!])
        delayUntilSprings[flip.delayUntil!].push(flip)
      else delayUntilSprings[flip.delayUntil!] = [flip]
    }
  })

  const staggerDict = flipDataArray
    .filter(flipData => flipData.stagger)
    .reduce((acc, curr) => {
      if (acc[curr.stagger]) {
        acc[curr.stagger].push(curr)
      } else {
        acc[curr.stagger] = [curr]
      }
      return acc
    }, {} as IndexableObject)

  const immediateFlip = flipDataArray.filter(f => delayedFlip.indexOf(f) === -1)

  immediateFlip.forEach(flipData => {
    flipData.onSpringActivate = () => {
      if (delayUntilSprings[flipData.id]) {
        delayUntilSprings[flipData.id].forEach(createSpring)
      }
      if (delayUntilStaggers[flipData.id]) {
        const uniqueStaggerKeys = Object.keys(
          delayUntilStaggers[flipData.id].reduce(
            (acc: IndexableObject, curr: string) =>
              assign(acc, { [curr]: true }),
            {}
          )
        )
        uniqueStaggerKeys.forEach((staggerKey: string) => {
          createStaggeredSprings(
            staggerDict[staggerKey],
            staggerConfig[staggerKey]
          )
        })
      }
    }
  })

  return () => {
    // if there are no active FLIP animations, immediately resolve the
    // returned promise
    if (!flipDataArray.length) {
      closureResolve([])
    }
    // animate non-staggered elements
    immediateFlip
      .filter(flipData => {
        return !flipData.stagger
      })
      .forEach(createSpring)

    // animate staggered elements
    Object.keys(staggerDict).forEach(staggerKey => {
      if (delayedStaggerKeys[staggerKey]) return
      createStaggeredSprings(staggerDict[staggerKey], staggerConfig[staggerKey])
    })
    return flipCompletedPromise
  }
}
