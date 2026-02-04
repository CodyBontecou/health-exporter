"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FooterComponent = FooterComponent;
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _ScreenFooterNativeComponent = _interopRequireDefault(require("../fabric/ScreenFooterNativeComponent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Unstable API
 */
function ScreenFooter(props) {
  return /*#__PURE__*/_react.default.createElement(_ScreenFooterNativeComponent.default, props);
}
function FooterComponent({
  children
}) {
  return /*#__PURE__*/_react.default.createElement(ScreenFooter, {
    collapsable: false
  }, children);
}
var _default = exports.default = ScreenFooter;
//# sourceMappingURL=ScreenFooter.js.map