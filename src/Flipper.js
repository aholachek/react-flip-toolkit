import React, { Component, createContext } from "react"
import PropTypes from "prop-types"
import { animateMove, getFlippedElementPositions } from "./flipHelpers"

export const FlipContext = React.createContext("flip")

class Flipper extends Component {
  static propTypes = {
    flipKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]),
    children: PropTypes.node.isRequired,
    duration: PropTypes.number,
    ease: PropTypes.string
  }

  static defaultProps = {
    duration: 250,
    ease: "easeOut"
  }

  inProgressAnimations = {}

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.flipKey !== this.props.flipKey) {
      return getFlippedElementPositions(this.el)
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
        flipCallbacks: this.flipCallbacks
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
