import React, { Component, createContext } from "react"
import PropTypes from "prop-types"
import onFlipKeyUpdate from "./flip/index"
import { getFlippedElementPositionsBeforeUpdate } from "./flip/getFlippedElementPositions"
import getSpringInterface from "./getSpringInterface"

export const FlipContext = createContext("flip")

export const PortalContext = createContext("portal")

class Flipper extends Component {
  static propTypes = {
    flipKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]).isRequired,
    children: PropTypes.node.isRequired,
    duration: PropTypes.number,
    ease: PropTypes.string,
    spring: PropTypes.shape(getSpringInterface()),
    applyTransformOrigin: PropTypes.bool,
    debug: PropTypes.bool,
    element: PropTypes.string,
    className: PropTypes.string,
    portalKey: PropTypes.string
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
    applyTransformOrigin: true,
    element: "div"
  }

  inProgressAnimations = {}

  flipCallbacks = {}

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.flipKey !== this.props.flipKey) {
      return getFlippedElementPositionsBeforeUpdate({
        element: this.el,
        // if onExit callbacks exist here, we'll cache the DOM node
        flipCallbacks: this.flipCallbacks,
        inProgressAnimations: this.inProgressAnimations,
        portalKey: this.props.portalKey
      })
    }
    return null
  }

  componentDidUpdate(prevProps, prevState, cachedFlipChildrenPositions) {
    if (this.props.flipKey !== prevProps.flipKey) {
      onFlipKeyUpdate({
        cachedFlipChildrenPositions,
        containerEl: this.el,
        duration: this.props.duration,
        ease: this.props.ease,
        inProgressAnimations: this.inProgressAnimations,
        flipCallbacks: this.flipCallbacks,
        applyTransformOrigin: this.props.applyTransformOrigin,
        spring: this.props.spring,
        debug: this.props.debug,
        portalKey: this.props.portalKey
      })
    }
  }

  render() {
    const { element, className, portalKey } = this.props
    const Element = element

    return (
      <PortalContext.Provider value={portalKey}>
        <FlipContext.Provider value={this.flipCallbacks}>
          <Element className={className} ref={el => (this.el = el)}>
            {this.props.children}
          </Element>
        </FlipContext.Provider>
      </PortalContext.Provider>
    )
  }
}

export default Flipper
