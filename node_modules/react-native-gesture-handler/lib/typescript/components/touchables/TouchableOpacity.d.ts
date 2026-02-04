import { Animated, TouchableOpacityProps as RNTouchableOpacityProps } from 'react-native';
import type { GenericTouchableProps } from './GenericTouchableProps';
import * as React from 'react';
import { Component } from 'react';
export type TouchableOpacityProps = RNTouchableOpacityProps & GenericTouchableProps & {
    useNativeAnimations?: boolean;
};
/**
 * TouchableOpacity bases on timing animation which has been used in RN's core
 */
export default class TouchableOpacity extends Component<TouchableOpacityProps> {
    static defaultProps: {
        activeOpacity: number;
        delayLongPress: number;
        extraButtonProps: {
            rippleColor: string;
            exclusive: boolean;
        };
    };
    getChildStyleOpacityWithDefault: () => number;
    opacity: Animated.Value;
    setOpacityTo: (value: number, duration: number) => void;
    onStateChange: (_from: number, to: number) => void;
    render(): React.JSX.Element;
}
