"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompatNativeSafeAreaProvider = CompatNativeSafeAreaProvider;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function CompatNativeSafeAreaProvider({
  children,
  style,
  onInsetsChange
}) {
  const window = (0, _reactNative.useWindowDimensions)();
  React.useEffect(() => {
    const insets = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
    const frame = {
      x: 0,
      y: 0,
      width: window.width,
      height: window.height
    };
    // @ts-ignore: missing properties
    onInsetsChange({
      nativeEvent: {
        insets,
        frame
      }
    });
  }, [onInsetsChange, window.height, window.width]);
  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: style
  }, children);
}
//# sourceMappingURL=CompatNativeSafeAreaProvider.js.map