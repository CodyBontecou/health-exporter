"use strict";

const logToConsole = require("./logToConsole");
const reporting = require("./reporting");
const chalk = require("chalk");
const throttle = require("lodash.throttle");
const { AmbiguousModuleResolutionError } = require("metro-core");
const path = require("path");
const DARK_BLOCK_CHAR = "\u2593";
const LIGHT_BLOCK_CHAR = "\u2591";
const MAX_PROGRESS_BAR_CHAR_WIDTH = 16;
class TerminalReporter {
  constructor(terminal) {
    this._activeBundles = new Map();
    this._scheduleUpdateBundleProgress = throttle((data) => {
      this.update({
        ...data,
        type: "bundle_transform_progressed_throttled",
      });
    }, 100);
    this.terminal = terminal;
  }
  _getBundleStatusMessage(
    {
      bundleDetails: { entryFile, bundleType },
      transformedFileCount,
      totalFileCount,
      ratio,
      isPrefetch,
    },
    phase
  ) {
    if (isPrefetch) {
      bundleType = "PREBUNDLE";
    }
    const localPath = path.relative(".", entryFile);
    const filledBar = Math.floor(ratio * MAX_PROGRESS_BAR_CHAR_WIDTH);
    const bundleTypeColor =
      phase === "done"
        ? chalk.green
        : phase === "failed"
        ? chalk.red
        : chalk.yellow;
    const progress =
      phase === "in_progress"
        ? chalk.green.bgGreen(DARK_BLOCK_CHAR.repeat(filledBar)) +
          chalk.bgWhite.white(
            LIGHT_BLOCK_CHAR.repeat(MAX_PROGRESS_BAR_CHAR_WIDTH - filledBar)
          ) +
          chalk.bold(` ${(100 * ratio).toFixed(1)}% `) +
          chalk.dim(`(${transformedFileCount}/${totalFileCount})`)
        : "";
    return (
      bundleTypeColor.inverse.bold(` ${bundleType.toUpperCase()} `) +
      chalk.reset.dim(` ${path.dirname(localPath)}/`) +
      chalk.bold(path.basename(localPath)) +
      " " +
      progress +
      "\n"
    );
  }
  _logBundleBuildDone(buildID) {
    const progress = this._activeBundles.get(buildID);
    if (progress != null) {
      const msg = this._getBundleStatusMessage(
        {
          ...progress,
          ratio: 1,
          transformedFileCount: progress.totalFileCount,
        },
        "done"
      );
      this.terminal.log(msg);
      this._activeBundles.delete(buildID);
    }
  }
  _logBundleBuildFailed(buildID) {
    const progress = this._activeBundles.get(buildID);
    if (progress != null) {
      const msg = this._getBundleStatusMessage(progress, "failed");
      this.terminal.log(msg);
    }
  }
  _logInitializing(port, hasReducedPerformance) {
    const logo = [
      "",
      "                        ▒▒▓▓▓▓▒▒",
      "                     ▒▓▓▓▒▒░░▒▒▓▓▓▒",
      "                  ▒▓▓▓▓░░░▒▒▒▒░░░▓▓▓▓▒",
      "                 ▓▓▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▓▓",
      "                 ▓▓░░░░░▒▓▓▓▓▓▓▒░░░░░▓▓",
      "                 ▓▓░░▓▓▒░░░▒▒░░░▒▓▒░░▓▓",
      "                 ▓▓░░▓▓▓▓▓▒▒▒▒▓▓▓▓▒░░▓▓",
      "                 ▓▓░░▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░▓▓",
      "                 ▓▓▒░░▒▒▓▓▓▓▓▓▓▓▒░░░▒▓▓",
      "                  ▒▓▓▓▒░░░▒▓▓▒░░░▒▓▓▓▒",
      "                     ▒▓▓▓▒░░░░▒▓▓▓▒",
      "                        ▒▒▓▓▓▓▒▒",
      "",
      "",
    ];
    const color = hasReducedPerformance ? chalk.red : chalk.blue;
    this.terminal.log(color(logo.join("\n")));
  }
  _logInitializingFailed(port, error) {
    if (error.code === "EADDRINUSE") {
      this.terminal.log(
        chalk.bgRed.bold(" ERROR "),
        chalk.red("Metro can't listen on port", chalk.bold(String(port)))
      );
      this.terminal.log(
        "Most likely another process is already using this port"
      );
      this.terminal.log("Run the following command to find out which process:");
      this.terminal.log("\n  ", chalk.bold("lsof -i :" + port), "\n");
      this.terminal.log("Then, you can either shut down the other process:");
      this.terminal.log("\n  ", chalk.bold("kill -9 <PID>"), "\n");
      this.terminal.log("or run Metro on different port.");
    } else {
      this.terminal.log(chalk.bgRed.bold(" ERROR "), chalk.red(error.message));
      const errorAttributes = JSON.stringify(error);
      if (errorAttributes !== "{}") {
        this.terminal.log(chalk.red(errorAttributes));
      }
      this.terminal.log(chalk.red(error.stack));
    }
  }
  _log(event) {
    switch (event.type) {
      case "initialize_started":
        this._logInitializing(event.port, event.hasReducedPerformance);
        break;
      case "initialize_failed":
        this._logInitializingFailed(event.port, event.error);
        break;
      case "bundle_build_done":
        this._logBundleBuildDone(event.buildID);
        break;
      case "bundle_save_log":
        this.terminal.log("LOG:" + event.message);
        break;
      case "bundle_build_failed":
        this._logBundleBuildFailed(event.buildID);
        break;
      case "bundling_error":
        this._logBundlingError(event.error);
        break;
      case "resolver_warning":
        this._logWarning(event.message);
        break;
      case "transform_cache_reset":
        reporting.logWarning(this.terminal, "the transform cache was reset.");
        break;
      case "worker_stdout_chunk":
        this._logWorkerChunk("stdout", event.chunk);
        break;
      case "worker_stderr_chunk":
        this._logWorkerChunk("stderr", event.chunk);
        break;
      case "hmr_client_error":
        this._logHmrClientError(event.error);
        break;
      case "client_log":
        logToConsole(this.terminal, event.level, event.mode, ...event.data);
        break;
      case "unstable_server_log":
        const logFn = {
          info: reporting.logInfo,
          warn: reporting.logWarning,
          error: reporting.logError,
        }[event.level];
        const [format, ...args] = [].concat(event.data);
        logFn(this.terminal, String(format), ...args);
        break;
      case "dep_graph_loading":
        const color = event.hasReducedPerformance ? chalk.red : chalk.blue;
        const version = "v" + require("../../package.json").version;
        this.terminal.log(
          color.bold(
            " ".repeat(19 - version.length / 2),
            "Welcome to Metro " + chalk.white(version) + "\n"
          ) + chalk.dim("              Fast - Scalable - Integrated\n\n")
        );
        if (event.hasReducedPerformance) {
          this.terminal.log(
            chalk.red(
              "Metro is operating with reduced performance.\n" +
                "Please fix the problem above and restart Metro.\n\n"
            )
          );
        }
        break;
      case "watcher_health_check_result":
        this._logWatcherHealthCheckResult(event.result);
        break;
      case "watcher_status":
        this._logWatcherStatus(event.status);
        break;
    }
  }
  _logBundlingError(error) {
    if (error instanceof AmbiguousModuleResolutionError) {
      const he = error.hasteError;
      const message =
        "ambiguous resolution: module `" +
        `${error.fromModulePath}\` tries to require \`${he.hasteName}\`, ` +
        "but there are several files providing this module. You can delete " +
        "or fix them: \n\n" +
        Object.keys(he.duplicatesSet)
          .sort()
          .map((dupFilePath) => `  * \`${dupFilePath}\`\n`)
          .join("");
      reporting.logError(this.terminal, message);
      return;
    }
    let { message } = error;
    if (!(error instanceof SyntaxError)) {
      if (error.snippet == null && error.stack != null) {
        message = error.stack;
      }
    }
    if (error.filename && !message.includes(error.filename)) {
      message += ` [${error.filename}]`;
    }
    if (error.snippet != null) {
      message += "\n" + error.snippet;
    }
    reporting.logError(this.terminal, message);
  }
  _logWorkerChunk(origin, chunk) {
    const lines = chunk.split("\n");
    if (lines.length >= 1 && lines[lines.length - 1] === "") {
      lines.splice(lines.length - 1, 1);
    }
    lines.forEach((line) => {
      this.terminal.log(`transform[${origin}]: ${line}`);
    });
  }
  _updateBundleProgress({ buildID, transformedFileCount, totalFileCount }) {
    const currentProgress = this._activeBundles.get(buildID);
    if (currentProgress == null) {
      return;
    }
    const rawRatio = transformedFileCount / totalFileCount;
    const conservativeRatio = Math.pow(rawRatio, 2);
    const ratio = Math.max(conservativeRatio, currentProgress.ratio);
    Object.assign(currentProgress, {
      ratio,
      transformedFileCount,
      totalFileCount,
    });
  }
  _updateState(event) {
    switch (event.type) {
      case "bundle_build_done":
      case "bundle_build_failed":
        this._activeBundles.delete(event.buildID);
        break;
      case "bundle_build_started":
        const bundleProgress = {
          bundleDetails: event.bundleDetails,
          transformedFileCount: 0,
          totalFileCount: 1,
          ratio: 0,
          isPrefetch: event.isPrefetch,
        };
        this._activeBundles.set(event.buildID, bundleProgress);
        break;
      case "bundle_transform_progressed_throttled":
        this._updateBundleProgress(event);
        break;
      case "unstable_server_menu_updated":
        this._interactionStatus = event.message;
        break;
      case "unstable_server_menu_cleared":
        this._interactionStatus = null;
        break;
    }
  }
  _getStatusMessage() {
    return Array.from(this._activeBundles.entries())
      .map(([_, progress]) =>
        this._getBundleStatusMessage(progress, "in_progress")
      )
      .concat([this._interactionStatus])
      .filter((str) => str != null)
      .join("\n");
  }
  _logHmrClientError(e) {
    reporting.logError(
      this.terminal,
      "A WebSocket client got a connection error. Please reload your device " +
        "to get HMR working again: %s",
      e
    );
  }
  _logWarning(message) {
    reporting.logWarning(this.terminal, message);
  }
  _logWatcherHealthCheckResult(result) {
    if (
      !this._prevHealthCheckResult ||
      result.type !== this._prevHealthCheckResult.type ||
      (result.type === "timeout" &&
        this._prevHealthCheckResult.type === "timeout" &&
        (result.pauseReason ?? null) !==
          (this._prevHealthCheckResult.pauseReason ?? null))
    ) {
      const watcherName = "'" + (result.watcher ?? "unknown") + "'";
      switch (result.type) {
        case "success":
          if (this._prevHealthCheckResult) {
            this.terminal.log(
              chalk.green(`Watcher ${watcherName} is now healthy.`)
            );
          }
          break;
        case "error":
          reporting.logWarning(
            this.terminal,
            "Failed to perform watcher health check. Check whether the project root is writable."
          );
          break;
        case "timeout":
          const why =
            result.pauseReason != null
              ? ` This may be because: ${result.pauseReason}`
              : "";
          reporting.logWarning(
            this.terminal,
            `Watcher ${watcherName} failed to detect a file change within ${result.timeout}ms.` +
              why
          );
          break;
      }
    }
    this._prevHealthCheckResult = result;
  }
  _logWatcherStatus(status) {
    switch (status.type) {
      case "watchman_warning":
        const warning =
          typeof status.warning === "string"
            ? status.warning
            : `unknown warning (type: ${typeof status.warning})`;
        reporting.logWarning(
          this.terminal,
          `Watchman \`${status.command}\` returned a warning: ${warning}`
        );
        break;
      case "watchman_slow_command":
        this.terminal.log(
          chalk.dim(
            `Waiting for Watchman \`${status.command}\` (${Math.round(
              status.timeElapsed / 1000
            )}s)...`
          )
        );
        break;
      case "watchman_slow_command_complete":
        this.terminal.log(
          chalk.green(
            `Watchman \`${status.command}\` finished after ${(
              status.timeElapsed / 1000
            ).toFixed(1)}s.`
          )
        );
        break;
    }
  }
  update(event) {
    if (event.type === "bundle_transform_progressed") {
      this._scheduleUpdateBundleProgress(event);
      return;
    }
    this._log(event);
    this._updateState(event);
    this.terminal.status(this._getStatusMessage());
  }
}
module.exports = TerminalReporter;
