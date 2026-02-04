import { ValueOf } from '../../typeUtils';
import { Gestures } from '../Gestures';
import type IGestureHandler from '../handlers/IGestureHandler';
export default abstract class NodeManager {
    private static gestures;
    static getHandler(tag: number): IGestureHandler;
    static createGestureHandler(handlerTag: number, handler: InstanceType<ValueOf<typeof Gestures>>): void;
    static dropGestureHandler(handlerTag: number): void;
    static getNodes(): {
        [x: number]: import("../handlers/PanGestureHandler").default | import("../handlers/TapGestureHandler").default | import("../handlers/LongPressGestureHandler").default | import("../handlers/PinchGestureHandler").default | import("../handlers/RotationGestureHandler").default | import("../handlers/FlingGestureHandler").default | import("../handlers/NativeViewGestureHandler").default | import("../handlers/ManualGestureHandler").default | import("../handlers/HoverGestureHandler").default;
    };
}
