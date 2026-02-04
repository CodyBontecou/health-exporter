"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.chainComparators = chainComparators;
exports.compareStrings = compareStrings;
function compareStrings(a, b) {
  if (a == null) {
    return b == null ? 0 : -1;
  }
  if (b == null) {
    return 1;
  }
  return a.localeCompare(b);
}
function chainComparators(...comparators) {
  return (a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
}
