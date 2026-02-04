"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = loadMetroConfig;
var _errors = require("./errors");
var _logger = require("./logger");
var _metroPlatformResolver = require("./metroPlatformResolver");
var _metroConfig = require("metro-config");
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function getOverrideConfig(ctx, config) {
  const outOfTreePlatforms = Object.keys(ctx.platforms).filter(
    (platform) => ctx.platforms[platform].npmPackageName
  );
  const resolver = {
    platforms: [...Object.keys(ctx.platforms), "native"],
  };
  if (outOfTreePlatforms.length) {
    resolver.resolveRequest = (0,
    _metroPlatformResolver.reactNativePlatformResolver)(
      outOfTreePlatforms.reduce((result, platform) => {
        result[platform] = ctx.platforms[platform].npmPackageName;
        return result;
      }, {}),
      config.resolver?.resolveRequest
    );
  }
  return {
    resolver,
    serializer: {
      getModulesRunBeforeMainModule: () => [
        require.resolve(
          _path.default.join(
            ctx.reactNativePath,
            "Libraries/Core/InitializeCore"
          ),
          {
            paths: [ctx.root],
          }
        ),
        ...outOfTreePlatforms.map((platform) =>
          require.resolve(
            `${ctx.platforms[platform].npmPackageName}/Libraries/Core/InitializeCore`,
            {
              paths: [ctx.root],
            }
          )
        ),
      ],
    },
  };
}
async function loadMetroConfig(ctx, options = {}) {
  const cwd = ctx.root;
  const projectConfig = await (0, _metroConfig.resolveConfig)(
    options.config,
    cwd
  );
  if (projectConfig.isEmpty) {
    throw new _errors.CLIError(`No Metro config found in ${cwd}`);
  }
  _logger.logger.debug(`Reading Metro config from ${projectConfig.filepath}`);
  if (!global.__REACT_NATIVE_METRO_CONFIG_LOADED) {
    for (const line of `
=================================================================================================
From React Native 0.73, your project's Metro config should extend '@react-native/metro-config'
or it will fail to build. Please copy the template at:
https://github.com/react-native-community/template/blob/main/template/metro.config.js
This warning will be removed in future (https://github.com/facebook/metro/issues/1018).
=================================================================================================
    `
      .trim()
      .split("\n")) {
      _logger.logger.warn(line);
    }
  }
  const config = await (0, _metroConfig.loadConfig)({
    cwd,
    ...options,
  });
  const overrideConfig = getOverrideConfig(ctx, config);
  return (0, _metroConfig.mergeConfig)(config, overrideConfig);
}
