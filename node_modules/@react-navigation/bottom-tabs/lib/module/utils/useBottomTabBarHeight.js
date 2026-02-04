"use strict";

import * as React from 'react';
import { BottomTabBarHeightContext } from "./BottomTabBarHeightContext.js";
export function useBottomTabBarHeight() {
  const height = React.useContext(BottomTabBarHeightContext);
  if (height === undefined) {
    throw new Error("Couldn't find the bottom tab bar height. Are you inside a screen in Bottom Tab Navigator?");
  }
  return height;
}
//# sourceMappingURL=useBottomTabBarHeight.js.map