"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FooterComponent;
var _react = _interopRequireDefault(require("react"));
var _ScreenFooter = _interopRequireDefault(require("../../components/ScreenFooter"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function FooterComponent({
  children
}) {
  return /*#__PURE__*/_react.default.createElement(_ScreenFooter.default, {
    collapsable: false
  }, children);
}
//# sourceMappingURL=FooterComponent.js.map