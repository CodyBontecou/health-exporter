"use strict";

var _types = require("../shared/types.flow");
const parsePlatformFilePath = require("../node-haste/lib/parsePlatformFilePath");
const parseCustomResolverOptions = require("./parseCustomResolverOptions");
const parseCustomTransformOptions = require("./parseCustomTransformOptions");
const jscSafeUrl = require("jsc-safe-url");
const nullthrows = require("nullthrows");
const path = require("path");
const url = require("url");
const getBoolean = (query, opt, defaultValue) =>
  query[opt] == null
    ? defaultValue
    : query[opt] === "true" || query[opt] === "1";
const getBundleType = (bundleType) =>
  bundleType === "map" ? bundleType : "bundle";
const getTransformProfile = (transformProfile) =>
  transformProfile === "hermes-stable" || transformProfile === "hermes-canary"
    ? transformProfile
    : "default";
module.exports = function parseOptionsFromUrl(normalizedRequestUrl, platforms) {
  const parsedURL = nullthrows(url.parse(normalizedRequestUrl, true));
  const query = nullthrows(parsedURL.query);
  const pathname =
    query.bundleEntry ||
    (parsedURL.pathname != null ? decodeURIComponent(parsedURL.pathname) : "");
  const platform =
    query.platform || parsePlatformFilePath(pathname, platforms).platform;
  const bundleType = getBundleType(path.extname(pathname).substr(1));
  return {
    bundleType,
    customResolverOptions: parseCustomResolverOptions(parsedURL),
    customTransformOptions: parseCustomTransformOptions(parsedURL),
    dev: getBoolean(query, "dev", true),
    entryFile: pathname.replace(/^(?:\.?\/)?/, "./").replace(/\.[^/.]+$/, ""),
    excludeSource: getBoolean(query, "excludeSource", false),
    hot: true,
    inlineSourceMap: getBoolean(query, "inlineSourceMap", false),
    lazy: getBoolean(query, "lazy", false),
    minify: getBoolean(query, "minify", false),
    modulesOnly: getBoolean(query, "modulesOnly", false),
    onProgress: null,
    platform,
    runModule: getBoolean(query, "runModule", true),
    shallow: getBoolean(query, "shallow", false),
    sourceMapUrl: url.format({
      ...parsedURL,
      protocol:
        platform != null && platform.match(/^(android|ios|vr|windows|macos)$/)
          ? "http"
          : "",
      pathname: pathname.replace(/\.(bundle|delta)$/, ".map"),
    }),
    sourcePaths:
      _types.SourcePathsMode.cast(query.sourcePaths) ??
      _types.SourcePathsMode.Absolute,
    sourceUrl: jscSafeUrl.toJscSafeUrl(normalizedRequestUrl),
    unstable_transformProfile: getTransformProfile(
      query.unstable_transformProfile
    ),
  };
};
