function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { State } from '../../State';
import GestureHandler from './GestureHandler';
const DEFAULT_MIN_DURATION_MS = 500;
const DEFAULT_MAX_DIST_DP = 10;
const SCALING_FACTOR = 10;
export default class LongPressGestureHandler extends GestureHandler {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "minDurationMs", DEFAULT_MIN_DURATION_MS);

    _defineProperty(this, "defaultMaxDistSq", DEFAULT_MAX_DIST_DP * SCALING_FACTOR);

    _defineProperty(this, "maxDistSq", this.defaultMaxDistSq);

    _defineProperty(this, "numberOfPointers", 1);

    _defineProperty(this, "startX", 0);

    _defineProperty(this, "startY", 0);

    _defineProperty(this, "startTime", 0);

    _defineProperty(this, "previousTime", 0);

    _defineProperty(this, "activationTimeout", void 0);
  }

  init(ref, propsRef) {
    if (this.config.enableContextMenu === undefined) {
      this.config.enableContextMenu = false;
    }

    super.init(ref, propsRef);
  }

  transformNativeEvent() {
    return { ...super.transformNativeEvent(),
      duration: Date.now() - this.startTime
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

    if (this.config.minDurationMs !== undefined) {
      this.minDurationMs = this.config.minDurationMs;
    }

    if (this.config.maxDist !== undefined) {
      this.maxDistSq = this.config.maxDist * this.config.maxDist;
    }

    if (this.config.numberOfPointers !== undefined) {
      this.numberOfPointers = this.config.numberOfPointers;
    }
  }

  resetConfig() {
    super.resetConfig();
    this.minDurationMs = DEFAULT_MIN_DURATION_MS;
    this.maxDistSq = this.defaultMaxDistSq;
  }

  onStateChange(_newState, _oldState) {
    clearTimeout(this.activationTimeout);
  }

  onPointerDown(event) {
    if (!this.isButtonInConfig(event.button)) {
      return;
    }

    this.tracker.addToTracker(event);
    super.onPointerDown(event);
    this.startX = event.x;
    this.startY = event.y;
    this.tryBegin();
    this.tryActivate();
    this.tryToSendTouchEvent(event);
  }

  onPointerAdd(event) {
    super.onPointerAdd(event);
    this.tracker.addToTracker(event);

    if (this.tracker.getTrackedPointersCount() > this.numberOfPointers) {
      this.fail();
      return;
    }

    const absoluteCoordsAverage = this.tracker.getAbsoluteCoordsAverage();
    this.startX = absoluteCoordsAverage.x;
    this.startY = absoluteCoordsAverage.y;
    this.tryActivate();
  }

  onPointerMove(event) {
    super.onPointerMove(event);
    this.tracker.track(event);
    this.checkDistanceFail();
  }

  onPointerUp(event) {
    super.onPointerUp(event);
    this.tracker.removeFromTracker(event.pointerId);

    if (this.currentState === State.ACTIVE) {
      this.end();
    } else {
      this.fail();
    }
  }

  onPointerRemove(event) {
    super.onPointerRemove(event);
    this.tracker.removeFromTracker(event.pointerId);

    if (this.tracker.getTrackedPointersCount() < this.numberOfPointers && this.getState() !== State.ACTIVE) {
      this.fail();
    }
  }

  tryBegin() {
    if (this.currentState !== State.UNDETERMINED) {
      return;
    }

    this.previousTime = Date.now();
    this.startTime = this.previousTime;
    this.begin();
  }

  tryActivate() {
    if (this.tracker.getTrackedPointersCount() !== this.numberOfPointers) {
      return;
    }

    if (this.minDurationMs > 0) {
      this.activationTimeout = setTimeout(() => {
        this.activate();
      }, this.minDurationMs);
    } else if (this.minDurationMs === 0) {
      this.activate();
    }
  }

  checkDistanceFail() {
    const absoluteCoordsAverage = this.tracker.getAbsoluteCoordsAverage();
    const dx = absoluteCoordsAverage.x - this.startX;
    const dy = absoluteCoordsAverage.y - this.startY;
    const distSq = dx * dx + dy * dy;

    if (distSq <= this.maxDistSq) {
      return;
    }

    if (this.currentState === State.ACTIVE) {
      this.cancel();
    } else {
      this.fail();
    }
  }

}
//# sourceMappingURL=LongPressGestureHandler.js.map