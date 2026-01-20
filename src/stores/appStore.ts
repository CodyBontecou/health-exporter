import { create } from 'zustand';

interface AppState {
  // Initialization
  isInitialized: boolean;
  isHealthKitAuthorized: boolean;
  hasVaultSelected: boolean;

  // Export state
  isExporting: boolean;
  exportProgress: number; // 0-100
  exportStatus: 'idle' | 'exporting' | 'success' | 'error';
  exportMessage: string | null;

  // Modal state
  isExportModalVisible: boolean;

  // Actions
  setInitialized: (initialized: boolean) => void;
  setHealthKitAuthorized: (authorized: boolean) => void;
  setHasVaultSelected: (hasVault: boolean) => void;

  setExporting: (exporting: boolean) => void;
  setExportProgress: (progress: number) => void;
  setExportStatus: (status: 'idle' | 'exporting' | 'success' | 'error', message?: string) => void;
  resetExportStatus: () => void;

  setExportModalVisible: (visible: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isInitialized: false,
  isHealthKitAuthorized: false,
  hasVaultSelected: false,

  isExporting: false,
  exportProgress: 0,
  exportStatus: 'idle',
  exportMessage: null,

  isExportModalVisible: false,

  // Actions
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  setHealthKitAuthorized: (authorized) => set({ isHealthKitAuthorized: authorized }),
  setHasVaultSelected: (hasVault) => set({ hasVaultSelected: hasVault }),

  setExporting: (exporting) => set({ isExporting: exporting }),
  setExportProgress: (progress) => set({ exportProgress: progress }),
  setExportStatus: (status, message) =>
    set({ exportStatus: status, exportMessage: message || null }),
  resetExportStatus: () =>
    set({ exportStatus: 'idle', exportMessage: null, exportProgress: 0 }),

  setExportModalVisible: (visible) => set({ isExportModalVisible: visible }),
}));
