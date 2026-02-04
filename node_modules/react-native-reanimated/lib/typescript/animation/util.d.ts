import type { StyleLayoutAnimation } from './commonTypes';
import { ReduceMotion } from '../commonTypes';
import type { SharedValue, AnimatableValue, AnimationObject, EasingFunction } from '../commonTypes';
import type { EasingFunctionFactory } from '../Easing';
export declare function assertEasingIsWorklet(easing: EasingFunction | EasingFunctionFactory): void;
export declare function initialUpdaterRun<T>(updater: () => T): T;
interface RecognizedPrefixSuffix {
    prefix?: string;
    suffix?: string;
    strippedValue: number;
}
export declare function recognizePrefixSuffix(value: string | number): RecognizedPrefixSuffix;
export declare function getReduceMotionFromConfig(config?: ReduceMotion): boolean;
/**
 * Returns the value that should be assigned to `animation.reduceMotion` for a
 * given config. If the config is not defined, `undefined` is returned.
 */
export declare function getReduceMotionForAnimation(config?: ReduceMotion): boolean | undefined;
type AnimationToDecoration<T extends AnimationObject | StyleLayoutAnimation, U extends AnimationObject | StyleLayoutAnimation> = T extends StyleLayoutAnimation ? Record<string, unknown> : U | (() => U) | AnimatableValue;
export declare function defineAnimation<T extends AnimationObject | StyleLayoutAnimation, // type that's supposed to be returned
U extends AnimationObject | StyleLayoutAnimation = T>(starting: AnimationToDecoration<T, U>, factory: () => T): T;
/**
 * Lets you cancel a running animation paired to a shared value.
 *
 * @param sharedValue - The shared value of a running animation that you want to
 *   cancel.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/cancelAnimation
 */
export declare function cancelAnimation<T>(sharedValue: SharedValue<T>): void;
export {};
//# sourceMappingURL=util.d.ts.map