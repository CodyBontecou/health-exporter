"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScreenStackHeaderSubview = exports.ScreenStackHeaderSearchBarView = exports.ScreenStackHeaderRightView = exports.ScreenStackHeaderLeftView = exports.ScreenStackHeaderConfig = exports.ScreenStackHeaderCenterView = exports.ScreenStackHeaderBackButtonImage = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _ScreenStackHeaderConfigNativeComponent = _interopRequireDefault(require("../fabric/ScreenStackHeaderConfigNativeComponent"));
var _ScreenStackHeaderSubviewNativeComponent = _interopRequireDefault(require("../fabric/ScreenStackHeaderSubviewNativeComponent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // Native components
const ScreenStackHeaderSubview = exports.ScreenStackHeaderSubview = _ScreenStackHeaderSubviewNativeComponent.default;
const ScreenStackHeaderConfig = exports.ScreenStackHeaderConfig = /*#__PURE__*/_react.default.forwardRef((props, ref) => /*#__PURE__*/_react.default.createElement(_ScreenStackHeaderConfigNativeComponent.default, _extends({}, props, {
  ref: ref,
  style: styles.headerConfig,
  pointerEvents: "box-none"
})));
ScreenStackHeaderConfig.displayName = 'ScreenStackHeaderConfig';
const ScreenStackHeaderBackButtonImage = props => /*#__PURE__*/_react.default.createElement(ScreenStackHeaderSubview, {
  type: "back",
  style: styles.headerSubview
}, /*#__PURE__*/_react.default.createElement(_reactNative.Image, _extends({
  resizeMode: "center",
  fadeDuration: 0
}, props)));
exports.ScreenStackHeaderBackButtonImage = ScreenStackHeaderBackButtonImage;
const ScreenStackHeaderRightView = props => {
  const {
    style,
    ...rest
  } = props;
  return /*#__PURE__*/_react.default.createElement(ScreenStackHeaderSubview, _extends({}, rest, {
    type: "right",
    style: [styles.headerSubview, style]
  }));
};
exports.ScreenStackHeaderRightView = ScreenStackHeaderRightView;
const ScreenStackHeaderLeftView = props => {
  const {
    style,
    ...rest
  } = props;
  return /*#__PURE__*/_react.default.createElement(ScreenStackHeaderSubview, _extends({}, rest, {
    type: "left",
    style: [styles.headerSubview, style]
  }));
};
exports.ScreenStackHeaderLeftView = ScreenStackHeaderLeftView;
const ScreenStackHeaderCenterView = props => {
  const {
    style,
    ...rest
  } = props;
  return /*#__PURE__*/_react.default.createElement(ScreenStackHeaderSubview, _extends({}, rest, {
    type: "center",
    style: [styles.headerSubviewCenter, style]
  }));
};
exports.ScreenStackHeaderCenterView = ScreenStackHeaderCenterView;
const ScreenStackHeaderSearchBarView = props => /*#__PURE__*/_react.default.createElement(ScreenStackHeaderSubview, _extends({}, props, {
  type: "searchBar",
  style: styles.headerSubview
}));
exports.ScreenStackHeaderSearchBarView = ScreenStackHeaderSearchBarView;
const styles = _reactNative.StyleSheet.create({
  headerSubview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerSubviewCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1
  },
  headerConfig: {
    position: 'absolute',
    top: '-100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // We only want to center align the subviews on iOS.
    // See https://github.com/software-mansion/react-native-screens/pull/2456
    alignItems: _reactNative.Platform.OS === 'ios' ? 'center' : undefined
  }
});
//# sourceMappingURL=ScreenStackHeaderConfig.js.map