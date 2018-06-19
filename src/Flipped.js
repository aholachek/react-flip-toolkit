import React, { Children, cloneElement } from "react"
import PropTypes from "prop-types"
import { FlipContext } from "./Flipper"

const propTypes = {
  children: PropTypes.node.isRequired,
  flipId: PropTypes.string,
  inverseFlipId: PropTypes.string,
  opacity: PropTypes.bool,
  translateX: PropTypes.bool,
  translateY: PropTypes.bool,
  translate: PropTypes.bool,
  scaleX: PropTypes.bool,
  scaleY: PropTypes.bool,
  scale: PropTypes.bool,
  transformOrigin: PropTypes.string,
  ease: PropTypes.string,
  duration: PropTypes.number,
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  componentIdFilter: PropTypes.string,
  componentId: PropTypes.string,
}
// This wrapper creates child components for the main Flipper component
function Flipped({ children, flipId, onStart, onComplete, ...rest }) {
  let child
  try {
    child = Children.only(children)
  } catch (e) {
    throw new Error("Each Flipped element must wrap a single child")
  }
  // if nothing is being transformed, assume everything is being animated
  if (
    !rest.scale &&
    !rest.translate &&
    !rest.translateX &&
    !rest.translateY &&
    !rest.scaleX &&
    !rest.opacity &&
    !rest.scaleY
  ) {
    rest.all = true
  }
  // allow some shorthands for convenience
  if (rest.all) {
    delete rest.all
    Object.assign(rest, {
      translateX: true,
      translateY: true,
      scaleX: true,
      scaleY: true,
      opacity: true
    })
  } else if (rest.scale) {
    delete rest.scale
    Object.assign(rest, {
      scaleX: true,
      scaleY: true
    })
  } else if (rest.translate) {
    delete rest.translate
    Object.assign(rest, {
      translateX: true,
      translateY: true
    })
  }
  // turn props into DOM data attributes
  const props = Object.entries(rest)
    .map(r => [
      r[0]
        .replace("translate", "data-translate-")
        .replace("scale", "data-scale-")
        .replace("opacity", "data-opacity")
        .replace("inverseFlipId", "data-inverse-flip-id")
        .replace("transformOrigin", "data-transform-origin")
        .replace("componentIdFilter", "data-flip-component-id-filter")
        .replace("componentId", "data-flip-component-id")
        .replace("ease", "data-flip-ease")
        .replace("duration", "data-flip-duration")
        .toLowerCase(),
      r[1]
    ])
    .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})

  if (flipId) props["data-flip-id"] = flipId

  return (
    <FlipContext.Consumer>
      {data => {
        data[flipId] = {
          onStart: onStart,
          onComplete: onComplete
        }
        return cloneElement(child, props)
      }}
    </FlipContext.Consumer>
  )
}

Flipped.propTypes = propTypes

export default Flipped
