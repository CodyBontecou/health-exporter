"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useAnimatedHeaderHeight;
var React = _interopRequireWildcard(require("react"));
var _AnimatedHeaderHeightContext = _interopRequireDefault(require("./AnimatedHeaderHeightContext"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function useAnimatedHeaderHeight() {
  const animatedValue = React.useContext(_AnimatedHeaderHeightContext.default);
  if (animatedValue === undefined) {
    throw new Error("Couldn't find the header height. Are you inside a screen in a navigator with a header?");
  }
  return animatedValue;
}
//# sourceMappingURL=useAnimatedHeaderHeight.js.map