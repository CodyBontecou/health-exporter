import { isFabric, tagMessage } from '../../../utils';
import { getShadowNodeFromRef } from '../../../getShadowNodeFromRef';
import { useCallback } from 'react';
import { findNodeHandle } from 'react-native';
// Ref handler for the Wrap component attached under the GestureDetector.
// It's responsible for setting the viewRef on the state and triggering the reattaching of handlers
// if the view has changed.
export function useViewRefHandler(state, updateAttachedGestures) {
  const refHandler = useCallback(ref => {
    if (ref === null) {
      return;
    }

    state.viewRef = ref; // if it's the first render, also set the previousViewTag to prevent reattaching gestures when not needed

    if (state.previousViewTag === -1) {
      state.previousViewTag = findNodeHandle(state.viewRef);
    } // Pass true as `skipConfigUpdate`. Here we only want to trigger the eventual reattaching of handlers
    // in case the view has changed. If the view doesn't change, the update will be handled by detector.


    if (!state.firstRender) {
      updateAttachedGestures(true);
    }

    if (__DEV__ && isFabric() && global.isFormsStackingContext) {
      const node = getShadowNodeFromRef(ref);

      if (global.isFormsStackingContext(node) === false) {
        console.error(tagMessage('GestureDetector has received a child that may get view-flattened. ' + '\nTo prevent it from misbehaving you need to wrap the child with a `<View collapsable={false}>`.'));
      }
    }
  }, [state, updateAttachedGestures]);
  return refHandler;
}
//# sourceMappingURL=useViewRefHandler.js.map