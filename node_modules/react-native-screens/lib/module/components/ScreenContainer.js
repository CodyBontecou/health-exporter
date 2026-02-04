'use client';

import { Platform, View } from 'react-native';
import React from 'react';
import { isNativePlatformSupported, screensEnabled } from '../core';

// Native components
import ScreenContainerNativeComponent from '../fabric/ScreenContainerNativeComponent';
import ScreenNavigationContainerNativeComponent from '../fabric/ScreenNavigationContainerNativeComponent';
function ScreenContainer(props) {
  const {
    enabled = screensEnabled(),
    hasTwoStates,
    ...rest
  } = props;
  if (enabled && isNativePlatformSupported) {
    if (hasTwoStates) {
      const ScreenNavigationContainer = Platform.OS === 'ios' ? ScreenNavigationContainerNativeComponent : ScreenContainerNativeComponent;
      return /*#__PURE__*/React.createElement(ScreenNavigationContainer, rest);
    }
    return /*#__PURE__*/React.createElement(ScreenContainerNativeComponent, rest);
  }
  return /*#__PURE__*/React.createElement(View, rest);
}
export default ScreenContainer;
//# sourceMappingURL=ScreenContainer.js.map