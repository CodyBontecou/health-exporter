import type { MutableRefObject } from 'react';
import type { StyleProps, AnimatedStyle } from './commonTypes';
import type { Descriptor } from './hook/commonTypes';
declare let updateProps: (viewDescriptors: ViewDescriptorsWrapper, updates: StyleProps | AnimatedStyle<any>, isAnimatedProps?: boolean) => void;
export declare const updatePropsJestWrapper: (viewDescriptors: ViewDescriptorsWrapper, updates: AnimatedStyle<any>, animatedStyle: MutableRefObject<AnimatedStyle<any>>, adapters: ((updates: AnimatedStyle<any>) => void)[]) => void;
export default updateProps;
export interface UpdatePropsManager {
    update(viewDescriptors: ViewDescriptorsWrapper, updates: StyleProps | AnimatedStyle<any>): void;
    flush(): void;
}
/**
 * This used to be `SharedValue<Descriptors[]>` but objects holding just a
 * single `value` prop are fine too.
 */
interface ViewDescriptorsWrapper {
    value: Readonly<Descriptor[]>;
}
//# sourceMappingURL=UpdateProps.d.ts.map