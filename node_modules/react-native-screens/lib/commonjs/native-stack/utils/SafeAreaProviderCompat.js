"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SafeAreaProviderCompat;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// code taken from
// https://github.com/react-navigation/react-navigation/blob/ec0d113eb25c39ef9defb6c7215640f44e3569ae/packages/elements/src/SafeAreaProviderCompat.tsx

const {
  width = 0,
  height = 0
} = _reactNative.Dimensions.get('window');

// To support SSR on web, we need to have empty insets for initial values
// Otherwise there can be mismatch between SSR and client output
// We also need to specify empty values to support tests environments
const initialMetrics = _reactNative.Platform.OS === 'web' || _reactNativeSafeAreaContext.initialWindowMetrics == null ? {
  frame: {
    x: 0,
    y: 0,
    width,
    height
  },
  insets: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
} : _reactNativeSafeAreaContext.initialWindowMetrics;
function SafeAreaProviderCompat({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement(_reactNativeSafeAreaContext.SafeAreaInsetsContext.Consumer, null, insets => {
    if (insets) {
      // If we already have insets, don't wrap the stack in another safe area provider
      // This avoids an issue with updates at the cost of potentially incorrect values
      // https://github.com/react-navigation/react-navigation/issues/174
      return /*#__PURE__*/React.createElement(_reactNative.View, {
        style: [styles.container, style]
      }, children);
    }
    return /*#__PURE__*/React.createElement(_reactNativeSafeAreaContext.SafeAreaProvider, {
      initialMetrics: initialMetrics,
      style: style
    }, children);
  });
}
SafeAreaProviderCompat.initialMetrics = initialMetrics;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=SafeAreaProviderCompat.js.map