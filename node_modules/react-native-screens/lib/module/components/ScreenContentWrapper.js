function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import ScreenContentWrapperNativeComponent from '../fabric/ScreenContentWrapperNativeComponent';
function ScreenContentWrapper(props) {
  return /*#__PURE__*/React.createElement(ScreenContentWrapperNativeComponent, _extends({
    collapsable: false
  }, props));
}
export default ScreenContentWrapper;
//# sourceMappingURL=ScreenContentWrapper.js.map