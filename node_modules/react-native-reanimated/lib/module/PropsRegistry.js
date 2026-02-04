'use strict';

import { ReanimatedError } from "./errors.js";
import { isFabric } from "./PlatformChecker.js";
import { runOnUI } from "./threads.js";
let VIEW_TAGS = [];
export function removeFromPropsRegistry(viewTag) {
  VIEW_TAGS.push(viewTag);
  if (VIEW_TAGS.length === 1) {
    queueMicrotask(flush);
  }
}
function flush() {
  if (__DEV__ && !isFabric()) {
    throw new ReanimatedError('PropsRegistry is only available on Fabric.');
  }
  runOnUI(removeFromPropsRegistryOnUI)(VIEW_TAGS);
  VIEW_TAGS = [];
}
function removeFromPropsRegistryOnUI(viewTags) {
  'worklet';

  global._removeFromPropsRegistry(viewTags);
}
//# sourceMappingURL=PropsRegistry.js.map