import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdvancedExportSettings,
  DataTypeSelection,
  ExportFormat,
  ExportSchedule,
  defaultExportSettings,
  defaultExportSchedule,
} from '../types';

interface SettingsState {
  exportSettings: AdvancedExportSettings;
  schedule: ExportSchedule;
  subfolder: string;
  vaultName: string | null;

  // Export settings actions
  setExportFormat: (format: ExportFormat) => void;
  setDataTypes: (dataTypes: DataTypeSelection) => void;
  toggleDataType: (type: keyof DataTypeSelection) => void;
  setIncludeMetadata: (include: boolean) => void;
  setGroupByCategory: (group: boolean) => void;
  resetExportSettings: () => void;

  // Schedule actions
  setScheduleEnabled: (enabled: boolean) => void;
  setScheduleFrequency: (frequency: 'daily' | 'weekly') => void;
  setScheduleTime: (hour: number, minute: number) => void;
  updateLastExportDate: (date: Date) => void;

  // Vault actions
  setSubfolder: (subfolder: string) => void;
  setVaultName: (name: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      exportSettings: defaultExportSettings,
      schedule: defaultExportSchedule,
      subfolder: 'Health',
      vaultName: null,

      // Export settings actions
      setExportFormat: (format) => {
        set((state) => ({
          exportSettings: { ...state.exportSettings, exportFormat: format },
        }));
      },

      setDataTypes: (dataTypes) => {
        set((state) => ({
          exportSettings: { ...state.exportSettings, dataTypes },
        }));
      },

      toggleDataType: (type) => {
        set((state) => ({
          exportSettings: {
            ...state.exportSettings,
            dataTypes: {
              ...state.exportSettings.dataTypes,
              [type]: !state.exportSettings.dataTypes[type],
            },
          },
        }));
      },

      setIncludeMetadata: (include) => {
        set((state) => ({
          exportSettings: { ...state.exportSettings, includeMetadata: include },
        }));
      },

      setGroupByCategory: (group) => {
        set((state) => ({
          exportSettings: { ...state.exportSettings, groupByCategory: group },
        }));
      },

      resetExportSettings: () => {
        set({ exportSettings: defaultExportSettings });
      },

      // Schedule actions
      setScheduleEnabled: (enabled) => {
        set((state) => ({
          schedule: { ...state.schedule, isEnabled: enabled },
        }));
      },

      setScheduleFrequency: (frequency) => {
        set((state) => ({
          schedule: { ...state.schedule, frequency },
        }));
      },

      setScheduleTime: (hour, minute) => {
        set((state) => ({
          schedule: {
            ...state.schedule,
            preferredHour: hour,
            preferredMinute: minute,
          },
        }));
      },

      updateLastExportDate: (date) => {
        set((state) => ({
          schedule: { ...state.schedule, lastExportDate: date },
        }));
      },

      // Vault actions
      setSubfolder: (subfolder) => {
        set({ subfolder: subfolder || 'Health' });
      },

      setVaultName: (name) => {
        set({ vaultName: name });
      },
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        exportSettings: state.exportSettings,
        schedule: {
          ...state.schedule,
          lastExportDate: state.schedule.lastExportDate?.toISOString() || null,
        },
        subfolder: state.subfolder,
        vaultName: state.vaultName,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.schedule?.lastExportDate) {
          state.schedule.lastExportDate = new Date(state.schedule.lastExportDate as unknown as string);
        }
      },
    }
  )
);
