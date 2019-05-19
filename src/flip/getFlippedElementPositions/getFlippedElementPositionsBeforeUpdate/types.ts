import { BoundingClientRect, BaseFlippedElementPositions } from '../types'
import { InProgressAnimations, FlipCallbacks } from '../../../Flipper/types'

export interface DomDataForExitAnimations {
  element: HTMLElement
  parent: HTMLElement
  childPosition: BoundingClientRect
}

export interface FlippedElementPositionDatumBeforeUpdate
  extends BaseFlippedElementPositions {
  domDataForExitAnimations: DomDataForExitAnimations
}

export interface FlippedElementPositionsBeforeUpdate {
  [key: string]: FlippedElementPositionDatumBeforeUpdate
}

export type CachedOrderedFlipIds = string[]

export interface FlippedElementPositionsBeforeUpdateReturnVals {
  flippedElementPositions: FlippedElementPositionsBeforeUpdate
  cachedOrderedFlipIds: CachedOrderedFlipIds
  isGestureControlled: boolean
}

export interface GetFlippedElementPositionsBeforeUpdateArgs {
  element: HTMLElement
  flipCallbacks: FlipCallbacks
  inProgressAnimations: InProgressAnimations
  portalKey?: string
}

export type ParentBCRs = Array<[HTMLElement, BoundingClientRect]>
