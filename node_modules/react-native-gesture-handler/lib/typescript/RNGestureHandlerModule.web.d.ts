import React from 'react';
import type { ActionType } from './ActionType';
import { Gestures } from './web/Gestures';
import type { Config } from './web/interfaces';
declare const _default: {
    handleSetJSResponder(tag: number, blockNativeResponder: boolean): void;
    handleClearJSResponder(): void;
    createGestureHandler<T>(handlerName: keyof typeof Gestures, handlerTag: number, config: T): void;
    attachGestureHandler(handlerTag: number, newView: any, _actionType: ActionType, propsRef: React.RefObject<unknown>): void;
    updateGestureHandler(handlerTag: number, newConfig: Config): void;
    getGestureHandlerNode(handlerTag: number): any;
    dropGestureHandler(handlerTag: number): void;
    flushOperations(): void;
};
export default _default;
