"use strict";

import { createNavigatorFactory, TabRouter, useNavigationBuilder } from '@react-navigation/native';
import { BottomTabView } from "../views/BottomTabView.js";
import { jsx as _jsx } from "react/jsx-runtime";
function BottomTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  UNSTABLE_router,
  ...rest
}) {
  const {
    state,
    descriptors,
    navigation,
    NavigationContent
  } = useNavigationBuilder(TabRouter, {
    id,
    initialRouteName,
    backBehavior,
    UNSTABLE_routeNamesChangeBehavior,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    UNSTABLE_router
  });
  return /*#__PURE__*/_jsx(NavigationContent, {
    children: /*#__PURE__*/_jsx(BottomTabView, {
      ...rest,
      state: state,
      navigation: navigation,
      descriptors: descriptors
    })
  });
}
export function createBottomTabNavigator(config) {
  return createNavigatorFactory(BottomTabNavigator)(config);
}
//# sourceMappingURL=createBottomTabNavigator.js.map