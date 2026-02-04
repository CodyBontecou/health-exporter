/// <reference types="react" />
import type { StyleProps } from '../commonTypes';
import type { IAnimatedComponentInternal, IInlinePropManager, ViewInfo } from './commonTypes';
import type { ViewDescriptorsSet } from '../ViewDescriptorsSet';
export declare function hasInlineStyles(style: StyleProps): boolean;
export declare function getInlineStyle(style: Record<string, unknown>, isFirstRender: boolean): StyleProps | Record<string, unknown>;
export declare class InlinePropManager implements IInlinePropManager {
    _inlinePropsViewDescriptors: ViewDescriptorsSet | null;
    _inlinePropsMapperId: number | null;
    _inlineProps: StyleProps;
    attachInlineProps(animatedComponent: React.Component<unknown, unknown> & IAnimatedComponentInternal, viewInfo: ViewInfo): void;
    detachInlineProps(): void;
}
//# sourceMappingURL=InlinePropManager.d.ts.map