import { BoundingClientRect, BaseFlippedElementPositions } from '../types';
import { InProgressAnimations, FlipCallbacks } from '../../../Flipper/types';
import { FlipId } from '../../../Flipped/types';
export interface DomDataForExitAnimations {
    element: HTMLElement;
    parent: HTMLElement;
    childPosition: BoundingClientRect;
}
export interface FlippedElementPositionDatumBeforeUpdate extends BaseFlippedElementPositions {
    domDataForExitAnimations: DomDataForExitAnimations;
}
export interface FlippedElementPositionsBeforeUpdate {
    [key: string]: FlippedElementPositionDatumBeforeUpdate;
}
export declare type CachedOrderedFlipIds = string[];
export interface FlippedElementPositionsBeforeUpdateReturnVals {
    flippedElementPositions: FlippedElementPositionsBeforeUpdate;
    cachedOrderedFlipIds: CachedOrderedFlipIds;
}
export interface GetFlippedElementPositionsBeforeUpdateArgs {
    element: HTMLElement;
    flipCallbacks: FlipCallbacks;
    inProgressAnimations: InProgressAnimations;
    portalKey?: string;
}
export declare type ParentBCRs = Array<[HTMLElement, BoundingClientRect]>;
export declare type ChildIdsToParentBCRs = Record<FlipId, BoundingClientRect>;
export declare type ChildIdsToParents = Record<FlipId, HTMLElement>;
