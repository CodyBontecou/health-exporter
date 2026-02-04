"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = getDevToolsFrontendUrl;
function getDevToolsFrontendUrl(
  experiments,
  webSocketDebuggerUrl,
  devServerUrl,
  options
) {
  const wsParam = getWsParam({
    webSocketDebuggerUrl,
    devServerUrl,
  });
  const appUrl =
    (options?.relative === true ? "" : devServerUrl) +
    "/debugger-frontend/" +
    (options?.useFuseboxEntryPoint === true
      ? "rn_fusebox.html"
      : "rn_inspector.html");
  const searchParams = new URLSearchParams([
    [wsParam.key, wsParam.value],
    ["sources.hide_add_folder", "true"],
  ]);
  if (experiments.enableNetworkInspector) {
    searchParams.append("unstable_enableNetworkPanel", "true");
  }
  if (options?.launchId != null && options.launchId !== "") {
    searchParams.append("launchId", options.launchId);
  }
  return appUrl + "?" + searchParams.toString();
}
function getWsParam({ webSocketDebuggerUrl, devServerUrl }) {
  const wsUrl = new URL(webSocketDebuggerUrl);
  const serverHost = new URL(devServerUrl).host;
  let value;
  if (wsUrl.host === serverHost) {
    value = wsUrl.pathname + wsUrl.search + wsUrl.hash;
  } else {
    value = wsUrl.host + wsUrl.pathname + wsUrl.search + wsUrl.hash;
  }
  const key = wsUrl.protocol.slice(0, -1);
  return {
    key,
    value,
  };
}
