import { registerHandler } from '../../handlersRegistry';
import RNGestureHandlerModule from '../../../RNGestureHandlerModule';
import { filterConfig, scheduleFlushOperations } from '../../utils';
import { ActionType } from '../../../ActionType';
import { Platform } from 'react-native';
import { ghQueueMicrotask } from '../../../ghQueueMicrotask';
import { extractGestureRelations, checkGestureCallbacksForWorklets, ALLOWED_PROPS } from './utils';
export function attachHandlers({
  preparedGesture,
  gestureConfig,
  gesturesToAttach,
  viewTag,
  webEventHandlersRef
}) {
  gestureConfig.initialize(); // Use queueMicrotask to extract handlerTags, because all refs should be initialized
  // when it's ran

  ghQueueMicrotask(() => {
    if (!preparedGesture.isMounted) {
      return;
    }

    gestureConfig.prepare();
  });

  for (const handler of gesturesToAttach) {
    checkGestureCallbacksForWorklets(handler);
    RNGestureHandlerModule.createGestureHandler(handler.handlerName, handler.handlerTag, filterConfig(handler.config, ALLOWED_PROPS));
    registerHandler(handler.handlerTag, handler, handler.config.testId);
  } // Use queueMicrotask to extract handlerTags, because all refs should be initialized
  // when it's ran


  ghQueueMicrotask(() => {
    if (!preparedGesture.isMounted) {
      return;
    }

    for (const handler of gesturesToAttach) {
      RNGestureHandlerModule.updateGestureHandler(handler.handlerTag, filterConfig(handler.config, ALLOWED_PROPS, extractGestureRelations(handler)));
    }

    scheduleFlushOperations();
  });

  for (const gesture of gesturesToAttach) {
    const actionType = gesture.shouldUseReanimated ? ActionType.REANIMATED_WORKLET : ActionType.JS_FUNCTION_NEW_API;

    if (Platform.OS === 'web') {
      RNGestureHandlerModule.attachGestureHandler(gesture.handlerTag, viewTag, ActionType.JS_FUNCTION_OLD_API, // Ignored on web
      webEventHandlersRef);
    } else {
      RNGestureHandlerModule.attachGestureHandler(gesture.handlerTag, viewTag, actionType);
    }
  }

  preparedGesture.attachedGestures = gesturesToAttach;

  if (preparedGesture.animatedHandlers) {
    const isAnimatedGesture = g => g.shouldUseReanimated;

    preparedGesture.animatedHandlers.value = gesturesToAttach.filter(isAnimatedGesture).map(g => g.handlers);
  }
}
//# sourceMappingURL=attachHandlers.js.map