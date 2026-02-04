import type { StyleProp, ViewStyle, TouchableWithoutFeedbackProps, Insets } from 'react-native';
import type { UserSelect } from '../../handlers/gestureHandlerCommon';
export interface GenericTouchableProps extends Omit<TouchableWithoutFeedbackProps, 'hitSlop'> {
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    onLongPress?: () => void;
    nativeID?: string;
    shouldActivateOnStart?: boolean;
    disallowInterruption?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    hitSlop?: Insets | number;
    userSelect?: UserSelect;
}
