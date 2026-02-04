"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;
exports.withPrevAndCurrent = withPrevAndCurrent;
exports.hasProperty = hasProperty;
exports.isJestEnv = isJestEnv;
exports.tagMessage = tagMessage;
exports.isFabric = isFabric;
exports.isRemoteDebuggingEnabled = isRemoteDebuggingEnabled;
exports.deepEqual = deepEqual;
exports.INT32_MAX = void 0;

function toArray(object) {
  if (!Array.isArray(object)) {
    return [object];
  }

  return object;
}

function withPrevAndCurrent(array, mapFn) {
  const previousArr = [null];
  const currentArr = [...array];
  const transformedArr = [];
  currentArr.forEach((current, i) => {
    // This type cast is fine and solves problem mentioned in https://github.com/software-mansion/react-native-gesture-handler/pull/2867 (namely that `previous` can be undefined).
    // Unfortunately, linter on our CI does not allow this type of casting as it is unnecessary. To bypass that we use eslint-disable.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const previous = previousArr[i];
    const transformed = mapFn(previous, current);
    previousArr.push(transformed);
    transformedArr.push(transformed);
  });
  return transformedArr;
} // eslint-disable-next-line @typescript-eslint/ban-types


function hasProperty(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function isJestEnv() {
  // @ts-ignore Do not use `@types/node` because it will prioritise Node types over RN types which breaks the types (ex. setTimeout) in React Native projects.
  return hasProperty(global, 'process') && !!process.env.JEST_WORKER_ID;
}

function tagMessage(msg) {
  return `[react-native-gesture-handler] ${msg}`;
} // Helper method to check whether Fabric is enabled, however global.nativeFabricUIManager
// may not be initialized before the first render


function isFabric() {
  var _global;

  // @ts-expect-error nativeFabricUIManager is not yet included in the RN types
  return !!((_global = global) !== null && _global !== void 0 && _global.nativeFabricUIManager);
}

function isRemoteDebuggingEnabled() {
  // react-native-reanimated checks if in remote debugging in the same way
  // @ts-ignore global is available but node types are not included
  const localGlobal = global;
  return (!localGlobal.nativeCallSyncHook || !!localGlobal.__REMOTEDEV__) && !localGlobal.RN$Bridgeless;
}
/**
 * Recursively compares two objects for deep equality.
 *
 * **Note:** This function does not support cyclic references.
 *
 * @param obj1 - The first object to compare.
 * @param obj2 - The second object to compare.
 * @returns `true` if the objects are deeply equal, `false` otherwise.
 */


function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

const INT32_MAX = 2 ** 31 - 1;
exports.INT32_MAX = INT32_MAX;
//# sourceMappingURL=utils.js.map