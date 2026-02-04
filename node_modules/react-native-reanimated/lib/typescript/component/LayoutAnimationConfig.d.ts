import React, { Component } from 'react';
import type { ReactNode } from 'react';
export declare const SkipEnteringContext: React.Context<React.MutableRefObject<boolean> | null>;
interface LayoutAnimationConfigProps {
    skipEntering?: boolean;
    skipExiting?: boolean;
    children: ReactNode;
}
/**
 * A component that lets you skip entering and exiting animations.
 *
 * @param skipEntering - A boolean indicating whether children's entering
 *   animations should be skipped when `LayoutAnimationConfig` is mounted.
 * @param skipExiting - A boolean indicating whether children's exiting
 *   animations should be skipped when LayoutAnimationConfig is unmounted.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/layout-animation-config/
 */
export declare class LayoutAnimationConfig extends Component<LayoutAnimationConfigProps> {
    getMaybeWrappedChildren(): string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.JSX.Element[] | null | undefined;
    setShouldAnimateExiting(): void;
    componentWillUnmount(): void;
    render(): ReactNode;
}
export {};
//# sourceMappingURL=LayoutAnimationConfig.d.ts.map