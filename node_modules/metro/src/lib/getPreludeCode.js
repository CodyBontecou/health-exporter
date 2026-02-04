"use strict";

function getPreludeCode({
  extraVars,
  isDev,
  globalPrefix,
  requireCycleIgnorePatterns,
}) {
  const vars = [
    "__BUNDLE_START_TIME__=globalThis.nativePerformanceNow?nativePerformanceNow():Date.now()",
    `__DEV__=${String(isDev)}`,
    ...formatExtraVars(extraVars),
    "process=globalThis.process||{}",
    `__METRO_GLOBAL_PREFIX__='${globalPrefix}'`,
  ];
  if (isDev) {
    vars.push(
      `${globalPrefix}__requireCycleIgnorePatterns=[${requireCycleIgnorePatterns
        .map((regex) => regex.toString())
        .join(",")}]`
    );
  }
  return `var ${vars.join(",")};${processEnv(
    isDev ? "development" : "production"
  )}`;
}
const excluded = new Set(["__BUNDLE_START_TIME__", "__DEV__", "process"]);
function formatExtraVars(extraVars) {
  const assignments = [];
  for (const key in extraVars) {
    if (extraVars.hasOwnProperty(key) && !excluded.has(key)) {
      assignments.push(`${key}=${JSON.stringify(extraVars[key])}`);
    }
  }
  return assignments;
}
function processEnv(nodeEnv) {
  return `process.env=process.env||{};process.env.NODE_ENV=process.env.NODE_ENV||${JSON.stringify(
    nodeEnv
  )};`;
}
module.exports = getPreludeCode;
