"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _Device = _interopRequireDefault(require("./Device"));
var _nullthrows = _interopRequireDefault(require("nullthrows"));
var _timers = require("timers");
var _url = _interopRequireDefault(require("url"));
var _ws = _interopRequireDefault(require("ws"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const debug = require("debug")("Metro:InspectorProxy");
const WS_DEVICE_URL = "/inspector/device";
const WS_DEBUGGER_URL = "/inspector/debug";
const PAGES_LIST_JSON_URL = "/json";
const PAGES_LIST_JSON_URL_2 = "/json/list";
const PAGES_LIST_JSON_VERSION_URL = "/json/version";
const MAX_PONG_LATENCY_MS = 60000;
const DEBUGGER_HEARTBEAT_INTERVAL_MS = 10000;
const INTERNAL_ERROR_CODE = 1011;
class InspectorProxy {
  #projectRoot;
  #serverBaseUrl;
  #devices;
  #deviceCounter = 0;
  #eventReporter;
  #experiments;
  #customMessageHandler;
  constructor(
    projectRoot,
    serverBaseUrl,
    eventReporter,
    experiments,
    customMessageHandler
  ) {
    this.#projectRoot = projectRoot;
    this.#serverBaseUrl = serverBaseUrl;
    this.#devices = new Map();
    this.#eventReporter = eventReporter;
    this.#experiments = experiments;
    this.#customMessageHandler = customMessageHandler;
  }
  getPageDescriptions() {
    let result = [];
    Array.from(this.#devices.entries()).forEach(([deviceId, device]) => {
      result = result.concat(
        device
          .getPagesList()
          .map((page) => this.#buildPageDescription(deviceId, device, page))
      );
    });
    return result;
  }
  processRequest(request, response, next) {
    const pathname = _url.default.parse(request.url).pathname;
    if (
      pathname === PAGES_LIST_JSON_URL ||
      pathname === PAGES_LIST_JSON_URL_2
    ) {
      this.#sendJsonResponse(response, this.getPageDescriptions());
    } else if (pathname === PAGES_LIST_JSON_VERSION_URL) {
      this.#sendJsonResponse(response, {
        Browser: "Mobile JavaScript",
        "Protocol-Version": "1.1",
      });
    } else {
      next();
    }
  }
  createWebSocketListeners() {
    return {
      [WS_DEVICE_URL]: this.#createDeviceConnectionWSServer(),
      [WS_DEBUGGER_URL]: this.#createDebuggerConnectionWSServer(),
    };
  }
  #buildPageDescription(deviceId, device, page) {
    const { host, protocol } = new URL(this.#serverBaseUrl);
    const webSocketScheme = protocol === "https:" ? "wss" : "ws";
    const webSocketUrlWithoutProtocol = `${host}${WS_DEBUGGER_URL}?device=${deviceId}&page=${page.id}`;
    const devtoolsFrontendUrl =
      `devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&${webSocketScheme}=` +
      encodeURIComponent(webSocketUrlWithoutProtocol);
    return {
      id: `${deviceId}-${page.id}`,
      title: page.title,
      description: page.app,
      type: "node",
      devtoolsFrontendUrl,
      webSocketDebuggerUrl: `${webSocketScheme}://${webSocketUrlWithoutProtocol}`,
      ...(page.vm != null
        ? {
            vm: page.vm,
          }
        : null),
      deviceName: device.getName(),
      reactNative: {
        logicalDeviceId: deviceId,
        capabilities: (0, _nullthrows.default)(page.capabilities),
      },
    };
  }
  #sendJsonResponse(response, object) {
    const data = JSON.stringify(object, null, 2);
    response.writeHead(200, {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-cache",
      "Content-Length": Buffer.byteLength(data).toString(),
      Connection: "close",
    });
    response.end(data);
  }
  #createDeviceConnectionWSServer() {
    const wss = new _ws.default.Server({
      noServer: true,
      perMessageDeflate: true,
      maxPayload: 0,
    });
    wss.on("connection", async (socket, req) => {
      try {
        const fallbackDeviceId = String(this.#deviceCounter++);
        const query = _url.default.parse(req.url || "", true).query || {};
        const deviceId = query.device || fallbackDeviceId;
        const deviceName = query.name || "Unknown";
        const appName = query.app || "Unknown";
        const oldDevice = this.#devices.get(deviceId);
        let newDevice;
        if (oldDevice) {
          oldDevice.dangerouslyRecreateDevice(
            deviceId,
            deviceName,
            appName,
            socket,
            this.#projectRoot,
            this.#eventReporter,
            this.#customMessageHandler
          );
          newDevice = oldDevice;
        } else {
          newDevice = new _Device.default(
            deviceId,
            deviceName,
            appName,
            socket,
            this.#projectRoot,
            this.#eventReporter,
            this.#customMessageHandler
          );
        }
        this.#devices.set(deviceId, newDevice);
        debug(
          `Got new connection: name=${deviceName}, app=${appName}, device=${deviceId}`
        );
        socket.on("close", () => {
          if (this.#devices.get(deviceId)?.dangerouslyGetSocket() === socket) {
            this.#devices.delete(deviceId);
          }
          debug(`Device ${deviceName} disconnected.`);
        });
      } catch (e) {
        console.error("error", e);
        socket.close(INTERNAL_ERROR_CODE, e?.toString() ?? "Unknown error");
      }
    });
    return wss;
  }
  #createDebuggerConnectionWSServer() {
    const wss = new _ws.default.Server({
      noServer: true,
      perMessageDeflate: false,
      maxPayload: 0,
    });
    wss.on("connection", async (socket, req) => {
      try {
        const query = _url.default.parse(req.url || "", true).query || {};
        const deviceId = query.device;
        const pageId = query.page;
        if (deviceId == null || pageId == null) {
          throw new Error("Incorrect URL - must provide device and page IDs");
        }
        const device = this.#devices.get(deviceId);
        if (device == null) {
          throw new Error("Unknown device with ID " + deviceId);
        }
        this.#startHeartbeat(socket, DEBUGGER_HEARTBEAT_INTERVAL_MS);
        device.handleDebuggerConnection(socket, pageId, {
          userAgent: req.headers["user-agent"] ?? query.userAgent ?? null,
        });
      } catch (e) {
        console.error(e);
        socket.close(INTERNAL_ERROR_CODE, e?.toString() ?? "Unknown error");
        this.#eventReporter?.logEvent({
          type: "connect_debugger_frontend",
          status: "error",
          error: e,
        });
      }
    });
    return wss;
  }
  #startHeartbeat(socket, intervalMs) {
    let shouldSetTerminateTimeout = false;
    let terminateTimeout = null;
    const pingTimeout = (0, _timers.setTimeout)(() => {
      if (socket.readyState !== _ws.default.OPEN) {
        pingTimeout.refresh();
        return;
      }
      shouldSetTerminateTimeout = true;
      socket.ping(() => {
        if (!shouldSetTerminateTimeout) {
          return;
        }
        shouldSetTerminateTimeout = false;
        terminateTimeout = (0, _timers.setTimeout)(() => {
          if (socket.readyState !== _ws.default.OPEN) {
            return;
          }
          socket.terminate();
        }, MAX_PONG_LATENCY_MS).unref();
      });
    }, intervalMs).unref();
    const onAnyMessageFromDebugger = () => {
      shouldSetTerminateTimeout = false;
      terminateTimeout && (0, _timers.clearTimeout)(terminateTimeout);
      pingTimeout.refresh();
    };
    socket.on("pong", onAnyMessageFromDebugger);
    socket.on("message", onAnyMessageFromDebugger);
    socket.on("close", () => {
      shouldSetTerminateTimeout = false;
      terminateTimeout && (0, _timers.clearTimeout)(terminateTimeout);
      (0, _timers.clearTimeout)(pingTimeout);
    });
  }
}
exports.default = InspectorProxy;
