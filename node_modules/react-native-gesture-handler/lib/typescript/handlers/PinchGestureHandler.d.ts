/// <reference types="react" />
import { PinchGestureHandlerEventPayload } from './GestureHandlerEventPayload';
import { BaseGestureHandlerProps } from './gestureHandlerCommon';
export interface PinchGestureHandlerProps extends BaseGestureHandlerProps<PinchGestureHandlerEventPayload> {
}
export declare const pinchHandlerName = "PinchGestureHandler";
export type PinchGestureHandler = typeof PinchGestureHandler;
export declare const PinchGestureHandler: import("react").ComponentType<PinchGestureHandlerProps & import("react").RefAttributes<any>>;
