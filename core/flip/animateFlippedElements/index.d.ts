import { AnimateFlippedElementsArgs } from './types';
import { BoundingClientRect } from '../getFlippedElementPositions/types';
export declare const convertMatrix3dArrayTo2dArray: (matrix: number[]) => number[];
export declare const convertMatrix2dArrayToString: (matrix: number[]) => string;
export declare const invertTransformsForChildren: ({ invertedChildren, matrix, body }: {
    matrix: number[];
    body: HTMLBodyElement;
    invertedChildren: [HTMLElement, Pick<import("../../Flipped/types").SerializableFlippedProps, "children" | "portalKey" | "opacity" | "translate" | "scale" | "transformOrigin" | "spring" | "stagger" | "inverseFlipId">][];
}) => void;
export declare const createApplyStylesFunc: ({ element, invertedChildren, body, retainTransform }: {
    element: HTMLElement;
    invertedChildren: [HTMLElement, Pick<import("../../Flipped/types").SerializableFlippedProps, "children" | "portalKey" | "opacity" | "translate" | "scale" | "transformOrigin" | "spring" | "stagger" | "inverseFlipId">][];
    body: HTMLBodyElement;
    retainTransform: boolean;
}) => ({ matrix, opacity, forceMinVals }: {
    matrix: number[];
    opacity?: number | undefined;
    forceMinVals?: boolean | undefined;
}) => void;
export declare const rectInViewport: ({ top, bottom, left, right }: BoundingClientRect) => boolean;
export declare const tweenProp: (start: number, end: number, position: number) => number;
declare const _default: ({ flippedIds, flipCallbacks, inProgressAnimations, flippedElementPositionsBeforeUpdate, flippedElementPositionsAfterUpdate, applyTransformOrigin, spring, getElement, debug, staggerConfig, decisionData, scopedSelector, retainTransform, onComplete }: AnimateFlippedElementsArgs) => () => void;
export default _default;
