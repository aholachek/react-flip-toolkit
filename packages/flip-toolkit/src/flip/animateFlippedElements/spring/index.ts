import { SpringSystem } from '../../../forked-rebound'
import { StaggerConfigValue } from '../../../types'
import { FlipData, FlipDataArray } from '../types'
import {
  SpringSystemInterface,
  AddListenerArgs
} from '../../../forked-rebound/types'

// this should get created only 1x
const springSystem: SpringSystemInterface = new SpringSystem()

export const createSuspendedSpring = (flipData: FlipData) => {
  const {
    springConfig: { stiffness, damping, overshootClamping },
    getOnUpdateFunc,
    onAnimationEnd,
    onSpringActivate
  } = flipData

  const spring = springSystem.createSpring(stiffness!, damping!)
  spring.setOvershootClampingEnabled(!!overshootClamping)
  const onSpringAtRest = () => {
    // prevent SpringSystem from caching unused springs
    spring.destroy()
    onAnimationEnd()
  }

  const springConfig: AddListenerArgs = {
    onSpringActivate,
    onSpringAtRest,
    onSpringUpdate: getOnUpdateFunc({
      spring,
      onAnimationEnd
    })
  }

  spring.addListener(springConfig)
  return spring
}

export const createSpring = (flipped: FlipData) => {
  const spring = createSuspendedSpring(flipped)
  spring.setEndValue(1)
  return spring
}

export const normalizeSpeed = (speedConfig: number | undefined) => {
  if (typeof speedConfig !== 'number') return 1.1
  return 1 + Math.min(Math.max(speedConfig * 5, 0), 5)
}

export const createStaggeredSprings = (
  flippedArray: FlipDataArray,
  staggerConfig: StaggerConfigValue = {}
) => {
  if (!flippedArray || !flippedArray.length) {
    return
  }

  if (staggerConfig.reverse) {
    flippedArray.reverse()
  }

  const normalizedSpeed = normalizeSpeed(staggerConfig.speed)

  const nextThreshold = 1 / Math.max(Math.min(flippedArray.length, 100), 10)

  const setEndValueFuncs = flippedArray
    .map((flipped, i) => {
      const cachedGetOnUpdate = flipped.getOnUpdateFunc

      // modify the update function to adjust
      // the end value of the trailing Flipped component
      flipped.getOnUpdateFunc = args => {
        const onUpdate = cachedGetOnUpdate(args)
        return spring => {
          let currentValue = spring.getCurrentValue()
          // make sure trailing animations complete
          currentValue =
            currentValue < 0.01 ? 0 : currentValue > 0.99 ? 1 : currentValue

          const updateTrailingAnimation = currentValue >= nextThreshold
          if (updateTrailingAnimation) {
            if (setEndValueFuncs[i + 1]) {
              setEndValueFuncs[i + 1]!(
                Math.max(Math.min(currentValue * normalizedSpeed, 1), 0)
              )
            }
          }
          // now call the actual update function
          onUpdate(spring)
        }
      }
      return flipped
    })
    .map(flipped => {
      const spring = createSuspendedSpring(flipped)
      if (!spring) {
        return
      }
      return spring.setEndValue.bind(spring)
    })
    .filter(Boolean)

  if (setEndValueFuncs[0]) {
    setEndValueFuncs[0]!(1)
  }
}
