"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimatedGesture = useAnimatedGesture;

var _gesture = require("../gesture");

var _reanimatedWrapper = require("../reanimatedWrapper");

var _gestureStateManager = require("../gestureStateManager");

var _State = require("../../../State");

var _TouchEventType = require("../../../TouchEventType");

var _utils = require("../../../utils");

function getHandler(type, gesture) {
  'worklet';

  switch (type) {
    case _gesture.CALLBACK_TYPE.BEGAN:
      return gesture.onBegin;

    case _gesture.CALLBACK_TYPE.START:
      return gesture.onStart;

    case _gesture.CALLBACK_TYPE.UPDATE:
      return gesture.onUpdate;

    case _gesture.CALLBACK_TYPE.CHANGE:
      return gesture.onChange;

    case _gesture.CALLBACK_TYPE.END:
      return gesture.onEnd;

    case _gesture.CALLBACK_TYPE.FINALIZE:
      return gesture.onFinalize;

    case _gesture.CALLBACK_TYPE.TOUCHES_DOWN:
      return gesture.onTouchesDown;

    case _gesture.CALLBACK_TYPE.TOUCHES_MOVE:
      return gesture.onTouchesMove;

    case _gesture.CALLBACK_TYPE.TOUCHES_UP:
      return gesture.onTouchesUp;

    case _gesture.CALLBACK_TYPE.TOUCHES_CANCELLED:
      return gesture.onTouchesCancelled;
  }
}

function touchEventTypeToCallbackType(eventType) {
  'worklet';

  switch (eventType) {
    case _TouchEventType.TouchEventType.TOUCHES_DOWN:
      return _gesture.CALLBACK_TYPE.TOUCHES_DOWN;

    case _TouchEventType.TouchEventType.TOUCHES_MOVE:
      return _gesture.CALLBACK_TYPE.TOUCHES_MOVE;

    case _TouchEventType.TouchEventType.TOUCHES_UP:
      return _gesture.CALLBACK_TYPE.TOUCHES_UP;

    case _TouchEventType.TouchEventType.TOUCHES_CANCELLED:
      return _gesture.CALLBACK_TYPE.TOUCHES_CANCELLED;
  }

  return _gesture.CALLBACK_TYPE.UNDEFINED;
}

function runWorklet(type, gesture, event, ...args) {
  'worklet';

  const handler = getHandler(type, gesture);

  if (gesture.isWorklet[type]) {
    // @ts-ignore Logic below makes sure the correct event is send to the
    // correct handler.
    handler === null || handler === void 0 ? void 0 : handler(event, ...args);
  } else if (handler) {
    console.warn((0, _utils.tagMessage)('Animated gesture callback must be a worklet'));
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

function useAnimatedGesture(preparedGesture, needsRebuild) {
  if (!_reanimatedWrapper.Reanimated) {
    return;
  } // Hooks are called conditionally, but the condition is whether the
  // react-native-reanimated is installed, which shouldn't change while running
  // eslint-disable-next-line react-hooks/rules-of-hooks


  const sharedHandlersCallbacks = _reanimatedWrapper.Reanimated.useSharedValue(null); // eslint-disable-next-line react-hooks/rules-of-hooks


  const lastUpdateEvent = _reanimatedWrapper.Reanimated.useSharedValue([]); // not every gesture needs a state controller, init them lazily


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
        if (event.oldState === _State.State.UNDETERMINED && event.state === _State.State.BEGAN) {
          runWorklet(_gesture.CALLBACK_TYPE.BEGAN, gesture, event);
        } else if ((event.oldState === _State.State.BEGAN || event.oldState === _State.State.UNDETERMINED) && event.state === _State.State.ACTIVE) {
          runWorklet(_gesture.CALLBACK_TYPE.START, gesture, event);
          lastUpdateEvent.value[gesture.handlerTag] = undefined;
        } else if (event.oldState !== event.state && event.state === _State.State.END) {
          if (event.oldState === _State.State.ACTIVE) {
            runWorklet(_gesture.CALLBACK_TYPE.END, gesture, event, true);
          }

          runWorklet(_gesture.CALLBACK_TYPE.FINALIZE, gesture, event, true);
        } else if ((event.state === _State.State.FAILED || event.state === _State.State.CANCELLED) && event.state !== event.oldState) {
          if (event.oldState === _State.State.ACTIVE) {
            runWorklet(_gesture.CALLBACK_TYPE.END, gesture, event, false);
          }

          runWorklet(_gesture.CALLBACK_TYPE.FINALIZE, gesture, event, false);
        }
      } else if (isTouchEvent(event)) {
        if (!stateControllers[i]) {
          stateControllers[i] = _gestureStateManager.GestureStateManager.create(event.handlerTag);
        }

        if (event.eventType !== _TouchEventType.TouchEventType.UNDETERMINED) {
          runWorklet(touchEventTypeToCallbackType(event.eventType), gesture, event, stateControllers[i]);
        }
      } else {
        runWorklet(_gesture.CALLBACK_TYPE.UPDATE, gesture, event);

        if (gesture.onChange && gesture.changeEventCalculator) {
          var _gesture$changeEventC;

          runWorklet(_gesture.CALLBACK_TYPE.CHANGE, gesture, (_gesture$changeEventC = gesture.changeEventCalculator) === null || _gesture$changeEventC === void 0 ? void 0 : _gesture$changeEventC.call(gesture, event, lastUpdateEvent.value[gesture.handlerTag]));
          lastUpdateEvent.value[gesture.handlerTag] = event;
        }
      }
    }
  }; // eslint-disable-next-line react-hooks/rules-of-hooks


  const event = _reanimatedWrapper.Reanimated.useEvent(callback, ['onGestureHandlerStateChange', 'onGestureHandlerEvent'], needsRebuild);

  preparedGesture.animatedEventHandler = event;
  preparedGesture.animatedHandlers = sharedHandlersCallbacks;
}
//# sourceMappingURL=useAnimatedGesture.js.map