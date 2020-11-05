import { createContext } from 'react'
import { FlipCallbacksAndConfig } from 'flip-toolkit/lib/types'

export const FlipContext = createContext({} as FlipCallbacksAndConfig)
export const PortalContext = createContext('portal')
