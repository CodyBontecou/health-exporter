import { BaseGesture, BaseGestureConfig } from './gesture';
import { LongPressGestureConfig } from '../LongPressGestureHandler';
import type { LongPressGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
export declare class LongPressGesture extends BaseGesture<LongPressGestureHandlerEventPayload> {
    config: BaseGestureConfig & LongPressGestureConfig;
    constructor();
    /**
     * Minimum time, expressed in milliseconds, that a finger must remain pressed on the corresponding view.
     * The default value is 500.
     * @param duration
     */
    minDuration(duration: number): this;
    /**
     * Maximum distance, expressed in points, that defines how far the finger is allowed to travel during a long press gesture.
     * @param distance
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/long-press-gesture#maxdistancevalue-number
     */
    maxDistance(distance: number): this;
    /**
     * Determine exact number of points required to handle the long press gesture.
     * @param pointers
     */
    numberOfPointers(pointers: number): this;
}
export type LongPressGestureType = InstanceType<typeof LongPressGesture>;
