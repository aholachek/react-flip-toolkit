import { FlipId, InProgressAnimations } from '../types'
import { SyntheticEvent } from 'react'

export type Direction = 'right' | 'left' | 'down' | 'up'

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

type DirectionConfig = Record<Direction, OnSwipeConfigObject>

export type SetIsGestureInitiated = (isGestureInitiated: boolean) => void

export interface State {
  event?: SwipeEvent
  target: EventTarget | null
  time: number
  xy: [number, number]
  delta: [number, number]
  initial: [number, number]
  previous: [number, number]
  direction: [number, number]
  local: [number, number]
  lastLocal: [number, number]
  velocity: number
  distance: number
  down: boolean
  first: boolean
  shiftKey: boolean
}

// config for gestureHandlers function
export interface Config {
  onUp?: (state: State) => void
  onDown?: (state: State) => void
  touchOnly?: boolean
  maxWidth: number
  window: Window
}

// config for Swipe wrapper
type BasicSwipeProps = Config & {
  threshold?: number
  flipId: FlipId
  inProgressAnimations: InProgressAnimations
  setIsGestureInitiated: SetIsGestureInitiated
}

export type SwipeProps = BasicSwipeProps &
  DirectionConfig & { window: Window; children?: React.ReactNode }

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

export type SetCallback = (state: State) => State
export type Set = (cb: SetCallback) => void
