import { RespondToGesture } from '../types'
import { InProgressAnimations } from '../../Flipper/types'

export interface GestureParams {
  gestureConfig: RespondToGesture | RespondToGesture[]
  inProgressAnimations: InProgressAnimations
  flipId: string
}
