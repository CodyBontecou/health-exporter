"use strict";

import { useLinkProps, useTheme } from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { PlatformPressable } from "./PlatformPressable.js";
import { Text } from "./Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
const BUTTON_RADIUS = 40;
export function Button(props) {
  if ('screen' in props || 'action' in props) {
    // @ts-expect-error: This is already type-checked by the prop types
    return /*#__PURE__*/_jsx(ButtonLink, {
      ...props
    });
  } else {
    return /*#__PURE__*/_jsx(ButtonBase, {
      ...props
    });
  }
}
function ButtonLink({
  screen,
  params,
  action,
  href,
  ...rest
}) {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps({
    screen,
    params,
    action,
    href
  });
  return /*#__PURE__*/_jsx(ButtonBase, {
    ...rest,
    ...props
  });
}
function ButtonBase({
  variant = 'tinted',
  color: customColor,
  android_ripple,
  style,
  children,
  ...rest
}) {
  const {
    colors,
    fonts
  } = useTheme();
  const color = customColor ?? colors.primary;
  let backgroundColor;
  let textColor;
  switch (variant) {
    case 'plain':
      backgroundColor = 'transparent';
      textColor = color;
      break;
    case 'tinted':
      backgroundColor = Color(color).fade(0.85).string();
      textColor = color;
      break;
    case 'filled':
      backgroundColor = color;
      textColor = Color(color).isDark() ? 'white' : Color(color).darken(0.71).string();
      break;
  }
  return /*#__PURE__*/_jsx(PlatformPressable, {
    ...rest,
    android_ripple: {
      radius: BUTTON_RADIUS,
      color: Color(textColor).fade(0.85).string(),
      ...android_ripple
    },
    pressOpacity: Platform.OS === 'ios' ? undefined : 1,
    hoverEffect: {
      color: textColor
    },
    style: [{
      backgroundColor
    }, styles.button, style],
    children: /*#__PURE__*/_jsx(Text, {
      style: [{
        color: textColor
      }, fonts.regular, styles.text],
      children: children
    })
  });
}
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BUTTON_RADIUS,
    borderCurve: 'continuous'
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center'
  }
});
//# sourceMappingURL=Button.js.map