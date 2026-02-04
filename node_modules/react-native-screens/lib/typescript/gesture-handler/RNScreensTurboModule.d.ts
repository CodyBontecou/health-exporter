type RNScreensTurboModuleType = {
    startTransition: (stackTag: number) => {
        topScreenTag: number;
        belowTopScreenTag: number;
        canStartTransition: boolean;
    };
    updateTransition: (stackTag: number, progress: number) => void;
    finishTransition: (stackTag: number, isCanceled: boolean) => void;
    disableSwipeBackForTopScreen: (stackTag: number) => void;
};
export declare const RNScreensTurboModule: RNScreensTurboModuleType;
export {};
//# sourceMappingURL=RNScreensTurboModule.d.ts.map