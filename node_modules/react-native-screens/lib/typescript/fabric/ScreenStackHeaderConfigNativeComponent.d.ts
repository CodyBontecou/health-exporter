/// <reference types="react-native/types/modules/Codegen" />
import type { ViewProps, ColorValue } from 'react-native';
import type { Int32, WithDefault, DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
type DirectionType = 'rtl' | 'ltr';
type OnAttachedEvent = Readonly<{}>;
type OnDetachedEvent = Readonly<{}>;
type BackButtonDisplayMode = 'minimal' | 'default' | 'generic';
type BlurEffect = 'none' | 'extraLight' | 'light' | 'dark' | 'regular' | 'prominent' | 'systemUltraThinMaterial' | 'systemThinMaterial' | 'systemMaterial' | 'systemThickMaterial' | 'systemChromeMaterial' | 'systemUltraThinMaterialLight' | 'systemThinMaterialLight' | 'systemMaterialLight' | 'systemThickMaterialLight' | 'systemChromeMaterialLight' | 'systemUltraThinMaterialDark' | 'systemThinMaterialDark' | 'systemMaterialDark' | 'systemThickMaterialDark' | 'systemChromeMaterialDark';
export interface NativeProps extends ViewProps {
    onAttached?: DirectEventHandler<OnAttachedEvent>;
    onDetached?: DirectEventHandler<OnDetachedEvent>;
    backgroundColor?: ColorValue;
    backTitle?: string;
    backTitleFontFamily?: string;
    backTitleFontSize?: Int32;
    backTitleVisible?: WithDefault<boolean, 'true'>;
    color?: ColorValue;
    direction?: WithDefault<DirectionType, 'ltr'>;
    hidden?: boolean;
    hideShadow?: boolean;
    largeTitle?: boolean;
    largeTitleFontFamily?: string;
    largeTitleFontSize?: Int32;
    largeTitleFontWeight?: string;
    largeTitleBackgroundColor?: ColorValue;
    largeTitleHideShadow?: boolean;
    largeTitleColor?: ColorValue;
    translucent?: boolean;
    title?: string;
    titleFontFamily?: string;
    titleFontSize?: Int32;
    titleFontWeight?: string;
    titleColor?: ColorValue;
    disableBackButtonMenu?: boolean;
    backButtonDisplayMode?: WithDefault<BackButtonDisplayMode, 'default'>;
    hideBackButton?: boolean;
    backButtonInCustomView?: boolean;
    blurEffect?: WithDefault<BlurEffect, 'none'>;
    topInsetEnabled?: boolean;
}
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;
//# sourceMappingURL=ScreenStackHeaderConfigNativeComponent.d.ts.map