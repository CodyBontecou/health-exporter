/// <reference types="react" />
import { LongPressGestureHandlerEventPayload } from './GestureHandlerEventPayload';
import { BaseGestureHandlerProps } from './gestureHandlerCommon';
export declare const longPressGestureHandlerProps: readonly ["minDurationMs", "maxDist", "numberOfPointers"];
export interface LongPressGestureConfig {
    /**
     * Minimum time, expressed in milliseconds, that a finger must remain pressed on
     * the corresponding view. The default value is 500.
     */
    minDurationMs?: number;
    /**
     * Maximum distance, expressed in points, that defines how far the finger is
     * allowed to travel during a long press gesture. If the finger travels
     * further than the defined distance and the handler hasn't yet activated, it
     * will fail to recognize the gesture. The default value is 10.
     */
    maxDist?: number;
    /**
     * Determine exact number of points required to handle the long press gesture.
     */
    numberOfPointers?: number;
}
export interface LongPressGestureHandlerProps extends BaseGestureHandlerProps<LongPressGestureHandlerEventPayload>, LongPressGestureConfig {
}
export declare const longPressHandlerName = "LongPressGestureHandler";
export type LongPressGestureHandler = typeof LongPressGestureHandler;
export declare const LongPressGestureHandler: import("react").ComponentType<LongPressGestureHandlerProps & import("react").RefAttributes<any>>;
