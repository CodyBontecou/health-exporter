import { BaseGestureConfig, BaseGesture } from './gesture';
import { TapGestureConfig } from '../TapGestureHandler';
import type { TapGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
export declare class TapGesture extends BaseGesture<TapGestureHandlerEventPayload> {
    config: BaseGestureConfig & TapGestureConfig;
    constructor();
    /**
     * Minimum number of pointers (fingers) required to be placed before the gesture activates.
     * Should be a positive integer. The default value is 1.
     * @param minPointers
     */
    minPointers(minPointers: number): this;
    /**
     * Number of tap gestures required to activate the gesture.
     * The default value is 1.
     * @param count
     */
    numberOfTaps(count: number): this;
    /**
     * Maximum distance, expressed in points, that defines how far the finger is allowed to travel during a tap gesture.
     * @param maxDist
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/tap-gesture#maxdistancevalue-number
     */
    maxDistance(maxDist: number): this;
    /**
     * Maximum time, expressed in milliseconds, that defines how fast a finger must be released after a touch.
     * The default value is 500.
     * @param duration
     */
    maxDuration(duration: number): this;
    /**
     * Maximum time, expressed in milliseconds, that can pass before the next tap — if many taps are required.
     * The default value is 500.
     * @param delay
     */
    maxDelay(delay: number): this;
    /**
     * Maximum distance, expressed in points, that defines how far the finger is allowed to travel along the X axis during a tap gesture.
     * @param delta
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/tap-gesture#maxdeltaxvalue-number
     */
    maxDeltaX(delta: number): this;
    /**
     * Maximum distance, expressed in points, that defines how far the finger is allowed to travel along the Y axis during a tap gesture.
     * @param delta
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/tap-gesture#maxdeltayvalue-number
     */
    maxDeltaY(delta: number): this;
}
export type TapGestureType = InstanceType<typeof TapGesture>;
