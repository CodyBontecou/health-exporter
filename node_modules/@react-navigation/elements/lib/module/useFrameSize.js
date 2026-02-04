"use strict";

import * as React from 'react';
import { Platform } from 'react-native';
import useLatestCallback from 'use-latest-callback';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FrameContext = /*#__PURE__*/React.createContext(undefined);
export function useFrameSize(selector, throttle) {
  const context = React.useContext(FrameContext);
  if (context == null) {
    throw new Error('useFrameSize must be used within a FrameSizeProvider');
  }
  const value = useSyncExternalStoreWithSelector(throttle ? context.subscribeThrottled : context.subscribe, context.getCurrent, context.getCurrent, selector);
  return value;
}
export function FrameSizeProvider({
  initialFrame,
  render
}) {
  const frameRef = React.useRef({
    width: initialFrame.width,
    height: initialFrame.height
  });
  const listeners = React.useRef(new Set());
  const getCurrent = useLatestCallback(() => frameRef.current);
  const subscribe = useLatestCallback(listener => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  });
  const subscribeThrottled = useLatestCallback(listener => {
    const delay = 100; // Throttle delay in milliseconds

    let timer;
    let updated = false;
    let waiting = false;
    const throttledListener = () => {
      clearTimeout(timer);
      updated = true;
      if (waiting) {
        // Schedule a timer to call the listener at the end
        timer = setTimeout(() => {
          if (updated) {
            updated = false;
            listener();
          }
        }, delay);
      } else {
        waiting = true;
        setTimeout(function () {
          waiting = false;
        }, delay);

        // Call the listener immediately at start
        updated = false;
        listener();
      }
    };
    const unsubscribe = subscribe(throttledListener);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  });
  const context = React.useMemo(() => ({
    getCurrent,
    subscribe,
    subscribeThrottled
  }), [subscribe, subscribeThrottled, getCurrent]);
  const onChange = useLatestCallback(frame => {
    if (frameRef.current.height === frame.height && frameRef.current.width === frame.width) {
      return;
    }
    frameRef.current = {
      width: frame.width,
      height: frame.height
    };
    listeners.current.forEach(listener => listener());
  });
  const viewRef = React.useRef(null);
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      // We use ResizeObserver on web
      return;
    }
    viewRef.current?.measure((_x, _y, width, height) => {
      onChange({
        width,
        height
      });
    });
  }, [onChange]);
  const onLayout = event => {
    const {
      width,
      height
    } = event.nativeEvent.layout;
    onChange({
      width,
      height
    });
  };
  return /*#__PURE__*/_jsxs(FrameContext.Provider, {
    value: context,
    children: [Platform.OS === 'web' ? /*#__PURE__*/_jsx(FrameSizeListenerWeb, {
      onChange: onChange
    }) : null, render({
      ref: viewRef,
      onLayout
    })]
  });
}

// FIXME: On the Web, `onLayout` doesn't fire on resize
// So we workaround this by using ResizeObserver
function FrameSizeListenerWeb({
  onChange
}) {
  const elementRef = React.useRef(null);
  React.useEffect(() => {
    if (elementRef.current == null) {
      return;
    }
    const rect = elementRef.current.getBoundingClientRect();
    onChange({
      width: rect.width,
      height: rect.height
    });
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const {
          width,
          height
        } = entry.contentRect;
        onChange({
          width,
          height
        });
      }
    });
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, [onChange]);
  return /*#__PURE__*/_jsx("div", {
    ref: elementRef,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      pointerEvents: 'none',
      visibility: 'hidden'
    }
  });
}
//# sourceMappingURL=useFrameSize.js.map