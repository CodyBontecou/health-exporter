export interface GestureStateManagerType {
    begin: () => void;
    activate: () => void;
    fail: () => void;
    end: () => void;
}
declare function create(handlerTag: number): GestureStateManagerType;
export declare const GestureStateManager: {
    create: typeof create;
};
export {};
