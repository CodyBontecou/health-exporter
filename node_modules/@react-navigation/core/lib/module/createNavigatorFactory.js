"use strict";

import { Group } from "./Group.js";
import { Screen } from "./Screen.js";

/**
 * Higher order component to create a `Navigator` and `Screen` pair.
 * Custom navigators should wrap the navigator component in `createNavigator` before exporting.
 *
 * @param Navigator The navigator component to wrap.
 * @returns Factory method to create a `Navigator` and `Screen` pair.
 */
export function createNavigatorFactory(Navigator) {
  function createNavigator(config) {
    if (config != null) {
      return {
        Navigator,
        Screen,
        Group,
        config
      };
    }
    return {
      Navigator,
      Screen,
      Group
    };
  }
  return createNavigator;
}
//# sourceMappingURL=createNavigatorFactory.js.map