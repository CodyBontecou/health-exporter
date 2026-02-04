"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _NativeRNGestureHandlerModule = _interopRequireDefault(require("./specs/NativeRNGestureHandlerModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Reexport the native module spec used by codegen. The relevant files are inluded on Android
// to ensure the compatibility with the old arch, while iOS doesn't require those at all.
var _default = _NativeRNGestureHandlerModule.default;
exports.default = _default;
//# sourceMappingURL=RNGestureHandlerModule.js.map