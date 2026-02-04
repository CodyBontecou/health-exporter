"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
const ALLOWED_SCALES = {
  ios: [1, 2, 3],
};
function filterPlatformAssetScales(platform, scales) {
  const whitelist = ALLOWED_SCALES[platform];
  if (!whitelist) {
    return scales;
  }
  const result = scales.filter((scale) => whitelist.indexOf(scale) > -1);
  if (result.length === 0 && scales.length > 0) {
    const maxScale = whitelist[whitelist.length - 1];
    for (const scale of scales) {
      if (scale > maxScale) {
        result.push(scale);
        break;
      }
    }
    if (result.length === 0) {
      result.push(scales[scales.length - 1]);
    }
  }
  return result;
}
var _default = (exports.default = filterPlatformAssetScales);
