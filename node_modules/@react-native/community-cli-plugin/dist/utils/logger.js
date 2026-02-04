"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.logger = void 0;
var _chalk = _interopRequireDefault(require("chalk"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const SEPARATOR = ", ";
let verbose = process.argv.includes("--verbose");
let disabled = false;
let hidden = false;
const formatMessages = (messages) =>
  _chalk.default.reset(messages.join(SEPARATOR));
const success = (...messages) => {
  if (!disabled) {
    console.log(
      `${_chalk.default.green.bold("success")} ${formatMessages(messages)}`
    );
  }
};
const info = (...messages) => {
  if (!disabled) {
    console.log(
      `${_chalk.default.cyan.bold("info")} ${formatMessages(messages)}`
    );
  }
};
const warn = (...messages) => {
  if (!disabled) {
    console.warn(
      `${_chalk.default.yellow.bold("warn")} ${formatMessages(messages)}`
    );
  }
};
const error = (...messages) => {
  if (!disabled) {
    console.error(
      `${_chalk.default.red.bold("error")} ${formatMessages(messages)}`
    );
  }
};
const debug = (...messages) => {
  if (verbose && !disabled) {
    console.log(
      `${_chalk.default.gray.bold("debug")} ${formatMessages(messages)}`
    );
  } else {
    hidden = true;
  }
};
const log = (...messages) => {
  if (!disabled) {
    console.log(`${formatMessages(messages)}`);
  }
};
const setVerbose = (level) => {
  verbose = level;
};
const isVerbose = () => verbose;
const disable = () => {
  disabled = true;
};
const enable = () => {
  disabled = false;
};
const hasDebugMessages = () => hidden;
let communityLogger;
try {
  const { logger } = require("@react-native-community/cli-tools");
  logger.debug("Using @react-naive-community/cli-tools' logger");
  communityLogger = logger;
} catch {}
const logger = (exports.logger = communityLogger ?? {
  success,
  info,
  warn,
  error,
  debug,
  log,
  setVerbose,
  isVerbose,
  hasDebugMessages,
  disable,
  enable,
});
if (communityLogger == null) {
  logger.debug("Using @react-native/communityu-cli-plugin's logger");
}
