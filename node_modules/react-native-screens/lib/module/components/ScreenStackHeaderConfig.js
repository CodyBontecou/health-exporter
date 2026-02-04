'use client';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

// Native components
import ScreenStackHeaderConfigNativeComponent from '../fabric/ScreenStackHeaderConfigNativeComponent';
import ScreenStackHeaderSubviewNativeComponent from '../fabric/ScreenStackHeaderSubviewNativeComponent';
export const ScreenStackHeaderSubview = ScreenStackHeaderSubviewNativeComponent;
export const ScreenStackHeaderConfig = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(ScreenStackHeaderConfigNativeComponent, _extends({}, props, {
  ref: ref,
  style: styles.headerConfig,
  pointerEvents: "box-none"
})));
ScreenStackHeaderConfig.displayName = 'ScreenStackHeaderConfig';
export const ScreenStackHeaderBackButtonImage = props => /*#__PURE__*/React.createElement(ScreenStackHeaderSubview, {
  type: "back",
  style: styles.headerSubview
}, /*#__PURE__*/React.createElement(Image, _extends({
  resizeMode: "center",
  fadeDuration: 0
}, props)));
export const ScreenStackHeaderRightView = props => {
  const {
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(ScreenStackHeaderSubview, _extends({}, rest, {
    type: "right",
    style: [styles.headerSubview, style]
  }));
};
export const ScreenStackHeaderLeftView = props => {
  const {
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(ScreenStackHeaderSubview, _extends({}, rest, {
    type: "left",
    style: [styles.headerSubview, style]
  }));
};
export const ScreenStackHeaderCenterView = props => {
  const {
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(ScreenStackHeaderSubview, _extends({}, rest, {
    type: "center",
    style: [styles.headerSubviewCenter, style]
  }));
};
export const ScreenStackHeaderSearchBarView = props => /*#__PURE__*/React.createElement(ScreenStackHeaderSubview, _extends({}, props, {
  type: "searchBar",
  style: styles.headerSubview
}));
const styles = StyleSheet.create({
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
    alignItems: Platform.OS === 'ios' ? 'center' : undefined
  }
});
//# sourceMappingURL=ScreenStackHeaderConfig.js.map