function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { ContinousBaseGesture } from './gesture';
export let HoverEffect;

(function (HoverEffect) {
  HoverEffect[HoverEffect["NONE"] = 0] = "NONE";
  HoverEffect[HoverEffect["LIFT"] = 1] = "LIFT";
  HoverEffect[HoverEffect["HIGHLIGHT"] = 2] = "HIGHLIGHT";
})(HoverEffect || (HoverEffect = {}));

export const hoverGestureHandlerProps = ['hoverEffect'];

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

export class HoverGesture extends ContinousBaseGesture {
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
//# sourceMappingURL=hoverGesture.js.map