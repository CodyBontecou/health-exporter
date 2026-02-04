/// <reference types="react" />
import { State } from '../../State';
import { Config, AdaptedEvent } from '../interfaces';
import EventManager from '../tools/EventManager';
import PointerTracker from '../tools/PointerTracker';
import IGestureHandler from './IGestureHandler';
import { MouseButton } from '../../handlers/gestureHandlerCommon';
import { PointerType } from '../../PointerType';
import { GestureHandlerDelegate } from '../tools/GestureHandlerDelegate';
export default abstract class GestureHandler implements IGestureHandler {
    private lastSentState;
    protected currentState: State;
    protected shouldCancelWhenOutside: boolean;
    protected hasCustomActivationCriteria: boolean;
    protected enabled: boolean;
    private viewRef;
    private propsRef;
    private handlerTag;
    protected config: Config;
    protected tracker: PointerTracker;
    protected activationIndex: number;
    protected awaiting: boolean;
    protected active: boolean;
    protected shouldResetProgress: boolean;
    protected pointerType: PointerType;
    protected delegate: GestureHandlerDelegate<unknown, IGestureHandler>;
    constructor(delegate: GestureHandlerDelegate<unknown, IGestureHandler>);
    protected init(viewRef: number, propsRef: React.RefObject<unknown>): void;
    attachEventManager(manager: EventManager<unknown>): void;
    protected onCancel(): void;
    protected onReset(): void;
    protected resetProgress(): void;
    reset(): void;
    moveToState(newState: State, sendIfDisabled?: boolean): void;
    protected onStateChange(_newState: State, _oldState: State): void;
    begin(): void;
    /**
     * @param {boolean} sendIfDisabled - Used when handler becomes disabled. With this flag orchestrator will be forced to send fail event
     */
    fail(sendIfDisabled?: boolean): void;
    /**
     * @param {boolean} sendIfDisabled - Used when handler becomes disabled. With this flag orchestrator will be forced to send cancel event
     */
    cancel(sendIfDisabled?: boolean): void;
    activate(force?: boolean): void;
    end(): void;
    isAwaiting(): boolean;
    setAwaiting(value: boolean): void;
    isActive(): boolean;
    setActive(value: boolean): void;
    getShouldResetProgress(): boolean;
    setShouldResetProgress(value: boolean): void;
    getActivationIndex(): number;
    setActivationIndex(value: number): void;
    shouldWaitForHandlerFailure(handler: IGestureHandler): boolean;
    shouldRequireToWaitForFailure(handler: IGestureHandler): boolean;
    shouldRecognizeSimultaneously(handler: IGestureHandler): boolean;
    shouldBeCancelledByOther(handler: IGestureHandler): boolean;
    protected onPointerDown(event: AdaptedEvent): void;
    protected onPointerAdd(event: AdaptedEvent): void;
    protected onPointerUp(event: AdaptedEvent): void;
    protected onPointerRemove(event: AdaptedEvent): void;
    protected onPointerMove(event: AdaptedEvent): void;
    protected onPointerLeave(event: AdaptedEvent): void;
    protected onPointerEnter(event: AdaptedEvent): void;
    protected onPointerCancel(event: AdaptedEvent): void;
    protected onPointerOutOfBounds(event: AdaptedEvent): void;
    protected onPointerMoveOver(_event: AdaptedEvent): void;
    protected onPointerMoveOut(_event: AdaptedEvent): void;
    private tryToSendMoveEvent;
    protected tryToSendTouchEvent(event: AdaptedEvent): void;
    sendTouchEvent(event: AdaptedEvent): void;
    sendEvent: (newState: State, oldState: State) => void;
    private transformEventData;
    private transformTouchEvent;
    private cancelTouches;
    protected transformNativeEvent(): Record<string, unknown>;
    updateGestureConfig({ enabled, ...props }: Config): void;
    protected checkCustomActivationCriteria(criterias: string[]): void;
    private validateHitSlops;
    private checkHitSlop;
    isButtonInConfig(mouseButton: MouseButton | undefined): number | true | undefined;
    protected resetConfig(): void;
    onDestroy(): void;
    getTag(): number;
    setTag(tag: number): void;
    getConfig(): Config;
    getDelegate(): GestureHandlerDelegate<unknown, IGestureHandler>;
    getTracker(): PointerTracker;
    getTrackedPointersID(): number[];
    getState(): State;
    isEnabled(): boolean;
    private isFinished;
    protected setShouldCancelWhenOutside(shouldCancel: boolean): void;
    protected getShouldCancelWhenOutside(): boolean;
    getPointerType(): PointerType;
}
