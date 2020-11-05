import { createContext } from 'react'
import { FlipCallbacks } from 'flip-toolkit/lib/types'

export const FlipContext = createContext({} as FlipCallbacks)
export const PortalContext = createContext('portal')
