// Previous types exported gesture handlers as classes which creates an interface and variable, both named the same as class.
// Without those types, we'd introduce breaking change, forcing users to prefix every handler type specification with typeof
// e.g. React.createRef<TapGestureHandler> -> React.createRef<typeof TapGestureHandler>.
// See https://www.typescriptlang.org/docs/handbook/classes.html#constructor-functions for reference.
const commonProps = ['id', 'enabled', 'shouldCancelWhenOutside', 'hitSlop', 'cancelsTouchesInView', 'userSelect', 'activeCursor', 'mouseButton', 'enableContextMenu', 'touchAction'];
const componentInteractionProps = ['waitFor', 'simultaneousHandlers', 'blocksHandlers'];
export const baseGestureHandlerProps = [...commonProps, ...componentInteractionProps, 'onBegan', 'onFailed', 'onCancelled', 'onActivated', 'onEnded', 'onGestureEvent', 'onHandlerStateChange'];
export const baseGestureHandlerWithDetectorProps = [...commonProps, 'needsPointerData', 'manualActivation'];
export let MouseButton;

(function (MouseButton) {
  MouseButton[MouseButton["LEFT"] = 1] = "LEFT";
  MouseButton[MouseButton["RIGHT"] = 2] = "RIGHT";
  MouseButton[MouseButton["MIDDLE"] = 4] = "MIDDLE";
  MouseButton[MouseButton["BUTTON_4"] = 8] = "BUTTON_4";
  MouseButton[MouseButton["BUTTON_5"] = 16] = "BUTTON_5";
  MouseButton[MouseButton["ALL"] = 31] = "ALL";
})(MouseButton || (MouseButton = {}));
//# sourceMappingURL=gestureHandlerCommon.js.map