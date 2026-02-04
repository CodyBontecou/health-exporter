"use strict";

import * as React from 'react';
export function useThenable(create) {
  const [promise] = React.useState(create);
  let initialState = [false, undefined];

  // Check if our thenable is synchronous
  // eslint-disable-next-line promise/catch-or-return, promise/always-return
  promise.then(result => {
    initialState = [true, result];
  });
  const [state, setState] = React.useState(initialState);
  const [resolved] = state;
  React.useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      let result;
      try {
        result = await promise;
      } finally {
        if (!cancelled) {
          setState([true, result]);
        }
      }
    };
    if (!resolved) {
      resolve();
    }
    return () => {
      cancelled = true;
    };
  }, [promise, resolved]);
  return state;
}
//# sourceMappingURL=useThenable.js.map