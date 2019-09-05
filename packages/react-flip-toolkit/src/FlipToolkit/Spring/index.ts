// this is exclusively for users of the library to create their own enter + exit animations
import { SpringSystem } from '../forked-rebound'
import { SpringSystemInterface } from '../forked-rebound/types.d'
import { tweenProp, assign } from '../utilities'
import { normalizeSpring, springPresets } from '../springSettings'
import { SimpleSpringOptions } from './types'
import { SpringConfig } from '../springSettings/types'

// this should get created only 1x
const springSystem: SpringSystemInterface = new SpringSystem()

/**
 * A simple spring function for animating DOM properties.
 * Returns a function that will immediately cancel the in-progress animation.
 * */
const createSimpleSpring = ({
  config,
  values,
  onUpdate,
  delay = 0,
  onComplete
}: SimpleSpringOptions) => {
  const { stiffness, damping, overshootClamping } = assign(
    {},
    springPresets.noWobble,
    normalizeSpring(config)
  ) as SpringConfig
  const spring = springSystem.createSpring(stiffness!, damping!)
  spring.setOvershootClampingEnabled(!!overshootClamping)
  spring.addListener({
    onSpringAtRest: spring => {
      if (onComplete) onComplete()
      spring.destroy()
    },
    onSpringUpdate: spring => {
      const springVal = spring.getCurrentValue()
      if (!values) return onUpdate(springVal)
      const currentValues = Object.keys(values)
        .map(value => [
          value,
          tweenProp(values[value][0], values[value][1], springVal)
        ])
        .reduce((acc, curr) => {
          return Object.assign(acc, { [curr[0]]: curr[1] })
        }, {})
      onUpdate(currentValues)
    }
  })
  if (delay) {
    setTimeout(() => {
      spring.setEndValue(1)
    }, delay)
  } else {
    spring.setEndValue(1)
  }
  return spring
}

export default createSimpleSpring
