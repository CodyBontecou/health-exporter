function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { maybeInitializeFabric } from '../init';
import GestureHandlerRootViewContext from '../GestureHandlerRootViewContext';
export default function GestureHandlerRootView({
  style,
  ...rest
}) {
  // Try initialize fabric on the first render, at this point we can
  // reliably check if fabric is enabled (the function contains a flag
  // to make sure it's called only once)
  maybeInitializeFabric();
  return /*#__PURE__*/React.createElement(GestureHandlerRootViewContext.Provider, {
    value: true
  }, /*#__PURE__*/React.createElement(View, _extends({
    style: style !== null && style !== void 0 ? style : styles.container
  }, rest)));
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=GestureHandlerRootView.js.map