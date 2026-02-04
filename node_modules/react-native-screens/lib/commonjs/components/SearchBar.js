"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _utils = require("../utils");
var _reactNative = require("react-native");
var _SearchBarNativeComponent = _interopRequireWildcard(require("../fabric/SearchBarNativeComponent"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // Native components
const NativeSearchBar = _SearchBarNativeComponent.default;
const NativeSearchBarCommands = _SearchBarNativeComponent.Commands;
function SearchBar(props, ref) {
  const searchBarRef = _react.default.useRef(null);
  _react.default.useImperativeHandle(ref, () => ({
    blur: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.blur(ref));
    },
    focus: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.focus(ref));
    },
    toggleCancelButton: flag => {
      _callMethodWithRef(ref => NativeSearchBarCommands.toggleCancelButton(ref, flag));
    },
    clearText: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.clearText(ref));
    },
    setText: text => {
      _callMethodWithRef(ref => NativeSearchBarCommands.setText(ref, text));
    },
    cancelSearch: () => {
      _callMethodWithRef(ref => NativeSearchBarCommands.cancelSearch(ref));
    }
  }));
  const _callMethodWithRef = _react.default.useCallback(method => {
    const ref = searchBarRef.current;
    if (ref) {
      method(ref);
    } else {
      console.warn('Reference to native search bar component has not been updated yet');
    }
  }, [searchBarRef]);
  if (!_utils.isSearchBarAvailableForCurrentPlatform) {
    console.warn('Importing SearchBar is only valid on iOS and Android devices.');
    return _reactNative.View;
  }
  return /*#__PURE__*/_react.default.createElement(NativeSearchBar, _extends({
    ref: searchBarRef
  }, props, {
    onSearchFocus: props.onFocus,
    onSearchBlur: props.onBlur,
    onSearchButtonPress: props.onSearchButtonPress,
    onCancelButtonPress: props.onCancelButtonPress,
    onChangeText: props.onChangeText
  }));
}
var _default = exports.default = /*#__PURE__*/_react.default.forwardRef(SearchBar);
//# sourceMappingURL=SearchBar.js.map