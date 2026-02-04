import { BaseGesture, BaseGestureConfig } from './gesture';
import { FlingGestureConfig } from '../FlingGestureHandler';
import type { FlingGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
export declare class FlingGesture extends BaseGesture<FlingGestureHandlerEventPayload> {
    config: BaseGestureConfig & FlingGestureConfig;
    constructor();
    /**
     * Determine exact number of points required to handle the fling gesture.
     * @param pointers
     */
    numberOfPointers(pointers: number): this;
    /**
     * Expressed allowed direction of movement.
     * Expected values are exported as constants in the Directions object.
     * Arguments can be combined using `|` operator. Default value is set to `MouseButton.LEFT`.
     * @param direction
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/fling-gesture/#directionvalue-directions
     */
    direction(direction: number): this;
}
export type FlingGestureType = InstanceType<typeof FlingGesture>;
