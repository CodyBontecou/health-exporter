function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import VelocityTracker from './VelocityTracker';
const MAX_POINTERS = 20;
export default class PointerTracker {
  constructor() {
    _defineProperty(this, "velocityTracker", new VelocityTracker());

    _defineProperty(this, "trackedPointers", new Map());

    _defineProperty(this, "touchEventsIds", new Map());

    _defineProperty(this, "lastMovedPointerId", void 0);

    _defineProperty(this, "cachedAbsoluteAverages", {
      x: 0,
      y: 0
    });

    _defineProperty(this, "cachedRelativeAverages", {
      x: 0,
      y: 0
    });

    this.lastMovedPointerId = NaN;

    for (let i = 0; i < MAX_POINTERS; ++i) {
      this.touchEventsIds.set(i, NaN);
    }
  }

  addToTracker(event) {
    if (this.trackedPointers.has(event.pointerId)) {
      return;
    }

    this.lastMovedPointerId = event.pointerId;
    const newElement = {
      abosoluteCoords: {
        x: event.x,
        y: event.y
      },
      relativeCoords: {
        x: event.offsetX,
        y: event.offsetY
      },
      timestamp: event.time,
      velocityX: 0,
      velocityY: 0
    };
    this.trackedPointers.set(event.pointerId, newElement);
    this.mapTouchEventId(event.pointerId);
    this.cachedAbsoluteAverages = this.getAbsoluteCoordsAverage();
    this.cachedRelativeAverages = this.getRelativeCoordsAverage();
  }

  removeFromTracker(pointerId) {
    this.trackedPointers.delete(pointerId);
    this.removeMappedTouchId(pointerId);
  }

  track(event) {
    const element = this.trackedPointers.get(event.pointerId);

    if (!element) {
      return;
    }

    this.lastMovedPointerId = event.pointerId;
    this.velocityTracker.add(event);
    const [velocityX, velocityY] = this.velocityTracker.getVelocity();
    element.velocityX = velocityX;
    element.velocityY = velocityY;
    element.abosoluteCoords = {
      x: event.x,
      y: event.y
    };
    element.relativeCoords = {
      x: event.offsetX,
      y: event.offsetY
    };
    this.trackedPointers.set(event.pointerId, element);
    this.cachedAbsoluteAverages = this.getAbsoluteCoordsAverage();
    this.cachedRelativeAverages = this.getRelativeCoordsAverage();
  } // Mapping TouchEvents ID


  mapTouchEventId(id) {
    for (const [mappedId, touchId] of this.touchEventsIds) {
      if (isNaN(touchId)) {
        this.touchEventsIds.set(mappedId, id);
        break;
      }
    }
  }

  removeMappedTouchId(id) {
    const mappedId = this.getMappedTouchEventId(id);

    if (!isNaN(mappedId)) {
      this.touchEventsIds.set(mappedId, NaN);
    }
  }

  getMappedTouchEventId(touchEventId) {
    for (const [key, value] of this.touchEventsIds.entries()) {
      if (value === touchEventId) {
        return key;
      }
    }

    return NaN;
  }

  getVelocity(pointerId) {
    var _this$trackedPointers, _this$trackedPointers2;

    return {
      x: (_this$trackedPointers = this.trackedPointers.get(pointerId)) === null || _this$trackedPointers === void 0 ? void 0 : _this$trackedPointers.velocityX,
      y: (_this$trackedPointers2 = this.trackedPointers.get(pointerId)) === null || _this$trackedPointers2 === void 0 ? void 0 : _this$trackedPointers2.velocityY
    };
  }

  getLastAbsoluteCoords(pointerId) {
    if (pointerId !== undefined) {
      var _this$trackedPointers3, _this$trackedPointers4;

      return {
        x: (_this$trackedPointers3 = this.trackedPointers.get(pointerId)) === null || _this$trackedPointers3 === void 0 ? void 0 : _this$trackedPointers3.abosoluteCoords.x,
        y: (_this$trackedPointers4 = this.trackedPointers.get(pointerId)) === null || _this$trackedPointers4 === void 0 ? void 0 : _this$trackedPointers4.abosoluteCoords.y
      };
    } else {
      var _this$trackedPointers5, _this$trackedPointers6;

      return {
        x: (_this$trackedPointers5 = this.trackedPointers.get(this.lastMovedPointerId)) === null || _this$trackedPointers5 === void 0 ? void 0 : _this$trackedPointers5.abosoluteCoords.x,
        y: (_this$trackedPointers6 = this.trackedPointers.get(this.lastMovedPointerId)) === null || _this$trackedPointers6 === void 0 ? void 0 : _this$trackedPointers6.abosoluteCoords.y
      };
    }
  }

  getLastRelativeCoords(pointerId) {
    if (pointerId !== undefined) {
      var _this$trackedPointers7, _this$trackedPointers8;

      return {
        x: (_this$trackedPointers7 = this.trackedPointers.get(pointerId)) === null || _this$trackedPointers7 === void 0 ? void 0 : _this$trackedPointers7.relativeCoords.x,
        y: (_this$trackedPointers8 = this.trackedPointers.get(pointerId)) === null || _this$trackedPointers8 === void 0 ? void 0 : _this$trackedPointers8.relativeCoords.y
      };
    } else {
      var _this$trackedPointers9, _this$trackedPointers10;

      return {
        x: (_this$trackedPointers9 = this.trackedPointers.get(this.lastMovedPointerId)) === null || _this$trackedPointers9 === void 0 ? void 0 : _this$trackedPointers9.relativeCoords.x,
        y: (_this$trackedPointers10 = this.trackedPointers.get(this.lastMovedPointerId)) === null || _this$trackedPointers10 === void 0 ? void 0 : _this$trackedPointers10.relativeCoords.y
      };
    }
  } // Some handlers use these methods to send average values in native event.
  // This may happen when pointers have already been removed from tracker (i.e. pointerup event).
  // In situation when NaN would be sent as a response, we return cached value.
  // That prevents handlers from crashing


  getAbsoluteCoordsAverage() {
    const coordsSum = this.getAbsoluteCoordsSum();
    const avgX = coordsSum.x / this.trackedPointers.size;
    const avgY = coordsSum.y / this.trackedPointers.size;
    const averages = {
      x: isNaN(avgX) ? this.cachedAbsoluteAverages.x : avgX,
      y: isNaN(avgY) ? this.cachedAbsoluteAverages.y : avgY
    };
    return averages;
  }

  getRelativeCoordsAverage() {
    const coordsSum = this.getRelativeCoordsSum();
    const avgX = coordsSum.x / this.trackedPointers.size;
    const avgY = coordsSum.y / this.trackedPointers.size;
    const averages = {
      x: isNaN(avgX) ? this.cachedRelativeAverages.x : avgX,
      y: isNaN(avgY) ? this.cachedRelativeAverages.y : avgY
    };
    return averages;
  }

  getAbsoluteCoordsSum(ignoredPointer) {
    const sum = {
      x: 0,
      y: 0
    };
    this.trackedPointers.forEach((value, key) => {
      if (key !== ignoredPointer) {
        sum.x += value.abosoluteCoords.x;
        sum.y += value.abosoluteCoords.y;
      }
    });
    return sum;
  }

  getRelativeCoordsSum(ignoredPointer) {
    const sum = {
      x: 0,
      y: 0
    };
    this.trackedPointers.forEach((value, key) => {
      if (key !== ignoredPointer) {
        sum.x += value.relativeCoords.x;
        sum.y += value.relativeCoords.y;
      }
    });
    return sum;
  }

  getTrackedPointersCount() {
    return this.trackedPointers.size;
  }

  getTrackedPointersID() {
    const keys = [];
    this.trackedPointers.forEach((_value, key) => {
      keys.push(key);
    });
    return keys;
  }

  getData() {
    return this.trackedPointers;
  }

  resetTracker() {
    this.velocityTracker.reset();
    this.trackedPointers.clear();
    this.lastMovedPointerId = NaN;

    for (let i = 0; i < MAX_POINTERS; ++i) {
      this.touchEventsIds.set(i, NaN);
    }
  }

  static shareCommonPointers(stPointers, ndPointers) {
    return stPointers.some(pointerId => ndPointers.includes(pointerId));
  }

}
//# sourceMappingURL=PointerTracker.js.map