"use strict";

import { createComponentForStaticNavigation, createPathConfigForStaticNavigation } from '@react-navigation/core';
import * as React from 'react';
import { NavigationContainer } from "./NavigationContainer.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Create a navigation component from a static navigation config.
 * The returned component is a wrapper around `NavigationContainer`.
 *
 * @param tree Static navigation config.
 * @returns Navigation component to use in your app.
 */
export function createStaticNavigation(tree) {
  const Component = createComponentForStaticNavigation(tree, 'RootNavigator');
  function Navigation({
    linking,
    ...rest
  }, ref) {
    const linkingConfig = React.useMemo(() => {
      const screens = createPathConfigForStaticNavigation(tree, {
        initialRouteName: linking?.config?.initialRouteName
      }, linking?.enabled === 'auto');
      if (!screens) return;
      return {
        path: linking?.config?.path,
        initialRouteName: linking?.config?.initialRouteName,
        screens
      };
    }, [linking?.enabled, linking?.config?.path, linking?.config?.initialRouteName]);
    const memoizedLinking = React.useMemo(() => {
      if (!linking) {
        return undefined;
      }
      const enabled = typeof linking.enabled === 'boolean' ? linking.enabled : linkingConfig?.screens != null;
      return {
        ...linking,
        enabled,
        config: linkingConfig
      };
    }, [linking, linkingConfig]);
    if (linking?.enabled === true && linkingConfig?.screens == null) {
      throw new Error('Linking is enabled but no linking configuration was found for the screens.\n\n' + 'To solve this:\n' + "- Specify a 'linking' property for the screens you want to link to.\n" + "- Or set 'linking.enabled' to 'auto' to generate paths automatically.\n\n" + 'See usage guide: https://reactnavigation.org/docs/static-configuration#linking');
    }
    return /*#__PURE__*/_jsx(NavigationContainer, {
      ...rest,
      ref: ref,
      linking: memoizedLinking,
      children: /*#__PURE__*/_jsx(Component, {})
    });
  }
  return /*#__PURE__*/React.forwardRef(Navigation);
}
//# sourceMappingURL=createStaticNavigation.js.map