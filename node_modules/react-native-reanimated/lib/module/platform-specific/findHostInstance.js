/* eslint-disable camelcase */
'use strict';

import { ReanimatedError } from "../errors.js";
import { isFabric } from "../PlatformChecker.js";
function findHostInstanceFastPath(maybeNativeRef) {
  if (!maybeNativeRef) {
    return undefined;
  }
  if (maybeNativeRef.__internalInstanceHandle && maybeNativeRef.__nativeTag && maybeNativeRef._viewConfig) {
    // This is a native ref to a Fabric component
    return maybeNativeRef;
  }
  if (maybeNativeRef._nativeTag && maybeNativeRef.viewConfig) {
    // This is a native ref to a Paper component
    return maybeNativeRef;
  }
  // That means it’s a ref to a non-native component, and it’s necessary
  // to call `findHostInstance_DEPRECATED` on them.
  return undefined;
}
function resolveFindHostInstance_DEPRECATED() {
  if (findHostInstance_DEPRECATED !== undefined) {
    return;
  }
  if (isFabric()) {
    try {
      const ReactFabric = require('react-native/Libraries/Renderer/shims/ReactFabric');
      // Since RN 0.77 ReactFabric exports findHostInstance_DEPRECATED in default object so we're trying to
      // access it first, then fallback on named export
      findHostInstance_DEPRECATED = ReactFabric?.default?.findHostInstance_DEPRECATED ?? ReactFabric?.findHostInstance_DEPRECATED;
    } catch (e) {
      throw new ReanimatedError('Failed to resolve findHostInstance_DEPRECATED');
    }
  } else {
    const ReactNative = require('react-native/Libraries/Renderer/shims/ReactNative');
    // Since RN 0.77 ReactFabric exports findHostInstance_DEPRECATED in default object so we're trying to
    // access it first, then fallback on named export
    findHostInstance_DEPRECATED = ReactNative?.default?.findHostInstance_DEPRECATED ?? ReactNative?.findHostInstance_DEPRECATED;
  }
}
let findHostInstance_DEPRECATED;
export function findHostInstance(component) {
  // Fast path for native refs
  const hostInstance = findHostInstanceFastPath(component._componentRef);
  if (hostInstance !== undefined) {
    return hostInstance;
  }
  resolveFindHostInstance_DEPRECATED();
  // Fabric implementation of findHostInstance_DEPRECATED doesn't accept a ref as an argument
  return findHostInstance_DEPRECATED(isFabric() ? component : component._componentRef);
}
//# sourceMappingURL=findHostInstance.js.map