import { isObject, assign } from '../utilities'
import { SpringPresets, SpringConfig, SpringOption } from './types'

// adapted from
// https://github.com/chenglou/react-motion/blob/master/src/presets.js
export const springPresets: SpringPresets = {
  noWobble: { stiffness: 200, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  veryGentle: { stiffness: 130, damping: 17 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 260, damping: 26 }
}

function argIsSpringConfig(
  arg: SpringConfig | keyof SpringPresets | undefined
): arg is SpringConfig {
  return isObject(arg)
}

export const normalizeSpring = (
  spring?: SpringConfig | keyof SpringPresets | any
) => {
  if (argIsSpringConfig(spring)) {
    return spring
  } else if (Object.keys(springPresets).indexOf(spring) > -1) {
    return springPresets[spring]
  } else {
    return {}
  }
}

export const getSpringConfig = ({
  flipperSpring,
  flippedSpring
}: { flipperSpring?: SpringOption; flippedSpring?: SpringOption } = {}) => {
  return assign(
    {},
    springPresets.noWobble,
    normalizeSpring(flipperSpring),
    normalizeSpring(flippedSpring)
  )
}
