"use strict";

import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { PlatformPressable } from "../PlatformPressable.js";
import { jsx as _jsx } from "react/jsx-runtime";
function HeaderButtonInternal({
  disabled,
  onPress,
  pressColor,
  pressOpacity,
  accessibilityLabel,
  testID,
  style,
  href,
  children
}, ref) {
  return /*#__PURE__*/_jsx(PlatformPressable, {
    ref: ref,
    disabled: disabled,
    href: href,
    "aria-label": accessibilityLabel,
    testID: testID,
    onPress: onPress,
    pressColor: pressColor,
    pressOpacity: pressOpacity,
    android_ripple: androidRipple,
    style: [styles.container, disabled && styles.disabled, style],
    hitSlop: Platform.select({
      ios: undefined,
      default: {
        top: 16,
        right: 16,
        bottom: 16,
        left: 16
      }
    }),
    children: children
  });
}
export const HeaderButton = /*#__PURE__*/React.forwardRef(HeaderButtonInternal);
HeaderButton.displayName = 'HeaderButton';
const androidRipple = {
  borderless: true,
  foreground: Platform.OS === 'android' && Platform.Version >= 23,
  radius: 20
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    // Roundness for iPad hover effect
    borderRadius: 10,
    borderCurve: 'continuous'
  },
  disabled: {
    opacity: 0.5
  }
});
//# sourceMappingURL=HeaderButton.js.map