/* eslint-disable reanimated/use-reanimated-error */
'use strict';

// signed type

const ReanimatedErrorConstructor = function ReanimatedError(message) {
  'worklet';

  const prefix = '[Reanimated]';
  const errorInstance = new Error(message ? `${prefix} ${message}` : prefix);
  errorInstance.name = 'ReanimatedError';
  return errorInstance;
};
export { ReanimatedErrorConstructor as ReanimatedError };

/**
 * Registers `ReanimatedError` in global scope. Use it only for Worklet
 * runtimes.
 */
export function registerReanimatedError() {
  'worklet';

  if (!_WORKLET) {
    throw new Error('[Reanimated] registerReanimatedError() must be called on Worklet runtime');
  }
  global.ReanimatedError = ReanimatedErrorConstructor;
}
const _workletStackDetails = new Map();
export function registerWorkletStackDetails(hash, stackDetails) {
  _workletStackDetails.set(hash, stackDetails);
}
function getBundleOffset(error) {
  const frame = error.stack?.split('\n')?.[0];
  if (frame) {
    const parsedFrame = /@([^@]+):(\d+):(\d+)/.exec(frame);
    if (parsedFrame) {
      const [, file, line, col] = parsedFrame;
      return [file, Number(line), Number(col)];
    }
  }
  return ['unknown', 0, 0];
}
function processStack(stack) {
  const workletStackEntries = stack.match(/worklet_(\d+):(\d+):(\d+)/g);
  let result = stack;
  workletStackEntries?.forEach(match => {
    const [, hash, origLine, origCol] = match.split(/:|_/).map(Number);
    const errorDetails = _workletStackDetails.get(hash);
    if (!errorDetails) {
      return;
    }
    const [error, lineOffset, colOffset] = errorDetails;
    const [bundleFile, bundleLine, bundleCol] = getBundleOffset(error);
    const line = origLine + bundleLine + lineOffset;
    const col = origCol + bundleCol + colOffset;
    result = result.replace(match, `${bundleFile}:${line}:${col}`);
  });
  return result;
}
export function reportFatalErrorOnJS({
  message,
  stack
}) {
  const error = new Error();
  error.message = message;
  error.stack = stack ? processStack(stack) : undefined;
  error.name = 'ReanimatedError';
  // @ts-ignore React Native's ErrorUtils implementation extends the Error type with jsEngine field
  error.jsEngine = 'reanimated';
  // @ts-ignore the reportFatalError method is an internal method of ErrorUtils not exposed in the type definitions
  global.ErrorUtils.reportFatalError(error);
}
//# sourceMappingURL=errors.js.map