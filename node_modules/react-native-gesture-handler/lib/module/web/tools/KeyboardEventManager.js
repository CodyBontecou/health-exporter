function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { EventTypes } from '../interfaces';
import EventManager from './EventManager';
import { PointerType } from '../../PointerType';
export default class KeyboardEventManager extends EventManager {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "activationKeys", ['Enter', ' ']);

    _defineProperty(this, "cancelationKeys", ['Tab']);

    _defineProperty(this, "isPressed", false);

    _defineProperty(this, "keyDownCallback", event => {
      if (this.cancelationKeys.indexOf(event.key) !== -1 && this.isPressed) {
        this.dispatchEvent(event, EventTypes.CANCEL);
        return;
      }

      if (this.activationKeys.indexOf(event.key) === -1) {
        return;
      }

      this.dispatchEvent(event, EventTypes.DOWN);
    });

    _defineProperty(this, "keyUpCallback", event => {
      if (this.activationKeys.indexOf(event.key) === -1 || !this.isPressed) {
        return;
      }

      this.dispatchEvent(event, EventTypes.UP);
    });
  }

  dispatchEvent(event, eventType) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const adaptedEvent = this.mapEvent(event, eventType);

    switch (eventType) {
      case EventTypes.UP:
        this.isPressed = false;
        this.onPointerUp(adaptedEvent);
        break;

      case EventTypes.DOWN:
        this.isPressed = true;
        this.onPointerDown(adaptedEvent);
        break;

      case EventTypes.CANCEL:
        this.isPressed = false;
        this.onPointerCancel(adaptedEvent);
        break;
    }
  }

  registerListeners() {
    this.view.addEventListener('keydown', this.keyDownCallback);
    this.view.addEventListener('keyup', this.keyUpCallback);
  }

  unregisterListeners() {
    this.view.addEventListener('keydown', this.keyDownCallback);
    this.view.addEventListener('keyup', this.keyUpCallback);
  }

  mapEvent(event, eventType) {
    const viewRect = event.target.getBoundingClientRect();
    const viewportPosition = {
      x: (viewRect === null || viewRect === void 0 ? void 0 : viewRect.x) + (viewRect === null || viewRect === void 0 ? void 0 : viewRect.width) / 2,
      y: (viewRect === null || viewRect === void 0 ? void 0 : viewRect.y) + (viewRect === null || viewRect === void 0 ? void 0 : viewRect.height) / 2
    };
    const relativePosition = {
      x: (viewRect === null || viewRect === void 0 ? void 0 : viewRect.width) / 2,
      y: (viewRect === null || viewRect === void 0 ? void 0 : viewRect.height) / 2
    };
    return {
      x: viewportPosition.x,
      y: viewportPosition.y,
      offsetX: relativePosition.x,
      offsetY: relativePosition.y,
      pointerId: 0,
      eventType: eventType,
      pointerType: PointerType.KEY,
      time: event.timeStamp
    };
  }

}
//# sourceMappingURL=KeyboardEventManager.js.map