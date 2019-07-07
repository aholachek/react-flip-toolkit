/// <reference types="react" />
import { SpringOption } from '../springSettings/types';
import { CallbackFlippedProps } from '../Flipped/types';
import { FlippedIds } from '../flip/types';
export interface StaggerConfigValue {
    reverse?: boolean;
    /** A number between 0 (for a slower stagger) and 1 (for a faster stagger) */
    speed?: number;
}
export interface StaggerConfig {
    [key: string]: StaggerConfigValue;
}
export interface HandleEnterUpdateDeleteArgs {
    hideEnteringElements: () => void;
    animateExitingElements: () => Promise<void>;
    animateFlippedElements: () => Promise<void> | void;
    animateEnteringElements: () => void;
}
export declare type HandleEnterUpdateDelete = (args: HandleEnterUpdateDeleteArgs) => void;
export declare type OnFlipperComplete = (flipIds: FlippedIds) => void;
export interface FlipperProps {
    flipKey: any;
    children: React.ReactNode;
    /** Provide a string referencing one of the spring presets — noWobble (default), veryGentle, gentle, wobbly, or stiff, OR provide an object with stiffness and damping parameters.  */
    spring?: SpringOption;
    applyTransformOrigin?: boolean;
    /** This experimental prop will pause your animation right at the initial application of FLIP-ped styles. That will allow you to inspect the state of the animation at the very beginning, when it should look similar or identical to the UI before the animation began. */
    debug?: boolean;
    element?: string;
    className?: string;
    /** In general, the Flipper component will only apply transitions to its descendents. This allows multiple Flipper elements to coexist on the same page, but it will prevent animations from working if you use portals. You can provide a unique portalKey prop to Flipper to tell it to scope element selections to the entire document, not just to its children, so that elements in portals can be transitioned. */
    portalKey?: string;
    staggerConfig?: StaggerConfig;
    /** Sometimes, you'll want the animated children of Flipper to behave differently depending on the state transition — maybe only certain Flipped elements should animate in response to a particular change. By providing the decisionData prop to the Flipper component, you'll make that data available to the shouldFlip and shouldInvert methods of each child Flipped component, so they can decided for themselves whether to animate or not. */
    decisionData?: any;
    handleEnterUpdateDelete?: HandleEnterUpdateDelete;
    retainTransform?: boolean;
    /** This callback prop will be called when all individual FLIP animations have completed. Its single argument is a list of flipIds for the Flipped components that were activated during the animation. If an animation is interrupted, onComplete will be still called right before the in-progress animation is terminated. */
    onComplete?: OnFlipperComplete;
}
export interface InProgressAnimations {
    [key: string]: {
        stop: () => void;
        onComplete?: () => void;
    };
}
export interface FlipCallbacks {
    [key: string]: CallbackFlippedProps;
}
