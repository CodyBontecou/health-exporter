'use strict';

/* eslint-disable */

export function isFabric() {
  return !!global._IS_FABRIC;
}
let findHostInstance_DEPRECATED;
let getInternalInstanceHandleFromPublicInstance;

// Taken and modifies from reanimated
export function getShadowNodeWrapperAndTagFromRef(ref) {
  // load findHostInstance_DEPRECATED lazily because it may not be available before render
  if (findHostInstance_DEPRECATED === undefined) {
    try {
      findHostInstance_DEPRECATED = require('react-native/Libraries/Renderer/shims/ReactFabric').findHostInstance_DEPRECATED;
    } catch (e) {
      findHostInstance_DEPRECATED = _ref => null;
    }
  }
  if (getInternalInstanceHandleFromPublicInstance === undefined) {
    try {
      getInternalInstanceHandleFromPublicInstance = require('react-native/Libraries/ReactNative/ReactFabricPublicInstance/ReactFabricPublicInstance').getInternalInstanceHandleFromPublicInstance ?? (_ref => _ref._internalInstanceHandle);
    } catch (e) {
      getInternalInstanceHandleFromPublicInstance = _ref => _ref._internalInstanceHandle;
    }
  }

  // taken from https://github.com/facebook/react-native/commit/803bb16531697233686efd475f004c1643e03617#diff-d8172256c6d63b5d32db10e54d7b10f37a26b337d5280d89f5bfd7bcea778292R196
  // @ts-ignore some weird stuff on RN 0.74 - see examples with scrollView
  const scrollViewRef = ref?.getScrollResponder?.()?.getNativeScrollRef?.();
  // @ts-ignore some weird stuff on RN 0.74  - see examples with scrollView
  const otherScrollViewRef = ref?.getNativeScrollRef?.();
  // @ts-ignore some weird stuff on RN 0.74 - see setNativeProps example
  const textInputRef = ref?.__internalInstanceHandle?.stateNode?.node;
  let resolvedRef;
  if (scrollViewRef) {
    resolvedRef = {
      shadowNodeWrapper: scrollViewRef.__internalInstanceHandle.stateNode.node,
      tag: scrollViewRef._nativeTag
    };
  } else if (otherScrollViewRef) {
    resolvedRef = {
      shadowNodeWrapper: otherScrollViewRef.__internalInstanceHandle.stateNode.node,
      tag: otherScrollViewRef.__nativeTag
    };
  } else if (textInputRef) {
    resolvedRef = {
      shadowNodeWrapper: textInputRef,
      tag: ref?.__nativeTag
    };
  } else {
    const hostInstance = findHostInstance_DEPRECATED(ref);
    resolvedRef = {
      shadowNodeWrapper: getInternalInstanceHandleFromPublicInstance(hostInstance).stateNode.node,
      tag: hostInstance?._nativeTag
    };
  }
  return resolvedRef;
}
//# sourceMappingURL=fabricUtils.js.map