import type { SharedTransitionAnimationsValues, CustomProgressAnimation } from '../animationBuilder/commonTypes';
import { SharedTransitionType } from '../animationBuilder/commonTypes';
import type { StyleProps } from '../../commonTypes';
import { ReduceMotion } from '../../commonTypes';
type AnimationFactory = (values: SharedTransitionAnimationsValues) => StyleProps;
/**
 * A SharedTransition builder class.
 *
 * @experimental
 * @see https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview
 */
export declare class SharedTransition {
    private _customAnimationFactory;
    private _animation;
    private _transitionDuration;
    private _reduceMotion;
    private _customProgressAnimation?;
    private _progressAnimation?;
    private _defaultTransitionType?;
    private static _progressTransitionManager;
    custom(customAnimationFactory: AnimationFactory): SharedTransition;
    progressAnimation(progressAnimationCallback: CustomProgressAnimation): SharedTransition;
    duration(duration: number): SharedTransition;
    reduceMotion(_reduceMotion: ReduceMotion): this;
    defaultTransitionType(transitionType: SharedTransitionType): SharedTransition;
    registerTransition(viewTag: number, sharedTransitionTag: string, isUnmounting?: boolean): void;
    unregisterTransition(viewTag: number, isUnmounting?: boolean): void;
    getReduceMotion(): ReduceMotion;
    private getTransitionAnimation;
    private getProgressAnimation;
    private buildAnimation;
    private buildProgressAnimation;
    /**
     * Lets you create a custom shared transition animation. Other shared
     * transition modifiers can be chained alongside this modifier.
     *
     * @param customAnimationFactory - Callback function that have to return an
     *   object with styles for the custom shared transition.
     * @returns A {@link SharedTransition} object. Styles returned from this
     *   function need to be to the `sharedTransitionStyle` prop.
     * @experimental
     * @see https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview
     */
    static custom(customAnimationFactory: AnimationFactory): SharedTransition;
    /**
     * Lets you change the duration of the shared transition. Other shared
     * transition modifiers can be chained alongside this modifier.
     *
     * @param duration - The duration of the shared transition animation in
     *   milliseconds.
     * @experimental
     * @see https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview
     */
    static duration(duration: number): SharedTransition;
    /**
     * Lets you create a shared transition animation bound to the progress between
     * navigation screens. Other shared transition modifiers can be chained
     * alongside this modifier.
     *
     * @param progressAnimationCallback - A callback called with the current
     *   progress value on every animation frame. It should return an object with
     *   styles for the shared transition.
     * @experimental
     * @see https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview
     */
    static progressAnimation(progressAnimationCallback: CustomProgressAnimation): SharedTransition;
    /**
     * Whether the transition is progress-bound or not. Other shared transition
     * modifiers can be chained alongside this modifier.
     *
     * @param transitionType - Type of the transition. Configured with
     *   {@link SharedTransitionType} enum.
     * @experimental
     * @see https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview
     */
    static defaultTransitionType(transitionType: SharedTransitionType): SharedTransition;
    /**
     * Lets you adjust the behavior when the device's reduced motion accessibility
     * setting is turned on. Other shared transition modifiers can be chained
     * alongside this modifier.
     *
     * @param reduceMotion - Determines how the animation responds to the device's
     *   reduced motion accessibility setting. Default to `ReduceMotion.System` -
     *   {@link ReduceMotion}.
     * @experimental
     * @see https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview
     */
    static reduceMotion(reduceMotion: ReduceMotion): SharedTransition;
}
export {};
//# sourceMappingURL=SharedTransition.d.ts.map