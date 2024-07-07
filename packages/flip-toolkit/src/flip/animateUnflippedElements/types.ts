import { BaseFlipArgs } from '../types.js'

export interface AnimateUnflippedElementsArgs extends BaseFlipArgs {
  unflippedIds: string[]
}

export type FragmentTuple = [HTMLElement, DocumentFragment]
