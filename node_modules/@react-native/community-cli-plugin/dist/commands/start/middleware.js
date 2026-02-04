"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.indexPageMiddleware = exports.createDevServerMiddleware = void 0;
var _logger = require("../../utils/logger");
const noopNextHandle = (req, res, next) => {
  next();
};
const unusedStubWSServer = {};
const unusedMiddlewareStub = {};
const communityMiddlewareFallback = {
  createDevServerMiddleware: (params) => ({
    middleware: unusedMiddlewareStub,
    websocketEndpoints: {},
    messageSocketEndpoint: {
      server: unusedStubWSServer,
      broadcast: (method, _params) => {},
    },
    eventsSocketEndpoint: {
      server: unusedStubWSServer,
      reportEvent: (event) => {},
    },
  }),
  indexPageMiddleware: noopNextHandle,
};
try {
  const community = require("@react-native-community/cli-server-api");
  communityMiddlewareFallback.indexPageMiddleware =
    community.indexPageMiddleware;
  communityMiddlewareFallback.createDevServerMiddleware =
    community.createDevServerMiddleware;
} catch {
  _logger.logger.debug(`⚠️ Unable to find @react-native-community/cli-server-api
Starting the server without the community middleware.`);
}
const createDevServerMiddleware = (exports.createDevServerMiddleware =
  communityMiddlewareFallback.createDevServerMiddleware);
const indexPageMiddleware = (exports.indexPageMiddleware =
  communityMiddlewareFallback.indexPageMiddleware);
