import { type DefaultNavigatorOptions, type NavigationListBase, type ParamListBase, type StackNavigationState, type TypedNavigator } from '@react-navigation/core';
declare const StackNavigator: (props: DefaultNavigatorOptions<ParamListBase, string | undefined, StackNavigationState<ParamListBase>, {}, {}, unknown>) => import("react/jsx-runtime").JSX.Element;
export declare function createStackNavigator<ParamList extends ParamListBase>(): TypedNavigator<{
    ParamList: ParamList;
    NavigatorID: string | undefined;
    State: StackNavigationState<ParamList>;
    ScreenOptions: {};
    EventMap: {};
    NavigationList: NavigationListBase<ParamList>;
    Navigator: typeof StackNavigator;
}>;
export {};
//# sourceMappingURL=createStackNavigator.d.ts.map