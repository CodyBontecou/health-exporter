"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.inlineString = exports.UnknownProjectError = exports.CLIError = void 0;
class CLIError extends Error {
  constructor(msg, originalError) {
    super(inlineString(msg));
    if (originalError != null) {
      this.stack =
        typeof originalError === "string"
          ? originalError
          : originalError.stack || "".split("\n").slice(0, 2).join("\n");
    } else {
      this.stack = "";
    }
  }
}
exports.CLIError = CLIError;
class UnknownProjectError extends Error {}
exports.UnknownProjectError = UnknownProjectError;
const inlineString = (str = "") => str.replace(/(\s{2,})/gm, " ").trim();
exports.inlineString = inlineString;
