function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { NativeSafeAreaProvider } from './NativeSafeAreaProvider';
const isDev = process.env.NODE_ENV !== 'production';
export const SafeAreaInsetsContext = /*#__PURE__*/React.createContext(null);
if (isDev) {
  SafeAreaInsetsContext.displayName = 'SafeAreaInsetsContext';
}
export const SafeAreaFrameContext = /*#__PURE__*/React.createContext(null);
if (isDev) {
  SafeAreaFrameContext.displayName = 'SafeAreaFrameContext';
}
export function SafeAreaProvider({
  children,
  initialMetrics,
  initialSafeAreaInsets,
  style,
  ...others
}) {
  const parentInsets = useParentSafeAreaInsets();
  const parentFrame = useParentSafeAreaFrame();
  const [insets, setInsets] = React.useState(initialMetrics?.insets ?? initialSafeAreaInsets ?? parentInsets ?? null);
  const [frame, setFrame] = React.useState(initialMetrics?.frame ?? parentFrame ?? {
    // Backwards compat so we render anyway if we don't have frame.
    x: 0,
    y: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  });
  const onInsetsChange = React.useCallback(event => {
    const {
      nativeEvent: {
        frame: nextFrame,
        insets: nextInsets
      }
    } = event;
    setFrame(curFrame => {
      if (
      // Backwards compat with old native code that won't send frame.
      nextFrame && (nextFrame.height !== curFrame.height || nextFrame.width !== curFrame.width || nextFrame.x !== curFrame.x || nextFrame.y !== curFrame.y)) {
        return nextFrame;
      } else {
        return curFrame;
      }
    });
    setInsets(curInsets => {
      if (!curInsets || nextInsets.bottom !== curInsets.bottom || nextInsets.left !== curInsets.left || nextInsets.right !== curInsets.right || nextInsets.top !== curInsets.top) {
        return nextInsets;
      } else {
        return curInsets;
      }
    });
  }, []);
  return /*#__PURE__*/React.createElement(NativeSafeAreaProvider, _extends({
    style: [styles.fill, style],
    onInsetsChange: onInsetsChange
  }, others), insets != null ? /*#__PURE__*/React.createElement(SafeAreaFrameContext.Provider, {
    value: frame
  }, /*#__PURE__*/React.createElement(SafeAreaInsetsContext.Provider, {
    value: insets
  }, children)) : null);
}
const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
function useParentSafeAreaInsets() {
  return React.useContext(SafeAreaInsetsContext);
}
function useParentSafeAreaFrame() {
  return React.useContext(SafeAreaFrameContext);
}
const NO_INSETS_ERROR = 'No safe area value available. Make sure you are rendering `<SafeAreaProvider>` at the top of your app.';
export function useSafeAreaInsets() {
  const insets = React.useContext(SafeAreaInsetsContext);
  if (insets == null) {
    throw new Error(NO_INSETS_ERROR);
  }
  return insets;
}
export function useSafeAreaFrame() {
  const frame = React.useContext(SafeAreaFrameContext);
  if (frame == null) {
    throw new Error(NO_INSETS_ERROR);
  }
  return frame;
}
export function withSafeAreaInsets(WrappedComponent) {
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    const insets = useSafeAreaInsets();
    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      insets: insets,
      ref: ref
    }));
  });
}

/**
 * @deprecated
 */
export function useSafeArea() {
  return useSafeAreaInsets();
}

/**
 * @deprecated
 */
export const SafeAreaConsumer = SafeAreaInsetsContext.Consumer;

/**
 * @deprecated
 */
export const SafeAreaContext = SafeAreaInsetsContext;
//# sourceMappingURL=SafeAreaContext.js.map