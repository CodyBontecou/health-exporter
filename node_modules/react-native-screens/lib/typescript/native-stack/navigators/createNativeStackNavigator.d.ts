import { StackNavigationState, ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { NativeStackNavigationEventMap, NativeStackNavigationOptions, NativeStackNavigatorProps } from '../types';
declare function NativeStackNavigator({ initialRouteName, children, screenOptions, ...rest }: NativeStackNavigatorProps): React.JSX.Element;
/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
declare const _default: <ParamList extends Record<string, object | undefined>>() => import("@react-navigation/native").TypedNavigator<ParamList, StackNavigationState<ParamListBase>, NativeStackNavigationOptions, NativeStackNavigationEventMap, typeof NativeStackNavigator>;
export default _default;
//# sourceMappingURL=createNativeStackNavigator.d.ts.map