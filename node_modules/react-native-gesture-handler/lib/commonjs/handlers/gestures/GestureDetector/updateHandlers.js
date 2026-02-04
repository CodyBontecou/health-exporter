"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHandlers = updateHandlers;

var _handlersRegistry = require("../../handlersRegistry");

var _RNGestureHandlerModule = _interopRequireDefault(require("../../../RNGestureHandlerModule"));

var _utils = require("../../utils");

var _ghQueueMicrotask = require("../../../ghQueueMicrotask");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateHandlers(preparedGesture, gestureConfig, newGestures) {
  gestureConfig.prepare();

  for (let i = 0; i < newGestures.length; i++) {
    const handler = preparedGesture.attachedGestures[i];
    (0, _utils2.checkGestureCallbacksForWorklets)(handler); // Only update handlerTag when it's actually different, it may be the same
    // if gesture config object is wrapped with useMemo

    if (newGestures[i].handlerTag !== handler.handlerTag) {
      newGestures[i].handlerTag = handler.handlerTag;
      newGestures[i].handlers.handlerTag = handler.handlerTag;
    }
  } // Use queueMicrotask to extract handlerTags, because when it's ran, all refs should be updated
  // and handlerTags in BaseGesture references should be updated in the loop above (we need to wait
  // in case of external relations)


  (0, _ghQueueMicrotask.ghQueueMicrotask)(() => {
    if (!preparedGesture.isMounted) {
      return;
    } // If amount of gesture configs changes, we need to update the callbacks in shared value


    let shouldUpdateSharedValueIfUsed = preparedGesture.attachedGestures.length !== newGestures.length;

    for (let i = 0; i < newGestures.length; i++) {
      const handler = preparedGesture.attachedGestures[i]; // If the gestureId is different (gesture isn't wrapped with useMemo or its dependencies changed),
      // we need to update the shared value, assuming the gesture runs on UI thread or the thread changed

      if (handler.handlers.gestureId !== newGestures[i].handlers.gestureId && (newGestures[i].shouldUseReanimated || handler.shouldUseReanimated)) {
        shouldUpdateSharedValueIfUsed = true;
      }

      handler.config = newGestures[i].config;
      handler.handlers = newGestures[i].handlers;

      _RNGestureHandlerModule.default.updateGestureHandler(handler.handlerTag, (0, _utils.filterConfig)(handler.config, _utils2.ALLOWED_PROPS, (0, _utils2.extractGestureRelations)(handler)));

      (0, _handlersRegistry.registerHandler)(handler.handlerTag, handler, handler.config.testId);
    }

    if (preparedGesture.animatedHandlers && shouldUpdateSharedValueIfUsed) {
      const newHandlersValue = preparedGesture.attachedGestures.filter(g => g.shouldUseReanimated) // Ignore gestures that shouldn't run on UI
      .map(g => g.handlers);
      preparedGesture.animatedHandlers.value = newHandlersValue;
    }

    (0, _utils.scheduleFlushOperations)();
  });
}
//# sourceMappingURL=updateHandlers.js.map