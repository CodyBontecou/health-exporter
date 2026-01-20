import { format } from 'date-fns';

/**
 * Format duration in seconds to human readable string (e.g., "8h 30m")
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0m';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Format duration in seconds to decimal hours (e.g., 8.5)
 */
export function formatDurationHours(seconds: number): number {
  return Math.round((seconds / 3600) * 100) / 100;
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format distance in meters to km or m string
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km.toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Format date to ISO format (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Format date to display format (e.g., "January 13, 2026")
 */
export function formatDateDisplay(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

/**
 * Format time to display format (e.g., "7:00 AM")
 */
export function formatTime(hour: number, minute: number): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return format(date, 'h:mm a');
}

/**
 * Format calories with appropriate precision
 */
export function formatCalories(calories: number): string {
  return `${Math.round(calories)} kcal`;
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format weight in kg
 */
export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`;
}

/**
 * Format heart rate
 */
export function formatHeartRate(bpm: number): string {
  return `${Math.round(bpm)} bpm`;
}

/**
 * Format HRV in milliseconds
 */
export function formatHRV(ms: number): string {
  return `${Math.round(ms)} ms`;
}

/**
 * Format respiratory rate
 */
export function formatRespiratoryRate(breathsPerMin: number): string {
  return `${breathsPerMin.toFixed(1)} breaths/min`;
}
