import { ContinousBaseGesture } from './gesture';
import type { PinchGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
import { GestureUpdateEvent } from '../gestureHandlerCommon';
export type PinchGestureChangeEventPayload = {
    scaleChange: number;
};
export declare class PinchGesture extends ContinousBaseGesture<PinchGestureHandlerEventPayload, PinchGestureChangeEventPayload> {
    constructor();
    onChange(callback: (event: GestureUpdateEvent<PinchGestureHandlerEventPayload & PinchGestureChangeEventPayload>) => void): this;
}
export type PinchGestureType = InstanceType<typeof PinchGesture>;
