import { ReduceMotion } from '../../commonTypes';
export declare class SharedTransition {
    custom(): SharedTransition;
    progressAnimation(): SharedTransition;
    duration(): SharedTransition;
    reduceMotion(): this;
    defaultTransitionType(): SharedTransition;
    registerTransition(): void;
    unregisterTransition(): void;
    getReduceMotion(): ReduceMotion;
    static custom(): SharedTransition;
    static duration(): SharedTransition;
    static progressAnimation(): SharedTransition;
    static defaultTransitionType(): SharedTransition;
    static reduceMotion(): SharedTransition;
}
//# sourceMappingURL=SharedTransition.web.d.ts.map