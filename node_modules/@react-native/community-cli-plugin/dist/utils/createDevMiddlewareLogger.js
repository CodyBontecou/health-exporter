"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = createDevMiddlewareLogger;
function createDevMiddlewareLogger(reporter) {
  return {
    info: makeLogger(reporter, "info"),
    warn: makeLogger(reporter, "warn"),
    error: makeLogger(reporter, "error"),
  };
}
function makeLogger(reporter, level) {
  return (...data) =>
    reporter.update({
      type: "unstable_server_log",
      level,
      data,
    });
}
