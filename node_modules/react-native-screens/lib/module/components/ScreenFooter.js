import React from 'react';
import ScreenFooterNativeComponent from '../fabric/ScreenFooterNativeComponent';

/**
 * Unstable API
 */
function ScreenFooter(props) {
  return /*#__PURE__*/React.createElement(ScreenFooterNativeComponent, props);
}
export function FooterComponent({
  children
}) {
  return /*#__PURE__*/React.createElement(ScreenFooter, {
    collapsable: false
  }, children);
}
export default ScreenFooter;
//# sourceMappingURL=ScreenFooter.js.map