import { BaseFlippedElementPositions } from '../types.js'

export interface FlippedElementPositionDatumAfterUpdate
  extends BaseFlippedElementPositions {
  transform: string
  element: HTMLElement
}

export interface FlippedElementPositionsAfterUpdate {
  [key: string]: FlippedElementPositionDatumAfterUpdate
}
