import { CALLBACK_TYPE } from '../gesture';
import { Reanimated } from '../reanimatedWrapper';
import { GestureStateManager } from '../gestureStateManager';
import { State } from '../../../State';
import { TouchEventType } from '../../../TouchEventType';
import { tagMessage } from '../../../utils';

function getHandler(type, gesture) {
  'worklet';

  switch (type) {
    case CALLBACK_TYPE.BEGAN:
      return gesture.onBegin;

    case CALLBACK_TYPE.START:
      return gesture.onStart;

    case CALLBACK_TYPE.UPDATE:
      return gesture.onUpdate;

    case CALLBACK_TYPE.CHANGE:
      return gesture.onChange;

    case CALLBACK_TYPE.END:
      return gesture.onEnd;

    case CALLBACK_TYPE.FINALIZE:
      return gesture.onFinalize;

    case CALLBACK_TYPE.TOUCHES_DOWN:
      return gesture.onTouchesDown;

    case CALLBACK_TYPE.TOUCHES_MOVE:
      return gesture.onTouchesMove;

    case CALLBACK_TYPE.TOUCHES_UP:
      return gesture.onTouchesUp;

    case CALLBACK_TYPE.TOUCHES_CANCELLED:
      return gesture.onTouchesCancelled;
  }
}

function touchEventTypeToCallbackType(eventType) {
  'worklet';

  switch (eventType) {
    case TouchEventType.TOUCHES_DOWN:
      return CALLBACK_TYPE.TOUCHES_DOWN;

    case TouchEventType.TOUCHES_MOVE:
      return CALLBACK_TYPE.TOUCHES_MOVE;

    case TouchEventType.TOUCHES_UP:
      return CALLBACK_TYPE.TOUCHES_UP;

    case TouchEventType.TOUCHES_CANCELLED:
      return CALLBACK_TYPE.TOUCHES_CANCELLED;
  }

  return CALLBACK_TYPE.UNDEFINED;
}

function runWorklet(type, gesture, event, ...args) {
  'worklet';

  const handler = getHandler(type, gesture);

  if (gesture.isWorklet[type]) {
    // @ts-ignore Logic below makes sure the correct event is send to the
    // correct handler.
    handler === null || handler === void 0 ? void 0 : handler(event, ...args);
  } else if (handler) {
    console.warn(tagMessage('Animated gesture callback must be a worklet'));
  }
}

function isStateChangeEvent(event) {
  'worklet'; // @ts-ignore Yes, the oldState prop is missing on GestureTouchEvent, that's the point

  return event.oldState != null;
}

function isTouchEvent(event) {
  'worklet';

  return event.eventType != null;
}

export function useAnimatedGesture(preparedGesture, needsRebuild) {
  if (!Reanimated) {
    return;
  } // Hooks are called conditionally, but the condition is whether the
  // react-native-reanimated is installed, which shouldn't change while running
  // eslint-disable-next-line react-hooks/rules-of-hooks


  const sharedHandlersCallbacks = Reanimated.useSharedValue(null); // eslint-disable-next-line react-hooks/rules-of-hooks

  const lastUpdateEvent = Reanimated.useSharedValue([]); // not every gesture needs a state controller, init them lazily

  const stateControllers = [];

  const callback = event => {
    'worklet';

    const currentCallback = sharedHandlersCallbacks.value;

    if (!currentCallback) {
      return;
    }

    for (let i = 0; i < currentCallback.length; i++) {
      const gesture = currentCallback[i];

      if (event.handlerTag !== gesture.handlerTag) {
        continue;
      }

      if (isStateChangeEvent(event)) {
        if (event.oldState === State.UNDETERMINED && event.state === State.BEGAN) {
          runWorklet(CALLBACK_TYPE.BEGAN, gesture, event);
        } else if ((event.oldState === State.BEGAN || event.oldState === State.UNDETERMINED) && event.state === State.ACTIVE) {
          runWorklet(CALLBACK_TYPE.START, gesture, event);
          lastUpdateEvent.value[gesture.handlerTag] = undefined;
        } else if (event.oldState !== event.state && event.state === State.END) {
          if (event.oldState === State.ACTIVE) {
            runWorklet(CALLBACK_TYPE.END, gesture, event, true);
          }

          runWorklet(CALLBACK_TYPE.FINALIZE, gesture, event, true);
        } else if ((event.state === State.FAILED || event.state === State.CANCELLED) && event.state !== event.oldState) {
          if (event.oldState === State.ACTIVE) {
            runWorklet(CALLBACK_TYPE.END, gesture, event, false);
          }

          runWorklet(CALLBACK_TYPE.FINALIZE, gesture, event, false);
        }
      } else if (isTouchEvent(event)) {
        if (!stateControllers[i]) {
          stateControllers[i] = GestureStateManager.create(event.handlerTag);
        }

        if (event.eventType !== TouchEventType.UNDETERMINED) {
          runWorklet(touchEventTypeToCallbackType(event.eventType), gesture, event, stateControllers[i]);
        }
      } else {
        runWorklet(CALLBACK_TYPE.UPDATE, gesture, event);

        if (gesture.onChange && gesture.changeEventCalculator) {
          var _gesture$changeEventC;

          runWorklet(CALLBACK_TYPE.CHANGE, gesture, (_gesture$changeEventC = gesture.changeEventCalculator) === null || _gesture$changeEventC === void 0 ? void 0 : _gesture$changeEventC.call(gesture, event, lastUpdateEvent.value[gesture.handlerTag]));
          lastUpdateEvent.value[gesture.handlerTag] = event;
        }
      }
    }
  }; // eslint-disable-next-line react-hooks/rules-of-hooks


  const event = Reanimated.useEvent(callback, ['onGestureHandlerStateChange', 'onGestureHandlerEvent'], needsRebuild);
  preparedGesture.animatedEventHandler = event;
  preparedGesture.animatedHandlers = sharedHandlersCallbacks;
}
//# sourceMappingURL=useAnimatedGesture.js.map