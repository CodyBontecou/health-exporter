/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
'use strict';

import { processColorsInProps } from "./Colors.js";
import { _updatePropsJS } from "./js-reanimated/index.js";
import { isFabric, isJest, shouldBeUseWeb } from "./PlatformChecker.js";
import { runOnUIImmediately } from "./threads.js";
import { ReanimatedError } from "./errors.js";
let updateProps;
if (shouldBeUseWeb()) {
  updateProps = (viewDescriptors, updates, isAnimatedProps) => {
    'worklet';

    viewDescriptors.value?.forEach(viewDescriptor => {
      const component = viewDescriptor.tag;
      _updatePropsJS(updates, component, isAnimatedProps);
    });
  };
} else {
  updateProps = (viewDescriptors, updates) => {
    'worklet';

    processColorsInProps(updates);
    global.UpdatePropsManager.update(viewDescriptors, updates);
  };
}
export const updatePropsJestWrapper = (viewDescriptors, updates, animatedStyle, adapters) => {
  adapters.forEach(adapter => {
    adapter(updates);
  });
  animatedStyle.current.value = {
    ...animatedStyle.current.value,
    ...updates
  };
  updateProps(viewDescriptors, updates);
};
export default updateProps;
const createUpdatePropsManager = isFabric() ? () => {
  'worklet';

  // Fabric
  const operations = [];
  return {
    update(viewDescriptors, updates) {
      viewDescriptors.value.forEach(viewDescriptor => {
        operations.push({
          shadowNodeWrapper: viewDescriptor.shadowNodeWrapper,
          updates
        });
        if (operations.length === 1) {
          queueMicrotask(this.flush);
        }
      });
    },
    flush() {
      global._updatePropsFabric(operations);
      operations.length = 0;
    }
  };
} : () => {
  'worklet';

  // Paper
  const operations = [];
  return {
    update(viewDescriptors, updates) {
      viewDescriptors.value.forEach(viewDescriptor => {
        operations.push({
          tag: viewDescriptor.tag,
          name: viewDescriptor.name || 'RCTView',
          updates
        });
        if (operations.length === 1) {
          queueMicrotask(this.flush);
        }
      });
    },
    flush() {
      global._updatePropsPaper(operations);
      operations.length = 0;
    }
  };
};
if (shouldBeUseWeb()) {
  const maybeThrowError = () => {
    // Jest attempts to access a property of this object to check if it is a Jest mock
    // so we can't throw an error in the getter.
    if (!isJest()) {
      throw new ReanimatedError('`UpdatePropsManager` is not available on non-native platform.');
    }
  };
  global.UpdatePropsManager = new Proxy({}, {
    get: maybeThrowError,
    set: () => {
      maybeThrowError();
      return false;
    }
  });
} else {
  runOnUIImmediately(() => {
    'worklet';

    global.UpdatePropsManager = createUpdatePropsManager();
  })();
}

/**
 * This used to be `SharedValue<Descriptors[]>` but objects holding just a
 * single `value` prop are fine too.
 */
//# sourceMappingURL=UpdateProps.js.map