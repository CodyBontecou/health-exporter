function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { BaseGesture } from './gesture';
export class NativeGesture extends BaseGesture {
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
//# sourceMappingURL=nativeGesture.js.map