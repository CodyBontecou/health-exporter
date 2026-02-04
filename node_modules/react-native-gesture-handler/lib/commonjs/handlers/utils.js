"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterConfig = filterConfig;
exports.findNodeHandle = findNodeHandle;
exports.scheduleFlushOperations = scheduleFlushOperations;

var _reactNative = require("react-native");

var _handlersRegistry = require("./handlersRegistry");

var _utils = require("../utils");

var _RNGestureHandlerModule = _interopRequireDefault(require("../RNGestureHandlerModule"));

var _ghQueueMicrotask = require("../ghQueueMicrotask");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isConfigParam(param, name) {
  // param !== Object(param) returns false if `param` is a function
  // or an object and returns true if `param` is null
  return param !== undefined && (param !== Object(param) || !('__isNative' in param)) && name !== 'onHandlerStateChange' && name !== 'onGestureEvent';
}

function filterConfig(props, validProps, defaults = {}) {
  const filteredConfig = { ...defaults
  };

  for (const key of validProps) {
    let value = props[key];

    if (isConfigParam(value, key)) {
      if (key === 'simultaneousHandlers' || key === 'waitFor') {
        value = transformIntoHandlerTags(props[key]);
      } else if (key === 'hitSlop' && typeof value !== 'object') {
        value = {
          top: value,
          left: value,
          bottom: value,
          right: value
        };
      }

      filteredConfig[key] = value;
    }
  }

  return filteredConfig;
}

function transformIntoHandlerTags(handlerIDs) {
  handlerIDs = (0, _utils.toArray)(handlerIDs);

  if (_reactNative.Platform.OS === 'web') {
    return handlerIDs.map(({
      current
    }) => current).filter(handle => handle);
  } // converts handler string IDs into their numeric tags


  return handlerIDs.map(handlerID => {
    var _handlerID$current;

    return _handlersRegistry.handlerIDToTag[handlerID] || ((_handlerID$current = handlerID.current) === null || _handlerID$current === void 0 ? void 0 : _handlerID$current.handlerTag) || -1;
  }).filter(handlerTag => handlerTag > 0);
}

function findNodeHandle(node) {
  if (_reactNative.Platform.OS === 'web') {
    return node;
  }

  return (0, _reactNative.findNodeHandle)(node);
}

let flushOperationsScheduled = false;

function scheduleFlushOperations() {
  if (!flushOperationsScheduled) {
    flushOperationsScheduled = true;
    (0, _ghQueueMicrotask.ghQueueMicrotask)(() => {
      _RNGestureHandlerModule.default.flushOperations();

      flushOperationsScheduled = false;
    });
  }
}
//# sourceMappingURL=utils.js.map