import { SpringSystem } from "../../forked-rebound"

// this should get created only 1x
const springSystem = new SpringSystem()

export const createSuspendedSpring = ({
  springConfig: { stiffness, damping, overshootClamping },
  noOp,
  onSpringActivate,
  getOnUpdateFunc,
  onAnimationEnd
}) => {
  if (noOp) return
  const spring = springSystem.createSpring(stiffness, damping)
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

export const createSpring = flipped => {
  const spring = createSuspendedSpring(flipped)
  if (spring) spring.setEndValue(1)
  else {
    // even if it was a noop,
    // we still need to call onSpringActivate in case it calls
    // cascading flip initiation functions
    flipped.onSpringActivate()
  }
}

export const staggeredSprings = (flippedArray, staggerConfig = {}) => {
  if (!flippedArray || !flippedArray.length) return

  if (staggerConfig.direction === "reverse") flippedArray.reverse()

  const normalizedSpeed = staggerConfig.speed
    ? 1 + Math.max(Math.min(staggerConfig.speed, 0), 1)
    : 1.1

  const nextThreshold = 1 / Math.max(Math.min(flippedArray.length, 100), 10)

  const springFuncs = flippedArray
    .filter(flipped => !flipped.noOp)
    .map((flipped, i) => {
      const cachedGetOnUpdate = flipped.getOnUpdateFunc

      flipped.getOnUpdateFunc = stop => {
        const onUpdate = cachedGetOnUpdate(stop)
        return spring => {
          const currentValue = spring.getCurrentValue()
          if (currentValue > nextThreshold) {
            springFuncs[i + 1] &&
              springFuncs[i + 1].setEndValue(
                Math.min(currentValue * normalizedSpeed, 1)
              )
          }
          // now call the actual update function
          onUpdate(spring)
        }
      }
      return flipped
    })
    .map(flipped => createSuspendedSpring(flipped))

  springFuncs[0] && springFuncs[0].setEndValue(1)
}
