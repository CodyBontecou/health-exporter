"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _NativeStackView = _interopRequireDefault(require("../views/NativeStackView"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NativeStackNavigator({
  initialRouteName,
  children,
  screenOptions,
  ...rest
}) {
  const {
    state,
    descriptors,
    navigation
  } = (0, _native.useNavigationBuilder)(_native.StackRouter, {
    initialRouteName,
    children,
    screenOptions
  });

  // Starting from React Navigation v6, `native-stack` should be imported from
  // `@react-navigation/native-stack` rather than `react-native-screens/native-stack`
  React.useEffect(() => {
    // @ts-ignore navigation.dangerouslyGetParent was removed in v6
    if (navigation?.dangerouslyGetParent === undefined) {
      console.warn('Looks like you are importing `native-stack` from `react-native-screens/native-stack`. Since version 6 of `react-navigation`, it should be imported from `@react-navigation/native-stack`.');
    }
  }, [navigation]);
  React.useEffect(() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?.addListener?.('tabPress', e => {
    const isFocused = navigation.isFocused();

    // Run the operation in the next frame so we're sure all listeners have been run
    // This is necessary to know if preventDefault() has been called
    requestAnimationFrame(() => {
      if (state.index > 0 && isFocused && !e.defaultPrevented) {
        // When user taps on already focused tab and we're inside the tab,
        // reset the stack to replicate native behaviour
        navigation.dispatch({
          ..._native.StackActions.popToTop(),
          target: state.key
        });
      }
    });
  }), [navigation, state.index, state.key]);
  return /*#__PURE__*/React.createElement(_NativeStackView.default, _extends({}, rest, {
    state: state,
    navigation: navigation,
    descriptors: descriptors
  }));
}

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
var _default = exports.default = (0, _native.createNavigatorFactory)(NativeStackNavigator);
//# sourceMappingURL=createNativeStackNavigator.js.map