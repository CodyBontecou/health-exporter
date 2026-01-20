export * from './colors';
export * from './spacing';
export * from './typography';

import { colors } from './colors';
import { spacing, borderRadius, iconSizes } from './spacing';
import { typography, fontFamily, fontSize, fontWeight } from './typography';

export const theme = {
  colors,
  spacing,
  borderRadius,
  iconSizes,
  typography,
  fontFamily,
  fontSize,
  fontWeight,
} as const;

export type Theme = typeof theme;
