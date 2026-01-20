import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Button } from './Button';
import { formatDateDisplay, formatDateISO } from '../utils/formatting';
import { subDays } from 'date-fns';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: (startDate: Date, endDate: Date, subfolder: string) => void;
  defaultSubfolder: string;
  vaultName: string | null;
  isExporting?: boolean;
}

export function ExportModal({
  visible,
  onClose,
  onExport,
  defaultSubfolder,
  vaultName,
  isExporting = false,
}: ExportModalProps) {
  const [startDate, setStartDate] = useState(subDays(new Date(), 1));
  const [endDate, setEndDate] = useState(subDays(new Date(), 1));
  const [subfolder, setSubfolder] = useState(defaultSubfolder);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleExport = () => {
    onExport(startDate, endDate, subfolder);
  };

  const exportPath = vaultName
    ? `${vaultName}/${subfolder || 'Health'}`
    : subfolder || 'Health';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Export Health Data</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Subfolder Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Subfolder</Text>
            <TextInput
              style={styles.input}
              value={subfolder}
              onChangeText={setSubfolder}
              placeholder="Health"
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Date Range */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Date Range</Text>

            {/* Start Date */}
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateLabel}>Start Date</Text>
              <View style={styles.dateValue}>
                <Text style={styles.dateText}>{formatDateDisplay(startDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text.tertiary} />
              </View>
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  setShowStartPicker(Platform.OS === 'ios');
                  if (date) {
                    setStartDate(date);
                    if (date > endDate) {
                      setEndDate(date);
                    }
                  }
                }}
                maximumDate={new Date()}
                themeVariant="dark"
              />
            )}

            {/* End Date */}
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateLabel}>End Date</Text>
              <View style={styles.dateValue}>
                <Text style={styles.dateText}>{formatDateDisplay(endDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text.tertiary} />
              </View>
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  setShowEndPicker(Platform.OS === 'ios');
                  if (date) {
                    setEndDate(date);
                  }
                }}
                minimumDate={startDate}
                maximumDate={new Date()}
                themeVariant="dark"
              />
            )}
          </View>

          {/* Export Path Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Export Path</Text>
            <View style={styles.pathPreview}>
              <Ionicons name="folder-outline" size={16} color={colors.text.tertiary} />
              <Text style={styles.pathText}>{exportPath}/</Text>
            </View>
            <Text style={styles.pathExample}>
              Files: {formatDateISO(startDate)}.md
              {startDate.getTime() !== endDate.getTime() && ` ... ${formatDateISO(endDate)}.md`}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isExporting ? 'Exporting...' : 'Export'}
            onPress={handleExport}
            loading={isExporting}
            disabled={!vaultName}
          />
          {!vaultName && (
            <Text style={styles.warning}>Select a vault folder first</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  dateLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  dateValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    ...typography.body,
    color: colors.text.primary,
  },
  pathPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  pathText: {
    ...typography.mono,
    color: colors.text.secondary,
  },
  pathExample: {
    ...typography.monoSmall,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.surface.border,
  },
  warning: {
    ...typography.bodySmall,
    color: colors.semantic.warning,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
