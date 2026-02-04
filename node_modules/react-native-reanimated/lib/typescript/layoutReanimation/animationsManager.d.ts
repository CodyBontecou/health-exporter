import type { LayoutAnimationStartFunction } from './animationBuilder/commonTypes';
declare function createLayoutAnimationManager(): {
    start: LayoutAnimationStartFunction;
    stop: (tag: number) => void;
};
export type LayoutAnimationsManager = ReturnType<typeof createLayoutAnimationManager>;
export {};
//# sourceMappingURL=animationsManager.d.ts.map