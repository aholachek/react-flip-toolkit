import { InProgressAnimations } from '../Flipper/types'

export interface GestureParams {
  gestureConfig: RespondToGesture | RespondToGesture[]
  inProgressAnimations: InProgressAnimations
  flipId: string
}

type direction = 'right' | 'left' | 'down' | 'up'

export interface RespondToGesture {
  initFLIP: () => void
  cancelFLIP: () => void
  direction: direction
  completeThreshold: number
}
