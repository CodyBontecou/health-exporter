// Health data types matching the Swift models

export interface SleepData {
  totalDuration: number; // seconds
  deepSleep: number; // seconds
  remSleep: number; // seconds
  coreSleep: number; // seconds
}

export interface ActivityData {
  steps: number;
  activeCalories: number;
  exerciseMinutes: number;
  flightsClimbed: number;
  walkingRunningDistance: number; // meters
}

export interface VitalsData {
  restingHeartRate: number; // bpm
  hrv: number; // milliseconds
  respiratoryRate: number; // breaths per minute
  bloodOxygen: number; // percentage (0-100)
}

export interface BodyData {
  weight: number; // kg
  bodyFatPercentage: number;
}

export type WorkoutType =
  | 'americanFootball'
  | 'archery'
  | 'badminton'
  | 'baseball'
  | 'basketball'
  | 'bowling'
  | 'boxing'
  | 'climbing'
  | 'cricket'
  | 'crossTraining'
  | 'curling'
  | 'cycling'
  | 'dance'
  | 'elliptical'
  | 'fencing'
  | 'fishing'
  | 'functionalStrengthTraining'
  | 'golf'
  | 'gymnastics'
  | 'handball'
  | 'hiking'
  | 'hockey'
  | 'hunting'
  | 'lacrosse'
  | 'martialArts'
  | 'mindAndBody'
  | 'mixedCardio'
  | 'paddleSports'
  | 'play'
  | 'preparationAndRecovery'
  | 'racquetball'
  | 'rowing'
  | 'rugby'
  | 'running'
  | 'sailing'
  | 'skatingSports'
  | 'snowSports'
  | 'soccer'
  | 'softball'
  | 'squash'
  | 'stairClimbing'
  | 'surfingSports'
  | 'swimming'
  | 'tableTennis'
  | 'tennis'
  | 'trackAndField'
  | 'traditionalStrengthTraining'
  | 'volleyball'
  | 'walking'
  | 'waterFitness'
  | 'waterPolo'
  | 'waterSports'
  | 'wrestling'
  | 'yoga'
  | 'other';

export interface WorkoutData {
  workoutType: WorkoutType;
  startTime: Date;
  duration: number; // seconds
  calories: number;
  distance: number; // meters
}

export interface HealthData {
  date: Date;
  sleep: SleepData | null;
  activity: ActivityData | null;
  vitals: VitalsData | null;
  body: BodyData | null;
  workouts: WorkoutData[];
}

// Workout type display names
export const workoutTypeDisplayNames: Record<WorkoutType, string> = {
  americanFootball: 'American Football',
  archery: 'Archery',
  badminton: 'Badminton',
  baseball: 'Baseball',
  basketball: 'Basketball',
  bowling: 'Bowling',
  boxing: 'Boxing',
  climbing: 'Climbing',
  cricket: 'Cricket',
  crossTraining: 'Cross Training',
  curling: 'Curling',
  cycling: 'Cycling',
  dance: 'Dance',
  elliptical: 'Elliptical',
  fencing: 'Fencing',
  fishing: 'Fishing',
  functionalStrengthTraining: 'Functional Strength Training',
  golf: 'Golf',
  gymnastics: 'Gymnastics',
  handball: 'Handball',
  hiking: 'Hiking',
  hockey: 'Hockey',
  hunting: 'Hunting',
  lacrosse: 'Lacrosse',
  martialArts: 'Martial Arts',
  mindAndBody: 'Mind and Body',
  mixedCardio: 'Mixed Cardio',
  paddleSports: 'Paddle Sports',
  play: 'Play',
  preparationAndRecovery: 'Preparation and Recovery',
  racquetball: 'Racquetball',
  rowing: 'Rowing',
  rugby: 'Rugby',
  running: 'Running',
  sailing: 'Sailing',
  skatingSports: 'Skating Sports',
  snowSports: 'Snow Sports',
  soccer: 'Soccer',
  softball: 'Softball',
  squash: 'Squash',
  stairClimbing: 'Stair Climbing',
  surfingSports: 'Surfing Sports',
  swimming: 'Swimming',
  tableTennis: 'Table Tennis',
  tennis: 'Tennis',
  trackAndField: 'Track and Field',
  traditionalStrengthTraining: 'Traditional Strength Training',
  volleyball: 'Volleyball',
  walking: 'Walking',
  waterFitness: 'Water Fitness',
  waterPolo: 'Water Polo',
  waterSports: 'Water Sports',
  wrestling: 'Wrestling',
  yoga: 'Yoga',
  other: 'Other',
};
