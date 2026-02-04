"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDetectorUpdater = useDetectorUpdater;

var _react = require("react");

var _reactNative = require("react-native");

var _attachHandlers = require("./attachHandlers");

var _updateHandlers = require("./updateHandlers");

var _needsToReattach = require("./needsToReattach");

var _dropHandlers = require("./dropHandlers");

var _utils = require("./utils");

// Returns a function that's responsible for updating the attached gestures
// If the view has changed, it will reattach the handlers to the new view
// If the view remains the same, it will update the handlers with the new config
function useDetectorUpdater(state, preparedGesture, gesturesToAttach, gestureConfig, webEventHandlersRef) {
  const forceRender = (0, _utils.useForceRender)();
  const updateAttachedGestures = (0, _react.useCallback)( // skipConfigUpdate is used to prevent unnecessary updates when only checking if the view has changed
  skipConfigUpdate => {
    // If the underlying view has changed we need to reattach handlers to the new view
    const viewTag = (0, _reactNative.findNodeHandle)(state.viewRef);
    const didUnderlyingViewChange = viewTag !== state.previousViewTag;

    if (didUnderlyingViewChange || (0, _needsToReattach.needsToReattach)(preparedGesture, gesturesToAttach)) {
      (0, _utils.validateDetectorChildren)(state.viewRef);
      (0, _dropHandlers.dropHandlers)(preparedGesture);
      (0, _attachHandlers.attachHandlers)({
        preparedGesture,
        gestureConfig,
        gesturesToAttach,
        webEventHandlersRef,
        viewTag
      });

      if (didUnderlyingViewChange) {
        state.previousViewTag = viewTag;
        state.forceRebuildReanimatedEvent = true;
        forceRender();
      }
    } else if (!skipConfigUpdate) {
      (0, _updateHandlers.updateHandlers)(preparedGesture, gestureConfig, gesturesToAttach);
    }
  }, [forceRender, gestureConfig, gesturesToAttach, preparedGesture, state, webEventHandlersRef]);
  return updateAttachedGestures;
}
//# sourceMappingURL=useDetectorUpdater.js.map