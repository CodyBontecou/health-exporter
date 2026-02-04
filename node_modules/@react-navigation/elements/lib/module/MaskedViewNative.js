"use strict";

/**
 * The native MaskedView that we explicitly re-export for supported platforms: Android, iOS.
 */
import * as React from 'react';
import { UIManager } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
let RNCMaskedView;
try {
  // Add try/catch to support usage even if it's not installed, since it's optional.
  // Newer versions of Metro will handle it properly.
  RNCMaskedView = require('@react-native-masked-view/masked-view').default;
} catch (e) {
  // Ignore
}
const isMaskedViewAvailable = UIManager.getViewManagerConfig('RNCMaskedView') != null;
export function MaskedView({
  children,
  ...rest
}) {
  if (isMaskedViewAvailable && RNCMaskedView) {
    return /*#__PURE__*/_jsx(RNCMaskedView, {
      ...rest,
      children: children
    });
  }
  return children;
}
//# sourceMappingURL=MaskedViewNative.js.map