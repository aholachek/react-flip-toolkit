import { FlipId, InProgressAnimations } from '../types'
import { SyntheticEvent } from 'react'

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

export type SwipeEvent = SyntheticEvent<HTMLElement, TouchEvent>

export interface OnSwipeConfigObject {
  initFlip: (data: SwipeDecisionData) => void
  cancelFlip: (data: SwipeDecisionData) => void
  threshold: number
}

export type FlipInitiatorData = OnSwipeConfigObject & { direction: Direction }

export type OnNonSwipeClick = (event: SwipeEvent) => void

type DirectionConfig = Record<Direction, OnSwipeConfigObject>

export type SetIsGestureInitiated = (isGestureInitiated: boolean) => void

interface BasicSwipeProps {
  onClick?: OnNonSwipeClick
  onUp?: () => void
  onDown?: () => void
  touchOnly?: false
  threshold?: number
  flipId: FlipId
  inProgressAnimations: InProgressAnimations
  setIsGestureInitiated: SetIsGestureInitiated
}

export type SwipeProps = BasicSwipeProps & DirectionConfig

export interface SwipeEventHandlers {
  onMouseDown: (event: SwipeEvent) => void
  onTouchStart: (state: SwipeEvent) => void
}

export interface OnActionArgs {
  velocity: number
  delta: number[]
  down: boolean
  first: boolean
  event: SwipeEvent
}
export type OnAction = (args: OnActionArgs) => void
