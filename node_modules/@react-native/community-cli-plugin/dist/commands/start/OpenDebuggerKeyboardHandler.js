"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _chalk = _interopRequireDefault(require("chalk"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
class OpenDebuggerKeyboardHandler {
  #devServerUrl;
  #reporter;
  #targetsShownForSelection = null;
  constructor({ devServerUrl, reporter }) {
    this.#devServerUrl = devServerUrl;
    this.#reporter = reporter;
  }
  async #tryOpenDebuggerForTarget(target) {
    this.#targetsShownForSelection = null;
    this.#clearTerminalMenu();
    try {
      await (0, _nodeFetch.default)(
        new URL(
          "/open-debugger?target=" + encodeURIComponent(target.id),
          this.#devServerUrl
        ).href,
        {
          method: "POST",
        }
      );
    } catch (e) {
      this.#log(
        "error",
        "Failed to open debugger for %s on %s debug targets: %s",
        target.description,
        target.deviceName,
        e.message
      );
      this.#clearTerminalMenu();
    }
  }
  async handleOpenDebugger() {
    this.#setTerminalMenu("Fetching available debugging targets...");
    this.#targetsShownForSelection = null;
    try {
      const res = await (0, _nodeFetch.default)(
        this.#devServerUrl + "/json/list",
        {
          method: "POST",
        }
      );
      if (res.status !== 200) {
        throw new Error(`Unexpected status code: ${res.status}`);
      }
      const targets = await res.json();
      if (!Array.isArray(targets)) {
        throw new Error("Expected array.");
      }
      if (targets.length === 0) {
        this.#log("warn", "No connected targets");
        this.#clearTerminalMenu();
      } else if (targets.length === 1) {
        const target = targets[0];
        void this.#tryOpenDebuggerForTarget(target);
      } else {
        this.#targetsShownForSelection = targets;
        if (targets.length > 9) {
          this.#log(
            "warn",
            "10 or more debug targets available, showing the first 9."
          );
        }
        this.#setTerminalMenu(
          `Multiple debug targets available, please select:\n  ${targets
            .slice(0, 9)
            .map(
              ({ description, deviceName }, i) =>
                ` ${_chalk.default.white.inverse(
                  ` ${i + 1} `
                )} - "${description}" on "${deviceName}"`
            )
            .join("\n  ")}`
        );
      }
    } catch (e) {
      this.#log("error", `Failed to fetch debug targets: ${e.message}`);
      this.#clearTerminalMenu();
    }
  }
  maybeHandleTargetSelection(keyName) {
    if (keyName >= "1" && keyName <= "9") {
      const targetIndex = Number(keyName) - 1;
      if (
        this.#targetsShownForSelection != null &&
        targetIndex < this.#targetsShownForSelection.length
      ) {
        const target = this.#targetsShownForSelection[targetIndex];
        void this.#tryOpenDebuggerForTarget(target);
        return true;
      }
    }
    return false;
  }
  dismiss() {
    this.#clearTerminalMenu();
    this.#targetsShownForSelection = null;
  }
  #log(level, ...data) {
    this.#reporter.update({
      type: "unstable_server_log",
      level,
      data,
    });
  }
  #setTerminalMenu(message) {
    this.#reporter.update({
      type: "unstable_server_menu_updated",
      message,
    });
  }
  #clearTerminalMenu() {
    this.#reporter.update({
      type: "unstable_server_menu_cleared",
    });
  }
}
exports.default = OpenDebuggerKeyboardHandler;
