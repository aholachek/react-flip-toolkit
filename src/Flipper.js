import React, { Component, createContext } from "react"
import PropTypes from "prop-types"
import onFlipKeyUpdate from "./flip/index"
import { getFlippedElementPositionsBeforeUpdate } from "./flip/getFlippedElementPositions"
import getSpringInterface from "./getSpringInterface"
import { isObject } from "./flip/utilities"

export const FlipContext = createContext("flip")
export const PortalContext = createContext("portal")

// https://github.com/chenglou/react-motion/blob/9cb90eca20ecf56e77feb816d101a4a9110c7d70/src/presets.js
const defaults = {
  noWobble: { stiffness: 170, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 }
}

const getSpringConfig = spring => {
  if (Object.keys(defaults).indexOf(spring) !== -1) {
    return defaults[spring]
  } else if (isObject(spring)) {
    return Object.assign(defaults[spring], spring)
  } else {
    return defaults.noWobble
  }
}

class Flipper extends Component {
  static propTypes = {
    flipKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]).isRequired,
    children: PropTypes.node.isRequired,
    spring: PropTypes.shape(getSpringInterface()),
    applyTransformOrigin: PropTypes.bool,
    debug: PropTypes.bool,
    element: PropTypes.string,
    className: PropTypes.string,
    portalKey: PropTypes.string,
    // TODO: figure this out
    staggerConfig: PropTypes.object
  }

  static defaultProps = {
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

  componentDidUpdate(prevProps, prevState, cachedData) {
    if (this.props.flipKey !== prevProps.flipKey) {
      onFlipKeyUpdate({
        cachedFlipChildrenPositions: cachedData.flippedElementPositions,
        cachedOrderedFlipIds: cachedData.cachedOrderedFlipIds,
        containerEl: this.el,
        inProgressAnimations: this.inProgressAnimations,
        flipCallbacks: this.flipCallbacks,
        applyTransformOrigin: this.props.applyTransformOrigin,
        spring: getSpringConfig(this.props.spring),
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
