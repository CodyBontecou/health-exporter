import { makeSubject as r, mergeMap as e, filter as t, takeUntil as a, debounce as o, fromValue as n, merge as i } from "wonka";

import { makeOperation as u } from "@urql/core";

var retryExchange = (y = {}) => {
  var {retryIf: d, retryWith: s} = y;
  var l = y.initialDelayMs || 1e3;
  var p = y.maxDelayMs || 15e3;
  var m = y.maxNumberAttempts || 2;
  var c = null != y.randomDelay ? !!y.randomDelay : !0;
  return ({forward: y, dispatchDebug: v}) => f => {
    var {source: h, next: x} = r();
    var E = e((r => {
      var e = r.context.retry || {
        count: 0,
        delay: null
      };
      var i = ++e.count;
      var y = e.delay || l;
      var d = Math.random() + 1.5;
      if (c) {
        if (y * d < p) {
          y *= d;
        } else {
          y = p;
        }
      } else {
        y = Math.min(i * l, p);
      }
      e.delay = y;
      var s = t((e => ("query" === e.kind || "teardown" === e.kind) && e.key === r.key))(f);
      "production" !== process.env.NODE_ENV && v({
        type: "retryAttempt",
        message: `The operation has failed and a retry has been triggered (${i} / ${m})`,
        operation: r,
        data: {
          retryCount: i,
          delayAmount: y
        },
        source: "retryExchange"
      });
      return a(s)(o((() => y))(n(u(r.kind, r, {
        ...r.context,
        retry: e
      }))));
    }))(h);
    return t((r => {
      var e = r.operation.context.retry;
      if (!(r.error && (d ? d(r.error, r.operation) : s || r.error.networkError))) {
        if (e) {
          e.count = 0;
          e.delay = null;
        }
        return !0;
      }
      if (!((e && e.count || 0) >= m - 1)) {
        var t = s ? s(r.error, r.operation) : r.operation;
        if (!t) {
          return !0;
        }
        x(t);
        return !1;
      }
      "production" !== process.env.NODE_ENV && v({
        type: "retryExhausted",
        message: "Maximum number of retries has been reached. No further retries will be performed.",
        operation: r.operation,
        source: "retryExchange"
      });
      return !0;
    }))(y(i([ f, E ])));
  };
};

export { retryExchange };
//# sourceMappingURL=urql-exchange-retry.mjs.map
