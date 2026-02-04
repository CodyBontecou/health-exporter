"use strict";

import * as React from 'react';
import { useNavigation } from "./useNavigation.js";

/**
 * Hook to get the current focus state of the screen. Returns a `true` if screen is focused, otherwise `false`.
 * This can be used if a component needs to render something based on the focus state.
 */
export function useIsFocused() {
  const navigation = useNavigation();
  const subscribe = React.useCallback(callback => {
    const unsubscribeFocus = navigation.addListener('focus', callback);
    const unsubscribeBlur = navigation.addListener('blur', callback);
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);
  const value = React.useSyncExternalStore(subscribe, navigation.isFocused, navigation.isFocused);
  return value;
}
//# sourceMappingURL=useIsFocused.js.map