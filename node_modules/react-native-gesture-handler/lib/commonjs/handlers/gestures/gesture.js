"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContinousBaseGesture = exports.BaseGesture = exports.Gesture = exports.CALLBACK_TYPE = void 0;

var _getNextHandlerTag = require("../getNextHandlerTag");

var _utils = require("../../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const CALLBACK_TYPE = {
  UNDEFINED: 0,
  BEGAN: 1,
  START: 2,
  UPDATE: 3,
  CHANGE: 4,
  END: 5,
  FINALIZE: 6,
  TOUCHES_DOWN: 7,
  TOUCHES_MOVE: 8,
  TOUCHES_UP: 9,
  TOUCHES_CANCELLED: 10
}; // Allow using CALLBACK_TYPE as object and type
// eslint-disable-next-line @typescript-eslint/no-redeclare

exports.CALLBACK_TYPE = CALLBACK_TYPE;

class Gesture {}

exports.Gesture = Gesture;
let nextGestureId = 0;

class BaseGesture extends Gesture {
  constructor() {
    super(); // Used to check whether the gesture config has been updated when wrapping it
    // with `useMemo`. Since every config will have a unique id, when the dependencies
    // don't change, the config won't be recreated and the id will stay the same.
    // If the id is different, it means that the config has changed and the gesture
    // needs to be updated.

    _defineProperty(this, "gestureId", -1);

    _defineProperty(this, "handlerTag", -1);

    _defineProperty(this, "handlerName", '');

    _defineProperty(this, "config", {});

    _defineProperty(this, "handlers", {
      gestureId: -1,
      handlerTag: -1,
      isWorklet: []
    });

    this.gestureId = nextGestureId++;
    this.handlers.gestureId = this.gestureId;
  }

  addDependency(key, gesture) {
    const value = this.config[key];
    this.config[key] = value ? Array().concat(value, gesture) : [gesture];
  }
  /**
   * Sets a `ref` to the gesture object, allowing for interoperability with the old API.
   * @param ref
   */


  withRef(ref) {
    this.config.ref = ref;
    return this;
  } // eslint-disable-next-line @typescript-eslint/ban-types


  isWorklet(callback) {
    // @ts-ignore if callback is a worklet, the property will be available, if not then the check will return false
    return callback.__workletHash !== undefined;
  }
  /**
   * Set the callback that is being called when given gesture handler starts receiving touches.
   * At the moment of this callback the handler is in `BEGAN` state and we don't know yet if it will recognize the gesture at all.
   * @param callback
   */


  onBegin(callback) {
    this.handlers.onBegin = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.BEGAN] = this.isWorklet(callback);
    return this;
  }
  /**
   * Set the callback that is being called when the gesture is recognized by the handler and it transitions to the `ACTIVE` state.
   * @param callback
   */


  onStart(callback) {
    this.handlers.onStart = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.START] = this.isWorklet(callback);
    return this;
  }
  /**
   * Set the callback that is being called when the gesture that was recognized by the handler finishes and handler reaches `END` state.
   * It will be called only if the handler was previously in the `ACTIVE` state.
   * @param callback
   */


  onEnd(callback) {
    this.handlers.onEnd = callback; // @ts-ignore if callback is a worklet, the property will be available, if not then the check will return false

    this.handlers.isWorklet[CALLBACK_TYPE.END] = this.isWorklet(callback);
    return this;
  }
  /**
   * Set the callback that is being called when the handler finalizes handling gesture - the gesture was recognized and has finished or it failed to recognize.
   * @param callback
   */


  onFinalize(callback) {
    this.handlers.onFinalize = callback; // @ts-ignore if callback is a worklet, the property will be available, if not then the check will return false

    this.handlers.isWorklet[CALLBACK_TYPE.FINALIZE] = this.isWorklet(callback);
    return this;
  }
  /**
   * Set the `onTouchesDown` callback which is called every time a pointer is placed on the screen.
   * @param callback
   */


  onTouchesDown(callback) {
    this.config.needsPointerData = true;
    this.handlers.onTouchesDown = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.TOUCHES_DOWN] = this.isWorklet(callback);
    return this;
  }
  /**
   * Set the `onTouchesMove` callback which is called every time a pointer is moved on the screen.
   * @param callback
   */


  onTouchesMove(callback) {
    this.config.needsPointerData = true;
    this.handlers.onTouchesMove = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.TOUCHES_MOVE] = this.isWorklet(callback);
    return this;
  }
  /**
   * Set the `onTouchesUp` callback which is called every time a pointer is lifted from the screen.
   * @param callback
   */


  onTouchesUp(callback) {
    this.config.needsPointerData = true;
    this.handlers.onTouchesUp = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.TOUCHES_UP] = this.isWorklet(callback);
    return this;
  }
  /**
   * Set the `onTouchesCancelled` callback which is called every time a pointer stops being tracked, for example when the gesture finishes.
   * @param callback
   */


  onTouchesCancelled(callback) {
    this.config.needsPointerData = true;
    this.handlers.onTouchesCancelled = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.TOUCHES_CANCELLED] = this.isWorklet(callback);
    return this;
  }
  /**
   * Indicates whether the given handler should be analyzing stream of touch events or not.
   * @param enabled
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#enabledvalue-boolean
   */


  enabled(enabled) {
    this.config.enabled = enabled;
    return this;
  }
  /**
   * When true the handler will cancel or fail recognition (depending on its current state) whenever the finger leaves the area of the connected view.
   * @param value
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#shouldcancelwhenoutsidevalue-boolean
   */


  shouldCancelWhenOutside(value) {
    this.config.shouldCancelWhenOutside = value;
    return this;
  }
  /**
   * This parameter enables control over what part of the connected view area can be used to begin recognizing the gesture.
   * When a negative number is provided the bounds of the view will reduce the area by the given number of points in each of the sides evenly.
   * @param hitSlop
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#hitslopsettings
   */


  hitSlop(hitSlop) {
    this.config.hitSlop = hitSlop;
    return this;
  }
  /**
   * #### Web only
   * This parameter allows to specify which `cursor` should be used when gesture activates.
   * Supports all CSS cursor values (e.g. `"grab"`, `"zoom-in"`). Default value is set to `"auto"`.
   * @param activeCursor
   */


  activeCursor(activeCursor) {
    this.config.activeCursor = activeCursor;
    return this;
  }
  /**
   * #### Web & Android only
   * Allows users to choose which mouse button should handler respond to.
   * Arguments can be combined using `|` operator, e.g. `mouseButton(MouseButton.LEFT | MouseButton.RIGHT)`.
   * Default value is set to `MouseButton.LEFT`.
   * @param mouseButton
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#mousebuttonvalue-mousebutton-web--android-only
   */


  mouseButton(mouseButton) {
    this.config.mouseButton = mouseButton;
    return this;
  }
  /**
   * When `react-native-reanimated` is installed, the callbacks passed to the gestures are automatically workletized and run on the UI thread when called.
   * This option allows for changing this behavior: when `true`, all the callbacks will be run on the JS thread instead of the UI thread, regardless of whether they are worklets or not.
   * Defaults to `false`.
   * @param runOnJS
   */


  runOnJS(runOnJS) {
    this.config.runOnJS = runOnJS;
    return this;
  }
  /**
   * Allows gestures across different components to be recognized simultaneously.
   * @param gestures
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/gesture-composition/#simultaneouswithexternalgesture
   */


  simultaneousWithExternalGesture(...gestures) {
    for (const gesture of gestures) {
      this.addDependency('simultaneousWith', gesture);
    }

    return this;
  }
  /**
   * Allows to delay activation of the handler until all handlers passed as arguments to this method fail (or don't begin at all).
   * @param gestures
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/gesture-composition/#requireexternalgesturetofail
   */


  requireExternalGestureToFail(...gestures) {
    for (const gesture of gestures) {
      this.addDependency('requireToFail', gesture);
    }

    return this;
  }
  /**
   * Works similarily to `requireExternalGestureToFail` but the direction of the relation is reversed - instead of being one-to-many relation, it's many-to-one.
   * @param gestures
   * @see https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/gesture-composition/#blocksexternalgesture
   */


  blocksExternalGesture(...gestures) {
    for (const gesture of gestures) {
      this.addDependency('blocksHandlers', gesture);
    }

    return this;
  }
  /**
   * Sets a `testID` property for gesture object, allowing for querying for it in tests.
   * @param id
   */


  withTestId(id) {
    this.config.testId = id;
    return this;
  }
  /**
   * #### iOS only
   * When `true`, the handler will cancel touches for native UI components (`UIButton`, `UISwitch`, etc) it's attached to when it becomes `ACTIVE`.
   * Default value is `true`.
   * @param value
   */


  cancelsTouchesInView(value) {
    this.config.cancelsTouchesInView = value;
    return this;
  }

  initialize() {
    this.handlerTag = (0, _getNextHandlerTag.getNextHandlerTag)();
    this.handlers = { ...this.handlers,
      handlerTag: this.handlerTag
    };

    if (this.config.ref) {
      this.config.ref.current = this;
    }
  }

  toGestureArray() {
    return [this];
  } // eslint-disable-next-line @typescript-eslint/no-empty-function


  prepare() {}

  get shouldUseReanimated() {
    // Use Reanimated when runOnJS isn't set explicitly,
    // all defined callbacks are worklets
    // and remote debugging is disabled
    return this.config.runOnJS !== true && !this.handlers.isWorklet.includes(false) && !(0, _utils.isRemoteDebuggingEnabled)();
  }

}

exports.BaseGesture = BaseGesture;

class ContinousBaseGesture extends BaseGesture {
  /**
   * Set the callback that is being called every time the gesture receives an update while it's active.
   * @param callback
   */
  onUpdate(callback) {
    this.handlers.onUpdate = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.UPDATE] = this.isWorklet(callback);
    return this;
  }
  /**
   * Set the callback that is being called every time the gesture receives an update while it's active.
   * This callback will receive information about change in value in relation to the last received event.
   * @param callback
   */


  onChange(callback) {
    this.handlers.onChange = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.CHANGE] = this.isWorklet(callback);
    return this;
  }
  /**
   * When `true` the handler will not activate by itself even if its activation criteria are met.
   * Instead you can manipulate its state using state manager.
   * @param manualActivation
   */


  manualActivation(manualActivation) {
    this.config.manualActivation = manualActivation;
    return this;
  }

}

exports.ContinousBaseGesture = ContinousBaseGesture;
//# sourceMappingURL=gesture.js.map