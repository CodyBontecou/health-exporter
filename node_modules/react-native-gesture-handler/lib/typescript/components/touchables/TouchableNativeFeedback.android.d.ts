import { ColorValue } from 'react-native';
import * as React from 'react';
import { Component } from 'react';
import { TouchableNativeFeedbackProps, TouchableNativeFeedbackExtraProps } from './TouchableNativeFeedbackProps';
/**
 * TouchableNativeFeedback behaves slightly different than RN's TouchableNativeFeedback.
 * There's small difference with handling long press ripple since RN's implementation calls
 * ripple animation via bridge. This solution leaves all animations' handling for native components so
 * it follows native behaviours.
 */
export default class TouchableNativeFeedback extends Component<TouchableNativeFeedbackProps> {
    static defaultProps: {
        useForeground: boolean;
        extraButtonProps: {
            rippleColor: null;
        };
        delayLongPress: number;
    };
    static SelectableBackground: (rippleRadius?: number) => {
        type: string;
        attribute: string;
        rippleRadius: number | undefined;
    };
    static SelectableBackgroundBorderless: (rippleRadius?: number) => {
        type: string;
        attribute: string;
        rippleRadius: number | undefined;
    };
    static Ripple: (color: ColorValue, borderless: boolean, rippleRadius?: number) => {
        type: string;
        color: ColorValue;
        borderless: boolean;
        rippleRadius: number | undefined;
    };
    static canUseNativeForeground: () => boolean;
    getExtraButtonProps(): TouchableNativeFeedbackExtraProps;
    render(): React.JSX.Element;
}
