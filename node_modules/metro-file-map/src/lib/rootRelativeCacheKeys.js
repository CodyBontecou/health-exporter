"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = rootRelativeCacheKeys;
var _normalizePathSeparatorsToPosix = _interopRequireDefault(
  require("./normalizePathSeparatorsToPosix")
);
var _RootPathUtils = require("./RootPathUtils");
var _crypto = require("crypto");
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function moduleCacheKey(modulePath) {
  if (modulePath == null) {
    return null;
  }
  const moduleExports = require(modulePath);
  if (typeof moduleExports?.getCacheKey !== "function") {
    console.warn(
      `metro-file-map: Expected \`${modulePath}\` to export ` +
        "`getCacheKey: () => string`"
    );
    return null;
  }
  return moduleExports.getCacheKey();
}
function rootRelativeCacheKeys(buildParameters) {
  const { rootDir, ...otherParameters } = buildParameters;
  const rootDirHash = (0, _crypto.createHash)("md5")
    .update((0, _normalizePathSeparatorsToPosix.default)(rootDir))
    .digest("hex");
  const pathUtils = new _RootPathUtils.RootPathUtils(rootDir);
  const cacheComponents = Object.keys(otherParameters)
    .sort()
    .map((key) => {
      switch (key) {
        case "roots":
          return buildParameters[key].map((root) =>
            (0, _normalizePathSeparatorsToPosix.default)(
              pathUtils.absoluteToNormal(root)
            )
          );
        case "cacheBreaker":
        case "extensions":
        case "computeDependencies":
        case "computeSha1":
        case "enableHastePackages":
        case "enableSymlinks":
        case "forceNodeFilesystemAPI":
        case "platforms":
        case "retainAllFiles":
        case "skipPackageJson":
          return buildParameters[key] ?? null;
        case "mocksPattern":
          return buildParameters[key]?.toString() ?? null;
        case "ignorePattern":
          return buildParameters[key].toString();
        case "hasteImplModulePath":
        case "dependencyExtractor":
          return moduleCacheKey(buildParameters[key]);
        default:
          key;
          throw new Error("Unrecognised key in build parameters: " + key);
      }
    });
  const relativeConfigHash = (0, _crypto.createHash)("md5")
    .update(JSON.stringify(cacheComponents))
    .digest("hex");
  return {
    rootDirHash,
    relativeConfigHash,
  };
}
