import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../src/theme';
import { StatusBadge, Button, Card, ExportModal } from '../src/components';
import { useAppStore, useSettingsStore, useHistoryStore } from '../src/stores';
import { healthKitManager, vaultManager } from '../src/managers';
import { addDays, eachDayOfInterval } from 'date-fns';
import { formatTime } from '../src/utils/formatting';

export default function HomeScreen() {
  const router = useRouter();

  // App state
  const isHealthKitAuthorized = useAppStore((state) => state.isHealthKitAuthorized);
  const hasVaultSelected = useAppStore((state) => state.hasVaultSelected);
  const setHasVaultSelected = useAppStore((state) => state.setHasVaultSelected);
  const isExporting = useAppStore((state) => state.isExporting);
  const setExporting = useAppStore((state) => state.setExporting);
  const exportStatus = useAppStore((state) => state.exportStatus);
  const setExportStatus = useAppStore((state) => state.setExportStatus);

  // Settings
  const exportSettings = useSettingsStore((state) => state.exportSettings);
  const schedule = useSettingsStore((state) => state.schedule);
  const subfolder = useSettingsStore((state) => state.subfolder);
  const vaultName = useSettingsStore((state) => state.vaultName);
  const setVaultName = useSettingsStore((state) => state.setVaultName);

  // History
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);

  // Modal state
  const [showExportModal, setShowExportModal] = useState(false);

  // Select vault folder
  const handleSelectVault = async () => {
    const success = await vaultManager.selectVaultFolder();
    if (success) {
      setHasVaultSelected(true);
      setVaultName(vaultManager.getVaultName());
    }
  };

  // Export health data
  const handleExport = useCallback(async (startDate: Date, endDate: Date, customSubfolder: string) => {
    if (!hasVaultSelected) {
      Alert.alert('No Vault Selected', 'Please select an Obsidian vault folder first.');
      return;
    }

    setExporting(true);
    setExportStatus('exporting');
    setShowExportModal(false);

    try {
      // Get all dates in range
      const dates = eachDayOfInterval({ start: startDate, end: endDate });

      // Fetch health data for all dates
      const dataArray = await Promise.all(
        dates.map((date) => healthKitManager.fetchHealthData(date))
      );

      // Export to vault
      const result = await vaultManager.exportMultipleDays(
        dataArray,
        exportSettings,
        customSubfolder
      );

      // Record in history
      addHistoryEntry({
        source: 'manual',
        success: result.successCount > 0,
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
        successCount: result.successCount,
        totalCount: result.totalCount,
        failureReason: result.successCount === 0 ? 'fileWriteError' : null,
        failedDateDetails: result.failures.map((f) => ({
          date: f.date,
          reason: f.reason,
        })),
      });

      if (result.successCount === result.totalCount) {
        setExportStatus('success', `Exported ${result.successCount} day${result.successCount > 1 ? 's' : ''}`);
      } else if (result.successCount > 0) {
        setExportStatus('success', `Exported ${result.successCount} of ${result.totalCount} days`);
      } else {
        setExportStatus('error', 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error', 'Export failed');

      addHistoryEntry({
        source: 'manual',
        success: false,
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
        successCount: 0,
        totalCount: 1,
        failureReason: 'unknown',
        failedDateDetails: [],
      });
    } finally {
      setExporting(false);

      // Reset status after delay
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
    }
  }, [hasVaultSelected, exportSettings, addHistoryEntry]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Health Exporter</Text>
          <Text style={styles.subtitle}>Export health data to Obsidian</Text>
        </View>

        {/* Status Badges */}
        <View style={styles.statusRow}>
          <StatusBadge
            label="HealthKit"
            status={isHealthKitAuthorized ? 'connected' : 'disconnected'}
          />
          <StatusBadge
            label={vaultName || 'No Vault'}
            status={hasVaultSelected ? 'connected' : 'disconnected'}
          />
        </View>

        {/* Vault Selection */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="folder-outline" size={20} color={colors.accent.primary} />
            <Text style={styles.cardTitle}>Obsidian Vault</Text>
          </View>
          {hasVaultSelected ? (
            <View style={styles.vaultInfo}>
              <Text style={styles.vaultName}>{vaultName}</Text>
              <Text style={styles.vaultPath}>/{subfolder}</Text>
              <TouchableOpacity onPress={handleSelectVault} style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              title="Select Vault Folder"
              onPress={handleSelectVault}
              variant="secondary"
              size="sm"
            />
          )}
        </Card>

        {/* Export Button */}
        <View style={styles.exportSection}>
          <Button
            title={isExporting ? 'Exporting...' : 'Export Health Data'}
            onPress={() => setShowExportModal(true)}
            loading={isExporting}
            disabled={!isHealthKitAuthorized || !hasVaultSelected}
            size="lg"
          />
          {exportStatus !== 'idle' && (
            <View style={[
              styles.statusMessage,
              exportStatus === 'success' && styles.statusSuccess,
              exportStatus === 'error' && styles.statusError,
            ]}>
              <Ionicons
                name={exportStatus === 'success' ? 'checkmark-circle' : exportStatus === 'error' ? 'alert-circle' : 'sync'}
                size={16}
                color={exportStatus === 'success' ? colors.semantic.success : exportStatus === 'error' ? colors.semantic.error : colors.text.secondary}
              />
              <Text style={[
                styles.statusText,
                exportStatus === 'success' && styles.statusTextSuccess,
                exportStatus === 'error' && styles.statusTextError,
              ]}>
                {useAppStore.getState().exportMessage || 'Exporting...'}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="options-outline" size={24} color={colors.accent.primary} />
            <Text style={styles.quickActionLabel}>Export Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/schedule')}
          >
            <Ionicons name="time-outline" size={24} color={colors.accent.primary} />
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionLabel}>Scheduled Exports</Text>
              {schedule.isEnabled && (
                <Text style={styles.quickActionSubtitle}>
                  {schedule.frequency === 'daily' ? 'Daily' : 'Weekly'} at {formatTime(schedule.preferredHour, schedule.preferredMinute)}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Export Modal */}
      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        defaultSubfolder={subfolder}
        vaultName={vaultName}
        isExporting={isExporting}
      />
    </SafeAreaView>
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
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.label,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vaultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  vaultName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  vaultPath: {
    ...typography.mono,
    color: colors.text.tertiary,
  },
  changeButton: {
    marginLeft: 'auto',
  },
  changeButtonText: {
    ...typography.buttonSmall,
    color: colors.accent.primary,
  },
  exportSection: {
    marginVertical: spacing.lg,
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusSuccess: {},
  statusError: {},
  statusText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  statusTextSuccess: {
    color: colors.semantic.success,
  },
  statusTextError: {
    color: colors.semantic.error,
  },
  quickActions: {
    gap: spacing.sm,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionLabel: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  quickActionSubtitle: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});
