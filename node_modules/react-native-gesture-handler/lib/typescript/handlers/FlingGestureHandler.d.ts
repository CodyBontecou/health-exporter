/// <reference types="react" />
import type { FlingGestureHandlerEventPayload } from './GestureHandlerEventPayload';
import { BaseGestureHandlerProps } from './gestureHandlerCommon';
export declare const flingGestureHandlerProps: readonly ["numberOfPointers", "direction"];
export interface FlingGestureConfig {
    /**
     * Expressed allowed direction of movement. It's possible to pass one or many
     * directions in one parameter:
     *
     * ```js
     * direction={Directions.RIGHT | Directions.LEFT}
     * ```
     *
     * or
     *
     * ```js
     * direction={Directions.DOWN}
     * ```
     */
    direction?: number;
    /**
     * Determine exact number of points required to handle the fling gesture.
     */
    numberOfPointers?: number;
}
export interface FlingGestureHandlerProps extends BaseGestureHandlerProps<FlingGestureHandlerEventPayload>, FlingGestureConfig {
}
export declare const flingHandlerName = "FlingGestureHandler";
export type FlingGestureHandler = typeof FlingGestureHandler;
export declare const FlingGestureHandler: import("react").ComponentType<FlingGestureHandlerProps & import("react").RefAttributes<any>>;
