"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = getLatestRelease;
exports.logIfUpdateAvailable = logIfUpdateAvailable;
var _logger = require("./logger");
var _chalk = _interopRequireDefault(require("chalk"));
var _fs = require("fs");
var _path = _interopRequireDefault(require("path"));
var _semver = _interopRequireDefault(require("semver"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function getReactNativeVersion(projectRoot) {
  try {
    const resolvedPath = require.resolve("react-native/package.json", {
      paths: [projectRoot],
    });
    _logger.logger.debug(
      `Found 'react-native' from '${projectRoot}' -> '${resolvedPath}'`
    );
    return JSON.parse((0, _fs.readFileSync)(resolvedPath, "utf8")).version;
  } catch {
    _logger.logger.debug("Couldn't read the version of 'react-native'");
  }
}
async function logIfUpdateAvailable(projectRoot) {
  const versions = await latest(projectRoot);
  if (!versions?.upgrade) {
    return;
  }
  if (_semver.default.gt(versions.upgrade.stable, versions.current)) {
    _logger.logger.info(`React Native v${
      versions.upgrade.stable
    } is now available (your project is running on v${versions.name}).
Changelog: ${_chalk.default.dim.underline(
      versions.upgrade?.changelogUrl ?? "none"
    )}
Diff: ${_chalk.default.dim.underline(versions.upgrade?.diffUrl ?? "none")}
`);
  }
}
async function latest(projectRoot) {
  try {
    const currentVersion = getReactNativeVersion(projectRoot);
    if (currentVersion == null) {
      return;
    }
    const { name } = JSON.parse(
      (0, _fs.readFileSync)(
        _path.default.join(projectRoot, "package.json"),
        "utf8"
      )
    );
    const upgrade = await getLatestRelease(name, currentVersion);
    if (upgrade) {
      return {
        name,
        current: currentVersion,
        upgrade,
      };
    }
  } catch (e) {
    _logger.logger.debug(
      "Cannot detect current version of React Native, " +
        "skipping check for a newer release"
    );
    _logger.logger.debug(e);
  }
}
function isDiffPurgeEntry(data) {
  return (
    [data.name, data.zipball_url, data.tarball_url, data.node_id].filter(
      (e) => typeof e !== "undefined"
    ).length === 0
  );
}
async function getLatestRelease(name, currentVersion) {
  _logger.logger.debug("Checking for a newer version of React Native");
  try {
    _logger.logger.debug(`Current version: ${currentVersion}`);
    if (["-canary", "-nightly"].some((s) => currentVersion.includes(s))) {
      return;
    }
    _logger.logger.debug("Checking for newer releases on GitHub");
    const latestVersion = await getLatestRnDiffPurgeVersion(name);
    if (latestVersion == null) {
      _logger.logger.debug("Failed to get latest release");
      return;
    }
    const { stable, candidate } = latestVersion;
    _logger.logger.debug(`Latest release: ${stable} (${candidate ?? ""})`);
    if (_semver.default.compare(stable, currentVersion) >= 0) {
      return {
        stable,
        candidate,
        changelogUrl: buildChangelogUrl(stable),
        diffUrl: buildDiffUrl(currentVersion, stable),
      };
    }
  } catch (e) {
    _logger.logger.debug(
      "Something went wrong with remote version checking, moving on"
    );
    _logger.logger.debug(e);
  }
}
function buildChangelogUrl(version) {
  return `https://github.com/facebook/react-native/releases/tag/v${version}`;
}
function buildDiffUrl(oldVersion, newVersion) {
  return `https://react-native-community.github.io/upgrade-helper/?from=${oldVersion}&to=${newVersion}`;
}
async function getLatestRnDiffPurgeVersion(name) {
  const resp = await fetch(
    "https://api.github.com/repos/react-native-community/rn-diff-purge/tags",
    {
      headers: {
        "User-Agent": "@react-native/community-cli-plugin",
      },
    }
  );
  const result = {
    stable: "0.0.0",
  };
  if (resp.status !== 200) {
    return;
  }
  const body = (await resp.json()).filter(isDiffPurgeEntry);
  for (const { name: version } of body) {
    if (result.candidate != null && version.includes("-rc")) {
      result.candidate = version.substring(8);
      continue;
    }
    if (!version.includes("-rc")) {
      result.stable = version.substring(8);
      return result;
    }
  }
  return result;
}
