/// <reference types="react" />
import { RotationGestureHandlerEventPayload } from './GestureHandlerEventPayload';
import { BaseGestureHandlerProps } from './gestureHandlerCommon';
export interface RotationGestureHandlerProps extends BaseGestureHandlerProps<RotationGestureHandlerEventPayload> {
}
export declare const rotationHandlerName = "RotationGestureHandler";
export type RotationGestureHandler = typeof RotationGestureHandler;
export declare const RotationGestureHandler: import("react").ComponentType<RotationGestureHandlerProps & import("react").RefAttributes<any>>;
