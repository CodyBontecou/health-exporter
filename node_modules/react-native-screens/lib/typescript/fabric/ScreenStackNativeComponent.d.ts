/// <reference types="react-native/types/modules/Codegen" />
import type { ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
type FinishTransitioningEvent = Readonly<{}>;
export interface NativeProps extends ViewProps {
    onFinishTransitioning?: DirectEventHandler<FinishTransitioningEvent>;
}
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;
//# sourceMappingURL=ScreenStackNativeComponent.d.ts.map