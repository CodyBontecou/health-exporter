"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

var _State = require("../../State");

var _constants = require("../constants");

var _GestureHandler = _interopRequireDefault(require("./GestureHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class NativeViewGestureHandler extends _GestureHandler.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "buttonRole", void 0);

    _defineProperty(this, "shouldActivateOnStart", false);

    _defineProperty(this, "disallowInterruption", false);

    _defineProperty(this, "startX", 0);

    _defineProperty(this, "startY", 0);

    _defineProperty(this, "minDistSq", _constants.DEFAULT_TOUCH_SLOP * _constants.DEFAULT_TOUCH_SLOP);
  }

  init(ref, propsRef) {
    super.init(ref, propsRef);
    this.setShouldCancelWhenOutside(true);

    if (_reactNative.Platform.OS !== 'web') {
      return;
    }

    const view = this.delegate.getView();
    this.restoreViewStyles(view);
    this.buttonRole = view.getAttribute('role') === 'button';
  }

  updateGestureConfig({
    enabled = true,
    ...props
  }) {
    super.updateGestureConfig({
      enabled: enabled,
      ...props
    });

    if (this.config.shouldActivateOnStart !== undefined) {
      this.shouldActivateOnStart = this.config.shouldActivateOnStart;
    }

    if (this.config.disallowInterruption !== undefined) {
      this.disallowInterruption = this.config.disallowInterruption;
    }

    const view = this.delegate.getView();
    this.restoreViewStyles(view);
  }

  restoreViewStyles(view) {
    if (!view) {
      return;
    }

    view.style['touchAction'] = 'auto'; // @ts-ignore Turns on defualt touch behavior on Safari

    view.style['WebkitTouchCallout'] = 'auto';
  }

  resetConfig() {
    super.resetConfig();
  }

  onPointerDown(event) {
    this.tracker.addToTracker(event);
    super.onPointerDown(event);
    this.newPointerAction();
    this.tryToSendTouchEvent(event);
  }

  onPointerAdd(event) {
    this.tracker.addToTracker(event);
    super.onPointerAdd(event);
    this.newPointerAction();
  }

  newPointerAction() {
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    this.startX = lastCoords.x;
    this.startY = lastCoords.y;

    if (this.currentState !== _State.State.UNDETERMINED) {
      return;
    }

    this.begin();

    if (this.buttonRole) {
      this.activate();
    }
  }

  onPointerMove(event) {
    this.tracker.track(event);
    const lastCoords = this.tracker.getAbsoluteCoordsAverage();
    const dx = this.startX - lastCoords.x;
    const dy = this.startY - lastCoords.y;
    const distSq = dx * dx + dy * dy;

    if (distSq >= this.minDistSq) {
      if (this.buttonRole && this.currentState === _State.State.ACTIVE) {
        this.cancel();
      } else if (!this.buttonRole && this.currentState === _State.State.BEGAN) {
        this.activate();
      }
    }
  }

  onPointerLeave() {
    if (this.currentState === _State.State.BEGAN || this.currentState === _State.State.ACTIVE) {
      this.cancel();
    }
  }

  onPointerUp(event) {
    super.onPointerUp(event);
    this.onUp(event);
  }

  onPointerRemove(event) {
    super.onPointerRemove(event);
    this.onUp(event);
  }

  onUp(event) {
    this.tracker.removeFromTracker(event.pointerId);

    if (this.tracker.getTrackedPointersCount() === 0) {
      if (this.currentState === _State.State.ACTIVE) {
        this.end();
      } else {
        this.fail();
      }
    }
  }

  shouldRecognizeSimultaneously(handler) {
    if (super.shouldRecognizeSimultaneously(handler)) {
      return true;
    }

    if (handler instanceof NativeViewGestureHandler && handler.getState() === _State.State.ACTIVE && handler.disallowsInterruption()) {
      return false;
    }

    const canBeInterrupted = !this.disallowInterruption;

    if (this.currentState === _State.State.ACTIVE && handler.getState() === _State.State.ACTIVE && canBeInterrupted) {
      return false;
    }

    return this.currentState === _State.State.ACTIVE && canBeInterrupted && handler.getTag() > 0;
  }

  shouldBeCancelledByOther(_handler) {
    return !this.disallowInterruption;
  }

  disallowsInterruption() {
    return this.disallowInterruption;
  }

  isButton() {
    return this.buttonRole;
  }

}

exports.default = NativeViewGestureHandler;
//# sourceMappingURL=NativeViewGestureHandler.js.map