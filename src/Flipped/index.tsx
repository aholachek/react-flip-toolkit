import React, {
  FunctionComponent,
  Children,
  cloneElement,
  ReactElement
} from 'react'
import PropTypes from 'prop-types'
import { FlipContext, PortalContext } from '../Flipper'
import * as constants from '../constants'
import { assign, isObject } from '../utilities'
import { FlippedProps, SerializableFlippedProps } from './types'
import { IndexableObject } from '../utilities/types'

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  inverseFlipId: PropTypes.string,
  flipId: PropTypes.string,
  opacity: PropTypes.bool,
  translate: PropTypes.bool,
  scale: PropTypes.bool,
  transformOrigin: PropTypes.string,
  spring: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  onAppear: PropTypes.func,
  onSpringUpdate: PropTypes.func,
  shouldFlip: PropTypes.func,
  shouldInvert: PropTypes.func,
  onExit: PropTypes.func,
  portalKey: PropTypes.string,
  stagger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isGestureControlled: PropTypes.bool
}

function isFunction(child: any): child is Function {
  return typeof child === 'function'
}

// This wrapper creates child components for the main Flipper component
export const Flipped: FunctionComponent<SerializableFlippedProps> = ({
  children,
  flipId,
  inverseFlipId,
  portalKey,
  isGestureControlled,
  gestureHandlers,
  ...rest
}) => {
  let child = children
  const isFunctionAsChildren = isFunction(child)

  if (!isFunctionAsChildren) {
    try {
      child = Children.only(children)
    } catch (e) {
      throw new Error('Each Flipped component must wrap a single child')
    }
  }

  // if nothing is being animated, assume everything is being animated
  if (!rest.scale && !rest.translate && !rest.opacity) {
    assign(rest, {
      translate: true,
      scale: true,
      opacity: true
    })
  }

  const dataAttributes: IndexableObject = {
    // these are both used as selectors so they have to be separate
    [constants.DATA_FLIP_ID]: flipId,
    [constants.DATA_INVERSE_FLIP_ID]: inverseFlipId,
    [constants.DATA_FLIP_CONFIG]: JSON.stringify(rest),
    [constants.DATA_IS_GESTURE_CONTROLLED]: isGestureControlled
  }

  if (gestureHandlers){
    Object.assign(dataAttributes, ...gestureHandlers)
  }

  if (portalKey) {
    dataAttributes[constants.DATA_PORTAL_KEY] = portalKey
  }
  if (isFunctionAsChildren) {
    return (child as Function)(dataAttributes)
  }
  return cloneElement(child as ReactElement<any>, dataAttributes)
}

// @ts-ignore
export const FlippedWithContext: FunctionComponent<FlippedProps> = ({
  children,
  flipId,
  shouldFlip,
  shouldInvert,
  onAppear,
  onStart,
  onStartImmediate,
  onComplete,
  onExit,
  onSpringUpdate,
  isGestureControlled,
  gestureHandlers,
  ...rest
}) => {
  if (!children) {
    return null
  }
  if (rest.inverseFlipId) {
    return <Flipped {...rest}>{children}</Flipped>
  }

  return (
    <PortalContext.Consumer>
      {portalKey => (
        <FlipContext.Consumer>
          {data => {
            // if there is no surrounding Flipper component,
            // we don't want to throw an error, so check
            // that data exists and is not the default string
            if (isObject(data)) {
              // @ts-ignore
              data[flipId as string] = {
                shouldFlip,
                shouldInvert,
                onAppear,
                onStart,
                onStartImmediate,
                onComplete,
                onExit,
                onSpringUpdate
              }
            }
            return (
              <Flipped
                flipId={flipId}
                {...rest}
                portalKey={portalKey}
                isGestureControlled={isGestureControlled}
                gestureHandlers={gestureHandlers}
              >
                {children}
              </Flipped>
            )
          }}
        </FlipContext.Consumer>
      )}
    </PortalContext.Consumer>
  )
}

if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  FlippedWithContext.propTypes = propTypes
}

export default FlippedWithContext
