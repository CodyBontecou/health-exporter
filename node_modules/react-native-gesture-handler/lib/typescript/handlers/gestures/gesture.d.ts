/// <reference types="react" />
import { HitSlop, CommonGestureConfig, GestureTouchEvent, GestureStateChangeEvent, GestureUpdateEvent, ActiveCursor, MouseButton } from '../gestureHandlerCommon';
import { GestureStateManagerType } from './gestureStateManager';
import type { FlingGestureHandlerEventPayload, ForceTouchGestureHandlerEventPayload, LongPressGestureHandlerEventPayload, PanGestureHandlerEventPayload, PinchGestureHandlerEventPayload, RotationGestureHandlerEventPayload, TapGestureHandlerEventPayload, NativeViewGestureHandlerPayload, HoverGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
export type GestureType = BaseGesture<Record<string, unknown>> | BaseGesture<Record<string, never>> | BaseGesture<TapGestureHandlerEventPayload> | BaseGesture<PanGestureHandlerEventPayload> | BaseGesture<LongPressGestureHandlerEventPayload> | BaseGesture<RotationGestureHandlerEventPayload> | BaseGesture<PinchGestureHandlerEventPayload> | BaseGesture<FlingGestureHandlerEventPayload> | BaseGesture<ForceTouchGestureHandlerEventPayload> | BaseGesture<NativeViewGestureHandlerPayload> | BaseGesture<HoverGestureHandlerEventPayload>;
export type GestureRef = number | GestureType | React.RefObject<GestureType | undefined> | React.RefObject<React.ComponentType | undefined>;
export interface BaseGestureConfig extends CommonGestureConfig, Record<string, unknown> {
    ref?: React.MutableRefObject<GestureType | undefined>;
    requireToFail?: GestureRef[];
    simultaneousWith?: GestureRef[];
    blocksHandlers?: GestureRef[];
    needsPointerData?: boolean;
    manualActivation?: boolean;
    runOnJS?: boolean;
    testId?: string;
    cancelsTouchesInView?: boolean;
}
type TouchEventHandlerType = (event: GestureTouchEvent, stateManager: GestureStateManagerType) => void;
export type HandlerCallbacks<EventPayloadT extends Record<string, unknown>> = {
    gestureId: number;
    handlerTag: number;
    onBegin?: (event: GestureStateChangeEvent<EventPayloadT>) => void;
    onStart?: (event: GestureStateChangeEvent<EventPayloadT>) => void;
    onEnd?: (event: GestureStateChangeEvent<EventPayloadT>, success: boolean) => void;
    onFinalize?: (event: GestureStateChangeEvent<EventPayloadT>, success: boolean) => void;
    onUpdate?: (event: GestureUpdateEvent<EventPayloadT>) => void;
    onChange?: (event: any) => void;
    onTouchesDown?: TouchEventHandlerType;
    onTouchesMove?: TouchEventHandlerType;
    onTouchesUp?: TouchEventHandlerType;
    onTouchesCancelled?: TouchEventHandlerType;
    changeEventCalculator?: (current: GestureUpdateEvent<Record<string, unknown>>, previous?: GestureUpdateEvent<Record<string, unknown>>) => GestureUpdateEvent<Record<string, unknown>>;
    isWorklet: boolean[];
};
export declare const CALLBACK_TYPE: {
    readonly UNDEFINED: 0;
    readonly BEGAN: 1;
    readonly START: 2;
    readonly UPDATE: 3;
    readonly CHANGE: 4;
    readonly END: 5;
    readonly FINALIZE: 6;
    readonly TOUCHES_DOWN: 7;
    readonly TOUCHES_MOVE: 8;
    readonly TOUCHES_UP: 9;
    readonly TOUCHES_CANCELLED: 10;
};
export type CALLBACK_TYPE = typeof CALLBACK_TYPE[keyof typeof CALLBACK_TYPE];
export declare abstract class Gesture {
    /**
     * Return array of gestures, providing the same interface for creating and updating
     * handlers, no matter which object was used to create gesture instance.
     */
    abstract toGestureArray(): GestureType[];
    /**
     * Assign handlerTag to the gesture instance and set ref.current (if a ref is set)
     */
    abstract initialize(): void;
    /**
     * Make sure that values of properties defining relations are arrays. Do any necessary
     * preprocessing required to configure relations between handlers. Called just before
     * updating the handler on the native side.
     */
    abstract prepare(): void;
}
export declare abstract class BaseGesture<EventPayloadT extends Record<string, unknown>> extends Gesture {
    private gestureId;
    handlerTag: number;
    handlerName: string;
    config: BaseGestureConfig;
    handlers: HandlerCallbacks<EventPayloadT>;
    constructor();
    private addDependency;
    /**
     * Sets a `ref` to the gesture object, allowing for interoperability with the old API.
     * @param ref
     */
    withRef(ref: React.MutableRefObject<GestureType | undefined>): this;
    protected isWorklet(callback: Function): boolean;
    /**
     * Set the callback that is being called when given gesture handler starts receiving touches.
     * At the moment of this callback the handler is in `BEGAN` state and we don't know yet if it will recognize the gesture at all.
     * @param callback
     */
    onBegin(callback: (event: GestureStateChangeEvent<EventPayloadT>) => void): this;
    /**
     * Set the callback that is being called when the gesture is recognized by the handler and it transitions to the `ACTIVE` state.
     * @param callback
     */
    onStart(callback: (event: GestureStateChangeEvent<EventPayloadT>) => void): this;
    /**
     * Set the callback that is being called when the gesture that was recognized by the handler finishes and handler reaches `END` state.
     * It will be called only if the handler was previously in the `ACTIVE` state.
     * @param callback
     */
    onEnd(callback: (event: GestureStateChangeEvent<EventPayloadT>, success: boolean) => void): this;
    /**
     * Set the callback that is being called when the handler finalizes handling gesture - the gesture was recognized and has finished or it failed to recognize.
     * @param callback
     */
    onFinalize(callback: (event: GestureStateChangeEvent<EventPayloadT>, success: boolean) => void): this;
    /**
     * Set the `onTouchesDown` callback which is called every time a pointer is placed on the screen.
     * @param callback
     */
    onTouchesDown(callback: TouchEventHandlerType): this;
    /**
     * Set the `onTouchesMove` callback which is called every time a pointer is moved on the screen.
     * @param callback
     */
    onTouchesMove(callback: TouchEventHandlerType): this;
    /**
     * Set the `onTouchesUp` callback which is called every time a pointer is lifted from the screen.
     * @param callback
     */
    onTouchesUp(callback: TouchEventHandlerType): this;
    /**
     * Set the `onTouchesCancelled` callback which is called every time a pointer stops being tracked, for example when the gesture finishes.
     * @param callback
     */
    onTouchesCancelled(callback: TouchEventHandlerType): this;
    /**
     * Indicates whether the given handler should be analyzing stream of touch events or not.
     * @param enabled
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#enabledvalue-boolean
     */
    enabled(enabled: boolean): this;
    /**
     * When true the handler will cancel or fail recognition (depending on its current state) whenever the finger leaves the area of the connected view.
     * @param value
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#shouldcancelwhenoutsidevalue-boolean
     */
    shouldCancelWhenOutside(value: boolean): this;
    /**
     * This parameter enables control over what part of the connected view area can be used to begin recognizing the gesture.
     * When a negative number is provided the bounds of the view will reduce the area by the given number of points in each of the sides evenly.
     * @param hitSlop
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#hitslopsettings
     */
    hitSlop(hitSlop: HitSlop): this;
    /**
     * #### Web only
     * This parameter allows to specify which `cursor` should be used when gesture activates.
     * Supports all CSS cursor values (e.g. `"grab"`, `"zoom-in"`). Default value is set to `"auto"`.
     * @param activeCursor
     */
    activeCursor(activeCursor: ActiveCursor): this;
    /**
     * #### Web & Android only
     * Allows users to choose which mouse button should handler respond to.
     * Arguments can be combined using `|` operator, e.g. `mouseButton(MouseButton.LEFT | MouseButton.RIGHT)`.
     * Default value is set to `MouseButton.LEFT`.
     * @param mouseButton
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#mousebuttonvalue-mousebutton-web--android-only
     */
    mouseButton(mouseButton: MouseButton): this;
    /**
     * When `react-native-reanimated` is installed, the callbacks passed to the gestures are automatically workletized and run on the UI thread when called.
     * This option allows for changing this behavior: when `true`, all the callbacks will be run on the JS thread instead of the UI thread, regardless of whether they are worklets or not.
     * Defaults to `false`.
     * @param runOnJS
     */
    runOnJS(runOnJS: boolean): this;
    /**
     * Allows gestures across different components to be recognized simultaneously.
     * @param gestures
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/gesture-composition/#simultaneouswithexternalgesture
     */
    simultaneousWithExternalGesture(...gestures: Exclude<GestureRef, number>[]): this;
    /**
     * Allows to delay activation of the handler until all handlers passed as arguments to this method fail (or don't begin at all).
     * @param gestures
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/gesture-composition/#requireexternalgesturetofail
     */
    requireExternalGestureToFail(...gestures: Exclude<GestureRef, number>[]): this;
    /**
     * Works similarily to `requireExternalGestureToFail` but the direction of the relation is reversed - instead of being one-to-many relation, it's many-to-one.
     * @param gestures
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/gesture-composition/#blocksexternalgesture
     */
    blocksExternalGesture(...gestures: Exclude<GestureRef, number>[]): this;
    /**
     * Sets a `testID` property for gesture object, allowing for querying for it in tests.
     * @param id
     */
    withTestId(id: string): this;
    /**
     * #### iOS only
     * When `true`, the handler will cancel touches for native UI components (`UIButton`, `UISwitch`, etc) it's attached to when it becomes `ACTIVE`.
     * Default value is `true`.
     * @param value
     */
    cancelsTouchesInView(value: boolean): this;
    initialize(): void;
    toGestureArray(): GestureType[];
    prepare(): void;
    get shouldUseReanimated(): boolean;
}
export declare abstract class ContinousBaseGesture<EventPayloadT extends Record<string, unknown>, EventChangePayloadT extends Record<string, unknown>> extends BaseGesture<EventPayloadT> {
    /**
     * Set the callback that is being called every time the gesture receives an update while it's active.
     * @param callback
     */
    onUpdate(callback: (event: GestureUpdateEvent<EventPayloadT>) => void): this;
    /**
     * Set the callback that is being called every time the gesture receives an update while it's active.
     * This callback will receive information about change in value in relation to the last received event.
     * @param callback
     */
    onChange(callback: (event: GestureUpdateEvent<EventPayloadT & EventChangePayloadT>) => void): this;
    /**
     * When `true` the handler will not activate by itself even if its activation criteria are met.
     * Instead you can manipulate its state using state manager.
     * @param manualActivation
     */
    manualActivation(manualActivation: boolean): this;
}
export {};
