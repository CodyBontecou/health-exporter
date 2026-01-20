import { Platform, TextStyle } from 'react-native';

// Font families
export const fontFamily = {
  // System fonts with monospace fallback
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

// Font sizes
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Line heights
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// Font weights
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Typography presets
export const typography = {
  // Headings
  h1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.tight,
  } as TextStyle,

  h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  } as TextStyle,

  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xl * lineHeight.tight,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.normal,
  } as TextStyle,

  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  } as TextStyle,

  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,

  // Labels
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,

  labelSmall: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs * lineHeight.normal,
  } as TextStyle,

  // Buttons
  button: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.md * lineHeight.tight,
  } as TextStyle,

  buttonSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.sm * lineHeight.tight,
  } as TextStyle,

  // Monospace
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,

  monoSmall: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
  } as TextStyle,
} as const;

export type Typography = typeof typography;
