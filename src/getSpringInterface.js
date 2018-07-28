import PropTypes from "prop-types"

const getSpringInterface = () => ({
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  overshootClamping: PropTypes.bool,

})

export default getSpringInterface
