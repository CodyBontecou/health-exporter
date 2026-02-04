"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = attachKeyHandlers;
var _logger = require("../../utils/logger");
var _OpenDebuggerKeyboardHandler = _interopRequireDefault(
  require("./OpenDebuggerKeyboardHandler")
);
var _chalk = _interopRequireDefault(require("chalk"));
var _execa = _interopRequireDefault(require("execa"));
var _invariant = _interopRequireDefault(require("invariant"));
var _readline = _interopRequireDefault(require("readline"));
var _tty = require("tty");
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const CTRL_C = "\u0003";
const CTRL_D = "\u0004";
const RELOAD_TIMEOUT = 500;
const throttle = (callback, timeout) => {
  let previousCallTimestamp = 0;
  return () => {
    const currentCallTimestamp = new Date().getTime();
    if (currentCallTimestamp - previousCallTimestamp > timeout) {
      previousCallTimestamp = currentCallTimestamp;
      callback();
    }
  };
};
function attachKeyHandlers({
  cliConfig,
  devServerUrl,
  messageSocket,
  reporter,
}) {
  if (process.stdin.isTTY !== true) {
    _logger.logger.debug(
      "Interactive mode is not supported in this environment"
    );
    return;
  }
  _readline.default.emitKeypressEvents(process.stdin);
  setRawMode(true);
  const execaOptions = {
    env: {
      FORCE_COLOR: _chalk.default.supportsColor ? "true" : "false",
    },
  };
  const reload = throttle(() => {
    _logger.logger.info("Reloading connected app(s)...");
    messageSocket.broadcast("reload", null);
  }, RELOAD_TIMEOUT);
  const openDebuggerKeyboardHandler = new _OpenDebuggerKeyboardHandler.default({
    reporter,
    devServerUrl,
  });
  process.stdin.on("keypress", (str, key) => {
    _logger.logger.debug(`Key pressed: ${key.sequence}`);
    if (openDebuggerKeyboardHandler.maybeHandleTargetSelection(key.name)) {
      return;
    }
    switch (key.sequence) {
      case "r":
        reload();
        break;
      case "d":
        _logger.logger.info("Opening Dev Menu...");
        messageSocket.broadcast("devMenu", null);
        break;
      case "i":
        _logger.logger.info("Opening app on iOS...");
        (0, _execa.default)(
          "npx",
          [
            "react-native",
            "run-ios",
            ...(cliConfig.project.ios?.watchModeCommandParams ?? []),
          ],
          execaOptions
        ).stdout?.pipe(process.stdout);
        break;
      case "a":
        _logger.logger.info("Opening app on Android...");
        (0, _execa.default)(
          "npx",
          [
            "react-native",
            "run-android",
            ...(cliConfig.project.android?.watchModeCommandParams ?? []),
          ],
          execaOptions
        ).stdout?.pipe(process.stdout);
        break;
      case "j":
        void openDebuggerKeyboardHandler.handleOpenDebugger();
        break;
      case CTRL_C:
      case CTRL_D:
        openDebuggerKeyboardHandler.dismiss();
        _logger.logger.info("Stopping server");
        setRawMode(false);
        process.stdin.pause();
        process.emit("SIGINT");
        process.exit();
    }
  });
  _logger.logger.log(
    [
      "",
      `${_chalk.default.bold("i")} - run on iOS`,
      `${_chalk.default.bold("a")} - run on Android`,
      `${_chalk.default.bold("r")} - reload app`,
      `${_chalk.default.bold("d")} - open Dev Menu`,
      `${_chalk.default.bold("j")} - open DevTools`,
      "",
    ].join("\n")
  );
}
function setRawMode(enable) {
  (0, _invariant.default)(
    process.stdin instanceof _tty.ReadStream,
    "process.stdin must be a readable stream to modify raw mode"
  );
  process.stdin.setRawMode(enable);
}
