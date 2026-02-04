"use strict";

import { getHeaderTitle, Header, HeaderBackButton, HeaderBackContext, SafeAreaProviderCompat, Screen, useHeaderHeight } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import * as React from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { AnimatedHeaderHeightContext } from "../utils/useAnimatedHeaderHeight.js";
import { jsx as _jsx } from "react/jsx-runtime";
const TRANSPARENT_PRESENTATIONS = ['transparentModal', 'containedTransparentModal'];
export function NativeStackView({
  state,
  descriptors,
  describe
}) {
  const parentHeaderBack = React.useContext(HeaderBackContext);
  const {
    buildHref
  } = useLinkBuilder();
  const preloadedDescriptors = state.preloadedRoutes.reduce((acc, route) => {
    acc[route.key] = acc[route.key] || describe(route, true);
    return acc;
  }, {});
  return /*#__PURE__*/_jsx(SafeAreaProviderCompat, {
    children: state.routes.concat(state.preloadedRoutes).map((route, i) => {
      const isFocused = state.index === i;
      const previousKey = state.routes[i - 1]?.key;
      const nextKey = state.routes[i + 1]?.key;
      const previousDescriptor = previousKey ? descriptors[previousKey] : undefined;
      const nextDescriptor = nextKey ? descriptors[nextKey] : undefined;
      const {
        options,
        navigation,
        render
      } = descriptors[route.key] ?? preloadedDescriptors[route.key];
      const headerBack = previousDescriptor ? {
        title: getHeaderTitle(previousDescriptor.options, previousDescriptor.route.name),
        href: buildHref(previousDescriptor.route.name, previousDescriptor.route.params)
      } : parentHeaderBack;
      const canGoBack = headerBack != null;
      const {
        header,
        headerShown,
        headerBackIcon,
        headerBackImageSource,
        headerLeft,
        headerTransparent,
        headerBackTitle,
        presentation,
        contentStyle,
        ...rest
      } = options;
      const nextPresentation = nextDescriptor?.options.presentation;
      const isPreloaded = preloadedDescriptors[route.key] !== undefined && descriptors[route.key] === undefined;
      return /*#__PURE__*/_jsx(Screen, {
        focused: isFocused,
        route: route,
        navigation: navigation,
        headerShown: headerShown,
        headerTransparent: headerTransparent,
        header: header !== undefined ? header({
          back: headerBack,
          options,
          route,
          navigation
        }) : /*#__PURE__*/_jsx(Header, {
          ...rest,
          back: headerBack,
          title: getHeaderTitle(options, route.name),
          headerLeft: typeof headerLeft === 'function' ? ({
            label,
            ...rest
          }) => headerLeft({
            ...rest,
            label: headerBackTitle ?? label
          }) : headerLeft === undefined && canGoBack ? ({
            tintColor,
            label,
            ...rest
          }) => /*#__PURE__*/_jsx(HeaderBackButton, {
            ...rest,
            label: headerBackTitle ?? label,
            tintColor: tintColor,
            backImage: headerBackIcon !== undefined || headerBackImageSource !== undefined ? () => /*#__PURE__*/_jsx(Image, {
              source: headerBackIcon?.source ?? headerBackImageSource,
              resizeMode: "contain",
              tintColor: tintColor,
              style: styles.backImage
            }) : undefined,
            onPress: navigation.goBack
          }) : headerLeft,
          headerTransparent: headerTransparent
        }),
        style: [StyleSheet.absoluteFill, {
          display: (isFocused || nextPresentation != null && TRANSPARENT_PRESENTATIONS.includes(nextPresentation)) && !isPreloaded ? 'flex' : 'none'
        }, presentation != null && TRANSPARENT_PRESENTATIONS.includes(presentation) ? {
          backgroundColor: 'transparent'
        } : null],
        children: /*#__PURE__*/_jsx(HeaderBackContext.Provider, {
          value: headerBack,
          children: /*#__PURE__*/_jsx(AnimatedHeaderHeightProvider, {
            children: /*#__PURE__*/_jsx(View, {
              style: [styles.contentContainer, contentStyle],
              children: render()
            })
          })
        })
      }, route.key);
    })
  });
}
const AnimatedHeaderHeightProvider = ({
  children
}) => {
  const headerHeight = useHeaderHeight();
  const [animatedHeaderHeight] = React.useState(() => new Animated.Value(headerHeight));
  React.useEffect(() => {
    animatedHeaderHeight.setValue(headerHeight);
  }, [animatedHeaderHeight, headerHeight]);
  return /*#__PURE__*/_jsx(AnimatedHeaderHeightContext.Provider, {
    value: animatedHeaderHeight,
    children: children
  });
};
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },
  backImage: {
    height: 24,
    width: 24,
    margin: 3
  }
});
//# sourceMappingURL=NativeStackView.js.map