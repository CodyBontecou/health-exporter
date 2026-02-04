export declare const gestures: Record<number, any>;
export declare function getHandler(tag: number): any;
export declare function createGestureHandler(handlerTag: number, handler: any): void;
export declare function dropGestureHandler(handlerTag: number): void;
export declare function getNodes(): {
    [x: number]: any;
};
