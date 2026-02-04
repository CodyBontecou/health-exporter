"use strict";

import * as React from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const MULTIPLE_NAVIGATOR_ERROR = `Another navigator is already registered for this container. You likely have multiple navigators under a single "NavigationContainer" or "Screen". Make sure each navigator is under a separate "Screen" container. See https://reactnavigation.org/docs/nesting-navigators for a guide on nesting.`;
export const SingleNavigatorContext = /*#__PURE__*/React.createContext(undefined);

/**
 * Component which ensures that there's only one navigator nested under it.
 */
export function EnsureSingleNavigator({
  children
}) {
  const navigatorKeyRef = React.useRef(undefined);
  const value = React.useMemo(() => ({
    register(key) {
      const currentKey = navigatorKeyRef.current;
      if (currentKey !== undefined && key !== currentKey) {
        throw new Error(MULTIPLE_NAVIGATOR_ERROR);
      }
      navigatorKeyRef.current = key;
    },
    unregister(key) {
      const currentKey = navigatorKeyRef.current;
      if (key !== currentKey) {
        return;
      }
      navigatorKeyRef.current = undefined;
    }
  }), []);
  return /*#__PURE__*/_jsx(SingleNavigatorContext.Provider, {
    value: value,
    children: children
  });
}
//# sourceMappingURL=EnsureSingleNavigator.js.map