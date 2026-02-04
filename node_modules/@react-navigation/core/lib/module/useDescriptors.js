"use strict";

import * as React from 'react';
import { NavigationBuilderContext } from "./NavigationBuilderContext.js";
import { NavigationContext } from "./NavigationContext.js";
import { NavigationRouteContext } from "./NavigationRouteContext.js";
import { SceneView } from "./SceneView.js";
import { ThemeContext } from "./theming/ThemeContext.js";
import { useNavigationCache } from "./useNavigationCache.js";
import { useRouteCache } from "./useRouteCache.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Hook to create descriptor objects for the child routes.
 *
 * A descriptor object provides 3 things:
 * - Helper method to render a screen
 * - Options specified by the screen for the navigator
 * - Navigation object intended for the route
 */
export function useDescriptors({
  state,
  screens,
  navigation,
  screenOptions,
  screenLayout,
  onAction,
  getState,
  setState,
  addListener,
  addKeyedListener,
  onRouteFocus,
  router,
  emitter
}) {
  const theme = React.useContext(ThemeContext);
  const [options, setOptions] = React.useState({});
  const {
    onDispatchAction,
    onOptionsChange,
    scheduleUpdate,
    flushUpdates,
    stackRef
  } = React.useContext(NavigationBuilderContext);
  const context = React.useMemo(() => ({
    navigation,
    onAction,
    addListener,
    addKeyedListener,
    onRouteFocus,
    onDispatchAction,
    onOptionsChange,
    scheduleUpdate,
    flushUpdates,
    stackRef
  }), [navigation, onAction, addListener, addKeyedListener, onRouteFocus, onDispatchAction, onOptionsChange, scheduleUpdate, flushUpdates, stackRef]);
  const {
    base,
    navigations
  } = useNavigationCache({
    state,
    getState,
    navigation,
    setOptions,
    router,
    emitter
  });
  const routes = useRouteCache(state.routes);
  const getOptions = (route, navigation, overrides) => {
    const config = screens[route.name];
    const screen = config.props;
    const optionsList = [
    // The default `screenOptions` passed to the navigator
    screenOptions,
    // The `screenOptions` props passed to `Group` elements
    ...(config.options ? config.options.filter(Boolean) : []),
    // The `options` prop passed to `Screen` elements,
    screen.options,
    // The options set via `navigation.setOptions`
    overrides];
    return optionsList.reduce((acc, curr) => Object.assign(acc,
    // @ts-expect-error: we check for function but TS still complains
    typeof curr !== 'function' ? curr : curr({
      route,
      navigation,
      theme
    })), {});
  };
  const render = (route, navigation, customOptions, routeState) => {
    const config = screens[route.name];
    const screen = config.props;
    const clearOptions = () => setOptions(o => {
      if (route.key in o) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          [route.key]: _,
          ...rest
        } = o;
        return rest;
      }
      return o;
    });
    const layout =
    // The `layout` prop passed to `Screen` elements,
    screen.layout ??
    // The `screenLayout` props passed to `Group` elements
    config.layout ??
    // The default `screenLayout` passed to the navigator
    screenLayout;
    let element = /*#__PURE__*/_jsx(SceneView, {
      navigation: navigation,
      route: route,
      screen: screen,
      routeState: routeState,
      getState: getState,
      setState: setState,
      options: customOptions,
      clearOptions: clearOptions
    });
    if (layout != null) {
      element = layout({
        route,
        navigation,
        options: customOptions,
        // @ts-expect-error: in practice `theme` will be defined
        theme,
        children: element
      });
    }
    return /*#__PURE__*/_jsx(NavigationBuilderContext.Provider, {
      value: context,
      children: /*#__PURE__*/_jsx(NavigationContext.Provider, {
        value: navigation,
        children: /*#__PURE__*/_jsx(NavigationRouteContext.Provider, {
          value: route,
          children: element
        })
      })
    }, route.key);
  };
  const descriptors = routes.reduce((acc, route, i) => {
    const navigation = navigations[route.key];
    const customOptions = getOptions(route, navigation, options[route.key]);
    const element = render(route, navigation, customOptions, state.routes[i].state);
    acc[route.key] = {
      route,
      // @ts-expect-error: it's missing action helpers, fix later
      navigation,
      render() {
        return element;
      },
      options: customOptions
    };
    return acc;
  }, {});

  /**
   * Create a descriptor object for a route.
   *
   * @param route Route object for which the descriptor should be created
   * @param placeholder Whether the descriptor should be a placeholder, e.g. for a route not yet in the state
   * @returns Descriptor object
   */
  const describe = (route, placeholder) => {
    if (!placeholder) {
      if (!(route.key in descriptors)) {
        throw new Error(`Couldn't find a route with the key ${route.key}.`);
      }
      return descriptors[route.key];
    }
    const navigation = base;
    const customOptions = getOptions(route, navigation, {});
    const element = render(route, navigation, customOptions, undefined);
    return {
      route,
      navigation,
      render() {
        return element;
      },
      options: customOptions
    };
  };
  return {
    describe,
    descriptors
  };
}
//# sourceMappingURL=useDescriptors.js.map