import { SpringOption } from '../springSettings/types'
import { CallbackFlippedProps } from '../Flipped/types'
import { FlippedIds } from '../flip/types'

export interface StaggerConfigValue {
  reverse?: boolean
  speed?: number
}

export interface StaggerConfig {
  [key: string]: StaggerConfigValue
}

export interface HandleEnterUpdateDeleteArgs {
  hideEnteringElements: () => void
  animateExitingElements: () => Promise<void>
  animateFlippedElements: () => Promise<void> | void
  animateEnteringElements: () => void
}

export type HandleEnterUpdateDelete = (
  args: HandleEnterUpdateDeleteArgs
) => void

export type OnFlipperComplete = (flipIds: FlippedIds) => void

export interface FlipperProps {
  flipKey: any
  children: React.ReactNode
  spring?: SpringOption
  applyTransformOrigin?: boolean
  debug?: boolean
  element?: string
  className?: string
  portalKey?: string
  staggerConfig?: StaggerConfig
  decisionData?: any
  handleEnterUpdateDelete?: HandleEnterUpdateDelete
  retainTransform?: boolean
  onComplete?: OnFlipperComplete
}

export interface InProgressAnimations {
  [key: string]: {
    stop: () => void
    onComplete?: () => void
  }
}

export interface FlipCallbacks {
  [key: string]: CallbackFlippedProps
}
