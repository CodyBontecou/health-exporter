import React from 'react';
export declare class Wrap extends React.Component<{
    onGestureHandlerEvent?: unknown;
    children?: React.ReactNode;
}> {
    render(): React.FunctionComponentElement<{
        collapsable: boolean;
    }>;
}
export declare const AnimatedWrap: typeof Wrap | React.ComponentClass<{
    onGestureHandlerEvent?: unknown;
    children?: React.ReactNode;
}, any>;
