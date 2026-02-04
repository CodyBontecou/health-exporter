import type { ProgressAnimation, SharedTransitionAnimationsValues } from '../animationBuilder/commonTypes';
export declare class ProgressTransitionManager {
    private _sharedElementCount;
    private _eventHandler;
    addProgressAnimation(viewTag: number, progressAnimation: ProgressAnimation): void;
    removeProgressAnimation(viewTag: number, isUnmounting?: boolean): void;
    private registerEventHandlers;
    private unregisterEventHandlers;
}
declare function createProgressTransitionRegister(): {
    addProgressAnimation: (viewTag: number, progressAnimation: ProgressAnimation) => void;
    removeProgressAnimation: (viewTag: number, isUnmounting: boolean) => void;
    onTransitionStart: (viewTag: number, snapshot: Partial<SharedTransitionAnimationsValues>) => void;
    frame: (progress: number) => void;
    onAndroidFinishTransitioning: () => void;
    onTransitionEnd: (removeViews?: boolean) => void;
};
export type ProgressTransitionRegister = ReturnType<typeof createProgressTransitionRegister>;
export {};
//# sourceMappingURL=ProgressTransitionManager.d.ts.map