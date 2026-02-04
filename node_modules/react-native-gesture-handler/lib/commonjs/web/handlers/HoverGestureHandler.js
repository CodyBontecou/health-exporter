"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = require("../../State");

var _GestureHandlerOrchestrator = _interopRequireDefault(require("../tools/GestureHandlerOrchestrator"));

var _GestureHandler = _interopRequireDefault(require("./GestureHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HoverGestureHandler extends _GestureHandler.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "stylusData", void 0);
  }

  init(ref, propsRef) {
    super.init(ref, propsRef);
  }

  transformNativeEvent() {
    return { ...super.transformNativeEvent(),
      stylusData: this.stylusData
    };
  }

  updateGestureConfig({
    enabled = true,
    ...props
  }) {
    super.updateGestureConfig({
      enabled: enabled,
      ...props
    });
  }

  onPointerMoveOver(event) {
    _GestureHandlerOrchestrator.default.getInstance().recordHandlerIfNotPresent(this);

    this.tracker.addToTracker(event);
    this.stylusData = event.stylusData;
    super.onPointerMoveOver(event);

    if (this.getState() === _State.State.UNDETERMINED) {
      this.begin();
      this.activate();
    }
  }

  onPointerMoveOut(event) {
    this.tracker.removeFromTracker(event.pointerId);
    this.stylusData = event.stylusData;
    super.onPointerMoveOut(event);
    this.end();
  }

  onPointerMove(event) {
    this.tracker.track(event);
    this.stylusData = event.stylusData;
    super.onPointerMove(event);
  }

  onPointerCancel(event) {
    super.onPointerCancel(event);
    this.reset();
  }

}

exports.default = HoverGestureHandler;
//# sourceMappingURL=HoverGestureHandler.js.map