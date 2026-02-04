import { unregisterHandler } from '../../handlersRegistry';
import RNGestureHandlerModule from '../../../RNGestureHandlerModule';
import { scheduleFlushOperations } from '../../utils';
export function dropHandlers(preparedGesture) {
  for (const handler of preparedGesture.attachedGestures) {
    RNGestureHandlerModule.dropGestureHandler(handler.handlerTag);
    unregisterHandler(handler.handlerTag, handler.config.testId);
  }

  scheduleFlushOperations();
}
//# sourceMappingURL=dropHandlers.js.map