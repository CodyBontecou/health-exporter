"use strict";

function createModuleIdFactory() {
  const fileToIdMap = new Map();
  let nextId = 0;
  return (path) => {
    let id = fileToIdMap.get(path);
    if (typeof id !== "number") {
      id = nextId++;
      fileToIdMap.set(path, id);
    }
    return id;
  };
}
module.exports = createModuleIdFactory;
