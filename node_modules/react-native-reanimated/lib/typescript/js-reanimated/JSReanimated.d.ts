/// <reference types="react" />
import type { ShareableRef, Value3D, ValueRotation } from '../commonTypes';
import { SensorType } from '../commonTypes';
import type { WebSensor } from './WebSensor';
import type { WorkletRuntime } from '../runtimes';
export default class JSReanimated {
    nextSensorId: number;
    sensors: Map<number, WebSensor>;
    platform?: Platform;
    makeShareableClone<T>(): ShareableRef<T>;
    scheduleOnUI<T>(worklet: ShareableRef<T>): void;
    createWorkletRuntime(_name: string, _initializer: ShareableRef<() => void>): WorkletRuntime;
    scheduleOnRuntime(): void;
    registerEventHandler<T>(_eventHandler: ShareableRef<T>, _eventName: string, _emitterReactTag: number): number;
    unregisterEventHandler(_: number): void;
    enableLayoutAnimations(): void;
    configureLayoutAnimationBatch(): void;
    setShouldAnimateExitingForTag(): void;
    registerSensor(sensorType: SensorType, interval: number, _iosReferenceFrame: number, eventHandler: ShareableRef<(data: Value3D | ValueRotation) => void>): number;
    getSensorCallback: (sensor: WebSensor, sensorType: SensorType, eventHandler: ShareableRef<(data: Value3D | ValueRotation) => void>) => () => void;
    unregisterSensor(id: number): void;
    subscribeForKeyboardEvents(_: ShareableRef<number>): number;
    unsubscribeFromKeyboardEvents(_: number): void;
    initializeSensor(sensorType: SensorType, interval: number): WebSensor;
    getSensorName(sensorType: SensorType): string;
    detectPlatform(): void;
    getViewProp<T>(_viewTag: number, _propName: string, _component?: React.Component, _callback?: (result: T) => void): Promise<T>;
    configureProps(): void;
    executeOnUIRuntimeSync<T, R>(_shareable: ShareableRef<T>): R;
}
declare enum Platform {
    WEB_IOS = "web iOS",
    WEB_ANDROID = "web Android",
    WEB = "web",
    UNKNOWN = "unknown"
}
declare global {
    interface Navigator {
        userAgent: string;
        vendor: string;
    }
}
export {};
//# sourceMappingURL=JSReanimated.d.ts.map