import type { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps, HostComponent } from 'react-native';
export interface NativeProps extends ViewProps {
    mode?: WithDefault<'padding' | 'margin', 'padding'>;
    edges?: Readonly<{
        top: string;
        right: string;
        bottom: string;
        left: string;
    }>;
}
declare const _default: HostComponent<NativeProps>;
export default _default;
//# sourceMappingURL=NativeSafeAreaView.d.ts.map