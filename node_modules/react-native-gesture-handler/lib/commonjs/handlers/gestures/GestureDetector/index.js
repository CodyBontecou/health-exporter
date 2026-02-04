"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GestureDetector = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _utils = require("../../../utils");

var _GestureHandlerRootViewContext = _interopRequireDefault(require("../../../GestureHandlerRootViewContext"));

var _useAnimatedGesture = require("./useAnimatedGesture");

var _attachHandlers = require("./attachHandlers");

var _needsToReattach = require("./needsToReattach");

var _dropHandlers = require("./dropHandlers");

var _utils2 = require("./utils");

var _Wrap = require("./Wrap");

var _useDetectorUpdater = require("./useDetectorUpdater");

var _useViewRefHandler = require("./useViewRefHandler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable react/no-unused-prop-types */
function propagateDetectorConfig(props, gesture) {
  const keysToPropagate = ['userSelect', 'enableContextMenu', 'touchAction'];

  for (const key of keysToPropagate) {
    const value = props[key];

    if (value === undefined) {
      continue;
    }

    for (const g of gesture.toGestureArray()) {
      const config = g.config;
      config[key] = value;
    }
  }
}

/**
 * `GestureDetector` is responsible for creating and updating native gesture handlers based on the config of provided gesture.
 *
 * ### Props
 * - `gesture`
 * - `userSelect` (**Web only**)
 * - `enableContextMenu` (**Web only**)
 * - `touchAction` (**Web only**)
 *
 * ### Remarks
 * - Gesture Detector will use first native view in its subtree to recognize gestures, however if this view is used only to group its children it may get automatically collapsed.
 * - Using the same instance of a gesture across multiple Gesture Detectors is not possible.
 *
 * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/gesture-detector
 */
const GestureDetector = props => {
  const rootViewContext = (0, _react.useContext)(_GestureHandlerRootViewContext.default);

  if (__DEV__ && !rootViewContext && !(0, _utils.isJestEnv)() && _reactNative.Platform.OS !== 'web') {
    throw new Error('GestureDetector must be used as a descendant of GestureHandlerRootView. Otherwise the gestures will not be recognized. See https://docs.swmansion.com/react-native-gesture-handler/docs/installation for more details.');
  } // Gesture config should be wrapped with useMemo to prevent unnecessary re-renders


  const gestureConfig = props.gesture;
  propagateDetectorConfig(props, gestureConfig);
  const gesturesToAttach = (0, _react.useMemo)(() => gestureConfig.toGestureArray(), [gestureConfig]);
  const shouldUseReanimated = gesturesToAttach.some(g => g.shouldUseReanimated);
  const webEventHandlersRef = (0, _utils2.useWebEventHandlers)(); // Store state in ref to prevent unnecessary renders

  const state = (0, _react.useRef)({
    firstRender: true,
    viewRef: null,
    previousViewTag: -1,
    forceRebuildReanimatedEvent: false
  }).current;

  const preparedGesture = _react.default.useRef({
    attachedGestures: [],
    animatedEventHandler: null,
    animatedHandlers: null,
    shouldUseReanimated: shouldUseReanimated,
    isMounted: false
  }).current;

  const updateAttachedGestures = (0, _useDetectorUpdater.useDetectorUpdater)(state, preparedGesture, gesturesToAttach, gestureConfig, webEventHandlersRef);
  const refHandler = (0, _useViewRefHandler.useViewRefHandler)(state, updateAttachedGestures); // Reanimated event should be rebuilt only when gestures are reattached, otherwise
  // config update will be enough as all necessary items are stored in shared values anyway

  const needsToRebuildReanimatedEvent = state.firstRender || state.forceRebuildReanimatedEvent || (0, _needsToReattach.needsToReattach)(preparedGesture, gesturesToAttach);
  state.forceRebuildReanimatedEvent = false;
  (0, _useAnimatedGesture.useAnimatedGesture)(preparedGesture, needsToRebuildReanimatedEvent);
  (0, _react.useLayoutEffect)(() => {
    const viewTag = (0, _reactNative.findNodeHandle)(state.viewRef);
    preparedGesture.isMounted = true;
    (0, _attachHandlers.attachHandlers)({
      preparedGesture,
      gestureConfig,
      gesturesToAttach,
      webEventHandlersRef,
      viewTag
    });
    return () => {
      preparedGesture.isMounted = false;
      (0, _dropHandlers.dropHandlers)(preparedGesture);
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (state.firstRender) {
      state.firstRender = false;
    } else {
      updateAttachedGestures();
    }
  }, [props]);

  if (shouldUseReanimated) {
    return /*#__PURE__*/_react.default.createElement(_Wrap.AnimatedWrap, {
      ref: refHandler,
      onGestureHandlerEvent: preparedGesture.animatedEventHandler
    }, props.children);
  } else {
    return /*#__PURE__*/_react.default.createElement(_Wrap.Wrap, {
      ref: refHandler
    }, props.children);
  }
};

exports.GestureDetector = GestureDetector;
//# sourceMappingURL=index.js.map