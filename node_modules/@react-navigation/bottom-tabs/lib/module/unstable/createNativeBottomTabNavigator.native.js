"use strict";

import { createNavigatorFactory, StackActions, TabRouter, useNavigationBuilder } from '@react-navigation/native';
import * as React from 'react';
import { NativeBottomTabView } from "./NativeBottomTabView.native.js";
import { jsx as _jsx } from "react/jsx-runtime";
function NativeBottomTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  UNSTABLE_router,
  UNSTABLE_routeNamesChangeBehavior,
  ...rest
}) {
  const {
    state,
    navigation,
    descriptors,
    NavigationContent
  } = useNavigationBuilder(TabRouter, {
    id,
    initialRouteName,
    backBehavior,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    UNSTABLE_router,
    UNSTABLE_routeNamesChangeBehavior
  });
  const focusedRouteKey = state.routes[state.index].key;
  const previousRouteKeyRef = React.useRef(focusedRouteKey);
  React.useEffect(() => {
    const previousRouteKey = previousRouteKeyRef.current;
    if (previousRouteKey !== focusedRouteKey && descriptors[previousRouteKey]?.options.popToTopOnBlur) {
      const prevRoute = state.routes.find(route => route.key === previousRouteKey);
      if (prevRoute?.state?.type === 'stack' && prevRoute.state.key) {
        const popToTopAction = {
          ...StackActions.popToTop(),
          target: prevRoute.state.key
        };
        navigation.dispatch(popToTopAction);
      }
    }
    previousRouteKeyRef.current = focusedRouteKey;
  }, [descriptors, focusedRouteKey, navigation, state.index, state.routes]);
  return /*#__PURE__*/_jsx(NavigationContent, {
    children: /*#__PURE__*/_jsx(NativeBottomTabView, {
      ...rest,
      state: state,
      navigation: navigation,
      descriptors: descriptors
    })
  });
}
export function createNativeBottomTabNavigator(config) {
  return createNavigatorFactory(NativeBottomTabNavigator)(config);
}
//# sourceMappingURL=createNativeBottomTabNavigator.native.js.map