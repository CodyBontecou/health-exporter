"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _warnOnce = _interopRequireDefault(require("warn-once"));
var _DebugContainer = _interopRequireDefault(require("./DebugContainer"));
var _ScreenStackHeaderConfig = require("./ScreenStackHeaderConfig");
var _Screen = _interopRequireDefault(require("./Screen"));
var _ScreenStack = _interopRequireDefault(require("./ScreenStack"));
var _contexts = require("../contexts");
var _ScreenFooter = require("./ScreenFooter");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const screenRefs = React.useContext(_contexts.RNSScreensRefContext);
  React.useImperativeHandle(ref, () => currentScreenRef.current);
  const isHeaderInModal = _reactNative.Platform.OS === 'android' ? false : stackPresentation !== 'push' && headerConfig?.hidden === false;
  const headerHiddenPreviousRef = React.useRef(headerConfig?.hidden);
  React.useEffect(() => {
    (0, _warnOnce.default)(_reactNative.Platform.OS !== 'android' && stackPresentation !== 'push' && headerHiddenPreviousRef.current !== headerConfig?.hidden, `Dynamically changing header's visibility in modals will result in remounting the screen and losing all local state.`);
    headerHiddenPreviousRef.current = headerConfig?.hidden;
  }, [headerConfig?.hidden, stackPresentation]);
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_DebugContainer.default, {
    style: [stackPresentation === 'formSheet' ? _reactNative.Platform.OS === 'ios' ? styles.absolute : null : styles.container, contentStyle],
    stackPresentation: stackPresentation ?? 'push'
  }, children), /*#__PURE__*/React.createElement(_ScreenStackHeaderConfig.ScreenStackHeaderConfig, headerConfig), stackPresentation === 'formSheet' && unstable_sheetFooter && /*#__PURE__*/React.createElement(_ScreenFooter.FooterComponent, null, unstable_sheetFooter()));

  // We take backgroundColor from contentStyle and apply it on Screen.
  // This allows to workaround one issue with truncated
  // content with formSheet presentation.
  let internalScreenStyle;
  if (stackPresentation === 'formSheet' && contentStyle) {
    const flattenContentStyles = _reactNative.StyleSheet.flatten(contentStyle);
    internalScreenStyle = {
      backgroundColor: flattenContentStyles?.backgroundColor
    };
  }
  return /*#__PURE__*/React.createElement(_Screen.default, _extends({
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
  }, rest), isHeaderInModal ? /*#__PURE__*/React.createElement(_ScreenStack.default, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(_Screen.default, {
    enabled: true,
    isNativeStack: true,
    activityState: activityState,
    shouldFreeze: shouldFreeze,
    hasLargeHeader: headerConfig?.largeTitle ?? false,
    style: _reactNative.StyleSheet.absoluteFill
  }, content)) : content);
}
var _default = exports.default = /*#__PURE__*/React.forwardRef(ScreenStackItem);
const styles = _reactNative.StyleSheet.create({
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