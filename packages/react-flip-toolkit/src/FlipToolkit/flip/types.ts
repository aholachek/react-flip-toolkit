import {
  InProgressAnimations,
  FlipCallbacks,
  StaggerConfig,
  HandleEnterUpdateDelete,
  OnFlipperComplete,
  OnFlipperStart,
  DecisionData
} from '../types'
import { FlippedElementPositionsBeforeUpdate } from './getFlippedElementPositions/getFlippedElementPositionsBeforeUpdate/types'
import { FlippedElementPositionsAfterUpdate } from './getFlippedElementPositions/getFlippedElementPositionsAfterUpdate/types'
import { CachedOrderedFlipIds } from '../flip/getFlippedElementPositions/getFlippedElementPositionsBeforeUpdate/types'
import { SpringOption } from '../springSettings/types'

export type FlippedIds = string[]

export type GetElement = (id: string) => HTMLElement

export interface BaseFlipArgs {
  flipCallbacks: FlipCallbacks
  getElement: GetElement
  flippedElementPositionsBeforeUpdate: FlippedElementPositionsBeforeUpdate
  flippedElementPositionsAfterUpdate: FlippedElementPositionsAfterUpdate
  inProgressAnimations: InProgressAnimations
  decisionData?: DecisionData
}

export interface OnFlipKeyUpdateArgs {
  cachedOrderedFlipIds: CachedOrderedFlipIds
  inProgressAnimations: InProgressAnimations
  flippedElementPositionsBeforeUpdate: FlippedElementPositionsBeforeUpdate
  flipCallbacks: FlipCallbacks
  containerEl: HTMLElement
  applyTransformOrigin?: boolean
  spring?: SpringOption
  debug?: boolean
  portalKey?: string
  staggerConfig?: StaggerConfig
  handleEnterUpdateDelete?: HandleEnterUpdateDelete
  onComplete?: OnFlipperComplete
  onStart?: OnFlipperStart
  decisionData: DecisionData
  chainExitingEntering?: boolean
}
