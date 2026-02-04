'use strict';

import { useRef } from 'react';
import { useSharedValue } from "./useSharedValue.js";
import { getShadowNodeWrapperFromRef } from '../fabricUtils';
import { makeShareableCloneRecursive } from "../shareables.js";
import { shareableMappingCache } from "../shareableMappingCache.js";
import { Platform } from 'react-native';
import { findNodeHandle } from '../platformFunctions/findNodeHandle';
import { isFabric, isWeb } from "../PlatformChecker.js";
const IS_WEB = isWeb();
function getComponentOrScrollable(component) {
  if (isFabric() && component.getNativeScrollRef) {
    return component.getNativeScrollRef();
  } else if (!isFabric() && component.getScrollableNode) {
    return component.getScrollableNode();
  }
  return component;
}

/**
 * Lets you get a reference of a view that you can use inside a worklet.
 *
 * @returns An object with a `.current` property which contains an instance of a
 *   component.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef
 */
export function useAnimatedRef() {
  const tag = useSharedValue(-1);
  const viewName = useSharedValue(null);
  const ref = useRef();
  if (!ref.current) {
    const fun = component => {
      // enters when ref is set by attaching to a component
      if (component) {
        const getTagValueFunction = isFabric() ? getShadowNodeWrapperFromRef : findNodeHandle;
        const getTagOrShadowNodeWrapper = () => {
          return IS_WEB ? getComponentOrScrollable(component) : getTagValueFunction(getComponentOrScrollable(component));
        };
        tag.value = getTagOrShadowNodeWrapper();

        // On Fabric we have to unwrap the tag from the shadow node wrapper
        fun.getTag = isFabric() ? () => findNodeHandle(getComponentOrScrollable(component)) : getTagOrShadowNodeWrapper;
        fun.current = component;
        // viewName is required only on iOS with Paper
        if (Platform.OS === 'ios' && !isFabric()) {
          viewName.value = component?.viewConfig?.uiViewClassName || 'RCTView';
        }
      }
      return tag.value;
    };
    fun.current = null;
    const animatedRefShareableHandle = makeShareableCloneRecursive({
      __init: () => {
        'worklet';

        const f = () => tag.value;
        f.viewName = viewName;
        return f;
      }
    });
    shareableMappingCache.set(fun, animatedRefShareableHandle);
    ref.current = fun;
  }
  return ref.current;
}
//# sourceMappingURL=useAnimatedRef.js.map