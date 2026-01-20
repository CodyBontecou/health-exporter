import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthData, AdvancedExportSettings, ExportFailureReason } from '../types';
import { exportHealthData, generateFilename } from '../utils/exporters';

const VAULT_URI_KEY = 'obsidianVaultUri';
const VAULT_NAME_KEY = 'obsidianVaultName';
const SUBFOLDER_KEY = 'healthSubfolder';

export interface ExportResult {
  success: boolean;
  failureReason?: ExportFailureReason;
  filePath?: string;
}

class VaultManager {
  private vaultUri: string | null = null;
  private vaultName: string | null = null;
  private subfolder: string = 'Health';

  /**
   * Initialize the vault manager by loading saved settings
   */
  async initialize(): Promise<void> {
    const [uri, name, subfolder] = await Promise.all([
      AsyncStorage.getItem(VAULT_URI_KEY),
      AsyncStorage.getItem(VAULT_NAME_KEY),
      AsyncStorage.getItem(SUBFOLDER_KEY),
    ]);

    this.vaultUri = uri;
    this.vaultName = name;
    if (subfolder) {
      this.subfolder = subfolder;
    }
  }

  /**
   * Check if a vault is selected
   */
  hasVaultSelected(): boolean {
    return this.vaultUri !== null;
  }

  /**
   * Get the current vault name
   */
  getVaultName(): string | null {
    return this.vaultName;
  }

  /**
   * Get the current subfolder
   */
  getSubfolder(): string {
    return this.subfolder;
  }

  /**
   * Set the subfolder for exports
   */
  async setSubfolder(subfolder: string): Promise<void> {
    this.subfolder = subfolder || 'Health';
    await AsyncStorage.setItem(SUBFOLDER_KEY, this.subfolder);
  }

  /**
   * Open the document picker to select a vault folder
   */
  async selectVault(): Promise<boolean> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return false;
      }

      const asset = result.assets[0];

      // For folder selection, we need to use the directory picker
      // expo-document-picker doesn't support folder selection directly on iOS
      // We'll use the file's parent directory
      const uri = asset.uri;
      const name = asset.name || 'Obsidian Vault';

      // Get the directory containing the selected file
      const dirUri = uri.substring(0, uri.lastIndexOf('/'));

      this.vaultUri = dirUri;
      this.vaultName = name;

      await Promise.all([
        AsyncStorage.setItem(VAULT_URI_KEY, dirUri),
        AsyncStorage.setItem(VAULT_NAME_KEY, name),
      ]);

      return true;
    } catch (error) {
      console.error('Error selecting vault:', error);
      return false;
    }
  }

  /**
   * Select vault folder using SAF (Storage Access Framework) on Android
   * or folder picker on iOS
   */
  async selectVaultFolder(): Promise<boolean> {
    try {
      // Use SAF directory picker
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        return false;
      }

      this.vaultUri = permissions.directoryUri;
      // Extract folder name from URI
      const uriParts = permissions.directoryUri.split('%2F');
      this.vaultName = decodeURIComponent(uriParts[uriParts.length - 1]) || 'Obsidian Vault';

      await Promise.all([
        AsyncStorage.setItem(VAULT_URI_KEY, this.vaultUri),
        AsyncStorage.setItem(VAULT_NAME_KEY, this.vaultName),
      ]);

      return true;
    } catch (error) {
      console.error('Error selecting vault folder:', error);
      return false;
    }
  }

  /**
   * Clear the selected vault
   */
  async clearVault(): Promise<void> {
    this.vaultUri = null;
    this.vaultName = null;
    await Promise.all([
      AsyncStorage.removeItem(VAULT_URI_KEY),
      AsyncStorage.removeItem(VAULT_NAME_KEY),
    ]);
  }

  /**
   * Export health data to the vault
   */
  async exportToVault(
    data: HealthData,
    settings: AdvancedExportSettings,
    customSubfolder?: string
  ): Promise<ExportResult> {
    if (!this.vaultUri) {
      return { success: false, failureReason: 'noVaultSelected' };
    }

    const subfolder = customSubfolder || this.subfolder;
    const filename = generateFilename(data.date, settings.exportFormat);
    const content = exportHealthData(data, settings);

    try {
      // Build the target directory path
      const targetDir = `${this.vaultUri}/${subfolder}`;

      // Ensure the subfolder exists
      try {
        await FileSystem.StorageAccessFramework.makeDirectoryAsync(
          this.vaultUri,
          subfolder
        );
      } catch {
        // Directory might already exist, ignore error
      }

      // Create the file
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        targetDir,
        filename,
        'text/plain'
      );

      // Write content to the file
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return { success: true, filePath: fileUri };
    } catch (error) {
      console.error('Error exporting to vault:', error);

      // Check if it's an access error
      if (error instanceof Error && error.message.includes('permission')) {
        return { success: false, failureReason: 'accessDenied' };
      }

      return { success: false, failureReason: 'fileWriteError' };
    }
  }

  /**
   * Export multiple days of health data
   */
  async exportMultipleDays(
    dataArray: HealthData[],
    settings: AdvancedExportSettings,
    customSubfolder?: string
  ): Promise<{
    successCount: number;
    totalCount: number;
    failures: Array<{ date: Date; reason: ExportFailureReason }>;
  }> {
    const failures: Array<{ date: Date; reason: ExportFailureReason }> = [];
    let successCount = 0;

    for (const data of dataArray) {
      const result = await this.exportToVault(data, settings, customSubfolder);

      if (result.success) {
        successCount++;
      } else {
        failures.push({
          date: data.date,
          reason: result.failureReason || 'unknown',
        });
      }
    }

    return {
      successCount,
      totalCount: dataArray.length,
      failures,
    };
  }

  /**
   * Get the full export path for display
   */
  getExportPath(customSubfolder?: string): string {
    const subfolder = customSubfolder || this.subfolder;
    if (this.vaultName) {
      return `${this.vaultName}/${subfolder}`;
    }
    return subfolder;
  }
}

// Export singleton instance
export const vaultManager = new VaultManager();
