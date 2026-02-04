"use strict";

import * as React from 'react';
import { ThemeContext } from "./ThemeContext.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function ThemeProvider({
  value,
  children
}) {
  return /*#__PURE__*/_jsx(ThemeContext.Provider, {
    value: value,
    children: children
  });
}
//# sourceMappingURL=ThemeProvider.js.map