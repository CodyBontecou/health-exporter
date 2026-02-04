"use strict";

import * as React from 'react';
import { createNavigationContainerRef } from "./createNavigationContainerRef.js";
export function useNavigationContainerRef() {
  const navigation = React.useRef(null);
  if (navigation.current == null) {
    navigation.current = createNavigationContainerRef();
  }
  return navigation.current;
}
//# sourceMappingURL=useNavigationContainerRef.js.map