import React, { FunctionComponent } from 'react';
import { FlippedProps, SerializableFlippedProps } from './types';
export declare const Flipped: ({ children, flipId, inverseFlipId, portalKey, ...rest }: SerializableFlippedProps) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
export declare const FlippedWithContext: FunctionComponent<FlippedProps>;
export default FlippedWithContext;
