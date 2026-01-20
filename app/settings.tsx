import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../src/theme';
import { Card, Toggle, SegmentedControl, Button } from '../src/components';
import { useSettingsStore } from '../src/stores';
import { ExportFormat, exportFormatLabels } from '../src/types';

export default function SettingsScreen() {
  const router = useRouter();

  const exportSettings = useSettingsStore((state) => state.exportSettings);
  const setExportFormat = useSettingsStore((state) => state.setExportFormat);
  const toggleDataType = useSettingsStore((state) => state.toggleDataType);
  const setIncludeMetadata = useSettingsStore((state) => state.setIncludeMetadata);
  const setGroupByCategory = useSettingsStore((state) => state.setGroupByCategory);
  const resetExportSettings = useSettingsStore((state) => state.resetExportSettings);

  const formatOptions: { value: ExportFormat; label: string }[] = [
    { value: 'markdown', label: 'Markdown' },
    { value: 'obsidianBases', label: 'Bases' },
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Data Types */}
        <Card title="Data Types" style={styles.card}>
          <Toggle
            label="Sleep"
            value={exportSettings.dataTypes.sleep}
            onValueChange={() => toggleDataType('sleep')}
            description="Duration, deep, REM, core sleep"
          />
          <Toggle
            label="Activity"
            value={exportSettings.dataTypes.activity}
            onValueChange={() => toggleDataType('activity')}
            description="Steps, calories, exercise, distance"
          />
          <Toggle
            label="Vitals"
            value={exportSettings.dataTypes.vitals}
            onValueChange={() => toggleDataType('vitals')}
            description="Heart rate, HRV, respiratory rate, SpO2"
          />
          <Toggle
            label="Body"
            value={exportSettings.dataTypes.body}
            onValueChange={() => toggleDataType('body')}
            description="Weight, body fat percentage"
          />
          <Toggle
            label="Workouts"
            value={exportSettings.dataTypes.workouts}
            onValueChange={() => toggleDataType('workouts')}
            description="Type, duration, calories, distance"
          />
        </Card>

        {/* Export Format */}
        <Card title="Export Format" style={styles.card}>
          <SegmentedControl
            options={formatOptions}
            value={exportSettings.exportFormat}
            onValueChange={setExportFormat}
          />
          <Text style={styles.formatDescription}>
            {getFormatDescription(exportSettings.exportFormat)}
          </Text>
        </Card>

        {/* Format Options */}
        {(exportSettings.exportFormat === 'markdown' ||
          exportSettings.exportFormat === 'obsidianBases') && (
          <Card title="Format Options" style={styles.card}>
            <Toggle
              label="Include Metadata"
              value={exportSettings.includeMetadata}
              onValueChange={setIncludeMetadata}
              description="Add YAML frontmatter with date and type"
            />
            {exportSettings.exportFormat === 'markdown' && (
              <Toggle
                label="Group by Category"
                value={exportSettings.groupByCategory}
                onValueChange={setGroupByCategory}
                description="Organize data under category headings"
              />
            )}
          </Card>
        )}

        {/* Preview */}
        <Card title="Preview" style={styles.card}>
          <View style={styles.preview}>
            <Text style={styles.previewText}>
              {getFormatPreview(exportSettings.exportFormat)}
            </Text>
          </View>
        </Card>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={resetExportSettings}>
          <Ionicons name="refresh-outline" size={18} color={colors.text.tertiary} />
          <Text style={styles.resetText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function getFormatDescription(format: ExportFormat): string {
  switch (format) {
    case 'markdown':
      return 'Human-readable markdown with headers and lists. Best for reading in Obsidian.';
    case 'obsidianBases':
      return 'Optimized for Obsidian Databases plugin with numeric properties in frontmatter.';
    case 'json':
      return 'Structured JSON format. Ideal for programmatic access and data processing.';
    case 'csv':
      return 'Comma-separated values. Easy to import into spreadsheets.';
  }
}

function getFormatPreview(format: ExportFormat): string {
  switch (format) {
    case 'markdown':
      return `---
date: 2026-01-13
type: health-data
---

# Health Data — 2026-01-13

## Sleep
- **Total:** 8h 30m
- **Deep:** 2h 15m`;
    case 'obsidianBases':
      return `---
date: 2026-01-13
type: health-data
sleep_total_hours: 8.50
steps: 8432
---

# Health — 2026-01-13
8h 30m sleep · 8,432 steps`;
    case 'json':
      return `{
  "date": "2026-01-13",
  "type": "health-data",
  "sleep": {
    "totalDuration": 30600,
    "totalDurationFormatted": "8h 30m"
  }
}`;
    case 'csv':
      return `Date,Category,Metric,Value,Unit
2026-01-13,Sleep,Total Duration,30600,seconds
2026-01-13,Activity,Steps,8432,count`;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
  },
  formatDescription: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  preview: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  previewText: {
    ...typography.monoSmall,
    color: colors.text.secondary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  resetText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
});
