function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { ContinousBaseGesture } from './gesture';

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

export class ForceTouchGesture extends ContinousBaseGesture {
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
//# sourceMappingURL=forceTouchGesture.js.map