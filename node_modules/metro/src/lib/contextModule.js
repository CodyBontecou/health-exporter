"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.deriveAbsolutePathFromContext = deriveAbsolutePathFromContext;
exports.fileMatchesContext = fileMatchesContext;
var _crypto = _interopRequireDefault(require("crypto"));
var _nullthrows = _interopRequireDefault(require("nullthrows"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function toHash(value) {
  return _crypto.default.createHash("sha1").update(value).digest("hex");
}
function deriveAbsolutePathFromContext(from, context) {
  const filePath = from.endsWith(_path.default.sep) ? from.slice(0, -1) : from;
  return (
    filePath +
    "?ctx=" +
    toHash(
      [
        context.mode,
        context.recursive ? "recursive" : "",
        new RegExp(context.filter.pattern, context.filter.flags).toString(),
      ]
        .filter(Boolean)
        .join(" ")
    )
  );
}
function fileMatchesContext(testPath, context) {
  const filePath = _path.default.relative(
    (0, _nullthrows.default)(context.from),
    testPath
  );
  const filter = context.filter;
  if (
    !(filePath && !filePath.startsWith("..")) ||
    (!context.recursive && filePath.includes(_path.default.sep)) ||
    !filter.test("./" + filePath.replace(/\\/g, "/"))
  ) {
    return false;
  }
  return true;
}
