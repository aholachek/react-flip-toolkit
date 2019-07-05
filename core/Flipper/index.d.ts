import React, { Component } from 'react';
import { FlipperProps, FlipCallbacks } from './types';
import { FlippedElementPositionsBeforeUpdateReturnVals } from '../flip/getFlippedElementPositions/getFlippedElementPositionsBeforeUpdate/types';
export declare const FlipContext: React.Context<FlipCallbacks>;
export declare const PortalContext: React.Context<string>;
declare class Flipper extends Component<FlipperProps> {
    static defaultProps: {
        applyTransformOrigin: boolean;
        element: string;
        retainTransform: boolean;
    };
    private inProgressAnimations;
    private flipCallbacks;
    private el?;
    getSnapshotBeforeUpdate(prevProps: FlipperProps): FlippedElementPositionsBeforeUpdateReturnVals | null;
    componentDidUpdate(prevProps: FlipperProps, _prevState: any, cachedData: FlippedElementPositionsBeforeUpdateReturnVals): void;
    render(): JSX.Element;
}
export default Flipper;
