'use strict';

import { checkCppVersion } from "../platform-specific/checkCppVersion.js";
import { jsVersion } from "../platform-specific/jsVersion.js";
import { getValueUnpackerCode } from "../valueUnpacker.js";
import { isFabric } from "../PlatformChecker.js";
import { getShadowNodeWrapperFromRef } from '../fabricUtils';
import ReanimatedModule from "../specs/NativeReanimatedModule.js";
import { ReanimatedError } from "../errors.js";

// this is the type of `__reanimatedModuleProxy` which is injected using JSI

function assertSingleReanimatedInstance() {
  if (global._REANIMATED_VERSION_JS !== undefined && global._REANIMATED_VERSION_JS !== jsVersion) {
    throw new ReanimatedError(`Another instance of Reanimated was detected.
See \`https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#another-instance-of-reanimated-was-detected\` for more details. Previous: ${global._REANIMATED_VERSION_JS}, current: ${jsVersion}.`);
  }
}
export class NativeReanimated {
  constructor() {
    // These checks have to split since version checking depend on the execution order
    if (__DEV__) {
      assertSingleReanimatedInstance();
    }
    global._REANIMATED_VERSION_JS = jsVersion;
    if (global.__reanimatedModuleProxy === undefined) {
      const valueUnpackerCode = getValueUnpackerCode();
      ReanimatedModule?.installTurboModule(valueUnpackerCode);
    }
    if (global.__reanimatedModuleProxy === undefined) {
      throw new ReanimatedError(`Native part of Reanimated doesn't seem to be initialized.
See https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#native-part-of-reanimated-doesnt-seem-to-be-initialized for more details.`);
    }
    if (__DEV__) {
      checkCppVersion();
    }
    this.InnerNativeModule = global.__reanimatedModuleProxy;
  }
  makeShareableClone(value, shouldPersistRemote, nativeStateSource) {
    return this.InnerNativeModule.makeShareableClone(value, shouldPersistRemote, nativeStateSource);
  }
  scheduleOnUI(shareable) {
    return this.InnerNativeModule.scheduleOnUI(shareable);
  }
  executeOnUIRuntimeSync(shareable) {
    return this.InnerNativeModule.executeOnUIRuntimeSync(shareable);
  }
  createWorkletRuntime(name, initializer) {
    return this.InnerNativeModule.createWorkletRuntime(name, initializer);
  }
  scheduleOnRuntime(workletRuntime, shareableWorklet) {
    return this.InnerNativeModule.scheduleOnRuntime(workletRuntime, shareableWorklet);
  }
  registerSensor(sensorType, interval, iosReferenceFrame, handler) {
    return this.InnerNativeModule.registerSensor(sensorType, interval, iosReferenceFrame, handler);
  }
  unregisterSensor(sensorId) {
    return this.InnerNativeModule.unregisterSensor(sensorId);
  }
  registerEventHandler(eventHandler, eventName, emitterReactTag) {
    return this.InnerNativeModule.registerEventHandler(eventHandler, eventName, emitterReactTag);
  }
  unregisterEventHandler(id) {
    return this.InnerNativeModule.unregisterEventHandler(id);
  }
  getViewProp(viewTag, propName, component,
  // required on Fabric
  callback) {
    let shadowNodeWrapper;
    if (isFabric()) {
      shadowNodeWrapper = getShadowNodeWrapperFromRef(component);
      return this.InnerNativeModule.getViewProp(shadowNodeWrapper, propName, callback);
    }
    return this.InnerNativeModule.getViewProp(viewTag, propName, callback);
  }
  configureLayoutAnimationBatch(layoutAnimationsBatch) {
    this.InnerNativeModule.configureLayoutAnimationBatch(layoutAnimationsBatch);
  }
  setShouldAnimateExitingForTag(viewTag, shouldAnimate) {
    this.InnerNativeModule.setShouldAnimateExitingForTag(viewTag, shouldAnimate);
  }
  enableLayoutAnimations(flag) {
    this.InnerNativeModule.enableLayoutAnimations(flag);
  }
  configureProps(uiProps, nativeProps) {
    this.InnerNativeModule.configureProps(uiProps, nativeProps);
  }
  subscribeForKeyboardEvents(handler, isStatusBarTranslucent, isNavigationBarTranslucent) {
    return this.InnerNativeModule.subscribeForKeyboardEvents(handler, isStatusBarTranslucent, isNavigationBarTranslucent);
  }
  unsubscribeFromKeyboardEvents(listenerId) {
    this.InnerNativeModule.unsubscribeFromKeyboardEvents(listenerId);
  }
}
//# sourceMappingURL=NativeReanimated.js.map