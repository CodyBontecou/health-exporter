import type { SensorType, SensorConfig, Value3D, ValueRotation, ShareableRef, SharedValue } from './commonTypes';
export declare class SensorContainer {
    private nativeSensors;
    getSensorId(sensorType: SensorType, config: SensorConfig): number;
    initializeSensor(sensorType: SensorType, config: SensorConfig): SharedValue<Value3D | ValueRotation>;
    registerSensor(sensorType: SensorType, config: SensorConfig, handler: ShareableRef<(data: Value3D | ValueRotation) => void>): number;
    unregisterSensor(sensorId: number): void;
}
//# sourceMappingURL=SensorContainer.d.ts.map