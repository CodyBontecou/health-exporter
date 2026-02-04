import { BaseGestureConfig, ContinousBaseGesture } from './gesture';
import { GestureUpdateEvent } from '../gestureHandlerCommon';
import type { HoverGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
export type HoverGestureChangeEventPayload = {
    changeX: number;
    changeY: number;
};
export declare enum HoverEffect {
    NONE = 0,
    LIFT = 1,
    HIGHLIGHT = 2
}
export interface HoverGestureConfig {
    hoverEffect?: HoverEffect;
}
export declare const hoverGestureHandlerProps: readonly ["hoverEffect"];
export declare class HoverGesture extends ContinousBaseGesture<HoverGestureHandlerEventPayload, HoverGestureChangeEventPayload> {
    config: BaseGestureConfig & HoverGestureConfig;
    constructor();
    /**
     * #### iOS only
     * Sets the visual hover effect.
     */
    effect(effect: HoverEffect): this;
    onChange(callback: (event: GestureUpdateEvent<HoverGestureHandlerEventPayload & HoverGestureChangeEventPayload>) => void): this;
}
export type HoverGestureType = InstanceType<typeof HoverGesture>;
