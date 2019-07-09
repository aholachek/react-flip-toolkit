// this is exclusively for users of the library to create their own enter + exit animations
import { SpringSystem } from '../../../forked-rebound'
import { SpringSystemInterface } from '../../../forked-rebound/types'
import { tweenProp } from '../../../utilities'
import { normalizeSpring } from '../../../springSettings'
import { SimpleSpringOptions } from './types'

// this should get created only 1x
const springSystem: SpringSystemInterface = new SpringSystem()

const createSimpleSpring = ({
  springConfig,
  values,
  onUpdate,
  delay = 0,
  onComplete
}: SimpleSpringOptions) => {
  const { stiffness, damping, overshootClamping } = normalizeSpring(
    springConfig
  )
  const spring = springSystem.createSpring(stiffness, damping)
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
  return spring.destroy.bind(spring)
}

export default createSimpleSpring
