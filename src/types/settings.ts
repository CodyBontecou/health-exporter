// Settings and configuration types

export type ExportFormat = 'markdown' | 'obsidianBases' | 'json' | 'csv';

export interface DataTypeSelection {
  sleep: boolean;
  activity: boolean;
  vitals: boolean;
  body: boolean;
  workouts: boolean;
}

export interface AdvancedExportSettings {
  dataTypes: DataTypeSelection;
  exportFormat: ExportFormat;
  includeMetadata: boolean;
  groupByCategory: boolean;
}

export type ScheduleFrequency = 'daily' | 'weekly';

export interface ExportSchedule {
  isEnabled: boolean;
  frequency: ScheduleFrequency;
  preferredHour: number; // 0-23
  preferredMinute: number; // 0-59
  lastExportDate: Date | null;
}

export const defaultDataTypeSelection: DataTypeSelection = {
  sleep: true,
  activity: true,
  vitals: true,
  body: true,
  workouts: true,
};

export const defaultExportSettings: AdvancedExportSettings = {
  dataTypes: defaultDataTypeSelection,
  exportFormat: 'markdown',
  includeMetadata: true,
  groupByCategory: true,
};

export const defaultExportSchedule: ExportSchedule = {
  isEnabled: false,
  frequency: 'daily',
  preferredHour: 7,
  preferredMinute: 0,
  lastExportDate: null,
};

export const exportFormatExtensions: Record<ExportFormat, string> = {
  markdown: '.md',
  obsidianBases: '.md',
  json: '.json',
  csv: '.csv',
};

export const exportFormatLabels: Record<ExportFormat, string> = {
  markdown: 'Markdown',
  obsidianBases: 'Obsidian Bases',
  json: 'JSON',
  csv: 'CSV',
};
