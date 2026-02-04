"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.reactNativePlatformResolver = reactNativePlatformResolver;
function reactNativePlatformResolver(platformImplementations, customResolver) {
  return (context, moduleName, platform) => {
    let modifiedModuleName = moduleName;
    if (platform != null && platformImplementations[platform]) {
      if (moduleName === "react-native") {
        modifiedModuleName = platformImplementations[platform];
      } else if (moduleName.startsWith("react-native/")) {
        modifiedModuleName = `${
          platformImplementations[platform]
        }/${modifiedModuleName.slice("react-native/".length)}`;
      }
    }
    if (customResolver) {
      return customResolver(context, modifiedModuleName, platform);
    }
    return context.resolveRequest(context, modifiedModuleName, platform);
  };
}
