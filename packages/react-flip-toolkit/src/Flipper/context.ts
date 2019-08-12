import { createContext } from 'react'
import { SetIsGestureInitiated } from '../FlipToolkit/Swipe/types'
import { InProgressAnimations, FlipCallbacks } from '../FlipToolkit/types'

export interface GestureContextProps {
  inProgressAnimations: InProgressAnimations
  setIsGestureInitiated: SetIsGestureInitiated
}

export const FlipContext = createContext({} as FlipCallbacks)
export const PortalContext = createContext('portal')
export const GestureContext = createContext({} as GestureContextProps)
