import { TurboModule } from 'react-native';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
export interface Spec extends TurboModule {
    handleSetJSResponder: (tag: Double, blockNativeResponder: boolean) => void;
    handleClearJSResponder: () => void;
    createGestureHandler: (handlerName: string, handlerTag: Double, config: Object) => void;
    attachGestureHandler: (handlerTag: Double, newView: Double, actionType: Double) => void;
    updateGestureHandler: (handlerTag: Double, newConfig: Object) => void;
    dropGestureHandler: (handlerTag: Double) => void;
    install: () => boolean;
    flushOperations: () => void;
}
declare const _default: Spec;
export default _default;
