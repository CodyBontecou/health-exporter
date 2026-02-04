"use strict";
var React = require("react");
/**
 * Use `useEffect` during SSR and `useLayoutEffect` in the Browser & React Native to avoid warnings.
 */
var useClientLayoutEffect = typeof document !== 'undefined' ||
    (typeof navigator !== 'undefined' && navigator.product === 'ReactNative')
    ? React.useLayoutEffect
    : React.useEffect;
/**
 * React hook which returns the latest callback without changing the reference.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function useLatestCallback(callback) {
    var ref = React.useRef(callback);
    var latestCallback = React.useRef(function latestCallback() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return ref.current.apply(this, args);
    }).current;
    useClientLayoutEffect(function () {
        ref.current = callback;
    });
    return latestCallback;
}
module.exports = useLatestCallback;
