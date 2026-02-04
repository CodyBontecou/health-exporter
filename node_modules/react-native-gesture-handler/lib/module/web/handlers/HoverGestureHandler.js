function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { State } from '../../State';
import GestureHandlerOrchestrator from '../tools/GestureHandlerOrchestrator';
import GestureHandler from './GestureHandler';
export default class HoverGestureHandler extends GestureHandler {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "stylusData", void 0);
  }

  init(ref, propsRef) {
    super.init(ref, propsRef);
  }

  transformNativeEvent() {
    return { ...super.transformNativeEvent(),
      stylusData: this.stylusData
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
  }

  onPointerMoveOver(event) {
    GestureHandlerOrchestrator.getInstance().recordHandlerIfNotPresent(this);
    this.tracker.addToTracker(event);
    this.stylusData = event.stylusData;
    super.onPointerMoveOver(event);

    if (this.getState() === State.UNDETERMINED) {
      this.begin();
      this.activate();
    }
  }

  onPointerMoveOut(event) {
    this.tracker.removeFromTracker(event.pointerId);
    this.stylusData = event.stylusData;
    super.onPointerMoveOut(event);
    this.end();
  }

  onPointerMove(event) {
    this.tracker.track(event);
    this.stylusData = event.stylusData;
    super.onPointerMove(event);
  }

  onPointerCancel(event) {
    super.onPointerCancel(event);
    this.reset();
  }

}
//# sourceMappingURL=HoverGestureHandler.js.map