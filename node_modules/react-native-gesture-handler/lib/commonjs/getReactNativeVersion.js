"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReactNativeVersion = getReactNativeVersion;

var _package = _interopRequireDefault(require("react-native/package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const [majorStr, minorStr] = _package.default.version.split('.');

const REACT_NATIVE_VERSION = {
  major: parseInt(majorStr, 10),
  minor: parseInt(minorStr, 10)
};

function getReactNativeVersion() {
  return REACT_NATIVE_VERSION;
}
//# sourceMappingURL=getReactNativeVersion.js.map