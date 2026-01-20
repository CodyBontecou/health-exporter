import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExportSchedule, defaultExportSchedule, AdvancedExportSettings, defaultExportSettings } from '../types';
import { healthKitManager } from './HealthKitManager';
import { vaultManager } from './VaultManager';
import { useHistoryStore } from '../stores/historyStore';
import { subDays, addDays, addHours, setHours, setMinutes, startOfDay } from 'date-fns';

const BACKGROUND_TASK_NAME = 'com.healthexporter.dataexport';
const SCHEDULE_KEY = 'exportSchedule';
const SETTINGS_KEY = 'advancedExportSettings';

// Define the background task
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    console.log('Background task started');

    const scheduler = SchedulingManager.getInstance();
    await scheduler.executeScheduledExport();

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

class SchedulingManager {
  private static instance: SchedulingManager;
  private schedule: ExportSchedule = defaultExportSchedule;
  private settings: AdvancedExportSettings = defaultExportSettings;
  private isInitialized = false;

  static getInstance(): SchedulingManager {
    if (!SchedulingManager.instance) {
      SchedulingManager.instance = new SchedulingManager();
    }
    return SchedulingManager.instance;
  }

  /**
   * Initialize the scheduling manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load saved schedule and settings
    const [scheduleJson, settingsJson] = await Promise.all([
      AsyncStorage.getItem(SCHEDULE_KEY),
      AsyncStorage.getItem(SETTINGS_KEY),
    ]);

    if (scheduleJson) {
      const parsed = JSON.parse(scheduleJson);
      this.schedule = {
        ...parsed,
        lastExportDate: parsed.lastExportDate ? new Date(parsed.lastExportDate) : null,
      };
    }

    if (settingsJson) {
      this.settings = JSON.parse(settingsJson);
    }

    // Request notification permissions
    await this.requestNotificationPermissions();

    // Register background task if schedule is enabled
    if (this.schedule.isEnabled) {
      await this.registerBackgroundTask();
    }

    this.isInitialized = true;
  }

  /**
   * Get the current schedule
   */
  getSchedule(): ExportSchedule {
    return { ...this.schedule };
  }

  /**
   * Update the schedule
   */
  async updateSchedule(schedule: Partial<ExportSchedule>): Promise<void> {
    this.schedule = { ...this.schedule, ...schedule };
    await AsyncStorage.setItem(SCHEDULE_KEY, JSON.stringify(this.schedule));

    if (this.schedule.isEnabled) {
      await this.registerBackgroundTask();
    } else {
      await this.unregisterBackgroundTask();
    }
  }

  /**
   * Update export settings
   */
  async updateSettings(settings: AdvancedExportSettings): Promise<void> {
    this.settings = settings;
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  /**
   * Get the next scheduled export date
   */
  getNextExportDate(): Date | null {
    if (!this.schedule.isEnabled) return null;

    const now = new Date();
    let nextDate = setMinutes(
      setHours(startOfDay(now), this.schedule.preferredHour),
      this.schedule.preferredMinute
    );

    // If the time has passed today, move to next occurrence
    if (nextDate <= now) {
      if (this.schedule.frequency === 'daily') {
        nextDate = addDays(nextDate, 1);
      } else {
        nextDate = addDays(nextDate, 7);
      }
    }

    return nextDate;
  }

  /**
   * Execute a scheduled export
   */
  async executeScheduledExport(): Promise<void> {
    const historyStore = useHistoryStore.getState();

    // Initialize managers if needed
    await Promise.all([
      healthKitManager.initialize(),
      vaultManager.initialize(),
    ]);

    if (!vaultManager.hasVaultSelected()) {
      historyStore.addEntry({
        source: 'scheduled',
        success: false,
        dateRangeStart: new Date(),
        dateRangeEnd: new Date(),
        successCount: 0,
        totalCount: 0,
        failureReason: 'noVaultSelected',
        failedDateDetails: [],
      });
      await this.sendNotification('Export Failed', 'No vault selected');
      return;
    }

    // Determine date range based on frequency
    const endDate = subDays(new Date(), 1); // Yesterday
    const startDate = this.schedule.frequency === 'daily'
      ? endDate
      : subDays(endDate, 6); // Last 7 days for weekly

    // Fetch and export data
    const dates: Date[] = [];
    let current = startDate;
    while (current <= endDate) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }

    const dataArray = await Promise.all(
      dates.map(date => healthKitManager.fetchHealthData(date))
    );

    const result = await vaultManager.exportMultipleDays(dataArray, this.settings);

    // Update last export date
    await this.updateSchedule({ lastExportDate: new Date() });

    // Record in history
    historyStore.addEntry({
      source: 'scheduled',
      success: result.successCount > 0,
      dateRangeStart: startDate,
      dateRangeEnd: endDate,
      successCount: result.successCount,
      totalCount: result.totalCount,
      failureReason: result.successCount === 0 ? 'fileWriteError' : null,
      failedDateDetails: result.failures.map(f => ({
        date: f.date,
        reason: f.reason,
      })),
    });

    // Send notification
    if (result.successCount === result.totalCount) {
      await this.sendNotification(
        'Export Complete',
        `Successfully exported ${result.successCount} day${result.successCount > 1 ? 's' : ''} of health data`
      );
    } else if (result.successCount > 0) {
      await this.sendNotification(
        'Export Partially Complete',
        `Exported ${result.successCount} of ${result.totalCount} days`
      );
    } else {
      await this.sendNotification(
        'Export Failed',
        'Failed to export health data'
      );
    }
  }

  /**
   * Request notification permissions
   */
  private async requestNotificationPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Send a local notification
   */
  private async sendNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Immediately
    });
  }

  /**
   * Register the background task
   */
  private async registerBackgroundTask(): Promise<void> {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
        minimumInterval: this.schedule.frequency === 'daily'
          ? 24 * 60 * 60 // 24 hours
          : 7 * 24 * 60 * 60, // 7 days
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background task registered');
    } catch (error) {
      console.error('Failed to register background task:', error);
    }
  }

  /**
   * Unregister the background task
   */
  private async unregisterBackgroundTask(): Promise<void> {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
      console.log('Background task unregistered');
    } catch (error) {
      console.error('Failed to unregister background task:', error);
    }
  }

  /**
   * Check if background task is registered
   */
  async isBackgroundTaskRegistered(): Promise<boolean> {
    const status = await BackgroundFetch.getStatusAsync();
    return status === BackgroundFetch.BackgroundFetchStatus.Available;
  }
}

export const schedulingManager = SchedulingManager.getInstance();
