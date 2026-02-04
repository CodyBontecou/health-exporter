"use strict";

import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
export function HeaderBackground({
  style,
  ...rest
}) {
  const {
    colors,
    dark
  } = useTheme();
  return /*#__PURE__*/_jsx(Animated.View, {
    style: [styles.container, {
      backgroundColor: colors.card,
      borderBottomColor: colors.border,
      ...(Platform.OS === 'ios' && {
        shadowColor: dark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 1)'
      })
    }, style],
    ...rest
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth
        }
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth
      }
    })
  }
});
//# sourceMappingURL=HeaderBackground.js.map