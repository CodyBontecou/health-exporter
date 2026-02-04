"use strict";

import { createNavigatorFactory, NavigationMetaContext, StackActions, StackRouter, useNavigationBuilder } from '@react-navigation/native';
import * as React from 'react';
import { NativeStackView } from '../views/NativeStackView';
import { jsx as _jsx } from "react/jsx-runtime";
function NativeStackNavigator({
  id,
  initialRouteName,
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
    describe,
    descriptors,
    navigation,
    NavigationContent
  } = useNavigationBuilder(StackRouter, {
    id,
    initialRouteName,
    UNSTABLE_routeNamesChangeBehavior,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    UNSTABLE_router
  });
  const meta = React.useContext(NavigationMetaContext);
  React.useEffect(() => {
    if (meta && 'type' in meta && meta.type === 'native-tabs') {
      // If we're inside native tabs, we don't need to handle popToTop
      // It's handled natively by native tabs
      return;
    }

    // @ts-expect-error: there may not be a tab navigator in parent
    return navigation?.addListener?.('tabPress', e => {
      const isFocused = navigation.isFocused();

      // Run the operation in the next frame so we're sure all listeners have been run
      // This is necessary to know if preventDefault() has been called
      requestAnimationFrame(() => {
        if (state.index > 0 && isFocused && !e.defaultPrevented) {
          // When user taps on already focused tab and we're inside the tab,
          // reset the stack to replicate native behaviour
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: state.key
          });
        }
      });
    });
  }, [meta, navigation, state.index, state.key]);
  return /*#__PURE__*/_jsx(NavigationContent, {
    children: /*#__PURE__*/_jsx(NativeStackView, {
      ...rest,
      state: state,
      navigation: navigation,
      descriptors: descriptors,
      describe: describe
    })
  });
}
export function createNativeStackNavigator(config) {
  return createNavigatorFactory(NativeStackNavigator)(config);
}
//# sourceMappingURL=createNativeStackNavigator.js.map