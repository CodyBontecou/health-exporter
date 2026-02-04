"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _assetPathUtils = _interopRequireDefault(require("./assetPathUtils"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function getAssetDestPathAndroid(asset, scale) {
  const androidFolder = _assetPathUtils.default.getAndroidResourceFolderName(
    asset,
    scale
  );
  const fileName = _assetPathUtils.default.getResourceIdentifier(asset);
  return _path.default.join(androidFolder, `${fileName}.${asset.type}`);
}
var _default = (exports.default = getAssetDestPathAndroid);
