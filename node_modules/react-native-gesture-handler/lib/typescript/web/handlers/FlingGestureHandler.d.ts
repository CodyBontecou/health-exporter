/// <reference types="react" />
import { AdaptedEvent, Config } from '../interfaces';
import GestureHandler from './GestureHandler';
export default class FlingGestureHandler extends GestureHandler {
    private numberOfPointersRequired;
    private direction;
    private maxDurationMs;
    private minVelocity;
    private delayTimeout;
    private maxNumberOfPointersSimultaneously;
    private keyPointer;
    init(ref: number, propsRef: React.RefObject<unknown>): void;
    updateGestureConfig({ enabled, ...props }: Config): void;
    private startFling;
    private tryEndFling;
    private endFling;
    protected onPointerDown(event: AdaptedEvent): void;
    protected onPointerAdd(event: AdaptedEvent): void;
    private newPointerAction;
    private pointerMoveAction;
    protected onPointerMove(event: AdaptedEvent): void;
    protected onPointerOutOfBounds(event: AdaptedEvent): void;
    protected onPointerUp(event: AdaptedEvent): void;
    protected onPointerRemove(event: AdaptedEvent): void;
    private onUp;
    activate(force?: boolean): void;
    protected resetConfig(): void;
}
