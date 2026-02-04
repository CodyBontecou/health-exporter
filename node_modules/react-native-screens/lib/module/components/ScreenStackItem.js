function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import warnOnce from 'warn-once';
import DebugContainer from './DebugContainer';
import { ScreenStackHeaderConfig } from './ScreenStackHeaderConfig';
import Screen from './Screen';
import ScreenStack from './ScreenStack';
import { RNSScreensRefContext } from '../contexts';
import { FooterComponent } from './ScreenFooter';
function ScreenStackItem({
  children,
  headerConfig,
  activityState,
  shouldFreeze,
  stackPresentation,
  contentStyle,
  style,
  screenId,
  // eslint-disable-next-line camelcase
  unstable_sheetFooter,
  ...rest
}, ref) {
  const currentScreenRef = React.useRef(null);
  const screenRefs = React.useContext(RNSScreensRefContext);
  React.useImperativeHandle(ref, () => currentScreenRef.current);
  const isHeaderInModal = Platform.OS === 'android' ? false : stackPresentation !== 'push' && headerConfig?.hidden === false;
  const headerHiddenPreviousRef = React.useRef(headerConfig?.hidden);
  React.useEffect(() => {
    warnOnce(Platform.OS !== 'android' && stackPresentation !== 'push' && headerHiddenPreviousRef.current !== headerConfig?.hidden, `Dynamically changing header's visibility in modals will result in remounting the screen and losing all local state.`);
    headerHiddenPreviousRef.current = headerConfig?.hidden;
  }, [headerConfig?.hidden, stackPresentation]);
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DebugContainer, {
    style: [stackPresentation === 'formSheet' ? Platform.OS === 'ios' ? styles.absolute : null : styles.container, contentStyle],
    stackPresentation: stackPresentation ?? 'push'
  }, children), /*#__PURE__*/React.createElement(ScreenStackHeaderConfig, headerConfig), stackPresentation === 'formSheet' && unstable_sheetFooter && /*#__PURE__*/React.createElement(FooterComponent, null, unstable_sheetFooter()));

  // We take backgroundColor from contentStyle and apply it on Screen.
  // This allows to workaround one issue with truncated
  // content with formSheet presentation.
  let internalScreenStyle;
  if (stackPresentation === 'formSheet' && contentStyle) {
    const flattenContentStyles = StyleSheet.flatten(contentStyle);
    internalScreenStyle = {
      backgroundColor: flattenContentStyles?.backgroundColor
    };
  }
  return /*#__PURE__*/React.createElement(Screen, _extends({
    ref: node => {
      currentScreenRef.current = node;
      if (screenRefs === null) {
        console.warn('Looks like RNSScreensRefContext is missing. Make sure the ScreenStack component is wrapped in it');
        return;
      }
      const currentRefs = screenRefs.current;
      if (node === null) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete currentRefs[screenId];
      } else {
        currentRefs[screenId] = {
          current: node
        };
      }
    },
    enabled: true,
    isNativeStack: true,
    activityState: activityState,
    shouldFreeze: shouldFreeze,
    stackPresentation: stackPresentation,
    hasLargeHeader: headerConfig?.largeTitle ?? false,
    style: [style, internalScreenStyle]
  }, rest), isHeaderInModal ? /*#__PURE__*/React.createElement(ScreenStack, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Screen, {
    enabled: true,
    isNativeStack: true,
    activityState: activityState,
    shouldFreeze: shouldFreeze,
    hasLargeHeader: headerConfig?.largeTitle ?? false,
    style: StyleSheet.absoluteFill
  }, content)) : content);
}
export default /*#__PURE__*/React.forwardRef(ScreenStackItem);
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0
  }
});
//# sourceMappingURL=ScreenStackItem.js.map