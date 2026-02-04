import { AdaptedEvent } from '../interfaces';
export default class VelocityTracker {
    private assumePointerMoveStoppedMilliseconds;
    private historySize;
    private horizonMilliseconds;
    private minSampleSize;
    private samples;
    constructor();
    add(event: AdaptedEvent): void;
    private getVelocityEstimate;
    getVelocity(): [number, number];
    reset(): void;
}
