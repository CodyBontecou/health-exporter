"use strict";

import { useTheme } from '@react-navigation/native';
// eslint-disable-next-line no-restricted-imports
import { Text as NativeText } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
export function Text({
  style,
  ...rest
}) {
  const {
    colors,
    fonts
  } = useTheme();
  return /*#__PURE__*/_jsx(NativeText, {
    ...rest,
    style: [{
      color: colors.text
    }, fonts.regular, style]
  });
}
//# sourceMappingURL=Text.js.map