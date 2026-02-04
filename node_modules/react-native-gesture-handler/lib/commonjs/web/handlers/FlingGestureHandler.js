"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = require("../../State");

var _Directions = require("../../Directions");

var _GestureHandler = _interopRequireDefault(require("./GestureHandler"));

var _Vector = _interopRequireDefault(require("../tools/Vector"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_MAX_DURATION_MS = 800;
const DEFAULT_MIN_VELOCITY = 700;
const DEFAULT_ALIGNMENT_CONE = 30;
const DEFAULT_DIRECTION = _Directions.Directions.RIGHT;
const DEFAULT_NUMBER_OF_TOUCHES_REQUIRED = 1;
const AXIAL_DEVIATION_COSINE = (0, _utils.coneToDeviation)(DEFAULT_ALIGNMENT_CONE);
const DIAGONAL_DEVIATION_COSINE = (0, _utils.coneToDeviation)(90 - DEFAULT_ALIGNMENT_CONE);

class FlingGestureHandler extends _GestureHandler.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "numberOfPointersRequired", DEFAULT_NUMBER_OF_TOUCHES_REQUIRED);

    _defineProperty(this, "direction", DEFAULT_DIRECTION);

    _defineProperty(this, "maxDurationMs", DEFAULT_MAX_DURATION_MS);

    _defineProperty(this, "minVelocity", DEFAULT_MIN_VELOCITY);

    _defineProperty(this, "delayTimeout", void 0);

    _defineProperty(this, "maxNumberOfPointersSimultaneously", 0);

    _defineProperty(this, "keyPointer", NaN);
  }

  init(ref, propsRef) {
    super.init(ref, propsRef);
  }

  updateGestureConfig({
    enabled = true,
    ...props
  }) {
    super.updateGestureConfig({
      enabled: enabled,
      ...props
    });

    if (this.config.direction) {
      this.direction = this.config.direction;
    }

    if (this.config.numberOfPointers) {
      this.numberOfPointersRequired = this.config.numberOfPointers;
    }
  }

  startFling() {
    this.begin();
    this.maxNumberOfPointersSimultaneously = 1;
    this.delayTimeout = setTimeout(() => this.fail(), this.maxDurationMs);
  }

  tryEndFling() {
    const velocityVector = _Vector.default.fromVelocity(this.tracker, this.keyPointer);

    const getAlignment = (direction, minimalAlignmentCosine) => {
      return (direction & this.direction) === direction && velocityVector.isSimilar(_Vector.default.fromDirection(direction), minimalAlignmentCosine);
    };

    const axialDirectionsList = Object.values(_Directions.Directions);
    const diagonalDirectionsList = Object.values(_Directions.DiagonalDirections); // List of alignments to all activated directions

    const axialAlignmentList = axialDirectionsList.map(direction => getAlignment(direction, AXIAL_DEVIATION_COSINE));
    const diagonalAlignmentList = diagonalDirectionsList.map(direction => getAlignment(direction, DIAGONAL_DEVIATION_COSINE));
    const isAligned = axialAlignmentList.some(Boolean) || diagonalAlignmentList.some(Boolean);
    const isFast = velocityVector.magnitude > this.minVelocity;

    if (this.maxNumberOfPointersSimultaneously === this.numberOfPointersRequired && isAligned && isFast) {
      clearTimeout(this.delayTimeout);
      this.activate();
      return true;
    }

    return false;
  }

  endFling() {
    if (!this.tryEndFling()) {
      this.fail();
    }
  }

  onPointerDown(event) {
    if (!this.isButtonInConfig(event.button)) {
      return;
    }

    this.tracker.addToTracker(event);
    this.keyPointer = event.pointerId;
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
    if (this.currentState === _State.State.UNDETERMINED) {
      this.startFling();
    }

    if (this.currentState !== _State.State.BEGAN) {
      return;
    }

    this.tryEndFling();

    if (this.tracker.getTrackedPointersCount() > this.maxNumberOfPointersSimultaneously) {
      this.maxNumberOfPointersSimultaneously = this.tracker.getTrackedPointersCount();
    }
  }

  pointerMoveAction(event) {
    this.tracker.track(event);

    if (this.currentState !== _State.State.BEGAN) {
      return;
    }

    this.tryEndFling();
  }

  onPointerMove(event) {
    this.pointerMoveAction(event);
    super.onPointerMove(event);
  }

  onPointerOutOfBounds(event) {
    this.pointerMoveAction(event);
    super.onPointerOutOfBounds(event);
  }

  onPointerUp(event) {
    super.onPointerUp(event);
    this.onUp(event);
    this.keyPointer = NaN;
  }

  onPointerRemove(event) {
    super.onPointerRemove(event);
    this.onUp(event);
  }

  onUp(event) {
    if (this.currentState === _State.State.BEGAN) {
      this.endFling();
    }

    this.tracker.removeFromTracker(event.pointerId);
  }

  activate(force) {
    super.activate(force);
    this.end();
  }

  resetConfig() {
    super.resetConfig();
    this.numberOfPointersRequired = DEFAULT_NUMBER_OF_TOUCHES_REQUIRED;
    this.direction = DEFAULT_DIRECTION;
  }

}

exports.default = FlingGestureHandler;
//# sourceMappingURL=FlingGestureHandler.js.map