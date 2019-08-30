import { createContext } from 'react'
import { FlipCallbacks } from '../FlipToolkit/types'

export const FlipContext = createContext({} as FlipCallbacks)
export const PortalContext = createContext('portal')
