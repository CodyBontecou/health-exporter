"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CircularBuffer {
  constructor(size) {
    _defineProperty(this, "bufferSize", void 0);

    _defineProperty(this, "buffer", void 0);

    _defineProperty(this, "index", void 0);

    _defineProperty(this, "actualSize", void 0);

    this.bufferSize = size;
    this.buffer = new Array(size);
    this.index = 0;
    this.actualSize = 0;
  }

  get size() {
    return this.actualSize;
  }

  push(element) {
    this.buffer[this.index] = element;
    this.index = (this.index + 1) % this.bufferSize;
    this.actualSize = Math.min(this.actualSize + 1, this.bufferSize);
  }

  get(at) {
    if (this.actualSize === this.bufferSize) {
      let index = (this.index + at) % this.bufferSize;

      if (index < 0) {
        index += this.bufferSize;
      }

      return this.buffer[index];
    } else {
      return this.buffer[at];
    }
  }

  clear() {
    this.buffer = new Array(this.bufferSize);
    this.index = 0;
    this.actualSize = 0;
  }

}

exports.default = CircularBuffer;
//# sourceMappingURL=CircularBuffer.js.map