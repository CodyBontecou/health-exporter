"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Gestures = void 0;

var _PanGestureHandler = _interopRequireDefault(require("./web/handlers/PanGestureHandler"));

var _TapGestureHandler = _interopRequireDefault(require("./web/handlers/TapGestureHandler"));

var _LongPressGestureHandler = _interopRequireDefault(require("./web/handlers/LongPressGestureHandler"));

var _PinchGestureHandler = _interopRequireDefault(require("./web/handlers/PinchGestureHandler"));

var _RotationGestureHandler = _interopRequireDefault(require("./web/handlers/RotationGestureHandler"));

var _FlingGestureHandler = _interopRequireDefault(require("./web/handlers/FlingGestureHandler"));

var _NativeViewGestureHandler = _interopRequireDefault(require("./web/handlers/NativeViewGestureHandler"));

var _ManualGestureHandler = _interopRequireDefault(require("./web/handlers/ManualGestureHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// GestureHandlers
const Gestures = {
  NativeViewGestureHandler: _NativeViewGestureHandler.default,
  PanGestureHandler: _PanGestureHandler.default,
  TapGestureHandler: _TapGestureHandler.default,
  LongPressGestureHandler: _LongPressGestureHandler.default,
  PinchGestureHandler: _PinchGestureHandler.default,
  RotationGestureHandler: _RotationGestureHandler.default,
  FlingGestureHandler: _FlingGestureHandler.default,
  ManualGestureHandler: _ManualGestureHandler.default
};
exports.Gestures = Gestures;
var _default = {
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
exports.default = _default;
//# sourceMappingURL=RNGestureHandlerModule.windows.js.map