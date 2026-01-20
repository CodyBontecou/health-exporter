// Export history types

export type ExportSource = 'manual' | 'scheduled';

export type ExportFailureReason =
  | 'noVaultSelected'
  | 'accessDenied'
  | 'noHealthData'
  | 'healthKitError'
  | 'fileWriteError'
  | 'backgroundTaskExpired'
  | 'unknown';

export interface FailedDateDetail {
  date: Date;
  reason: ExportFailureReason;
}

export interface ExportHistoryEntry {
  id: string;
  timestamp: Date;
  source: ExportSource;
  success: boolean;
  dateRangeStart: Date;
  dateRangeEnd: Date;
  successCount: number;
  totalCount: number;
  failureReason: ExportFailureReason | null;
  failedDateDetails: FailedDateDetail[];
}

export const failureReasonLabels: Record<ExportFailureReason, string> = {
  noVaultSelected: 'No vault selected',
  accessDenied: 'Access denied to vault folder',
  noHealthData: 'No health data available',
  healthKitError: 'HealthKit error',
  fileWriteError: 'Failed to write file',
  backgroundTaskExpired: 'Background task expired',
  unknown: 'Unknown error',
};

export const MAX_HISTORY_ENTRIES = 50;
