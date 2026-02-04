/// <reference types="react" />
import { GestureType } from '../gesture';
import { WebEventHandler } from './types';
export declare const ALLOWED_PROPS: string[];
export declare function extractGestureRelations(gesture: GestureType): {
    waitFor: number[];
    simultaneousHandlers: number[];
    blocksHandlers: number[];
};
export declare function checkGestureCallbacksForWorklets(gesture: GestureType): void;
export declare function validateDetectorChildren(ref: any): void;
export declare function useForceRender(): () => void;
export declare function useWebEventHandlers(): import("react").MutableRefObject<WebEventHandler>;
