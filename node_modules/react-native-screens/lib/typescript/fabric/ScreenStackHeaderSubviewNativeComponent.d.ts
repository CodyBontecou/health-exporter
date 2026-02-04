/// <reference types="react-native/types/modules/Codegen" />
import type { ViewProps } from 'react-native';
import type { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
export type HeaderSubviewTypes = 'back' | 'right' | 'left' | 'title' | 'center' | 'searchBar';
export interface NativeProps extends ViewProps {
    type?: WithDefault<HeaderSubviewTypes, 'left'>;
}
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;
//# sourceMappingURL=ScreenStackHeaderSubviewNativeComponent.d.ts.map