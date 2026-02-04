"use strict";

import { StyleSheet } from 'react-native';
import { Text } from "./Text.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function MissingIcon({
  color,
  size,
  style
}) {
  return /*#__PURE__*/_jsx(Text, {
    style: [styles.icon, {
      color,
      fontSize: size
    }, style],
    children: "\u23F7"
  });
}
const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent'
  }
});
//# sourceMappingURL=MissingIcon.js.map