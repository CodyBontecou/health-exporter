import SwiftUI

struct ContentView: View {
    @StateObject private var healthKitManager = HealthKitManager()
    @StateObject private var vaultManager = VaultManager()
    @StateObject private var advancedSettings = AdvancedExportSettings()
    @ObservedObject private var exportHistory = ExportHistoryManager.shared
    @EnvironmentObject var schedulingManager: SchedulingManager

    @State private var startDate = Calendar.current.date(byAdding: .day, value: -7, to: Date()) ?? Date()
    @State private var endDate = Date()
    @State private var showFolderPicker = false
    @State private var showStartDatePicker = false
    @State private var showEndDatePicker = false
    @State private var isExporting = false
    @State private var exportProgress: Double = 0.0
    @State private var exportStatusMessage = ""
    @State private var showError = false
    @State private var errorMessage = ""

    var body: some View {
        ZStack {
            // Clean minimal background
            AnimatedMeshBackground()

            // Main content
            VStack(spacing: 0) {
                // Header with export button
                HStack(alignment: .top) {
                    AnimatedHeader()
                        .staggeredAppear(index: 0)

                    Spacer()

                    // Compact Export Button
                    Button(action: exportData) {
                        HStack(spacing: Spacing.xs) {
                            Image(systemName: "arrow.up.doc.fill")
                                .font(.system(size: 12, weight: .semibold))
                            Text("Export")
                                .font(Typography.body())
                                .fontWeight(.semibold)
                        }
                        .foregroundStyle(canExport ? Color.bgPrimary : Color.textMuted)
                        .padding(.horizontal, Spacing.md)
                        .padding(.vertical, Spacing.sm)
                        .background(
                            RoundedRectangle(cornerRadius: 20, style: .continuous)
                                .fill(canExport ? Color.accent : Color.bgSecondary)
                        )
                    }
                    .disabled(!canExport || isExporting)
                    .opacity(isExporting ? 0.6 : 1.0)
                    .staggeredAppear(index: 1)
                }
                .padding(.horizontal, Spacing.lg)
                .padding(.bottom, Spacing.md)

                // Status badges - compact display
                HStack(spacing: Spacing.lg) {
                    CompactStatusBadge(
                        icon: "heart.fill",
                        title: "Health",
                        isConnected: healthKitManager.isAuthorized,
                        action: !healthKitManager.isAuthorized ? {
                            Task {
                                try? await healthKitManager.requestAuthorization()
                            }
                        } : nil
                    )

                    CompactStatusBadge(
                        icon: "folder.fill",
                        title: vaultManager.vaultURL != nil ? vaultManager.vaultName : "Vault",
                        isConnected: vaultManager.vaultURL != nil,
                        action: {
                            showFolderPicker = true
                        }
                    )
                }
                .staggeredAppear(index: 2)
                .padding(.horizontal, Spacing.lg)
                .padding(.bottom, Spacing.md)

                // Scrollable content area
                ScrollView {
                    VStack(spacing: Spacing.md) {
                        // Export Configuration Section
                        SettingsSection(title: "EXPORT CONFIGURATION", icon: "calendar") {
                            VStack(spacing: Spacing.md) {
                                // Subfolder input
                                VStack(alignment: .leading, spacing: Spacing.xs) {
                                    Text("Subfolder")
                                        .font(Typography.caption())
                                        .foregroundStyle(Color.textMuted)

                                    HStack(spacing: Spacing.sm) {
                                        Image(systemName: "folder")
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundStyle(Color.textMuted)

                                        TextField("Health", text: $vaultManager.healthSubfolder)
                                            .font(Typography.bodyMono())
                                            .foregroundStyle(Color.textPrimary)
                                            .textInputAutocapitalization(.never)
                                            .autocorrectionDisabled()
                                            .onChange(of: vaultManager.healthSubfolder) { _, _ in
                                                vaultManager.saveSubfolderSetting()
                                            }
                                    }
                                    .padding(.horizontal, Spacing.sm)
                                    .padding(.vertical, Spacing.xs)
                                    .background(
                                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                                            .fill(Color.bgSecondary)
                                    )
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                                            .strokeBorder(Color.borderDefault, lineWidth: 1)
                                    )
                                }

                                // Date range
                                HStack(spacing: Spacing.sm) {
                                    VStack(alignment: .leading, spacing: Spacing.xs) {
                                        Text("Start Date")
                                            .font(Typography.caption())
                                            .foregroundStyle(Color.textMuted)

                                        Button(action: { showStartDatePicker = true }) {
                                            HStack {
                                                Text(formatDateForButton(startDate))
                                                    .font(Typography.bodyMono())
                                                    .foregroundStyle(Color.textPrimary)
                                                Spacer()
                                                Image(systemName: "calendar")
                                                    .font(.system(size: 12, weight: .medium))
                                                    .foregroundStyle(Color.textMuted)
                                            }
                                            .padding(.horizontal, Spacing.sm)
                                            .padding(.vertical, Spacing.xs + 2)
                                            .background(
                                                RoundedRectangle(cornerRadius: 8, style: .continuous)
                                                    .fill(Color.bgSecondary)
                                            )
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 8, style: .continuous)
                                                    .strokeBorder(Color.borderDefault, lineWidth: 1)
                                            )
                                        }
                                    }

                                    VStack(alignment: .leading, spacing: Spacing.xs) {
                                        Text("End Date")
                                            .font(Typography.caption())
                                            .foregroundStyle(Color.textMuted)

                                        Button(action: { showEndDatePicker = true }) {
                                            HStack {
                                                Text(formatDateForButton(endDate))
                                                    .font(Typography.bodyMono())
                                                    .foregroundStyle(Color.textPrimary)
                                                Spacer()
                                                Image(systemName: "calendar")
                                                    .font(.system(size: 12, weight: .medium))
                                                    .foregroundStyle(Color.textMuted)
                                            }
                                            .padding(.horizontal, Spacing.sm)
                                            .padding(.vertical, Spacing.xs + 2)
                                            .background(
                                                RoundedRectangle(cornerRadius: 8, style: .continuous)
                                                    .fill(Color.bgSecondary)
                                            )
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 8, style: .continuous)
                                                    .strokeBorder(Color.borderDefault, lineWidth: 1)
                                            )
                                        }
                                    }
                                }

                                // Export path preview
                                HStack(spacing: Spacing.xs) {
                                    Image(systemName: "arrow.right.circle.fill")
                                        .font(.system(size: 11, weight: .medium))
                                        .foregroundStyle(Color.accent)

                                    Text(exportPath)
                                        .font(Typography.caption())
                                        .foregroundStyle(Color.textSecondary)
                                        .lineLimit(2)
                                }
                                .padding(.horizontal, Spacing.sm)
                                .padding(.vertical, Spacing.xs)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(
                                    RoundedRectangle(cornerRadius: 6, style: .continuous)
                                        .fill(Color.accentSubtle)
                                )
                            }
                        }

                        // Data Types Section
                        SettingsSection(title: "DATA TYPES", icon: "heart.text.square") {
                            VStack(spacing: Spacing.xs) {
                                ToggleRow(title: "Sleep", isOn: $advancedSettings.dataTypes.sleep)
                                ToggleRow(title: "Activity", isOn: $advancedSettings.dataTypes.activity)
                                ToggleRow(title: "Vitals", isOn: $advancedSettings.dataTypes.vitals)
                                ToggleRow(title: "Body Measurements", isOn: $advancedSettings.dataTypes.body)
                                ToggleRow(title: "Workouts", isOn: $advancedSettings.dataTypes.workouts)

                                if !advancedSettings.dataTypes.hasAnySelected {
                                    Text("At least one data type must be selected")
                                        .font(Typography.caption())
                                        .foregroundColor(.red)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .padding(.top, Spacing.xs)
                                }
                            }
                        }

                        // Export Format Section
                        SettingsSection(title: "EXPORT FORMAT", icon: "doc.text") {
                            VStack(spacing: Spacing.md) {
                                Picker("Format", selection: $advancedSettings.exportFormat) {
                                    ForEach(ExportFormat.allCases, id: \.self) { format in
                                        Text(format.rawValue).tag(format)
                                    }
                                }
                                .pickerStyle(.segmented)
                                .tint(.accent)

                                if advancedSettings.exportFormat == .markdown {
                                    VStack(spacing: Spacing.xs) {
                                        ToggleRow(title: "Include Frontmatter", isOn: $advancedSettings.includeMetadata)
                                        ToggleRow(title: "Group by Category", isOn: $advancedSettings.groupByCategory)
                                    }
                                }

                                Text(formatDescription)
                                    .font(Typography.caption())
                                    .foregroundColor(Color.textMuted)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        }

                        // Schedule Section
                        SettingsSection(title: "SCHEDULE", icon: "clock") {
                            VStack(spacing: Spacing.md) {
                                ToggleRow(
                                    title: "Enable Automatic Exports",
                                    isOn: Binding(
                                        get: { schedulingManager.schedule.isEnabled },
                                        set: { newValue in
                                            var newSchedule = schedulingManager.schedule
                                            newSchedule.isEnabled = newValue
                                            schedulingManager.schedule = newSchedule
                                        }
                                    )
                                )

                                if schedulingManager.schedule.isEnabled {
                                    VStack(spacing: Spacing.sm) {
                                        // Frequency picker
                                        HStack {
                                            Text("Frequency")
                                                .font(Typography.body())
                                                .foregroundStyle(Color.textPrimary)

                                            Spacer()

                                            Picker("", selection: Binding(
                                                get: { schedulingManager.schedule.frequency },
                                                set: { newValue in
                                                    var newSchedule = schedulingManager.schedule
                                                    newSchedule.frequency = newValue
                                                    schedulingManager.schedule = newSchedule
                                                }
                                            )) {
                                                ForEach(ScheduleFrequency.allCases, id: \.self) { freq in
                                                    Text(freq.description).tag(freq)
                                                }
                                            }
                                            .pickerStyle(.menu)
                                            .tint(Color.accent)
                                        }

                                        // Time picker
                                        VStack(alignment: .leading, spacing: Spacing.xs) {
                                            Text("Time")
                                                .font(Typography.body())
                                                .foregroundStyle(Color.textPrimary)

                                            HStack(spacing: Spacing.xs) {
                                                // Hour
                                                Menu {
                                                    ForEach(0..<24, id: \.self) { hour in
                                                        Button(String(format: "%02d", hour)) {
                                                            var newSchedule = schedulingManager.schedule
                                                            newSchedule.preferredHour = hour
                                                            schedulingManager.schedule = newSchedule
                                                        }
                                                    }
                                                } label: {
                                                    HStack {
                                                        Text(String(format: "%02d", schedulingManager.schedule.preferredHour))
                                                            .font(Typography.bodyMono())
                                                            .foregroundStyle(Color.textPrimary)
                                                        Image(systemName: "chevron.up.chevron.down")
                                                            .font(.system(size: 10, weight: .medium))
                                                            .foregroundStyle(Color.textMuted)
                                                    }
                                                    .padding(.horizontal, Spacing.sm)
                                                    .padding(.vertical, Spacing.xs)
                                                    .background(
                                                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                                                            .fill(Color.bgSecondary)
                                                    )
                                                    .overlay(
                                                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                                                            .strokeBorder(Color.borderDefault, lineWidth: 1)
                                                    )
                                                }

                                                Text(":")
                                                    .font(Typography.body())
                                                    .foregroundStyle(Color.textSecondary)

                                                // Minute
                                                Menu {
                                                    ForEach(Array(stride(from: 0, to: 60, by: 5)), id: \.self) { minute in
                                                        Button(String(format: "%02d", minute)) {
                                                            var newSchedule = schedulingManager.schedule
                                                            newSchedule.preferredMinute = minute
                                                            schedulingManager.schedule = newSchedule
                                                        }
                                                    }
                                                } label: {
                                                    HStack {
                                                        Text(String(format: "%02d", schedulingManager.schedule.preferredMinute))
                                                            .font(Typography.bodyMono())
                                                            .foregroundStyle(Color.textPrimary)
                                                        Image(systemName: "chevron.up.chevron.down")
                                                            .font(.system(size: 10, weight: .medium))
                                                            .foregroundStyle(Color.textMuted)
                                                    }
                                                    .padding(.horizontal, Spacing.sm)
                                                    .padding(.vertical, Spacing.xs)
                                                    .background(
                                                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                                                            .fill(Color.bgSecondary)
                                                    )
                                                    .overlay(
                                                        RoundedRectangle(cornerRadius: 8, style: .continuous)
                                                            .strokeBorder(Color.borderDefault, lineWidth: 1)
                                                    )
                                                }

                                                Spacer()
                                            }
                                        }

                                        // Info text
                                        VStack(alignment: .leading, spacing: Spacing.xs) {
                                            if let nextExport = schedulingManager.getNextExportDescription() {
                                                Text("Next export: \(nextExport)")
                                                    .font(Typography.caption())
                                                    .foregroundStyle(Color.accent)
                                            }

                                            Text("iOS controls when background tasks run based on device usage patterns.")
                                                .font(Typography.caption())
                                                .foregroundStyle(Color.textMuted)
                                        }
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    }
                                }
                            }
                        }
                        // Export progress indicator
                        if isExporting && !exportStatusMessage.isEmpty {
                            VStack(spacing: Spacing.xs) {
                                Text(exportStatusMessage)
                                    .font(Typography.caption())
                                    .foregroundStyle(Color.textSecondary)

                                ProgressView(value: exportProgress)
                                    .tint(.accent)
                                    .frame(maxWidth: .infinity)
                            }
                            .padding(.top, Spacing.md)
                        }

                        // Export status feedback
                        if let status = vaultManager.lastExportStatus {
                            ExportStatusBadge(
                                status: status.starts(with: "Exported")
                                    ? .success(status)
                                    : .error(status)
                            )
                            .padding(.top, Spacing.md)
                        }
                    }
                    .padding(.horizontal, Spacing.lg)
                    .padding(.bottom, Spacing.xl)
                }
            }
        }
        .preferredColorScheme(.dark)
        .sheet(isPresented: $showFolderPicker) {
            FolderPicker { url in
                vaultManager.setVaultFolder(url)
            }
            .presentationDetents([.large])
            .presentationDragIndicator(.visible)
        }
        .sheet(isPresented: $showStartDatePicker) {
            DatePickerSheet(
                title: "Start Date",
                date: $startDate,
                range: ...endDate
            )
        }
        .sheet(isPresented: $showEndDatePicker) {
            DatePickerSheet(
                title: "End Date",
                date: $endDate,
                range: startDate...Date()
            )
        }
        .alert("Error", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
        .task {
            // Request health authorization on launch if not already authorized
            if healthKitManager.isHealthDataAvailable && !healthKitManager.isAuthorized {
                do {
                    try await healthKitManager.requestAuthorization()
                } catch {
                    // Silent fail on launch - user can tap Connect button
                }
            }
        }
    }

    // MARK: - Computed Properties

    private var canExport: Bool {
        healthKitManager.isAuthorized && vaultManager.vaultURL != nil
    }

    private var selectedDataTypesText: String {
        var types: [String] = []
        if advancedSettings.dataTypes.sleep { types.append("Sleep") }
        if advancedSettings.dataTypes.activity { types.append("Activity") }
        if advancedSettings.dataTypes.vitals { types.append("Vitals") }
        if advancedSettings.dataTypes.body { types.append("Body") }
        if advancedSettings.dataTypes.workouts { types.append("Workouts") }

        if types.count == 5 {
            return "All data types"
        } else if types.isEmpty {
            return "No data types"
        } else {
            return types.joined(separator: ", ")
        }
    }

    private var exportPath: String {
        let subfolder = vaultManager.healthSubfolder.isEmpty ? "" : vaultManager.healthSubfolder + "/"
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"

        let dayCount = Calendar.current.dateComponents([.day], from: startDate, to: endDate).day ?? 0

        if dayCount == 0 {
            return "\(vaultManager.vaultName)/\(subfolder)\(dateFormatter.string(from: startDate)).\(advancedSettings.exportFormat.fileExtension)"
        } else {
            return "\(vaultManager.vaultName)/\(subfolder)\(dateFormatter.string(from: startDate)).\(advancedSettings.exportFormat.fileExtension) to \(dateFormatter.string(from: endDate)).\(advancedSettings.exportFormat.fileExtension) (\(dayCount + 1) files)"
        }
    }

    private var formatDescription: String {
        switch advancedSettings.exportFormat {
        case .markdown:
            return "Human-readable format perfect for Obsidian. Includes headers, lists, and frontmatter metadata."
        case .obsidianBases:
            return "Optimized for Obsidian Bases. All metrics are stored as frontmatter properties for querying, filtering, and sorting."
        case .json:
            return "Structured data format ideal for programmatic access and data analysis."
        case .csv:
            return "Spreadsheet-compatible format. Each data point becomes a row with date, category, metric, and value columns."
        }
    }

    private func formatDateForButton(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d, yyyy"
        return formatter.string(from: date)
    }

    // MARK: - Export

    private func exportData() {
        isExporting = true
        exportProgress = 0.0
        exportStatusMessage = ""

        Task {
            defer {
                isExporting = false
                exportProgress = 0.0
            }

            // Calculate all dates in the range
            var dates: [Date] = []
            var currentDate = startDate
            let calendar = Calendar.current

            // Normalize dates to start of day
            currentDate = calendar.startOfDay(for: currentDate)
            let normalizedEndDate = calendar.startOfDay(for: endDate)
            let normalizedStartDate = currentDate

            while currentDate <= normalizedEndDate {
                dates.append(currentDate)
                guard let nextDate = calendar.date(byAdding: .day, value: 1, to: currentDate) else {
                    break
                }
                currentDate = nextDate
            }

            let totalDays = dates.count
            var successCount = 0
            var failedDateDetails: [FailedDateDetail] = []
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"

            // Export data for each date
            for (index, date) in dates.enumerated() {
                exportStatusMessage = "Exporting \(dateFormatter.string(from: date))... (\(index + 1)/\(totalDays))"

                do {
                    let healthData = try await healthKitManager.fetchHealthData(for: date)
                    try await vaultManager.exportHealthData(healthData, settings: advancedSettings)
                    successCount += 1
                } catch let error as ExportError {
                    let reason: ExportFailureReason
                    switch error {
                    case .noVaultSelected:
                        reason = .noVaultSelected
                    case .noHealthData:
                        reason = .noHealthData
                    case .accessDenied:
                        reason = .accessDenied
                    }
                    failedDateDetails.append(FailedDateDetail(date: date, reason: reason))
                } catch {
                    failedDateDetails.append(FailedDateDetail(date: date, reason: .unknown))
                }

                exportProgress = Double(index + 1) / Double(totalDays)
            }

            // Update final status and record history
            if failedDateDetails.isEmpty {
                exportStatusMessage = "Successfully exported \(successCount) file\(successCount == 1 ? "" : "s")"
                vaultManager.lastExportStatus = "Exported \(successCount) file\(successCount == 1 ? "" : "s")"

                exportHistory.recordSuccess(
                    source: .manual,
                    dateRangeStart: normalizedStartDate,
                    dateRangeEnd: normalizedEndDate,
                    successCount: successCount,
                    totalCount: totalDays
                )
            } else if successCount > 0 {
                // Partial success
                let failedDatesStr = failedDateDetails.map { $0.dateString }.joined(separator: ", ")
                exportStatusMessage = "Exported \(successCount)/\(totalDays) files. Failed: \(failedDatesStr)"
                vaultManager.lastExportStatus = "Partial export: \(successCount)/\(totalDays) succeeded"

                exportHistory.recordSuccess(
                    source: .manual,
                    dateRangeStart: normalizedStartDate,
                    dateRangeEnd: normalizedEndDate,
                    successCount: successCount,
                    totalCount: totalDays,
                    failedDateDetails: failedDateDetails
                )
            } else {
                // Complete failure
                let primaryReason = failedDateDetails.first?.reason ?? .unknown
                exportStatusMessage = "Export failed: \(primaryReason.shortDescription)"
                vaultManager.lastExportStatus = primaryReason.shortDescription

                exportHistory.recordFailure(
                    source: .manual,
                    dateRangeStart: normalizedStartDate,
                    dateRangeEnd: normalizedEndDate,
                    reason: primaryReason,
                    successCount: 0,
                    totalCount: totalDays,
                    failedDateDetails: failedDateDetails
                )

                errorMessage = primaryReason.detailedDescription
                showError = true
            }
        }
    }
}

// MARK: - Helper Components

struct SettingsSection<Content: View>: View {
    let title: String
    let icon: String
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            HStack(spacing: Spacing.xs) {
                Image(systemName: icon)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(Color.accent)

                Text(title)
                    .font(Typography.label())
                    .foregroundStyle(Color.textMuted)
                    .tracking(1)
            }
            .padding(.horizontal, Spacing.sm)

            VStack(spacing: Spacing.sm) {
                content()
            }
            .padding(Spacing.md)
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(Color.bgSecondary.opacity(0.5))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .strokeBorder(Color.borderDefault, lineWidth: 1)
            )
        }
    }
}

struct ToggleRow: View {
    let title: String
    @Binding var isOn: Bool

    var body: some View {
        HStack {
            Text(title)
                .font(Typography.body())
                .foregroundStyle(Color.textPrimary)

            Spacer()

            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(Color.accent)
        }
    }
}

struct DatePickerSheet: View {
    let title: String
    @Binding var date: Date
    let range: PartialRangeThrough<Date>
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: Spacing.lg) {
                DatePicker(
                    selection: $date,
                    in: range,
                    displayedComponents: .date
                ) {
                    EmptyView()
                }
                .datePickerStyle(.graphical)
                .tint(.accent)
                .colorScheme(.dark)
                .padding(Spacing.md)
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color.bgSecondary)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .strokeBorder(Color.borderDefault, lineWidth: 1)
                )

                Spacer()
            }
            .padding(Spacing.lg)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.bgPrimary)
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                    .foregroundStyle(Color.accent)
                    .fontWeight(.semibold)
                }
            }
        }
        .presentationDetents([.medium])
        .presentationDragIndicator(.visible)
    }
}

extension DatePickerSheet {
    init(title: String, date: Binding<Date>, range: ClosedRange<Date>) {
        self.title = title
        self._date = date
        self.range = ...range.upperBound
    }
}

#Preview {
    ContentView()
}
