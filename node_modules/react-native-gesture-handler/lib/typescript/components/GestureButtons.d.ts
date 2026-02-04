import * as React from 'react';
import type { BaseButtonProps, RectButtonProps, BorderlessButtonProps } from './GestureButtonsProps';
export declare const RawButton: React.ForwardRefExoticComponent<import("./GestureButtonsProps").RawButtonProps & import("..").NativeViewGestureHandlerProps & React.RefAttributes<React.ComponentType<any>>>;
export declare const BaseButton: React.ForwardRefExoticComponent<Omit<BaseButtonProps, "innerRef"> & React.RefAttributes<any>>;
export declare const RectButton: React.ForwardRefExoticComponent<Omit<RectButtonProps, "innerRef"> & React.RefAttributes<any>>;
export declare const BorderlessButton: React.ForwardRefExoticComponent<Omit<BorderlessButtonProps, "innerRef"> & React.RefAttributes<any>>;
export { default as PureNativeButton } from './GestureHandlerButton';
