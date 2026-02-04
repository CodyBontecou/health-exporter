"use strict";

const path = require("path");
function relativizeSourceMapInline(sourceMap, sourcesRoot) {
  if (sourceMap.mappings === undefined) {
    for (let i = 0; i < sourceMap.sections.length; i++) {
      relativizeSourceMapInline(sourceMap.sections[i].map, sourcesRoot);
    }
  } else {
    for (let i = 0; i < sourceMap.sources.length; i++) {
      sourceMap.sources[i] = path.relative(sourcesRoot, sourceMap.sources[i]);
    }
  }
}
module.exports = relativizeSourceMapInline;
