import * as React from 'react';
export declare function filterConfig(props: Record<string, unknown>, validProps: string[], defaults?: Record<string, unknown>): {
    [x: string]: unknown;
};
export declare function findNodeHandle(node: null | number | React.Component<any, any> | React.ComponentClass<any>): null | number | React.Component<any, any> | React.ComponentClass<any>;
export declare function scheduleFlushOperations(): void;
