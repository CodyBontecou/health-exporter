/// <reference types="react" />
import { AdaptedEvent, Config } from '../interfaces';
import GestureHandler from './GestureHandler';
export default class NativeViewGestureHandler extends GestureHandler {
    private buttonRole;
    private shouldActivateOnStart;
    private disallowInterruption;
    private startX;
    private startY;
    private minDistSq;
    init(ref: number, propsRef: React.RefObject<unknown>): void;
    updateGestureConfig({ enabled, ...props }: Config): void;
    private restoreViewStyles;
    protected resetConfig(): void;
    protected onPointerDown(event: AdaptedEvent): void;
    protected onPointerAdd(event: AdaptedEvent): void;
    private newPointerAction;
    protected onPointerMove(event: AdaptedEvent): void;
    protected onPointerLeave(): void;
    protected onPointerUp(event: AdaptedEvent): void;
    protected onPointerRemove(event: AdaptedEvent): void;
    private onUp;
    shouldRecognizeSimultaneously(handler: GestureHandler): boolean;
    shouldBeCancelledByOther(_handler: GestureHandler): boolean;
    disallowsInterruption(): boolean;
    isButton(): boolean;
}
