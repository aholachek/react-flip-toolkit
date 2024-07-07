import { BoundingClientRect, BaseFlippedElementPositions } from '../types.js'
import { InProgressAnimations, FlipCallbacks, FlipId } from '../../../types.js'

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
}

export interface GetFlippedElementPositionsBeforeUpdateArgs {
  element: HTMLElement
  flipCallbacks: FlipCallbacks
  inProgressAnimations: InProgressAnimations
  portalKey?: string
}

export type ParentBCRs = Array<[HTMLElement, BoundingClientRect]>

export type ChildIdsToParentBCRs = Record<FlipId, BoundingClientRect>
export type ChildIdsToParents = Record<FlipId, HTMLElement>
