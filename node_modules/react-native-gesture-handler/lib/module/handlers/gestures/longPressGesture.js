function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { BaseGesture } from './gesture';
export class LongPressGesture extends BaseGesture {
  constructor() {
    super();

    _defineProperty(this, "config", {});

    this.handlerName = 'LongPressGestureHandler';
    this.shouldCancelWhenOutside(true);
  }
  /**
   * Minimum time, expressed in milliseconds, that a finger must remain pressed on the corresponding view.
   * The default value is 500.
   * @param duration
   */


  minDuration(duration) {
    this.config.minDurationMs = duration;
    return this;
  }
  /**
   * Maximum distance, expressed in points, that defines how far the finger is allowed to travel during a long press gesture.
   * @param distance
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/long-press-gesture#maxdistancevalue-number
   */


  maxDistance(distance) {
    this.config.maxDist = distance;
    return this;
  }
  /**
   * Determine exact number of points required to handle the long press gesture.
   * @param pointers
   */


  numberOfPointers(pointers) {
    this.config.numberOfPointers = pointers;
    return this;
  }

}
//# sourceMappingURL=longPressGesture.js.map