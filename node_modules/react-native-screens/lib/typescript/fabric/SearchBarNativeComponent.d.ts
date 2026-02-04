/// <reference types="react" />
/// <reference types="react-native/types/modules/Codegen" />
import type { ViewProps, ColorValue, HostComponent } from 'react-native';
import type { WithDefault, DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
export type SearchBarEvent = Readonly<{}>;
export type SearchButtonPressedEvent = Readonly<{
    text?: string;
}>;
export type ChangeTextEvent = Readonly<{
    text?: string;
}>;
type SearchBarPlacement = 'automatic' | 'inline' | 'stacked';
type AutoCapitalizeType = 'none' | 'words' | 'sentences' | 'characters';
export interface NativeProps extends ViewProps {
    onSearchFocus?: DirectEventHandler<SearchBarEvent> | null;
    onSearchBlur?: DirectEventHandler<SearchBarEvent> | null;
    onSearchButtonPress?: DirectEventHandler<SearchButtonPressedEvent> | null;
    onCancelButtonPress?: DirectEventHandler<SearchBarEvent> | null;
    onChangeText?: DirectEventHandler<ChangeTextEvent> | null;
    hideWhenScrolling?: boolean;
    autoCapitalize?: WithDefault<AutoCapitalizeType, 'none'>;
    placeholder?: string;
    placement?: WithDefault<SearchBarPlacement, 'stacked'>;
    obscureBackground?: boolean;
    hideNavigationBar?: boolean;
    cancelButtonText?: string;
    barTintColor?: ColorValue;
    tintColor?: ColorValue;
    textColor?: ColorValue;
    disableBackButtonOverride?: boolean;
    inputType?: string;
    onClose?: DirectEventHandler<SearchBarEvent> | null;
    onOpen?: DirectEventHandler<SearchBarEvent> | null;
    hintTextColor?: ColorValue;
    headerIconColor?: ColorValue;
    shouldShowHintSearchIcon?: WithDefault<boolean, true>;
}
type ComponentType = HostComponent<NativeProps>;
interface NativeCommands {
    blur: (viewRef: React.ElementRef<ComponentType>) => void;
    focus: (viewRef: React.ElementRef<ComponentType>) => void;
    clearText: (viewRef: React.ElementRef<ComponentType>) => void;
    toggleCancelButton: (viewRef: React.ElementRef<ComponentType>, flag: boolean) => void;
    setText: (viewRef: React.ElementRef<ComponentType>, text: string) => void;
    cancelSearch: (viewRef: React.ElementRef<ComponentType>) => void;
}
export declare const Commands: NativeCommands;
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;
//# sourceMappingURL=SearchBarNativeComponent.d.ts.map