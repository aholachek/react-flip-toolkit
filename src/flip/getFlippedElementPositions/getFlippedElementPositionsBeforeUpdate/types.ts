import { BoundingClientRect, BaseFlippedElementPositions } from '../types'
import { InProgressAnimations, FlipCallbacks } from '../../../Flipper/types'
import { IndexableObject } from '../../../utilities/types'

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

export interface ChildIdsToParentBCRS extends IndexableObject {
  [flipId: string]: BoundingClientRect
}

export interface ChildIdsToParents extends IndexableObject {
  [flipId: string]: HTMLElement
}
