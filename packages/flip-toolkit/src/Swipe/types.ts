import { FlipId } from '../types'

type Direction = 'right' | 'left' | 'down' | 'up'

export interface RespondToSwipe {
  initFlip: () => void
  cancelFlip: () => void
  direction: Direction
  theshold: number
}

export interface SwipeDecisionData {
  props: Record<string, any>
  prevProps: Record<string, any>
}

interface OnSwipeConfigObject {
  initFlip: (data: SwipeDecisionData) => void
  cancelFlip: (data: SwipeDecisionData) => void
  theshold: number
}

export type OnNonSwipeClick = (event: Event) => void

type DirectionConfig = Record<Direction, OnSwipeConfigObject>

interface BasicSwipeProps {
  onClick?: OnNonSwipeClick
  flipId: FlipId
  inProgressAnimations: InProgressAnimations
  setIsGestureInitiated: () => void
}

export type SwipeProps = BasicSwipeProps & DirectionConfig

export interface SwipeEventHandlers {
  onMouseDown: () => void
  onTouchStart: () => void
}
