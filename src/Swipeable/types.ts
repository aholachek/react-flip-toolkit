import { FlipId, FlippedProps } from '../Flipped/types'
import { SyntheticEvent } from 'react'

type Direction = 'right' | 'left' | 'down' | 'up'

export interface RespondToGesture {
  initFlip: () => void
  cancelFlip: () => void
  direction: Direction
  theshold: number
}

export interface GestureFlipDecisionData {
  props: Record<string, any>
  prevProps: Record<string, any>
}

interface OnSwipeConfigObject {
  direction: Direction
  initFlip: (data: GestureFlipDecisionData) => void
  cancelFlip: (data: GestureFlipDecisionData) => void
  theshold: number
}

export type onSwipe = OnSwipeConfigObject | OnSwipeConfigObject[]

export type OnNonSwipeClick = (event: SyntheticEvent) => void

interface GestureSpecificFlippedProps {
  onSwipe: onSwipe
  onNonSwipeClick?: OnNonSwipeClick
  flipId: FlipId
}

export type GestureFlippedProps = GestureSpecificFlippedProps & FlippedProps

export interface GestureEventHandlers {
  onMouseDown: () => void
  onTouchStart: () => void
}

export interface FlipInitiatorData {
  cachedConfig: OnSwipeConfigObject
}
