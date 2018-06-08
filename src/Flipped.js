import React, { Children, cloneElement } from "react"
import PropTypes from "prop-types"
import { FlipContext } from "./Flipper"

const propTypes = {
  children: PropTypes.node.isRequired,
  flipId: PropTypes.string,
  inverseFlipId: PropTypes.string,
  translateX: PropTypes.bool,
  translateY: PropTypes.bool,
  scaleX: PropTypes.bool,
  scaleY: PropTypes.bool,
  transformOriginTopLeft: PropTypes.bool,
  onStart: PropTypes.func,
  onComplete: PropTypes.func
}
// This wrapper creates child components for the main Flipper component
function Flipped({ children, flipId, onStart, onComplete, ...rest }) {
  let child
  try {
    child = Children.only(children)
  } catch (e) {
    throw new Error("Each Flipped element must wrap a single child")
  }
  // allow some shorthands for convenience
  if (rest.all) {
    delete rest.all
    Object.assign(rest, {
      translateX: true,
      translateY: true,
      scaleX: true,
      scaleY: true
    })
  } else if (rest.scale) {
    delete rest.scale
    Object.assign(rest, {
      scaleX: true,
      scaleY: true
    })
  } else if (rest.transform) {
    delete rest.transform
    Object.assign(rest, {
      transformX: true,
      transformY: true
    })
  }
  // turn props into DOM data attributes
  const props = Object.entries(rest)
    .map(r => [
      r[0]
        .replace("translate", "data-translate-")
        .replace("scale", "data-scale-")
        .replace("inverseFlipId", "data-inverse-flip-id")
        .replace("transformOriginTopLeft", "data-transform-origin-top-left")
        .toLowerCase(),
      r[1]
    ])
    .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})

  if (flipId) props["data-flip-key"] = flipId

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
