import { ScreenProps } from '../types';
import { Animated, View } from 'react-native';
import React from 'react';
export declare const InnerScreen: typeof View;
export declare class NativeScreen extends React.Component<ScreenProps> {
    render(): JSX.Element;
}
declare const Screen: Animated.AnimatedComponent<typeof NativeScreen>;
export declare const ScreenContext: React.Context<Animated.AnimatedComponent<typeof NativeScreen>>;
export default Screen;
//# sourceMappingURL=Screen.web.d.ts.map