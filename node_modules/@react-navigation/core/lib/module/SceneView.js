"use strict";

import * as React from 'react';
import { EnsureSingleNavigator } from "./EnsureSingleNavigator.js";
import { isArrayEqual } from "./isArrayEqual.js";
import { NavigationFocusedRouteStateContext } from "./NavigationFocusedRouteStateContext.js";
import { NavigationStateContext } from "./NavigationStateContext.js";
import { StaticContainer } from "./StaticContainer.js";
import { useOptionsGetters } from "./useOptionsGetters.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Component which takes care of rendering the screen for a route.
 * It provides all required contexts and applies optimizations when applicable.
 */
export function SceneView({
  screen,
  route,
  navigation,
  routeState,
  getState,
  setState,
  options,
  clearOptions
}) {
  const navigatorKeyRef = React.useRef(undefined);
  const getKey = React.useCallback(() => navigatorKeyRef.current, []);
  const {
    addOptionsGetter
  } = useOptionsGetters({
    key: route.key,
    options,
    navigation
  });
  const setKey = React.useCallback(key => {
    navigatorKeyRef.current = key;
  }, []);
  const getCurrentState = React.useCallback(() => {
    const state = getState();
    const currentRoute = state.routes.find(r => r.key === route.key);
    return currentRoute ? currentRoute.state : undefined;
  }, [getState, route.key]);
  const setCurrentState = React.useCallback(child => {
    const state = getState();
    const routes = state.routes.map(r => {
      if (r.key !== route.key) {
        return r;
      }
      const nextRoute = r.state !== child ? {
        ...r,
        state: child
      } : r;

      // Before updating the state, cleanup any nested screen and state
      // This will avoid the navigator trying to handle them again
      if (nextRoute.params && ('state' in nextRoute.params && typeof nextRoute.params.state === 'object' && nextRoute.params.state !== null || 'screen' in nextRoute.params && typeof nextRoute.params.screen === 'string')) {
        // @ts-expect-error: we don't have correct type for params
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          state,
          screen,
          params,
          initial,
          ...rest
        } = nextRoute.params;
        if (Object.keys(rest).length) {
          return {
            ...nextRoute,
            params: rest
          };
        } else {
          const {
            // We destructure the params to omit them
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            params,
            ...restRoute
          } = nextRoute;
          return restRoute;
        }
      }
      return nextRoute;
    });

    // Make sure not to update state if routes haven't changed
    // Otherwise this will result in params cleanup as well
    // We only want to cleanup params when state changes - after they are used
    if (!isArrayEqual(state.routes, routes)) {
      setState({
        ...state,
        routes
      });
    }
  }, [getState, route.key, setState]);
  const isInitialRef = React.useRef(true);
  React.useEffect(() => {
    isInitialRef.current = false;
  });

  // Clear options set by this screen when it is unmounted
  React.useEffect(() => {
    return clearOptions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getIsInitial = React.useCallback(() => isInitialRef.current, []);
  const parentFocusedRouteState = React.useContext(NavigationFocusedRouteStateContext);
  const focusedRouteState = React.useMemo(() => {
    const state = {
      routes: [{
        key: route.key,
        name: route.name,
        params: route.params,
        path: route.path
      }]
    };

    // Add our state to the innermost route of the parent state
    const addState = parent => {
      const parentRoute = parent?.routes[0];
      if (parentRoute) {
        return {
          routes: [{
            ...parentRoute,
            state: addState(parentRoute.state)
          }]
        };
      }
      return state;
    };
    return addState(parentFocusedRouteState);
  }, [parentFocusedRouteState, route.key, route.name, route.params, route.path]);
  const context = React.useMemo(() => ({
    state: routeState,
    getState: getCurrentState,
    setState: setCurrentState,
    getKey,
    setKey,
    getIsInitial,
    addOptionsGetter
  }), [routeState, getCurrentState, setCurrentState, getKey, setKey, getIsInitial, addOptionsGetter]);
  const ScreenComponent = screen.getComponent ? screen.getComponent() : screen.component;
  return /*#__PURE__*/_jsx(NavigationStateContext.Provider, {
    value: context,
    children: /*#__PURE__*/_jsx(NavigationFocusedRouteStateContext.Provider, {
      value: focusedRouteState,
      children: /*#__PURE__*/_jsx(EnsureSingleNavigator, {
        children: /*#__PURE__*/_jsx(StaticContainer, {
          name: screen.name,
          render: ScreenComponent || screen.children,
          navigation: navigation,
          route: route,
          children: ScreenComponent !== undefined ? /*#__PURE__*/_jsx(ScreenComponent, {
            navigation: navigation,
            route: route
          }) : screen.children !== undefined ? screen.children({
            navigation,
            route
          }) : null
        })
      })
    })
  });
}
//# sourceMappingURL=SceneView.js.map