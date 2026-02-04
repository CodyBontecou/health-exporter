"use strict";

import { getLabel, Label, PlatformPressable } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import Color from 'color';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { TabBarIcon } from "./TabBarIcon.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const renderButtonDefault = props => /*#__PURE__*/_jsx(PlatformPressable, {
  ...props
});
const SUPPORTS_LARGE_CONTENT_VIEWER = Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13;
export function BottomTabItem({
  route,
  href,
  focused,
  descriptor,
  label,
  icon,
  badge,
  badgeStyle,
  button = renderButtonDefault,
  accessibilityLabel,
  testID,
  onPress,
  onLongPress,
  horizontal,
  compact,
  sidebar,
  variant,
  activeTintColor: customActiveTintColor,
  inactiveTintColor: customInactiveTintColor,
  activeBackgroundColor: customActiveBackgroundColor,
  inactiveBackgroundColor = 'transparent',
  showLabel = true,
  // On iOS 13+, we use `largeContentTitle` for accessibility
  // So we don't need the font to scale up
  // https://developer.apple.com/documentation/uikit/uiview/3183939-largecontenttitle
  allowFontScaling = SUPPORTS_LARGE_CONTENT_VIEWER ? false : undefined,
  labelStyle,
  iconStyle,
  style
}) {
  const {
    colors,
    fonts
  } = useTheme();
  const activeTintColor = customActiveTintColor ?? (variant === 'uikit' && sidebar && horizontal ? Color(colors.primary).isDark() ? 'white' : Color(colors.primary).darken(0.71).string() : colors.primary);
  const inactiveTintColor = customInactiveTintColor === undefined ? variant === 'material' ? Color(colors.text).alpha(0.68).rgb().string() : Color(colors.text).mix(Color(colors.card), 0.5).hex() : customInactiveTintColor;
  const activeBackgroundColor = customActiveBackgroundColor ?? (variant === 'material' ? Color(activeTintColor).alpha(0.12).rgb().string() : sidebar && horizontal ? colors.primary : 'transparent');
  const {
    options
  } = descriptor;
  const labelString = getLabel({
    label: typeof options.tabBarLabel === 'string' ? options.tabBarLabel : undefined,
    title: options.title
  }, route.name);
  let labelInactiveTintColor = inactiveTintColor;
  let iconInactiveTintColor = inactiveTintColor;
  if (variant === 'uikit' && sidebar && horizontal && customInactiveTintColor === undefined) {
    iconInactiveTintColor = colors.primary;
    labelInactiveTintColor = colors.text;
  }
  const renderLabel = ({
    focused
  }) => {
    if (showLabel === false) {
      return null;
    }
    const color = focused ? activeTintColor : labelInactiveTintColor;
    if (typeof label !== 'string') {
      return label({
        focused,
        color,
        position: horizontal ? 'beside-icon' : 'below-icon',
        children: labelString
      });
    }
    return /*#__PURE__*/_jsx(Label, {
      style: [horizontal ? [styles.labelBeside, variant === 'material' ? styles.labelSidebarMaterial : sidebar ? styles.labelSidebarUiKit : compact ? styles.labelBesideUikitCompact : styles.labelBesideUikit, icon == null && {
        marginStart: 0
      }] : styles.labelBeneath, compact || variant === 'uikit' && sidebar && horizontal ? fonts.regular : fonts.medium, labelStyle],
      allowFontScaling: allowFontScaling,
      tintColor: color,
      children: label
    });
  };
  const renderIcon = ({
    focused
  }) => {
    if (icon === undefined) {
      return null;
    }
    const activeOpacity = focused ? 1 : 0;
    const inactiveOpacity = focused ? 0 : 1;
    return /*#__PURE__*/_jsx(TabBarIcon, {
      route: route,
      variant: variant,
      size: compact ? 'compact' : 'regular',
      badge: badge,
      badgeStyle: badgeStyle,
      activeOpacity: activeOpacity,
      allowFontScaling: allowFontScaling,
      inactiveOpacity: inactiveOpacity,
      activeTintColor: activeTintColor,
      inactiveTintColor: iconInactiveTintColor,
      renderIcon: icon,
      style: iconStyle
    });
  };
  const scene = {
    route,
    focused
  };
  const backgroundColor = focused ? activeBackgroundColor : inactiveBackgroundColor;
  const {
    flex
  } = StyleSheet.flatten(style || {});
  const borderRadius = variant === 'material' ? horizontal ? 56 : 16 : sidebar && horizontal ? 10 : 0;
  return /*#__PURE__*/_jsx(View, {
    style: [
    // Clip ripple effect on Android
    {
      borderRadius,
      overflow: variant === 'material' ? 'hidden' : 'visible'
    }, style],
    children: button({
      href,
      onPress,
      onLongPress,
      testID,
      'aria-label': accessibilityLabel,
      'accessibilityLargeContentTitle': labelString,
      'accessibilityShowsLargeContentViewer': true,
      // FIXME: role: 'tab' doesn't seem to work as expected on iOS
      'role': Platform.select({
        ios: 'button',
        default: 'tab'
      }),
      'aria-selected': focused,
      'android_ripple': {
        borderless: true
      },
      'hoverEffect': variant === 'material' || sidebar && horizontal ? {
        color: colors.text
      } : undefined,
      'pressOpacity': 1,
      'style': [styles.tab, {
        flex,
        backgroundColor,
        borderRadius
      }, sidebar ? variant === 'material' ? horizontal ? styles.tabBarSidebarMaterial : styles.tabVerticalMaterial : horizontal ? styles.tabBarSidebarUiKit : styles.tabVerticalUiKit : variant === 'material' ? styles.tabVerticalMaterial : horizontal ? styles.tabHorizontalUiKit : styles.tabVerticalUiKit],
      'children': /*#__PURE__*/_jsxs(React.Fragment, {
        children: [renderIcon(scene), renderLabel(scene)]
      })
    })
  });
}
const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    // Roundness for iPad hover effect
    borderRadius: 10,
    borderCurve: 'continuous'
  },
  tabVerticalUiKit: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 5
  },
  tabVerticalMaterial: {
    padding: 10
  },
  tabHorizontalUiKit: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5
  },
  tabBarSidebarUiKit: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 5
  },
  tabBarSidebarMaterial: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingStart: 16,
    paddingEnd: 24
  },
  labelSidebarMaterial: {
    marginStart: 12
  },
  labelSidebarUiKit: {
    fontSize: 17,
    marginStart: 10
  },
  labelBeneath: {
    fontSize: 10
  },
  labelBeside: {
    marginEnd: 12,
    lineHeight: 24
  },
  labelBesideUikit: {
    fontSize: 13,
    marginStart: 5
  },
  labelBesideUikitCompact: {
    fontSize: 12,
    marginStart: 5
  }
});
//# sourceMappingURL=BottomTabItem.js.map