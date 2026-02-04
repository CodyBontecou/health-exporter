"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RootPathUtils = void 0;
var _invariant = _interopRequireDefault(require("invariant"));
var path = _interopRequireWildcard(require("path"));
function _getRequireWildcardCache(e) {
  if ("function" != typeof WeakMap) return null;
  var r = new WeakMap(),
    t = new WeakMap();
  return (_getRequireWildcardCache = function (e) {
    return e ? t : r;
  })(e);
}
function _interopRequireWildcard(e, r) {
  if (!r && e && e.__esModule) return e;
  if (null === e || ("object" != typeof e && "function" != typeof e))
    return { default: e };
  var t = _getRequireWildcardCache(r);
  if (t && t.has(e)) return t.get(e);
  var n = { __proto__: null },
    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var u in e)
    if ("default" !== u && {}.hasOwnProperty.call(e, u)) {
      var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
      i && (i.get || i.set) ? Object.defineProperty(n, u, i) : (n[u] = e[u]);
    }
  return (n.default = e), t && t.set(e, n), n;
}
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const UP_FRAGMENT_SEP = ".." + path.sep;
const SEP_UP_FRAGMENT = path.sep + "..";
const UP_FRAGMENT_SEP_LENGTH = UP_FRAGMENT_SEP.length;
const CURRENT_FRAGMENT = "." + path.sep;
class RootPathUtils {
  #rootDir;
  #rootDirnames;
  #rootParts;
  #rootDepth;
  constructor(rootDir) {
    this.#rootDir = rootDir;
    const rootDirnames = [];
    for (
      let next = rootDir, previous = null;
      previous !== next;
      previous = next, next = path.dirname(next)
    ) {
      rootDirnames.push(next);
    }
    this.#rootDirnames = rootDirnames;
    this.#rootParts = rootDir.split(path.sep);
    this.#rootDepth = rootDirnames.length - 1;
    if (this.#rootDepth === 0) {
      this.#rootParts.pop();
    }
  }
  getBasenameOfNthAncestor(n) {
    return this.#rootParts[this.#rootParts.length - 1 - n];
  }
  getParts() {
    return this.#rootParts;
  }
  absoluteToNormal(absolutePath) {
    let endOfMatchingPrefix = 0;
    let lastMatchingPartIdx = 0;
    for (
      let nextPart = this.#rootParts[0], nextLength = nextPart.length;
      nextPart != null &&
      absolutePath.startsWith(nextPart, endOfMatchingPrefix) &&
      (absolutePath.length === endOfMatchingPrefix + nextLength ||
        absolutePath[endOfMatchingPrefix + nextLength] === path.sep);

    ) {
      endOfMatchingPrefix += nextLength + 1;
      nextPart = this.#rootParts[++lastMatchingPartIdx];
      nextLength = nextPart?.length;
    }
    const upIndirectionsToPrepend =
      this.#rootParts.length - lastMatchingPartIdx;
    return (
      this.#tryCollapseIndirectionsInSuffix(
        absolutePath,
        endOfMatchingPrefix,
        upIndirectionsToPrepend
      )?.collapsedPath ?? this.#slowAbsoluteToNormal(absolutePath)
    );
  }
  #slowAbsoluteToNormal(absolutePath) {
    const endsWithSep = absolutePath.endsWith(path.sep);
    const result = path.relative(this.#rootDir, absolutePath);
    return endsWithSep && !result.endsWith(path.sep)
      ? result + path.sep
      : result;
  }
  normalToAbsolute(normalPath) {
    let left = this.#rootDir;
    let i = 0;
    let pos = 0;
    while (
      normalPath.startsWith(UP_FRAGMENT_SEP, pos) ||
      (normalPath.endsWith("..") && normalPath.length === 2 + pos)
    ) {
      left = this.#rootDirnames[i === this.#rootDepth ? this.#rootDepth : ++i];
      pos += UP_FRAGMENT_SEP_LENGTH;
    }
    const right = pos === 0 ? normalPath : normalPath.slice(pos);
    if (right.length === 0) {
      return left;
    }
    if (i === this.#rootDepth) {
      return left + right;
    }
    return left + path.sep + right;
  }
  relativeToNormal(relativePath) {
    return (
      this.#tryCollapseIndirectionsInSuffix(relativePath, 0, 0)
        ?.collapsedPath ??
      path.relative(this.#rootDir, path.join(this.#rootDir, relativePath))
    );
  }
  getAncestorOfRootIdx(normalPath) {
    if (normalPath === "") {
      return 0;
    }
    if (normalPath === "..") {
      return 1;
    }
    if (normalPath.endsWith(SEP_UP_FRAGMENT)) {
      return (normalPath.length + 1) / 3;
    }
    return null;
  }
  joinNormalToRelative(normalPath, relativePath) {
    if (normalPath === "") {
      return {
        collapsedSegments: 0,
        normalPath: relativePath,
      };
    }
    if (relativePath === "") {
      return {
        collapsedSegments: 0,
        normalPath,
      };
    }
    const left = normalPath + path.sep;
    const rawPath = left + relativePath;
    if (normalPath === ".." || normalPath.endsWith(SEP_UP_FRAGMENT)) {
      const collapsed = this.#tryCollapseIndirectionsInSuffix(rawPath, 0, 0);
      (0, _invariant.default)(collapsed != null, "Failed to collapse");
      return {
        collapsedSegments: collapsed.collapsedSegments,
        normalPath: collapsed.collapsedPath,
      };
    }
    return {
      collapsedSegments: 0,
      normalPath: rawPath,
    };
  }
  relative(from, to) {
    return path.relative(from, to);
  }
  #tryCollapseIndirectionsInSuffix(
    fullPath,
    startOfRelativePart,
    implicitUpIndirections
  ) {
    let totalUpIndirections = implicitUpIndirections;
    let collapsedSegments = 0;
    for (let pos = startOfRelativePart; ; pos += UP_FRAGMENT_SEP_LENGTH) {
      const nextIndirection = fullPath.indexOf(CURRENT_FRAGMENT, pos);
      if (nextIndirection === -1) {
        while (totalUpIndirections > 0) {
          const segmentToMaybeCollapse =
            this.#rootParts[this.#rootParts.length - totalUpIndirections];
          if (
            fullPath.startsWith(segmentToMaybeCollapse, pos) &&
            (fullPath.length === segmentToMaybeCollapse.length + pos ||
              fullPath[segmentToMaybeCollapse.length + pos] === path.sep)
          ) {
            pos += segmentToMaybeCollapse.length + 1;
            collapsedSegments++;
            totalUpIndirections--;
          } else {
            break;
          }
        }
        if (pos >= fullPath.length) {
          return {
            collapsedPath:
              totalUpIndirections > 0
                ? UP_FRAGMENT_SEP.repeat(totalUpIndirections - 1) +
                  ".." +
                  fullPath.slice(pos - 1)
                : "",
            collapsedSegments,
          };
        }
        const right = pos > 0 ? fullPath.slice(pos) : fullPath;
        if (
          right === ".." &&
          totalUpIndirections >= this.#rootParts.length - 1
        ) {
          return {
            collapsedPath: UP_FRAGMENT_SEP.repeat(totalUpIndirections).slice(
              0,
              -1
            ),
            collapsedSegments,
          };
        }
        if (totalUpIndirections === 0) {
          return {
            collapsedPath: right,
            collapsedSegments,
          };
        }
        return {
          collapsedPath: UP_FRAGMENT_SEP.repeat(totalUpIndirections) + right,
          collapsedSegments,
        };
      }
      if (totalUpIndirections < this.#rootParts.length - 1) {
        totalUpIndirections++;
      }
      if (nextIndirection !== pos + 1 || fullPath[pos] !== ".") {
        return null;
      }
    }
  }
}
exports.RootPathUtils = RootPathUtils;
