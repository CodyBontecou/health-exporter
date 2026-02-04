"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ghQueueMicrotask = void 0;
// We check for typeof requestAnimationFrame because of SSR
// Functions are bound to null to avoid issues with scope when using Metro inline requires.
const ghQueueMicrotask = typeof setImmediate === 'function' ? setImmediate.bind(null) : typeof requestAnimationFrame === 'function' ? requestAnimationFrame.bind(null) : queueMicrotask.bind(null);
exports.ghQueueMicrotask = ghQueueMicrotask;
//# sourceMappingURL=ghQueueMicrotask.js.map