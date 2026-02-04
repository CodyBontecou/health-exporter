// GestureHandlers
import PanGestureHandler from './web/handlers/PanGestureHandler';
import TapGestureHandler from './web/handlers/TapGestureHandler';
import LongPressGestureHandler from './web/handlers/LongPressGestureHandler';
import PinchGestureHandler from './web/handlers/PinchGestureHandler';
import RotationGestureHandler from './web/handlers/RotationGestureHandler';
import FlingGestureHandler from './web/handlers/FlingGestureHandler';
import NativeViewGestureHandler from './web/handlers/NativeViewGestureHandler';
import ManualGestureHandler from './web/handlers/ManualGestureHandler';
export const Gestures = {
  NativeViewGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  LongPressGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  FlingGestureHandler,
  ManualGestureHandler
};
export default {
  handleSetJSResponder(_tag, _blockNativeResponder) {// NO-OP
  },

  handleClearJSResponder() {// NO-OP
  },

  createGestureHandler(_handlerName, _handlerTag, _config) {// NO-OP
  },

  attachGestureHandler(_handlerTag, // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _newView, _actionType, _propsRef) {// NO-OP
  },

  updateGestureHandler(_handlerTag, _newConfig) {// NO-OP
  },

  getGestureHandlerNode(_handlerTag) {// NO-OP
  },

  dropGestureHandler(_handlerTag) {// NO-OP
  },

  flushOperations() {// NO-OP
  }

};
//# sourceMappingURL=RNGestureHandlerModule.windows.js.map