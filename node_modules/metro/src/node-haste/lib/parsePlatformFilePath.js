"use strict";

const path = require("path");
const PATH_RE = /^(.+?)(\.([^.]+))?\.([^.]+)$/;
function parsePlatformFilePath(filePath, platforms) {
  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const match = fileName.match(PATH_RE);
  if (!match) {
    return {
      dirPath,
      baseName: fileName,
      platform: null,
      extension: null,
    };
  }
  const extension = match[4] || null;
  const platform = match[3] || null;
  if (platform == null || platforms.has(platform)) {
    return {
      dirPath,
      baseName: match[1],
      platform,
      extension,
    };
  }
  const baseName = `${match[1]}.${platform}`;
  return {
    dirPath,
    baseName,
    platform: null,
    extension,
  };
}
module.exports = parsePlatformFilePath;
