import { BaseGestureConfig, BaseGesture } from './gesture';
import { NativeViewGestureConfig } from '../NativeViewGestureHandler';
import type { NativeViewGestureHandlerPayload } from '../GestureHandlerEventPayload';
export declare class NativeGesture extends BaseGesture<NativeViewGestureHandlerPayload> {
    config: BaseGestureConfig & NativeViewGestureConfig;
    constructor();
    /**
     * When true, underlying handler will activate unconditionally when in `BEGAN` or `UNDETERMINED` state.
     * @param value
     */
    shouldActivateOnStart(value: boolean): this;
    /**
     * When true, cancels all other gesture handlers when this `NativeViewGestureHandler` receives an `ACTIVE` state event.
     * @param value
     */
    disallowInterruption(value: boolean): this;
}
export type NativeGestureType = InstanceType<typeof NativeGesture>;
