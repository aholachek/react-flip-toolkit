import { RespondToGesture } from '../types'
import { InProgressAnimations } from '../../Flipper/types'

export interface GestureParams extends RespondToGesture {
  inProgressAnimations: InProgressAnimations
  flipId: string
}
