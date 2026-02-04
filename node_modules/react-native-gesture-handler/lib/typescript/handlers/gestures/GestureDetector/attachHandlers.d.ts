import React from 'react';
import { GestureType } from '../gesture';
import { ComposedGesture } from '../gestureComposition';
import { AttachedGestureState, WebEventHandler } from './types';
interface AttachHandlersConfig {
    preparedGesture: AttachedGestureState;
    gestureConfig: ComposedGesture | GestureType;
    gesturesToAttach: GestureType[];
    viewTag: number;
    webEventHandlersRef: React.RefObject<WebEventHandler>;
}
export declare function attachHandlers({ preparedGesture, gestureConfig, gesturesToAttach, viewTag, webEventHandlersRef, }: AttachHandlersConfig): void;
export {};
