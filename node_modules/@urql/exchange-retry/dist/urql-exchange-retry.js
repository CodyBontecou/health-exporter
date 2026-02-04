Object.defineProperty(exports, '__esModule', { value: true });

var wonka = require('wonka');
var core = require('@urql/core');

/** Input parameters for the {@link retryExchange}. */

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
var retryExchange = (options = {}) => {
  var {
    retryIf,
    retryWith
  } = options;
  var MIN_DELAY = options.initialDelayMs || 1000;
  var MAX_DELAY = options.maxDelayMs || 15_000;
  var MAX_ATTEMPTS = options.maxNumberAttempts || 2;
  var RANDOM_DELAY = options.randomDelay != null ? !!options.randomDelay : true;
  return ({
    forward,
    dispatchDebug
  }) => operations$ => {
    var {
      source: retry$,
      next: nextRetryOperation
    } = wonka.makeSubject();
    var retryWithBackoff$ = wonka.mergeMap(operation => {
      var retry = operation.context.retry || {
        count: 0,
        delay: null
      };
      var retryCount = ++retry.count;
      var delayAmount = retry.delay || MIN_DELAY;
      var backoffFactor = Math.random() + 1.5;
      if (RANDOM_DELAY) {
        // if randomDelay is enabled and it won't exceed the max delay, apply a random
        // amount to the delay to avoid thundering herd problem
        if (delayAmount * backoffFactor < MAX_DELAY) {
          delayAmount *= backoffFactor;
        } else {
          delayAmount = MAX_DELAY;
        }
      } else {
        // otherwise, increase the delay proportionately by the initial delay
        delayAmount = Math.min(retryCount * MIN_DELAY, MAX_DELAY);
      }

      // ensure the delay is carried over to the next context
      retry.delay = delayAmount;

      // We stop the retries if a teardown event for this operation comes in
      // But if this event comes through regularly we also stop the retries, since it's
      // basically the query retrying itself, no backoff should be added!
      var teardown$ = wonka.filter(op => {
        return (op.kind === 'query' || op.kind === 'teardown') && op.key === operation.key;
      })(operations$);
      process.env.NODE_ENV !== 'production' ? dispatchDebug({
        type: 'retryAttempt',
        message: `The operation has failed and a retry has been triggered (${retryCount} / ${MAX_ATTEMPTS})`,
        operation,
        data: {
          retryCount,
          delayAmount
        },
        "source": "retryExchange"
      }) : undefined;

      // Add new retryDelay and retryCount to operation
      return (
        // Stop retry if a teardown comes in
        wonka.takeUntil(teardown$)(wonka.debounce(() => delayAmount)(wonka.fromValue(core.makeOperation(operation.kind, operation, {
          ...operation.context,
          retry
        }))))
      );
    })(retry$);
    return wonka.filter(res => {
      var retry = res.operation.context.retry;
      // Only retry if the error passes the conditional retryIf function (if passed)
      // or if the error contains a networkError
      if (!res.error || (retryIf ? !retryIf(res.error, res.operation) : !retryWith && !res.error.networkError)) {
        // Reset the delay state for a successful operation
        if (retry) {
          retry.count = 0;
          retry.delay = null;
        }
        return true;
      }
      var maxNumberAttemptsExceeded = (retry && retry.count || 0) >= MAX_ATTEMPTS - 1;
      if (!maxNumberAttemptsExceeded) {
        var _operation = retryWith ? retryWith(res.error, res.operation) : res.operation;
        if (!_operation) return true;

        // Send failed responses to be retried by calling next on the retry$ subject
        // Exclude operations that have been retried more than the specified max
        nextRetryOperation(_operation);
        return false;
      }
      process.env.NODE_ENV !== 'production' ? dispatchDebug({
        type: 'retryExhausted',
        message: 'Maximum number of retries has been reached. No further retries will be performed.',
        operation: res.operation,
        "source": "retryExchange"
      }) : undefined;
      return true;
    })(forward(wonka.merge([operations$, retryWithBackoff$])));
  };
};

exports.retryExchange = retryExchange;
//# sourceMappingURL=urql-exchange-retry.js.map
