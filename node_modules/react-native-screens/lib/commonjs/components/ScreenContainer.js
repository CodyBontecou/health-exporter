"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
var _react = _interopRequireDefault(require("react"));
var _core = require("../core");
var _ScreenContainerNativeComponent = _interopRequireDefault(require("../fabric/ScreenContainerNativeComponent"));
var _ScreenNavigationContainerNativeComponent = _interopRequireDefault(require("../fabric/ScreenNavigationContainerNativeComponent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Native components

function ScreenContainer(props) {
  const {
    enabled = (0, _core.screensEnabled)(),
    hasTwoStates,
    ...rest
  } = props;
  if (enabled && _core.isNativePlatformSupported) {
    if (hasTwoStates) {
      const ScreenNavigationContainer = _reactNative.Platform.OS === 'ios' ? _ScreenNavigationContainerNativeComponent.default : _ScreenContainerNativeComponent.default;
      return /*#__PURE__*/_react.default.createElement(ScreenNavigationContainer, rest);
    }
    return /*#__PURE__*/_react.default.createElement(_ScreenContainerNativeComponent.default, rest);
  }
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, rest);
}
var _default = exports.default = ScreenContainer;
//# sourceMappingURL=ScreenContainer.js.map