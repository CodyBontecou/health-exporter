'use strict';

import { isChromeDebugger, isJest, shouldBeUseWeb } from "../PlatformChecker.js";
import { logger } from "../logger/index.js";
export let setGestureState;
function setGestureStateNative(handlerTag, newState) {
  'worklet';

  if (!_WORKLET) {
    logger.warn('You can not use setGestureState in non-worklet function.');
    return;
  }
  global._setGestureState(handlerTag, newState);
}
function setGestureStateJest() {
  logger.warn('setGestureState() cannot be used with Jest.');
}
function setGestureStateChromeDebugger() {
  logger.warn('setGestureState() cannot be used with Chrome Debugger.');
}
function setGestureStateDefault() {
  logger.warn('setGestureState() is not supported on this configuration.');
}
if (!shouldBeUseWeb()) {
  setGestureState = setGestureStateNative;
} else if (isJest()) {
  setGestureState = setGestureStateJest;
} else if (isChromeDebugger()) {
  setGestureState = setGestureStateChromeDebugger;
} else {
  setGestureState = setGestureStateDefault;
}
//# sourceMappingURL=setGestureState.js.map