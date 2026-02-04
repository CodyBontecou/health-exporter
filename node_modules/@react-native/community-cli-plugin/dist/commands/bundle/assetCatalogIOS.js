"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.cleanAssetCatalog = cleanAssetCatalog;
exports.getImageSet = getImageSet;
exports.isCatalogAsset = isCatalogAsset;
exports.writeImageSet = writeImageSet;
var _assetPathUtils = _interopRequireDefault(require("./assetPathUtils"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function cleanAssetCatalog(catalogDir) {
  const files = _fs.default
    .readdirSync(catalogDir)
    .filter((file) => file.endsWith(".imageset"));
  for (const file of files) {
    _fs.default.rmSync(_path.default.join(catalogDir, file), {
      recursive: true,
      force: true,
    });
  }
}
function getImageSet(catalogDir, asset, scales) {
  const fileName = _assetPathUtils.default.getResourceIdentifier(asset);
  return {
    basePath: _path.default.join(catalogDir, `${fileName}.imageset`),
    files: scales.map((scale, idx) => {
      const suffix = scale === 1 ? "" : `@${scale}x`;
      return {
        name: `${fileName + suffix}.${asset.type}`,
        scale,
        src: asset.files[idx],
      };
    }),
  };
}
function isCatalogAsset(asset) {
  return asset.type === "png" || asset.type === "jpg" || asset.type === "jpeg";
}
function writeImageSet(imageSet) {
  _fs.default.mkdirSync(imageSet.basePath, {
    recursive: true,
  });
  for (const file of imageSet.files) {
    const dest = _path.default.join(imageSet.basePath, file.name);
    _fs.default.copyFileSync(file.src, dest);
  }
  _fs.default.writeFileSync(
    _path.default.join(imageSet.basePath, "Contents.json"),
    JSON.stringify({
      images: imageSet.files.map((file) => ({
        filename: file.name,
        idiom: "universal",
        scale: `${file.scale}x`,
      })),
      info: {
        author: "xcode",
        version: 1,
      },
    })
  );
}
