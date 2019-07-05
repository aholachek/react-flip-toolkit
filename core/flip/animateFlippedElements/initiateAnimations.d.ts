import { FlipDataDict, InitiateStaggeredAnimations, StaggeredChildren } from './types';
import { StaggerConfig } from '../../Flipper/types';
export declare const createCallTree: ({ flipDataDict, topLevelChildren, initiateStaggeredAnimations }: {
    flipDataDict: FlipDataDict;
    topLevelChildren: string[];
    initiateStaggeredAnimations: InitiateStaggeredAnimations;
}) => {
    root: {
        staggeredChildren: StaggeredChildren;
        immediateChildren: import("./types").FlipData[];
    };
};
declare const _default: ({ staggerConfig, flipDataDict, topLevelChildren }: {
    staggerConfig: StaggerConfig;
    flipDataDict: FlipDataDict;
    topLevelChildren: string[];
}) => void;
export default _default;
