"use strict";

import { createNavigatorFactory, StackRouter, useNavigationBuilder } from '@react-navigation/core';
import { jsx as _jsx } from "react/jsx-runtime";
const StackNavigator = props => {
  const {
    state,
    descriptors,
    NavigationContent
  } = useNavigationBuilder(StackRouter, props);
  return /*#__PURE__*/_jsx(NavigationContent, {
    children: descriptors[state.routes[state.index].key].render()
  });
};
export function createStackNavigator() {
  return createNavigatorFactory(StackNavigator)();
}
//# sourceMappingURL=createStackNavigator.js.map