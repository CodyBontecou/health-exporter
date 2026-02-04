"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeGesture = void 0;

var _gesture = require("./gesture");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class NativeGesture extends _gesture.BaseGesture {
  constructor() {
    super();

    _defineProperty(this, "config", {});

    this.handlerName = 'NativeViewGestureHandler';
  }
  /**
   * When true, underlying handler will activate unconditionally when in `BEGAN` or `UNDETERMINED` state.
   * @param value
   */


  shouldActivateOnStart(value) {
    this.config.shouldActivateOnStart = value;
    return this;
  }
  /**
   * When true, cancels all other gesture handlers when this `NativeViewGestureHandler` receives an `ACTIVE` state event.
   * @param value
   */


  disallowInterruption(value) {
    this.config.disallowInterruption = value;
    return this;
  }

}

exports.NativeGesture = NativeGesture;
//# sourceMappingURL=nativeGesture.js.map