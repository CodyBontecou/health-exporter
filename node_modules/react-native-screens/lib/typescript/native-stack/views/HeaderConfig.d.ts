/// <reference types="react" />
import { Route } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '../types';
type Props = NativeStackNavigationOptions & {
    route: Route<string>;
};
export default function HeaderConfig({ backButtonImage, backButtonInCustomView, direction, disableBackButtonMenu, backButtonDisplayMode, headerBackTitle, headerBackTitleStyle, headerBackTitleVisible, headerCenter, headerHideBackButton, headerHideShadow, headerLargeStyle, headerLargeTitle, headerLargeTitleHideShadow, headerLargeTitleStyle, headerLeft, headerRight, headerShown, headerStyle, headerTintColor, headerTitle, headerTitleStyle, headerTopInsetEnabled, headerTranslucent, route, searchBar, title, }: Props): JSX.Element;
export {};
//# sourceMappingURL=HeaderConfig.d.ts.map