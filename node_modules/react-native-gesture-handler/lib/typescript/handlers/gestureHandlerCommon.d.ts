import * as React from 'react';
import { State } from '../State';
import { TouchEventType } from '../TouchEventType';
import { ValueOf } from '../typeUtils';
import { PointerType } from '../PointerType';
export declare const baseGestureHandlerProps: readonly ["id", "enabled", "shouldCancelWhenOutside", "hitSlop", "cancelsTouchesInView", "userSelect", "activeCursor", "mouseButton", "enableContextMenu", "touchAction", "waitFor", "simultaneousHandlers", "blocksHandlers", "onBegan", "onFailed", "onCancelled", "onActivated", "onEnded", "onGestureEvent", "onHandlerStateChange"];
export declare const baseGestureHandlerWithDetectorProps: string[];
export interface GestureEventPayload {
    handlerTag: number;
    numberOfPointers: number;
    state: ValueOf<typeof State>;
    pointerType: PointerType;
}
export interface HandlerStateChangeEventPayload extends GestureEventPayload {
    oldState: ValueOf<typeof State>;
}
export type HitSlop = number | null | undefined | Partial<Record<'left' | 'right' | 'top' | 'bottom' | 'vertical' | 'horizontal', number>> | Record<'width' | 'left', number> | Record<'width' | 'right', number> | Record<'height' | 'top', number> | Record<'height' | 'bottom', number>;
export type UserSelect = 'none' | 'auto' | 'text';
export type ActiveCursor = 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' | 'grabbing' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'col-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out';
export declare enum MouseButton {
    LEFT = 1,
    RIGHT = 2,
    MIDDLE = 4,
    BUTTON_4 = 8,
    BUTTON_5 = 16,
    ALL = 31
}
export type TouchAction = 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';
export interface GestureEvent<ExtraEventPayloadT = Record<string, unknown>> {
    nativeEvent: Readonly<GestureEventPayload & ExtraEventPayloadT>;
}
export interface HandlerStateChangeEvent<ExtraEventPayloadT = Record<string, unknown>> {
    nativeEvent: Readonly<HandlerStateChangeEventPayload & ExtraEventPayloadT>;
}
export type TouchData = {
    id: number;
    x: number;
    y: number;
    absoluteX: number;
    absoluteY: number;
};
export type GestureTouchEvent = {
    handlerTag: number;
    numberOfTouches: number;
    state: ValueOf<typeof State>;
    eventType: TouchEventType;
    allTouches: TouchData[];
    changedTouches: TouchData[];
    pointerType: PointerType;
};
export type GestureUpdateEvent<GestureEventPayloadT = Record<string, unknown>> = GestureEventPayload & GestureEventPayloadT;
export type GestureStateChangeEvent<GestureStateChangeEventPayloadT = Record<string, unknown>> = HandlerStateChangeEventPayload & GestureStateChangeEventPayloadT;
export type CommonGestureConfig = {
    enabled?: boolean;
    shouldCancelWhenOutside?: boolean;
    hitSlop?: HitSlop;
    userSelect?: UserSelect;
    activeCursor?: ActiveCursor;
    mouseButton?: MouseButton;
    enableContextMenu?: boolean;
    touchAction?: TouchAction;
};
export type BaseGestureHandlerProps<ExtraEventPayloadT extends Record<string, unknown> = Record<string, unknown>> = CommonGestureConfig & {
    id?: string;
    waitFor?: React.Ref<unknown> | React.Ref<unknown>[];
    simultaneousHandlers?: React.Ref<unknown> | React.Ref<unknown>[];
    blocksHandlers?: React.Ref<unknown> | React.Ref<unknown>[];
    testID?: string;
    cancelsTouchesInView?: boolean;
    onBegan?: (event: HandlerStateChangeEvent) => void;
    onFailed?: (event: HandlerStateChangeEvent) => void;
    onCancelled?: (event: HandlerStateChangeEvent) => void;
    onActivated?: (event: HandlerStateChangeEvent) => void;
    onEnded?: (event: HandlerStateChangeEvent) => void;
    onGestureEvent?: (event: GestureEvent<ExtraEventPayloadT>) => void;
    onHandlerStateChange?: (event: HandlerStateChangeEvent<ExtraEventPayloadT>) => void;
    children?: React.ReactNode;
};
