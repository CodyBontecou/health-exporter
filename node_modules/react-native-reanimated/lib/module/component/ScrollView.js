'use strict';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef } from 'react';
import { ScrollView } from 'react-native';
import { createAnimatedComponent } from "../createAnimatedComponent/index.js";
import { useAnimatedRef, useScrollViewOffset } from "../hook/index.js";

// Since createAnimatedComponent return type is ComponentClass that has the props of the argument,
// but not things like NativeMethods, etc. we need to add them manually by extending the type.

const AnimatedScrollViewComponent = createAnimatedComponent(ScrollView);
export const AnimatedScrollView = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    scrollViewOffset,
    ...restProps
  } = props;
  const animatedRef = ref === null ?
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useAnimatedRef() : ref;
  if (scrollViewOffset) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useScrollViewOffset(animatedRef, scrollViewOffset);
  }

  // Set default scrollEventThrottle, because user expects
  // to have continuous scroll events.
  // We set it to 1 so we have peace until
  // there are 960 fps screens.
  if (!('scrollEventThrottle' in restProps)) {
    restProps.scrollEventThrottle = 1;
  }
  return /*#__PURE__*/React.createElement(AnimatedScrollViewComponent, _extends({
    ref: animatedRef
  }, restProps));
});
//# sourceMappingURL=ScrollView.js.map