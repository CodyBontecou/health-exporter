import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
  HealthInputOptions,
} from 'react-native-health';
import { Platform } from 'react-native';
import {
  HealthData,
  SleepData,
  ActivityData,
  VitalsData,
  BodyData,
  WorkoutData,
  WorkoutType,
} from '../types';
import { startOfDay, endOfDay, subDays, setHours } from 'date-fns';

// HealthKit permissions we need
const healthKitPermissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.AppleExerciseTime,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.HeartRateVariability,
      AppleHealthKit.Constants.Permissions.RespiratoryRate,
      AppleHealthKit.Constants.Permissions.OxygenSaturation,
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.BodyFatPercentage,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
    write: [],
  },
};

// Map HealthKit workout activity types to our WorkoutType
function mapWorkoutType(activityType: number): WorkoutType {
  const mapping: Record<number, WorkoutType> = {
    1: 'americanFootball',
    2: 'archery',
    3: 'badminton',
    4: 'baseball',
    5: 'basketball',
    6: 'bowling',
    7: 'boxing',
    8: 'climbing',
    9: 'cricket',
    10: 'crossTraining',
    11: 'curling',
    12: 'cycling',
    13: 'dance',
    16: 'elliptical',
    17: 'fencing',
    18: 'fishing',
    19: 'functionalStrengthTraining',
    20: 'golf',
    21: 'gymnastics',
    22: 'handball',
    23: 'hiking',
    24: 'hockey',
    25: 'hunting',
    26: 'lacrosse',
    27: 'martialArts',
    28: 'mindAndBody',
    29: 'mixedCardio',
    30: 'paddleSports',
    31: 'play',
    32: 'preparationAndRecovery',
    33: 'racquetball',
    34: 'rowing',
    35: 'rugby',
    36: 'running',
    37: 'sailing',
    38: 'skatingSports',
    39: 'snowSports',
    40: 'soccer',
    41: 'softball',
    42: 'squash',
    43: 'stairClimbing',
    44: 'surfingSports',
    45: 'swimming',
    46: 'tableTennis',
    47: 'tennis',
    48: 'trackAndField',
    49: 'traditionalStrengthTraining',
    50: 'volleyball',
    51: 'walking',
    52: 'waterFitness',
    53: 'waterPolo',
    54: 'waterSports',
    55: 'wrestling',
    56: 'yoga',
  };
  return mapping[activityType] || 'other';
}

class HealthKitManager {
  private isInitialized = false;
  private isAuthorized = false;

  /**
   * Initialize HealthKit and request permissions
   */
  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('HealthKit is only available on iOS');
      return false;
    }

    if (this.isInitialized) {
      return this.isAuthorized;
    }

    return new Promise((resolve) => {
      AppleHealthKit.initHealthKit(healthKitPermissions, (error) => {
        if (error) {
          console.error('HealthKit initialization error:', error);
          this.isInitialized = true;
          this.isAuthorized = false;
          resolve(false);
        } else {
          this.isInitialized = true;
          this.isAuthorized = true;
          resolve(true);
        }
      });
    });
  }

  /**
   * Check if HealthKit is available
   */
  isAvailable(): boolean {
    return Platform.OS === 'ios';
  }

  /**
   * Check if we have authorization
   */
  hasAuthorization(): boolean {
    return this.isAuthorized;
  }

  /**
   * Fetch all health data for a specific date
   */
  async fetchHealthData(date: Date): Promise<HealthData> {
    if (!this.isAuthorized) {
      throw new Error('HealthKit not authorized');
    }

    // Fetch all data concurrently
    const [sleep, activity, vitals, body, workouts] = await Promise.all([
      this.fetchSleepData(date),
      this.fetchActivityData(date),
      this.fetchVitalsData(date),
      this.fetchBodyData(date),
      this.fetchWorkouts(date),
    ]);

    return {
      date,
      sleep,
      activity,
      vitals,
      body,
      workouts,
    };
  }

  /**
   * Fetch sleep data for a date
   * Sleep is measured from 6pm previous day to 12pm same day
   */
  private async fetchSleepData(date: Date): Promise<SleepData | null> {
    const sleepStart = setHours(subDays(date, 1), 18); // 6pm yesterday
    const sleepEnd = setHours(date, 12); // 12pm today

    return new Promise((resolve) => {
      const options: HealthInputOptions = {
        startDate: sleepStart.toISOString(),
        endDate: sleepEnd.toISOString(),
      };

      AppleHealthKit.getSleepSamples(options, (error, results) => {
        if (error || !results || results.length === 0) {
          resolve(null);
          return;
        }

        let totalDuration = 0;
        let deepSleep = 0;
        let remSleep = 0;
        let coreSleep = 0;

        for (const sample of results) {
          const start = new Date(sample.startDate);
          const end = new Date(sample.endDate);
          const duration = (end.getTime() - start.getTime()) / 1000;

          // Sleep value types: INBED, ASLEEP, AWAKE, CORE, DEEP, REM
          switch (sample.value) {
            case 'ASLEEP':
            case 'CORE':
              coreSleep += duration;
              totalDuration += duration;
              break;
            case 'DEEP':
              deepSleep += duration;
              totalDuration += duration;
              break;
            case 'REM':
              remSleep += duration;
              totalDuration += duration;
              break;
          }
        }

        if (totalDuration === 0) {
          resolve(null);
          return;
        }

        resolve({
          totalDuration,
          deepSleep,
          remSleep,
          coreSleep,
        });
      });
    });
  }

  /**
   * Fetch activity data for a date
   */
  private async fetchActivityData(date: Date): Promise<ActivityData | null> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const options: HealthInputOptions = {
      startDate: dayStart.toISOString(),
      endDate: dayEnd.toISOString(),
    };

    const [steps, calories, exercise, flights, distance] = await Promise.all([
      this.getSteps(options),
      this.getActiveCalories(options),
      this.getExerciseMinutes(options),
      this.getFlightsClimbed(options),
      this.getDistance(options),
    ]);

    if (steps === 0 && calories === 0 && exercise === 0) {
      return null;
    }

    return {
      steps,
      activeCalories: calories,
      exerciseMinutes: exercise,
      flightsClimbed: flights,
      walkingRunningDistance: distance,
    };
  }

  private getSteps(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getStepCount(options, (error, results) => {
        if (error || !results) {
          resolve(0);
        } else {
          resolve(results.value || 0);
        }
      });
    });
  }

  private getActiveCalories(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getActiveEnergyBurned(options, (error, results) => {
        if (error || !results || !Array.isArray(results)) {
          resolve(0);
        } else {
          const total = results.reduce((sum: number, r: HealthValue) => sum + (r.value || 0), 0);
          resolve(total);
        }
      });
    });
  }

  private getExerciseMinutes(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getAppleExerciseTime(options, (error, results) => {
        if (error || !results || !Array.isArray(results)) {
          resolve(0);
        } else {
          const total = results.reduce((sum: number, r: HealthValue) => sum + (r.value || 0), 0);
          resolve(total);
        }
      });
    });
  }

  private getFlightsClimbed(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getFlightsClimbed(options, (error, results) => {
        if (error || !results || !Array.isArray(results)) {
          resolve(0);
        } else {
          const total = results.reduce((sum: number, r: HealthValue) => sum + (r.value || 0), 0);
          resolve(Math.round(total));
        }
      });
    });
  }

  private getDistance(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getDistanceWalkingRunning(options, (error, results) => {
        if (error || !results || !Array.isArray(results)) {
          resolve(0);
        } else {
          // Distance is in miles, convert to meters
          const totalMiles = results.reduce((sum: number, r: HealthValue) => sum + (r.value || 0), 0);
          resolve(totalMiles * 1609.34);
        }
      });
    });
  }

  /**
   * Fetch vitals data for a date
   */
  private async fetchVitalsData(date: Date): Promise<VitalsData | null> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const options: HealthInputOptions = {
      startDate: dayStart.toISOString(),
      endDate: dayEnd.toISOString(),
    };

    const [heartRate, hrv, respiratoryRate, bloodOxygen] = await Promise.all([
      this.getRestingHeartRate(options),
      this.getHRV(options),
      this.getRespiratoryRate(options),
      this.getBloodOxygen(options),
    ]);

    if (heartRate === 0 && hrv === 0 && respiratoryRate === 0 && bloodOxygen === 0) {
      return null;
    }

    return {
      restingHeartRate: heartRate,
      hrv,
      respiratoryRate,
      bloodOxygen,
    };
  }

  private getRestingHeartRate(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getRestingHeartRate(options, (error, results) => {
        if (error || !results || !Array.isArray(results) || results.length === 0) {
          resolve(0);
        } else {
          // Get the most recent resting heart rate
          resolve(results[results.length - 1]?.value || 0);
        }
      });
    });
  }

  private getHRV(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getHeartRateVariabilitySamples(options, (error, results) => {
        if (error || !results || !Array.isArray(results) || results.length === 0) {
          resolve(0);
        } else {
          // Get the average HRV for the day
          const total = results.reduce((sum: number, r: HealthValue) => sum + (r.value || 0), 0);
          resolve(total / results.length);
        }
      });
    });
  }

  private getRespiratoryRate(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getRespiratoryRateSamples(options, (error, results) => {
        if (error || !results || !Array.isArray(results) || results.length === 0) {
          resolve(0);
        } else {
          // Get the average respiratory rate
          const total = results.reduce((sum: number, r: HealthValue) => sum + (r.value || 0), 0);
          resolve(total / results.length);
        }
      });
    });
  }

  private getBloodOxygen(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getOxygenSaturationSamples(options, (error, results) => {
        if (error || !results || !Array.isArray(results) || results.length === 0) {
          resolve(0);
        } else {
          // Get the average blood oxygen (comes as a decimal, convert to percentage)
          const total = results.reduce((sum: number, r: HealthValue) => sum + (r.value || 0), 0);
          const avg = total / results.length;
          resolve(avg > 1 ? avg : avg * 100);
        }
      });
    });
  }

  /**
   * Fetch body data for a date
   */
  private async fetchBodyData(date: Date): Promise<BodyData | null> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const options: HealthInputOptions = {
      startDate: dayStart.toISOString(),
      endDate: dayEnd.toISOString(),
    };

    const [weight, bodyFat] = await Promise.all([
      this.getWeight(options),
      this.getBodyFatPercentage(options),
    ]);

    if (weight === 0 && bodyFat === 0) {
      return null;
    }

    return {
      weight,
      bodyFatPercentage: bodyFat,
    };
  }

  private getWeight(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getWeightSamples(options, (error, results) => {
        if (error || !results || !Array.isArray(results) || results.length === 0) {
          resolve(0);
        } else {
          // Get the most recent weight in kg (HealthKit returns pounds, need to convert)
          const latestPounds = results[results.length - 1]?.value || 0;
          resolve(latestPounds * 0.453592);
        }
      });
    });
  }

  private getBodyFatPercentage(options: HealthInputOptions): Promise<number> {
    return new Promise((resolve) => {
      AppleHealthKit.getBodyFatPercentageSamples(options, (error, results) => {
        if (error || !results || !Array.isArray(results) || results.length === 0) {
          resolve(0);
        } else {
          const value = results[results.length - 1]?.value || 0;
          // Convert to percentage if needed
          resolve(value > 1 ? value : value * 100);
        }
      });
    });
  }

  /**
   * Fetch workouts for a date
   */
  private async fetchWorkouts(date: Date): Promise<WorkoutData[]> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    return new Promise((resolve) => {
      const options = {
        startDate: dayStart.toISOString(),
        endDate: dayEnd.toISOString(),
        type: 'Workout',
      };

      AppleHealthKit.getSamples(options, (error, results) => {
        if (error || !results || !Array.isArray(results)) {
          resolve([]);
          return;
        }

        const workouts: WorkoutData[] = results.map((workout: {
          activityType?: number;
          start?: string;
          startDate?: string;
          end?: string;
          endDate?: string;
          calories?: number;
          distance?: number;
        }) => {
          const start = new Date(workout.start || workout.startDate || date);
          const end = new Date(workout.end || workout.endDate || date);
          const duration = (end.getTime() - start.getTime()) / 1000;

          return {
            workoutType: mapWorkoutType(workout.activityType || 0),
            startTime: start,
            duration,
            calories: workout.calories || 0,
            distance: (workout.distance || 0) * 1609.34, // miles to meters
          };
        });

        resolve(workouts);
      });
    });
  }
}

// Export singleton instance
export const healthKitManager = new HealthKitManager();
