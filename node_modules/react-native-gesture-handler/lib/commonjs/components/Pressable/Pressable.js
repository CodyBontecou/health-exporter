"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Pressable;

var _react = _interopRequireWildcard(require("react"));

var _gestureObjects = require("../../handlers/gestures/gestureObjects");

var _GestureDetector = require("../../handlers/gestures/GestureDetector");

var _reactNative = require("react-native");

var _GestureHandlerButton = _interopRequireDefault(require("../GestureHandlerButton"));

var _utils = require("./utils");

var _PressabilityDebugView = require("../../handlers/PressabilityDebugView");

var _utils2 = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const DEFAULT_LONG_PRESS_DURATION = 500;

function Pressable(props) {
  var _android_ripple$color, _android_ripple$radiu;

  const {
    testOnly_pressed,
    hitSlop,
    pressRetentionOffset,
    delayHoverIn,
    onHoverIn,
    delayHoverOut,
    onHoverOut,
    delayLongPress,
    unstable_pressDelay,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    style,
    children,
    android_disableSound,
    android_ripple,
    disabled,
    ...remainingProps
  } = props;
  const [pressedState, setPressedState] = (0, _react.useState)(testOnly_pressed !== null && testOnly_pressed !== void 0 ? testOnly_pressed : false);
  const pressableRef = (0, _react.useRef)(null); // Disabled when onLongPress has been called

  const isPressCallbackEnabled = (0, _react.useRef)(true);
  const hasPassedBoundsChecks = (0, _react.useRef)(false);
  const shouldPreventNativeEffects = (0, _react.useRef)(false);
  const normalizedHitSlop = (0, _react.useMemo)(() => typeof hitSlop === 'number' ? (0, _utils.numberAsInset)(hitSlop) : hitSlop !== null && hitSlop !== void 0 ? hitSlop : {}, [hitSlop]);
  const normalizedPressRetentionOffset = (0, _react.useMemo)(() => typeof pressRetentionOffset === 'number' ? (0, _utils.numberAsInset)(pressRetentionOffset) : pressRetentionOffset !== null && pressRetentionOffset !== void 0 ? pressRetentionOffset : {}, [pressRetentionOffset]);
  const hoverInTimeout = (0, _react.useRef)(null);
  const hoverOutTimeout = (0, _react.useRef)(null);
  const hoverGesture = (0, _react.useMemo)(() => _gestureObjects.GestureObjects.Hover().manualActivation(true) // Stops Hover from blocking Native gesture activation on web
  .cancelsTouchesInView(false).onBegin(event => {
    if (hoverOutTimeout.current) {
      clearTimeout(hoverOutTimeout.current);
    }

    if (delayHoverIn) {
      hoverInTimeout.current = setTimeout(() => onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn((0, _utils.gestureToPressableEvent)(event)), delayHoverIn);
      return;
    }

    onHoverIn === null || onHoverIn === void 0 ? void 0 : onHoverIn((0, _utils.gestureToPressableEvent)(event));
  }).onFinalize(event => {
    if (hoverInTimeout.current) {
      clearTimeout(hoverInTimeout.current);
    }

    if (delayHoverOut) {
      hoverOutTimeout.current = setTimeout(() => onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut((0, _utils.gestureToPressableEvent)(event)), delayHoverOut);
      return;
    }

    onHoverOut === null || onHoverOut === void 0 ? void 0 : onHoverOut((0, _utils.gestureToPressableEvent)(event));
  }), [delayHoverIn, delayHoverOut, onHoverIn, onHoverOut]);
  const pressDelayTimeoutRef = (0, _react.useRef)(null);
  const isTouchPropagationAllowed = (0, _react.useRef)(false); // iOS only: due to varying flow of gestures, events sometimes have to be saved for later use

  const deferredEventPayload = (0, _react.useRef)(null);
  const pressInHandler = (0, _react.useCallback)(event => {
    if (handlingOnTouchesDown.current) {
      deferredEventPayload.current = event;
    }

    if (!isTouchPropagationAllowed.current) {
      return;
    }

    deferredEventPayload.current = null;
    onPressIn === null || onPressIn === void 0 ? void 0 : onPressIn(event);
    isPressCallbackEnabled.current = true;
    pressDelayTimeoutRef.current = null;
    setPressedState(true);
  }, [onPressIn]);
  const pressOutHandler = (0, _react.useCallback)(event => {
    if (!hasPassedBoundsChecks.current || event.nativeEvent.touches.length > event.nativeEvent.changedTouches.length) {
      return;
    }

    if (unstable_pressDelay && pressDelayTimeoutRef.current !== null) {
      // When delay is preemptively finished by lifting touches,
      // we want to immediately activate it's effects - pressInHandler,
      // even though we are located at the pressOutHandler
      clearTimeout(pressDelayTimeoutRef.current);
      pressInHandler(event);
    }

    if (deferredEventPayload.current) {
      onPressIn === null || onPressIn === void 0 ? void 0 : onPressIn(deferredEventPayload.current);
      deferredEventPayload.current = null;
    }

    onPressOut === null || onPressOut === void 0 ? void 0 : onPressOut(event);

    if (isPressCallbackEnabled.current) {
      onPress === null || onPress === void 0 ? void 0 : onPress(event);
    }

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    isTouchPropagationAllowed.current = false;
    hasPassedBoundsChecks.current = false;
    isPressCallbackEnabled.current = true;
    setPressedState(false);
  }, [onPress, onPressIn, onPressOut, pressInHandler, unstable_pressDelay]);
  const handlingOnTouchesDown = (0, _react.useRef)(false);
  const onEndHandlingTouchesDown = (0, _react.useRef)(null);
  const cancelledMidPress = (0, _react.useRef)(false);
  const activateLongPress = (0, _react.useCallback)(event => {
    if (!isTouchPropagationAllowed.current) {
      return;
    }

    if (hasPassedBoundsChecks.current) {
      onLongPress === null || onLongPress === void 0 ? void 0 : onLongPress((0, _utils.gestureTouchToPressableEvent)(event));
      isPressCallbackEnabled.current = false;
    }

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, [onLongPress]);
  const longPressTimeoutRef = (0, _react.useRef)(null);
  const longPressMinDuration = (delayLongPress !== null && delayLongPress !== void 0 ? delayLongPress : DEFAULT_LONG_PRESS_DURATION) + (unstable_pressDelay !== null && unstable_pressDelay !== void 0 ? unstable_pressDelay : 0);
  const pressAndTouchGesture = (0, _react.useMemo)(() => _gestureObjects.GestureObjects.LongPress().minDuration(_utils2.INT32_MAX) // Stops long press from blocking native gesture
  .maxDistance(_utils2.INT32_MAX) // Stops long press from cancelling after set distance
  .cancelsTouchesInView(false).onTouchesDown(event => {
    var _pressableRef$current;

    handlingOnTouchesDown.current = true;
    (_pressableRef$current = pressableRef.current) === null || _pressableRef$current === void 0 ? void 0 : _pressableRef$current.measure((_x, _y, width, height) => {
      var _onEndHandlingTouches;

      if (!(0, _utils.isTouchWithinInset)({
        width,
        height
      }, normalizedHitSlop, event.changedTouches.at(-1)) || hasPassedBoundsChecks.current || cancelledMidPress.current) {
        cancelledMidPress.current = false;
        onEndHandlingTouchesDown.current = null;
        handlingOnTouchesDown.current = false;
        return;
      }

      hasPassedBoundsChecks.current = true; // In case of multiple touches, the first one starts long press gesture

      if (longPressTimeoutRef.current === null) {
        // Start long press gesture timer
        longPressTimeoutRef.current = setTimeout(() => activateLongPress(event), longPressMinDuration);
      }

      if (unstable_pressDelay) {
        pressDelayTimeoutRef.current = setTimeout(() => {
          pressInHandler((0, _utils.gestureTouchToPressableEvent)(event));
        }, unstable_pressDelay);
      } else {
        pressInHandler((0, _utils.gestureTouchToPressableEvent)(event));
      }

      (_onEndHandlingTouches = onEndHandlingTouchesDown.current) === null || _onEndHandlingTouches === void 0 ? void 0 : _onEndHandlingTouches.call(onEndHandlingTouchesDown);
      onEndHandlingTouchesDown.current = null;
      handlingOnTouchesDown.current = false;
    });
  }).onTouchesUp(event => {
    if (handlingOnTouchesDown.current) {
      onEndHandlingTouchesDown.current = () => pressOutHandler((0, _utils.gestureTouchToPressableEvent)(event));

      return;
    } // On iOS, short taps will make LongPress gesture call onTouchesUp before Native gesture calls onStart
    // This variable ensures that onStart isn't detected as the first gesture since Pressable is pressed.


    if (deferredEventPayload.current !== null) {
      shouldPreventNativeEffects.current = true;
    }

    pressOutHandler((0, _utils.gestureTouchToPressableEvent)(event));
  }).onTouchesCancelled(event => {
    isPressCallbackEnabled.current = false;

    if (handlingOnTouchesDown.current) {
      cancelledMidPress.current = true;

      onEndHandlingTouchesDown.current = () => pressOutHandler((0, _utils.gestureTouchToPressableEvent)(event));

      return;
    }

    if (!hasPassedBoundsChecks.current || event.allTouches.length > event.changedTouches.length) {
      return;
    }

    pressOutHandler((0, _utils.gestureTouchToPressableEvent)(event));
  }), [activateLongPress, longPressMinDuration, normalizedHitSlop, pressInHandler, pressOutHandler, unstable_pressDelay]); // RNButton is placed inside ButtonGesture to enable Android's ripple and to capture non-propagating events

  const buttonGesture = (0, _react.useMemo)(() => _gestureObjects.GestureObjects.Native().onBegin(() => {
    // Android sets BEGAN state on press down
    if (_reactNative.Platform.OS === 'android') {
      isTouchPropagationAllowed.current = true;
    }
  }).onStart(() => {
    if (_reactNative.Platform.OS === 'web') {
      isTouchPropagationAllowed.current = true;
    } // iOS sets ACTIVE state on press down


    if (_reactNative.Platform.OS !== 'ios') {
      return;
    }

    if (deferredEventPayload.current) {
      isTouchPropagationAllowed.current = true;

      if (hasPassedBoundsChecks.current) {
        pressInHandler(deferredEventPayload.current);
        deferredEventPayload.current = null;
      } else {
        pressOutHandler(deferredEventPayload.current);
        isTouchPropagationAllowed.current = false;
      }

      return;
    }

    if (hasPassedBoundsChecks.current) {
      isTouchPropagationAllowed.current = true;
      return;
    }

    if (shouldPreventNativeEffects.current) {
      shouldPreventNativeEffects.current = false;
      return;
    }

    isTouchPropagationAllowed.current = true;
  }), [pressInHandler, pressOutHandler]);
  const appliedHitSlop = (0, _utils.addInsets)(normalizedHitSlop, normalizedPressRetentionOffset);
  const isPressableEnabled = disabled !== true;
  const gestures = [pressAndTouchGesture, hoverGesture, buttonGesture];

  for (const gesture of gestures) {
    gesture.enabled(isPressableEnabled);
    gesture.runOnJS(true);
    gesture.hitSlop(appliedHitSlop);
    gesture.shouldCancelWhenOutside(false);

    if (_reactNative.Platform.OS !== 'web') {
      gesture.shouldCancelWhenOutside(true);
    }
  } // Uses different hitSlop, to activate on hitSlop area instead of pressRetentionOffset area


  buttonGesture.hitSlop(normalizedHitSlop);

  const gesture = _gestureObjects.GestureObjects.Simultaneous(...gestures);

  const defaultRippleColor = android_ripple ? undefined : 'transparent'; // `cursor: 'pointer'` on `RNButton` crashes iOS

  const pointerStyle = _reactNative.Platform.OS === 'web' ? {
    cursor: 'pointer'
  } : {};
  const styleProp = typeof style === 'function' ? style({
    pressed: pressedState
  }) : style;
  const childrenProp = typeof children === 'function' ? children({
    pressed: pressedState
  }) : children;
  return /*#__PURE__*/_react.default.createElement(_GestureDetector.GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/_react.default.createElement(_GestureHandlerButton.default, _extends({}, remainingProps, {
    ref: pressableRef,
    hitSlop: appliedHitSlop,
    enabled: isPressableEnabled,
    touchSoundDisabled: android_disableSound !== null && android_disableSound !== void 0 ? android_disableSound : undefined,
    rippleColor: (0, _reactNative.processColor)((_android_ripple$color = android_ripple === null || android_ripple === void 0 ? void 0 : android_ripple.color) !== null && _android_ripple$color !== void 0 ? _android_ripple$color : defaultRippleColor),
    rippleRadius: (_android_ripple$radiu = android_ripple === null || android_ripple === void 0 ? void 0 : android_ripple.radius) !== null && _android_ripple$radiu !== void 0 ? _android_ripple$radiu : undefined,
    style: [pointerStyle, styleProp]
  }), childrenProp, __DEV__ ? /*#__PURE__*/_react.default.createElement(_PressabilityDebugView.PressabilityDebugView, {
    color: "red",
    hitSlop: normalizedHitSlop
  }) : null));
}
//# sourceMappingURL=Pressable.js.map