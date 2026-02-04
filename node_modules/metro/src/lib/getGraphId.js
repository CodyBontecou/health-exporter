"use strict";

const canonicalize = require("metro-core/src/canonicalize");
function getGraphId(
  entryFile,
  options,
  { shallow, lazy, unstable_allowRequireContext, resolverOptions }
) {
  return JSON.stringify(
    {
      entryFile,
      options: {
        customResolverOptions: resolverOptions.customResolverOptions ?? {},
        customTransformOptions: options.customTransformOptions ?? null,
        dev: options.dev,
        experimentalImportSupport: options.experimentalImportSupport || false,
        hot: options.hot,
        minify: options.minify,
        unstable_disableES6Transforms: options.unstable_disableES6Transforms,
        platform: options.platform != null ? options.platform : null,
        type: options.type,
        lazy,
        unstable_allowRequireContext,
        shallow,
        unstable_transformProfile:
          options.unstable_transformProfile || "default",
      },
    },
    canonicalize
  );
}
module.exports = getGraphId;
