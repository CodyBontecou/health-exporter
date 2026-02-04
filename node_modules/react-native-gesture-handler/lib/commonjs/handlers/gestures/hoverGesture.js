"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HoverGesture = exports.hoverGestureHandlerProps = exports.HoverEffect = void 0;

var _gesture = require("./gesture");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let HoverEffect;
exports.HoverEffect = HoverEffect;

(function (HoverEffect) {
  HoverEffect[HoverEffect["NONE"] = 0] = "NONE";
  HoverEffect[HoverEffect["LIFT"] = 1] = "LIFT";
  HoverEffect[HoverEffect["HIGHLIGHT"] = 2] = "HIGHLIGHT";
})(HoverEffect || (exports.HoverEffect = HoverEffect = {}));

const hoverGestureHandlerProps = ['hoverEffect'];
exports.hoverGestureHandlerProps = hoverGestureHandlerProps;

function changeEventCalculator(current, previous) {
  'worklet';

  let changePayload;

  if (previous === undefined) {
    changePayload = {
      changeX: current.x,
      changeY: current.y
    };
  } else {
    changePayload = {
      changeX: current.x - previous.x,
      changeY: current.y - previous.y
    };
  }

  return { ...current,
    ...changePayload
  };
}

class HoverGesture extends _gesture.ContinousBaseGesture {
  constructor() {
    super();

    _defineProperty(this, "config", {});

    this.handlerName = 'HoverGestureHandler';
  }
  /**
   * #### iOS only
   * Sets the visual hover effect.
   */


  effect(effect) {
    this.config.hoverEffect = effect;
    return this;
  }

  onChange(callback) {
    // @ts-ignore TS being overprotective, HoverGestureHandlerEventPayload is Record
    this.handlers.changeEventCalculator = changeEventCalculator;
    return super.onChange(callback);
  }

}

exports.HoverGesture = HoverGesture;
//# sourceMappingURL=hoverGesture.js.map