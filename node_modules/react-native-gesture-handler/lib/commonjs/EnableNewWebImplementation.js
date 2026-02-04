"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableExperimentalWebImplementation = enableExperimentalWebImplementation;
exports.enableLegacyWebImplementation = enableLegacyWebImplementation;
exports.isNewWebImplementationEnabled = isNewWebImplementationEnabled;

var _reactNative = require("react-native");

let useNewWebImplementation = true;
let getWasCalled = false;

function enableExperimentalWebImplementation(_shouldEnable = true) {// NO-OP since the new implementation is now the default
}

function enableLegacyWebImplementation(shouldUseLegacyImplementation = true) {
  if (_reactNative.Platform.OS !== 'web' || useNewWebImplementation === !shouldUseLegacyImplementation) {
    return;
  }

  if (getWasCalled) {
    console.error('Some parts of this application have already started using the new gesture handler implementation. No changes will be applied. You can try enabling legacy implementation earlier.');
    return;
  }

  useNewWebImplementation = !shouldUseLegacyImplementation;
}

function isNewWebImplementationEnabled() {
  getWasCalled = true;
  return useNewWebImplementation;
}
//# sourceMappingURL=EnableNewWebImplementation.js.map