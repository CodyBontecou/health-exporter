"use strict";

var _ws = _interopRequireDefault(require("ws"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
module.exports = function createWebsocketServer({ websocketServer }) {
  const wss = new _ws.default.Server({
    noServer: true,
  });
  wss.on("connection", async (ws, req) => {
    let connected = true;
    const url = req.url;
    const sendFn = (...args) => {
      if (connected) {
        ws.send(...args);
      }
    };
    const client = await websocketServer.onClientConnect(url, sendFn);
    if (client == null) {
      ws.close();
      return;
    }
    ws.on("error", (e) => {
      websocketServer.onClientError && websocketServer.onClientError(client, e);
    });
    ws.on("close", () => {
      websocketServer.onClientDisconnect &&
        websocketServer.onClientDisconnect(client);
      connected = false;
    });
    ws.on("message", (message) => {
      websocketServer.onClientMessage &&
        websocketServer.onClientMessage(client, message, sendFn);
    });
  });
  return wss;
};
