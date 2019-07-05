import { BaseFlippedElementPositions } from '../types';
export interface FlippedElementPositionDatumAfterUpdate extends BaseFlippedElementPositions {
    transform: string;
}
export interface FlippedElementPositionsAfterUpdate {
    [key: string]: FlippedElementPositionDatumAfterUpdate;
}
