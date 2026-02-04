function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList, Switch, TextInput, DrawerLayoutAndroid, View } from 'react-native';
import { State } from './State';
import { Directions } from './Directions';

const NOOP = () => {// Do nothing
};

const PanGestureHandler = View;
const attachGestureHandler = NOOP;
const createGestureHandler = NOOP;
const dropGestureHandler = NOOP;
const updateGestureHandler = NOOP;
const flushOperations = NOOP;
const install = NOOP;
const NativeViewGestureHandler = View;
const TapGestureHandler = View;
const ForceTouchGestureHandler = View;
const LongPressGestureHandler = View;
const PinchGestureHandler = View;
const RotationGestureHandler = View;
const FlingGestureHandler = View;

const RawButton = ({
  enabled,
  ...rest
}) => /*#__PURE__*/React.createElement(TouchableNativeFeedback, _extends({
  disabled: !enabled
}, rest), /*#__PURE__*/React.createElement(View, null));

const BaseButton = RawButton;
const RectButton = RawButton;
const BorderlessButton = TouchableNativeFeedback;
export default {
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Switch,
  TextInput,
  DrawerLayoutAndroid,
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
  Directions,
  State
};
//# sourceMappingURL=mocks.js.map