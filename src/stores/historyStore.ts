import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ExportHistoryEntry,
  ExportSource,
  ExportFailureReason,
  FailedDateDetail,
  MAX_HISTORY_ENTRIES,
} from '../types';

interface HistoryState {
  entries: ExportHistoryEntry[];
  addEntry: (entry: Omit<ExportHistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  getRecentEntries: (count: number) => ExportHistoryEntry[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: ExportHistoryEntry = {
          ...entry,
          id: generateId(),
          timestamp: new Date(),
        };

        set((state) => {
          const updated = [newEntry, ...state.entries];
          // Keep only the most recent entries
          return { entries: updated.slice(0, MAX_HISTORY_ENTRIES) };
        });
      },

      clearHistory: () => {
        set({ entries: [] });
      },

      getRecentEntries: (count) => {
        return get().entries.slice(0, count);
      },
    }),
    {
      name: 'export-history',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization for Date objects
      partialize: (state) => ({
        entries: state.entries.map((entry) => ({
          ...entry,
          timestamp: entry.timestamp.toISOString(),
          dateRangeStart: entry.dateRangeStart.toISOString(),
          dateRangeEnd: entry.dateRangeEnd.toISOString(),
          failedDateDetails: entry.failedDateDetails.map((detail) => ({
            ...detail,
            date: detail.date.toISOString(),
          })),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.entries) {
          state.entries = state.entries.map((entry: ExportHistoryEntry & {
            timestamp: string | Date;
            dateRangeStart: string | Date;
            dateRangeEnd: string | Date;
            failedDateDetails: Array<FailedDateDetail & { date: string | Date }>;
          }) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
            dateRangeStart: new Date(entry.dateRangeStart),
            dateRangeEnd: new Date(entry.dateRangeEnd),
            failedDateDetails: entry.failedDateDetails.map((detail) => ({
              ...detail,
              date: new Date(detail.date),
            })),
          }));
        }
      },
    }
  )
);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
