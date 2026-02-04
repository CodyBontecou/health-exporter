import { type ParamListBase, type TabNavigationState } from '@react-navigation/native';
import type { NativeBottomTabDescriptorMap, NativeBottomTabNavigationConfig, NativeBottomTabNavigationHelpers } from './types';
type Props = NativeBottomTabNavigationConfig & {
    state: TabNavigationState<ParamListBase>;
    navigation: NativeBottomTabNavigationHelpers;
    descriptors: NativeBottomTabDescriptorMap;
};
export declare function NativeBottomTabView(_: Props): void;
export {};
//# sourceMappingURL=NativeBottomTabView.d.ts.map