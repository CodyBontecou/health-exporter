"use strict";

class JsonReporter {
  constructor(stream) {
    this._stream = stream;
  }
  update(event) {
    if (event.error instanceof Error) {
      const { message, stack } = event.error;
      event = Object.assign(event, {
        error: serializeError(event.error),
        message,
        stack,
      });
    }
    this._stream.write(JSON.stringify(event) + "\n");
  }
}
function serializeError(e, seen = new Set()) {
  if (seen.has(e)) {
    return {
      message: "[circular]: " + e.message,
      stack: e.stack,
    };
  }
  seen.add(e);
  const { message, stack, cause } = e;
  const serialized = {
    message,
    stack,
  };
  if (e instanceof AggregateError) {
    serialized.errors = [...e.errors]
      .map((innerError) =>
        innerError instanceof Error ? serializeError(innerError, seen) : null
      )
      .filter(Boolean);
  }
  if (cause instanceof Error) {
    serialized.cause = serializeError(cause, seen);
  }
  return serialized;
}
module.exports = JsonReporter;
