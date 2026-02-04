"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _AppContainer = _interopRequireDefault(require("react-native/Libraries/ReactNative/AppContainer"));
var _ScreenContentWrapper = _interopRequireDefault(require("./ScreenContentWrapper"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// @ts-expect-error importing private component

/**
 * This view must *not* be flattened.
 * See https://github.com/software-mansion/react-native-screens/pull/1825
 * for detailed explanation.
 */
let DebugContainer = props => {
  return /*#__PURE__*/React.createElement(_ScreenContentWrapper.default, props);
};
if (process.env.NODE_ENV !== 'production') {
  DebugContainer = props => {
    const {
      stackPresentation,
      ...rest
    } = props;
    if (_reactNative.Platform.OS === 'ios' && stackPresentation !== 'push' && stackPresentation !== 'formSheet') {
      // This is necessary for LogBox
      return /*#__PURE__*/React.createElement(_AppContainer.default, null, /*#__PURE__*/React.createElement(_ScreenContentWrapper.default, rest));
    }
    return /*#__PURE__*/React.createElement(_ScreenContentWrapper.default, rest);
  };
  DebugContainer.displayName = 'DebugContainer';
}
var _default = exports.default = DebugContainer;
//# sourceMappingURL=DebugContainer.js.map