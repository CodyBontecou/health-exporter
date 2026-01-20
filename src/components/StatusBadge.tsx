import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface StatusBadgeProps {
  label: string;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  compact?: boolean;
}

const statusColors = {
  connected: colors.status.connected,
  disconnected: colors.status.disconnected,
  pending: colors.status.pending,
  error: colors.status.error,
};

export function StatusBadge({ label, status, compact = false }: StatusBadgeProps) {
  const dotColor = statusColors[status];

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  compact: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  label: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
});
