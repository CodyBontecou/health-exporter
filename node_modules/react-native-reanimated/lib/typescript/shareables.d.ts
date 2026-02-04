import type { ShareableRef, FlatShareableRef } from './commonTypes';
export declare function makeShareableCloneRecursive<T>(value: any, shouldPersistRemote?: boolean, depth?: number): ShareableRef<T>;
export declare function makeShareableCloneOnUIRecursive<T>(value: T): FlatShareableRef<T>;
declare function makeShareableJS<T extends object>(value: T): T;
/**
 * This function creates a value on UI with persistent state - changes to it on
 * the UI thread will be seen by all worklets. Use it when you want to create a
 * value that is read and written only on the UI thread.
 */
export declare const makeShareable: typeof makeShareableJS;
export {};
//# sourceMappingURL=shareables.d.ts.map