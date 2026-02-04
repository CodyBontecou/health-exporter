"use strict";

import * as React from 'react';
import { NavigationContainerRefContext } from "./NavigationContainerRefContext.js";
import { NavigationContext } from "./NavigationContext.js";
/**
 * Hook to access the navigation prop of the parent screen anywhere.
 *
 * @returns Navigation prop of the parent screen.
 */
export function useNavigation() {
  const root = React.useContext(NavigationContainerRefContext);
  const navigation = React.useContext(NavigationContext);
  if (navigation === undefined && root === undefined) {
    throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
  }

  // FIXME: Figure out a better way to do this
  return navigation ?? root;
}
//# sourceMappingURL=useNavigation.js.map