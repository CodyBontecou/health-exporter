import { GestureType } from './gestures/gesture';
import { GestureEvent, HandlerStateChangeEvent } from './gestureHandlerCommon';
export declare const handlerIDToTag: Record<string, number>;
export declare function registerHandler(handlerTag: number, handler: GestureType, testID?: string): void;
export declare function registerOldGestureHandler(handlerTag: number, handler: GestureHandlerCallbacks): void;
export declare function unregisterHandler(handlerTag: number, testID?: string): void;
export declare function findHandler(handlerTag: number): GestureType | undefined;
export declare function findOldGestureHandler(handlerTag: number): GestureHandlerCallbacks | undefined;
export declare function findHandlerByTestID(testID: string): import("./gestures/gesture").BaseGesture<Record<string, unknown>> | import("./gestures/gesture").BaseGesture<Record<string, never>> | import("./gestures/gesture").BaseGesture<import("./GestureHandlerEventPayload").TapGestureHandlerEventPayload> | import("./gestures/gesture").BaseGesture<import("./GestureHandlerEventPayload").PanGestureHandlerEventPayload> | import("./gestures/gesture").BaseGesture<import("./GestureHandlerEventPayload").LongPressGestureHandlerEventPayload> | import("./gestures/gesture").BaseGesture<import("./GestureHandlerEventPayload").RotationGestureHandlerEventPayload> | import("./gestures/gesture").BaseGesture<import("./GestureHandlerEventPayload").PinchGestureHandlerEventPayload> | import("./gestures/gesture").BaseGesture<import("./GestureHandlerEventPayload").ForceTouchGestureHandlerEventPayload> | import("./gestures/gesture").BaseGesture<import("./GestureHandlerEventPayload").NativeViewGestureHandlerPayload> | import("./gestures/gesture").BaseGesture<import("./GestureHandlerEventPayload").HoverGestureHandlerEventPayload> | null;
export interface GestureHandlerCallbacks {
    onGestureEvent: (event: GestureEvent<any>) => void;
    onGestureStateChange: (event: HandlerStateChangeEvent<any>) => void;
}
