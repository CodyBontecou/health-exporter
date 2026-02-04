'use strict';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useRef } from 'react';
import { FlatList } from 'react-native';
import { AnimatedView } from "./View.js";
import { createAnimatedComponent } from "../createAnimatedComponent/index.js";
import { LayoutAnimationConfig } from "./LayoutAnimationConfig.js";
const AnimatedFlatList = createAnimatedComponent(FlatList);
const createCellRendererComponent = itemLayoutAnimationRef => {
  const CellRendererComponent = props => {
    return /*#__PURE__*/React.createElement(AnimatedView
    // TODO TYPESCRIPT This is temporary cast is to get rid of .d.ts file.
    , {
      layout: itemLayoutAnimationRef?.current,
      onLayout: props.onLayout,
      style: props.style
    }, props.children);
  };
  return CellRendererComponent;
};

// Since createAnimatedComponent return type is ComponentClass that has the props of the argument,
// but not things like NativeMethods, etc. we need to add them manually by extending the type.

// We need explicit any here, because this is the exact same type that is used in React Native types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlatListForwardRefRender = function (props, ref) {
  const {
    itemLayoutAnimation,
    skipEnteringExitingAnimations,
    ...restProps
  } = props;

  // Set default scrollEventThrottle, because user expects
  // to have continuous scroll events and
  // react-native defaults it to 50 for FlatLists.
  // We set it to 1, so we have peace until
  // there are 960 fps screens.
  if (!('scrollEventThrottle' in restProps)) {
    restProps.scrollEventThrottle = 1;
  }
  const itemLayoutAnimationRef = useRef(itemLayoutAnimation);
  itemLayoutAnimationRef.current = itemLayoutAnimation;
  const CellRendererComponent = React.useMemo(() => createCellRendererComponent(itemLayoutAnimationRef), [itemLayoutAnimationRef]);
  const animatedFlatList =
  /*#__PURE__*/
  // @ts-expect-error In its current type state, createAnimatedComponent cannot create generic components.
  React.createElement(AnimatedFlatList, _extends({
    ref: ref
  }, restProps, {
    CellRendererComponent: CellRendererComponent
  }));
  if (skipEnteringExitingAnimations === undefined) {
    return animatedFlatList;
  }
  return /*#__PURE__*/React.createElement(LayoutAnimationConfig, {
    skipEntering: true,
    skipExiting: true
  }, animatedFlatList);
};
export const ReanimatedFlatList = /*#__PURE__*/forwardRef(FlatListForwardRefRender);
//# sourceMappingURL=FlatList.js.map