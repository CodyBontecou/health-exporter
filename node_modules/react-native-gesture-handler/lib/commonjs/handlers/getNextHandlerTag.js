"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextHandlerTag = getNextHandlerTag;
let handlerTag = 1;

function getNextHandlerTag() {
  return handlerTag++;
}
//# sourceMappingURL=getNextHandlerTag.js.map