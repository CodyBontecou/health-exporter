"use strict";

var _CountingSet = _interopRequireDefault(require("./CountingSet"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const countLines = require("./countLines");
const getPreludeCode = require("./getPreludeCode");
const transformHelpers = require("./transformHelpers");
const defaults = require("metro-config/src/defaults/defaults");
async function getPrependedScripts(
  config,
  options,
  resolverOptions,
  bundler,
  deltaBundler
) {
  const polyfillModuleNames = config.serializer
    .getPolyfills({
      platform: options.platform,
    })
    .concat(config.serializer.polyfillModuleNames);
  const transformOptions = {
    ...options,
    type: "script",
  };
  const dependencies = await deltaBundler.getDependencies(
    [defaults.moduleSystem, ...polyfillModuleNames],
    {
      resolve: await transformHelpers.getResolveDependencyFn(
        bundler,
        options.platform,
        resolverOptions
      ),
      transform: await transformHelpers.getTransformFn(
        [defaults.moduleSystem, ...polyfillModuleNames],
        bundler,
        deltaBundler,
        config,
        transformOptions,
        resolverOptions
      ),
      unstable_allowRequireContext:
        config.transformer.unstable_allowRequireContext,
      transformOptions,
      onProgress: null,
      lazy: false,
      unstable_enablePackageExports:
        config.resolver.unstable_enablePackageExports,
      shallow: false,
    }
  );
  return [
    _getPrelude({
      dev: options.dev,
      globalPrefix: config.transformer.globalPrefix,
      requireCycleIgnorePatterns: config.resolver.requireCycleIgnorePatterns,
    }),
    ...dependencies.values(),
  ];
}
function _getPrelude({ dev, globalPrefix, requireCycleIgnorePatterns }) {
  const code = getPreludeCode({
    isDev: dev,
    globalPrefix,
    requireCycleIgnorePatterns,
  });
  const name = "__prelude__";
  return {
    dependencies: new Map(),
    getSource: () => Buffer.from(code),
    inverseDependencies: new _CountingSet.default(),
    path: name,
    output: [
      {
        type: "js/script/virtual",
        data: {
          code,
          lineCount: countLines(code),
          map: [],
        },
      },
    ],
  };
}
module.exports = getPrependedScripts;
