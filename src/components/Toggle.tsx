import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface ToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
}

export function Toggle({
  label,
  value,
  onValueChange,
  description,
  disabled = false,
}: ToggleProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onValueChange(!value)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.labelContainer}>
        <Text style={[styles.label, disabled && styles.disabled]}>{label}</Text>
        {description && (
          <Text style={[styles.description, disabled && styles.disabled]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.surface.tertiary,
          true: colors.accent.primary,
        }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.surface.tertiary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  labelContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
  },
  description: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
