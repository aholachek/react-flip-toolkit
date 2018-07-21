import PropTypes from "prop-types"

const getSpringInterface = () => ({
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  mass: PropTypes.number,
  initialVelocity: PropTypes.number,
  allowsOverdamping: PropTypes.bool,
  overshootClamping: PropTypes.bool
})

export default getSpringInterface
