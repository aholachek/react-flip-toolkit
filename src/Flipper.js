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
    applyTransformOrigin: PropTypes.bool
  }

  static defaultProps = {
    duration: 250,
    ease: "easeOut",
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
      this.inProgressAnimations = animateMove({
        cachedFlipChildrenPositions,
        containerEl: this.el,
        duration: this.props.duration,
        ease: this.props.ease,
        inProgressAnimations: this.inProgressAnimations,
        flipCallbacks: this.flipCallbacks,
        applyTransformOrigin: this.props.applyTransformOrigin
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
