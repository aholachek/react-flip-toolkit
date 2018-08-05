import React, { Component, createContext } from "react"
import PropTypes from "prop-types"
import onFlipKeyUpdate from "./flip"
import { getFlippedElementPositionsBeforeUpdate } from "./flip/getFlippedElementPositions"

export const FlipContext = createContext("flip")
export const PortalContext = createContext("portal")

class Flipper extends Component {
  static propTypes = {
    flipKey: PropTypes.any.isRequired,
    children: PropTypes.node.isRequired,
    spring: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    applyTransformOrigin: PropTypes.bool,
    debug: PropTypes.bool,
    element: PropTypes.string,
    className: PropTypes.string,
    portalKey: PropTypes.string,
    jitterFix: PropTypes.bool
  }

  static defaultProps = {
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
        spring: this.props.spring,
        debug: this.props.debug,
        portalKey: this.props.portalKey,
        jitterFix: this.props.jitterFix
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
