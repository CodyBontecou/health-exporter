"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Directions = require("../../Directions");

var _constants = require("../constants");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Vector {
  constructor(x, y) {
    _defineProperty(this, "x", void 0);

    _defineProperty(this, "y", void 0);

    _defineProperty(this, "unitX", void 0);

    _defineProperty(this, "unitY", void 0);

    _defineProperty(this, "_magnitude", void 0);

    this.x = x;
    this.y = y;
    this._magnitude = Math.hypot(this.x, this.y);
    const isMagnitudeSufficient = this._magnitude > _constants.MINIMAL_RECOGNIZABLE_MAGNITUDE;
    this.unitX = isMagnitudeSufficient ? this.x / this._magnitude : 0;
    this.unitY = isMagnitudeSufficient ? this.y / this._magnitude : 0;
  }

  static fromDirection(direction) {
    var _DirectionToVectorMap;

    return (_DirectionToVectorMap = DirectionToVectorMappings.get(direction)) !== null && _DirectionToVectorMap !== void 0 ? _DirectionToVectorMap : new Vector(0, 0);
  }

  static fromVelocity(tracker, pointerId) {
    const velocity = tracker.getVelocity(pointerId);
    return new Vector(velocity.x, velocity.y);
  }

  get magnitude() {
    return this._magnitude;
  }

  computeSimilarity(vector) {
    return this.unitX * vector.unitX + this.unitY * vector.unitY;
  }

  isSimilar(vector, threshold) {
    return this.computeSimilarity(vector) > threshold;
  }

}

exports.default = Vector;
const DirectionToVectorMappings = new Map([[_Directions.Directions.LEFT, new Vector(-1, 0)], [_Directions.Directions.RIGHT, new Vector(1, 0)], [_Directions.Directions.UP, new Vector(0, -1)], [_Directions.Directions.DOWN, new Vector(0, 1)], [_Directions.DiagonalDirections.UP_RIGHT, new Vector(1, -1)], [_Directions.DiagonalDirections.DOWN_RIGHT, new Vector(1, 1)], [_Directions.DiagonalDirections.UP_LEFT, new Vector(-1, -1)], [_Directions.DiagonalDirections.DOWN_LEFT, new Vector(-1, 1)]]);
//# sourceMappingURL=Vector.js.map