"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePrevious = usePrevious;
var _react = require("react");
function usePrevious(state) {
  const ref = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    ref.current = state;
  });
  return ref.current;
}
//# sourceMappingURL=usePrevious.js.map