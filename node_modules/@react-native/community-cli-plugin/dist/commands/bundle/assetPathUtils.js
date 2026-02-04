"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
function getAndroidAssetSuffix(scale) {
  switch (scale) {
    case 0.75:
      return "ldpi";
    case 1:
      return "mdpi";
    case 1.5:
      return "hdpi";
    case 2:
      return "xhdpi";
    case 3:
      return "xxhdpi";
    case 4:
      return "xxxhdpi";
    default:
      return "";
  }
}
const drawableFileTypes = new Set(["gif", "jpeg", "jpg", "png", "webp", "xml"]);
function getAndroidResourceFolderName(asset, scale) {
  if (!drawableFileTypes.has(asset.type)) {
    return "raw";
  }
  const suffix = getAndroidAssetSuffix(scale);
  if (!suffix) {
    throw new Error(
      `Don't know which android drawable suffix to use for asset: ${JSON.stringify(
        asset
      )}`
    );
  }
  return `drawable-${suffix}`;
}
function getResourceIdentifier(asset) {
  const folderPath = getBasePath(asset);
  return `${folderPath}/${asset.name}`
    .toLowerCase()
    .replace(/\//g, "_")
    .replace(/([^a-z0-9_])/g, "")
    .replace(/^assets_/, "");
}
function getBasePath(asset) {
  let basePath = asset.httpServerLocation;
  if (basePath[0] === "/") {
    basePath = basePath.substr(1);
  }
  return basePath;
}
var _default = (exports.default = {
  getAndroidAssetSuffix,
  getAndroidResourceFolderName,
  getResourceIdentifier,
  getBasePath,
});
