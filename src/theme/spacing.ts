// Spacing scale
export const spacing = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
  xxl: 64,
} as const;

// Border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Icon sizes
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type SpacingScale = typeof spacing;
export type BorderRadiusScale = typeof borderRadius;
export type IconSizeScale = typeof iconSizes;
