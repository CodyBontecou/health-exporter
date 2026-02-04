import GestureHandler from './GestureHandler';
export default class ManualGestureHandler extends GestureHandler {
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
  }

  onPointerDown(event) {
    this.tracker.addToTracker(event);
    super.onPointerDown(event);
    this.begin();
    this.tryToSendTouchEvent(event);
  }

  onPointerAdd(event) {
    this.tracker.addToTracker(event);
    super.onPointerAdd(event);
  }

  onPointerMove(event) {
    this.tracker.track(event);
    super.onPointerMove(event);
  }

  onPointerOutOfBounds(event) {
    this.tracker.track(event);
    super.onPointerOutOfBounds(event);
  }

  onPointerUp(event) {
    super.onPointerUp(event);
    this.tracker.removeFromTracker(event.pointerId);
  }

  onPointerRemove(event) {
    super.onPointerRemove(event);
    this.tracker.removeFromTracker(event.pointerId);
  }

}
//# sourceMappingURL=ManualGestureHandler.js.map