"use strict";

import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Animated } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
export function Background({
  style,
  ...rest
}) {
  const {
    colors
  } = useTheme();
  return /*#__PURE__*/_jsx(Animated.View, {
    ...rest,
    style: [{
      flex: 1,
      backgroundColor: colors.background
    }, style]
  });
}
//# sourceMappingURL=Background.js.map