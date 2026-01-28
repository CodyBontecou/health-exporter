import SwiftUI

struct ExportModal: View {
    @Binding var startDate: Date
    @Binding var endDate: Date
    @Binding var subfolder: String
    let vaultName: String
    let onExport: () -> Void
    let onSubfolderChange: () -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ZStack {
                // Background
                Color.bgPrimary.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: Spacing.lg) {
                        // Subfolder input with Liquid Glass styling
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            Text("SUBFOLDER")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundStyle(Color.textMuted)
                                .tracking(2)

                            HStack(spacing: Spacing.sm) {
                                Image(systemName: "folder")
                                    .font(.system(size: 15, weight: .medium))
                                    .foregroundStyle(Color.accent)

                                TextField("Health", text: $subfolder)
                                    .font(Typography.bodyMono())
                                    .foregroundStyle(Color.textPrimary)
                                    .textInputAutocapitalization(.never)
                                    .autocorrectionDisabled()
                                    .onChange(of: subfolder) { _, _ in
                                        onSubfolderChange()
                                    }
                            }
                            .padding(.horizontal, Spacing.md)
                            .padding(.vertical, Spacing.md)
                            .background(
                                RoundedRectangle(cornerRadius: 16, style: .continuous)
                                    .fill(.ultraThinMaterial)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 16, style: .continuous)
                                    .strokeBorder(Color.white.opacity(0.15), lineWidth: 1)
                            )
                        }

                        // Date range pickers with Liquid Glass styling
                        VStack(alignment: .leading, spacing: Spacing.lg) {
                            // Start Date
                            VStack(alignment: .leading, spacing: Spacing.sm) {
                                Text("START DATE")
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundStyle(Color.textMuted)
                                    .tracking(2)

                                DatePicker(
                                    selection: $startDate,
                                    in: ...endDate,
                                    displayedComponents: .date
                                ) {
                                    EmptyView()
                                }
                                .datePickerStyle(.graphical)
                                .tint(.accent)
                                .colorScheme(.dark)
                                .padding(Spacing.md)
                                .background(
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .fill(.ultraThinMaterial)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .strokeBorder(Color.white.opacity(0.15), lineWidth: 1)
                                )
                                .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
                            }

                            // End Date
                            VStack(alignment: .leading, spacing: Spacing.sm) {
                                Text("END DATE")
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundStyle(Color.textMuted)
                                    .tracking(2)

                                DatePicker(
                                    selection: $endDate,
                                    in: startDate...Date(),
                                    displayedComponents: .date
                                ) {
                                    EmptyView()
                                }
                                .datePickerStyle(.graphical)
                                .tint(.accent)
                                .colorScheme(.dark)
                                .padding(Spacing.md)
                                .background(
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .fill(.ultraThinMaterial)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                                        .strokeBorder(Color.white.opacity(0.15), lineWidth: 1)
                                )
                                .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
                            }
                        }

                        // Export path preview with Liquid Glass styling
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            Text("EXPORT TO")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundStyle(Color.textMuted)
                                .tracking(2)

                            HStack(spacing: Spacing.sm) {
                                ZStack {
                                    Image(systemName: "arrow.right.circle.fill")
                                        .font(.system(size: 16, weight: .medium))
                                        .foregroundStyle(Color.accent)
                                        .blur(radius: 4)
                                        .opacity(0.5)

                                    Image(systemName: "arrow.right.circle.fill")
                                        .font(.system(size: 16, weight: .medium))
                                        .foregroundStyle(Color.accent)
                                }

                                Text(exportPath)
                                    .font(.system(size: 14, weight: .medium, design: .monospaced))
                                    .foregroundStyle(Color.textPrimary)
                                    .lineLimit(2)
                            }
                            .padding(.horizontal, Spacing.md)
                            .padding(.vertical, Spacing.md)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                RoundedRectangle(cornerRadius: 12, style: .continuous)
                                    .fill(.ultraThinMaterial)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 12, style: .continuous)
                                    .strokeBorder(Color.accent.opacity(0.3), lineWidth: 1)
                            )
                        }

                        Spacer()
                    }
                    .padding(Spacing.lg)
                }
            }
            .navigationTitle("Export Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundStyle(Color.textSecondary)
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Export") {
                        dismiss()
                        onExport()
                    }
                    .foregroundStyle(Color.accent)
                    .fontWeight(.semibold)
                }
            }
        }
        .preferredColorScheme(.dark)
    }

    private var exportPath: String {
        let subfolder = subfolder.isEmpty ? "" : subfolder + "/"
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"

        let dayCount = Calendar.current.dateComponents([.day], from: startDate, to: endDate).day ?? 0

        if dayCount == 0 {
            return "\(vaultName)/\(subfolder)\(dateFormatter.string(from: startDate)).md"
        } else {
            return "\(vaultName)/\(subfolder)\(dateFormatter.string(from: startDate)).md to \(dateFormatter.string(from: endDate)).md (\(dayCount + 1) files)"
        }
    }
}
