"use strict";

import * as React from 'react';
import { isArrayEqual } from "./isArrayEqual.js";
import { NavigationBuilderContext } from "./NavigationBuilderContext.js";
import { NavigationRouteContext } from "./NavigationRouteContext.js";
export function useOnGetState({
  getState,
  getStateListeners
}) {
  const {
    addKeyedListener
  } = React.useContext(NavigationBuilderContext);
  const route = React.useContext(NavigationRouteContext);
  const key = route ? route.key : 'root';
  const getRehydratedState = React.useCallback(() => {
    const state = getState();

    // Avoid returning new route objects if we don't need to
    const routes = state.routes.map(route => {
      const childState = getStateListeners[route.key]?.();
      if (route.state === childState) {
        return route;
      }
      return {
        ...route,
        state: childState
      };
    });
    if (isArrayEqual(state.routes, routes)) {
      return state;
    }
    return {
      ...state,
      routes
    };
  }, [getState, getStateListeners]);
  React.useEffect(() => {
    return addKeyedListener?.('getState', key, getRehydratedState);
  }, [addKeyedListener, getRehydratedState, key]);
}
//# sourceMappingURL=useOnGetState.js.map