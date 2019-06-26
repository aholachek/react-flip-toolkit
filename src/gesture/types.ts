import { FlipId, FlippedProps } from '../Flipped/types'
import { SyntheticEvent } from 'react'

type Direction = 'right' | 'left' | 'down' | 'up'

export interface RespondToGesture {
  initFLIP: () => void
  cancelFLIP: () => void
  direction: Direction
  completeThreshold: number
}

export interface GestureFlipDecisionData {
  props: Record<string, any>
  prevProps: Record<string, any>
}

interface FlipOnSwipeConfigObject {
  direction: Direction
  initFLIP: (data: GestureFlipDecisionData) => void
  cancelFLIP: (data: GestureFlipDecisionData) => void
  completeThreshold: number
}

export type FlipOnSwipe = FlipOnSwipeConfigObject | FlipOnSwipeConfigObject[]

export type OnNonSwipeClick = (event: SyntheticEvent) => void

interface GestureSpecificFlippedProps {
  flipOnSwipe: FlipOnSwipe
  onNonSwipeClick?: OnNonSwipeClick
  flipId: FlipId
}

export type GestureFlippedProps = GestureSpecificFlippedProps & FlippedProps

export interface GestureEventHandlers {
  onMouseDown: () => void
  onTouchStart: () => void
}

export interface FlipInitiatorData {
  cachedConfig: FlipOnSwipeConfigObject
}
