import * as React from 'react';
import GenericTouchable from './GenericTouchable';
import type { GenericTouchableProps } from './GenericTouchableProps';
export type TouchableWithoutFeedbackProps = GenericTouchableProps;
declare const TouchableWithoutFeedback: React.ForwardRefExoticComponent<GenericTouchableProps & {
    children?: React.ReactNode;
} & React.RefAttributes<GenericTouchable>>;
export default TouchableWithoutFeedback;
