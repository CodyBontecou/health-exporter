import React from 'react';
import type { Metrics } from '../src/SafeArea.types';
import type { SafeAreaProviderProps, SafeAreaInsetsContext, SafeAreaFrameContext } from '../src/SafeAreaContext';
declare const _default: {
    initialWindowMetrics: Metrics;
    useSafeAreaInsets: () => import("../src/SafeArea.types").EdgeInsets;
    useSafeAreaFrame: () => import("../src/SafeArea.types").Rect;
    SafeAreaProvider: ({ children, initialMetrics }: SafeAreaProviderProps) => React.JSX.Element;
    SafeAreaInsetsContext: typeof SafeAreaInsetsContext;
    SafeAreaFrameContext: typeof SafeAreaFrameContext;
};
export default _default;
//# sourceMappingURL=mock.d.ts.map