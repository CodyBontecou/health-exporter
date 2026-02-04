import type { DirectEventHandler, Double } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps, HostComponent } from 'react-native';
export type Event = Readonly<{
    insets: Readonly<{
        top: Double;
        right: Double;
        bottom: Double;
        left: Double;
    }>;
    frame: Readonly<{
        x: Double;
        y: Double;
        width: Double;
        height: Double;
    }>;
}>;
export interface NativeProps extends ViewProps {
    onInsetsChange?: DirectEventHandler<Event>;
}
declare const _default: HostComponent<NativeProps>;
export default _default;
//# sourceMappingURL=NativeSafeAreaProvider.d.ts.map