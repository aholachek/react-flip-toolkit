import React, { Children, cloneElement } from "react"
import PropTypes from "prop-types"
import { FlipContext } from "./Flipper"

const propTypes = {
  children: PropTypes.node.isRequired,
  flipId: PropTypes.string,
  inverseFlipId: PropTypes.string,
  opacity: PropTypes.bool,
  translate: PropTypes.bool,
  scale: PropTypes.bool,
  transformOrigin: PropTypes.string,
  ease: PropTypes.string,
  duration: PropTypes.number,
  delay: PropTypes.number,
  onAppear: PropTypes.func,
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  onAppear: PropTypes.func,
  componentIdFilter: PropTypes.string,
  componentId: PropTypes.string
}
// This wrapper creates child components for the main Flipper component
export function Flipped({ children, flipId, onStart, onComplete, ...rest }) {
  let child
  try {
    child = Children.only(children)
  } catch (e) {
    throw new Error("Each Flipped element must wrap a single child")
  }
  // if nothing is being animated, assume everything is being animated
  if (!rest.scale && !rest.translate && !rest.opacity) {
    Object.assign(rest, {
      translate: true,
      scale: true,
      opacity: true
    })
  }
  // turn props into DOM data attributes
  const props = Object.keys(rest)
    .map(k => [k, rest[k]])
    .map(r => [
      r[0]
        .replace("translate", "data-flip-translate")
        .replace("scale", "data-flip-scale")
        .replace("opacity", "data-flip-opacity")
        .replace("inverseFlipId", "data-inverse-flip-id")
        .replace("transformOrigin", "data-transform-origin")
        .replace("componentIdFilter", "data-flip-component-id-filter")
        .replace("componentId", "data-flip-component-id")
        .replace("ease", "data-flip-ease")
        .replace("delay", "data-flip-delay")
        .replace("duration", "data-flip-duration")
        .toLowerCase(),
      r[1]
    ])
    .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})

  if (flipId) props["data-flip-id"] = flipId

  return cloneElement(child, props)
}

const FlippedWithContext = ({
  children,
  flipId,
  onAppear,
  onStart,
  onComplete,
  ...rest
}) => (
  <FlipContext.Consumer>
    {data => {
      data[flipId] = {
        onAppear,
        onStart,
        onComplete
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
