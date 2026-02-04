import type { NestedArray } from './commonTypes';
export declare function flattenArray<T>(array: NestedArray<T>): T[];
export declare const has: <K extends string>(key: K, x: unknown) => x is { [key in K]: unknown; };
//# sourceMappingURL=utils.d.ts.map