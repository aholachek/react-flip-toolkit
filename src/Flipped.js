import React, { Children, cloneElement } from "react"
import PropTypes from "prop-types"
import { FlipContext } from "./Flipper"

const customPropCheck = function(props, propName, componentName) {
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
  ease: PropTypes.string,
  duration: PropTypes.number,
  delay: PropTypes.number,
  spring: PropTypes.shape({
    stiffness: PropTypes.number,
    damping: PropTypes.number,
    mass: PropTypes.number,
    initialVelocity: PropTypes.number,
    allowsOverdamping: PropTypes.bool,
    overshootClamping: PropTypes.bool
  }),
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  onAppear: PropTypes.func,
  onDelayedAppear: PropTypes.func,
  onExit: PropTypes.func,
  componentIdFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  componentId: PropTypes.string
}
// This wrapper creates child components for the main Flipper component
export function Flipped({
  children,
  flipId,
  inverseFlipId,
  componentId,
  onStart,
  onComplete,
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
    Object.assign(rest, {
      translate: true,
      scale: true,
      opacity: true
    })
  }

  return cloneElement(child, {
    // these are both used as selectors so they have to be separate
    "data-flip-id": flipId,
    "data-inverse-flip-id": inverseFlipId,
    // we need to access this in getFlippedElementPositions
    // which is called in getSnapshotBeforeUpdate
    // so for performance add it as a data attribute
    "data-flip-component-id": componentId,
    "data-flip-config": JSON.stringify(Object.assign(rest, { componentId }))
  })
}

const FlippedWithContext = ({
  children,
  flipId,
  onAppear,
  onDelayedAppear,
  onStart,
  onComplete,
  onExit,
  ...rest
}) => (
  <FlipContext.Consumer>
    {data => {
      data[flipId] = {
        onAppear,
        onDelayedAppear,
        onStart,
        onComplete,
        onExit
      }
      return (
        <Flipped flipId={flipId} {...rest}>
          {children}
        </Flipped>
      )
    }}
  </FlipContext.Consumer>
)

FlippedWithContext.propTypes = propTypes

export default FlippedWithContext
