import { BaseFlipArgs, FlippedIds } from '../types';
import { SpringOption, SpringConfig } from '../../springSettings/types';
import { StaggerConfig, OnFlipperComplete } from '../../Flipper/types';
import { SerializableFlippedProps, FlipId } from '../../Flipped/types';
import { Spring } from '../../forked-rebound/types';
export declare type ScopedSelector = (selector: string) => HTMLElement[];
export interface AnimateFlippedElementsArgs extends BaseFlipArgs {
    flippedIds: FlippedIds;
    applyTransformOrigin: boolean;
    spring: SpringOption;
    debug: boolean;
    staggerConfig: StaggerConfig;
    decisionData: any;
    scopedSelector: ScopedSelector;
    retainTransform: boolean;
    onComplete: OnFlipperComplete;
}
export declare type OnUpdate = (spring: Spring) => void;
export declare type GetOnUpdateFunc = (stop: () => void) => OnUpdate;
export declare type Matrix = number[];
export declare type InvertedChild = [HTMLElement, Omit<SerializableFlippedProps, 'flipId'>];
export declare type InvertedChildren = InvertedChild[];
export interface AnimatedVals {
    matrix: Matrix;
    opacity?: number;
}
export declare type InitializeFlip = () => void;
export declare type ChildIds = string[];
export interface StaggeredChildren {
    [stagger: string]: FlipDataArray;
}
export interface FlipData {
    element: HTMLElement;
    id: string;
    stagger: string;
    springConfig: SpringConfig;
    noOp: boolean;
    getOnUpdateFunc: GetOnUpdateFunc;
    initializeFlip: InitializeFlip;
    onAnimationEnd: () => void;
    level: number;
    childIds: ChildIds;
    onSpringActivate: () => void;
    immediateChildren: FlipDataArray;
    staggeredChildren: StaggeredChildren;
}
export declare type FlipDataArray = FlipData[];
export interface FlipDataDict {
    [flipId: string]: FlipData;
}
export interface LevelToChildren {
    [level: string]: ChildIds;
}
export declare type TopLevelChildren = FlipId[];
export declare type InitiateStaggeredAnimations = (staggered: StaggeredChildren) => void;
export interface TreeNode {
    staggeredChildren: StaggeredChildren;
    immediateChildren: FlipDataArray;
}
