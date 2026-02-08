import Foundation
import HealthKit

// MARK: - Sleep Data

struct SleepData {
    var totalDuration: TimeInterval = 0
    var deepSleep: TimeInterval = 0
    var remSleep: TimeInterval = 0
    var coreSleep: TimeInterval = 0
    var awakeTime: TimeInterval = 0
    var inBedTime: TimeInterval = 0

    var hasData: Bool {
        totalDuration > 0 || deepSleep > 0 || remSleep > 0 || coreSleep > 0 || awakeTime > 0 || inBedTime > 0
    }
}

// MARK: - Activity Data

struct ActivityData {
    var steps: Int?
    var activeCalories: Double?
    var exerciseMinutes: Double?
    var flightsClimbed: Int?
    var walkingRunningDistance: Double? // in meters
    var standHours: Int?
    var basalEnergyBurned: Double?
    var cyclingDistance: Double? // in meters
    var swimmingDistance: Double? // in meters
    var swimmingStrokes: Int?
    var pushCount: Int? // wheelchair users

    var hasData: Bool {
        steps != nil || activeCalories != nil || exerciseMinutes != nil ||
        flightsClimbed != nil || walkingRunningDistance != nil ||
        standHours != nil || basalEnergyBurned != nil ||
        cyclingDistance != nil || swimmingDistance != nil ||
        swimmingStrokes != nil || pushCount != nil
    }
}

// MARK: - Heart Data

struct HeartData {
    var restingHeartRate: Double?
    var walkingHeartRateAverage: Double?
    var averageHeartRate: Double?
    var hrv: Double? // in milliseconds
    var heartRateMin: Double?
    var heartRateMax: Double?

    var hasData: Bool {
        restingHeartRate != nil || walkingHeartRateAverage != nil ||
        averageHeartRate != nil || hrv != nil ||
        heartRateMin != nil || heartRateMax != nil
    }
}

// MARK: - Vitals Data

struct VitalsData {
    // Respiratory Rate (daily aggregates)
    var respiratoryRateAvg: Double?
    var respiratoryRateMin: Double?
    var respiratoryRateMax: Double?
    
    // Blood Oxygen / SpO2 (daily aggregates)
    var bloodOxygenAvg: Double? // as percentage (0-1)
    var bloodOxygenMin: Double?
    var bloodOxygenMax: Double?
    
    // Body Temperature (daily aggregates)
    var bodyTemperatureAvg: Double? // in Celsius
    var bodyTemperatureMin: Double?
    var bodyTemperatureMax: Double?
    
    // Blood Pressure (daily aggregates)
    var bloodPressureSystolicAvg: Double?
    var bloodPressureSystolicMin: Double?
    var bloodPressureSystolicMax: Double?
    var bloodPressureDiastolicAvg: Double?
    var bloodPressureDiastolicMin: Double?
    var bloodPressureDiastolicMax: Double?
    
    // Blood Glucose (daily aggregates)
    var bloodGlucoseAvg: Double? // mg/dL
    var bloodGlucoseMin: Double?
    var bloodGlucoseMax: Double?

    var hasData: Bool {
        respiratoryRateAvg != nil || bloodOxygenAvg != nil ||
        bodyTemperatureAvg != nil || bloodPressureSystolicAvg != nil ||
        bloodPressureDiastolicAvg != nil || bloodGlucoseAvg != nil
    }
    
    // Convenience properties for backward compatibility / simple access
    var respiratoryRate: Double? { respiratoryRateAvg }
    var bloodOxygen: Double? { bloodOxygenAvg }
    var bodyTemperature: Double? { bodyTemperatureAvg }
    var bloodPressureSystolic: Double? { bloodPressureSystolicAvg }
    var bloodPressureDiastolic: Double? { bloodPressureDiastolicAvg }
    var bloodGlucose: Double? { bloodGlucoseAvg }
}

// MARK: - Body Data

struct BodyData {
    var weight: Double? // in kg
    var bodyFatPercentage: Double?
    var height: Double? // in meters
    var bmi: Double?
    var leanBodyMass: Double? // in kg
    var waistCircumference: Double? // in meters

    var hasData: Bool {
        weight != nil || bodyFatPercentage != nil || height != nil ||
        bmi != nil || leanBodyMass != nil || waistCircumference != nil
    }
}

// MARK: - Nutrition Data

struct NutritionData {
    var dietaryEnergy: Double? // kcal
    var protein: Double? // grams
    var carbohydrates: Double? // grams
    var fat: Double? // grams
    var fiber: Double? // grams
    var sugar: Double? // grams
    var sodium: Double? // mg
    var water: Double? // liters
    var caffeine: Double? // mg
    var cholesterol: Double? // mg
    var saturatedFat: Double? // grams

    var hasData: Bool {
        dietaryEnergy != nil || protein != nil || carbohydrates != nil ||
        fat != nil || fiber != nil || sugar != nil || sodium != nil ||
        water != nil || caffeine != nil || cholesterol != nil || saturatedFat != nil
    }
}

// MARK: - Mindfulness Data

struct MindfulnessData {
    var mindfulMinutes: Double?
    var mindfulSessions: Int?
    var stateOfMind: [StateOfMindEntry] = []

    var hasData: Bool {
        mindfulMinutes != nil || mindfulSessions != nil || !stateOfMind.isEmpty
    }
    
    // Computed properties for State of Mind analysis
    var dailyMoods: [StateOfMindEntry] {
        stateOfMind.filter { $0.kind == .dailyMood }
    }
    
    var momentaryEmotions: [StateOfMindEntry] {
        stateOfMind.filter { $0.kind == .momentaryEmotion }
    }
    
    var averageValence: Double? {
        guard !stateOfMind.isEmpty else { return nil }
        let total = stateOfMind.reduce(0.0) { $0 + $1.valence }
        return total / Double(stateOfMind.count)
    }
    
    var averageDailyMoodValence: Double? {
        guard !dailyMoods.isEmpty else { return nil }
        let total = dailyMoods.reduce(0.0) { $0 + $1.valence }
        return total / Double(dailyMoods.count)
    }
    
    var allLabels: [String] {
        Array(Set(stateOfMind.flatMap { $0.labels })).sorted()
    }
    
    var allAssociations: [String] {
        Array(Set(stateOfMind.flatMap { $0.associations })).sorted()
    }
}

// MARK: - State of Mind Entry

struct StateOfMindEntry: Identifiable {
    let id = UUID()
    let timestamp: Date
    let kind: StateOfMindKind
    let valence: Double  // -1.0 (very unpleasant) to 1.0 (very pleasant)
    let labels: [String]  // Emotion/mood labels like "Happy", "Anxious", etc.
    let associations: [String]  // Context like "Work", "Exercise", "Family", etc.
    
    enum StateOfMindKind: String {
        case momentaryEmotion = "Momentary Emotion"
        case dailyMood = "Daily Mood"
    }
    
    /// Converts valence (-1 to 1) to a human-readable description
    var valenceDescription: String {
        switch valence {
        case -1.0 ..< -0.6:
            return "Very Unpleasant"
        case -0.6 ..< -0.2:
            return "Unpleasant"
        case -0.2 ..< 0.2:
            return "Neutral"
        case 0.2 ..< 0.6:
            return "Pleasant"
        case 0.6 ... 1.0:
            return "Very Pleasant"
        default:
            return "Unknown"
        }
    }
    
    /// Converts valence to a percentage (0-100)
    var valencePercent: Int {
        Int(((valence + 1.0) / 2.0) * 100)
    }
    
    /// Returns an emoji representation of the valence
    var valenceEmoji: String {
        switch valence {
        case -1.0 ..< -0.6:
            return "😢"
        case -0.6 ..< -0.2:
            return "😔"
        case -0.2 ..< 0.2:
            return "😐"
        case 0.2 ..< 0.6:
            return "🙂"
        case 0.6 ... 1.0:
            return "😊"
        default:
            return "❓"
        }
    }
}

// MARK: - Mobility Data

struct MobilityData {
    var walkingSpeed: Double? // m/s
    var walkingStepLength: Double? // meters
    var walkingDoubleSupportPercentage: Double?
    var walkingAsymmetryPercentage: Double?
    var stairAscentSpeed: Double? // m/s
    var stairDescentSpeed: Double? // m/s
    var sixMinuteWalkDistance: Double? // meters

    var hasData: Bool {
        walkingSpeed != nil || walkingStepLength != nil ||
        walkingDoubleSupportPercentage != nil || walkingAsymmetryPercentage != nil ||
        stairAscentSpeed != nil || stairDescentSpeed != nil || sixMinuteWalkDistance != nil
    }
}

// MARK: - Hearing Data

struct HearingData {
    var headphoneAudioLevel: Double? // dB
    var environmentalSoundLevel: Double? // dB

    var hasData: Bool {
        headphoneAudioLevel != nil || environmentalSoundLevel != nil
    }
}

// MARK: - Workout Data

struct WorkoutData: Identifiable {
    let id = UUID()
    let workoutType: HKWorkoutActivityType
    let startTime: Date
    let duration: TimeInterval
    let calories: Double?
    let distance: Double? // in meters

    var workoutTypeName: String {
        switch workoutType {
        case .running: return "Running"
        case .walking: return "Walking"
        case .cycling: return "Cycling"
        case .swimming: return "Swimming"
        case .hiking: return "Hiking"
        case .yoga: return "Yoga"
        case .functionalStrengthTraining: return "Strength Training"
        case .traditionalStrengthTraining: return "Strength Training"
        case .coreTraining: return "Core Training"
        case .highIntensityIntervalTraining: return "HIIT"
        case .elliptical: return "Elliptical"
        case .rowing: return "Rowing"
        case .stairClimbing: return "Stair Climbing"
        case .pilates: return "Pilates"
        case .dance: return "Dance"
        case .cooldown: return "Cooldown"
        case .mixedCardio: return "Mixed Cardio"
        case .socialDance: return "Social Dance"
        case .pickleball: return "Pickleball"
        case .tennis: return "Tennis"
        case .badminton: return "Badminton"
        case .tableTennis: return "Table Tennis"
        case .golf: return "Golf"
        case .soccer: return "Soccer"
        case .basketball: return "Basketball"
        case .baseball: return "Baseball"
        case .softball: return "Softball"
        case .volleyball: return "Volleyball"
        case .americanFootball: return "American Football"
        case .rugby: return "Rugby"
        case .hockey: return "Hockey"
        case .lacrosse: return "Lacrosse"
        case .skatingSports: return "Skating"
        case .snowSports: return "Snow Sports"
        case .waterSports: return "Water Sports"
        case .martialArts: return "Martial Arts"
        case .boxing: return "Boxing"
        case .kickboxing: return "Kickboxing"
        case .wrestling: return "Wrestling"
        case .climbing: return "Climbing"
        case .jumpRope: return "Jump Rope"
        case .mindAndBody: return "Mind & Body"
        case .flexibility: return "Flexibility"
        case .other: return "Other"
        default: return "Workout"
        }
    }
}

// MARK: - Complete Health Data

struct HealthData {
    let date: Date
    var sleep: SleepData = SleepData()
    var activity: ActivityData = ActivityData()
    var heart: HeartData = HeartData()
    var vitals: VitalsData = VitalsData()
    var body: BodyData = BodyData()
    var nutrition: NutritionData = NutritionData()
    var mindfulness: MindfulnessData = MindfulnessData()
    var mobility: MobilityData = MobilityData()
    var hearing: HearingData = HearingData()
    var workouts: [WorkoutData] = []

    var hasAnyData: Bool {
        sleep.hasData || activity.hasData || heart.hasData || vitals.hasData ||
        body.hasData || nutrition.hasData || mindfulness.hasData ||
        mobility.hasData || hearing.hasData || !workouts.isEmpty
    }
}

// MARK: - Export Formats

extension HealthData {
    func export(format: ExportFormat, settings: AdvancedExportSettings) -> String {
        let filteredData = self.filtered(by: settings.dataTypes)
        let formatCustomization = settings.formatCustomization

        switch format {
        case .markdown:
            return filteredData.toMarkdown(
                includeMetadata: settings.includeMetadata,
                groupByCategory: settings.groupByCategory,
                customization: formatCustomization
            )
        case .obsidianBases:
            return filteredData.toObsidianBases(customization: formatCustomization)
        case .json:
            return filteredData.toJSON(customization: formatCustomization)
        case .csv:
            return filteredData.toCSV(customization: formatCustomization)
        }
    }

    func filtered(by dataTypes: DataTypeSelection) -> HealthData {
        var filtered = self

        if !dataTypes.sleep {
            filtered.sleep = SleepData()
        }
        if !dataTypes.activity {
            filtered.activity = ActivityData()
        }
        if !dataTypes.heart {
            filtered.heart = HeartData()
        }
        if !dataTypes.vitals {
            filtered.vitals = VitalsData()
        }
        if !dataTypes.body {
            filtered.body = BodyData()
        }
        if !dataTypes.nutrition {
            filtered.nutrition = NutritionData()
        }
        if !dataTypes.mindfulness {
            filtered.mindfulness = MindfulnessData()
        }
        if !dataTypes.mobility {
            filtered.mobility = MobilityData()
        }
        if !dataTypes.hearing {
            filtered.hearing = HearingData()
        }
        if !dataTypes.workouts {
            filtered.workouts = []
        }

        return filtered
    }
}

// MARK: - Markdown Export

extension HealthData {
    func toMarkdown(includeMetadata: Bool = true, groupByCategory: Bool = true, customization: FormatCustomization? = nil) -> String {
        let config = customization ?? FormatCustomization()
        let dateString = config.dateFormat.format(date: date)
        let converter = config.unitConverter
        let template = config.markdownTemplate
        let bullet = template.bulletStyle.rawValue
        let headerPrefix = String(repeating: "#", count: template.sectionHeaderLevel)
        
        // Emoji prefixes based on settings
        let sleepEmoji = template.useEmoji ? "😴 " : ""
        let activityEmoji = template.useEmoji ? "🏃 " : ""
        let heartEmoji = template.useEmoji ? "❤️ " : ""
        let vitalsEmoji = template.useEmoji ? "🩺 " : ""
        let bodyEmoji = template.useEmoji ? "📏 " : ""
        let nutritionEmoji = template.useEmoji ? "🍎 " : ""
        let mindfulnessEmoji = template.useEmoji ? "🧘 " : ""
        let mobilityEmoji = template.useEmoji ? "🚶 " : ""
        let hearingEmoji = template.useEmoji ? "👂 " : ""
        let workoutsEmoji = template.useEmoji ? "💪 " : ""

        var markdown = ""

        if includeMetadata {
            let fmConfig = config.frontmatterConfig
            markdown += "---\n"
            if fmConfig.includeDate {
                markdown += "\(fmConfig.customDateKey): \(dateString)\n"
            }
            if fmConfig.includeType {
                markdown += "\(fmConfig.customTypeKey): \(fmConfig.customTypeValue)\n"
            }
            // Add custom static fields
            for (key, value) in fmConfig.customFields.sorted(by: { $0.key < $1.key }) {
                markdown += "\(key): \(value)\n"
            }
            markdown += "---\n\n"
        }

        markdown += "# Health Data — \(dateString)\n"
        
        // Summary section
        if template.includeSummary {
            var summaryParts: [String] = []
            if sleep.totalDuration > 0 {
                summaryParts.append(formatDuration(sleep.totalDuration) + " sleep")
            }
            if let steps = activity.steps {
                summaryParts.append(formatNumber(steps) + " steps")
            }
            if !workouts.isEmpty {
                summaryParts.append("\(workouts.count) workout\(workouts.count > 1 ? "s" : "")")
            }
            if let avgValence = mindfulness.averageValence {
                let valencePercent = Int(((avgValence + 1.0) / 2.0) * 100)
                let moodEmoji = template.useEmoji ? (avgValence >= 0.2 ? "🙂" : avgValence <= -0.2 ? "😔" : "😐") + " " : ""
                summaryParts.append("\(moodEmoji)mood \(valencePercent)%")
            }
            if !summaryParts.isEmpty {
                markdown += "\n" + summaryParts.joined(separator: " · ") + "\n"
            }
        }

        // Sleep Section
        if sleep.hasData {
            markdown += "\n\(headerPrefix) \(sleepEmoji)Sleep\n\n"
            if sleep.totalDuration > 0 {
                markdown += "\(bullet) **Total:** \(formatDuration(sleep.totalDuration))\n"
            }
            if sleep.inBedTime > 0 {
                markdown += "\(bullet) **In Bed:** \(formatDuration(sleep.inBedTime))\n"
            }
            if sleep.deepSleep > 0 {
                markdown += "\(bullet) **Deep:** \(formatDuration(sleep.deepSleep))\n"
            }
            if sleep.remSleep > 0 {
                markdown += "\(bullet) **REM:** \(formatDuration(sleep.remSleep))\n"
            }
            if sleep.coreSleep > 0 {
                markdown += "\(bullet) **Core:** \(formatDuration(sleep.coreSleep))\n"
            }
            if sleep.awakeTime > 0 {
                markdown += "\(bullet) **Awake:** \(formatDuration(sleep.awakeTime))\n"
            }
        }

        // Activity Section
        if activity.hasData {
            markdown += "\n\(headerPrefix) \(activityEmoji)Activity\n\n"
            if let steps = activity.steps {
                markdown += "\(bullet) **Steps:** \(formatNumber(steps))\n"
            }
            if let calories = activity.activeCalories {
                markdown += "\(bullet) **Active Calories:** \(formatNumber(Int(calories))) kcal\n"
            }
            if let basal = activity.basalEnergyBurned {
                markdown += "\(bullet) **Basal Energy:** \(formatNumber(Int(basal))) kcal\n"
            }
            if let exercise = activity.exerciseMinutes {
                markdown += "\(bullet) **Exercise:** \(Int(exercise)) min\n"
            }
            if let standHours = activity.standHours {
                markdown += "\(bullet) **Stand Hours:** \(standHours)\n"
            }
            if let flights = activity.flightsClimbed {
                markdown += "\(bullet) **Flights Climbed:** \(flights)\n"
            }
            if let distance = activity.walkingRunningDistance {
                markdown += "\(bullet) **Walking/Running Distance:** \(converter.formatDistance(distance))\n"
            }
            if let cycling = activity.cyclingDistance {
                markdown += "\(bullet) **Cycling Distance:** \(converter.formatDistance(cycling))\n"
            }
            if let swimming = activity.swimmingDistance {
                markdown += "\(bullet) **Swimming Distance:** \(converter.formatDistance(swimming))\n"
            }
            if let strokes = activity.swimmingStrokes {
                markdown += "\(bullet) **Swimming Strokes:** \(formatNumber(strokes))\n"
            }
            if let pushes = activity.pushCount {
                markdown += "\(bullet) **Wheelchair Pushes:** \(formatNumber(pushes))\n"
            }
        }

        // Heart Section
        if heart.hasData {
            markdown += "\n\(headerPrefix) \(heartEmoji)Heart\n\n"
            if let hr = heart.restingHeartRate {
                markdown += "\(bullet) **Resting HR:** \(Int(hr)) bpm\n"
            }
            if let walkingHR = heart.walkingHeartRateAverage {
                markdown += "\(bullet) **Walking HR Average:** \(Int(walkingHR)) bpm\n"
            }
            if let avgHR = heart.averageHeartRate {
                markdown += "\(bullet) **Average HR:** \(Int(avgHR)) bpm\n"
            }
            if let minHR = heart.heartRateMin {
                markdown += "\(bullet) **Min HR:** \(Int(minHR)) bpm\n"
            }
            if let maxHR = heart.heartRateMax {
                markdown += "\(bullet) **Max HR:** \(Int(maxHR)) bpm\n"
            }
            if let hrv = heart.hrv {
                markdown += "\(bullet) **HRV:** \(String(format: "%.1f", hrv)) ms\n"
            }
        }

        // Vitals Section
        if vitals.hasData {
            markdown += "\n\(headerPrefix) \(vitalsEmoji)Vitals\n\n"
            
            // Respiratory Rate
            if let rrAvg = vitals.respiratoryRateAvg {
                var rrStr = "\(bullet) **Respiratory Rate:** \(String(format: "%.1f", rrAvg)) breaths/min"
                if let rrMin = vitals.respiratoryRateMin, let rrMax = vitals.respiratoryRateMax, rrMin != rrMax {
                    rrStr += " (range: \(String(format: "%.1f", rrMin))–\(String(format: "%.1f", rrMax)))"
                }
                markdown += rrStr + "\n"
            }
            
            // Blood Oxygen / SpO2
            if let spo2Avg = vitals.bloodOxygenAvg {
                var spo2Str = "\(bullet) **SpO2:** \(Int(spo2Avg * 100))%"
                if let spo2Min = vitals.bloodOxygenMin, let spo2Max = vitals.bloodOxygenMax, spo2Min != spo2Max {
                    spo2Str += " (range: \(Int(spo2Min * 100))%–\(Int(spo2Max * 100))%)"
                }
                markdown += spo2Str + "\n"
            }
            
            // Body Temperature
            if let tempAvg = vitals.bodyTemperatureAvg {
                var tempStr = "\(bullet) **Body Temperature:** \(converter.formatTemperature(tempAvg))"
                if let tempMin = vitals.bodyTemperatureMin, let tempMax = vitals.bodyTemperatureMax, tempMin != tempMax {
                    tempStr += " (range: \(converter.formatTemperature(tempMin))–\(converter.formatTemperature(tempMax)))"
                }
                markdown += tempStr + "\n"
            }
            
            // Blood Pressure
            if let systolicAvg = vitals.bloodPressureSystolicAvg, let diastolicAvg = vitals.bloodPressureDiastolicAvg {
                var bpStr = "\(bullet) **Blood Pressure:** \(Int(systolicAvg))/\(Int(diastolicAvg)) mmHg"
                if let sysMin = vitals.bloodPressureSystolicMin, let sysMax = vitals.bloodPressureSystolicMax,
                   let diaMin = vitals.bloodPressureDiastolicMin, let diaMax = vitals.bloodPressureDiastolicMax,
                   (sysMin != sysMax || diaMin != diaMax) {
                    bpStr += " (range: \(Int(sysMin))/\(Int(diaMin))–\(Int(sysMax))/\(Int(diaMax)))"
                }
                markdown += bpStr + "\n"
            }
            
            // Blood Glucose
            if let glucoseAvg = vitals.bloodGlucoseAvg {
                var glucoseStr = "\(bullet) **Blood Glucose:** \(String(format: "%.1f", glucoseAvg)) mg/dL"
                if let glucoseMin = vitals.bloodGlucoseMin, let glucoseMax = vitals.bloodGlucoseMax, glucoseMin != glucoseMax {
                    glucoseStr += " (range: \(String(format: "%.1f", glucoseMin))–\(String(format: "%.1f", glucoseMax)))"
                }
                markdown += glucoseStr + "\n"
            }
        }

        // Body Section
        if body.hasData {
            markdown += "\n\(headerPrefix) \(bodyEmoji)Body\n\n"
            if let weight = body.weight {
                markdown += "\(bullet) **Weight:** \(converter.formatWeight(weight))\n"
            }
            if let height = body.height {
                markdown += "\(bullet) **Height:** \(converter.formatHeight(height))\n"
            }
            if let bmi = body.bmi {
                markdown += "\(bullet) **BMI:** \(String(format: "%.1f", bmi))\n"
            }
            if let bodyFat = body.bodyFatPercentage {
                markdown += "\(bullet) **Body Fat:** \(String(format: "%.1f", bodyFat * 100))%\n"
            }
            if let lean = body.leanBodyMass {
                markdown += "\(bullet) **Lean Body Mass:** \(converter.formatWeight(lean))\n"
            }
            if let waist = body.waistCircumference {
                markdown += "\(bullet) **Waist Circumference:** \(converter.formatLength(waist))\n"
            }
        }

        // Nutrition Section
        if nutrition.hasData {
            markdown += "\n\(headerPrefix) \(nutritionEmoji)Nutrition\n\n"
            if let energy = nutrition.dietaryEnergy {
                markdown += "\(bullet) **Calories:** \(formatNumber(Int(energy))) kcal\n"
            }
            if let protein = nutrition.protein {
                markdown += "\(bullet) **Protein:** \(String(format: "%.1f", protein)) g\n"
            }
            if let carbs = nutrition.carbohydrates {
                markdown += "\(bullet) **Carbohydrates:** \(String(format: "%.1f", carbs)) g\n"
            }
            if let fat = nutrition.fat {
                markdown += "\(bullet) **Fat:** \(String(format: "%.1f", fat)) g\n"
            }
            if let saturatedFat = nutrition.saturatedFat {
                markdown += "\(bullet) **Saturated Fat:** \(String(format: "%.1f", saturatedFat)) g\n"
            }
            if let fiber = nutrition.fiber {
                markdown += "\(bullet) **Fiber:** \(String(format: "%.1f", fiber)) g\n"
            }
            if let sugar = nutrition.sugar {
                markdown += "\(bullet) **Sugar:** \(String(format: "%.1f", sugar)) g\n"
            }
            if let sodium = nutrition.sodium {
                markdown += "\(bullet) **Sodium:** \(formatNumber(Int(sodium))) mg\n"
            }
            if let cholesterol = nutrition.cholesterol {
                markdown += "\(bullet) **Cholesterol:** \(String(format: "%.1f", cholesterol)) mg\n"
            }
            if let water = nutrition.water {
                markdown += "\(bullet) **Water:** \(converter.formatVolume(water))\n"
            }
            if let caffeine = nutrition.caffeine {
                markdown += "\(bullet) **Caffeine:** \(String(format: "%.1f", caffeine)) mg\n"
            }
        }

        // Mindfulness Section
        if mindfulness.hasData {
            markdown += "\n\(headerPrefix) \(mindfulnessEmoji)Mindfulness\n\n"
            if let minutes = mindfulness.mindfulMinutes {
                markdown += "\(bullet) **Mindful Minutes:** \(Int(minutes)) min\n"
            }
            if let sessions = mindfulness.mindfulSessions {
                markdown += "\(bullet) **Sessions:** \(sessions)\n"
            }
            
            // State of Mind data
            if !mindfulness.stateOfMind.isEmpty {
                markdown += "\n"
                
                // Summary stats
                if let avgValence = mindfulness.averageValence {
                    let valencePercent = Int(((avgValence + 1.0) / 2.0) * 100)
                    markdown += "\(bullet) **Average Mood:** \(valencePercent)% (\(valenceDescription(avgValence)))\n"
                }
                
                if !mindfulness.dailyMoods.isEmpty {
                    markdown += "\(bullet) **Daily Mood Entries:** \(mindfulness.dailyMoods.count)\n"
                }
                
                if !mindfulness.momentaryEmotions.isEmpty {
                    markdown += "\(bullet) **Momentary Emotions:** \(mindfulness.momentaryEmotions.count)\n"
                }
                
                // List all unique labels
                if !mindfulness.allLabels.isEmpty {
                    markdown += "\(bullet) **Emotions/Moods:** \(mindfulness.allLabels.joined(separator: ", "))\n"
                }
                
                // List all unique associations
                if !mindfulness.allAssociations.isEmpty {
                    markdown += "\(bullet) **Associated With:** \(mindfulness.allAssociations.joined(separator: ", "))\n"
                }
                
                // Detailed entries (if template allows)
                if template.includeSummary && mindfulness.stateOfMind.count <= 5 {
                    let subHeaderPrefix = String(repeating: "#", count: template.sectionHeaderLevel + 1)
                    markdown += "\n\(subHeaderPrefix) Mood Entries\n\n"
                    
                    for entry in mindfulness.stateOfMind {
                        let timeStr = config.timeFormat.format(date: entry.timestamp)
                        let emoji = template.useEmoji ? entry.valenceEmoji + " " : ""
                        markdown += "\(bullet) **\(timeStr)** \(emoji)(\(entry.kind.rawValue)): \(entry.valencePercent)%"
                        if !entry.labels.isEmpty {
                            markdown += " — \(entry.labels.joined(separator: ", "))"
                        }
                        markdown += "\n"
                    }
                }
            }
        }

        // Mobility Section
        if mobility.hasData {
            markdown += "\n\(headerPrefix) \(mobilityEmoji)Mobility\n\n"
            if let speed = mobility.walkingSpeed {
                markdown += "\(bullet) **Walking Speed:** \(converter.formatSpeed(speed))\n"
            }
            if let stepLength = mobility.walkingStepLength {
                markdown += "\(bullet) **Step Length:** \(converter.formatLength(stepLength))\n"
            }
            if let doubleSupport = mobility.walkingDoubleSupportPercentage {
                markdown += "\(bullet) **Double Support:** \(String(format: "%.1f", doubleSupport * 100))%\n"
            }
            if let asymmetry = mobility.walkingAsymmetryPercentage {
                markdown += "\(bullet) **Walking Asymmetry:** \(String(format: "%.1f", asymmetry * 100))%\n"
            }
            if let ascent = mobility.stairAscentSpeed {
                markdown += "\(bullet) **Stair Ascent Speed:** \(converter.formatSpeed(ascent))\n"
            }
            if let descent = mobility.stairDescentSpeed {
                markdown += "\(bullet) **Stair Descent Speed:** \(converter.formatSpeed(descent))\n"
            }
            if let sixMin = mobility.sixMinuteWalkDistance {
                markdown += "\(bullet) **6-Min Walk Distance:** \(converter.formatDistance(sixMin))\n"
            }
        }

        // Hearing Section
        if hearing.hasData {
            markdown += "\n\(headerPrefix) \(hearingEmoji)Hearing\n\n"
            if let headphone = hearing.headphoneAudioLevel {
                markdown += "\(bullet) **Headphone Audio Level:** \(String(format: "%.1f", headphone)) dB\n"
            }
            if let environmental = hearing.environmentalSoundLevel {
                markdown += "\(bullet) **Environmental Sound Level:** \(String(format: "%.1f", environmental)) dB\n"
            }
        }

        // Workouts Section
        if !workouts.isEmpty {
            markdown += "\n\(headerPrefix) \(workoutsEmoji)Workouts\n"
            
            let subHeaderPrefix = String(repeating: "#", count: template.sectionHeaderLevel + 1)

            for (index, workout) in workouts.enumerated() {
                markdown += "\n\(subHeaderPrefix) \(index + 1). \(workout.workoutTypeName)\n\n"
                markdown += "\(bullet) **Time:** \(config.timeFormat.format(date: workout.startTime))\n"
                markdown += "\(bullet) **Duration:** \(formatDurationShort(workout.duration))\n"
                if let distance = workout.distance, distance > 0 {
                    markdown += "\(bullet) **Distance:** \(converter.formatDistance(distance))\n"
                }
                if let calories = workout.calories, calories > 0 {
                    markdown += "\(bullet) **Calories:** \(Int(calories)) kcal\n"
                }
            }
        }

        return markdown
    }

    private func formatDuration(_ interval: TimeInterval) -> String {
        let hours = Int(interval) / 3600
        let minutes = (Int(interval) % 3600) / 60
        if hours > 0 {
            return "\(hours)h \(minutes)m"
        }
        return "\(minutes)m"
    }

    private func formatDurationShort(_ interval: TimeInterval) -> String {
        let hours = Int(interval) / 3600
        let minutes = (Int(interval) % 3600) / 60
        if hours > 0 {
            return "\(hours)h \(minutes)m"
        }
        return "\(minutes)m"
    }

    private func formatNumber(_ number: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.groupingSeparator = ","
        return formatter.string(from: NSNumber(value: number)) ?? "\(number)"
    }

    private func formatDistance(_ meters: Double) -> String {
        if meters >= 1000 {
            return String(format: "%.1f km", meters / 1000)
        }
        return "\(Int(meters)) m"
    }
    
    private func valenceDescription(_ valence: Double) -> String {
        switch valence {
        case -1.0 ..< -0.6:
            return "Very Unpleasant"
        case -0.6 ..< -0.2:
            return "Unpleasant"
        case -0.2 ..< 0.2:
            return "Neutral"
        case 0.2 ..< 0.6:
            return "Pleasant"
        case 0.6 ... 1.0:
            return "Very Pleasant"
        default:
            return "Unknown"
        }
    }
}

// MARK: - JSON Export

extension HealthData {
    func toJSON(customization: FormatCustomization? = nil) -> String {
        let config = customization ?? FormatCustomization()
        let dateString = config.dateFormat.format(date: date)
        let converter = config.unitConverter

        var json: [String: Any] = [
            "date": dateString,
            "type": "health-data",
            "units": config.unitPreference.rawValue.lowercased()
        ]

        // Sleep
        if sleep.hasData {
            var sleepDict: [String: Any] = [:]
            if sleep.totalDuration > 0 {
                sleepDict["totalDuration"] = sleep.totalDuration
                sleepDict["totalDurationFormatted"] = formatDuration(sleep.totalDuration)
            }
            if sleep.deepSleep > 0 {
                sleepDict["deepSleep"] = sleep.deepSleep
                sleepDict["deepSleepFormatted"] = formatDuration(sleep.deepSleep)
            }
            if sleep.remSleep > 0 {
                sleepDict["remSleep"] = sleep.remSleep
                sleepDict["remSleepFormatted"] = formatDuration(sleep.remSleep)
            }
            if sleep.coreSleep > 0 {
                sleepDict["coreSleep"] = sleep.coreSleep
                sleepDict["coreSleepFormatted"] = formatDuration(sleep.coreSleep)
            }
            if sleep.awakeTime > 0 {
                sleepDict["awakeTime"] = sleep.awakeTime
                sleepDict["awakeTimeFormatted"] = formatDuration(sleep.awakeTime)
            }
            if sleep.inBedTime > 0 {
                sleepDict["inBedTime"] = sleep.inBedTime
                sleepDict["inBedTimeFormatted"] = formatDuration(sleep.inBedTime)
            }
            json["sleep"] = sleepDict
        }

        // Activity
        if activity.hasData {
            var activityDict: [String: Any] = [:]
            if let steps = activity.steps {
                activityDict["steps"] = steps
            }
            if let calories = activity.activeCalories {
                activityDict["activeCalories"] = calories
            }
            if let basal = activity.basalEnergyBurned {
                activityDict["basalEnergyBurned"] = basal
            }
            if let exercise = activity.exerciseMinutes {
                activityDict["exerciseMinutes"] = exercise
            }
            if let standHours = activity.standHours {
                activityDict["standHours"] = standHours
            }
            if let flights = activity.flightsClimbed {
                activityDict["flightsClimbed"] = flights
            }
            if let distance = activity.walkingRunningDistance {
                activityDict["walkingRunningDistance"] = distance
                activityDict["walkingRunningDistanceKm"] = distance / 1000
            }
            if let cycling = activity.cyclingDistance {
                activityDict["cyclingDistance"] = cycling
                activityDict["cyclingDistanceKm"] = cycling / 1000
            }
            if let swimming = activity.swimmingDistance {
                activityDict["swimmingDistance"] = swimming
            }
            if let strokes = activity.swimmingStrokes {
                activityDict["swimmingStrokes"] = strokes
            }
            if let pushes = activity.pushCount {
                activityDict["pushCount"] = pushes
            }
            json["activity"] = activityDict
        }

        // Heart
        if heart.hasData {
            var heartDict: [String: Any] = [:]
            if let hr = heart.restingHeartRate {
                heartDict["restingHeartRate"] = hr
            }
            if let walkingHR = heart.walkingHeartRateAverage {
                heartDict["walkingHeartRateAverage"] = walkingHR
            }
            if let avgHR = heart.averageHeartRate {
                heartDict["averageHeartRate"] = avgHR
            }
            if let minHR = heart.heartRateMin {
                heartDict["heartRateMin"] = minHR
            }
            if let maxHR = heart.heartRateMax {
                heartDict["heartRateMax"] = maxHR
            }
            if let hrv = heart.hrv {
                heartDict["hrv"] = hrv
            }
            json["heart"] = heartDict
        }

        // Vitals (daily aggregates)
        if vitals.hasData {
            var vitalsDict: [String: Any] = [:]
            
            // Respiratory Rate
            if let rrAvg = vitals.respiratoryRateAvg {
                vitalsDict["respiratoryRateAvg"] = rrAvg
                vitalsDict["respiratoryRate"] = rrAvg // backward compatibility
            }
            if let rrMin = vitals.respiratoryRateMin {
                vitalsDict["respiratoryRateMin"] = rrMin
            }
            if let rrMax = vitals.respiratoryRateMax {
                vitalsDict["respiratoryRateMax"] = rrMax
            }
            
            // Blood Oxygen / SpO2
            if let spo2Avg = vitals.bloodOxygenAvg {
                vitalsDict["bloodOxygenAvg"] = spo2Avg
                vitalsDict["bloodOxygen"] = spo2Avg // backward compatibility
                vitalsDict["bloodOxygenPercent"] = spo2Avg * 100
            }
            if let spo2Min = vitals.bloodOxygenMin {
                vitalsDict["bloodOxygenMin"] = spo2Min
                vitalsDict["bloodOxygenMinPercent"] = spo2Min * 100
            }
            if let spo2Max = vitals.bloodOxygenMax {
                vitalsDict["bloodOxygenMax"] = spo2Max
                vitalsDict["bloodOxygenMaxPercent"] = spo2Max * 100
            }
            
            // Body Temperature
            if let tempAvg = vitals.bodyTemperatureAvg {
                vitalsDict["bodyTemperatureAvg"] = tempAvg
                vitalsDict["bodyTemperature"] = tempAvg // backward compatibility
            }
            if let tempMin = vitals.bodyTemperatureMin {
                vitalsDict["bodyTemperatureMin"] = tempMin
            }
            if let tempMax = vitals.bodyTemperatureMax {
                vitalsDict["bodyTemperatureMax"] = tempMax
            }
            
            // Blood Pressure Systolic
            if let systolicAvg = vitals.bloodPressureSystolicAvg {
                vitalsDict["bloodPressureSystolicAvg"] = systolicAvg
                vitalsDict["bloodPressureSystolic"] = systolicAvg // backward compatibility
            }
            if let systolicMin = vitals.bloodPressureSystolicMin {
                vitalsDict["bloodPressureSystolicMin"] = systolicMin
            }
            if let systolicMax = vitals.bloodPressureSystolicMax {
                vitalsDict["bloodPressureSystolicMax"] = systolicMax
            }
            
            // Blood Pressure Diastolic
            if let diastolicAvg = vitals.bloodPressureDiastolicAvg {
                vitalsDict["bloodPressureDiastolicAvg"] = diastolicAvg
                vitalsDict["bloodPressureDiastolic"] = diastolicAvg // backward compatibility
            }
            if let diastolicMin = vitals.bloodPressureDiastolicMin {
                vitalsDict["bloodPressureDiastolicMin"] = diastolicMin
            }
            if let diastolicMax = vitals.bloodPressureDiastolicMax {
                vitalsDict["bloodPressureDiastolicMax"] = diastolicMax
            }
            
            // Blood Glucose
            if let glucoseAvg = vitals.bloodGlucoseAvg {
                vitalsDict["bloodGlucoseAvg"] = glucoseAvg
                vitalsDict["bloodGlucose"] = glucoseAvg // backward compatibility
            }
            if let glucoseMin = vitals.bloodGlucoseMin {
                vitalsDict["bloodGlucoseMin"] = glucoseMin
            }
            if let glucoseMax = vitals.bloodGlucoseMax {
                vitalsDict["bloodGlucoseMax"] = glucoseMax
            }
            
            json["vitals"] = vitalsDict
        }

        // Body
        if body.hasData {
            var bodyDict: [String: Any] = [:]
            if let weight = body.weight {
                bodyDict["weight"] = weight
            }
            if let height = body.height {
                bodyDict["height"] = height
            }
            if let bmi = body.bmi {
                bodyDict["bmi"] = bmi
            }
            if let bodyFat = body.bodyFatPercentage {
                bodyDict["bodyFatPercentage"] = bodyFat
                bodyDict["bodyFatPercent"] = bodyFat * 100
            }
            if let lean = body.leanBodyMass {
                bodyDict["leanBodyMass"] = lean
            }
            if let waist = body.waistCircumference {
                bodyDict["waistCircumference"] = waist * 100 // Convert to cm
            }
            json["body"] = bodyDict
        }

        // Nutrition
        if nutrition.hasData {
            var nutritionDict: [String: Any] = [:]
            if let energy = nutrition.dietaryEnergy {
                nutritionDict["dietaryEnergy"] = energy
            }
            if let protein = nutrition.protein {
                nutritionDict["protein"] = protein
            }
            if let carbs = nutrition.carbohydrates {
                nutritionDict["carbohydrates"] = carbs
            }
            if let fat = nutrition.fat {
                nutritionDict["fat"] = fat
            }
            if let saturatedFat = nutrition.saturatedFat {
                nutritionDict["saturatedFat"] = saturatedFat
            }
            if let fiber = nutrition.fiber {
                nutritionDict["fiber"] = fiber
            }
            if let sugar = nutrition.sugar {
                nutritionDict["sugar"] = sugar
            }
            if let sodium = nutrition.sodium {
                nutritionDict["sodium"] = sodium
            }
            if let cholesterol = nutrition.cholesterol {
                nutritionDict["cholesterol"] = cholesterol
            }
            if let water = nutrition.water {
                nutritionDict["water"] = water
            }
            if let caffeine = nutrition.caffeine {
                nutritionDict["caffeine"] = caffeine
            }
            json["nutrition"] = nutritionDict
        }

        // Mindfulness
        if mindfulness.hasData {
            var mindfulnessDict: [String: Any] = [:]
            if let minutes = mindfulness.mindfulMinutes {
                mindfulnessDict["mindfulMinutes"] = minutes
            }
            if let sessions = mindfulness.mindfulSessions {
                mindfulnessDict["mindfulSessions"] = sessions
            }
            
            // State of Mind data
            if !mindfulness.stateOfMind.isEmpty {
                mindfulnessDict["stateOfMindCount"] = mindfulness.stateOfMind.count
                
                if let avgValence = mindfulness.averageValence {
                    mindfulnessDict["averageValence"] = avgValence
                    mindfulnessDict["averageValencePercent"] = Int(((avgValence + 1.0) / 2.0) * 100)
                }
                
                if !mindfulness.dailyMoods.isEmpty {
                    mindfulnessDict["dailyMoodCount"] = mindfulness.dailyMoods.count
                    if let avgDailyValence = mindfulness.averageDailyMoodValence {
                        mindfulnessDict["averageDailyMoodValence"] = avgDailyValence
                    }
                }
                
                if !mindfulness.momentaryEmotions.isEmpty {
                    mindfulnessDict["momentaryEmotionCount"] = mindfulness.momentaryEmotions.count
                }
                
                if !mindfulness.allLabels.isEmpty {
                    mindfulnessDict["emotionLabels"] = mindfulness.allLabels
                }
                
                if !mindfulness.allAssociations.isEmpty {
                    mindfulnessDict["associations"] = mindfulness.allAssociations
                }
                
                // Individual entries
                let entriesArray = mindfulness.stateOfMind.map { entry -> [String: Any] in
                    var entryDict: [String: Any] = [
                        "timestamp": config.timeFormat.format(date: entry.timestamp),
                        "kind": entry.kind.rawValue,
                        "valence": entry.valence,
                        "valencePercent": entry.valencePercent,
                        "valenceDescription": entry.valenceDescription
                    ]
                    if !entry.labels.isEmpty {
                        entryDict["labels"] = entry.labels
                    }
                    if !entry.associations.isEmpty {
                        entryDict["associations"] = entry.associations
                    }
                    return entryDict
                }
                mindfulnessDict["stateOfMindEntries"] = entriesArray
            }
            
            json["mindfulness"] = mindfulnessDict
        }

        // Mobility
        if mobility.hasData {
            var mobilityDict: [String: Any] = [:]
            if let speed = mobility.walkingSpeed {
                mobilityDict["walkingSpeed"] = speed
            }
            if let stepLength = mobility.walkingStepLength {
                mobilityDict["walkingStepLength"] = stepLength
            }
            if let doubleSupport = mobility.walkingDoubleSupportPercentage {
                mobilityDict["walkingDoubleSupportPercentage"] = doubleSupport
            }
            if let asymmetry = mobility.walkingAsymmetryPercentage {
                mobilityDict["walkingAsymmetryPercentage"] = asymmetry
            }
            if let ascent = mobility.stairAscentSpeed {
                mobilityDict["stairAscentSpeed"] = ascent
            }
            if let descent = mobility.stairDescentSpeed {
                mobilityDict["stairDescentSpeed"] = descent
            }
            if let sixMin = mobility.sixMinuteWalkDistance {
                mobilityDict["sixMinuteWalkDistance"] = sixMin
            }
            json["mobility"] = mobilityDict
        }

        // Hearing
        if hearing.hasData {
            var hearingDict: [String: Any] = [:]
            if let headphone = hearing.headphoneAudioLevel {
                hearingDict["headphoneAudioLevel"] = headphone
            }
            if let environmental = hearing.environmentalSoundLevel {
                hearingDict["environmentalSoundLevel"] = environmental
            }
            json["hearing"] = hearingDict
        }

        // Workouts
        if !workouts.isEmpty {
            let workoutsArray = workouts.map { workout in
                var workoutDict: [String: Any] = [
                    "type": workout.workoutTypeName,
                    "startTime": config.timeFormat.format(date: workout.startTime),
                    "duration": workout.duration,
                    "durationFormatted": formatDurationShort(workout.duration)
                ]
                if let distance = workout.distance, distance > 0 {
                    workoutDict["distance"] = distance
                    workoutDict["distanceFormatted"] = converter.formatDistance(distance)
                }
                if let calories = workout.calories, calories > 0 {
                    workoutDict["calories"] = calories
                }
                return workoutDict
            }
            json["workouts"] = workoutsArray
        }

        // Convert to JSON string
        if let jsonData = try? JSONSerialization.data(withJSONObject: json, options: .prettyPrinted),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            return jsonString
        }

        return "{}"
    }
}

// MARK: - CSV Export

extension HealthData {
    func toCSV(customization: FormatCustomization? = nil) -> String {
        let config = customization ?? FormatCustomization()
        let dateString = config.dateFormat.format(date: date)
        let converter = config.unitConverter
        
        let distanceUnit = converter.distanceUnit()
        let weightUnit = converter.weightUnit()
        let tempUnit = converter.temperatureUnit()

        var csv = "Date,Category,Metric,Value,Unit\n"

        // Sleep
        if sleep.hasData {
            if sleep.totalDuration > 0 {
                csv += "\(dateString),Sleep,Total Duration,\(sleep.totalDuration),seconds\n"
            }
            if sleep.deepSleep > 0 {
                csv += "\(dateString),Sleep,Deep Sleep,\(sleep.deepSleep),seconds\n"
            }
            if sleep.remSleep > 0 {
                csv += "\(dateString),Sleep,REM Sleep,\(sleep.remSleep),seconds\n"
            }
            if sleep.coreSleep > 0 {
                csv += "\(dateString),Sleep,Core Sleep,\(sleep.coreSleep),seconds\n"
            }
            if sleep.awakeTime > 0 {
                csv += "\(dateString),Sleep,Awake Time,\(sleep.awakeTime),seconds\n"
            }
            if sleep.inBedTime > 0 {
                csv += "\(dateString),Sleep,In Bed Time,\(sleep.inBedTime),seconds\n"
            }
        }

        // Activity
        if activity.hasData {
            if let steps = activity.steps {
                csv += "\(dateString),Activity,Steps,\(steps),count\n"
            }
            if let calories = activity.activeCalories {
                csv += "\(dateString),Activity,Active Calories,\(calories),kcal\n"
            }
            if let basal = activity.basalEnergyBurned {
                csv += "\(dateString),Activity,Basal Energy,\(basal),kcal\n"
            }
            if let exercise = activity.exerciseMinutes {
                csv += "\(dateString),Activity,Exercise Minutes,\(exercise),minutes\n"
            }
            if let standHours = activity.standHours {
                csv += "\(dateString),Activity,Stand Hours,\(standHours),hours\n"
            }
            if let flights = activity.flightsClimbed {
                csv += "\(dateString),Activity,Flights Climbed,\(flights),count\n"
            }
            if let distance = activity.walkingRunningDistance {
                csv += "\(dateString),Activity,Walking Running Distance,\(distance),meters\n"
            }
            if let cycling = activity.cyclingDistance {
                csv += "\(dateString),Activity,Cycling Distance,\(cycling),meters\n"
            }
            if let swimming = activity.swimmingDistance {
                csv += "\(dateString),Activity,Swimming Distance,\(swimming),meters\n"
            }
            if let strokes = activity.swimmingStrokes {
                csv += "\(dateString),Activity,Swimming Strokes,\(strokes),count\n"
            }
            if let pushes = activity.pushCount {
                csv += "\(dateString),Activity,Wheelchair Pushes,\(pushes),count\n"
            }
        }

        // Heart
        if heart.hasData {
            if let hr = heart.restingHeartRate {
                csv += "\(dateString),Heart,Resting Heart Rate,\(hr),bpm\n"
            }
            if let walkingHR = heart.walkingHeartRateAverage {
                csv += "\(dateString),Heart,Walking Heart Rate Average,\(walkingHR),bpm\n"
            }
            if let avgHR = heart.averageHeartRate {
                csv += "\(dateString),Heart,Average Heart Rate,\(avgHR),bpm\n"
            }
            if let minHR = heart.heartRateMin {
                csv += "\(dateString),Heart,Min Heart Rate,\(minHR),bpm\n"
            }
            if let maxHR = heart.heartRateMax {
                csv += "\(dateString),Heart,Max Heart Rate,\(maxHR),bpm\n"
            }
            if let hrv = heart.hrv {
                csv += "\(dateString),Heart,HRV,\(hrv),ms\n"
            }
        }

        // Vitals (daily aggregates)
        if vitals.hasData {
            // Respiratory Rate
            if let rrAvg = vitals.respiratoryRateAvg {
                csv += "\(dateString),Vitals,Respiratory Rate Avg,\(rrAvg),breaths/min\n"
            }
            if let rrMin = vitals.respiratoryRateMin {
                csv += "\(dateString),Vitals,Respiratory Rate Min,\(rrMin),breaths/min\n"
            }
            if let rrMax = vitals.respiratoryRateMax {
                csv += "\(dateString),Vitals,Respiratory Rate Max,\(rrMax),breaths/min\n"
            }
            
            // Blood Oxygen / SpO2
            if let spo2Avg = vitals.bloodOxygenAvg {
                csv += "\(dateString),Vitals,Blood Oxygen Avg,\(spo2Avg * 100),percent\n"
            }
            if let spo2Min = vitals.bloodOxygenMin {
                csv += "\(dateString),Vitals,Blood Oxygen Min,\(spo2Min * 100),percent\n"
            }
            if let spo2Max = vitals.bloodOxygenMax {
                csv += "\(dateString),Vitals,Blood Oxygen Max,\(spo2Max * 100),percent\n"
            }
            
            // Body Temperature
            if let tempAvg = vitals.bodyTemperatureAvg {
                let convertedTemp = converter.convertTemperature(tempAvg)
                csv += "\(dateString),Vitals,Body Temperature Avg,\(String(format: "%.1f", convertedTemp)),\(tempUnit)\n"
            }
            if let tempMin = vitals.bodyTemperatureMin {
                let convertedTemp = converter.convertTemperature(tempMin)
                csv += "\(dateString),Vitals,Body Temperature Min,\(String(format: "%.1f", convertedTemp)),\(tempUnit)\n"
            }
            if let tempMax = vitals.bodyTemperatureMax {
                let convertedTemp = converter.convertTemperature(tempMax)
                csv += "\(dateString),Vitals,Body Temperature Max,\(String(format: "%.1f", convertedTemp)),\(tempUnit)\n"
            }
            
            // Blood Pressure Systolic
            if let systolicAvg = vitals.bloodPressureSystolicAvg {
                csv += "\(dateString),Vitals,Blood Pressure Systolic Avg,\(systolicAvg),mmHg\n"
            }
            if let systolicMin = vitals.bloodPressureSystolicMin {
                csv += "\(dateString),Vitals,Blood Pressure Systolic Min,\(systolicMin),mmHg\n"
            }
            if let systolicMax = vitals.bloodPressureSystolicMax {
                csv += "\(dateString),Vitals,Blood Pressure Systolic Max,\(systolicMax),mmHg\n"
            }
            
            // Blood Pressure Diastolic
            if let diastolicAvg = vitals.bloodPressureDiastolicAvg {
                csv += "\(dateString),Vitals,Blood Pressure Diastolic Avg,\(diastolicAvg),mmHg\n"
            }
            if let diastolicMin = vitals.bloodPressureDiastolicMin {
                csv += "\(dateString),Vitals,Blood Pressure Diastolic Min,\(diastolicMin),mmHg\n"
            }
            if let diastolicMax = vitals.bloodPressureDiastolicMax {
                csv += "\(dateString),Vitals,Blood Pressure Diastolic Max,\(diastolicMax),mmHg\n"
            }
            
            // Blood Glucose
            if let glucoseAvg = vitals.bloodGlucoseAvg {
                csv += "\(dateString),Vitals,Blood Glucose Avg,\(glucoseAvg),mg/dL\n"
            }
            if let glucoseMin = vitals.bloodGlucoseMin {
                csv += "\(dateString),Vitals,Blood Glucose Min,\(glucoseMin),mg/dL\n"
            }
            if let glucoseMax = vitals.bloodGlucoseMax {
                csv += "\(dateString),Vitals,Blood Glucose Max,\(glucoseMax),mg/dL\n"
            }
        }

        // Body
        if body.hasData {
            if let weight = body.weight {
                let convertedWeight = converter.convertWeight(weight)
                csv += "\(dateString),Body,Weight,\(String(format: "%.1f", convertedWeight)),\(weightUnit)\n"
            }
            if let height = body.height {
                let convertedHeight = converter.convertHeight(height)
                csv += "\(dateString),Body,Height,\(String(format: "%.1f", convertedHeight)),\(converter.heightUnit())\n"
            }
            if let bmi = body.bmi {
                csv += "\(dateString),Body,BMI,\(bmi),\n"
            }
            if let bodyFat = body.bodyFatPercentage {
                csv += "\(dateString),Body,Body Fat Percentage,\(bodyFat * 100),percent\n"
            }
            if let lean = body.leanBodyMass {
                let convertedLean = converter.convertWeight(lean)
                csv += "\(dateString),Body,Lean Body Mass,\(String(format: "%.1f", convertedLean)),\(weightUnit)\n"
            }
            if let waist = body.waistCircumference {
                csv += "\(dateString),Body,Waist Circumference,\(converter.formatLength(waist)),\(converter.lengthUnit())\n"
            }
        }

        // Nutrition
        if nutrition.hasData {
            if let energy = nutrition.dietaryEnergy {
                csv += "\(dateString),Nutrition,Dietary Energy,\(energy),kcal\n"
            }
            if let protein = nutrition.protein {
                csv += "\(dateString),Nutrition,Protein,\(protein),g\n"
            }
            if let carbs = nutrition.carbohydrates {
                csv += "\(dateString),Nutrition,Carbohydrates,\(carbs),g\n"
            }
            if let fat = nutrition.fat {
                csv += "\(dateString),Nutrition,Fat,\(fat),g\n"
            }
            if let saturatedFat = nutrition.saturatedFat {
                csv += "\(dateString),Nutrition,Saturated Fat,\(saturatedFat),g\n"
            }
            if let fiber = nutrition.fiber {
                csv += "\(dateString),Nutrition,Fiber,\(fiber),g\n"
            }
            if let sugar = nutrition.sugar {
                csv += "\(dateString),Nutrition,Sugar,\(sugar),g\n"
            }
            if let sodium = nutrition.sodium {
                csv += "\(dateString),Nutrition,Sodium,\(sodium),mg\n"
            }
            if let cholesterol = nutrition.cholesterol {
                csv += "\(dateString),Nutrition,Cholesterol,\(cholesterol),mg\n"
            }
            if let water = nutrition.water {
                csv += "\(dateString),Nutrition,Water,\(water),L\n"
            }
            if let caffeine = nutrition.caffeine {
                csv += "\(dateString),Nutrition,Caffeine,\(caffeine),mg\n"
            }
        }

        // Mindfulness
        if mindfulness.hasData {
            if let minutes = mindfulness.mindfulMinutes {
                csv += "\(dateString),Mindfulness,Mindful Minutes,\(minutes),minutes\n"
            }
            if let sessions = mindfulness.mindfulSessions {
                csv += "\(dateString),Mindfulness,Mindful Sessions,\(sessions),count\n"
            }
            
            // State of Mind data
            if !mindfulness.stateOfMind.isEmpty {
                csv += "\(dateString),Mindfulness,State of Mind Entries,\(mindfulness.stateOfMind.count),count\n"
                
                if let avgValence = mindfulness.averageValence {
                    csv += "\(dateString),Mindfulness,Average Mood Valence,\(String(format: "%.2f", avgValence)),scale(-1 to 1)\n"
                    let valencePercent = Int(((avgValence + 1.0) / 2.0) * 100)
                    csv += "\(dateString),Mindfulness,Average Mood Percent,\(valencePercent),percent\n"
                }
                
                if !mindfulness.dailyMoods.isEmpty {
                    csv += "\(dateString),Mindfulness,Daily Mood Count,\(mindfulness.dailyMoods.count),count\n"
                }
                
                if !mindfulness.momentaryEmotions.isEmpty {
                    csv += "\(dateString),Mindfulness,Momentary Emotion Count,\(mindfulness.momentaryEmotions.count),count\n"
                }
                
                // Individual entries
                for entry in mindfulness.stateOfMind {
                    let timeStr = config.timeFormat.format(date: entry.timestamp)
                    let labelsStr = entry.labels.joined(separator: "; ").replacingOccurrences(of: ",", with: ";")
                    let associationsStr = entry.associations.joined(separator: "; ").replacingOccurrences(of: ",", with: ";")
                    
                    csv += "\(dateString),State of Mind,\(entry.kind.rawValue) at \(timeStr),\(String(format: "%.2f", entry.valence)),valence\n"
                    if !labelsStr.isEmpty {
                        csv += "\(dateString),State of Mind,\(entry.kind.rawValue) Labels at \(timeStr),\"\(labelsStr)\",labels\n"
                    }
                    if !associationsStr.isEmpty {
                        csv += "\(dateString),State of Mind,\(entry.kind.rawValue) Associations at \(timeStr),\"\(associationsStr)\",associations\n"
                    }
                }
            }
        }

        // Mobility
        if mobility.hasData {
            if let speed = mobility.walkingSpeed {
                csv += "\(dateString),Mobility,Walking Speed,\(speed),m/s\n"
            }
            if let stepLength = mobility.walkingStepLength {
                csv += "\(dateString),Mobility,Walking Step Length,\(stepLength),meters\n"
            }
            if let doubleSupport = mobility.walkingDoubleSupportPercentage {
                csv += "\(dateString),Mobility,Double Support Percentage,\(doubleSupport * 100),percent\n"
            }
            if let asymmetry = mobility.walkingAsymmetryPercentage {
                csv += "\(dateString),Mobility,Walking Asymmetry,\(asymmetry * 100),percent\n"
            }
            if let ascent = mobility.stairAscentSpeed {
                csv += "\(dateString),Mobility,Stair Ascent Speed,\(ascent),m/s\n"
            }
            if let descent = mobility.stairDescentSpeed {
                csv += "\(dateString),Mobility,Stair Descent Speed,\(descent),m/s\n"
            }
            if let sixMin = mobility.sixMinuteWalkDistance {
                csv += "\(dateString),Mobility,Six Minute Walk Distance,\(sixMin),meters\n"
            }
        }

        // Hearing
        if hearing.hasData {
            if let headphone = hearing.headphoneAudioLevel {
                csv += "\(dateString),Hearing,Headphone Audio Level,\(headphone),dB\n"
            }
            if let environmental = hearing.environmentalSoundLevel {
                csv += "\(dateString),Hearing,Environmental Sound Level,\(environmental),dB\n"
            }
        }

        // Workouts
        if !workouts.isEmpty {
            for workout in workouts {
                let startTimeString = config.timeFormat.format(date: workout.startTime)
                csv += "\(dateString),Workouts,\(workout.workoutTypeName) Start Time,\(startTimeString),time\n"
                csv += "\(dateString),Workouts,\(workout.workoutTypeName) Duration,\(workout.duration),seconds\n"
                if let distance = workout.distance, distance > 0 {
                    let convertedDistance = converter.convertDistance(distance)
                    csv += "\(dateString),Workouts,\(workout.workoutTypeName) Distance,\(String(format: "%.2f", convertedDistance)),\(distanceUnit)\n"
                }
                if let calories = workout.calories, calories > 0 {
                    csv += "\(dateString),Workouts,\(workout.workoutTypeName) Calories,\(calories),kcal\n"
                }
            }
        }

        return csv
    }
}

// MARK: - Obsidian Bases Export

extension HealthData {
    func toObsidianBases(customization: FormatCustomization? = nil) -> String {
        let config = customization ?? FormatCustomization()
        let dateString = config.dateFormat.format(date: date)
        let fmConfig = config.frontmatterConfig
        let converter = config.unitConverter

        var frontmatter: [String] = []
        frontmatter.append("---")
        
        // Core fields
        if fmConfig.includeDate {
            frontmatter.append("\(fmConfig.customDateKey): \(dateString)")
        }
        if fmConfig.includeType {
            frontmatter.append("\(fmConfig.customTypeKey): \(fmConfig.customTypeValue)")
        }
        
        // Custom static fields
        for (key, value) in fmConfig.customFields.sorted(by: { $0.key < $1.key }) {
            frontmatter.append("\(key): \(value)")
        }
        
        // Helper to add a field with custom key support
        func addField(_ originalKey: String, _ value: String) {
            if let outputKey = fmConfig.outputKey(for: originalKey) {
                frontmatter.append("\(outputKey): \(value)")
            }
        }

        // Sleep metrics
        if sleep.hasData {
            if sleep.totalDuration > 0 {
                addField("sleep_total_hours", String(format: "%.2f", sleep.totalDuration / 3600))
            }
            if sleep.deepSleep > 0 {
                addField("sleep_deep_hours", String(format: "%.2f", sleep.deepSleep / 3600))
            }
            if sleep.remSleep > 0 {
                addField("sleep_rem_hours", String(format: "%.2f", sleep.remSleep / 3600))
            }
            if sleep.coreSleep > 0 {
                addField("sleep_core_hours", String(format: "%.2f", sleep.coreSleep / 3600))
            }
            if sleep.awakeTime > 0 {
                addField("sleep_awake_hours", String(format: "%.2f", sleep.awakeTime / 3600))
            }
            if sleep.inBedTime > 0 {
                addField("sleep_in_bed_hours", String(format: "%.2f", sleep.inBedTime / 3600))
            }
        }

        // Activity metrics
        if activity.hasData {
            if let steps = activity.steps {
                addField("steps", "\(steps)")
            }
            if let calories = activity.activeCalories {
                addField("active_calories", "\(Int(calories))")
            }
            if let basal = activity.basalEnergyBurned {
                addField("basal_calories", "\(Int(basal))")
            }
            if let exercise = activity.exerciseMinutes {
                addField("exercise_minutes", "\(Int(exercise))")
            }
            if let standHours = activity.standHours {
                addField("stand_hours", "\(standHours)")
            }
            if let flights = activity.flightsClimbed {
                addField("flights_climbed", "\(flights)")
            }
            if let distance = activity.walkingRunningDistance {
                let converted = converter.convertDistance(distance)
                addField("walking_running_km", String(format: "%.2f", converted))
            }
            if let cycling = activity.cyclingDistance {
                let converted = converter.convertDistance(cycling)
                addField("cycling_km", String(format: "%.2f", converted))
            }
            if let swimming = activity.swimmingDistance {
                addField("swimming_m", "\(Int(swimming))")
            }
            if let strokes = activity.swimmingStrokes {
                addField("swimming_strokes", "\(strokes)")
            }
            if let pushes = activity.pushCount {
                addField("wheelchair_pushes", "\(pushes)")
            }
        }

        // Heart metrics
        if heart.hasData {
            if let hr = heart.restingHeartRate {
                addField("resting_heart_rate", "\(Int(hr))")
            }
            if let walkingHR = heart.walkingHeartRateAverage {
                addField("walking_heart_rate", "\(Int(walkingHR))")
            }
            if let avgHR = heart.averageHeartRate {
                addField("average_heart_rate", "\(Int(avgHR))")
            }
            if let minHR = heart.heartRateMin {
                addField("heart_rate_min", "\(Int(minHR))")
            }
            if let maxHR = heart.heartRateMax {
                addField("heart_rate_max", "\(Int(maxHR))")
            }
            if let hrv = heart.hrv {
                addField("hrv_ms", String(format: "%.1f", hrv))
            }
        }

        // Vitals metrics (daily aggregates)
        if vitals.hasData {
            // Respiratory Rate
            if let rrAvg = vitals.respiratoryRateAvg {
                addField("respiratory_rate", String(format: "%.1f", rrAvg))
                addField("respiratory_rate_avg", String(format: "%.1f", rrAvg))
            }
            if let rrMin = vitals.respiratoryRateMin {
                addField("respiratory_rate_min", String(format: "%.1f", rrMin))
            }
            if let rrMax = vitals.respiratoryRateMax {
                addField("respiratory_rate_max", String(format: "%.1f", rrMax))
            }
            
            // Blood Oxygen / SpO2
            if let spo2Avg = vitals.bloodOxygenAvg {
                addField("blood_oxygen", "\(Int(spo2Avg * 100))")
                addField("blood_oxygen_avg", "\(Int(spo2Avg * 100))")
            }
            if let spo2Min = vitals.bloodOxygenMin {
                addField("blood_oxygen_min", "\(Int(spo2Min * 100))")
            }
            if let spo2Max = vitals.bloodOxygenMax {
                addField("blood_oxygen_max", "\(Int(spo2Max * 100))")
            }
            
            // Body Temperature
            if let tempAvg = vitals.bodyTemperatureAvg {
                let converted = converter.convertTemperature(tempAvg)
                addField("body_temperature", String(format: "%.1f", converted))
                addField("body_temperature_avg", String(format: "%.1f", converted))
            }
            if let tempMin = vitals.bodyTemperatureMin {
                let converted = converter.convertTemperature(tempMin)
                addField("body_temperature_min", String(format: "%.1f", converted))
            }
            if let tempMax = vitals.bodyTemperatureMax {
                let converted = converter.convertTemperature(tempMax)
                addField("body_temperature_max", String(format: "%.1f", converted))
            }
            
            // Blood Pressure Systolic
            if let systolicAvg = vitals.bloodPressureSystolicAvg {
                addField("blood_pressure_systolic", "\(Int(systolicAvg))")
                addField("blood_pressure_systolic_avg", "\(Int(systolicAvg))")
            }
            if let systolicMin = vitals.bloodPressureSystolicMin {
                addField("blood_pressure_systolic_min", "\(Int(systolicMin))")
            }
            if let systolicMax = vitals.bloodPressureSystolicMax {
                addField("blood_pressure_systolic_max", "\(Int(systolicMax))")
            }
            
            // Blood Pressure Diastolic
            if let diastolicAvg = vitals.bloodPressureDiastolicAvg {
                addField("blood_pressure_diastolic", "\(Int(diastolicAvg))")
                addField("blood_pressure_diastolic_avg", "\(Int(diastolicAvg))")
            }
            if let diastolicMin = vitals.bloodPressureDiastolicMin {
                addField("blood_pressure_diastolic_min", "\(Int(diastolicMin))")
            }
            if let diastolicMax = vitals.bloodPressureDiastolicMax {
                addField("blood_pressure_diastolic_max", "\(Int(diastolicMax))")
            }
            
            // Blood Glucose
            if let glucoseAvg = vitals.bloodGlucoseAvg {
                addField("blood_glucose", String(format: "%.1f", glucoseAvg))
                addField("blood_glucose_avg", String(format: "%.1f", glucoseAvg))
            }
            if let glucoseMin = vitals.bloodGlucoseMin {
                addField("blood_glucose_min", String(format: "%.1f", glucoseMin))
            }
            if let glucoseMax = vitals.bloodGlucoseMax {
                addField("blood_glucose_max", String(format: "%.1f", glucoseMax))
            }
        }

        // Body metrics
        if body.hasData {
            if let weight = body.weight {
                let converted = converter.convertWeight(weight)
                addField("weight_kg", String(format: "%.1f", converted))
            }
            if let height = body.height {
                let converted = converter.convertHeight(height)
                addField("height_m", String(format: "%.2f", converted))
            }
            if let bmi = body.bmi {
                addField("bmi", String(format: "%.1f", bmi))
            }
            if let bodyFat = body.bodyFatPercentage {
                addField("body_fat_percent", String(format: "%.1f", bodyFat * 100))
            }
            if let lean = body.leanBodyMass {
                let converted = converter.convertWeight(lean)
                addField("lean_body_mass_kg", String(format: "%.1f", converted))
            }
            if let waist = body.waistCircumference {
                addField("waist_circumference_cm", converter.formatLength(waist))
            }
        }

        // Nutrition metrics
        if nutrition.hasData {
            if let energy = nutrition.dietaryEnergy {
                addField("dietary_calories", "\(Int(energy))")
            }
            if let protein = nutrition.protein {
                addField("protein_g", String(format: "%.1f", protein))
            }
            if let carbs = nutrition.carbohydrates {
                addField("carbohydrates_g", String(format: "%.1f", carbs))
            }
            if let fat = nutrition.fat {
                addField("fat_g", String(format: "%.1f", fat))
            }
            if let saturatedFat = nutrition.saturatedFat {
                addField("saturated_fat_g", String(format: "%.1f", saturatedFat))
            }
            if let fiber = nutrition.fiber {
                addField("fiber_g", String(format: "%.1f", fiber))
            }
            if let sugar = nutrition.sugar {
                addField("sugar_g", String(format: "%.1f", sugar))
            }
            if let sodium = nutrition.sodium {
                addField("sodium_mg", "\(Int(sodium))")
            }
            if let cholesterol = nutrition.cholesterol {
                addField("cholesterol_mg", String(format: "%.1f", cholesterol))
            }
            if let water = nutrition.water {
                let converted = converter.convertVolume(water)
                addField("water_l", String(format: "%.2f", converted))
            }
            if let caffeine = nutrition.caffeine {
                addField("caffeine_mg", String(format: "%.1f", caffeine))
            }
        }

        // Mindfulness metrics
        if mindfulness.hasData {
            if let minutes = mindfulness.mindfulMinutes {
                addField("mindful_minutes", "\(Int(minutes))")
            }
            if let sessions = mindfulness.mindfulSessions {
                addField("mindful_sessions", "\(sessions)")
            }
            
            // State of Mind metrics
            if !mindfulness.stateOfMind.isEmpty {
                addField("mood_entries", "\(mindfulness.stateOfMind.count)")
                
                if let avgValence = mindfulness.averageValence {
                    addField("average_mood_valence", String(format: "%.2f", avgValence))
                    let valencePercent = Int(((avgValence + 1.0) / 2.0) * 100)
                    addField("average_mood_percent", "\(valencePercent)")
                }
                
                if !mindfulness.dailyMoods.isEmpty {
                    addField("daily_mood_count", "\(mindfulness.dailyMoods.count)")
                    if let avgDailyValence = mindfulness.averageDailyMoodValence {
                        let dailyPercent = Int(((avgDailyValence + 1.0) / 2.0) * 100)
                        addField("daily_mood_percent", "\(dailyPercent)")
                    }
                }
                
                if !mindfulness.momentaryEmotions.isEmpty {
                    addField("momentary_emotion_count", "\(mindfulness.momentaryEmotions.count)")
                }
                
                // Labels as tags
                if !mindfulness.allLabels.isEmpty {
                    let labelTags = mindfulness.allLabels.map { $0.lowercased().replacingOccurrences(of: " ", with: "-") }
                    addField("mood_labels", "[\(labelTags.joined(separator: ", "))]")
                }
                
                // Associations as tags
                if !mindfulness.allAssociations.isEmpty {
                    let associationTags = mindfulness.allAssociations.map { $0.lowercased().replacingOccurrences(of: " ", with: "-") }
                    addField("mood_associations", "[\(associationTags.joined(separator: ", "))]")
                }
            }
        }

        // Mobility metrics
        if mobility.hasData {
            if let speed = mobility.walkingSpeed {
                addField("walking_speed", String(format: "%.2f", speed))
            }
            if let stepLength = mobility.walkingStepLength {
                addField("step_length_cm", String(format: "%.1f", stepLength * 100))
            }
            if let doubleSupport = mobility.walkingDoubleSupportPercentage {
                addField("double_support_percent", String(format: "%.1f", doubleSupport * 100))
            }
            if let asymmetry = mobility.walkingAsymmetryPercentage {
                addField("walking_asymmetry_percent", String(format: "%.1f", asymmetry * 100))
            }
            if let ascent = mobility.stairAscentSpeed {
                addField("stair_ascent_speed", String(format: "%.2f", ascent))
            }
            if let descent = mobility.stairDescentSpeed {
                addField("stair_descent_speed", String(format: "%.2f", descent))
            }
            if let sixMin = mobility.sixMinuteWalkDistance {
                addField("six_min_walk_m", "\(Int(sixMin))")
            }
        }

        // Hearing metrics
        if hearing.hasData {
            if let headphone = hearing.headphoneAudioLevel {
                addField("headphone_audio_db", String(format: "%.1f", headphone))
            }
            if let environmental = hearing.environmentalSoundLevel {
                addField("environmental_sound_db", String(format: "%.1f", environmental))
            }
        }

        // Workout summary
        if !workouts.isEmpty {
            addField("workout_count", "\(workouts.count)")

            let totalDuration = workouts.reduce(0.0) { $0 + $1.duration }
            addField("workout_minutes", "\(Int(totalDuration / 60))")

            let totalCalories = workouts.compactMap { $0.calories }.reduce(0.0, +)
            if totalCalories > 0 {
                addField("workout_calories", "\(Int(totalCalories))")
            }

            let totalDistance = workouts.compactMap { $0.distance }.reduce(0.0, +)
            if totalDistance > 0 {
                let converted = converter.convertDistance(totalDistance)
                addField("workout_distance_km", String(format: "%.2f", converted))
            }

            // List workout types as tags
            let workoutTypes = workouts.map { $0.workoutTypeName.lowercased().replacingOccurrences(of: " ", with: "-") }
            let uniqueTypes = Array(Set(workoutTypes))
            addField("workouts", "[\(uniqueTypes.joined(separator: ", "))]")
        }

        frontmatter.append("---")

        // Build the markdown body
        var bodyText = "\n# Health — \(dateString)\n"

        // Add a brief summary section
        var summaryItems: [String] = []

        if sleep.totalDuration > 0 {
            let hours = Int(sleep.totalDuration) / 3600
            let minutes = (Int(sleep.totalDuration) % 3600) / 60
            summaryItems.append("\(hours)h \(minutes)m sleep")
        }

        if let steps = activity.steps {
            let formatter = NumberFormatter()
            formatter.numberStyle = .decimal
            if let formatted = formatter.string(from: NSNumber(value: steps)) {
                summaryItems.append("\(formatted) steps")
            }
        }

        if let calories = nutrition.dietaryEnergy {
            summaryItems.append("\(Int(calories)) kcal")
        }

        if let minutes = mindfulness.mindfulMinutes, minutes > 0 {
            summaryItems.append("\(Int(minutes)) mindful min")
        }
        
        if let avgValence = mindfulness.averageValence {
            let valencePercent = Int(((avgValence + 1.0) / 2.0) * 100)
            summaryItems.append("mood: \(valencePercent)%")
        }

        if !workouts.isEmpty {
            let types = workouts.map { $0.workoutTypeName }
            let uniqueTypes = Array(Set(types))
            if uniqueTypes.count == 1 {
                summaryItems.append("\(workouts.count) \(uniqueTypes[0].lowercased()) workout\(workouts.count > 1 ? "s" : "")")
            } else {
                summaryItems.append("\(workouts.count) workout\(workouts.count > 1 ? "s" : "")")
            }
        }

        if !summaryItems.isEmpty {
            bodyText += "\n" + summaryItems.joined(separator: " · ") + "\n"
        }

        bodyText += "\n## Notes\n\n"

        return frontmatter.joined(separator: "\n") + bodyText
    }
}
