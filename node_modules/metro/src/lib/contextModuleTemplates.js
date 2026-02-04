"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getContextModuleTemplate = getContextModuleTemplate;
var os = _interopRequireWildcard(require("os"));
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
function createFileMap(modulePath, files, processModule) {
  let mapString = "\n";
  files
    .slice()
    .sort()
    .forEach((file) => {
      let filePath = path.relative(modulePath, file);
      if (os.platform() === "win32") {
        filePath = filePath.replaceAll("\\", "/");
      }
      if (!filePath.startsWith(".")) {
        filePath = `./${filePath}`;
      }
      const key = JSON.stringify(filePath);
      mapString += `  ${key}: { enumerable: true, get() { return ${processModule(
        file
      )}; } },\n`;
    });
  return `Object.defineProperties({}, {${mapString}})`;
}
function getEmptyContextModuleTemplate(modulePath) {
  return `
function metroEmptyContext(request) {
  let e = new Error('No modules in context');
  e.code = 'MODULE_NOT_FOUND';
  throw e;
}

// Return the keys that can be resolved.
metroEmptyContext.keys = () => ([]);

// Return the module identifier for a user request.
metroEmptyContext.resolve = function metroContextResolve(request) {
  throw new Error('Unimplemented Metro module context functionality');
}

module.exports = metroEmptyContext;`;
}
function getLoadableContextModuleTemplate(
  modulePath,
  files,
  importSyntax,
  getContextTemplate
) {
  return `// All of the requested modules are loaded behind enumerable getters.
const map = ${createFileMap(
    modulePath,
    files,
    (moduleId) => `${importSyntax}(${JSON.stringify(moduleId)})`
  )};

function metroContext(request) {
  ${getContextTemplate}
}

// Return the keys that can be resolved.
metroContext.keys = function metroContextKeys() {
  return Object.keys(map);
};

// Return the module identifier for a user request.
metroContext.resolve = function metroContextResolve(request) {
  throw new Error('Unimplemented Metro module context functionality');
}

module.exports = metroContext;`;
}
function getContextModuleTemplate(mode, modulePath, files) {
  if (!files.length) {
    return getEmptyContextModuleTemplate(modulePath);
  }
  switch (mode) {
    case "eager":
      return getLoadableContextModuleTemplate(
        modulePath,
        files,
        "require",
        [
          "  // Here Promise.resolve().then() is used instead of new Promise() to prevent",
          "  // uncaught exception popping up in devtools",
          "  return Promise.resolve().then(() => map[request]);",
        ].join("\n")
      );
    case "sync":
      return getLoadableContextModuleTemplate(
        modulePath,
        files,
        "require",
        "  return map[request];"
      );
    case "lazy":
    case "lazy-once":
      return getLoadableContextModuleTemplate(
        modulePath,
        files,
        "import",
        "  return map[request];"
      );
    default:
      throw new Error(`Metro context mode "${mode}" is unimplemented`);
  }
}
