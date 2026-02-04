"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _State = require("./State");

var _Directions = require("./Directions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const NOOP = () => {// Do nothing
};

const PanGestureHandler = _reactNative.View;
const attachGestureHandler = NOOP;
const createGestureHandler = NOOP;
const dropGestureHandler = NOOP;
const updateGestureHandler = NOOP;
const flushOperations = NOOP;
const install = NOOP;
const NativeViewGestureHandler = _reactNative.View;
const TapGestureHandler = _reactNative.View;
const ForceTouchGestureHandler = _reactNative.View;
const LongPressGestureHandler = _reactNative.View;
const PinchGestureHandler = _reactNative.View;
const RotationGestureHandler = _reactNative.View;
const FlingGestureHandler = _reactNative.View;

const RawButton = ({
  enabled,
  ...rest
}) => /*#__PURE__*/_react.default.createElement(_reactNative.TouchableNativeFeedback, _extends({
  disabled: !enabled
}, rest), /*#__PURE__*/_react.default.createElement(_reactNative.View, null));

const BaseButton = RawButton;
const RectButton = RawButton;
const BorderlessButton = _reactNative.TouchableNativeFeedback;
var _default = {
  TouchableHighlight: _reactNative.TouchableHighlight,
  TouchableNativeFeedback: _reactNative.TouchableNativeFeedback,
  TouchableOpacity: _reactNative.TouchableOpacity,
  TouchableWithoutFeedback: _reactNative.TouchableWithoutFeedback,
  ScrollView: _reactNative.ScrollView,
  FlatList: _reactNative.FlatList,
  Switch: _reactNative.Switch,
  TextInput: _reactNative.TextInput,
  DrawerLayoutAndroid: _reactNative.DrawerLayoutAndroid,
  NativeViewGestureHandler,
  TapGestureHandler,
  ForceTouchGestureHandler,
  LongPressGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  FlingGestureHandler,
  RawButton,
  BaseButton,
  RectButton,
  BorderlessButton,
  PanGestureHandler,
  attachGestureHandler,
  createGestureHandler,
  dropGestureHandler,
  updateGestureHandler,
  flushOperations,
  install,
  // Probably can be removed
  Directions: _Directions.Directions,
  State: _State.State
};
exports.default = _default;
//# sourceMappingURL=mocks.js.map