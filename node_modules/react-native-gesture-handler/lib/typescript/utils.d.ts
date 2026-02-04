export declare function toArray<T>(object: T | T[]): T[];
export type withPrevAndCurrentMapFn<T, Transformed> = (previous: Transformed | null, current: T) => Transformed;
export declare function withPrevAndCurrent<T, Transformed>(array: T[], mapFn: withPrevAndCurrentMapFn<T, Transformed>): Transformed[];
export declare function hasProperty(object: object, key: string): boolean;
export declare function isJestEnv(): boolean;
export declare function tagMessage(msg: string): string;
export declare function isFabric(): boolean;
export declare function isRemoteDebuggingEnabled(): boolean;
/**
 * Recursively compares two objects for deep equality.
 *
 * **Note:** This function does not support cyclic references.
 *
 * @param obj1 - The first object to compare.
 * @param obj2 - The second object to compare.
 * @returns `true` if the objects are deeply equal, `false` otherwise.
 */
export declare function deepEqual(obj1: any, obj2: any): boolean;
export declare const INT32_MAX: number;
