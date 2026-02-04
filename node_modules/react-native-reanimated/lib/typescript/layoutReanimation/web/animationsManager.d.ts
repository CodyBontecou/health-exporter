import type { AnimatedComponentProps } from '../../createAnimatedComponent/commonTypes';
import { LayoutAnimationType } from '../animationBuilder/commonTypes';
import type { TransitionData } from './animationParser';
import type { ReanimatedHTMLElement } from '../../js-reanimated';
export declare function startWebLayoutAnimation<ComponentProps extends Record<string, unknown>>(props: Readonly<AnimatedComponentProps<ComponentProps>>, element: ReanimatedHTMLElement, animationType: LayoutAnimationType, transitionData?: TransitionData): void;
export declare function tryActivateLayoutTransition<ComponentProps extends Record<string, unknown>>(props: Readonly<AnimatedComponentProps<ComponentProps>>, element: ReanimatedHTMLElement, snapshot: DOMRect): void;
//# sourceMappingURL=animationsManager.d.ts.map