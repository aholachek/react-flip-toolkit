import assign from "object-assign"
import PropTypes from "prop-types"
import { isObject } from "../flip/utilities"

export const getSpringInterface = () => ({
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  overshootClamping: PropTypes.bool
})

// adapted from
// https://github.com/chenglou/react-motion/blob/master/src/presets.js
export const springPresets = {
  noWobble: { stiffness: 200, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 260, damping: 26 }
}

export const getSpringConfig = ({ flipperSpring, flippedSpring } = {}) => {
  const normalizeSpring = spring => {
    if (isObject(spring)) return spring
    else if (springPresets[spring]) return springPresets[spring]
    else return {}
  }

  return assign(
    {},
    springPresets.noWobble,
    normalizeSpring(flipperSpring),
    normalizeSpring(flippedSpring)
  )
}

export const springPropCheck = function(props, propName) {
  const spring = props.spring
  const availablePresets = Object.keys(springPresets)
  if (typeof spring === "string" && availablePresets.indexOf(spring) === -1) {
    return new Error(
      `Spring config should reference one of the available spring options: ${availablePresets.join(
        " "
      )}. You provided: ${spring}`
    )
  } else if (isObject(spring) && spring.preset) {
    return new Error(
      "To specify a preset, just provide the string name directly to the spring prop"
    )
  } else if (spring) {
    return new Error(
      "Provide a string or an object to configure spring settings"
    )
  }
}
