"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForceTouchGesture = void 0;

var _gesture = require("./gesture");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function changeEventCalculator(current, previous) {
  'worklet';

  let changePayload;

  if (previous === undefined) {
    changePayload = {
      forceChange: current.force
    };
  } else {
    changePayload = {
      forceChange: current.force - previous.force
    };
  }

  return { ...current,
    ...changePayload
  };
}

class ForceTouchGesture extends _gesture.ContinousBaseGesture {
  constructor() {
    super();

    _defineProperty(this, "config", {});

    this.handlerName = 'ForceTouchGestureHandler';
  }
  /**
   * A minimal pressure that is required before gesture can activate.
   * Should be a value from range [0.0, 1.0]. Default is 0.2.
   * @param force
   */


  minForce(force) {
    this.config.minForce = force;
    return this;
  }
  /**
   * A maximal pressure that could be applied for gesture.
   * If the pressure is greater, gesture fails. Should be a value from range [0.0, 1.0].
   * @param force
   */


  maxForce(force) {
    this.config.maxForce = force;
    return this;
  }
  /**
   * Value defining if haptic feedback has to be performed on activation.
   * @param value
   */


  feedbackOnActivation(value) {
    this.config.feedbackOnActivation = value;
    return this;
  }

  onChange(callback) {
    // @ts-ignore TS being overprotective, ForceTouchGestureHandlerEventPayload is Record
    this.handlers.changeEventCalculator = changeEventCalculator;
    return super.onChange(callback);
  }

}

exports.ForceTouchGesture = ForceTouchGesture;
//# sourceMappingURL=forceTouchGesture.js.map