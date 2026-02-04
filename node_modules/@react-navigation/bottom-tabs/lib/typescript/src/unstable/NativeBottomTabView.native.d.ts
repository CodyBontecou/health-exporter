import { type ParamListBase, type TabNavigationState } from '@react-navigation/native';
import type { NativeBottomTabDescriptorMap, NativeBottomTabNavigationConfig, NativeBottomTabNavigationHelpers } from './types';
type Props = NativeBottomTabNavigationConfig & {
    state: TabNavigationState<ParamListBase>;
    navigation: NativeBottomTabNavigationHelpers;
    descriptors: NativeBottomTabDescriptorMap;
};
export declare function NativeBottomTabView({ state, navigation, descriptors }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NativeBottomTabView.native.d.ts.map