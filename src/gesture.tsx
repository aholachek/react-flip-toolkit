import React from 'react'
import DefaultFlipper from './Flipper'
import DefaultFlipped from './Flipped'
import gestureHandler from './Flipped/gestureHandler'
import { FlippedProps } from './Flipped/types'
import { FlipperProps } from './Flipper/types'

export const Flipper = (props: FlipperProps) => (
  <DefaultFlipper {...props} isGestureControlled={true} />
)

export const Flipped = (props: FlippedProps) => (
  <DefaultFlipped {...props} gestureHandler={gestureHandler} />
)

// for umd build
export default {
  Flipper,
  Flipped
}
