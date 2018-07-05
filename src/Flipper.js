import React, { Component, createContext } from "react"
import PropTypes from "prop-types"
import { animateMove, getFlippedElementPositions } from "./flipHelpers"

export const FlipContext = createContext("flip")

class Flipper extends Component {
  static propTypes = {
    flipKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]),
    children: PropTypes.node.isRequired,
    duration: PropTypes.number,
    ease: PropTypes.string,
    spring: PropTypes.shape({
      stiffness: PropTypes.number,
      damping: PropTypes.number,
      mass: PropTypes.number,
      initialVelocity: PropTypes.number,
      allowsOverdamping: PropTypes.bool,
      overshootClamping: PropTypes.bool
    }),
    applyTransformOrigin: PropTypes.bool
  }

  static defaultProps = {
    // by default, the easing function is a spring
    spring: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true
    },
    // but if a ease string is supplied this is the default duration
    duration: 250,
    applyTransformOrigin: true
  }

  inProgressAnimations = {}

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.flipKey !== this.props.flipKey) {
      return getFlippedElementPositions({
        element: this.el,
        inProgressAnimations: this.inProgressAnimations
      })
    }
    return null
  }

  componentDidUpdate(prevProps, prevState, cachedFlipChildrenPositions) {
    if (this.props.flipKey !== prevProps.flipKey) {
      animateMove({
        cachedFlipChildrenPositions,
        containerEl: this.el,
        duration: this.props.duration,
        ease: this.props.ease,
        inProgressAnimations: this.inProgressAnimations,
        flipCallbacks: this.flipCallbacks,
        applyTransformOrigin: this.props.applyTransformOrigin,
        spring: this.props.spring
      })
    }
  }

  flipCallbacks = {}

  render() {
    return (
      <FlipContext.Provider value={this.flipCallbacks}>
        <div ref={el => (this.el = el)}>{this.props.children}</div>
      </FlipContext.Provider>
    )
  }
}

export default Flipper
