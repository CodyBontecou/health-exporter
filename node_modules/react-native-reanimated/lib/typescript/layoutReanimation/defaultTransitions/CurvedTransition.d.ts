import type { ILayoutAnimationBuilder, LayoutAnimationFunction } from '../animationBuilder/commonTypes';
import { BaseAnimationBuilder } from '../animationBuilder';
import type { EasingFunction } from '../../commonTypes';
/**
 * Layout transitions with a curved animation. You can modify the behavior by
 * chaining methods like `.duration(500)` or `.delay(500)`.
 *
 * You pass it to the `layout` prop on [an Animated
 * component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/layout-transitions#fading-transition
 */
export declare class CurvedTransition extends BaseAnimationBuilder implements ILayoutAnimationBuilder {
    static presetName: string;
    easingXV: EasingFunction;
    easingYV: EasingFunction;
    easingWidthV: EasingFunction;
    easingHeightV: EasingFunction;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static easingX(easing: EasingFunction): CurvedTransition;
    easingX(easing: EasingFunction): CurvedTransition;
    static easingY(easing: EasingFunction): CurvedTransition;
    easingY(easing: EasingFunction): CurvedTransition;
    static easingWidth(easing: EasingFunction): CurvedTransition;
    easingWidth(easing: EasingFunction): CurvedTransition;
    static easingHeight(easing: EasingFunction): CurvedTransition;
    easingHeight(easing: EasingFunction): CurvedTransition;
    build: () => LayoutAnimationFunction;
}
//# sourceMappingURL=CurvedTransition.d.ts.map