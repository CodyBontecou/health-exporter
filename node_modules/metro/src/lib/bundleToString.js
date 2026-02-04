"use strict";

function bundleToString(bundle) {
  let code = bundle.pre.length > 0 ? bundle.pre + "\n" : "";
  const modules = [];
  const sortedModules = bundle.modules.slice().sort((a, b) => a[0] - b[0]);
  for (const [id, moduleCode] of sortedModules) {
    if (moduleCode.length > 0) {
      code += moduleCode + "\n";
    }
    modules.push([id, moduleCode.length]);
  }
  if (bundle.post.length > 0) {
    code += bundle.post;
  } else {
    code = code.slice(0, -1);
  }
  return {
    code,
    metadata: {
      pre: bundle.pre.length,
      post: bundle.post.length,
      modules,
    },
  };
}
module.exports = bundleToString;
