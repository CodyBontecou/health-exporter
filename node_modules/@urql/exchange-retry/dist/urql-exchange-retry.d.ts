import { CombinedError, Operation, Exchange } from '@urql/core';

/** Input parameters for the {@link retryExchange}. */
interface RetryExchangeOptions {
    /** Specify the minimum time to wait until retrying.
     *
     * @remarks
     * `initialDelayMs` specifies the minimum time (in milliseconds) to wait
     * until a failed operation is retried.
     *
     * @defaultValue `1_000` - one second
     */
    initialDelayMs?: number;
    /** Specifies the maximum time to wait until retrying.
     *
     * @remarks
     * `maxDelayMs` specifies the maximum time (in milliseconds) to wait
     * until a failed operation is retried. While `initialDelayMs`
     * specifies the minimum amount of time, `randomDelay` may cause
     * the delay to increase over multiple attempts.
     *
     * @defaultValue `15_000` - 15 seconds
     */
    maxDelayMs?: number;
    /** Enables a random exponential backoff to increase the delay over multiple retries.
     *
     * @remarks
     * `randomDelay`, unless disabled, increases the time until a failed
     * operation is retried over multiple attempts. It increases the time
     * starting at `initialDelayMs` by 1.5x with an added factor of 0–1,
     * until `maxDelayMs` is reached.
     *
     * @defaultValue `true` - enables random exponential backoff
     */
    randomDelay?: boolean;
    /** Specifies the maximum times an operation should be sent to the API.
     *
     * @remarks
     * `maxNumberAttempts` defines the number of attempts an operation should
     * be retried until it's considered failed.
     *
     * @defaultValue `2` - Retry once, i.e. two attempts
     */
    maxNumberAttempts?: number;
    /** Predicate allowing you to selectively not retry `Operation`s.
     *
     * @remarks
     * `retryIf` is called with a {@link CombinedError} and the {@link Operation} that
     * failed. If this function returns false the failed `Operation` is not retried.
     *
     * @defaultValue `(error) => !!error.networkError` - retries only on network errors.
     */
    retryIf?(error: CombinedError, operation: Operation): boolean;
    /** Transform function allowing you to selectively replace a retried `Operation` or return nullish value.
     *
     * @remarks
     * `retryWhen` is called with a {@link CombinedError} and the {@link Operation} that
     * failed. If this function returns an `Operation`, `retryExchange` will replace the
     * failed `Operation` and retry. It won't retry the `Operation` if a nullish value
     * is returned.
     *
     * The `retryIf` function, if defined, takes precedence and overrides this option.
     */
    retryWith?(error: CombinedError, operation: Operation): Operation | null | undefined;
}
/** Exchange factory that retries failed operations.
 *
 * @param options - A {@link RetriesExchangeOptions} configuration object.
 * @returns the created retry {@link Exchange}.
 *
 * @remarks
 * The `retryExchange` retries failed operations with specified delays
 * and exponential backoff.
 *
 * You may define a {@link RetryExchangeOptions.retryIf} or
 * {@link RetryExchangeOptions.retryWhen} function to only retry
 * certain kinds of operations, e.g. only queries.
 *
 * @example
 * ```ts
 * retryExchange({
 *   initialDelayMs: 1000,
 *   maxDelayMs: 15000,
 *   randomDelay: true,
 *   maxNumberAttempts: 2,
 *   retryIf: err => err && err.networkError,
 * });
 * ```
 */
declare const retryExchange: (options?: RetryExchangeOptions) => Exchange;

export { RetryExchangeOptions, retryExchange };
