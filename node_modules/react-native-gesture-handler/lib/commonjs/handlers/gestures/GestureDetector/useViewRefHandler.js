"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useViewRefHandler = useViewRefHandler;

var _utils = require("../../../utils");

var _getShadowNodeFromRef = require("../../../getShadowNodeFromRef");

var _react = require("react");

var _reactNative = require("react-native");

// Ref handler for the Wrap component attached under the GestureDetector.
// It's responsible for setting the viewRef on the state and triggering the reattaching of handlers
// if the view has changed.
function useViewRefHandler(state, updateAttachedGestures) {
  const refHandler = (0, _react.useCallback)(ref => {
    if (ref === null) {
      return;
    }

    state.viewRef = ref; // if it's the first render, also set the previousViewTag to prevent reattaching gestures when not needed

    if (state.previousViewTag === -1) {
      state.previousViewTag = (0, _reactNative.findNodeHandle)(state.viewRef);
    } // Pass true as `skipConfigUpdate`. Here we only want to trigger the eventual reattaching of handlers
    // in case the view has changed. If the view doesn't change, the update will be handled by detector.


    if (!state.firstRender) {
      updateAttachedGestures(true);
    }

    if (__DEV__ && (0, _utils.isFabric)() && global.isFormsStackingContext) {
      const node = (0, _getShadowNodeFromRef.getShadowNodeFromRef)(ref);

      if (global.isFormsStackingContext(node) === false) {
        console.error((0, _utils.tagMessage)('GestureDetector has received a child that may get view-flattened. ' + '\nTo prevent it from misbehaving you need to wrap the child with a `<View collapsable={false}>`.'));
      }
    }
  }, [state, updateAttachedGestures]);
  return refHandler;
}
//# sourceMappingURL=useViewRefHandler.js.map