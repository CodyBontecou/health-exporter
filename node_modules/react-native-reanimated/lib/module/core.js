'use strict';

import NativeReanimatedModule from './NativeReanimated';
import { isWeb, shouldBeUseWeb, isFabric } from "./PlatformChecker.js";
import { makeShareableCloneRecursive } from "./shareables.js";
import { initializeUIRuntime } from "./initializers.js";
import { SensorContainer } from "./SensorContainer.js";
import { ReanimatedError } from "./errors.js";
export { startMapper, stopMapper } from "./mappers.js";
export { runOnJS, runOnUI, executeOnUIRuntimeSync } from "./threads.js";
export { createWorkletRuntime, runOnRuntime } from "./runtimes.js";
export { makeShareable, makeShareableCloneRecursive } from "./shareables.js";
export { makeMutable } from "./mutables.js";
const SHOULD_BE_USE_WEB = shouldBeUseWeb();

/** @returns `true` in Reanimated 3, doesn't exist in Reanimated 2 or 1 */
export const isReanimated3 = () => true;

// Superseded by check in `/src/threads.ts`.
// Used by `react-navigation` to detect if using Reanimated 2 or 3.
/**
 * @deprecated This function was superseded by other checks. We keep it here for
 *   backward compatibility reasons. If you need to check if you are using
 *   Reanimated 3 or Reanimated 2 please use `isReanimated3` function instead.
 * @returns `true` in Reanimated 3, doesn't exist in Reanimated 2
 */
export const isConfigured = isReanimated3;
export function getViewProp(viewTag, propName, component) {
  if (isFabric() && !component) {
    throw new ReanimatedError('Function `getViewProp` requires a component to be passed as an argument on Fabric.');
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return new Promise((resolve, reject) => {
    return NativeReanimatedModule.getViewProp(viewTag, propName, component, result => {
      if (typeof result === 'string' && result.substr(0, 6) === 'error:') {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
}
function getSensorContainer() {
  if (!global.__sensorContainer) {
    global.__sensorContainer = new SensorContainer();
  }
  return global.__sensorContainer;
}
export function registerEventHandler(eventHandler, eventName, emitterReactTag = -1) {
  function handleAndFlushAnimationFrame(eventTimestamp, event) {
    'worklet';

    global.__frameTimestamp = eventTimestamp;
    eventHandler(event);
    global.__flushAnimationFrame(eventTimestamp);
    global.__frameTimestamp = undefined;
  }
  return NativeReanimatedModule.registerEventHandler(makeShareableCloneRecursive(handleAndFlushAnimationFrame), eventName, emitterReactTag);
}
export function unregisterEventHandler(id) {
  return NativeReanimatedModule.unregisterEventHandler(id);
}
export function subscribeForKeyboardEvents(eventHandler, options) {
  // TODO: this should really go with the same code path as other events, that is
  // via registerEventHandler. For now we are copying the code from there.
  function handleAndFlushAnimationFrame(state, height) {
    'worklet';

    const now = global._getAnimationTimestamp();
    global.__frameTimestamp = now;
    eventHandler(state, height);
    global.__flushAnimationFrame(now);
    global.__frameTimestamp = undefined;
  }
  return NativeReanimatedModule.subscribeForKeyboardEvents(makeShareableCloneRecursive(handleAndFlushAnimationFrame), options.isStatusBarTranslucentAndroid ?? false, options.isNavigationBarTranslucentAndroid ?? false);
}
export function unsubscribeFromKeyboardEvents(listenerId) {
  return NativeReanimatedModule.unsubscribeFromKeyboardEvents(listenerId);
}
export function registerSensor(sensorType, config, eventHandler) {
  const sensorContainer = getSensorContainer();
  return sensorContainer.registerSensor(sensorType, config, makeShareableCloneRecursive(eventHandler));
}
export function initializeSensor(sensorType, config) {
  const sensorContainer = getSensorContainer();
  return sensorContainer.initializeSensor(sensorType, config);
}
export function unregisterSensor(sensorId) {
  const sensorContainer = getSensorContainer();
  return sensorContainer.unregisterSensor(sensorId);
}
if (!isWeb()) {
  initializeUIRuntime();
}
let featuresConfig = {
  enableLayoutAnimations: false,
  setByUser: false
};
export function enableLayoutAnimations(flag, isCallByUser = true) {
  if (isCallByUser) {
    featuresConfig = {
      enableLayoutAnimations: flag,
      setByUser: true
    };
    NativeReanimatedModule.enableLayoutAnimations(flag);
  } else if (!featuresConfig.setByUser && featuresConfig.enableLayoutAnimations !== flag) {
    featuresConfig.enableLayoutAnimations = flag;
    NativeReanimatedModule.enableLayoutAnimations(flag);
  }
}
export function configureLayoutAnimationBatch(layoutAnimationsBatch) {
  NativeReanimatedModule.configureLayoutAnimationBatch(layoutAnimationsBatch);
}
export function setShouldAnimateExitingForTag(viewTag, shouldAnimate) {
  NativeReanimatedModule.setShouldAnimateExitingForTag(viewTag, shouldAnimate);
}
export function jsiConfigureProps(uiProps, nativeProps) {
  if (!SHOULD_BE_USE_WEB) {
    NativeReanimatedModule.configureProps(uiProps, nativeProps);
  }
}
//# sourceMappingURL=core.js.map