import { SpringPresets, SpringConfig } from './types';
export declare const springPresets: SpringPresets;
export declare const getSpringConfig: ({ flipperSpring, flippedSpring }?: {
    flipperSpring?: string | number | SpringConfig | undefined;
    flippedSpring?: string | number | SpringConfig | undefined;
}) => object;
