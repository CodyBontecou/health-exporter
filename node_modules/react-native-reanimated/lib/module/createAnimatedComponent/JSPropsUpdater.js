'use strict';

import { NativeEventEmitter, Platform } from 'react-native';
import { shouldBeUseWeb } from "../PlatformChecker.js";
import { runOnJS, runOnUIImmediately } from "../threads.js";
import NativeReanimatedModule from "../specs/NativeReanimatedModule.js";
const SHOULD_BE_USE_WEB = shouldBeUseWeb();
class JSPropsUpdaterPaper {
  static _tagToComponentMapping = new Map();
  constructor() {
    this._reanimatedEventEmitter = new NativeEventEmitter(
    // NativeEventEmitter only uses this parameter on iOS and macOS.
    Platform.OS === 'ios' || Platform.OS === 'macos' ? NativeReanimatedModule : undefined);
  }
  addOnJSPropsChangeListener(animatedComponent) {
    const viewTag = animatedComponent.getComponentViewTag();
    JSPropsUpdaterPaper._tagToComponentMapping.set(viewTag, animatedComponent);
    if (JSPropsUpdaterPaper._tagToComponentMapping.size === 1) {
      const listener = data => {
        const component = JSPropsUpdaterPaper._tagToComponentMapping.get(data.viewTag);
        component?._updateFromNative(data.props);
      };
      this._reanimatedEventEmitter.addListener('onReanimatedPropsChange', listener);
    }
  }
  removeOnJSPropsChangeListener(animatedComponent) {
    const viewTag = animatedComponent.getComponentViewTag();
    JSPropsUpdaterPaper._tagToComponentMapping.delete(viewTag);
    if (JSPropsUpdaterPaper._tagToComponentMapping.size === 0) {
      this._reanimatedEventEmitter.removeAllListeners('onReanimatedPropsChange');
    }
  }
}
class JSPropsUpdaterFabric {
  static _tagToComponentMapping = new Map();
  static isInitialized = false;
  constructor() {
    if (!JSPropsUpdaterFabric.isInitialized) {
      const updater = (viewTag, props) => {
        const component = JSPropsUpdaterFabric._tagToComponentMapping.get(viewTag);
        component?._updateFromNative(props);
      };
      runOnUIImmediately(() => {
        'worklet';

        global.updateJSProps = (viewTag, props) => {
          runOnJS(updater)(viewTag, props);
        };
      })();
      JSPropsUpdaterFabric.isInitialized = true;
    }
  }
  addOnJSPropsChangeListener(animatedComponent) {
    if (!JSPropsUpdaterFabric.isInitialized) {
      return;
    }
    const viewTag = animatedComponent.getComponentViewTag();
    JSPropsUpdaterFabric._tagToComponentMapping.set(viewTag, animatedComponent);
  }
  removeOnJSPropsChangeListener(animatedComponent) {
    if (!JSPropsUpdaterFabric.isInitialized) {
      return;
    }
    const viewTag = animatedComponent.getComponentViewTag();
    JSPropsUpdaterFabric._tagToComponentMapping.delete(viewTag);
  }
}
class JSPropsUpdaterWeb {
  addOnJSPropsChangeListener(_animatedComponent) {
    // noop
  }
  removeOnJSPropsChangeListener(_animatedComponent) {
    // noop
  }
}
let JSPropsUpdater;
if (SHOULD_BE_USE_WEB) {
  JSPropsUpdater = JSPropsUpdaterWeb;
} else if (global._IS_FABRIC) {
  JSPropsUpdater = JSPropsUpdaterFabric;
} else {
  JSPropsUpdater = JSPropsUpdaterPaper;
}
export default JSPropsUpdater;
//# sourceMappingURL=JSPropsUpdater.js.map