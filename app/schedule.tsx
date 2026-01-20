import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../src/theme';
import { Card, Toggle, SegmentedControl } from '../src/components';
import { useSettingsStore, useHistoryStore } from '../src/stores';
import { schedulingManager } from '../src/managers';
import { ExportHistoryEntry, failureReasonLabels, ScheduleFrequency } from '../src/types';
import { formatDateDisplay, formatTime, formatDateISO } from '../src/utils/formatting';
import { format } from 'date-fns';

export default function ScheduleScreen() {
  const schedule = useSettingsStore((state) => state.schedule);
  const setScheduleEnabled = useSettingsStore((state) => state.setScheduleEnabled);
  const setScheduleFrequency = useSettingsStore((state) => state.setScheduleFrequency);
  const setScheduleTime = useSettingsStore((state) => state.setScheduleTime);

  const entries = useHistoryStore((state) => state.entries);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const [selectedEntry, setSelectedEntry] = useState<ExportHistoryEntry | null>(null);

  const frequencyOptions: { value: ScheduleFrequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  const handleToggleSchedule = async (enabled: boolean) => {
    setScheduleEnabled(enabled);
    await schedulingManager.updateSchedule({ isEnabled: enabled });
  };

  const handleFrequencyChange = async (frequency: ScheduleFrequency) => {
    setScheduleFrequency(frequency);
    await schedulingManager.updateSchedule({ frequency });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all export history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };

  const nextExportDate = schedulingManager.getNextExportDate();

  const recentEntries = entries.slice(0, 10);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Schedule Toggle */}
        <Card title="Automatic Exports" style={styles.card}>
          <Toggle
            label="Enable Scheduled Exports"
            value={schedule.isEnabled}
            onValueChange={handleToggleSchedule}
            description="Automatically export health data in the background"
          />
        </Card>

        {/* Schedule Settings */}
        {schedule.isEnabled && (
          <Card title="Schedule" style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Frequency</Text>
              <SegmentedControl
                options={frequencyOptions}
                value={schedule.frequency}
                onValueChange={handleFrequencyChange}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Time</Text>
              <TimePicker
                hour={schedule.preferredHour}
                minute={schedule.preferredMinute}
                onChange={(hour, minute) => {
                  setScheduleTime(hour, minute);
                  schedulingManager.updateSchedule({
                    preferredHour: hour,
                    preferredMinute: minute,
                  });
                }}
              />
            </View>

            {nextExportDate && (
              <View style={styles.nextExport}>
                <Ionicons name="time-outline" size={16} color={colors.text.tertiary} />
                <Text style={styles.nextExportText}>
                  Next export: {format(nextExportDate, 'MMM d, h:mm a')}
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Export History */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Export History</Text>
          {entries.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>No exports yet</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {recentEntries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.historyItem}
                onPress={() => setSelectedEntry(entry)}
              >
                <View style={styles.historyIcon}>
                  <Ionicons
                    name={entry.success ? 'checkmark-circle' : 'alert-circle'}
                    size={20}
                    color={entry.success ? colors.semantic.success : colors.semantic.error}
                  />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyDate}>
                    {format(entry.timestamp, 'MMM d, yyyy h:mm a')}
                  </Text>
                  <Text style={styles.historyDetails}>
                    {entry.source === 'scheduled' ? 'Scheduled' : 'Manual'} ·{' '}
                    {entry.successCount}/{entry.totalCount} exported
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <EntryDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </SafeAreaView>
  );
}

// Time Picker Component
function TimePicker({
  hour,
  minute,
  onChange,
}: {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <View style={styles.timePicker}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timePickerScroll}
      >
        {hours.map((h) => (
          <TouchableOpacity
            key={h}
            style={[styles.timeOption, hour === h && styles.timeOptionSelected]}
            onPress={() => onChange(h, minute)}
          >
            <Text style={[styles.timeOptionText, hour === h && styles.timeOptionTextSelected]}>
              {h.toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.timeSeparator}>:</Text>
      <View style={styles.minuteOptions}>
        {minutes.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.timeOption, minute === m && styles.timeOptionSelected]}
            onPress={() => onChange(hour, m)}
          >
            <Text style={[styles.timeOptionText, minute === m && styles.timeOptionTextSelected]}>
              {m.toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Entry Detail Modal
function EntryDetailModal({
  entry,
  onClose,
}: {
  entry: ExportHistoryEntry;
  onClose: () => void;
}) {
  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Export Details</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBody}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {format(entry.timestamp, 'MMM d, yyyy h:mm a')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Source</Text>
            <Text style={styles.detailValue}>
              {entry.source === 'scheduled' ? 'Scheduled Export' : 'Manual Export'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Ionicons
                name={entry.success ? 'checkmark-circle' : 'alert-circle'}
                size={16}
                color={entry.success ? colors.semantic.success : colors.semantic.error}
              />
              <Text style={[
                styles.statusBadgeText,
                { color: entry.success ? colors.semantic.success : colors.semantic.error }
              ]}>
                {entry.success ? 'Success' : 'Failed'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date Range</Text>
            <Text style={styles.detailValue}>
              {formatDateISO(entry.dateRangeStart)}
              {entry.dateRangeStart.getTime() !== entry.dateRangeEnd.getTime() &&
                ` to ${formatDateISO(entry.dateRangeEnd)}`}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Files</Text>
            <Text style={styles.detailValue}>
              {entry.successCount} of {entry.totalCount} exported
            </Text>
          </View>

          {entry.failureReason && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Error</Text>
              <Text style={[styles.detailValue, styles.errorText]}>
                {failureReasonLabels[entry.failureReason]}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
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
  settingRow: {
    marginBottom: spacing.md,
  },
  settingLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  nextExport: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surface.border,
  },
  nextExportText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  historyTitle: {
    ...typography.label,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearButton: {
    ...typography.buttonSmall,
    color: colors.semantic.error,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  historyList: {
    gap: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    ...typography.body,
    color: colors.text.primary,
  },
  historyDetails: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePickerScroll: {
    maxWidth: 150,
  },
  minuteOptions: {
    flexDirection: 'row',
  },
  timeOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginHorizontal: 2,
  },
  timeOptionSelected: {
    backgroundColor: colors.accent.primary,
  },
  timeOptionText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  timeOptionTextSelected: {
    color: colors.white,
  },
  timeSeparator: {
    ...typography.h3,
    color: colors.text.secondary,
    marginHorizontal: spacing.xs,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  modalBody: {
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  detailLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  detailValue: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusBadgeText: {
    ...typography.body,
  },
  errorText: {
    color: colors.semantic.error,
  },
});
