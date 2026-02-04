"use strict";

var _contextModuleTemplates = require("./contextModuleTemplates");
var _isAssetFile = _interopRequireDefault(
  require("metro-resolver/src/utils/isAssetFile")
);
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const baseIgnoredInlineRequires = [
  "React",
  "react",
  "react/jsx-dev-runtime",
  "react/jsx-runtime",
  "react-compiler-runtime",
  "react-native",
];
async function calcTransformerOptions(
  entryFiles,
  bundler,
  deltaBundler,
  config,
  options,
  resolverOptions
) {
  const baseOptions = {
    customTransformOptions: options.customTransformOptions,
    dev: options.dev,
    hot: options.hot,
    inlineRequires: false,
    inlinePlatform: true,
    minify: options.minify,
    platform: options.platform,
    unstable_transformProfile: options.unstable_transformProfile,
  };
  if (options.type === "script") {
    return {
      ...baseOptions,
      type: "script",
    };
  }
  const getDependencies = async (path) => {
    const dependencies = await deltaBundler.getDependencies([path], {
      resolve: await getResolveDependencyFn(
        bundler,
        options.platform,
        resolverOptions
      ),
      transform: await getTransformFn(
        [path],
        bundler,
        deltaBundler,
        config,
        {
          ...options,
          minify: false,
        },
        resolverOptions
      ),
      transformOptions: options,
      onProgress: null,
      lazy: false,
      unstable_allowRequireContext:
        config.transformer.unstable_allowRequireContext,
      unstable_enablePackageExports:
        config.resolver.unstable_enablePackageExports,
      shallow: false,
    });
    return Array.from(dependencies.keys());
  };
  const { transform } = await config.transformer.getTransformOptions(
    entryFiles,
    {
      dev: options.dev,
      hot: options.hot,
      platform: options.platform,
    },
    getDependencies
  );
  return {
    ...baseOptions,
    inlinePlatform:
      transform?.unstable_inlinePlatform != null
        ? transform.unstable_inlinePlatform
        : true,
    inlineRequires: transform?.inlineRequires || false,
    experimentalImportSupport: transform?.experimentalImportSupport || false,
    unstable_disableES6Transforms:
      transform?.unstable_disableES6Transforms || false,
    unstable_memoizeInlineRequires:
      transform?.unstable_memoizeInlineRequires || false,
    unstable_nonMemoizedInlineRequires:
      transform?.unstable_nonMemoizedInlineRequires || [],
    nonInlinedRequires:
      transform?.nonInlinedRequires || baseIgnoredInlineRequires,
    type: "module",
  };
}
function removeInlineRequiresBlockListFromOptions(path, inlineRequires) {
  if (typeof inlineRequires === "object") {
    return !(path in inlineRequires.blockList);
  }
  return inlineRequires;
}
async function getTransformFn(
  entryFiles,
  bundler,
  deltaBundler,
  config,
  options,
  resolverOptions
) {
  const { inlineRequires, ...transformOptions } = await calcTransformerOptions(
    entryFiles,
    bundler,
    deltaBundler,
    config,
    options,
    resolverOptions
  );
  const assetExts = new Set(config.resolver.assetExts);
  return async (modulePath, requireContext) => {
    let templateBuffer;
    if (requireContext) {
      const graph = await bundler.getDependencyGraph();
      const files = Array.from(
        graph.matchFilesWithContext(requireContext.from, {
          filter: requireContext.filter,
          recursive: requireContext.recursive,
        })
      );
      const template = (0, _contextModuleTemplates.getContextModuleTemplate)(
        requireContext.mode,
        requireContext.from,
        files
      );
      templateBuffer = Buffer.from(template);
    }
    return await bundler.transformFile(
      modulePath,
      {
        ...transformOptions,
        type: getType(transformOptions.type, modulePath, assetExts),
        inlineRequires: removeInlineRequiresBlockListFromOptions(
          modulePath,
          inlineRequires
        ),
      },
      templateBuffer
    );
  };
}
function getType(type, filePath, assetExts) {
  if (type === "script") {
    return type;
  }
  if ((0, _isAssetFile.default)(filePath, assetExts)) {
    return "asset";
  }
  return "module";
}
async function getResolveDependencyFn(bundler, platform, resolverOptions) {
  const dependencyGraph = await await bundler.getDependencyGraph();
  return (from, dependency) =>
    dependencyGraph.resolveDependency(
      from,
      dependency,
      platform ?? null,
      resolverOptions
    );
}
module.exports = {
  getTransformFn,
  getResolveDependencyFn,
};
