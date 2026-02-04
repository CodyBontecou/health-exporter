"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachHandlers = attachHandlers;

var _handlersRegistry = require("../../handlersRegistry");

var _RNGestureHandlerModule = _interopRequireDefault(require("../../../RNGestureHandlerModule"));

var _utils = require("../../utils");

var _ActionType = require("../../../ActionType");

var _reactNative = require("react-native");

var _ghQueueMicrotask = require("../../../ghQueueMicrotask");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attachHandlers({
  preparedGesture,
  gestureConfig,
  gesturesToAttach,
  viewTag,
  webEventHandlersRef
}) {
  gestureConfig.initialize(); // Use queueMicrotask to extract handlerTags, because all refs should be initialized
  // when it's ran

  (0, _ghQueueMicrotask.ghQueueMicrotask)(() => {
    if (!preparedGesture.isMounted) {
      return;
    }

    gestureConfig.prepare();
  });

  for (const handler of gesturesToAttach) {
    (0, _utils2.checkGestureCallbacksForWorklets)(handler);

    _RNGestureHandlerModule.default.createGestureHandler(handler.handlerName, handler.handlerTag, (0, _utils.filterConfig)(handler.config, _utils2.ALLOWED_PROPS));

    (0, _handlersRegistry.registerHandler)(handler.handlerTag, handler, handler.config.testId);
  } // Use queueMicrotask to extract handlerTags, because all refs should be initialized
  // when it's ran


  (0, _ghQueueMicrotask.ghQueueMicrotask)(() => {
    if (!preparedGesture.isMounted) {
      return;
    }

    for (const handler of gesturesToAttach) {
      _RNGestureHandlerModule.default.updateGestureHandler(handler.handlerTag, (0, _utils.filterConfig)(handler.config, _utils2.ALLOWED_PROPS, (0, _utils2.extractGestureRelations)(handler)));
    }

    (0, _utils.scheduleFlushOperations)();
  });

  for (const gesture of gesturesToAttach) {
    const actionType = gesture.shouldUseReanimated ? _ActionType.ActionType.REANIMATED_WORKLET : _ActionType.ActionType.JS_FUNCTION_NEW_API;

    if (_reactNative.Platform.OS === 'web') {
      _RNGestureHandlerModule.default.attachGestureHandler(gesture.handlerTag, viewTag, _ActionType.ActionType.JS_FUNCTION_OLD_API, // Ignored on web
      webEventHandlersRef);
    } else {
      _RNGestureHandlerModule.default.attachGestureHandler(gesture.handlerTag, viewTag, actionType);
    }
  }

  preparedGesture.attachedGestures = gesturesToAttach;

  if (preparedGesture.animatedHandlers) {
    const isAnimatedGesture = g => g.shouldUseReanimated;

    preparedGesture.animatedHandlers.value = gesturesToAttach.filter(isAnimatedGesture).map(g => g.handlers);
  }
}
//# sourceMappingURL=attachHandlers.js.map