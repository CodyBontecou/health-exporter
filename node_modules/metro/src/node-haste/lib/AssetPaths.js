"use strict";

const parsePlatformFilePath = require("./parsePlatformFilePath");
const path = require("path");
const ASSET_BASE_NAME_RE = /(.+?)(@([\d.]+)x)?$/;
function parseBaseName(baseName) {
  const match = baseName.match(ASSET_BASE_NAME_RE);
  if (!match) {
    throw new Error(`invalid asset name: \`${baseName}'`);
  }
  const rootName = match[1];
  if (match[3] != null) {
    const resolution = parseFloat(match[3]);
    if (!Number.isNaN(resolution)) {
      return {
        rootName,
        resolution,
      };
    }
  }
  return {
    rootName,
    resolution: 1,
  };
}
function tryParse(filePath, platforms) {
  const result = parsePlatformFilePath(filePath, platforms);
  const { dirPath, baseName, platform, extension } = result;
  if (extension == null) {
    return null;
  }
  const { rootName, resolution } = parseBaseName(baseName);
  return {
    assetName: path.join(dirPath, `${rootName}.${extension}`),
    name: rootName,
    platform,
    resolution,
    type: extension,
  };
}
function parse(filePath, platforms) {
  const result = tryParse(filePath, platforms);
  if (result == null) {
    throw new Error(`invalid asset file path: ${filePath}`);
  }
  return result;
}
module.exports = {
  parse,
  tryParse,
};
