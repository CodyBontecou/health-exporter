import { AdaptedEvent, EventTypes } from '../interfaces';
import EventManager from './EventManager';
export default class KeyboardEventManager extends EventManager<HTMLElement> {
    private activationKeys;
    private cancelationKeys;
    private isPressed;
    private keyDownCallback;
    private keyUpCallback;
    private dispatchEvent;
    registerListeners(): void;
    unregisterListeners(): void;
    protected mapEvent(event: KeyboardEvent, eventType: EventTypes): AdaptedEvent;
}
