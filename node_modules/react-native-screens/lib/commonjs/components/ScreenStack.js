"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _contexts = require("../contexts");
var _warnOnce = _interopRequireDefault(require("warn-once"));
var _ScreenStackNativeComponent = _interopRequireDefault(require("../fabric/ScreenStackNativeComponent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // Native components
const assertGHProvider = (ScreenGestureDetector, goBackGesture) => {
  const isGestureDetectorProviderNotDetected = ScreenGestureDetector.name !== 'GHWrapper' && goBackGesture !== undefined;
  (0, _warnOnce.default)(isGestureDetectorProviderNotDetected, 'Cannot detect GestureDetectorProvider in a screen that uses `goBackGesture`. Make sure your navigator is wrapped in GestureDetectorProvider.');
};
const assertCustomScreenTransitionsProps = (screensRefs, currentScreenId, goBackGesture) => {
  const isGestureDetectorNotConfiguredProperly = goBackGesture !== undefined && screensRefs === null && currentScreenId === undefined;
  (0, _warnOnce.default)(isGestureDetectorNotConfiguredProperly, 'Custom Screen Transition require screensRefs and currentScreenId to be provided.');
};
function ScreenStack(props) {
  const {
    goBackGesture,
    screensRefs: passedScreenRefs,
    // TODO: For compatibility with v5, remove once v5 is removed
    currentScreenId,
    transitionAnimation,
    screenEdgeGesture,
    onFinishTransitioning,
    children,
    ...rest
  } = props;
  const screensRefs = _react.default.useRef(passedScreenRefs?.current ?? {});
  const ref = _react.default.useRef(null);
  const ScreenGestureDetector = _react.default.useContext(_contexts.GHContext);
  const gestureDetectorBridge = _react.default.useRef({
    stackUseEffectCallback: _stackRef => {
      // this method will be overriden in GestureDetector
    }
  });
  _react.default.useEffect(() => {
    gestureDetectorBridge.current.stackUseEffectCallback(ref);
  });
  assertGHProvider(ScreenGestureDetector, goBackGesture);
  assertCustomScreenTransitionsProps(screensRefs, currentScreenId, goBackGesture);
  return /*#__PURE__*/_react.default.createElement(_contexts.RNSScreensRefContext.Provider, {
    value: screensRefs
  }, /*#__PURE__*/_react.default.createElement(ScreenGestureDetector, {
    gestureDetectorBridge: gestureDetectorBridge,
    goBackGesture: goBackGesture,
    transitionAnimation: transitionAnimation,
    screenEdgeGesture: screenEdgeGesture ?? false,
    screensRefs: screensRefs,
    currentScreenId: currentScreenId
  }, /*#__PURE__*/_react.default.createElement(_ScreenStackNativeComponent.default, _extends({}, rest, {
    /**
     * This messy override is to conform NativeProps used by codegen and
     * our Public API. To see reasoning go to this PR:
     * https://github.com/software-mansion/react-native-screens/pull/2423#discussion_r1810616995
     */
    onFinishTransitioning: onFinishTransitioning,
    ref: ref
  }), children)));
}
var _default = exports.default = ScreenStack;
//# sourceMappingURL=ScreenStack.js.map