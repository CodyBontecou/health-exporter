"use strict";

import { useTheme } from '@react-navigation/native';
import { Animated, Platform, StyleSheet } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
export function HeaderTitle({
  tintColor,
  style,
  ...rest
}) {
  const {
    colors,
    fonts
  } = useTheme();
  return /*#__PURE__*/_jsx(Animated.Text, {
    role: "heading",
    "aria-level": "1",
    numberOfLines: 1,
    ...rest,
    style: [{
      color: tintColor === undefined ? colors.text : tintColor
    }, Platform.select({
      ios: fonts.bold,
      default: fonts.medium
    }), styles.title, style]
  });
}
const styles = StyleSheet.create({
  title: Platform.select({
    ios: {
      fontSize: 17
    },
    android: {
      fontSize: 20
    },
    default: {
      fontSize: 18
    }
  })
});
//# sourceMappingURL=HeaderTitle.js.map