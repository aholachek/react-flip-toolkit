import { StaggerConfigValue } from '../../../Flipper/types';
import { FlipData } from '../types';
export declare const createSuspendedSpring: ({ springConfig: { stiffness, damping, overshootClamping }, noOp, onSpringActivate, getOnUpdateFunc, onAnimationEnd }: FlipData) => import("../../../forked-rebound/types").Spring | null;
export declare const createSpring: (flipped: FlipData) => void;
export declare const normalizeSpeed: (speedConfig: number | undefined) => number;
export declare const staggeredSprings: (flippedArray: FlipData[], staggerConfig?: StaggerConfigValue) => void;
