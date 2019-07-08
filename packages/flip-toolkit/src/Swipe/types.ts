import { FlipId, InProgressAnimations } from '../types'

export enum Direction {
  right = 'right',
  left = 'left',
  down = 'down',
  up = 'up'
}

export interface SwipeDecisionData {
  props: Record<string, any>
  prevProps: Record<string, any>
}

export type SwipeEvent = MouseEvent | TouchEvent

export interface OnSwipeConfigObject {
  initFlip: (data: SwipeDecisionData) => void
  cancelFlip: (data: SwipeDecisionData) => void
  threshold: number
}

export type FlipInitiatorData = OnSwipeConfigObject & { direction: Direction }

export type OnNonSwipeClick = (event: SwipeEvent) => void

type DirectionConfig = Record<Direction, OnSwipeConfigObject>

interface BasicSwipeProps {
  onClick?: OnNonSwipeClick
  flipId: FlipId
  inProgressAnimations: InProgressAnimations
  setIsGestureInitiated: (isGestureInitiated: boolean) => void
}

export type SwipeProps = BasicSwipeProps & DirectionConfig

export interface SwipeEventHandlers {
  onMouseDown: (event: SwipeEvent) => void
  onTouchStart: (state: SwipeEvent) => void
}

export type OnActionArgs = {
  velocity: number
  delta: number[]
  down: boolean
  first: boolean
  event: TouchEvent | MouseEvent
}
export type OnAction = (args: OnActionArgs) => void
