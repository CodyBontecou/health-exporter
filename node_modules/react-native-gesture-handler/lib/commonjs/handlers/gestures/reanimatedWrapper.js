"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reanimated = void 0;

var _utils = require("../../utils");

var _Reanimated;

let Reanimated;
exports.Reanimated = Reanimated;

try {
  exports.Reanimated = Reanimated = require('react-native-reanimated');
} catch (e) {
  // When 'react-native-reanimated' is not available we want to quietly continue
  // @ts-ignore TS demands the variable to be initialized
  exports.Reanimated = Reanimated = undefined;
}

if (!((_Reanimated = Reanimated) !== null && _Reanimated !== void 0 && _Reanimated.useSharedValue)) {
  // @ts-ignore Make sure the loaded module is actually Reanimated, if it's not
  // reset the module to undefined so we can fallback to the default implementation
  exports.Reanimated = Reanimated = undefined;
}

if (Reanimated !== undefined && !Reanimated.setGestureState) {
  // The loaded module is Reanimated but it doesn't have the setGestureState defined
  Reanimated.setGestureState = () => {
    'worklet';

    console.warn((0, _utils.tagMessage)('Please use newer version of react-native-reanimated in order to control state of the gestures.'));
  };
}
//# sourceMappingURL=reanimatedWrapper.js.map