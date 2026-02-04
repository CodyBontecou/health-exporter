"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
class CountingSet {
  #map = new Map();
  constructor(items) {
    if (items) {
      if (items instanceof CountingSet) {
        this.#map = new Map(items.#map);
      } else {
        for (const item of items) {
          this.add(item);
        }
      }
    }
  }
  has(item) {
    return this.#map.has(item);
  }
  add(item) {
    const newCount = this.count(item) + 1;
    this.#map.set(item, newCount);
  }
  delete(item) {
    const newCount = this.count(item) - 1;
    if (newCount <= 0) {
      this.#map.delete(item);
    } else {
      this.#map.set(item, newCount);
    }
  }
  keys() {
    return this.#map.keys();
  }
  values() {
    return this.#map.keys();
  }
  *entries() {
    for (const item of this) {
      yield [item, item];
    }
  }
  [Symbol.iterator]() {
    return this.values();
  }
  get size() {
    return this.#map.size;
  }
  count(item) {
    return this.#map.get(item) ?? 0;
  }
  clear() {
    this.#map.clear();
  }
  forEach(callbackFn, thisArg) {
    for (const item of this) {
      callbackFn.call(thisArg, item, item, this);
    }
  }
  toJSON() {
    return [...this].sort();
  }
}
exports.default = CountingSet;
