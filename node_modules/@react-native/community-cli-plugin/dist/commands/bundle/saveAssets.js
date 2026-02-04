"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _logger = require("../../utils/logger");
var _assetCatalogIOS = require("./assetCatalogIOS");
var _filterPlatformAssetScales = _interopRequireDefault(
  require("./filterPlatformAssetScales")
);
var _getAssetDestPathAndroid = _interopRequireDefault(
  require("./getAssetDestPathAndroid")
);
var _getAssetDestPathIOS = _interopRequireDefault(
  require("./getAssetDestPathIOS")
);
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
async function saveAssets(assets, platform, assetsDest, assetCatalogDest) {
  if (assetsDest == null) {
    _logger.logger.warn("Assets destination folder is not set, skipping...");
    return;
  }
  const filesToCopy = {};
  const getAssetDestPath =
    platform === "android"
      ? _getAssetDestPathAndroid.default
      : _getAssetDestPathIOS.default;
  const addAssetToCopy = (asset) => {
    const validScales = new Set(
      (0, _filterPlatformAssetScales.default)(platform, asset.scales)
    );
    asset.scales.forEach((scale, idx) => {
      if (!validScales.has(scale)) {
        return;
      }
      const src = asset.files[idx];
      const dest = _path.default.join(
        assetsDest,
        getAssetDestPath(asset, scale)
      );
      filesToCopy[src] = dest;
    });
  };
  if (platform === "ios" && assetCatalogDest != null) {
    const catalogDir = _path.default.join(
      assetCatalogDest,
      "RNAssets.xcassets"
    );
    if (!_fs.default.existsSync(catalogDir)) {
      _logger.logger.error(
        `Could not find asset catalog 'RNAssets.xcassets' in ${assetCatalogDest}. Make sure to create it if it does not exist.`
      );
      return;
    }
    _logger.logger.info("Adding images to asset catalog", catalogDir);
    (0, _assetCatalogIOS.cleanAssetCatalog)(catalogDir);
    for (const asset of assets) {
      if ((0, _assetCatalogIOS.isCatalogAsset)(asset)) {
        const imageSet = (0, _assetCatalogIOS.getImageSet)(
          catalogDir,
          asset,
          (0, _filterPlatformAssetScales.default)(platform, asset.scales)
        );
        (0, _assetCatalogIOS.writeImageSet)(imageSet);
      } else {
        addAssetToCopy(asset);
      }
    }
    _logger.logger.info("Done adding images to asset catalog");
  } else {
    assets.forEach(addAssetToCopy);
  }
  return copyAll(filesToCopy);
}
function copyAll(filesToCopy) {
  const queue = Object.keys(filesToCopy);
  if (queue.length === 0) {
    return Promise.resolve();
  }
  _logger.logger.info(`Copying ${queue.length} asset files`);
  return new Promise((resolve, reject) => {
    const copyNext = (error) => {
      if (error) {
        reject(error);
        return;
      }
      if (queue.length === 0) {
        _logger.logger.info("Done copying assets");
        resolve();
      } else {
        const src = queue.shift();
        const dest = filesToCopy[src];
        copy(src, dest, copyNext);
      }
    };
    copyNext();
  });
}
function copy(src, dest, callback) {
  const destDir = _path.default.dirname(dest);
  _fs.default.mkdir(
    destDir,
    {
      recursive: true,
    },
    (err) => {
      if (err) {
        callback(err);
        return;
      }
      _fs.default
        .createReadStream(src)
        .pipe(_fs.default.createWriteStream(dest))
        .on("finish", callback);
    }
  );
}
var _default = (exports.default = saveAssets);
