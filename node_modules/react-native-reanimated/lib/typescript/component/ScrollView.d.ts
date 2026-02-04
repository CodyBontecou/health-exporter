import React from 'react';
import type { ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native';
import type { SharedValue } from '../commonTypes';
import type { AnimatedProps } from '../helperTypes';
export interface AnimatedScrollViewProps extends AnimatedProps<ScrollViewProps> {
    scrollViewOffset?: SharedValue<number>;
}
interface AnimatedScrollViewComplement extends ScrollView {
    getNode(): ScrollView;
}
declare const AnimatedScrollViewComponent: React.ComponentClass<import("../helperTypes").AnimateProps<ScrollViewProps>, any>;
export declare const AnimatedScrollView: React.ForwardRefExoticComponent<AnimatedScrollViewProps & React.RefAttributes<AnimatedScrollView>>;
export type AnimatedScrollView = AnimatedScrollViewComplement & typeof AnimatedScrollViewComponent;
export {};
//# sourceMappingURL=ScrollView.d.ts.map