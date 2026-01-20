// Obsidian-inspired dark theme colors

export const colors = {
  // Background colors
  background: {
    primary: '#0a0a0f',
    secondary: '#12121a',
    tertiary: '#1a1a24',
    elevated: '#1f1f2a',
  },

  // Surface colors
  surface: {
    primary: '#16161e',
    secondary: '#1c1c26',
    tertiary: '#222230',
    border: '#2a2a38',
  },

  // Text colors
  text: {
    primary: '#e8e8ed',
    secondary: '#a8a8b3',
    tertiary: '#68687a',
    inverse: '#0a0a0f',
  },

  // Accent colors
  accent: {
    primary: '#8B5CF6', // Purple
    primaryDark: '#7C3AED',
    primaryLight: '#A78BFA',
    secondary: '#6366F1', // Indigo
  },

  // Semantic colors
  semantic: {
    success: '#10B981',
    successLight: '#34D399',
    error: '#EF4444',
    errorLight: '#F87171',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    info: '#3B82F6',
    infoLight: '#60A5FA',
  },

  // Status colors
  status: {
    connected: '#10B981',
    disconnected: '#6B7280',
    pending: '#F59E0B',
    error: '#EF4444',
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorTheme = typeof colors;
