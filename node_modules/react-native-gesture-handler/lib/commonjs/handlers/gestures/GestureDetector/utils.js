"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractGestureRelations = extractGestureRelations;
exports.checkGestureCallbacksForWorklets = checkGestureCallbacksForWorklets;
exports.validateDetectorChildren = validateDetectorChildren;
exports.useForceRender = useForceRender;
exports.useWebEventHandlers = useWebEventHandlers;
exports.ALLOWED_PROPS = void 0;

var _reactNative = require("react-native");

var _utils = require("../../../utils");

var _gesture = require("../gesture");

var _FlingGestureHandler = require("../../FlingGestureHandler");

var _ForceTouchGestureHandler = require("../../ForceTouchGestureHandler");

var _LongPressGestureHandler = require("../../LongPressGestureHandler");

var _PanGestureHandler = require("../../PanGestureHandler");

var _TapGestureHandler = require("../../TapGestureHandler");

var _hoverGesture = require("../hoverGesture");

var _NativeViewGestureHandler = require("../../NativeViewGestureHandler");

var _gestureHandlerCommon = require("../../gestureHandlerCommon");

var _EnableNewWebImplementation = require("../../../EnableNewWebImplementation");

var _getReactNativeVersion = require("../../../getReactNativeVersion");

var _RNRenderer = require("../../../RNRenderer");

var _react = require("react");

var _reanimatedWrapper = require("../reanimatedWrapper");

var _eventReceiver = require("../eventReceiver");

const ALLOWED_PROPS = [..._gestureHandlerCommon.baseGestureHandlerWithDetectorProps, ..._TapGestureHandler.tapGestureHandlerProps, ..._PanGestureHandler.panGestureHandlerProps, ..._PanGestureHandler.panGestureHandlerCustomNativeProps, ..._LongPressGestureHandler.longPressGestureHandlerProps, ..._ForceTouchGestureHandler.forceTouchGestureHandlerProps, ..._FlingGestureHandler.flingGestureHandlerProps, ..._hoverGesture.hoverGestureHandlerProps, ..._NativeViewGestureHandler.nativeViewGestureHandlerProps];
exports.ALLOWED_PROPS = ALLOWED_PROPS;

function convertToHandlerTag(ref) {
  if (typeof ref === 'number') {
    return ref;
  } else if (ref instanceof _gesture.BaseGesture) {
    return ref.handlerTag;
  } else {
    var _ref$current$handlerT, _ref$current;

    // @ts-ignore in this case it should be a ref either to gesture object or
    // a gesture handler component, in both cases handlerTag property exists
    return (_ref$current$handlerT = (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.handlerTag) !== null && _ref$current$handlerT !== void 0 ? _ref$current$handlerT : -1;
  }
}

function extractValidHandlerTags(interactionGroup) {
  var _interactionGroup$map, _interactionGroup$map2;

  return (_interactionGroup$map = interactionGroup === null || interactionGroup === void 0 ? void 0 : (_interactionGroup$map2 = interactionGroup.map(convertToHandlerTag)) === null || _interactionGroup$map2 === void 0 ? void 0 : _interactionGroup$map2.filter(tag => tag > 0)) !== null && _interactionGroup$map !== void 0 ? _interactionGroup$map : [];
}

function extractGestureRelations(gesture) {
  const requireToFail = extractValidHandlerTags(gesture.config.requireToFail);
  const simultaneousWith = extractValidHandlerTags(gesture.config.simultaneousWith);
  const blocksHandlers = extractValidHandlerTags(gesture.config.blocksHandlers);
  return {
    waitFor: requireToFail,
    simultaneousHandlers: simultaneousWith,
    blocksHandlers: blocksHandlers
  };
}

function checkGestureCallbacksForWorklets(gesture) {
  if (!__DEV__) {
    return;
  } // If a gesture is explicitly marked to run on the JS thread there is no need to check
  // if callbacks are worklets as the user is aware they will be ran on the JS thread


  if (gesture.config.runOnJS) {
    return;
  }

  const areSomeNotWorklets = gesture.handlers.isWorklet.includes(false);
  const areSomeWorklets = gesture.handlers.isWorklet.includes(true); // If some of the callbacks are worklets and some are not, and the gesture is not
  // explicitly marked with `.runOnJS(true)` show an error

  if (areSomeNotWorklets && areSomeWorklets) {
    console.error((0, _utils.tagMessage)(`Some of the callbacks in the gesture are worklets and some are not. Either make sure that all calbacks are marked as 'worklet' if you wish to run them on the UI thread or use '.runOnJS(true)' modifier on the gesture explicitly to run all callbacks on the JS thread.`));
  }

  if (_reanimatedWrapper.Reanimated === undefined) {
    // If Reanimated is not available, we can't run worklets, so we shouldn't show the warning
    return;
  }

  const areAllNotWorklets = !areSomeWorklets && areSomeNotWorklets; // If none of the callbacks are worklets and the gesture is not explicitly marked with
  // `.runOnJS(true)` show a warning

  if (areAllNotWorklets && !(0, _utils.isJestEnv)()) {
    console.warn((0, _utils.tagMessage)(`None of the callbacks in the gesture are worklets. If you wish to run them on the JS thread use '.runOnJS(true)' modifier on the gesture to make this explicit. Otherwise, mark the callbacks as 'worklet' to run them on the UI thread.`));
  }
} // eslint-disable-next-line @typescript-eslint/no-explicit-any


function validateDetectorChildren(ref) {
  // Finds the first native view under the Wrap component and traverses the fiber tree upwards
  // to check whether there is more than one native view as a pseudo-direct child of GestureDetector
  // i.e. this is not ok:
  //            Wrap
  //             |
  //            / \
  //           /   \
  //          /     \
  //         /       \
  //   NativeView  NativeView
  //
  // but this is fine:
  //            Wrap
  //             |
  //         NativeView
  //             |
  //            / \
  //           /   \
  //          /     \
  //         /       \
  //   NativeView  NativeView
  if (__DEV__ && _reactNative.Platform.OS !== 'web') {
    const REACT_NATIVE_VERSION = (0, _getReactNativeVersion.getReactNativeVersion)(); // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

    const wrapType = REACT_NATIVE_VERSION.minor > 63 || REACT_NATIVE_VERSION.major > 0 ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ref._reactInternals.elementType : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ref._reactInternalFiber.elementType; // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

    let instance = _RNRenderer.RNRenderer.findHostInstance_DEPRECATED(ref)._internalFiberInstanceHandleDEV; // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access


    while (instance && instance.elementType !== wrapType) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (instance.sibling) {
        throw new Error('GestureDetector has more than one native view as its children. This can happen if you are using a custom component that renders multiple views, like React.Fragment. You should wrap content of GestureDetector with a <View> or <Animated.View>.');
      } // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access


      instance = instance.return;
    }
  }
}

function useForceRender() {
  const [renderState, setRenderState] = (0, _react.useState)(false);
  const forceRender = (0, _react.useCallback)(() => {
    setRenderState(!renderState);
  }, [renderState, setRenderState]);
  return forceRender;
}

function useWebEventHandlers() {
  return (0, _react.useRef)({
    onGestureHandlerEvent: e => {
      (0, _eventReceiver.onGestureHandlerEvent)(e.nativeEvent);
    },
    onGestureHandlerStateChange: (0, _EnableNewWebImplementation.isNewWebImplementationEnabled)() ? e => {
      (0, _eventReceiver.onGestureHandlerEvent)(e.nativeEvent);
    } : undefined
  });
}
//# sourceMappingURL=utils.js.map