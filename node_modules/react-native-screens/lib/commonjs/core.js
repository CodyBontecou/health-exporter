"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableFreeze = enableFreeze;
exports.enableScreens = enableScreens;
exports.freezeEnabled = freezeEnabled;
exports.isNativePlatformSupported = void 0;
exports.screensEnabled = screensEnabled;
var _reactNative = require("react-native");
const isNativePlatformSupported = exports.isNativePlatformSupported = _reactNative.Platform.OS === 'ios' || _reactNative.Platform.OS === 'android' || _reactNative.Platform.OS === 'windows';
let ENABLE_SCREENS = isNativePlatformSupported;
function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = shouldEnableScreens;
  if (!isNativePlatformSupported) {
    return;
  }
  if (ENABLE_SCREENS && !_reactNative.UIManager.getViewManagerConfig('RNSScreen')) {
    console.error(`Screen native module hasn't been linked. Please check the react-native-screens README for more details`);
  }
}
let ENABLE_FREEZE = false;
function enableFreeze(shouldEnableReactFreeze = true) {
  if (!isNativePlatformSupported) {
    return;
  }
  ENABLE_FREEZE = shouldEnableReactFreeze;
}
function screensEnabled() {
  return ENABLE_SCREENS;
}
function freezeEnabled() {
  return ENABLE_FREEZE;
}
//# sourceMappingURL=core.js.map