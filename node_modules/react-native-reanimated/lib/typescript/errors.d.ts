import type { WorkletStackDetails } from './commonTypes';
type ReanimatedError = Error & 'ReanimatedError';
interface ReanimatedErrorConstructor extends Error {
    new (message?: string): ReanimatedError;
    (message?: string): ReanimatedError;
    readonly prototype: ReanimatedError;
}
declare const ReanimatedErrorConstructor: ReanimatedErrorConstructor;
export { ReanimatedErrorConstructor as ReanimatedError };
/**
 * Registers `ReanimatedError` in global scope. Use it only for Worklet
 * runtimes.
 */
export declare function registerReanimatedError(): void;
export declare function registerWorkletStackDetails(hash: number, stackDetails: WorkletStackDetails): void;
export declare function reportFatalErrorOnJS({ message, stack, }: {
    message: string;
    stack?: string;
}): void;
//# sourceMappingURL=errors.d.ts.map