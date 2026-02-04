"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _interfaces = require("../interfaces");

var _EventManager = _interopRequireDefault(require("./EventManager"));

var _PointerType = require("../../PointerType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class KeyboardEventManager extends _EventManager.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "activationKeys", ['Enter', ' ']);

    _defineProperty(this, "cancelationKeys", ['Tab']);

    _defineProperty(this, "isPressed", false);

    _defineProperty(this, "keyDownCallback", event => {
      if (this.cancelationKeys.indexOf(event.key) !== -1 && this.isPressed) {
        this.dispatchEvent(event, _interfaces.EventTypes.CANCEL);
        return;
      }

      if (this.activationKeys.indexOf(event.key) === -1) {
        return;
      }

      this.dispatchEvent(event, _interfaces.EventTypes.DOWN);
    });

    _defineProperty(this, "keyUpCallback", event => {
      if (this.activationKeys.indexOf(event.key) === -1 || !this.isPressed) {
        return;
      }

      this.dispatchEvent(event, _interfaces.EventTypes.UP);
    });
  }

  dispatchEvent(event, eventType) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const adaptedEvent = this.mapEvent(event, eventType);

    switch (eventType) {
      case _interfaces.EventTypes.UP:
        this.isPressed = false;
        this.onPointerUp(adaptedEvent);
        break;

      case _interfaces.EventTypes.DOWN:
        this.isPressed = true;
        this.onPointerDown(adaptedEvent);
        break;

      case _interfaces.EventTypes.CANCEL:
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
      pointerType: _PointerType.PointerType.KEY,
      time: event.timeStamp
    };
  }

}

exports.default = KeyboardEventManager;
//# sourceMappingURL=KeyboardEventManager.js.map