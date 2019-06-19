import { FlipId } from "../Flipped/types";

type Direction = 'right' | 'left' | 'down' | 'up'

export interface RespondToGesture {
  initFLIP: () => void
  cancelFLIP: () => void
  direction: Direction
  completeThreshold: number
}

export interface GestureFlipDecisionData {
  props: Object
  prevProps: Object
}

interface FlipOnSwipeConfigObject {
  direction: Direction
  initFLIP: (data: GestureFlipDecisionData) => void
  cancelFLIP: (data: GestureFlipDecisionData) => void
}

export type FlipOnSwipe = FlipOnSwipeConfigObject | FlipOnSwipeConfigObject[]

export type OnNonSwipeClick = () => void

export interface GestureFlippedProps {
  flipOnSwipe: FlipOnSwipe
  onNonSwipeClick?: OnNonSwipeClick
  flipId: FlipId
}

export interface GestureEventHandlers {
  onMouseDown: () => void
  onTouchStart: () => void
}
