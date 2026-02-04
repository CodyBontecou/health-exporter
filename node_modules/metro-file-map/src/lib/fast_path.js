"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.relative = relative;
exports.resolve = resolve;
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
function relative(rootDir, filename) {
  if (filename.indexOf(rootDir + path.sep) === 0) {
    const relativePath = filename.substr(rootDir.length + 1);
    for (let i = 0; ; i += UP_FRAGMENT_LENGTH) {
      const nextIndirection = relativePath.indexOf(CURRENT_FRAGMENT, i);
      if (nextIndirection === -1) {
        return relativePath;
      }
      if (nextIndirection !== i + 1 || relativePath[i] !== ".") {
        return path.relative(rootDir, filename);
      }
    }
  }
  return path.relative(rootDir, filename);
}
const UP_FRAGMENT = ".." + path.sep;
const UP_FRAGMENT_LENGTH = UP_FRAGMENT.length;
const CURRENT_FRAGMENT = "." + path.sep;
let cachedDirName = null;
let dirnameCache = [];
function resolve(rootDir, normalPath) {
  let left = rootDir;
  let i = 0;
  let pos = 0;
  while (
    normalPath.startsWith(UP_FRAGMENT, pos) ||
    (normalPath.endsWith("..") && normalPath.length === 2 + pos)
  ) {
    if (i === 0 && cachedDirName !== rootDir) {
      dirnameCache = [];
      cachedDirName = rootDir;
    }
    if (dirnameCache.length === i) {
      dirnameCache.push(path.dirname(left));
    }
    left = dirnameCache[i++];
    pos += UP_FRAGMENT_LENGTH;
  }
  const right = pos === 0 ? normalPath : normalPath.slice(pos);
  if (right.length === 0) {
    return left;
  }
  if (left.endsWith(path.sep)) {
    return left + right;
  }
  return left + path.sep + right;
}
