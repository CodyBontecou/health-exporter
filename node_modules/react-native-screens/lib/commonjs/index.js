"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  enableScreens: true,
  enableFreeze: true,
  screensEnabled: true,
  freezeEnabled: true,
  Screen: true,
  InnerScreen: true,
  ScreenContext: true,
  ScreenStackHeaderConfig: true,
  ScreenStackHeaderSubview: true,
  ScreenStackHeaderLeftView: true,
  ScreenStackHeaderCenterView: true,
  ScreenStackHeaderRightView: true,
  ScreenStackHeaderBackButtonImage: true,
  ScreenStackHeaderSearchBarView: true,
  SearchBar: true,
  ScreenContainer: true,
  ScreenStack: true,
  ScreenStackItem: true,
  FullWindowOverlay: true,
  ScreenFooter: true,
  ScreenContentWrapper: true,
  isSearchBarAvailableForCurrentPlatform: true,
  compatibilityFlags: true,
  executeNativeBackPress: true,
  useTransitionProgress: true
};
Object.defineProperty(exports, "FullWindowOverlay", {
  enumerable: true,
  get: function () {
    return _FullWindowOverlay.default;
  }
});
Object.defineProperty(exports, "InnerScreen", {
  enumerable: true,
  get: function () {
    return _Screen.InnerScreen;
  }
});
Object.defineProperty(exports, "Screen", {
  enumerable: true,
  get: function () {
    return _Screen.default;
  }
});
Object.defineProperty(exports, "ScreenContainer", {
  enumerable: true,
  get: function () {
    return _ScreenContainer.default;
  }
});
Object.defineProperty(exports, "ScreenContentWrapper", {
  enumerable: true,
  get: function () {
    return _ScreenContentWrapper.default;
  }
});
Object.defineProperty(exports, "ScreenContext", {
  enumerable: true,
  get: function () {
    return _Screen.ScreenContext;
  }
});
Object.defineProperty(exports, "ScreenFooter", {
  enumerable: true,
  get: function () {
    return _ScreenFooter.default;
  }
});
Object.defineProperty(exports, "ScreenStack", {
  enumerable: true,
  get: function () {
    return _ScreenStack.default;
  }
});
Object.defineProperty(exports, "ScreenStackHeaderBackButtonImage", {
  enumerable: true,
  get: function () {
    return _ScreenStackHeaderConfig.ScreenStackHeaderBackButtonImage;
  }
});
Object.defineProperty(exports, "ScreenStackHeaderCenterView", {
  enumerable: true,
  get: function () {
    return _ScreenStackHeaderConfig.ScreenStackHeaderCenterView;
  }
});
Object.defineProperty(exports, "ScreenStackHeaderConfig", {
  enumerable: true,
  get: function () {
    return _ScreenStackHeaderConfig.ScreenStackHeaderConfig;
  }
});
Object.defineProperty(exports, "ScreenStackHeaderLeftView", {
  enumerable: true,
  get: function () {
    return _ScreenStackHeaderConfig.ScreenStackHeaderLeftView;
  }
});
Object.defineProperty(exports, "ScreenStackHeaderRightView", {
  enumerable: true,
  get: function () {
    return _ScreenStackHeaderConfig.ScreenStackHeaderRightView;
  }
});
Object.defineProperty(exports, "ScreenStackHeaderSearchBarView", {
  enumerable: true,
  get: function () {
    return _ScreenStackHeaderConfig.ScreenStackHeaderSearchBarView;
  }
});
Object.defineProperty(exports, "ScreenStackHeaderSubview", {
  enumerable: true,
  get: function () {
    return _ScreenStackHeaderConfig.ScreenStackHeaderSubview;
  }
});
Object.defineProperty(exports, "ScreenStackItem", {
  enumerable: true,
  get: function () {
    return _ScreenStackItem.default;
  }
});
Object.defineProperty(exports, "SearchBar", {
  enumerable: true,
  get: function () {
    return _SearchBar.default;
  }
});
Object.defineProperty(exports, "compatibilityFlags", {
  enumerable: true,
  get: function () {
    return _utils.compatibilityFlags;
  }
});
Object.defineProperty(exports, "enableFreeze", {
  enumerable: true,
  get: function () {
    return _core.enableFreeze;
  }
});
Object.defineProperty(exports, "enableScreens", {
  enumerable: true,
  get: function () {
    return _core.enableScreens;
  }
});
Object.defineProperty(exports, "executeNativeBackPress", {
  enumerable: true,
  get: function () {
    return _utils.executeNativeBackPress;
  }
});
Object.defineProperty(exports, "freezeEnabled", {
  enumerable: true,
  get: function () {
    return _core.freezeEnabled;
  }
});
Object.defineProperty(exports, "isSearchBarAvailableForCurrentPlatform", {
  enumerable: true,
  get: function () {
    return _utils.isSearchBarAvailableForCurrentPlatform;
  }
});
Object.defineProperty(exports, "screensEnabled", {
  enumerable: true,
  get: function () {
    return _core.screensEnabled;
  }
});
Object.defineProperty(exports, "useTransitionProgress", {
  enumerable: true,
  get: function () {
    return _useTransitionProgress.default;
  }
});
require("./fabric/NativeScreensModule");
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _core = require("./core");
var _Screen = _interopRequireWildcard(require("./components/Screen"));
var _ScreenStackHeaderConfig = require("./components/ScreenStackHeaderConfig");
var _SearchBar = _interopRequireDefault(require("./components/SearchBar"));
var _ScreenContainer = _interopRequireDefault(require("./components/ScreenContainer"));
var _ScreenStack = _interopRequireDefault(require("./components/ScreenStack"));
var _ScreenStackItem = _interopRequireDefault(require("./components/ScreenStackItem"));
var _FullWindowOverlay = _interopRequireDefault(require("./components/FullWindowOverlay"));
var _ScreenFooter = _interopRequireDefault(require("./components/ScreenFooter"));
var _ScreenContentWrapper = _interopRequireDefault(require("./components/ScreenContentWrapper"));
var _utils = require("./utils");
var _useTransitionProgress = _interopRequireDefault(require("./useTransitionProgress"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//# sourceMappingURL=index.js.map