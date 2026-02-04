"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function getAssetDestPathIOS(asset, scale) {
  const suffix = scale === 1 ? "" : `@${scale}x`;
  const fileName = `${asset.name + suffix}.${asset.type}`;
  return _path.default.join(
    asset.httpServerLocation.substr(1).replace(/\.\.\//g, "_"),
    fileName
  );
}
var _default = (exports.default = getAssetDestPathIOS);
