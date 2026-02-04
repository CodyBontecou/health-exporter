"use strict";

import { BaseNavigationContainer, getActionFromState, getPathFromState, getStateFromPath, ThemeProvider, validatePathConfig } from '@react-navigation/core';
import * as React from 'react';
import { I18nManager } from 'react-native';
import useLatestCallback from 'use-latest-callback';
import { LinkingContext } from "./LinkingContext.js";
import { LocaleDirContext } from "./LocaleDirContext.js";
import { DefaultTheme } from "./theming/DefaultTheme.js";
import { UnhandledLinkingContext } from "./UnhandledLinkingContext.js";
import { useBackButton } from './useBackButton';
import { useDocumentTitle } from './useDocumentTitle';
import { useLinking } from './useLinking';
import { useThenable } from "./useThenable.js";
import { jsx as _jsx } from "react/jsx-runtime";
globalThis.REACT_NAVIGATION_DEVTOOLS = new WeakMap();
function NavigationContainerInner({
  direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
  theme = DefaultTheme,
  linking,
  fallback = null,
  documentTitle,
  onReady,
  onStateChange,
  ...rest
}, ref) {
  const isLinkingEnabled = linking ? linking.enabled !== false : false;
  if (linking?.config) {
    validatePathConfig(linking.config);
  }
  const refContainer = React.useRef(null);
  useBackButton(refContainer);
  useDocumentTitle(refContainer, documentTitle);
  const [lastUnhandledLink, setLastUnhandledLink] = React.useState();
  const {
    getInitialState
  } = useLinking(refContainer, {
    enabled: isLinkingEnabled,
    prefixes: [],
    ...linking
  }, setLastUnhandledLink);
  const linkingContext = React.useMemo(() => ({
    options: linking
  }), [linking]);
  const unhandledLinkingContext = React.useMemo(() => ({
    lastUnhandledLink,
    setLastUnhandledLink
  }), [lastUnhandledLink, setLastUnhandledLink]);
  const onReadyForLinkingHandling = useLatestCallback(() => {
    // If the screen path matches lastUnhandledLink, we do not track it
    const path = refContainer.current?.getCurrentRoute()?.path;
    setLastUnhandledLink(previousLastUnhandledLink => {
      if (previousLastUnhandledLink === path) {
        return undefined;
      }
      return previousLastUnhandledLink;
    });
    onReady?.();
  });
  const onStateChangeForLinkingHandling = useLatestCallback(state => {
    // If the screen path matches lastUnhandledLink, we do not track it
    const path = refContainer.current?.getCurrentRoute()?.path;
    setLastUnhandledLink(previousLastUnhandledLink => {
      if (previousLastUnhandledLink === path) {
        return undefined;
      }
      return previousLastUnhandledLink;
    });
    onStateChange?.(state);
  });
  // Add additional linking related info to the ref
  // This will be used by the devtools
  React.useEffect(() => {
    if (refContainer.current) {
      REACT_NAVIGATION_DEVTOOLS.set(refContainer.current, {
        get linking() {
          return {
            ...linking,
            enabled: isLinkingEnabled,
            prefixes: linking?.prefixes ?? [],
            getStateFromPath: linking?.getStateFromPath ?? getStateFromPath,
            getPathFromState: linking?.getPathFromState ?? getPathFromState,
            getActionFromState: linking?.getActionFromState ?? getActionFromState
          };
        }
      });
    }
  });
  const [isResolved, initialState] = useThenable(getInitialState);

  // FIXME
  // @ts-expect-error not sure why this is not working
  React.useImperativeHandle(ref, () => refContainer.current);
  const isLinkingReady = rest.initialState != null || !isLinkingEnabled || isResolved;
  if (!isLinkingReady) {
    return /*#__PURE__*/_jsx(LocaleDirContext.Provider, {
      value: direction,
      children: /*#__PURE__*/_jsx(ThemeProvider, {
        value: theme,
        children: fallback
      })
    });
  }
  return /*#__PURE__*/_jsx(LocaleDirContext.Provider, {
    value: direction,
    children: /*#__PURE__*/_jsx(UnhandledLinkingContext.Provider, {
      value: unhandledLinkingContext,
      children: /*#__PURE__*/_jsx(LinkingContext.Provider, {
        value: linkingContext,
        children: /*#__PURE__*/_jsx(BaseNavigationContainer, {
          ...rest,
          theme: theme,
          onReady: onReadyForLinkingHandling,
          onStateChange: onStateChangeForLinkingHandling,
          initialState: rest.initialState == null ? initialState : rest.initialState,
          ref: refContainer
        })
      })
    })
  });
}

/**
 * Container component that manages the navigation state.
 * This should be rendered at the root wrapping the whole app.
 */
export const NavigationContainer = /*#__PURE__*/React.forwardRef(NavigationContainerInner);
//# sourceMappingURL=NavigationContainer.js.map