"use strict";

import { CurrentRenderContext } from '@react-navigation/core';
import * as React from 'react';
import { ServerContext } from "./ServerContext.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Container component for server rendering.
 *
 * @param props.location Location object to base the initial URL for SSR.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which contains helper methods.
 */
export const ServerContainer = /*#__PURE__*/React.forwardRef(function ServerContainer({
  children,
  location
}, ref) {
  React.useEffect(() => {
    console.error("'ServerContainer' should only be used on the server with 'react-dom/server' for SSR.");
  }, []);

  // eslint-disable-next-line @eslint-react/no-unstable-context-value
  const current = {};
  if (ref) {
    const value = {
      getCurrentOptions() {
        return current.options;
      }
    };

    // We write to the `ref` during render instead of `React.useImperativeHandle`
    // This is because `useImperativeHandle` will update the ref after 'commit',
    // and there's no 'commit' phase during SSR.
    // Mutating ref during render is unsafe in concurrent mode, but we don't care about it for SSR.
    if (typeof ref === 'function') {
      ref(value);
    } else {
      ref.current = value;
    }
  }
  return (
    /*#__PURE__*/
    // eslint-disable-next-line @eslint-react/no-unstable-context-value
    _jsx(ServerContext.Provider, {
      value: {
        location
      },
      children: /*#__PURE__*/_jsx(CurrentRenderContext.Provider, {
        value: current,
        children: children
      })
    })
  );
});
//# sourceMappingURL=ServerContainer.js.map