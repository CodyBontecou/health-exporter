import { AdaptedEvent, Point } from '../interfaces';
export interface TrackerElement {
    abosoluteCoords: Point;
    relativeCoords: Point;
    timestamp: number;
    velocityX: number;
    velocityY: number;
}
export default class PointerTracker {
    private velocityTracker;
    private trackedPointers;
    private touchEventsIds;
    private lastMovedPointerId;
    private cachedAbsoluteAverages;
    private cachedRelativeAverages;
    constructor();
    addToTracker(event: AdaptedEvent): void;
    removeFromTracker(pointerId: number): void;
    track(event: AdaptedEvent): void;
    private mapTouchEventId;
    private removeMappedTouchId;
    getMappedTouchEventId(touchEventId: number): number;
    getVelocity(pointerId: number): {
        x: number;
        y: number;
    };
    getLastAbsoluteCoords(pointerId?: number): {
        x: number;
        y: number;
    };
    getLastRelativeCoords(pointerId?: number): {
        x: number;
        y: number;
    };
    getAbsoluteCoordsAverage(): {
        x: number;
        y: number;
    };
    getRelativeCoordsAverage(): {
        x: number;
        y: number;
    };
    getAbsoluteCoordsSum(ignoredPointer?: number): {
        x: number;
        y: number;
    };
    getRelativeCoordsSum(ignoredPointer?: number): {
        x: number;
        y: number;
    };
    getTrackedPointersCount(): number;
    getTrackedPointersID(): number[];
    getData(): Map<number, TrackerElement>;
    resetTracker(): void;
    static shareCommonPointers(stPointers: number[], ndPointers: number[]): boolean;
}
