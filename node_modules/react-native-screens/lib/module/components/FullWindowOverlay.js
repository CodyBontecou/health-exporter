import React from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

// Native components
import FullWindowOverlayNativeComponent from '../fabric/FullWindowOverlayNativeComponent';
const NativeFullWindowOverlay = FullWindowOverlayNativeComponent;
function FullWindowOverlay(props) {
  const {
    width,
    height
  } = useWindowDimensions();
  if (Platform.OS !== 'ios') {
    console.warn('Using FullWindowOverlay is only valid on iOS devices.');
    return /*#__PURE__*/React.createElement(View, props);
  }
  return /*#__PURE__*/React.createElement(NativeFullWindowOverlay, {
    style: [StyleSheet.absoluteFill, {
      width,
      height
    }]
  }, props.children);
}
export default FullWindowOverlay;
//# sourceMappingURL=FullWindowOverlay.js.map