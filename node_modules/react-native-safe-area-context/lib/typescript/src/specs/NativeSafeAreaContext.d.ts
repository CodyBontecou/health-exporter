import { TurboModule } from 'react-native';
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';
export interface Spec extends TurboModule {
    getConstants: () => {
        initialWindowMetrics?: {
            insets: {
                top: Double;
                right: Double;
                bottom: Double;
                left: Double;
            };
            frame: {
                x: Double;
                y: Double;
                width: Double;
                height: Double;
            };
        };
    };
}
declare const _default: Spec | null;
export default _default;
//# sourceMappingURL=NativeSafeAreaContext.d.ts.map