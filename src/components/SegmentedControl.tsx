import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onValueChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
              isFirst && styles.optionFirst,
              isLast && styles.optionLast,
            ]}
            onPress={() => onValueChange(option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface.primary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surface.border,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.surface.border,
  },
  optionSelected: {
    backgroundColor: colors.accent.primary,
  },
  optionFirst: {
    borderTopLeftRadius: borderRadius.md - 1,
    borderBottomLeftRadius: borderRadius.md - 1,
  },
  optionLast: {
    borderTopRightRadius: borderRadius.md - 1,
    borderBottomRightRadius: borderRadius.md - 1,
    borderRightWidth: 0,
  },
  label: {
    ...typography.buttonSmall,
    color: colors.text.secondary,
  },
  labelSelected: {
    color: colors.white,
  },
});
