/// <reference types="react" />
import { AdaptedEvent, Config } from '../interfaces';
import GestureHandler from './GestureHandler';
export default class HoverGestureHandler extends GestureHandler {
    private stylusData;
    init(ref: number, propsRef: React.RefObject<unknown>): void;
    protected transformNativeEvent(): Record<string, unknown>;
    updateGestureConfig({ enabled, ...props }: Config): void;
    protected onPointerMoveOver(event: AdaptedEvent): void;
    protected onPointerMoveOut(event: AdaptedEvent): void;
    protected onPointerMove(event: AdaptedEvent): void;
    protected onPointerCancel(event: AdaptedEvent): void;
}
