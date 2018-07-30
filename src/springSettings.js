import assign from "object-assign"
import PropTypes from "prop-types"
import { isObject } from "./flip/utilities"

export const getSpringInterface = () => ({
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  overshootClamping: PropTypes.bool
})

// adapted from
// https://github.com/chenglou/react-motion/blob/9cb90eca20ecf56e77feb816d101a4a9110c7d70/src/presets.js
export const defaultSpringSettings = {
  noWobble: { stiffness: 200, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 260, damping: 26 }
}

export const getSpringConfig = ({ flipperSpring, flippedSpring }) => {
  const normalizeSpring = spring => {
    if (isObject(spring)) return spring
    else if (defaultSpringSettings[spring]) return defaultSpringSettings[spring]
    else return {}
  }

  return assign(
    {},
    defaultSpringSettings.noWobble,
    normalizeSpring(flipperSpring),
    normalizeSpring(flippedSpring)
  )
}
