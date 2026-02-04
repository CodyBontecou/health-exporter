import { BaseGestureConfig, ContinousBaseGesture } from './gesture';
import { GestureUpdateEvent } from '../gestureHandlerCommon';
import { PanGestureConfig } from '../PanGestureHandler';
import type { PanGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
export type PanGestureChangeEventPayload = {
    changeX: number;
    changeY: number;
};
export declare class PanGesture extends ContinousBaseGesture<PanGestureHandlerEventPayload, PanGestureChangeEventPayload> {
    config: BaseGestureConfig & PanGestureConfig;
    constructor();
    /**
     * Range along Y axis (in points) where fingers travels without activation of gesture.
     * @param offset
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#activeoffsetyvalue-number--number
     */
    activeOffsetY(offset: number | [activeOffsetYStart: number, activeOffsetYEnd: number]): this;
    /**
     * Range along X axis (in points) where fingers travels without activation of gesture.
     * @param offset
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#activeoffsetxvalue-number--number
     */
    activeOffsetX(offset: number | [activeOffsetXStart: number, activeOffsetXEnd: number]): this;
    /**
     * When the finger moves outside this range (in points) along Y axis and gesture hasn't yet activated it will fail recognizing the gesture.
     * @param offset
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#failoffsetyvalue-number--number
     */
    failOffsetY(offset: number | [failOffsetYStart: number, failOffsetYEnd: number]): this;
    /**
     * When the finger moves outside this range (in points) along X axis and gesture hasn't yet activated it will fail recognizing the gesture.
     * @param offset
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#failoffsetxvalue-number--number
     */
    failOffsetX(offset: number | [failOffsetXStart: number, failOffsetXEnd: number]): this;
    /**
     * A number of fingers that is required to be placed before gesture can activate. Should be a higher or equal to 0 integer.
     * @param minPointers
     */
    minPointers(minPointers: number): this;
    /**
     * When the given number of fingers is placed on the screen and gesture hasn't yet activated it will fail recognizing the gesture.
     * Should be a higher or equal to 0 integer.
     * @param maxPointers
     */
    maxPointers(maxPointers: number): this;
    /**
     * Minimum distance the finger (or multiple finger) need to travel before the gesture activates.
     * Expressed in points.
     * @param distance
     */
    minDistance(distance: number): this;
    /**
     * Minimum velocity the finger has to reach in order to activate handler.
     * @param velocity
     */
    minVelocity(velocity: number): this;
    /**
     * Minimum velocity along X axis the finger has to reach in order to activate handler.
     * @param velocity
     */
    minVelocityX(velocity: number): this;
    /**
     * Minimum velocity along Y axis the finger has to reach in order to activate handler.
     * @param velocity
     */
    minVelocityY(velocity: number): this;
    /**
     * #### Android only
     * Android, by default, will calculate translation values based on the position of the leading pointer (the first one that was placed on the screen).
     * This modifier allows that behavior to be changed to the one that is default on iOS - the averaged position of all active pointers will be used to calculate the translation values.
     * @param value
     */
    averageTouches(value: boolean): this;
    /**
     * #### iOS only
     * Enables two-finger gestures on supported devices, for example iPads with trackpads.
     * @param value
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture/#enabletrackpadtwofingergesturevalue-boolean-ios-only
     */
    enableTrackpadTwoFingerGesture(value: boolean): this;
    /**
     * Duration in milliseconds of the LongPress gesture before Pan is allowed to activate.
     * @param duration
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture/#activateafterlongpressduration-number
     */
    activateAfterLongPress(duration: number): this;
    onChange(callback: (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => void): this;
}
export type PanGestureType = InstanceType<typeof PanGesture>;
