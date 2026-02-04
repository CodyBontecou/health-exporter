import EventManager from './EventManager';
import { AdaptedEvent, EventTypes } from '../interfaces';
export default class PointerEventManager extends EventManager<HTMLElement> {
    private trackedPointers;
    private readonly mouseButtonsMapper;
    private lastPosition;
    constructor(view: HTMLElement);
    private pointerDownCallback;
    private pointerUpCallback;
    private pointerMoveCallback;
    private pointerCancelCallback;
    private pointerEnterCallback;
    private pointerLeaveCallback;
    private lostPointerCaptureCallback;
    registerListeners(): void;
    unregisterListeners(): void;
    protected mapEvent(event: PointerEvent, eventType: EventTypes): AdaptedEvent;
    resetManager(): void;
}
