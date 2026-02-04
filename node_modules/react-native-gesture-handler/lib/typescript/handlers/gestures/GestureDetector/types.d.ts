/// <reference types="react" />
import { GestureType, HandlerCallbacks } from '../gesture';
import { SharedValue } from '../reanimatedWrapper';
import { HandlerStateChangeEvent } from '../../gestureHandlerCommon';
export interface AttachedGestureState {
    attachedGestures: GestureType[];
    animatedEventHandler: unknown;
    animatedHandlers: SharedValue<HandlerCallbacks<Record<string, unknown>>[] | null> | null;
    shouldUseReanimated: boolean;
    isMounted: boolean;
}
export interface GestureDetectorState {
    firstRender: boolean;
    viewRef: React.Component | null;
    previousViewTag: number;
    forceRebuildReanimatedEvent: boolean;
}
export interface WebEventHandler {
    onGestureHandlerEvent: (event: HandlerStateChangeEvent<unknown>) => void;
    onGestureHandlerStateChange?: (event: HandlerStateChangeEvent<unknown>) => void;
}
