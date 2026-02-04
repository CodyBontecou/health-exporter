"use strict";

import { getDefaultHeaderHeight, HeaderHeightContext, HeaderShownContext, useFrameSize } from '@react-navigation/elements';
import * as React from 'react';
import { Animated, Platform, StyleSheet, useAnimatedValue, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';
import { debounce } from "./debounce.js";
import { AnimatedHeaderHeightContext } from "./useAnimatedHeaderHeight.js";
import { useHeaderConfig } from "./useHeaderConfig.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ANDROID_DEFAULT_HEADER_HEIGHT = 56;
export function NativeScreen({
  route,
  navigation,
  options,
  children
}) {
  const {
    header: renderCustomHeader,
    headerShown = renderCustomHeader != null,
    headerTransparent,
    headerBackground
  } = options;
  const isModal = false;
  const insets = useSafeAreaInsets();

  // Modals are fullscreen in landscape only on iPhone
  const isIPhone = Platform.OS === 'ios' && !(Platform.isPad || Platform.isTV);
  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);
  const isLandscape = useFrameSize(frame => frame.width > frame.height);
  const topInset = isParentHeaderShown || Platform.OS === 'ios' && isModal || isIPhone && isLandscape ? 0 : insets.top;
  const defaultHeaderHeight = useFrameSize(frame => Platform.select({
    // FIXME: Currently screens isn't using Material 3
    // So our `getDefaultHeaderHeight` doesn't return the correct value
    // So we hardcode the value here for now until screens is updated
    android: ANDROID_DEFAULT_HEADER_HEIGHT + topInset,
    default: getDefaultHeaderHeight(frame, isModal, topInset)
  }));
  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setHeaderHeightDebounced = React.useCallback(
  // Debounce the header height updates to avoid excessive re-renders
  debounce(setHeaderHeight, 100), []);
  const hasCustomHeader = renderCustomHeader != null;
  const animatedHeaderHeight = useAnimatedValue(defaultHeaderHeight);
  const headerTopInsetEnabled = topInset !== 0;
  const onHeaderHeightChange = Animated.event([{
    nativeEvent: {
      headerHeight: animatedHeaderHeight
    }
  }], {
    useNativeDriver: true,
    listener: e => {
      if (hasCustomHeader) {
        // If we have a custom header, don't use native header height
        return;
      }
      if (e.nativeEvent && typeof e.nativeEvent === 'object' && 'headerHeight' in e.nativeEvent && typeof e.nativeEvent.headerHeight === 'number') {
        const headerHeight = e.nativeEvent.headerHeight;

        // Only debounce if header has large title or search bar
        // As it's the only case where the header height can change frequently
        const doesHeaderAnimate = Platform.OS === 'ios' && (options.headerLargeTitleEnabled || options.headerSearchBarOptions);
        if (doesHeaderAnimate) {
          setHeaderHeightDebounced(headerHeight);
        } else {
          setHeaderHeight(headerHeight);
        }
      }
    }
  });
  const headerConfig = useHeaderConfig({
    ...options,
    route,
    headerHeight,
    headerShown: hasCustomHeader ? false : headerShown === true,
    headerTopInsetEnabled
  });
  return /*#__PURE__*/_jsx(ScreenStack, {
    style: styles.container,
    children: /*#__PURE__*/_jsx(ScreenStackItem, {
      screenId: route.key
      // Needed to show search bar in tab bar with systemItem=search
      ,
      stackPresentation: "push",
      headerConfig: headerConfig,
      onHeaderHeightChange: onHeaderHeightChange,
      children: /*#__PURE__*/_jsx(AnimatedHeaderHeightContext.Provider, {
        value: animatedHeaderHeight,
        children: /*#__PURE__*/_jsxs(HeaderHeightContext.Provider, {
          value: headerShown ? headerHeight : parentHeaderHeight ?? 0,
          children: [headerBackground != null ?
          /*#__PURE__*/
          /**
           * To show a custom header background, we render it at the top of the screen below the header
           * The header also needs to be positioned absolutely (with `translucent` style)
           */
          _jsx(View, {
            style: [styles.background, headerTransparent ? styles.translucent : null, {
              height: headerHeight
            }],
            children: headerBackground()
          }) : null, hasCustomHeader && headerShown ? /*#__PURE__*/_jsx(View, {
            onLayout: e => {
              const headerHeight = e.nativeEvent.layout.height;
              setHeaderHeight(headerHeight);
              animatedHeaderHeight.setValue(headerHeight);
            },
            style: [styles.header, headerTransparent ? styles.absolute : null],
            children: renderCustomHeader?.({
              route,
              navigation,
              options
            })
          }) : null, /*#__PURE__*/_jsx(HeaderShownContext.Provider, {
            value: isParentHeaderShown || headerShown,
            children: children
          })]
        })
      })
    })
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    zIndex: 1
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0
  },
  translucent: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    zIndex: 1,
    elevation: 1
  },
  background: {
    overflow: 'hidden'
  }
});
//# sourceMappingURL=NativeScreen.js.map