import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface CardProps {
  children: ReactNode;
  title?: string;
  style?: ViewStyle;
}

export function Card({ children, title, style }: CardProps) {
  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.md,
  },
  title: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
