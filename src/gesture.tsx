import React from 'react'
import DefaultFlipper from './Flipper'
import DefaultFlipped from './Flipped'
import gestureHandler from './Flipped/gestureHandler'

export const Flipper = props => (
  <DefaultFlipper {...props} isGestureControlled={true} />
)

export const Flipped = props => (
  <DefaultFlipped {...props} gestureHandler={gestureHandler} />
)

// for umd build
export default {
  Flipper,
  Flipped
}
