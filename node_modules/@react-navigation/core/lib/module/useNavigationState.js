"use strict";

import * as React from 'react';
import useLatestCallback from 'use-latest-callback';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
export function useNavigationState(selector) {
  const stateListener = React.useContext(NavigationStateListenerContext);
  if (stateListener == null) {
    throw new Error("Couldn't get the navigation state. Is your component inside a navigator?");
  }
  const value = useSyncExternalStoreWithSelector(stateListener.subscribe,
  // @ts-expect-error: this is unsafe, but needed to make the generic work
  stateListener.getState, stateListener.getState, selector);
  return value;
}
export function NavigationStateListenerProvider({
  state,
  children
}) {
  const listeners = React.useRef([]);
  const getState = useLatestCallback(() => state);
  const subscribe = useLatestCallback(callback => {
    listeners.current.push(callback);
    return () => {
      listeners.current = listeners.current.filter(cb => cb !== callback);
    };
  });
  React.useEffect(() => {
    listeners.current.forEach(callback => callback());
  }, [state]);
  const context = React.useMemo(() => ({
    getState,
    subscribe
  }), [getState, subscribe]);
  return /*#__PURE__*/_jsx(NavigationStateListenerContext.Provider, {
    value: context,
    children: children
  });
}
const NavigationStateListenerContext = /*#__PURE__*/React.createContext(undefined);
//# sourceMappingURL=useNavigationState.js.map