import React, { Children, cloneElement, PureComponent } from "react"
import PropTypes from "prop-types"
import { FlipContext, PortalContext } from "./Flipper"
import * as constants from "./constants"
import assign from "object-assign"

const customPropCheck = function(props, propName) {
  if (props.flipId && props.inverseFlipId) {
    return new Error(
      'Please only provide one of the two: "FlipId" or "inverseFlipID"'
    )
  } else if (!props.flipId && !props.inverseFlipId) {
    return new Error(
      `Must provide either a "FlipId" or an "InverseFlipId" prop`
    )
  } else if (props[propName] && typeof props[propName] !== "string") {
    return new Error(`${propName} must be a string`)
  }
}

const propTypes = {
  children: PropTypes.node.isRequired,
  inverseFlipId: customPropCheck,
  flipId: customPropCheck,
  opacity: PropTypes.bool,
  translate: PropTypes.bool,
  scale: PropTypes.bool,
  transformOrigin: PropTypes.string,
  spring: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  onAppear: PropTypes.func,
  onDelayedAppear: PropTypes.func,
  onExit: PropTypes.func,
  componentIdFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  componentId: PropTypes.string,
  portalKey: PropTypes.string,
  stagger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}
// This wrapper creates child components for the main Flipper component
export function Flipped({
  children,
  flipId,
  inverseFlipId,
  componentId,
  portalKey,
  ...rest
}) {
  let child
  try {
    child = Children.only(children)
  } catch (e) {
    throw new Error("Each Flipped component must wrap a single child")
  }
  // if nothing is being animated, assume everything is being animated
  if (!rest.scale && !rest.translate && !rest.opacity) {
    assign(rest, {
      translate: true,
      scale: true,
      opacity: true
    })
  }

  const dataAttributes = {
    // these are both used as selectors so they have to be separate
    [constants.DATA_FLIP_ID]: flipId,
    [constants.DATA_INVERSE_FLIP_ID]: inverseFlipId,
    // we need to access this in getFlippedElementPositions
    // which is called in getSnapshotBeforeUpdate
    // so for performance add it as a data attribute
    [constants.DATA_FLIP_COMPONENT_ID]: componentId,
    [constants.DATA_FLIP_CONFIG]: JSON.stringify(assign(rest, { componentId }))
  }

  if (portalKey) {
    dataAttributes[constants.DATA_PORTAL_KEY] = portalKey
  }

  return cloneElement(child, dataAttributes)
}

class FlippedWithContext extends PureComponent {
  render() {
    const {
      children,
      flipId,
      onAppear,
      onDelayedAppear,
      onStart,
      onComplete,
      onExit,
      ...rest
    } = this.props
    if (rest.inverseFlipId) return <Flipped {...rest}>{children}</Flipped>
    return (
      <PortalContext.Consumer>
        {portalKey => (
          <FlipContext.Consumer>
            {data => {
              // if there is no surrounding Flipper component.
              // we don't want to throw an error here, so check
              // that data exists and is not the default string
              if (data instanceof Object) {
                data[flipId] = {
                  onAppear,
                  onDelayedAppear,
                  onStart,
                  onComplete,
                  onExit
                }
              }
              return (
                <Flipped flipId={flipId} {...rest} portalKey={portalKey}>
                  {children}
                </Flipped>
              )
            }}
          </FlipContext.Consumer>
        )}
      </PortalContext.Consumer>
    )
  }
}

FlippedWithContext.propTypes = propTypes

export default FlippedWithContext
