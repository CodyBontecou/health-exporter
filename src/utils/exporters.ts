import {
  HealthData,
  SleepData,
  ActivityData,
  VitalsData,
  BodyData,
  WorkoutData,
  workoutTypeDisplayNames,
  ExportFormat,
  AdvancedExportSettings,
} from '../types';
import {
  formatDuration,
  formatDurationHours,
  formatNumber,
  formatDistance,
  formatDateISO,
  formatDateDisplay,
  formatCalories,
  formatPercentage,
  formatWeight,
  formatHeartRate,
  formatHRV,
  formatRespiratoryRate,
} from './formatting';
import { format } from 'date-fns';

/**
 * Export health data to the specified format
 */
export function exportHealthData(
  data: HealthData,
  settings: AdvancedExportSettings
): string {
  switch (settings.exportFormat) {
    case 'markdown':
      return exportToMarkdown(data, settings);
    case 'obsidianBases':
      return exportToObsidianBases(data, settings);
    case 'json':
      return exportToJSON(data, settings);
    case 'csv':
      return exportToCSV(data, settings);
  }
}

/**
 * Get the file extension for the export format
 */
export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'markdown':
    case 'obsidianBases':
      return '.md';
    case 'json':
      return '.json';
    case 'csv':
      return '.csv';
  }
}

/**
 * Generate filename for export
 */
export function generateFilename(date: Date, format: ExportFormat): string {
  return `${formatDateISO(date)}${getFileExtension(format)}`;
}

// ============================================
// Markdown Export
// ============================================

function exportToMarkdown(
  data: HealthData,
  settings: AdvancedExportSettings
): string {
  const lines: string[] = [];
  const dateStr = formatDateISO(data.date);

  // Frontmatter
  if (settings.includeMetadata) {
    lines.push('---');
    lines.push(`date: ${dateStr}`);
    lines.push('type: health-data');
    lines.push('---');
    lines.push('');
  }

  // Title
  lines.push(`# Health Data — ${dateStr}`);
  lines.push('');

  // Sleep
  if (settings.dataTypes.sleep && data.sleep) {
    lines.push('## Sleep');
    lines.push(`- **Total:** ${formatDuration(data.sleep.totalDuration)}`);
    if (data.sleep.deepSleep > 0) {
      lines.push(`- **Deep:** ${formatDuration(data.sleep.deepSleep)}`);
    }
    if (data.sleep.remSleep > 0) {
      lines.push(`- **REM:** ${formatDuration(data.sleep.remSleep)}`);
    }
    if (data.sleep.coreSleep > 0) {
      lines.push(`- **Core:** ${formatDuration(data.sleep.coreSleep)}`);
    }
    lines.push('');
  }

  // Activity
  if (settings.dataTypes.activity && data.activity) {
    lines.push('## Activity');
    lines.push(`- **Steps:** ${formatNumber(data.activity.steps)}`);
    lines.push(`- **Active Calories:** ${formatCalories(data.activity.activeCalories)}`);
    lines.push(`- **Exercise:** ${data.activity.exerciseMinutes} min`);
    if (data.activity.flightsClimbed > 0) {
      lines.push(`- **Flights Climbed:** ${data.activity.flightsClimbed}`);
    }
    if (data.activity.walkingRunningDistance > 0) {
      lines.push(`- **Distance:** ${formatDistance(data.activity.walkingRunningDistance)}`);
    }
    lines.push('');
  }

  // Vitals
  if (settings.dataTypes.vitals && data.vitals) {
    lines.push('## Vitals');
    if (data.vitals.restingHeartRate > 0) {
      lines.push(`- **Resting Heart Rate:** ${formatHeartRate(data.vitals.restingHeartRate)}`);
    }
    if (data.vitals.hrv > 0) {
      lines.push(`- **HRV:** ${formatHRV(data.vitals.hrv)}`);
    }
    if (data.vitals.respiratoryRate > 0) {
      lines.push(`- **Respiratory Rate:** ${formatRespiratoryRate(data.vitals.respiratoryRate)}`);
    }
    if (data.vitals.bloodOxygen > 0) {
      lines.push(`- **Blood Oxygen:** ${formatPercentage(data.vitals.bloodOxygen)}`);
    }
    lines.push('');
  }

  // Body
  if (settings.dataTypes.body && data.body) {
    lines.push('## Body');
    if (data.body.weight > 0) {
      lines.push(`- **Weight:** ${formatWeight(data.body.weight)}`);
    }
    if (data.body.bodyFatPercentage > 0) {
      lines.push(`- **Body Fat:** ${formatPercentage(data.body.bodyFatPercentage)}`);
    }
    lines.push('');
  }

  // Workouts
  if (settings.dataTypes.workouts && data.workouts.length > 0) {
    lines.push('## Workouts');
    for (const workout of data.workouts) {
      const name = workoutTypeDisplayNames[workout.workoutType] || 'Workout';
      const time = format(workout.startTime, 'h:mm a');
      lines.push(`### ${name} at ${time}`);
      lines.push(`- **Duration:** ${formatDuration(workout.duration)}`);
      if (workout.calories > 0) {
        lines.push(`- **Calories:** ${formatCalories(workout.calories)}`);
      }
      if (workout.distance > 0) {
        lines.push(`- **Distance:** ${formatDistance(workout.distance)}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ============================================
// Obsidian Bases Export
// ============================================

function exportToObsidianBases(
  data: HealthData,
  settings: AdvancedExportSettings
): string {
  const lines: string[] = [];
  const dateStr = formatDateISO(data.date);

  // Frontmatter with all properties for Obsidian Bases/Dataview
  lines.push('---');
  lines.push(`date: ${dateStr}`);
  lines.push('type: health-data');

  // Sleep properties
  if (settings.dataTypes.sleep && data.sleep) {
    lines.push(`sleep_total_hours: ${formatDurationHours(data.sleep.totalDuration)}`);
    lines.push(`sleep_deep_hours: ${formatDurationHours(data.sleep.deepSleep)}`);
    lines.push(`sleep_rem_hours: ${formatDurationHours(data.sleep.remSleep)}`);
    lines.push(`sleep_core_hours: ${formatDurationHours(data.sleep.coreSleep)}`);
  }

  // Activity properties
  if (settings.dataTypes.activity && data.activity) {
    lines.push(`steps: ${data.activity.steps}`);
    lines.push(`active_calories: ${Math.round(data.activity.activeCalories)}`);
    lines.push(`exercise_minutes: ${Math.round(data.activity.exerciseMinutes)}`);
    lines.push(`flights_climbed: ${data.activity.flightsClimbed}`);
    lines.push(`distance_km: ${(data.activity.walkingRunningDistance / 1000).toFixed(2)}`);
  }

  // Vitals properties
  if (settings.dataTypes.vitals && data.vitals) {
    if (data.vitals.restingHeartRate > 0) {
      lines.push(`resting_heart_rate: ${Math.round(data.vitals.restingHeartRate)}`);
    }
    if (data.vitals.hrv > 0) {
      lines.push(`hrv_ms: ${Math.round(data.vitals.hrv)}`);
    }
    if (data.vitals.respiratoryRate > 0) {
      lines.push(`respiratory_rate: ${data.vitals.respiratoryRate.toFixed(1)}`);
    }
    if (data.vitals.bloodOxygen > 0) {
      lines.push(`blood_oxygen: ${data.vitals.bloodOxygen.toFixed(1)}`);
    }
  }

  // Body properties
  if (settings.dataTypes.body && data.body) {
    if (data.body.weight > 0) {
      lines.push(`weight_kg: ${data.body.weight.toFixed(1)}`);
    }
    if (data.body.bodyFatPercentage > 0) {
      lines.push(`body_fat_percentage: ${data.body.bodyFatPercentage.toFixed(1)}`);
    }
  }

  // Workout count
  if (settings.dataTypes.workouts) {
    lines.push(`workout_count: ${data.workouts.length}`);
    if (data.workouts.length > 0) {
      const totalWorkoutCalories = data.workouts.reduce((sum, w) => sum + w.calories, 0);
      const totalWorkoutMinutes = data.workouts.reduce((sum, w) => sum + w.duration / 60, 0);
      lines.push(`workout_calories: ${Math.round(totalWorkoutCalories)}`);
      lines.push(`workout_minutes: ${Math.round(totalWorkoutMinutes)}`);
    }
  }

  lines.push('---');
  lines.push('');

  // Summary line
  const summaryParts: string[] = [];
  if (settings.dataTypes.sleep && data.sleep) {
    summaryParts.push(`${formatDuration(data.sleep.totalDuration)} sleep`);
  }
  if (settings.dataTypes.activity && data.activity) {
    summaryParts.push(`${formatNumber(data.activity.steps)} steps`);
  }
  if (settings.dataTypes.workouts && data.workouts.length > 0) {
    summaryParts.push(`${data.workouts.length} workout${data.workouts.length > 1 ? 's' : ''}`);
  }

  lines.push(`# Health — ${dateStr}`);
  if (summaryParts.length > 0) {
    lines.push(summaryParts.join(' · '));
  }
  lines.push('');

  return lines.join('\n');
}

// ============================================
// JSON Export
// ============================================

function exportToJSON(
  data: HealthData,
  settings: AdvancedExportSettings
): string {
  const output: Record<string, unknown> = {
    date: formatDateISO(data.date),
    type: 'health-data',
  };

  if (settings.dataTypes.sleep && data.sleep) {
    output.sleep = {
      totalDuration: data.sleep.totalDuration,
      totalDurationFormatted: formatDuration(data.sleep.totalDuration),
      deepSleep: data.sleep.deepSleep,
      deepSleepFormatted: formatDuration(data.sleep.deepSleep),
      remSleep: data.sleep.remSleep,
      remSleepFormatted: formatDuration(data.sleep.remSleep),
      coreSleep: data.sleep.coreSleep,
      coreSleepFormatted: formatDuration(data.sleep.coreSleep),
    };
  }

  if (settings.dataTypes.activity && data.activity) {
    output.activity = {
      steps: data.activity.steps,
      activeCalories: Math.round(data.activity.activeCalories),
      exerciseMinutes: Math.round(data.activity.exerciseMinutes),
      flightsClimbed: data.activity.flightsClimbed,
      walkingRunningDistanceMeters: Math.round(data.activity.walkingRunningDistance),
      walkingRunningDistanceFormatted: formatDistance(data.activity.walkingRunningDistance),
    };
  }

  if (settings.dataTypes.vitals && data.vitals) {
    output.vitals = {
      restingHeartRate: Math.round(data.vitals.restingHeartRate),
      hrv: Math.round(data.vitals.hrv),
      respiratoryRate: Number(data.vitals.respiratoryRate.toFixed(1)),
      bloodOxygen: Number(data.vitals.bloodOxygen.toFixed(1)),
    };
  }

  if (settings.dataTypes.body && data.body) {
    output.body = {
      weightKg: Number(data.body.weight.toFixed(1)),
      bodyFatPercentage: Number(data.body.bodyFatPercentage.toFixed(1)),
    };
  }

  if (settings.dataTypes.workouts && data.workouts.length > 0) {
    output.workouts = data.workouts.map((workout) => ({
      type: workout.workoutType,
      typeName: workoutTypeDisplayNames[workout.workoutType],
      startTime: workout.startTime.toISOString(),
      duration: workout.duration,
      durationFormatted: formatDuration(workout.duration),
      calories: Math.round(workout.calories),
      distanceMeters: Math.round(workout.distance),
      distanceFormatted: formatDistance(workout.distance),
    }));
  }

  return JSON.stringify(output, null, 2);
}

// ============================================
// CSV Export
// ============================================

function exportToCSV(
  data: HealthData,
  settings: AdvancedExportSettings
): string {
  const rows: string[][] = [];
  const dateStr = formatDateISO(data.date);

  // Header
  rows.push(['Date', 'Category', 'Metric', 'Value', 'Unit']);

  // Sleep
  if (settings.dataTypes.sleep && data.sleep) {
    rows.push([dateStr, 'Sleep', 'Total Duration', String(data.sleep.totalDuration), 'seconds']);
    rows.push([dateStr, 'Sleep', 'Deep Sleep', String(data.sleep.deepSleep), 'seconds']);
    rows.push([dateStr, 'Sleep', 'REM Sleep', String(data.sleep.remSleep), 'seconds']);
    rows.push([dateStr, 'Sleep', 'Core Sleep', String(data.sleep.coreSleep), 'seconds']);
  }

  // Activity
  if (settings.dataTypes.activity && data.activity) {
    rows.push([dateStr, 'Activity', 'Steps', String(data.activity.steps), 'count']);
    rows.push([dateStr, 'Activity', 'Active Calories', String(Math.round(data.activity.activeCalories)), 'kcal']);
    rows.push([dateStr, 'Activity', 'Exercise Minutes', String(Math.round(data.activity.exerciseMinutes)), 'minutes']);
    rows.push([dateStr, 'Activity', 'Flights Climbed', String(data.activity.flightsClimbed), 'count']);
    rows.push([dateStr, 'Activity', 'Distance', String(Math.round(data.activity.walkingRunningDistance)), 'meters']);
  }

  // Vitals
  if (settings.dataTypes.vitals && data.vitals) {
    if (data.vitals.restingHeartRate > 0) {
      rows.push([dateStr, 'Vitals', 'Resting Heart Rate', String(Math.round(data.vitals.restingHeartRate)), 'bpm']);
    }
    if (data.vitals.hrv > 0) {
      rows.push([dateStr, 'Vitals', 'HRV', String(Math.round(data.vitals.hrv)), 'ms']);
    }
    if (data.vitals.respiratoryRate > 0) {
      rows.push([dateStr, 'Vitals', 'Respiratory Rate', data.vitals.respiratoryRate.toFixed(1), 'breaths/min']);
    }
    if (data.vitals.bloodOxygen > 0) {
      rows.push([dateStr, 'Vitals', 'Blood Oxygen', data.vitals.bloodOxygen.toFixed(1), '%']);
    }
  }

  // Body
  if (settings.dataTypes.body && data.body) {
    if (data.body.weight > 0) {
      rows.push([dateStr, 'Body', 'Weight', data.body.weight.toFixed(1), 'kg']);
    }
    if (data.body.bodyFatPercentage > 0) {
      rows.push([dateStr, 'Body', 'Body Fat', data.body.bodyFatPercentage.toFixed(1), '%']);
    }
  }

  // Workouts
  if (settings.dataTypes.workouts && data.workouts.length > 0) {
    for (let i = 0; i < data.workouts.length; i++) {
      const workout = data.workouts[i];
      const prefix = `Workout ${i + 1}`;
      rows.push([dateStr, prefix, 'Type', workoutTypeDisplayNames[workout.workoutType], '']);
      rows.push([dateStr, prefix, 'Duration', String(workout.duration), 'seconds']);
      rows.push([dateStr, prefix, 'Calories', String(Math.round(workout.calories)), 'kcal']);
      rows.push([dateStr, prefix, 'Distance', String(Math.round(workout.distance)), 'meters']);
    }
  }

  // Convert to CSV string
  return rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
