"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.unstable_buildBundleWithConfig = exports.default = void 0;
var _loadMetroConfig = _interopRequireDefault(
  require("../../utils/loadMetroConfig")
);
var _logger = require("../../utils/logger");
var _parseKeyValueParamArray = _interopRequireDefault(
  require("../../utils/parseKeyValueParamArray")
);
var _saveAssets = _interopRequireDefault(require("./saveAssets"));
var _chalk = _interopRequireDefault(require("chalk"));
var _fs = require("fs");
var _Server = _interopRequireDefault(require("metro/src/Server"));
var _bundle = _interopRequireDefault(require("metro/src/shared/output/bundle"));
var _RamBundle = _interopRequireDefault(
  require("metro/src/shared/output/RamBundle")
);
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
async function buildBundle(_argv, ctx, args, bundleImpl = _bundle.default) {
  const config = await (0, _loadMetroConfig.default)(ctx, {
    maxWorkers: args.maxWorkers,
    resetCache: args.resetCache,
    config: args.config,
  });
  return buildBundleWithConfig(args, config, bundleImpl);
}
async function buildBundleWithConfig(
  args,
  config,
  bundleImpl = _bundle.default
) {
  const customResolverOptions = (0, _parseKeyValueParamArray.default)(
    args.resolverOption ?? []
  );
  if (config.resolver.platforms.indexOf(args.platform) === -1) {
    _logger.logger.error(
      `Invalid platform ${
        args.platform ? `"${_chalk.default.bold(args.platform)}" ` : ""
      }selected.`
    );
    _logger.logger.info(
      `Available platforms are: ${config.resolver.platforms
        .map((x) => `"${_chalk.default.bold(x)}"`)
        .join(
          ", "
        )}. If you are trying to bundle for an out-of-tree platform, it may not be installed.`
    );
    throw new Error("Bundling failed");
  }
  process.env.NODE_ENV = args.dev ? "development" : "production";
  let sourceMapUrl = args.sourcemapOutput;
  if (sourceMapUrl != null && !args.sourcemapUseAbsolutePath) {
    sourceMapUrl = _path.default.basename(sourceMapUrl);
  }
  const requestOpts = {
    entryFile: args.entryFile,
    sourceMapUrl,
    dev: args.dev,
    minify: args.minify !== undefined ? args.minify : !args.dev,
    platform: args.platform,
    unstable_transformProfile: args.unstableTransformProfile,
    customResolverOptions,
  };
  const server = new _Server.default(config);
  try {
    const bundle = await bundleImpl.build(server, requestOpts);
    await _fs.promises.mkdir(_path.default.dirname(args.bundleOutput), {
      recursive: true,
      mode: 0o755,
    });
    await bundleImpl.save(bundle, args, _logger.logger.info);
    const outputAssets = await server.getAssets({
      ..._Server.default.DEFAULT_BUNDLE_OPTIONS,
      ...requestOpts,
      bundleType: "todo",
    });
    return await (0, _saveAssets.default)(
      outputAssets,
      args.platform,
      args.assetsDest,
      args.assetCatalogDest
    );
  } finally {
    await server.end();
  }
}
const unstable_buildBundleWithConfig = (exports.unstable_buildBundleWithConfig =
  buildBundleWithConfig);
var _default = (exports.default = buildBundle);
