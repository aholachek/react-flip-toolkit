import * as Rematrix from 'rematrix'
import { getSpringConfig } from '../../springSettings'
import {
  toArray,
  isFunction,
  isNumber,
  getDuplicateValsAsStrings,
  assign
} from '../../utilities'
import * as constants from '../../constants'
import filterFlipDescendants from './filterFlipDescendants'
import initiateAnimations from './initiateAnimations'
import {
  GetOnUpdateFunc,
  OnUpdate,
  Matrix,
  InvertedChildren,
  AnimateFlippedElementsArgs,
  AnimatedVals,
  FlipDataArray,
  FlipData,
  FlipDataDict,
  InitializeFlip,
  TopLevelChildren
} from './types'
import { BoundingClientRect } from '../getFlippedElementPositions/types'

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
      transformString += `translate(${inverseVals.translateX}px, ${
        inverseVals.translateY
      }px)`
    }
    if (childFlipConfig.scale) {
      inverseVals.scaleX = 1 / scaleX
      inverseVals.scaleY = 1 / scaleY
      transformString += ` scale(${inverseVals.scaleX}, ${inverseVals.scaleY})`
    }
    child.style.transform = transformString
  })
}

export const createApplyStylesFunc = ({
  element,
  invertedChildren,
  body,
  retainTransform
}: {
  element: HTMLElement
  invertedChildren: InvertedChildren
  body: HTMLBodyElement
  retainTransform: boolean
}) => ({
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

  const identityTransform = 'matrix(1, 0, 0, 1, 0, 0)'
  const transformWithInvisibleSkew = 'matrix(1, 0.00001, -0.00001, 1, 0, 0)'

  let stringTransform = convertMatrix2dArrayToString(matrix)

  if (stringTransform === identityTransform) {
    if (retainTransform) {
      stringTransform = transformWithInvisibleSkew
    } else {
      stringTransform = ''
    }
  }

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

export const tweenProp = (start: number, end: number, position: number) =>
  start + (end - start) * position

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
  staggerConfig,
  decisionData,
  scopedSelector,
  retainTransform
}: AnimateFlippedElementsArgs) => {
  const firstElement: HTMLElement = getElement(flippedIds[0])
  const body = firstElement.ownerDocument!.querySelector('body')!

  // the stuff below is used so we can return a promise that resolves when all FLIP animations have
  // completed
  let closureResolve: () => void
  const flipCompletedPromise = new Promise(resolve => {
    closureResolve = resolve
  })
  let withInitFuncs: FlipDataArray
  const completedAnimationIds: string[] = []

  if (debug) {
    // eslint-disable-next-line no-console
    console.error(
      '[react-flip-toolkit]\nThe "debug" prop is set to true. All FLIP animations will return at the beginning of the transition.'
    )
  }

  const duplicateFlipIds = getDuplicateValsAsStrings(flippedIds)
  if (duplicateFlipIds.length) {
    // eslint-disable-next-line no-console
    console.error(
      `[react-flip-toolkit]\nThere are currently multiple elements with the same flipId on the page.\nThe animation will only work if each Flipped component has a unique flipId.\nDuplicate flipId${
        duplicateFlipIds.length > 1 ? 's' : ''
      }: ${duplicateFlipIds.join('\n')}`
    )
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

      // don't animate elements outside of the user's viewport
      if (!rectInViewport(prevRect) && !rectInViewport(currentRect)) {
        return false
      }
      // it's never going to be visible, so dont animate it
      if (
        (prevRect.width === 0 && currentRect.width === 0) ||
        (prevRect.height === 0 && currentRect.height === 0)
      ) {
        return false
      }

      const element = getElement(id)

      // this might happen if we are rapidly adding & removing elements(?)
      if (!element) {
        return false
      }

      const flipConfig = JSON.parse(element.dataset.flipConfig!)

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
        springConfig,
        noOp: true
      }

      if (flipCallbacks[id] && flipCallbacks[id].shouldFlip) {
        const elementShouldFlip = flipCallbacks[id].shouldFlip!(
          decisionData.prev,
          decisionData.current
        )
        // this element wont be animated, but its children might be
        if (!elementShouldFlip) {
          return toReturn
        }
      }

      // don't animate elements that didn't visbly change
      // but possibly animate their children
      const transformDifference =
        Math.abs(prevRect.left - currentRect.left) +
        Math.abs(prevRect.top - currentRect.top)
      const sizeDifference =
        Math.abs(prevRect.width - currentRect.width) +
        Math.abs(prevRect.height - currentRect.height)
      const opacityDifference = Math.abs(currentOpacity - prevOpacity)
      if (
        transformDifference < 0.5 &&
        sizeDifference < 0.5 &&
        opacityDifference < 0.01
      ) {
        // this element wont be animated, but its children might be
        return toReturn
      }

      toReturn.noOp = false

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
        flipCallbacks[id].shouldInvert!(decisionData.prev, decisionData.current)
      ) {
        const invertedChildElements = getInvertedChildren(element, id)
        invertedChildren = invertedChildElements.map(c => [
          c,
          JSON.parse(c.dataset.flipConfig!)
        ]) as InvertedChildren
      }

      fromVals.matrix = convertMatrix3dArrayTo2dArray(
        transformsArray.reduce(Rematrix.multiply)
      )

      toVals.matrix = convertMatrix3dArrayTo2dArray(toVals.matrix)

      const applyStyles = createApplyStylesFunc({
        element,
        invertedChildren,
        body,
        retainTransform
      })

      let onComplete: () => void
      if (flipCallbacks[id] && flipCallbacks[id].onComplete) {
        // must cache or else this could cause an error
        const cachedOnComplete = flipCallbacks[id].onComplete
        onComplete = () =>
          cachedOnComplete!(element, decisionData.prev, decisionData.current)
      }

      // this should be called when animation ends naturally
      // but also when it is interrupted
      // when it is called, the animation has already been cancelled
      const onAnimationEnd = () => {
        delete inProgressAnimations[id]
        if (isFunction(onComplete)) {
          onComplete()
        }
        if (needsForcedMinVals && element) {
          element.style.minHeight = ''
          element.style.minWidth = ''
        }
        completedAnimationIds.push(id)

        if (completedAnimationIds.length >= withInitFuncs.length) {
          // we can theoretically call multiple times since a promise only resolves 1x
          // but that shouldnt happen
          closureResolve()
        }
      }

      const animateOpacity =
        isNumber(fromVals.opacity) &&
        isNumber(toVals.opacity) &&
        fromVals.opacity !== toVals.opacity

      let onStartCalled = false

      const getOnUpdateFunc: GetOnUpdateFunc = stop => {
        inProgressAnimations[id] = {
          stop,
          onComplete
        }
        const onUpdate: OnUpdate = spring => {
          // trigger the user provided onStart function
          if (!onStartCalled) {
            onStartCalled = true
            if (flipCallbacks[id] && flipCallbacks[id].onStart) {
              flipCallbacks[id].onStart!(
                element,
                decisionData.prev,
                decisionData.current
              )
            }
          }

          const currentValue = spring.getCurrentValue()

          if (!body.contains(element)) {
            stop()
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
          flipCallbacks[id].onStartImmediate!(
            element,
            decisionData.prev,
            decisionData.current
          )
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
        onAnimationEnd
      }) as FlipData
    })
    // filter out data for all non-animated elements first
    .filter(x => x) as FlipDataArray

  // we use this array to compare with completed animations
  // to decide when all animations are completed
  withInitFuncs = flipDataArray.filter(({ initializeFlip }) =>
    Boolean(initializeFlip)
  )
  //  put items back in place
  withInitFuncs.forEach(({ initializeFlip }) => initializeFlip())

  if (debug) {
    return () => {}
  }

  const flipDataDict: FlipDataDict = flipDataArray.reduce((acc, curr) => {
    acc[curr.id] = curr
    return acc
  }, {})

  // this function modifies flipDataDict in-place
  // by removing references to non-direct children
  // to enable recursive stagger
  const topLevelChildren: TopLevelChildren = filterFlipDescendants({
    flipDataDict,
    flippedIds,
    scopedSelector
  })

  return () => {
    // there are no active FLIP animations, so immediately resolve the
    // returned promise
    if (!withInitFuncs.length) {
      closureResolve()
    }
    initiateAnimations({ topLevelChildren, flipDataDict, staggerConfig })
    return flipCompletedPromise
  }
}
