"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GestureDetectorProvider;
var _react = _interopRequireDefault(require("react"));
var _contexts = require("../contexts");
var _ScreenGestureDetector = _interopRequireDefault(require("./ScreenGestureDetector"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function GHWrapper(props) {
  return /*#__PURE__*/_react.default.createElement(_ScreenGestureDetector.default, props);
}
function GestureDetectorProvider(props) {
  return /*#__PURE__*/_react.default.createElement(_contexts.GHContext.Provider, {
    value: GHWrapper
  }, props.children);
}
//# sourceMappingURL=GestureDetectorProvider.js.map