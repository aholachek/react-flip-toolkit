import { SpringSystem } from '../../../forked-rebound'
import { StaggerConfigValue } from '../../../Flipper/types'
import { FlipData, FlipDataArray } from '../types'
import { SpringSystemInterface } from '../../../forked-rebound/types'

// this should get created only 1x
const springSystem: SpringSystemInterface = new SpringSystem()

export const createSuspendedSpring = ({
  springConfig: { stiffness, damping, overshootClamping },
  noOp,
  onSpringActivate,
  getOnUpdateFunc,
  onAnimationEnd
}: FlipData) => {
  if (noOp) {
    return null
  }
  const spring = springSystem.createSpring(stiffness!, damping!)
  spring.setOvershootClampingEnabled(!!overshootClamping)
  spring.addListener({
    onSpringActivate,
    onSpringUpdate: getOnUpdateFunc(spring.destroy.bind(spring)),
    onSpringAtRest: () => {
      // prevent SpringSystem from caching unused springs
      spring.destroy()
      onAnimationEnd()
    }
  })
  return spring
}

export const createSpring = (flipped: FlipData) => {
  const spring = createSuspendedSpring(flipped)
  if (spring) {
    spring.setEndValue(1)
  } else {
    // even if it was a noop,
    // we still need to call onSpringActivate in case it calls
    // cascading flip initiation functions
    flipped.onSpringActivate()
  }
}

export const normalizeSpeed = (speedConfig: number | undefined) => {
  if (typeof speedConfig !== 'number') return 1.1
  return 1 + Math.min(Math.max(speedConfig * 5, 0), 5)
}

export const staggeredSprings = (
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

  const springFuncs = flippedArray
    .filter(flipped => !flipped.noOp)
    .map((flipped, i) => {
      const cachedGetOnUpdate = flipped.getOnUpdateFunc

      // modify the update function to adjust
      // the end value of the trailing Flipped component
      flipped.getOnUpdateFunc = stop => {
        const onUpdate = cachedGetOnUpdate(stop)
        return spring => {
          const currentValue = spring.getCurrentValue()
          if (currentValue > nextThreshold) {
            if (springFuncs[i + 1]) {
              springFuncs[i + 1]!.setEndValue(
                Math.min(currentValue * normalizedSpeed, 1)
              )
            }
          }
          // now call the actual update function
          onUpdate(spring)
        }
      }
      return flipped
    })
    .map(flipped => createSuspendedSpring(flipped))

  if (springFuncs[0]) {
    springFuncs[0]!.setEndValue(1)
  }
}
