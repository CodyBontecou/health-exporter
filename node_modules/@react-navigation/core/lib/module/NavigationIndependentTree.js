"use strict";

import * as React from 'react';
import { NavigationContext } from "./NavigationContext.js";
import { NavigationIndependentTreeContext } from "./NavigationIndependentTreeContext.js";
import { NavigationRouteContext } from "./NavigationRouteContext.js";

/**
 * Component to make the child navigation container independent of parent containers.
 */
import { jsx as _jsx } from "react/jsx-runtime";
export function NavigationIndependentTree({
  children
}) {
  return (
    /*#__PURE__*/
    // We need to clear any existing contexts for nested independent container to work correctly
    _jsx(NavigationRouteContext.Provider, {
      value: undefined,
      children: /*#__PURE__*/_jsx(NavigationContext.Provider, {
        value: undefined,
        children: /*#__PURE__*/_jsx(NavigationIndependentTreeContext.Provider, {
          value: true,
          children: children
        })
      })
    })
  );
}
//# sourceMappingURL=NavigationIndependentTree.js.map