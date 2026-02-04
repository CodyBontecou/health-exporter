"use strict";

import { NavigationContainerRefContext } from '@react-navigation/core';
import * as React from 'react';
import { useBuildAction } from "./useLinkBuilder.js";

/**
 * Helper to navigate to a screen using a href based on the linking options.
 *
 * @returns function that receives the href to navigate to.
 */
export function useLinkTo() {
  const navigation = React.useContext(NavigationContainerRefContext);
  const buildAction = useBuildAction();
  const linkTo = React.useCallback(href => {
    if (navigation === undefined) {
      throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
    }
    const action = buildAction(href);
    navigation.dispatch(action);
  }, [buildAction, navigation]);
  return linkTo;
}
//# sourceMappingURL=useLinkTo.js.map