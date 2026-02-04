import { TurboModuleRegistry } from 'react-native';

// src/index.android.ts
var warnings = /* @__PURE__ */ new Set();
var isEdgeToEdge = () => {
  var _a, _b;
  return TurboModuleRegistry.get("RNEdgeToEdge") != null || ((_b = (_a = TurboModuleRegistry.get("DeviceInfo")) == null ? void 0 : _a.getConstants) == null ? void 0 : _b.call(_a).isEdgeToEdge) === true;
};
var controlEdgeToEdgeValues = (values) => {
  if (__DEV__ && isEdgeToEdge()) {
    const entries = Object.entries(values).filter(
      ([, value]) => typeof value !== "undefined"
    );
    const stableKey = entries.join(" ");
    if (entries.length < 1 || warnings.has(stableKey)) {
      return;
    }
    warnings.add(stableKey);
    const isPlural = entries.length > 1;
    const lastIndex = entries.length - 1;
    const list = entries.reduce(
      (acc, [name], index) => index === 0 ? name : acc + (index === lastIndex ? " and " : ", ") + name,
      ""
    );
    console.warn(
      `${list} ${isPlural ? "values are" : "value is"} ignored when using react-native-edge-to-edge`
    );
  }
};

export { controlEdgeToEdgeValues, isEdgeToEdge };
//# sourceMappingURL=index.android.mjs.map
//# sourceMappingURL=index.android.mjs.map