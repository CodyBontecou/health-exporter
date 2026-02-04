import NativeSafeAreaContext from './specs/NativeSafeAreaContext';
export const initialWindowMetrics = NativeSafeAreaContext?.getConstants?.()?.initialWindowMetrics ?? null;

/**
 * @deprecated
 */
export const initialWindowSafeAreaInsets = initialWindowMetrics?.insets;
//# sourceMappingURL=InitialWindow.native.js.map