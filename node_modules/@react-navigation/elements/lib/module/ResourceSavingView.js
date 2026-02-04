"use strict";

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

export function ResourceSavingView({
  visible,
  children,
  style,
  ...rest
}) {
  if (Platform.OS === 'web') {
    return /*#__PURE__*/_jsx(View
    // @ts-expect-error: hidden exists on web, but not in React Native
    , {
      hidden: !visible,
      style: [{
        display: visible ? 'flex' : 'none'
      }, styles.container, style],
      pointerEvents: visible ? 'auto' : 'none',
      ...rest,
      children: children
    });
  }
  return /*#__PURE__*/_jsx(View, {
    style: [styles.container, style]
    // box-none doesn't seem to work properly on Android
    ,
    pointerEvents: visible ? 'auto' : 'none',
    children: /*#__PURE__*/_jsx(View, {
      collapsable: false,
      removeClippedSubviews:
      // On iOS & macOS, set removeClippedSubviews to true only when not focused
      // This is an workaround for a bug where the clipped view never re-appears
      Platform.OS === 'ios' || Platform.OS === 'macos' ? !visible : true,
      pointerEvents: visible ? 'auto' : 'none',
      style: visible ? styles.attached : styles.detached,
      children: children
    })
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  attached: {
    flex: 1
  },
  detached: {
    flex: 1,
    top: FAR_FAR_AWAY
  }
});
//# sourceMappingURL=ResourceSavingView.js.map