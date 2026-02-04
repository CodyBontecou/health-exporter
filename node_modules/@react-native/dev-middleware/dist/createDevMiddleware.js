"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = createDevMiddleware;
var _InspectorProxy = _interopRequireDefault(
  require("./inspector-proxy/InspectorProxy")
);
var _openDebuggerMiddleware = _interopRequireDefault(
  require("./middleware/openDebuggerMiddleware")
);
var _DefaultBrowserLauncher = _interopRequireDefault(
  require("./utils/DefaultBrowserLauncher")
);
var _debuggerFrontend = _interopRequireDefault(
  require("@react-native/debugger-frontend")
);
var _connect = _interopRequireDefault(require("connect"));
var _path = _interopRequireDefault(require("path"));
var _serveStatic = _interopRequireDefault(require("serve-static"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function createDevMiddleware({
  projectRoot,
  serverBaseUrl,
  logger,
  unstable_browserLauncher = _DefaultBrowserLauncher.default,
  unstable_eventReporter,
  unstable_experiments: experimentConfig = {},
  unstable_customInspectorMessageHandler,
}) {
  const experiments = getExperiments(experimentConfig);
  const inspectorProxy = new _InspectorProxy.default(
    projectRoot,
    serverBaseUrl,
    unstable_eventReporter,
    experiments,
    unstable_customInspectorMessageHandler
  );
  const middleware = (0, _connect.default)()
    .use(
      "/open-debugger",
      (0, _openDebuggerMiddleware.default)({
        serverBaseUrl,
        inspectorProxy,
        browserLauncher: unstable_browserLauncher,
        eventReporter: unstable_eventReporter,
        experiments,
        logger,
      })
    )
    .use(
      "/debugger-frontend/embedder-static/embedderScript.js",
      (_req, res) => {
        res.setHeader("Content-Type", "application/javascript");
        res.end("");
      }
    )
    .use(
      "/debugger-frontend",
      (0, _serveStatic.default)(_path.default.join(_debuggerFrontend.default), {
        fallthrough: false,
      })
    )
    .use((...args) => inspectorProxy.processRequest(...args));
  return {
    middleware,
    websocketEndpoints: inspectorProxy.createWebSocketListeners(),
  };
}
function getExperiments(config) {
  return {
    enableOpenDebuggerRedirect: config.enableOpenDebuggerRedirect ?? false,
    enableNetworkInspector: config.enableNetworkInspector ?? false,
  };
}
