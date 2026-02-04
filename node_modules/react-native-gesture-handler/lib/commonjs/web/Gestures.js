"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HammerGestures = exports.Gestures = void 0;

var _PanGestureHandler = _interopRequireDefault(require("./handlers/PanGestureHandler"));

var _TapGestureHandler = _interopRequireDefault(require("./handlers/TapGestureHandler"));

var _LongPressGestureHandler = _interopRequireDefault(require("./handlers/LongPressGestureHandler"));

var _PinchGestureHandler = _interopRequireDefault(require("./handlers/PinchGestureHandler"));

var _RotationGestureHandler = _interopRequireDefault(require("./handlers/RotationGestureHandler"));

var _FlingGestureHandler = _interopRequireDefault(require("./handlers/FlingGestureHandler"));

var _NativeViewGestureHandler = _interopRequireDefault(require("./handlers/NativeViewGestureHandler"));

var _ManualGestureHandler = _interopRequireDefault(require("./handlers/ManualGestureHandler"));

var _HoverGestureHandler = _interopRequireDefault(require("./handlers/HoverGestureHandler"));

var _NativeViewGestureHandler2 = _interopRequireDefault(require("../web_hammer/NativeViewGestureHandler"));

var _PanGestureHandler2 = _interopRequireDefault(require("../web_hammer/PanGestureHandler"));

var _TapGestureHandler2 = _interopRequireDefault(require("../web_hammer/TapGestureHandler"));

var _LongPressGestureHandler2 = _interopRequireDefault(require("../web_hammer/LongPressGestureHandler"));

var _PinchGestureHandler2 = _interopRequireDefault(require("../web_hammer/PinchGestureHandler"));

var _RotationGestureHandler2 = _interopRequireDefault(require("../web_hammer/RotationGestureHandler"));

var _FlingGestureHandler2 = _interopRequireDefault(require("../web_hammer/FlingGestureHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Gesture Handlers
// Hammer Handlers
const Gestures = {
  NativeViewGestureHandler: _NativeViewGestureHandler.default,
  PanGestureHandler: _PanGestureHandler.default,
  TapGestureHandler: _TapGestureHandler.default,
  LongPressGestureHandler: _LongPressGestureHandler.default,
  PinchGestureHandler: _PinchGestureHandler.default,
  RotationGestureHandler: _RotationGestureHandler.default,
  FlingGestureHandler: _FlingGestureHandler.default,
  ManualGestureHandler: _ManualGestureHandler.default,
  HoverGestureHandler: _HoverGestureHandler.default
};
exports.Gestures = Gestures;
const HammerGestures = {
  NativeViewGestureHandler: _NativeViewGestureHandler2.default,
  PanGestureHandler: _PanGestureHandler2.default,
  TapGestureHandler: _TapGestureHandler2.default,
  LongPressGestureHandler: _LongPressGestureHandler2.default,
  PinchGestureHandler: _PinchGestureHandler2.default,
  RotationGestureHandler: _RotationGestureHandler2.default,
  FlingGestureHandler: _FlingGestureHandler2.default
};
exports.HammerGestures = HammerGestures;
//# sourceMappingURL=Gestures.js.map