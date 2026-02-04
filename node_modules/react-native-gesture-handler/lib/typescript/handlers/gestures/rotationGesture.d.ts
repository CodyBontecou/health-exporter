import { ContinousBaseGesture } from './gesture';
import type { RotationGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
import { GestureUpdateEvent } from '../gestureHandlerCommon';
type RotationGestureChangeEventPayload = {
    rotationChange: number;
};
export declare class RotationGesture extends ContinousBaseGesture<RotationGestureHandlerEventPayload, RotationGestureChangeEventPayload> {
    constructor();
    onChange(callback: (event: GestureUpdateEvent<RotationGestureHandlerEventPayload & RotationGestureChangeEventPayload>) => void): this;
}
export type RotationGestureType = InstanceType<typeof RotationGesture>;
export {};
