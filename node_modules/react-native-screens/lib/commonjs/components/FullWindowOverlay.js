"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _FullWindowOverlayNativeComponent = _interopRequireDefault(require("../fabric/FullWindowOverlayNativeComponent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Native components

const NativeFullWindowOverlay = _FullWindowOverlayNativeComponent.default;
function FullWindowOverlay(props) {
  const {
    width,
    height
  } = (0, _reactNative.useWindowDimensions)();
  if (_reactNative.Platform.OS !== 'ios') {
    console.warn('Using FullWindowOverlay is only valid on iOS devices.');
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, props);
  }
  return /*#__PURE__*/_react.default.createElement(NativeFullWindowOverlay, {
    style: [_reactNative.StyleSheet.absoluteFill, {
      width,
      height
    }]
  }, props.children);
}
var _default = exports.default = FullWindowOverlay;
//# sourceMappingURL=FullWindowOverlay.js.map