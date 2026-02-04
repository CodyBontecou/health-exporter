"use strict";

import { StyleSheet } from 'react-native';
import { Text } from "../Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function Label({
  tintColor,
  style,
  ...rest
}) {
  return /*#__PURE__*/_jsx(Text, {
    numberOfLines: 1,
    ...rest,
    style: [styles.label, tintColor != null && {
      color: tintColor
    }, style]
  });
}
const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
});
//# sourceMappingURL=Label.js.map