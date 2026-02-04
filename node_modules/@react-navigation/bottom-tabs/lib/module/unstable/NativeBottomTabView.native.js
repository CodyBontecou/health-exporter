"use strict";

import { getLabel, Lazy, SafeAreaProviderCompat, Screen as ScreenContent } from '@react-navigation/elements';
import { CommonActions, NavigationMetaContext, StackActions, useTheme } from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import { Platform, PlatformColor } from 'react-native';
import { Tabs } from 'react-native-screens';
import { NativeScreen } from "./NativeScreen/NativeScreen.js";
import { jsx as _jsx } from "react/jsx-runtime";
const meta = {
  type: 'native-tabs'
};
export function NativeBottomTabView({
  state,
  navigation,
  descriptors
}) {
  const {
    dark,
    colors,
    fonts
  } = useTheme();
  const focusedRouteKey = state.routes[state.index].key;
  const previousRouteKeyRef = React.useRef(focusedRouteKey);
  React.useEffect(() => {
    const previousRouteKey = previousRouteKeyRef.current;
    if (previousRouteKey !== focusedRouteKey && descriptors[previousRouteKey]?.options.popToTopOnBlur) {
      const prevRoute = state.routes.find(route => route.key === previousRouteKey);
      if (prevRoute?.state?.type === 'stack' && prevRoute.state.key) {
        const popToTopAction = {
          ...StackActions.popToTop(),
          target: prevRoute.state.key
        };
        navigation.dispatch(popToTopAction);
      }
    }
    previousRouteKeyRef.current = focusedRouteKey;
  }, [descriptors, focusedRouteKey, navigation, state.index, state.routes]);
  const currentOptions = descriptors[state.routes[state.index].key]?.options;
  const {
    fontFamily = Platform.select({
      ios: fonts.medium.fontFamily,
      default: fonts.regular.fontFamily
    }),
    fontWeight = Platform.select({
      ios: fonts.medium.fontWeight,
      default: fonts.regular.fontWeight
    }),
    fontSize,
    fontStyle
  } = currentOptions.tabBarLabelStyle || {};
  const activeTintColor = currentOptions.tabBarActiveTintColor ?? colors.primary;
  const inactiveTintColor = currentOptions.tabBarInactiveTintColor ?? Platform.select({
    ios: PlatformColor('label'),
    default: colors.text
  });
  const activeIndicatorColor = currentOptions?.tabBarActiveIndicatorColor ?? typeof activeTintColor === 'string' ? Color(activeTintColor)?.alpha(0.1).string() : undefined;
  const onTransitionStart = ({
    closing,
    route
  }) => {
    navigation.emit({
      type: 'transitionStart',
      data: {
        closing
      },
      target: route.key
    });
  };
  const onTransitionEnd = ({
    closing,
    route
  }) => {
    navigation.emit({
      type: 'transitionEnd',
      data: {
        closing
      },
      target: route.key
    });
  };
  const tabBarControllerMode = currentOptions.tabBarControllerMode === 'auto' ? 'automatic' : currentOptions.tabBarControllerMode;
  const tabBarMinimizeBehavior = currentOptions.tabBarMinimizeBehavior === 'auto' ? 'automatic' : currentOptions.tabBarMinimizeBehavior;
  const bottomAccessory = currentOptions.bottomAccessory;
  return /*#__PURE__*/_jsx(SafeAreaProviderCompat, {
    children: /*#__PURE__*/_jsx(Tabs.Host, {
      bottomAccessory: bottomAccessory ? environment => bottomAccessory({
        placement: environment
      }) : undefined,
      tabBarItemLabelVisibilityMode: currentOptions?.tabBarLabelVisibilityMode,
      tabBarControllerMode: tabBarControllerMode,
      tabBarMinimizeBehavior: tabBarMinimizeBehavior,
      tabBarTintColor: activeTintColor,
      tabBarItemIconColor: inactiveTintColor,
      tabBarItemIconColorActive: activeTintColor,
      tabBarItemTitleFontColor: inactiveTintColor,
      tabBarItemTitleFontColorActive: activeTintColor,
      tabBarItemTitleFontFamily: fontFamily,
      tabBarItemTitleFontWeight: fontWeight,
      tabBarItemTitleFontSize: fontSize,
      tabBarItemTitleFontSizeActive: fontSize,
      tabBarItemTitleFontStyle: fontStyle,
      tabBarBackgroundColor: currentOptions.tabBarStyle?.backgroundColor ?? colors.card,
      tabBarItemActiveIndicatorColor: activeIndicatorColor,
      tabBarItemActiveIndicatorEnabled: currentOptions?.tabBarActiveIndicatorEnabled,
      tabBarItemRippleColor: currentOptions?.tabBarRippleColor,
      experimentalControlNavigationStateInJS: false,
      onNativeFocusChange: e => {
        const route = state.routes.find(route => route.key === e.nativeEvent.tabKey);
        if (route) {
          navigation.emit({
            type: 'tabPress',
            target: route.key
          });
          const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
          if (!isFocused) {
            navigation.dispatch({
              ...CommonActions.navigate(route.name, route.params),
              target: state.key
            });
          }
        }
      },
      children: state.routes.map((route, index) => {
        const {
          options,
          render,
          navigation
        } = descriptors[route.key];
        const isFocused = state.index === index;
        const isPreloaded = state.preloadedRouteKeys.includes(route.key);
        const {
          title,
          lazy = true,
          tabBarLabel,
          tabBarBadgeStyle,
          tabBarIcon,
          tabBarBadge,
          tabBarSystemItem,
          tabBarBlurEffect = dark ? 'systemMaterialDark' : 'systemMaterial',
          tabBarStyle
        } = options;
        const {
          backgroundColor: tabBarBackgroundColor,
          shadowColor: tabBarShadowColor
        } = tabBarStyle || {};
        const tabTitle =
        // On iOS, `systemItem` already provides a localized label
        // So we should only use `tabBarLabel` if explicitly provided
        Platform.OS === 'ios' && tabBarSystemItem != null ? tabBarLabel : getLabel({
          label: tabBarLabel,
          title
        }, route.name);
        const tabItemAppearance = {
          tabBarItemTitleFontFamily: fontFamily,
          tabBarItemTitleFontSize: fontSize,
          tabBarItemTitleFontWeight: fontWeight,
          tabBarItemTitleFontStyle: fontStyle
        };
        const badgeBackgroundColor = tabBarBadgeStyle?.backgroundColor ?? colors.notification;
        const badgeTextColor = tabBarBadgeStyle?.color ?? (typeof badgeBackgroundColor === 'string' ? Color(badgeBackgroundColor).isLight() ? 'black' : 'white' : undefined);
        const icon = typeof tabBarIcon === 'function' ? getPlatformIcon(tabBarIcon({
          focused: false
        })) : tabBarIcon != null ? getPlatformIcon(tabBarIcon) : undefined;
        const selectedIcon = typeof tabBarIcon === 'function' ? getPlatformIcon(tabBarIcon({
          focused: true
        })) : undefined;
        return /*#__PURE__*/_jsx(Tabs.Screen, {
          onWillDisappear: () => onTransitionStart({
            closing: true,
            route
          }),
          onWillAppear: () => onTransitionStart({
            closing: false,
            route
          }),
          onDidAppear: () => onTransitionEnd({
            closing: false,
            route
          }),
          onDidDisappear: () => onTransitionEnd({
            closing: true,
            route
          }),
          tabKey: route.key,
          icon: icon,
          selectedIcon: selectedIcon?.ios ?? selectedIcon?.shared,
          tabBarItemBadgeBackgroundColor: badgeBackgroundColor,
          tabBarItemBadgeTextColor: badgeTextColor,
          badgeValue: tabBarBadge?.toString(),
          systemItem: tabBarSystemItem,
          isFocused: isFocused,
          title: tabTitle,
          standardAppearance: {
            tabBarBackgroundColor,
            tabBarShadowColor,
            tabBarBlurEffect,
            stacked: {
              normal: tabItemAppearance
            },
            inline: {
              normal: tabItemAppearance
            },
            compactInline: {
              normal: tabItemAppearance
            }
          },
          specialEffects: {
            repeatedTabSelection: {
              popToRoot: true,
              scrollToTop: true
            }
          },
          experimental_userInterfaceStyle: dark ? 'dark' : 'light',
          children: /*#__PURE__*/_jsx(Lazy, {
            enabled: lazy,
            visible: isFocused || isPreloaded,
            children: /*#__PURE__*/_jsx(ScreenWithHeader, {
              isFocused: isFocused,
              route: route,
              navigation: navigation,
              options: options,
              children: /*#__PURE__*/_jsx(NavigationMetaContext.Provider, {
                value: meta,
                children: render()
              })
            })
          })
        }, route.key);
      })
    })
  });
}
function ScreenWithHeader({
  isFocused,
  route,
  navigation,
  options,
  children
}) {
  const {
    headerTransparent,
    header: renderCustomHeader,
    headerShown = renderCustomHeader != null
  } = options;
  const hasNativeHeader = headerShown && renderCustomHeader == null;
  const [wasNativeHeaderShown] = React.useState(hasNativeHeader);
  React.useEffect(() => {
    if (wasNativeHeaderShown !== hasNativeHeader) {
      throw new Error(`Changing 'headerShown' or 'header' options dynamically is not supported when using native header.`);
    }
  }, [wasNativeHeaderShown, hasNativeHeader]);
  if (hasNativeHeader) {
    return /*#__PURE__*/_jsx(NativeScreen, {
      route: route,
      navigation: navigation,
      options: options,
      children: children
    });
  }
  return /*#__PURE__*/_jsx(ScreenContent, {
    focused: isFocused,
    route: route,
    navigation: navigation,
    headerShown: headerShown,
    headerTransparent: headerTransparent,
    header: renderCustomHeader?.({
      route,
      navigation,
      options
    }),
    children: children
  });
}
function getPlatformIcon(icon) {
  return {
    ios: icon?.type === 'sfSymbol' ? icon : icon?.type === 'image' && icon.tinted !== false ? {
      type: 'templateSource',
      templateSource: icon.source
    } : undefined,
    android: icon?.type === 'drawableResource' ? icon : undefined,
    shared: icon?.type === 'image' ? {
      type: 'imageSource',
      imageSource: icon.source
    } : undefined
  };
}
//# sourceMappingURL=NativeBottomTabView.native.js.map