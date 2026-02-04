"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = isDevServerRunning;
var _net = _interopRequireDefault(require("net"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
async function isDevServerRunning(devServerUrl, projectRoot) {
  const { hostname, port } = new URL(devServerUrl);
  try {
    if (!(await isPortOccupied(hostname, port))) {
      return "not_running";
    }
    const statusResponse = await (0, _nodeFetch.default)(
      `${devServerUrl}/status`
    );
    const body = await statusResponse.text();
    return body === "packager-status:running" &&
      statusResponse.headers.get("X-React-Native-Project-Root") === projectRoot
      ? "matched_server_running"
      : "port_taken";
  } catch (e) {
    return "unknown";
  }
}
async function isPortOccupied(hostname, port) {
  let result = false;
  const server = _net.default.createServer();
  return new Promise((resolve, reject) => {
    server.once("error", (e) => {
      server.close();
      if (e.code === "EADDRINUSE") {
        result = true;
      } else {
        reject(e);
      }
    });
    server.once("listening", () => {
      result = false;
      server.close();
    });
    server.once("close", () => {
      resolve(result);
    });
    server.listen({
      host: hostname,
      port,
    });
  });
}
