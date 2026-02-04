"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = openDebuggerMiddleware;
var _getDevToolsFrontendUrl = _interopRequireDefault(
  require("../utils/getDevToolsFrontendUrl")
);
var _url = _interopRequireDefault(require("url"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function openDebuggerMiddleware({
  serverBaseUrl,
  logger,
  browserLauncher,
  eventReporter,
  experiments,
  inspectorProxy,
}) {
  return async (req, res, next) => {
    if (
      req.method === "POST" ||
      (experiments.enableOpenDebuggerRedirect && req.method === "GET")
    ) {
      const { query } = _url.default.parse(req.url, true);
      const { appId, device, launchId, target: targetId } = query;
      const targets = inspectorProxy
        .getPageDescriptions()
        .filter(
          (app) =>
            app.title ===
              "React Native Experimental (Improved Chrome Reloads)" ||
            app.reactNative.capabilities?.nativePageReloads === true
        );
      let target;
      const launchType = req.method === "POST" ? "launch" : "redirect";
      if (
        typeof targetId === "string" ||
        typeof appId === "string" ||
        typeof device === "string"
      ) {
        logger?.info(
          (launchType === "launch" ? "Launching" : "Redirecting to") +
            " DevTools..."
        );
        target = targets.find(
          (_target) =>
            (targetId == null || _target.id === targetId) &&
            (appId == null || _target.description === appId) &&
            (device == null || _target.reactNative.logicalDeviceId === device)
        );
      } else if (targets.length > 0) {
        logger?.info(
          (launchType === "launch" ? "Launching" : "Redirecting to") +
            ` DevTools${
              targets.length === 1 ? "" : " for most recently connected target"
            }...`
        );
        target = targets[targets.length - 1];
      }
      if (!target) {
        res.writeHead(404);
        res.end("Unable to find debugger target");
        logger?.warn(
          "No compatible apps connected. React Native DevTools can only be used with the Hermes engine."
        );
        eventReporter?.logEvent({
          type: "launch_debugger_frontend",
          launchType,
          status: "coded_error",
          errorCode: "NO_APPS_FOUND",
        });
        return;
      }
      const useFuseboxEntryPoint =
        target.reactNative.capabilities?.prefersFuseboxFrontend;
      try {
        switch (launchType) {
          case "launch":
            await browserLauncher.launchDebuggerAppWindow(
              (0, _getDevToolsFrontendUrl.default)(
                experiments,
                target.webSocketDebuggerUrl,
                serverBaseUrl,
                {
                  launchId,
                  useFuseboxEntryPoint,
                }
              )
            );
            res.writeHead(200);
            res.end();
            break;
          case "redirect":
            res.writeHead(302, {
              Location: (0, _getDevToolsFrontendUrl.default)(
                experiments,
                target.webSocketDebuggerUrl,
                serverBaseUrl,
                {
                  relative: true,
                  launchId,
                  useFuseboxEntryPoint,
                }
              ),
            });
            res.end();
            break;
          default:
        }
        eventReporter?.logEvent({
          type: "launch_debugger_frontend",
          launchType,
          status: "success",
          appId: appId ?? null,
          deviceId: device ?? null,
          resolvedTargetDescription: target.description,
          prefersFuseboxFrontend: useFuseboxEntryPoint ?? false,
        });
        return;
      } catch (e) {
        logger?.error(
          "Error launching DevTools: " + e.message ?? "Unknown error"
        );
        res.writeHead(500);
        res.end();
        eventReporter?.logEvent({
          type: "launch_debugger_frontend",
          launchType,
          status: "error",
          error: e,
          prefersFuseboxFrontend: useFuseboxEntryPoint ?? false,
        });
        return;
      }
    }
    next();
  };
}
