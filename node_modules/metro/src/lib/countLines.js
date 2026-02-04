"use strict";

const newline = /\r\n?|\n|\u2028|\u2029/g;
const countLines = (string) => (string.match(newline) || []).length + 1;
module.exports = countLines;
