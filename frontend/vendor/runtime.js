// @ts-nocheck
// Recovered as an ES module for build 15. Preserve saved-state and replay semantics.

var e = Object.create;
var t = Object.defineProperty;
var n = Object.getOwnPropertyDescriptor;
var r = Object.getOwnPropertyNames;
var i = Object.getPrototypeOf;
var a = Object.prototype.hasOwnProperty;
var o = (e, t) => () => (
    t || (e((t = { exports: {} }).exports, t), (e = null)),
    t.exports
  );
var s = (e, i, o, s) => {
    if ((i && typeof i == `object`) || typeof i == `function`)
      for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
        ((d = c[l]),
          !a.call(e, d) &&
            d !== o &&
            t(e, d, {
              get: ((e) => i[e]).bind(null, d),
              enumerable: !(s = n(i, d)) || s.enumerable,
            }));
    return e;
  };
var c = (n, r, a) => (
    (a = n == null ? {} : e(i(n))),
    s(
      r || !n || !n.__esModule
        ? t(a, `default`, { value: n, enumerable: !0 })
        : a,
      n,
    )
  );
(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes)
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var l = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.portal`),
      r = Symbol.for(`react.fragment`),
      i = Symbol.for(`react.strict_mode`),
      a = Symbol.for(`react.profiler`),
      o = Symbol.for(`react.consumer`),
      s = Symbol.for(`react.context`),
      c = Symbol.for(`react.forward_ref`),
      l = Symbol.for(`react.suspense`),
      u = Symbol.for(`react.memo`),
      d = Symbol.for(`react.lazy`),
      f = Symbol.for(`react.activity`),
      p = Symbol.iterator;
    function m(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (p && e[p]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var h = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      g = Object.assign,
      _ = {};
    function v(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = _),
        (this.updater = n || h));
    }
    ((v.prototype.isReactComponent = {}),
      (v.prototype.setState = function (e, t) {
        if (typeof e != `object` && typeof e != `function` && e != null)
          throw Error(
            `takes an object of state variables to update or a function which returns an object of state variables.`,
          );
        this.updater.enqueueSetState(this, e, t, `setState`);
      }),
      (v.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
      }));
    function y() {}
    y.prototype = v.prototype;
    function b(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = _),
        (this.updater = n || h));
    }
    var x = (b.prototype = new y());
    ((x.constructor = b), g(x, v.prototype), (x.isPureReactComponent = !0));
    var S = Array.isArray;
    function C() {}
    var w = { H: null, A: null, T: null, S: null },
      T = Object.prototype.hasOwnProperty;
    function ee(e, n, r) {
      var i = r.ref;
      return {
        $$typeof: t,
        type: e,
        key: n,
        ref: i === void 0 ? null : i,
        props: r,
      };
    }
    function E(e, t) {
      return ee(e.type, t, e.props);
    }
    function D(e) {
      return typeof e == `object` && !!e && e.$$typeof === t;
    }
    function te(e) {
      var t = { "=": `=0`, ":": `=2` };
      return (
        `$` +
        e.replace(/[=:]/g, function (e) {
          return t[e];
        })
      );
    }
    var ne = /\/+/g;
    function O(e, t) {
      return typeof e == `object` && e && e.key != null
        ? te(`` + e.key)
        : t.toString(36);
    }
    function re(e) {
      switch (e.status) {
        case `fulfilled`:
          return e.value;
        case `rejected`:
          throw e.reason;
        default:
          switch (
            (typeof e.status == `string`
              ? e.then(C, C)
              : ((e.status = `pending`),
                e.then(
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `fulfilled`), (e.value = t));
                  },
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `rejected`), (e.reason = t));
                  },
                )),
            e.status)
          ) {
            case `fulfilled`:
              return e.value;
            case `rejected`:
              throw e.reason;
          }
      }
      throw e;
    }
    function k(e, r, i, a, o) {
      var s = typeof e;
      (s === `undefined` || s === `boolean`) && (e = null);
      var c = !1;
      if (e === null) c = !0;
      else
        switch (s) {
          case `bigint`:
          case `string`:
          case `number`:
            c = !0;
            break;
          case `object`:
            switch (e.$$typeof) {
              case t:
              case n:
                c = !0;
                break;
              case d:
                return ((c = e._init), k(c(e._payload), r, i, a, o));
            }
        }
      if (c)
        return (
          (o = o(e)),
          (c = a === `` ? `.` + O(e, 0) : a),
          S(o)
            ? ((i = ``),
              c != null && (i = c.replace(ne, `$&/`) + `/`),
              k(o, r, i, ``, function (e) {
                return e;
              }))
            : o != null &&
              (D(o) &&
                (o = E(
                  o,
                  i +
                    (o.key == null || (e && e.key === o.key)
                      ? ``
                      : (`` + o.key).replace(ne, `$&/`) + `/`) +
                    c,
                )),
              r.push(o)),
          1
        );
      c = 0;
      var l = a === `` ? `.` : a + `:`;
      if (S(e))
        for (var u = 0; u < e.length; u++)
          ((a = e[u]), (s = l + O(a, u)), (c += k(a, r, i, s, o)));
      else if (((u = m(e)), typeof u == `function`))
        for (e = u.call(e), u = 0; !(a = e.next()).done; )
          ((a = a.value), (s = l + O(a, u++)), (c += k(a, r, i, s, o)));
      else if (s === `object`) {
        if (typeof e.then == `function`) return k(re(e), r, i, a, o);
        throw (
          (r = String(e)),
          Error(
            `Objects are not valid as a React child (found: ` +
              (r === `[object Object]`
                ? `object with keys {` + Object.keys(e).join(`, `) + `}`
                : r) +
              `). If you meant to render a collection of children, use an array instead.`,
          )
        );
      }
      return c;
    }
    function ie(e, t, n) {
      if (e == null) return e;
      var r = [],
        i = 0;
      return (
        k(e, r, ``, ``, function (e) {
          return t.call(n, e, i++);
        }),
        r
      );
    }
    function ae(e) {
      if (e._status === -1) {
        var t = e._result;
        ((t = t()),
          t.then(
            function (t) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 1), (e._result = t));
            },
            function (t) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 2), (e._result = t));
            },
          ),
          e._status === -1 && ((e._status = 0), (e._result = t)));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var A =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (
                typeof window == `object` &&
                typeof window.ErrorEvent == `function`
              ) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (
                typeof process == `object` &&
                typeof process.emit == `function`
              ) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      j = {
        map: ie,
        forEach: function (e, t, n) {
          ie(
            e,
            function () {
              t.apply(this, arguments);
            },
            n,
          );
        },
        count: function (e) {
          var t = 0;
          return (
            ie(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            ie(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!D(e))
            throw Error(
              `React.Children.only expected to receive a single React element child.`,
            );
          return e;
        },
      };
    ((e.Activity = f),
      (e.Children = j),
      (e.Component = v),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = b),
      (e.StrictMode = i),
      (e.Suspense = l),
      (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w),
      (e.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (e) {
          return w.H.useMemoCache(e);
        },
      }),
      (e.cache = function (e) {
        return function () {
          return e.apply(null, arguments);
        };
      }),
      (e.cacheSignal = function () {
        return null;
      }),
      (e.cloneElement = function (e, t, n) {
        if (e == null)
          throw Error(
            `The argument must be a React element, but you passed ` + e + `.`,
          );
        var r = g({}, e.props),
          i = e.key;
        if (t != null)
          for (a in (t.key !== void 0 && (i = `` + t.key), t))
            !T.call(t, a) ||
              a === `key` ||
              a === `__self` ||
              a === `__source` ||
              (a === `ref` && t.ref === void 0) ||
              (r[a] = t[a]);
        var a = arguments.length - 2;
        if (a === 1) r.children = n;
        else if (1 < a) {
          for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
          r.children = o;
        }
        return ee(e.type, i, r);
      }),
      (e.createContext = function (e) {
        return (
          (e = {
            $$typeof: s,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }),
          (e.Provider = e),
          (e.Consumer = { $$typeof: o, _context: e }),
          e
        );
      }),
      (e.createElement = function (e, t, n) {
        var r,
          i = {},
          a = null;
        if (t != null)
          for (r in (t.key !== void 0 && (a = `` + t.key), t))
            T.call(t, r) &&
              r !== `key` &&
              r !== `__self` &&
              r !== `__source` &&
              (i[r] = t[r]);
        var o = arguments.length - 2;
        if (o === 1) i.children = n;
        else if (1 < o) {
          for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
          i.children = s;
        }
        if (e && e.defaultProps)
          for (r in ((o = e.defaultProps), o)) i[r] === void 0 && (i[r] = o[r]);
        return ee(e, a, i);
      }),
      (e.createRef = function () {
        return { current: null };
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: c, render: e };
      }),
      (e.isValidElement = D),
      (e.lazy = function (e) {
        return {
          $$typeof: d,
          _payload: { _status: -1, _result: e },
          _init: ae,
        };
      }),
      (e.memo = function (e, t) {
        return { $$typeof: u, type: e, compare: t === void 0 ? null : t };
      }),
      (e.startTransition = function (e) {
        var t = w.T,
          n = {};
        w.T = n;
        try {
          var r = e(),
            i = w.S;
          (i !== null && i(n, r),
            typeof r == `object` &&
              r &&
              typeof r.then == `function` &&
              r.then(C, A));
        } catch (e) {
          A(e);
        } finally {
          (t !== null && n.types !== null && (t.types = n.types), (w.T = t));
        }
      }),
      (e.unstable_useCacheRefresh = function () {
        return w.H.useCacheRefresh();
      }),
      (e.use = function (e) {
        return w.H.use(e);
      }),
      (e.useActionState = function (e, t, n) {
        return w.H.useActionState(e, t, n);
      }),
      (e.useCallback = function (e, t) {
        return w.H.useCallback(e, t);
      }),
      (e.useContext = function (e) {
        return w.H.useContext(e);
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e, t) {
        return w.H.useDeferredValue(e, t);
      }),
      (e.useEffect = function (e, t) {
        return w.H.useEffect(e, t);
      }),
      (e.useEffectEvent = function (e) {
        return w.H.useEffectEvent(e);
      }),
      (e.useId = function () {
        return w.H.useId();
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return w.H.useImperativeHandle(e, t, n);
      }),
      (e.useInsertionEffect = function (e, t) {
        return w.H.useInsertionEffect(e, t);
      }),
      (e.useLayoutEffect = function (e, t) {
        return w.H.useLayoutEffect(e, t);
      }),
      (e.useMemo = function (e, t) {
        return w.H.useMemo(e, t);
      }),
      (e.useOptimistic = function (e, t) {
        return w.H.useOptimistic(e, t);
      }),
      (e.useReducer = function (e, t, n) {
        return w.H.useReducer(e, t, n);
      }),
      (e.useRef = function (e) {
        return w.H.useRef(e);
      }),
      (e.useState = function (e) {
        return w.H.useState(e);
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return w.H.useSyncExternalStore(e, t, n);
      }),
      (e.useTransition = function () {
        return w.H.useTransition();
      }),
      (e.version = `19.2.6`));
  });
var u = o((e, t) => {
    t.exports = l();
  });
var d = o((e) => {
    function t(e, t) {
      var n = e.length;
      e.push(t);
      a: for (; 0 < n; ) {
        var r = (n - 1) >>> 1,
          a = e[r];
        if (0 < i(a, t)) ((e[r] = t), (e[n] = a), (n = r));
        else break a;
      }
    }
    function n(e) {
      return e.length === 0 ? null : e[0];
    }
    function r(e) {
      if (e.length === 0) return null;
      var t = e[0],
        n = e.pop();
      if (n !== t) {
        e[0] = n;
        a: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
          var s = 2 * (r + 1) - 1,
            c = e[s],
            l = s + 1,
            u = e[l];
          if (0 > i(c, n))
            l < a && 0 > i(u, c)
              ? ((e[r] = u), (e[l] = n), (r = l))
              : ((e[r] = c), (e[s] = n), (r = s));
          else if (l < a && 0 > i(u, n)) ((e[r] = u), (e[l] = n), (r = l));
          else break a;
        }
      }
      return t;
    }
    function i(e, t) {
      var n = e.sortIndex - t.sortIndex;
      return n === 0 ? e.id - t.id : n;
    }
    if (
      ((e.unstable_now = void 0),
      typeof performance == `object` && typeof performance.now == `function`)
    ) {
      var a = performance;
      e.unstable_now = function () {
        return a.now();
      };
    } else {
      var o = Date,
        s = o.now();
      e.unstable_now = function () {
        return o.now() - s;
      };
    }
    var c = [],
      l = [],
      u = 1,
      d = null,
      f = 3,
      p = !1,
      m = !1,
      h = !1,
      g = !1,
      _ = typeof setTimeout == `function` ? setTimeout : null,
      v = typeof clearTimeout == `function` ? clearTimeout : null,
      y = typeof setImmediate < `u` ? setImmediate : null;
    function b(e) {
      for (var i = n(l); i !== null; ) {
        if (i.callback === null) r(l);
        else if (i.startTime <= e)
          (r(l), (i.sortIndex = i.expirationTime), t(c, i));
        else break;
        i = n(l);
      }
    }
    function x(e) {
      if (((h = !1), b(e), !m))
        if (n(c) !== null) ((m = !0), S || ((S = !0), D()));
        else {
          var t = n(l);
          t !== null && O(x, t.startTime - e);
        }
    }
    var S = !1,
      C = -1,
      w = 5,
      T = -1;
    function ee() {
      return g ? !0 : !(e.unstable_now() - T < w);
    }
    function E() {
      if (((g = !1), S)) {
        var t = e.unstable_now();
        T = t;
        var i = !0;
        try {
          a: {
            ((m = !1), h && ((h = !1), v(C), (C = -1)), (p = !0));
            var a = f;
            try {
              b: {
                for (
                  b(t), d = n(c);
                  d !== null && !(d.expirationTime > t && ee());

                ) {
                  var o = d.callback;
                  if (typeof o == `function`) {
                    ((d.callback = null), (f = d.priorityLevel));
                    var s = o(d.expirationTime <= t);
                    if (((t = e.unstable_now()), typeof s == `function`)) {
                      ((d.callback = s), b(t), (i = !0));
                      break b;
                    }
                    (d === n(c) && r(c), b(t));
                  } else r(c);
                  d = n(c);
                }
                if (d !== null) i = !0;
                else {
                  var u = n(l);
                  (u !== null && O(x, u.startTime - t), (i = !1));
                }
              }
              break a;
            } finally {
              ((d = null), (f = a), (p = !1));
            }
            i = void 0;
          }
        } finally {
          i ? D() : (S = !1);
        }
      }
    }
    var D;
    if (typeof y == `function`)
      D = function () {
        y(E);
      };
    else if (typeof MessageChannel < `u`) {
      var te = new MessageChannel(),
        ne = te.port2;
      ((te.port1.onmessage = E),
        (D = function () {
          ne.postMessage(null);
        }));
    } else
      D = function () {
        _(E, 0);
      };
    function O(t, n) {
      C = _(function () {
        t(e.unstable_now());
      }, n);
    }
    ((e.unstable_IdlePriority = 5),
      (e.unstable_ImmediatePriority = 1),
      (e.unstable_LowPriority = 4),
      (e.unstable_NormalPriority = 3),
      (e.unstable_Profiling = null),
      (e.unstable_UserBlockingPriority = 2),
      (e.unstable_cancelCallback = function (e) {
        e.callback = null;
      }),
      (e.unstable_forceFrameRate = function (e) {
        0 > e || 125 < e
          ? console.error(
              `forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`,
            )
          : (w = 0 < e ? Math.floor(1e3 / e) : 5);
      }),
      (e.unstable_getCurrentPriorityLevel = function () {
        return f;
      }),
      (e.unstable_next = function (e) {
        switch (f) {
          case 1:
          case 2:
          case 3:
            var t = 3;
            break;
          default:
            t = f;
        }
        var n = f;
        f = t;
        try {
          return e();
        } finally {
          f = n;
        }
      }),
      (e.unstable_requestPaint = function () {
        g = !0;
      }),
      (e.unstable_runWithPriority = function (e, t) {
        switch (e) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            e = 3;
        }
        var n = f;
        f = e;
        try {
          return t();
        } finally {
          f = n;
        }
      }),
      (e.unstable_scheduleCallback = function (r, i, a) {
        var o = e.unstable_now();
        switch (
          (typeof a == `object` && a
            ? ((a = a.delay), (a = typeof a == `number` && 0 < a ? o + a : o))
            : (a = o),
          r)
        ) {
          case 1:
            var s = -1;
            break;
          case 2:
            s = 250;
            break;
          case 5:
            s = 1073741823;
            break;
          case 4:
            s = 1e4;
            break;
          default:
            s = 5e3;
        }
        return (
          (s = a + s),
          (r = {
            id: u++,
            callback: i,
            priorityLevel: r,
            startTime: a,
            expirationTime: s,
            sortIndex: -1,
          }),
          a > o
            ? ((r.sortIndex = a),
              t(l, r),
              n(c) === null &&
                r === n(l) &&
                (h ? (v(C), (C = -1)) : (h = !0), O(x, a - o)))
            : ((r.sortIndex = s),
              t(c, r),
              m || p || ((m = !0), S || ((S = !0), D()))),
          r
        );
      }),
      (e.unstable_shouldYield = ee),
      (e.unstable_wrapCallback = function (e) {
        var t = f;
        return function () {
          var n = f;
          f = t;
          try {
            return e.apply(this, arguments);
          } finally {
            f = n;
          }
        };
      }));
  });
var f = o((e, t) => {
    t.exports = d();
  });
var p = o((e) => {
    var t = u();
    function n(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function r() {}
    var i = {
        d: {
          f: r,
          r: function () {
            throw Error(n(522));
          },
          D: r,
          C: r,
          L: r,
          m: r,
          X: r,
          S: r,
          M: r,
        },
        p: 0,
        findDOMNode: null,
      },
      a = Symbol.for(`react.portal`);
    function o(e, t, n) {
      var r =
        3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: a,
        key: r == null ? null : `` + r,
        children: e,
        containerInfo: t,
        implementation: n,
      };
    }
    var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function c(e, t) {
      if (e === `font`) return ``;
      if (typeof t == `string`) return t === `use-credentials` ? t : ``;
    }
    ((e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i),
      (e.createPortal = function (e, t) {
        var r =
          2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11))
          throw Error(n(299));
        return o(e, t, null, r);
      }),
      (e.flushSync = function (e) {
        var t = s.T,
          n = i.p;
        try {
          if (((s.T = null), (i.p = 2), e)) return e();
        } finally {
          ((s.T = t), (i.p = n), i.d.f());
        }
      }),
      (e.preconnect = function (e, t) {
        typeof e == `string` &&
          (t
            ? ((t = t.crossOrigin),
              (t =
                typeof t == `string`
                  ? t === `use-credentials`
                    ? t
                    : ``
                  : void 0))
            : (t = null),
          i.d.C(e, t));
      }),
      (e.prefetchDNS = function (e) {
        typeof e == `string` && i.d.D(e);
      }),
      (e.preinit = function (e, t) {
        if (typeof e == `string` && t && typeof t.as == `string`) {
          var n = t.as,
            r = c(n, t.crossOrigin),
            a = typeof t.integrity == `string` ? t.integrity : void 0,
            o = typeof t.fetchPriority == `string` ? t.fetchPriority : void 0;
          n === `style`
            ? i.d.S(
                e,
                typeof t.precedence == `string` ? t.precedence : void 0,
                { crossOrigin: r, integrity: a, fetchPriority: o },
              )
            : n === `script` &&
              i.d.X(e, {
                crossOrigin: r,
                integrity: a,
                fetchPriority: o,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
        }
      }),
      (e.preinitModule = function (e, t) {
        if (typeof e == `string`)
          if (typeof t == `object` && t) {
            if (t.as == null || t.as === `script`) {
              var n = c(t.as, t.crossOrigin);
              i.d.M(e, {
                crossOrigin: n,
                integrity:
                  typeof t.integrity == `string` ? t.integrity : void 0,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
            }
          } else t ?? i.d.M(e);
      }),
      (e.preload = function (e, t) {
        if (
          typeof e == `string` &&
          typeof t == `object` &&
          t &&
          typeof t.as == `string`
        ) {
          var n = t.as,
            r = c(n, t.crossOrigin);
          i.d.L(e, n, {
            crossOrigin: r,
            integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            nonce: typeof t.nonce == `string` ? t.nonce : void 0,
            type: typeof t.type == `string` ? t.type : void 0,
            fetchPriority:
              typeof t.fetchPriority == `string` ? t.fetchPriority : void 0,
            referrerPolicy:
              typeof t.referrerPolicy == `string` ? t.referrerPolicy : void 0,
            imageSrcSet:
              typeof t.imageSrcSet == `string` ? t.imageSrcSet : void 0,
            imageSizes: typeof t.imageSizes == `string` ? t.imageSizes : void 0,
            media: typeof t.media == `string` ? t.media : void 0,
          });
        }
      }),
      (e.preloadModule = function (e, t) {
        if (typeof e == `string`)
          if (t) {
            var n = c(t.as, t.crossOrigin);
            i.d.m(e, {
              as: typeof t.as == `string` && t.as !== `script` ? t.as : void 0,
              crossOrigin: n,
              integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            });
          } else i.d.m(e);
      }),
      (e.requestFormReset = function (e) {
        i.d.r(e);
      }),
      (e.unstable_batchedUpdates = function (e, t) {
        return e(t);
      }),
      (e.useFormState = function (e, t, n) {
        return s.H.useFormState(e, t, n);
      }),
      (e.useFormStatus = function () {
        return s.H.useHostTransitionStatus();
      }),
      (e.version = `19.2.6`));
  });
var m = o((e, t) => {
    function n() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = p()));
  });
var h = o((e) => {
    var t = f(),
      n = u(),
      r = m();
    function i(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function a(e) {
      return !(
        !e ||
        (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
      );
    }
    function o(e) {
      var t = e,
        n = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
        while (e);
      }
      return t.tag === 3 ? n : null;
    }
    function s(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (
          (t === null &&
            ((e = e.alternate), e !== null && (t = e.memoizedState)),
          t !== null)
        )
          return t.dehydrated;
      }
      return null;
    }
    function c(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if (
          (t === null &&
            ((e = e.alternate), e !== null && (t = e.memoizedState)),
          t !== null)
        )
          return t.dehydrated;
      }
      return null;
    }
    function l(e) {
      if (o(e) !== e) throw Error(i(188));
    }
    function d(e) {
      var t = e.alternate;
      if (!t) {
        if (((t = o(e)), t === null)) throw Error(i(188));
        return t === e ? e : null;
      }
      for (var n = e, r = t; ; ) {
        var a = n.return;
        if (a === null) break;
        var s = a.alternate;
        if (s === null) {
          if (((r = a.return), r !== null)) {
            n = r;
            continue;
          }
          break;
        }
        if (a.child === s.child) {
          for (s = a.child; s; ) {
            if (s === n) return (l(a), e);
            if (s === r) return (l(a), t);
            s = s.sibling;
          }
          throw Error(i(188));
        }
        if (n.return !== r.return) ((n = a), (r = s));
        else {
          for (var c = !1, u = a.child; u; ) {
            if (u === n) {
              ((c = !0), (n = a), (r = s));
              break;
            }
            if (u === r) {
              ((c = !0), (r = a), (n = s));
              break;
            }
            u = u.sibling;
          }
          if (!c) {
            for (u = s.child; u; ) {
              if (u === n) {
                ((c = !0), (n = s), (r = a));
                break;
              }
              if (u === r) {
                ((c = !0), (r = s), (n = a));
                break;
              }
              u = u.sibling;
            }
            if (!c) throw Error(i(189));
          }
        }
        if (n.alternate !== r) throw Error(i(190));
      }
      if (n.tag !== 3) throw Error(i(188));
      return n.stateNode.current === n ? e : t;
    }
    function p(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null; ) {
        if (((t = p(e)), t !== null)) return t;
        e = e.sibling;
      }
      return null;
    }
    var h = Object.assign,
      g = Symbol.for(`react.element`),
      _ = Symbol.for(`react.transitional.element`),
      v = Symbol.for(`react.portal`),
      y = Symbol.for(`react.fragment`),
      b = Symbol.for(`react.strict_mode`),
      x = Symbol.for(`react.profiler`),
      S = Symbol.for(`react.consumer`),
      C = Symbol.for(`react.context`),
      w = Symbol.for(`react.forward_ref`),
      T = Symbol.for(`react.suspense`),
      ee = Symbol.for(`react.suspense_list`),
      E = Symbol.for(`react.memo`),
      D = Symbol.for(`react.lazy`),
      te = Symbol.for(`react.activity`),
      ne = Symbol.for(`react.memo_cache_sentinel`),
      O = Symbol.iterator;
    function re(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (O && e[O]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var k = Symbol.for(`react.client.reference`);
    function ie(e) {
      if (e == null) return null;
      if (typeof e == `function`)
        return e.$$typeof === k ? null : e.displayName || e.name || null;
      if (typeof e == `string`) return e;
      switch (e) {
        case y:
          return `Fragment`;
        case x:
          return `Profiler`;
        case b:
          return `StrictMode`;
        case T:
          return `Suspense`;
        case ee:
          return `SuspenseList`;
        case te:
          return `Activity`;
      }
      if (typeof e == `object`)
        switch (e.$$typeof) {
          case v:
            return `Portal`;
          case C:
            return e.displayName || `Context`;
          case S:
            return (e._context.displayName || `Context`) + `.Consumer`;
          case w:
            var t = e.render;
            return (
              (e = e.displayName),
              (e ||=
                ((e = t.displayName || t.name || ``),
                e === `` ? `ForwardRef` : `ForwardRef(` + e + `)`)),
              e
            );
          case E:
            return (
              (t = e.displayName || null),
              t === null ? ie(e.type) || `Memo` : t
            );
          case D:
            ((t = e._payload), (e = e._init));
            try {
              return ie(e(t));
            } catch {}
        }
      return null;
    }
    var ae = Array.isArray,
      A = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      j = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      oe = { pending: !1, data: null, method: null, action: null },
      se = [],
      ce = -1;
    function le(e) {
      return { current: e };
    }
    function M(e) {
      0 > ce || ((e.current = se[ce]), (se[ce] = null), ce--);
    }
    function N(e, t) {
      (ce++, (se[ce] = e.current), (e.current = t));
    }
    var ue = le(null),
      P = le(null),
      de = le(null),
      fe = le(null);
    function pe(e, t) {
      switch ((N(de, t), N(P, e), N(ue, null), t.nodeType)) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Vd(e) : 0;
          break;
        default:
          if (((e = t.tagName), (t = t.namespaceURI)))
            ((t = Vd(t)), (e = Hd(t, e)));
          else
            switch (e) {
              case `svg`:
                e = 1;
                break;
              case `math`:
                e = 2;
                break;
              default:
                e = 0;
            }
      }
      (M(ue), N(ue, e));
    }
    function me() {
      (M(ue), M(P), M(de));
    }
    function he(e) {
      e.memoizedState !== null && N(fe, e);
      var t = ue.current,
        n = Hd(t, e.type);
      t !== n && (N(P, e), N(ue, n));
    }
    function ge(e) {
      (P.current === e && (M(ue), M(P)),
        fe.current === e && (M(fe), (Qf._currentValue = oe)));
    }
    var _e, ve;
    function ye(e) {
      if (_e === void 0)
        try {
          throw Error();
        } catch (e) {
          var t = e.stack.trim().match(/\n( *(at )?)/);
          ((_e = (t && t[1]) || ``),
            (ve =
              -1 <
              e.stack.indexOf(`
    at`)
                ? ` (<anonymous>)`
                : -1 < e.stack.indexOf(`@`)
                  ? `@unknown:0:0`
                  : ``));
        }
      return (
        `
` +
        _e +
        e +
        ve
      );
    }
    var be = !1;
    function xe(e, t) {
      if (!e || be) return ``;
      be = !0;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var r = {
          DetermineComponentFrameRoot: function () {
            try {
              if (t) {
                var n = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(n.prototype, `props`, {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == `object` && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(n, []);
                  } catch (e) {
                    var r = e;
                  }
                  Reflect.construct(e, [], n);
                } else {
                  try {
                    n.call();
                  } catch (e) {
                    r = e;
                  }
                  e.call(n.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (e) {
                  r = e;
                }
                (n = e()) &&
                  typeof n.catch == `function` &&
                  n.catch(function () {});
              }
            } catch (e) {
              if (e && r && typeof e.stack == `string`)
                return [e.stack, r.stack];
            }
            return [null, null];
          },
        };
        r.DetermineComponentFrameRoot.displayName = `DetermineComponentFrameRoot`;
        var i = Object.getOwnPropertyDescriptor(
          r.DetermineComponentFrameRoot,
          `name`,
        );
        i &&
          i.configurable &&
          Object.defineProperty(r.DetermineComponentFrameRoot, `name`, {
            value: `DetermineComponentFrameRoot`,
          });
        var a = r.DetermineComponentFrameRoot(),
          o = a[0],
          s = a[1];
        if (o && s) {
          var c = o.split(`
`),
            l = s.split(`
`);
          for (
            i = r = 0;
            r < c.length && !c[r].includes(`DetermineComponentFrameRoot`);

          )
            r++;
          for (
            ;
            i < l.length && !l[i].includes(`DetermineComponentFrameRoot`);

          )
            i++;
          if (r === c.length || i === l.length)
            for (
              r = c.length - 1, i = l.length - 1;
              1 <= r && 0 <= i && c[r] !== l[i];

            )
              i--;
          for (; 1 <= r && 0 <= i; r--, i--)
            if (c[r] !== l[i]) {
              if (r !== 1 || i !== 1)
                do
                  if ((r--, i--, 0 > i || c[r] !== l[i])) {
                    var u =
                      `
` + c[r].replace(` at new `, ` at `);
                    return (
                      e.displayName &&
                        u.includes(`<anonymous>`) &&
                        (u = u.replace(`<anonymous>`, e.displayName)),
                      u
                    );
                  }
                while (1 <= r && 0 <= i);
              break;
            }
        }
      } finally {
        ((be = !1), (Error.prepareStackTrace = n));
      }
      return (n = e ? e.displayName || e.name : ``) ? ye(n) : ``;
    }
    function Se(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return ye(e.type);
        case 16:
          return ye(`Lazy`);
        case 13:
          return e.child !== t && t !== null
            ? ye(`Suspense Fallback`)
            : ye(`Suspense`);
        case 19:
          return ye(`SuspenseList`);
        case 0:
        case 15:
          return xe(e.type, !1);
        case 11:
          return xe(e.type.render, !1);
        case 1:
          return xe(e.type, !0);
        case 31:
          return ye(`Activity`);
        default:
          return ``;
      }
    }
    function Ce(e) {
      try {
        var t = ``,
          n = null;
        do ((t += Se(e, n)), (n = e), (e = e.return));
        while (e);
        return t;
      } catch (e) {
        return (
          `
Error generating stack: ` +
          e.message +
          `
` +
          e.stack
        );
      }
    }
    var we = Object.prototype.hasOwnProperty,
      Te = t.unstable_scheduleCallback,
      Ee = t.unstable_cancelCallback,
      De = t.unstable_shouldYield,
      Oe = t.unstable_requestPaint,
      ke = t.unstable_now,
      Ae = t.unstable_getCurrentPriorityLevel,
      je = t.unstable_ImmediatePriority,
      Me = t.unstable_UserBlockingPriority,
      Ne = t.unstable_NormalPriority,
      Pe = t.unstable_LowPriority,
      Fe = t.unstable_IdlePriority,
      Ie = t.log,
      Le = t.unstable_setDisableYieldValue,
      Re = null,
      ze = null;
    function Be(e) {
      if (
        (typeof Ie == `function` && Le(e),
        ze && typeof ze.setStrictMode == `function`)
      )
        try {
          ze.setStrictMode(Re, e);
        } catch {}
    }
    var Ve = Math.clz32 ? Math.clz32 : We,
      He = Math.log,
      Ue = Math.LN2;
    function We(e) {
      return ((e >>>= 0), e === 0 ? 32 : (31 - ((He(e) / Ue) | 0)) | 0);
    }
    var Ge = 256,
      Ke = 262144,
      qe = 4194304;
    function Je(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function Ye(e, t, n) {
      var r = e.pendingLanes;
      if (r === 0) return 0;
      var i = 0,
        a = e.suspendedLanes,
        o = e.pingedLanes;
      e = e.warmLanes;
      var s = r & 134217727;
      return (
        s === 0
          ? ((s = r & ~a),
            s === 0
              ? o === 0
                ? n || ((n = r & ~e), n !== 0 && (i = Je(n)))
                : (i = Je(o))
              : (i = Je(s)))
          : ((r = s & ~a),
            r === 0
              ? ((o &= s),
                o === 0
                  ? n || ((n = s & ~e), n !== 0 && (i = Je(n)))
                  : (i = Je(o)))
              : (i = Je(r))),
        i === 0
          ? 0
          : t !== 0 &&
              t !== i &&
              (t & a) === 0 &&
              ((a = i & -i), (n = t & -t), a >= n || (a === 32 && n & 4194048))
            ? t
            : i
      );
    }
    function Xe(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function Ze(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function Qe() {
      var e = qe;
      return ((qe <<= 1), !(qe & 62914560) && (qe = 4194304), e);
    }
    function $e(e) {
      for (var t = [], n = 0; 31 > n; n++) t.push(e);
      return t;
    }
    function et(e, t) {
      ((e.pendingLanes |= t),
        t !== 268435456 &&
          ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
    }
    function F(e, t, n, r, i, a) {
      var o = e.pendingLanes;
      ((e.pendingLanes = n),
        (e.suspendedLanes = 0),
        (e.pingedLanes = 0),
        (e.warmLanes = 0),
        (e.expiredLanes &= n),
        (e.entangledLanes &= n),
        (e.errorRecoveryDisabledLanes &= n),
        (e.shellSuspendCounter = 0));
      var s = e.entanglements,
        c = e.expirationTimes,
        l = e.hiddenUpdates;
      for (n = o & ~n; 0 < n; ) {
        var u = 31 - Ve(n),
          d = 1 << u;
        ((s[u] = 0), (c[u] = -1));
        var f = l[u];
        if (f !== null)
          for (l[u] = null, u = 0; u < f.length; u++) {
            var p = f[u];
            p !== null && (p.lane &= -536870913);
          }
        n &= ~d;
      }
      (r !== 0 && tt(e, r, 0),
        a !== 0 &&
          i === 0 &&
          e.tag !== 0 &&
          (e.suspendedLanes |= a & ~(o & ~t)));
    }
    function tt(e, t, n) {
      ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
      var r = 31 - Ve(t);
      ((e.entangledLanes |= t),
        (e.entanglements[r] = e.entanglements[r] | 1073741824 | (n & 261930)));
    }
    function nt(e, t) {
      var n = (e.entangledLanes |= t);
      for (e = e.entanglements; n; ) {
        var r = 31 - Ve(n),
          i = 1 << r;
        ((i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i));
      }
    }
    function I(e, t) {
      var n = t & -t;
      return (
        (n = n & 42 ? 1 : rt(n)),
        (n & (e.suspendedLanes | t)) === 0 ? n : 0
      );
    }
    function rt(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function it(e) {
      return (
        (e &= -e),
        2 < e ? (8 < e ? (e & 134217727 ? 32 : 268435456) : 8) : 2
      );
    }
    function at() {
      var e = j.p;
      return e === 0 ? ((e = window.event), e === void 0 ? 32 : mp(e.type)) : e;
    }
    function L(e, t) {
      var n = j.p;
      try {
        return ((j.p = e), t());
      } finally {
        j.p = n;
      }
    }
    var ot = Math.random().toString(36).slice(2),
      R = `__reactFiber$` + ot,
      st = `__reactProps$` + ot,
      z = `__reactContainer$` + ot,
      ct = `__reactEvents$` + ot,
      lt = `__reactListeners$` + ot,
      ut = `__reactHandles$` + ot,
      dt = `__reactResources$` + ot,
      ft = `__reactMarker$` + ot;
    function B(e) {
      (delete e[R], delete e[st], delete e[ct], delete e[lt], delete e[ut]);
    }
    function pt(e) {
      var t = e[R];
      if (t) return t;
      for (var n = e.parentNode; n; ) {
        if ((t = n[z] || n[R])) {
          if (
            ((n = t.alternate),
            t.child !== null || (n !== null && n.child !== null))
          )
            for (e = df(e); e !== null; ) {
              if ((n = e[R])) return n;
              e = df(e);
            }
          return t;
        }
        ((e = n), (n = e.parentNode));
      }
      return null;
    }
    function mt(e) {
      if ((e = e[R] || e[z])) {
        var t = e.tag;
        if (
          t === 5 ||
          t === 6 ||
          t === 13 ||
          t === 31 ||
          t === 26 ||
          t === 27 ||
          t === 3
        )
          return e;
      }
      return null;
    }
    function ht(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(i(33));
    }
    function gt(e) {
      var t = e[dt];
      return (
        (t ||= e[dt] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
        t
      );
    }
    function _t(e) {
      e[ft] = !0;
    }
    var vt = new Set(),
      yt = {};
    function bt(e, t) {
      (xt(e, t), xt(e + `Capture`, t));
    }
    function xt(e, t) {
      for (yt[e] = t, e = 0; e < t.length; e++) vt.add(t[e]);
    }
    var St = RegExp(
        `^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`,
      ),
      Ct = {},
      wt = {};
    function Tt(e) {
      return we.call(wt, e)
        ? !0
        : we.call(Ct, e)
          ? !1
          : St.test(e)
            ? (wt[e] = !0)
            : ((Ct[e] = !0), !1);
    }
    function Et(e, t, n) {
      if (Tt(t))
        if (n === null) e.removeAttribute(t);
        else {
          switch (typeof n) {
            case `undefined`:
            case `function`:
            case `symbol`:
              e.removeAttribute(t);
              return;
            case `boolean`:
              var r = t.toLowerCase().slice(0, 5);
              if (r !== `data-` && r !== `aria-`) {
                e.removeAttribute(t);
                return;
              }
          }
          e.setAttribute(t, `` + n);
        }
    }
    function Dt(e, t, n) {
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, `` + n);
      }
    }
    function Ot(e, t, n, r) {
      if (r === null) e.removeAttribute(n);
      else {
        switch (typeof r) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(n);
            return;
        }
        e.setAttributeNS(t, n, `` + r);
      }
    }
    function kt(e) {
      switch (typeof e) {
        case `bigint`:
        case `boolean`:
        case `number`:
        case `string`:
        case `undefined`:
          return e;
        case `object`:
          return e;
        default:
          return ``;
      }
    }
    function At(e) {
      var t = e.type;
      return (
        (e = e.nodeName) &&
        e.toLowerCase() === `input` &&
        (t === `checkbox` || t === `radio`)
      );
    }
    function jt(e, t, n) {
      var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (
        !e.hasOwnProperty(t) &&
        r !== void 0 &&
        typeof r.get == `function` &&
        typeof r.set == `function`
      ) {
        var i = r.get,
          a = r.set;
        return (
          Object.defineProperty(e, t, {
            configurable: !0,
            get: function () {
              return i.call(this);
            },
            set: function (e) {
              ((n = `` + e), a.call(this, e));
            },
          }),
          Object.defineProperty(e, t, { enumerable: r.enumerable }),
          {
            getValue: function () {
              return n;
            },
            setValue: function (e) {
              n = `` + e;
            },
            stopTracking: function () {
              ((e._valueTracker = null), delete e[t]);
            },
          }
        );
      }
    }
    function Mt(e) {
      if (!e._valueTracker) {
        var t = At(e) ? `checked` : `value`;
        e._valueTracker = jt(e, t, `` + e[t]);
      }
    }
    function Nt(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var n = t.getValue(),
        r = ``;
      return (
        e && (r = At(e) ? (e.checked ? `true` : `false`) : e.value),
        (e = r),
        e === n ? !1 : (t.setValue(e), !0)
      );
    }
    function Pt(e) {
      if (((e ||= typeof document < `u` ? document : void 0), e === void 0))
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Ft = /[\n"\\]/g;
    function It(e) {
      return e.replace(Ft, function (e) {
        return `\\` + e.charCodeAt(0).toString(16) + ` `;
      });
    }
    function Lt(e, t, n, r, i, a, o, s) {
      ((e.name = ``),
        o != null &&
        typeof o != `function` &&
        typeof o != `symbol` &&
        typeof o != `boolean`
          ? (e.type = o)
          : e.removeAttribute(`type`),
        t == null
          ? (o !== `submit` && o !== `reset`) || e.removeAttribute(`value`)
          : o === `number`
            ? ((t === 0 && e.value === ``) || e.value != t) &&
              (e.value = `` + kt(t))
            : e.value !== `` + kt(t) && (e.value = `` + kt(t)),
        t == null
          ? n == null
            ? r != null && e.removeAttribute(`value`)
            : zt(e, o, kt(n))
          : zt(e, o, kt(t)),
        i == null && a != null && (e.defaultChecked = !!a),
        i != null &&
          (e.checked = i && typeof i != `function` && typeof i != `symbol`),
        s != null &&
        typeof s != `function` &&
        typeof s != `symbol` &&
        typeof s != `boolean`
          ? (e.name = `` + kt(s))
          : e.removeAttribute(`name`));
    }
    function Rt(e, t, n, r, i, a, o, s) {
      if (
        (a != null &&
          typeof a != `function` &&
          typeof a != `symbol` &&
          typeof a != `boolean` &&
          (e.type = a),
        t != null || n != null)
      ) {
        if (!((a !== `submit` && a !== `reset`) || t != null)) {
          Mt(e);
          return;
        }
        ((n = n == null ? `` : `` + kt(n)),
          (t = t == null ? n : `` + kt(t)),
          s || t === e.value || (e.value = t),
          (e.defaultValue = t));
      }
      ((r ??= i),
        (r = typeof r != `function` && typeof r != `symbol` && !!r),
        (e.checked = s ? e.checked : !!r),
        (e.defaultChecked = !!r),
        o != null &&
          typeof o != `function` &&
          typeof o != `symbol` &&
          typeof o != `boolean` &&
          (e.name = o),
        Mt(e));
    }
    function zt(e, t, n) {
      (t === `number` && Pt(e.ownerDocument) === e) ||
        e.defaultValue === `` + n ||
        (e.defaultValue = `` + n);
    }
    function Bt(e, t, n, r) {
      if (((e = e.options), t)) {
        t = {};
        for (var i = 0; i < n.length; i++) t[`$` + n[i]] = !0;
        for (n = 0; n < e.length; n++)
          ((i = t.hasOwnProperty(`$` + e[n].value)),
            e[n].selected !== i && (e[n].selected = i),
            i && r && (e[n].defaultSelected = !0));
      } else {
        for (n = `` + kt(n), t = null, i = 0; i < e.length; i++) {
          if (e[i].value === n) {
            ((e[i].selected = !0), r && (e[i].defaultSelected = !0));
            return;
          }
          t !== null || e[i].disabled || (t = e[i]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function Vt(e, t, n) {
      if (
        t != null &&
        ((t = `` + kt(t)), t !== e.value && (e.value = t), n == null)
      ) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = n == null ? `` : `` + kt(n);
    }
    function Ht(e, t, n, r) {
      if (t == null) {
        if (r != null) {
          if (n != null) throw Error(i(92));
          if (ae(r)) {
            if (1 < r.length) throw Error(i(93));
            r = r[0];
          }
          n = r;
        }
        ((n ??= ``), (t = n));
      }
      ((n = kt(t)),
        (e.defaultValue = n),
        (r = e.textContent),
        r === n && r !== `` && r !== null && (e.value = r),
        Mt(e));
    }
    function Ut(e, t) {
      if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && n.nodeType === 3) {
          n.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var Wt = new Set(
      `animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(
        ` `,
      ),
    );
    function Gt(e, t, n) {
      var r = t.indexOf(`--`) === 0;
      n == null || typeof n == `boolean` || n === ``
        ? r
          ? e.setProperty(t, ``)
          : t === `float`
            ? (e.cssFloat = ``)
            : (e[t] = ``)
        : r
          ? e.setProperty(t, n)
          : typeof n != `number` || n === 0 || Wt.has(t)
            ? t === `float`
              ? (e.cssFloat = n)
              : (e[t] = (`` + n).trim())
            : (e[t] = n + `px`);
    }
    function Kt(e, t, n) {
      if (t != null && typeof t != `object`) throw Error(i(62));
      if (((e = e.style), n != null)) {
        for (var r in n)
          !n.hasOwnProperty(r) ||
            (t != null && t.hasOwnProperty(r)) ||
            (r.indexOf(`--`) === 0
              ? e.setProperty(r, ``)
              : r === `float`
                ? (e.cssFloat = ``)
                : (e[r] = ``));
        for (var a in t)
          ((r = t[a]), t.hasOwnProperty(a) && n[a] !== r && Gt(e, a, r));
      } else for (var o in t) t.hasOwnProperty(o) && Gt(e, o, t[o]);
    }
    function qt(e) {
      if (e.indexOf(`-`) === -1) return !1;
      switch (e) {
        case `annotation-xml`:
        case `color-profile`:
        case `font-face`:
        case `font-face-src`:
        case `font-face-uri`:
        case `font-face-format`:
        case `font-face-name`:
        case `missing-glyph`:
          return !1;
        default:
          return !0;
      }
    }
    var V = new Map([
        [`acceptCharset`, `accept-charset`],
        [`htmlFor`, `for`],
        [`httpEquiv`, `http-equiv`],
        [`crossOrigin`, `crossorigin`],
        [`accentHeight`, `accent-height`],
        [`alignmentBaseline`, `alignment-baseline`],
        [`arabicForm`, `arabic-form`],
        [`baselineShift`, `baseline-shift`],
        [`capHeight`, `cap-height`],
        [`clipPath`, `clip-path`],
        [`clipRule`, `clip-rule`],
        [`colorInterpolation`, `color-interpolation`],
        [`colorInterpolationFilters`, `color-interpolation-filters`],
        [`colorProfile`, `color-profile`],
        [`colorRendering`, `color-rendering`],
        [`dominantBaseline`, `dominant-baseline`],
        [`enableBackground`, `enable-background`],
        [`fillOpacity`, `fill-opacity`],
        [`fillRule`, `fill-rule`],
        [`floodColor`, `flood-color`],
        [`floodOpacity`, `flood-opacity`],
        [`fontFamily`, `font-family`],
        [`fontSize`, `font-size`],
        [`fontSizeAdjust`, `font-size-adjust`],
        [`fontStretch`, `font-stretch`],
        [`fontStyle`, `font-style`],
        [`fontVariant`, `font-variant`],
        [`fontWeight`, `font-weight`],
        [`glyphName`, `glyph-name`],
        [`glyphOrientationHorizontal`, `glyph-orientation-horizontal`],
        [`glyphOrientationVertical`, `glyph-orientation-vertical`],
        [`horizAdvX`, `horiz-adv-x`],
        [`horizOriginX`, `horiz-origin-x`],
        [`imageRendering`, `image-rendering`],
        [`letterSpacing`, `letter-spacing`],
        [`lightingColor`, `lighting-color`],
        [`markerEnd`, `marker-end`],
        [`markerMid`, `marker-mid`],
        [`markerStart`, `marker-start`],
        [`overlinePosition`, `overline-position`],
        [`overlineThickness`, `overline-thickness`],
        [`paintOrder`, `paint-order`],
        [`panose-1`, `panose-1`],
        [`pointerEvents`, `pointer-events`],
        [`renderingIntent`, `rendering-intent`],
        [`shapeRendering`, `shape-rendering`],
        [`stopColor`, `stop-color`],
        [`stopOpacity`, `stop-opacity`],
        [`strikethroughPosition`, `strikethrough-position`],
        [`strikethroughThickness`, `strikethrough-thickness`],
        [`strokeDasharray`, `stroke-dasharray`],
        [`strokeDashoffset`, `stroke-dashoffset`],
        [`strokeLinecap`, `stroke-linecap`],
        [`strokeLinejoin`, `stroke-linejoin`],
        [`strokeMiterlimit`, `stroke-miterlimit`],
        [`strokeOpacity`, `stroke-opacity`],
        [`strokeWidth`, `stroke-width`],
        [`textAnchor`, `text-anchor`],
        [`textDecoration`, `text-decoration`],
        [`textRendering`, `text-rendering`],
        [`transformOrigin`, `transform-origin`],
        [`underlinePosition`, `underline-position`],
        [`underlineThickness`, `underline-thickness`],
        [`unicodeBidi`, `unicode-bidi`],
        [`unicodeRange`, `unicode-range`],
        [`unitsPerEm`, `units-per-em`],
        [`vAlphabetic`, `v-alphabetic`],
        [`vHanging`, `v-hanging`],
        [`vIdeographic`, `v-ideographic`],
        [`vMathematical`, `v-mathematical`],
        [`vectorEffect`, `vector-effect`],
        [`vertAdvY`, `vert-adv-y`],
        [`vertOriginX`, `vert-origin-x`],
        [`vertOriginY`, `vert-origin-y`],
        [`wordSpacing`, `word-spacing`],
        [`writingMode`, `writing-mode`],
        [`xmlnsXlink`, `xmlns:xlink`],
        [`xHeight`, `x-height`],
      ]),
      Jt =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function Yt(e) {
      return Jt.test(`` + e)
        ? `javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`
        : e;
    }
    function H() {}
    var Xt = null;
    function Zt(e) {
      return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
      );
    }
    var Qt = null,
      $t = null;
    function en(e) {
      var t = mt(e);
      if (t && (e = t.stateNode)) {
        var n = e[st] || null;
        a: switch (((e = t.stateNode), t.type)) {
          case `input`:
            if (
              (Lt(
                e,
                n.value,
                n.defaultValue,
                n.defaultValue,
                n.checked,
                n.defaultChecked,
                n.type,
                n.name,
              ),
              (t = n.name),
              n.type === `radio` && t != null)
            ) {
              for (n = e; n.parentNode; ) n = n.parentNode;
              for (
                n = n.querySelectorAll(
                  `input[name="` + It(`` + t) + `"][type="radio"]`,
                ),
                  t = 0;
                t < n.length;
                t++
              ) {
                var r = n[t];
                if (r !== e && r.form === e.form) {
                  var a = r[st] || null;
                  if (!a) throw Error(i(90));
                  Lt(
                    r,
                    a.value,
                    a.defaultValue,
                    a.defaultValue,
                    a.checked,
                    a.defaultChecked,
                    a.type,
                    a.name,
                  );
                }
              }
              for (t = 0; t < n.length; t++)
                ((r = n[t]), r.form === e.form && Nt(r));
            }
            break a;
          case `textarea`:
            Vt(e, n.value, n.defaultValue);
            break a;
          case `select`:
            ((t = n.value), t != null && Bt(e, !!n.multiple, t, !1));
        }
      }
    }
    var tn = !1;
    function nn(e, t, n) {
      if (tn) return e(t, n);
      tn = !0;
      try {
        return e(t);
      } finally {
        if (
          ((tn = !1),
          (Qt !== null || $t !== null) &&
            (vu(), Qt && ((t = Qt), (e = $t), ($t = Qt = null), en(t), e)))
        )
          for (t = 0; t < e.length; t++) en(e[t]);
      }
    }
    function rn(e, t) {
      var n = e.stateNode;
      if (n === null) return null;
      var r = n[st] || null;
      if (r === null) return null;
      n = r[t];
      a: switch (t) {
        case `onClick`:
        case `onClickCapture`:
        case `onDoubleClick`:
        case `onDoubleClickCapture`:
        case `onMouseDown`:
        case `onMouseDownCapture`:
        case `onMouseMove`:
        case `onMouseMoveCapture`:
        case `onMouseUp`:
        case `onMouseUpCapture`:
        case `onMouseEnter`:
          ((r = !r.disabled) ||
            ((e = e.type),
            (r = !(
              e === `button` ||
              e === `input` ||
              e === `select` ||
              e === `textarea`
            ))),
            (e = !r));
          break a;
        default:
          e = !1;
      }
      if (e) return null;
      if (n && typeof n != `function`) throw Error(i(231, t, typeof n));
      return n;
    }
    var an = !(
        typeof window > `u` ||
        window.document === void 0 ||
        window.document.createElement === void 0
      ),
      on = !1;
    if (an)
      try {
        var sn = {};
        (Object.defineProperty(sn, `passive`, {
          get: function () {
            on = !0;
          },
        }),
          window.addEventListener(`test`, sn, sn),
          window.removeEventListener(`test`, sn, sn));
      } catch {
        on = !1;
      }
    var cn = null,
      ln = null,
      un = null;
    function dn() {
      if (un) return un;
      var e,
        t = ln,
        n = t.length,
        r,
        i = `value` in cn ? cn.value : cn.textContent,
        a = i.length;
      for (e = 0; e < n && t[e] === i[e]; e++);
      var o = n - e;
      for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
      return (un = i.slice(e, 1 < r ? 1 - r : void 0));
    }
    function fn(e) {
      var t = e.keyCode;
      return (
        `charCode` in e
          ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
          : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
      );
    }
    function pn() {
      return !0;
    }
    function mn() {
      return !1;
    }
    function hn(e) {
      function t(t, n, r, i, a) {
        for (var o in ((this._reactName = t),
        (this._targetInst = r),
        (this.type = n),
        (this.nativeEvent = i),
        (this.target = a),
        (this.currentTarget = null),
        e))
          e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(i) : i[o]));
        return (
          (this.isDefaultPrevented = (
            i.defaultPrevented == null
              ? !1 === i.returnValue
              : i.defaultPrevented
          )
            ? pn
            : mn),
          (this.isPropagationStopped = mn),
          this
        );
      }
      return (
        h(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var e = this.nativeEvent;
            e &&
              (e.preventDefault
                ? e.preventDefault()
                : typeof e.returnValue != `unknown` && (e.returnValue = !1),
              (this.isDefaultPrevented = pn));
          },
          stopPropagation: function () {
            var e = this.nativeEvent;
            e &&
              (e.stopPropagation
                ? e.stopPropagation()
                : typeof e.cancelBubble != `unknown` && (e.cancelBubble = !0),
              (this.isPropagationStopped = pn));
          },
          persist: function () {},
          isPersistent: pn,
        }),
        t
      );
    }
    var gn = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      _n = hn(gn),
      vn = h({}, gn, { view: 0, detail: 0 }),
      yn = hn(vn),
      bn,
      xn,
      Sn,
      Cn = h({}, vn, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Pn,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
          return e.relatedTarget === void 0
            ? e.fromElement === e.srcElement
              ? e.toElement
              : e.fromElement
            : e.relatedTarget;
        },
        movementX: function (e) {
          return `movementX` in e
            ? e.movementX
            : (e !== Sn &&
                (Sn && e.type === `mousemove`
                  ? ((bn = e.screenX - Sn.screenX),
                    (xn = e.screenY - Sn.screenY))
                  : (xn = bn = 0),
                (Sn = e)),
              bn);
        },
        movementY: function (e) {
          return `movementY` in e ? e.movementY : xn;
        },
      }),
      wn = hn(Cn),
      Tn = hn(h({}, Cn, { dataTransfer: 0 })),
      En = hn(h({}, vn, { relatedTarget: 0 })),
      Dn = hn(
        h({}, gn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      ),
      On = hn(
        h({}, gn, {
          clipboardData: function (e) {
            return `clipboardData` in e
              ? e.clipboardData
              : window.clipboardData;
          },
        }),
      ),
      kn = hn(h({}, gn, { data: 0 })),
      An = {
        Esc: `Escape`,
        Spacebar: ` `,
        Left: `ArrowLeft`,
        Up: `ArrowUp`,
        Right: `ArrowRight`,
        Down: `ArrowDown`,
        Del: `Delete`,
        Win: `OS`,
        Menu: `ContextMenu`,
        Apps: `ContextMenu`,
        Scroll: `ScrollLock`,
        MozPrintableKey: `Unidentified`,
      },
      jn = {
        8: `Backspace`,
        9: `Tab`,
        12: `Clear`,
        13: `Enter`,
        16: `Shift`,
        17: `Control`,
        18: `Alt`,
        19: `Pause`,
        20: `CapsLock`,
        27: `Escape`,
        32: ` `,
        33: `PageUp`,
        34: `PageDown`,
        35: `End`,
        36: `Home`,
        37: `ArrowLeft`,
        38: `ArrowUp`,
        39: `ArrowRight`,
        40: `ArrowDown`,
        45: `Insert`,
        46: `Delete`,
        112: `F1`,
        113: `F2`,
        114: `F3`,
        115: `F4`,
        116: `F5`,
        117: `F6`,
        118: `F7`,
        119: `F8`,
        120: `F9`,
        121: `F10`,
        122: `F11`,
        123: `F12`,
        144: `NumLock`,
        145: `ScrollLock`,
        224: `Meta`,
      },
      Mn = {
        Alt: `altKey`,
        Control: `ctrlKey`,
        Meta: `metaKey`,
        Shift: `shiftKey`,
      };
    function Nn(e) {
      var t = this.nativeEvent;
      return t.getModifierState
        ? t.getModifierState(e)
        : (e = Mn[e])
          ? !!t[e]
          : !1;
    }
    function Pn() {
      return Nn;
    }
    var Fn = hn(
        h({}, vn, {
          key: function (e) {
            if (e.key) {
              var t = An[e.key] || e.key;
              if (t !== `Unidentified`) return t;
            }
            return e.type === `keypress`
              ? ((e = fn(e)), e === 13 ? `Enter` : String.fromCharCode(e))
              : e.type === `keydown` || e.type === `keyup`
                ? jn[e.keyCode] || `Unidentified`
                : ``;
          },
          code: 0,
          location: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          repeat: 0,
          locale: 0,
          getModifierState: Pn,
          charCode: function (e) {
            return e.type === `keypress` ? fn(e) : 0;
          },
          keyCode: function (e) {
            return e.type === `keydown` || e.type === `keyup` ? e.keyCode : 0;
          },
          which: function (e) {
            return e.type === `keypress`
              ? fn(e)
              : e.type === `keydown` || e.type === `keyup`
                ? e.keyCode
                : 0;
          },
        }),
      ),
      In = hn(
        h({}, Cn, {
          pointerId: 0,
          width: 0,
          height: 0,
          pressure: 0,
          tangentialPressure: 0,
          tiltX: 0,
          tiltY: 0,
          twist: 0,
          pointerType: 0,
          isPrimary: 0,
        }),
      ),
      Ln = hn(
        h({}, vn, {
          touches: 0,
          targetTouches: 0,
          changedTouches: 0,
          altKey: 0,
          metaKey: 0,
          ctrlKey: 0,
          shiftKey: 0,
          getModifierState: Pn,
        }),
      ),
      Rn = hn(h({}, gn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
      zn = hn(
        h({}, Cn, {
          deltaX: function (e) {
            return `deltaX` in e
              ? e.deltaX
              : `wheelDeltaX` in e
                ? -e.wheelDeltaX
                : 0;
          },
          deltaY: function (e) {
            return `deltaY` in e
              ? e.deltaY
              : `wheelDeltaY` in e
                ? -e.wheelDeltaY
                : `wheelDelta` in e
                  ? -e.wheelDelta
                  : 0;
          },
          deltaZ: 0,
          deltaMode: 0,
        }),
      ),
      Bn = hn(h({}, gn, { newState: 0, oldState: 0 })),
      Vn = [9, 13, 27, 32],
      Hn = an && `CompositionEvent` in window,
      Un = null;
    an && `documentMode` in document && (Un = document.documentMode);
    var Wn = an && `TextEvent` in window && !Un,
      Gn = an && (!Hn || (Un && 8 < Un && 11 >= Un)),
      Kn = ` `,
      qn = !1;
    function Jn(e, t) {
      switch (e) {
        case `keyup`:
          return Vn.indexOf(t.keyCode) !== -1;
        case `keydown`:
          return t.keyCode !== 229;
        case `keypress`:
        case `mousedown`:
        case `focusout`:
          return !0;
        default:
          return !1;
      }
    }
    function Yn(e) {
      return (
        (e = e.detail),
        typeof e == `object` && `data` in e ? e.data : null
      );
    }
    var Xn = !1;
    function Zn(e, t) {
      switch (e) {
        case `compositionend`:
          return Yn(t);
        case `keypress`:
          return t.which === 32 ? ((qn = !0), Kn) : null;
        case `textInput`:
          return ((e = t.data), e === Kn && qn ? null : e);
        default:
          return null;
      }
    }
    function Qn(e, t) {
      if (Xn)
        return e === `compositionend` || (!Hn && Jn(e, t))
          ? ((e = dn()), (un = ln = cn = null), (Xn = !1), e)
          : null;
      switch (e) {
        case `paste`:
          return null;
        case `keypress`:
          if (
            !(t.ctrlKey || t.altKey || t.metaKey) ||
            (t.ctrlKey && t.altKey)
          ) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case `compositionend`:
          return Gn && t.locale !== `ko` ? null : t.data;
        default:
          return null;
      }
    }
    var $n = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function er(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === `input` ? !!$n[e.type] : t === `textarea`;
    }
    function tr(e, t, n, r) {
      (Qt ? ($t ? $t.push(r) : ($t = [r])) : (Qt = r),
        (t = Td(t, `onChange`)),
        0 < t.length &&
          ((n = new _n(`onChange`, `change`, null, n, r)),
          e.push({ event: n, listeners: t })));
    }
    var nr = null,
      rr = null;
    function ir(e) {
      vd(e, 0);
    }
    function ar(e) {
      if (Nt(ht(e))) return e;
    }
    function or(e, t) {
      if (e === `change`) return t;
    }
    var sr = !1;
    if (an) {
      var cr;
      if (an) {
        var lr = `oninput` in document;
        if (!lr) {
          var ur = document.createElement(`div`);
          (ur.setAttribute(`oninput`, `return;`),
            (lr = typeof ur.oninput == `function`));
        }
        cr = lr;
      } else cr = !1;
      sr = cr && (!document.documentMode || 9 < document.documentMode);
    }
    function dr() {
      nr && (nr.detachEvent(`onpropertychange`, fr), (rr = nr = null));
    }
    function fr(e) {
      if (e.propertyName === `value` && ar(rr)) {
        var t = [];
        (tr(t, rr, e, Zt(e)), nn(ir, t));
      }
    }
    function pr(e, t, n) {
      e === `focusin`
        ? (dr(), (nr = t), (rr = n), nr.attachEvent(`onpropertychange`, fr))
        : e === `focusout` && dr();
    }
    function mr(e) {
      if (e === `selectionchange` || e === `keyup` || e === `keydown`)
        return ar(rr);
    }
    function hr(e, t) {
      if (e === `click`) return ar(t);
    }
    function gr(e, t) {
      if (e === `input` || e === `change`) return ar(t);
    }
    function _r(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
    }
    var vr = typeof Object.is == `function` ? Object.is : _r;
    function yr(e, t) {
      if (vr(e, t)) return !0;
      if (typeof e != `object` || !e || typeof t != `object` || !t) return !1;
      var n = Object.keys(e),
        r = Object.keys(t);
      if (n.length !== r.length) return !1;
      for (r = 0; r < n.length; r++) {
        var i = n[r];
        if (!we.call(t, i) || !vr(e[i], t[i])) return !1;
      }
      return !0;
    }
    function br(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function xr(e, t) {
      var n = br(e);
      e = 0;
      for (var r; n; ) {
        if (n.nodeType === 3) {
          if (((r = e + n.textContent.length), e <= t && r >= t))
            return { node: n, offset: t - e };
          e = r;
        }
        a: {
          for (; n; ) {
            if (n.nextSibling) {
              n = n.nextSibling;
              break a;
            }
            n = n.parentNode;
          }
          n = void 0;
        }
        n = br(n);
      }
    }
    function Sr(e, t) {
      return e && t
        ? e === t
          ? !0
          : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
              ? Sr(e, t.parentNode)
              : `contains` in e
                ? e.contains(t)
                : e.compareDocumentPosition
                  ? !!(e.compareDocumentPosition(t) & 16)
                  : !1
        : !1;
    }
    function Cr(e) {
      e =
        e != null &&
        e.ownerDocument != null &&
        e.ownerDocument.defaultView != null
          ? e.ownerDocument.defaultView
          : window;
      for (var t = Pt(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var n = typeof t.contentWindow.location.href == `string`;
        } catch {
          n = !1;
        }
        if (n) e = t.contentWindow;
        else break;
        t = Pt(e.document);
      }
      return t;
    }
    function wr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return (
        t &&
        ((t === `input` &&
          (e.type === `text` ||
            e.type === `search` ||
            e.type === `tel` ||
            e.type === `url` ||
            e.type === `password`)) ||
          t === `textarea` ||
          e.contentEditable === `true`)
      );
    }
    var Tr = an && `documentMode` in document && 11 >= document.documentMode,
      Er = null,
      Dr = null,
      Or = null,
      kr = !1;
    function Ar(e, t, n) {
      var r =
        n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
      kr ||
        Er == null ||
        Er !== Pt(r) ||
        ((r = Er),
        `selectionStart` in r && wr(r)
          ? (r = { start: r.selectionStart, end: r.selectionEnd })
          : ((r = (
              (r.ownerDocument && r.ownerDocument.defaultView) ||
              window
            ).getSelection()),
            (r = {
              anchorNode: r.anchorNode,
              anchorOffset: r.anchorOffset,
              focusNode: r.focusNode,
              focusOffset: r.focusOffset,
            })),
        (Or && yr(Or, r)) ||
          ((Or = r),
          (r = Td(Dr, `onSelect`)),
          0 < r.length &&
            ((t = new _n(`onSelect`, `select`, null, t, n)),
            e.push({ event: t, listeners: r }),
            (t.target = Er))));
    }
    function jr(e, t) {
      var n = {};
      return (
        (n[e.toLowerCase()] = t.toLowerCase()),
        (n[`Webkit` + e] = `webkit` + t),
        (n[`Moz` + e] = `moz` + t),
        n
      );
    }
    var Mr = {
        animationend: jr(`Animation`, `AnimationEnd`),
        animationiteration: jr(`Animation`, `AnimationIteration`),
        animationstart: jr(`Animation`, `AnimationStart`),
        transitionrun: jr(`Transition`, `TransitionRun`),
        transitionstart: jr(`Transition`, `TransitionStart`),
        transitioncancel: jr(`Transition`, `TransitionCancel`),
        transitionend: jr(`Transition`, `TransitionEnd`),
      },
      Nr = {},
      Pr = {};
    an &&
      ((Pr = document.createElement(`div`).style),
      `AnimationEvent` in window ||
        (delete Mr.animationend.animation,
        delete Mr.animationiteration.animation,
        delete Mr.animationstart.animation),
      `TransitionEvent` in window || delete Mr.transitionend.transition);
    function Fr(e) {
      if (Nr[e]) return Nr[e];
      if (!Mr[e]) return e;
      var t = Mr[e],
        n;
      for (n in t) if (t.hasOwnProperty(n) && n in Pr) return (Nr[e] = t[n]);
      return e;
    }
    var Ir = Fr(`animationend`),
      Lr = Fr(`animationiteration`),
      Rr = Fr(`animationstart`),
      zr = Fr(`transitionrun`),
      Br = Fr(`transitionstart`),
      Vr = Fr(`transitioncancel`),
      Hr = Fr(`transitionend`),
      Ur = new Map(),
      Wr =
        `abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(
          ` `,
        );
    Wr.push(`scrollEnd`);
    function Gr(e, t) {
      (Ur.set(e, t), bt(t, [e]));
    }
    var Kr =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (
                typeof window == `object` &&
                typeof window.ErrorEvent == `function`
              ) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (
                typeof process == `object` &&
                typeof process.emit == `function`
              ) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      qr = [],
      Jr = 0,
      Yr = 0;
    function Xr() {
      for (var e = Jr, t = (Yr = Jr = 0); t < e; ) {
        var n = qr[t];
        qr[t++] = null;
        var r = qr[t];
        qr[t++] = null;
        var i = qr[t];
        qr[t++] = null;
        var a = qr[t];
        if (((qr[t++] = null), r !== null && i !== null)) {
          var o = r.pending;
          (o === null ? (i.next = i) : ((i.next = o.next), (o.next = i)),
            (r.pending = i));
        }
        a !== 0 && ei(n, i, a);
      }
    }
    function Zr(e, t, n, r) {
      ((qr[Jr++] = e),
        (qr[Jr++] = t),
        (qr[Jr++] = n),
        (qr[Jr++] = r),
        (Yr |= r),
        (e.lanes |= r),
        (e = e.alternate),
        e !== null && (e.lanes |= r));
    }
    function Qr(e, t, n, r) {
      return (Zr(e, t, n, r), ti(e));
    }
    function $r(e, t) {
      return (Zr(e, null, null, t), ti(e));
    }
    function ei(e, t, n) {
      e.lanes |= n;
      var r = e.alternate;
      r !== null && (r.lanes |= n);
      for (var i = !1, a = e.return; a !== null; )
        ((a.childLanes |= n),
          (r = a.alternate),
          r !== null && (r.childLanes |= n),
          a.tag === 22 &&
            ((e = a.stateNode), e === null || e._visibility & 1 || (i = !0)),
          (e = a),
          (a = a.return));
      return e.tag === 3
        ? ((a = e.stateNode),
          i &&
            t !== null &&
            ((i = 31 - Ve(n)),
            (e = a.hiddenUpdates),
            (r = e[i]),
            r === null ? (e[i] = [t]) : r.push(t),
            (t.lane = n | 536870912)),
          a)
        : null;
    }
    function ti(e) {
      if (50 < lu) throw ((lu = 0), (uu = null), Error(i(185)));
      for (var t = e.return; t !== null; ) ((e = t), (t = e.return));
      return e.tag === 3 ? e.stateNode : null;
    }
    var ni = {};
    function ri(e, t, n, r) {
      ((this.tag = e),
        (this.key = n),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = t),
        (this.dependencies =
          this.memoizedState =
          this.updateQueue =
          this.memoizedProps =
            null),
        (this.mode = r),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function ii(e, t, n, r) {
      return new ri(e, t, n, r);
    }
    function ai(e) {
      return ((e = e.prototype), !(!e || !e.isReactComponent));
    }
    function oi(e, t) {
      var n = e.alternate;
      return (
        n === null
          ? ((n = ii(e.tag, t, e.key, e.mode)),
            (n.elementType = e.elementType),
            (n.type = e.type),
            (n.stateNode = e.stateNode),
            (n.alternate = e),
            (e.alternate = n))
          : ((n.pendingProps = t),
            (n.type = e.type),
            (n.flags = 0),
            (n.subtreeFlags = 0),
            (n.deletions = null)),
        (n.flags = e.flags & 65011712),
        (n.childLanes = e.childLanes),
        (n.lanes = e.lanes),
        (n.child = e.child),
        (n.memoizedProps = e.memoizedProps),
        (n.memoizedState = e.memoizedState),
        (n.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (n.dependencies =
          t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
        (n.sibling = e.sibling),
        (n.index = e.index),
        (n.ref = e.ref),
        (n.refCleanup = e.refCleanup),
        n
      );
    }
    function si(e, t) {
      e.flags &= 65011714;
      var n = e.alternate;
      return (
        n === null
          ? ((e.childLanes = 0),
            (e.lanes = t),
            (e.child = null),
            (e.subtreeFlags = 0),
            (e.memoizedProps = null),
            (e.memoizedState = null),
            (e.updateQueue = null),
            (e.dependencies = null),
            (e.stateNode = null))
          : ((e.childLanes = n.childLanes),
            (e.lanes = n.lanes),
            (e.child = n.child),
            (e.subtreeFlags = 0),
            (e.deletions = null),
            (e.memoizedProps = n.memoizedProps),
            (e.memoizedState = n.memoizedState),
            (e.updateQueue = n.updateQueue),
            (e.type = n.type),
            (t = n.dependencies),
            (e.dependencies =
              t === null
                ? null
                : { lanes: t.lanes, firstContext: t.firstContext })),
        e
      );
    }
    function ci(e, t, n, r, a, o) {
      var s = 0;
      if (((r = e), typeof e == `function`)) ai(e) && (s = 1);
      else if (typeof e == `string`)
        s = Uf(e, n, ue.current)
          ? 26
          : e === `html` || e === `head` || e === `body`
            ? 27
            : 5;
      else
        a: switch (e) {
          case te:
            return (
              (e = ii(31, n, t, a)),
              (e.elementType = te),
              (e.lanes = o),
              e
            );
          case y:
            return li(n.children, a, o, t);
          case b:
            ((s = 8), (a |= 24));
            break;
          case x:
            return (
              (e = ii(12, n, t, a | 2)),
              (e.elementType = x),
              (e.lanes = o),
              e
            );
          case T:
            return (
              (e = ii(13, n, t, a)),
              (e.elementType = T),
              (e.lanes = o),
              e
            );
          case ee:
            return (
              (e = ii(19, n, t, a)),
              (e.elementType = ee),
              (e.lanes = o),
              e
            );
          default:
            if (typeof e == `object` && e)
              switch (e.$$typeof) {
                case C:
                  s = 10;
                  break a;
                case S:
                  s = 9;
                  break a;
                case w:
                  s = 11;
                  break a;
                case E:
                  s = 14;
                  break a;
                case D:
                  ((s = 16), (r = null));
                  break a;
              }
            ((s = 29),
              (n = Error(i(130, e === null ? `null` : typeof e, ``))),
              (r = null));
        }
      return (
        (t = ii(s, n, t, a)),
        (t.elementType = e),
        (t.type = r),
        (t.lanes = o),
        t
      );
    }
    function li(e, t, n, r) {
      return ((e = ii(7, e, r, t)), (e.lanes = n), e);
    }
    function ui(e, t, n) {
      return ((e = ii(6, e, null, t)), (e.lanes = n), e);
    }
    function di(e) {
      var t = ii(18, null, null, 0);
      return ((t.stateNode = e), t);
    }
    function fi(e, t, n) {
      return (
        (t = ii(4, e.children === null ? [] : e.children, e.key, t)),
        (t.lanes = n),
        (t.stateNode = {
          containerInfo: e.containerInfo,
          pendingChildren: null,
          implementation: e.implementation,
        }),
        t
      );
    }
    var pi = new WeakMap();
    function mi(e, t) {
      if (typeof e == `object` && e) {
        var n = pi.get(e);
        return n === void 0
          ? ((t = { value: e, source: t, stack: Ce(t) }), pi.set(e, t), t)
          : n;
      }
      return { value: e, source: t, stack: Ce(t) };
    }
    var hi = [],
      gi = 0,
      _i = null,
      vi = 0,
      yi = [],
      bi = 0,
      xi = null,
      Si = 1,
      Ci = ``;
    function wi(e, t) {
      ((hi[gi++] = vi), (hi[gi++] = _i), (_i = e), (vi = t));
    }
    function Ti(e, t, n) {
      ((yi[bi++] = Si), (yi[bi++] = Ci), (yi[bi++] = xi), (xi = e));
      var r = Si;
      e = Ci;
      var i = 32 - Ve(r) - 1;
      ((r &= ~(1 << i)), (n += 1));
      var a = 32 - Ve(t) + i;
      if (30 < a) {
        var o = i - (i % 5);
        ((a = (r & ((1 << o) - 1)).toString(32)),
          (r >>= o),
          (i -= o),
          (Si = (1 << (32 - Ve(t) + i)) | (n << i) | r),
          (Ci = a + e));
      } else ((Si = (1 << a) | (n << i) | r), (Ci = e));
    }
    function Ei(e) {
      e.return !== null && (wi(e, 1), Ti(e, 1, 0));
    }
    function Di(e) {
      for (; e === _i; )
        ((_i = hi[--gi]), (hi[gi] = null), (vi = hi[--gi]), (hi[gi] = null));
      for (; e === xi; )
        ((xi = yi[--bi]),
          (yi[bi] = null),
          (Ci = yi[--bi]),
          (yi[bi] = null),
          (Si = yi[--bi]),
          (yi[bi] = null));
    }
    function Oi(e, t) {
      ((yi[bi++] = Si),
        (yi[bi++] = Ci),
        (yi[bi++] = xi),
        (Si = t.id),
        (Ci = t.overflow),
        (xi = e));
    }
    var ki = null,
      Ai = null,
      U = !1,
      ji = null,
      Mi = !1,
      Ni = Error(i(519));
    function Pi(e) {
      throw (
        Bi(
          mi(
            Error(
              i(
                418,
                1 < arguments.length && arguments[1] !== void 0 && arguments[1]
                  ? `text`
                  : `HTML`,
                ``,
              ),
            ),
            e,
          ),
        ),
        Ni
      );
    }
    function Fi(e) {
      var t = e.stateNode,
        n = e.type,
        r = e.memoizedProps;
      switch (((t[R] = e), (t[st] = r), n)) {
        case `dialog`:
          ($(`cancel`, t), $(`close`, t));
          break;
        case `iframe`:
        case `object`:
        case `embed`:
          $(`load`, t);
          break;
        case `video`:
        case `audio`:
          for (n = 0; n < gd.length; n++) $(gd[n], t);
          break;
        case `source`:
          $(`error`, t);
          break;
        case `img`:
        case `image`:
        case `link`:
          ($(`error`, t), $(`load`, t));
          break;
        case `details`:
          $(`toggle`, t);
          break;
        case `input`:
          ($(`invalid`, t),
            Rt(
              t,
              r.value,
              r.defaultValue,
              r.checked,
              r.defaultChecked,
              r.type,
              r.name,
              !0,
            ));
          break;
        case `select`:
          $(`invalid`, t);
          break;
        case `textarea`:
          ($(`invalid`, t), Ht(t, r.value, r.defaultValue, r.children));
      }
      ((n = r.children),
        (typeof n != `string` &&
          typeof n != `number` &&
          typeof n != `bigint`) ||
        t.textContent === `` + n ||
        !0 === r.suppressHydrationWarning ||
        jd(t.textContent, n)
          ? (r.popover != null && ($(`beforetoggle`, t), $(`toggle`, t)),
            r.onScroll != null && $(`scroll`, t),
            r.onScrollEnd != null && $(`scrollend`, t),
            r.onClick != null && (t.onclick = H),
            (t = !0))
          : (t = !1),
        t || Pi(e, !0));
    }
    function Ii(e) {
      for (ki = e.return; ki; )
        switch (ki.tag) {
          case 5:
          case 31:
          case 13:
            Mi = !1;
            return;
          case 27:
          case 3:
            Mi = !0;
            return;
          default:
            ki = ki.return;
        }
    }
    function Li(e) {
      if (e !== ki) return !1;
      if (!U) return (Ii(e), (U = !0), !1);
      var t = e.tag,
        n;
      if (
        ((n = t !== 3 && t !== 27) &&
          ((n = t === 5) &&
            ((n = e.type),
            (n =
              !(n !== `form` && n !== `button`) ||
              Ud(e.type, e.memoizedProps))),
          (n = !n)),
        n && Ai && Pi(e),
        Ii(e),
        t === 13)
      ) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(i(317));
        Ai = uf(e);
      } else if (t === 31) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(i(317));
        Ai = uf(e);
      } else
        t === 27
          ? ((t = Ai),
            Zd(e.type) ? ((e = lf), (lf = null), (Ai = e)) : (Ai = t))
          : (Ai = ki ? cf(e.stateNode.nextSibling) : null);
      return !0;
    }
    function Ri() {
      ((Ai = ki = null), (U = !1));
    }
    function zi() {
      var e = ji;
      return (
        e !== null &&
          (Yl === null ? (Yl = e) : Yl.push.apply(Yl, e), (ji = null)),
        e
      );
    }
    function Bi(e) {
      ji === null ? (ji = [e]) : ji.push(e);
    }
    var Vi = le(null),
      Hi = null,
      Ui = null;
    function Wi(e, t, n) {
      (N(Vi, t._currentValue), (t._currentValue = n));
    }
    function Gi(e) {
      ((e._currentValue = Vi.current), M(Vi));
    }
    function Ki(e, t, n) {
      for (; e !== null; ) {
        var r = e.alternate;
        if (
          ((e.childLanes & t) === t
            ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t)
            : ((e.childLanes |= t), r !== null && (r.childLanes |= t)),
          e === n)
        )
          break;
        e = e.return;
      }
    }
    function qi(e, t, n, r) {
      var a = e.child;
      for (a !== null && (a.return = e); a !== null; ) {
        var o = a.dependencies;
        if (o !== null) {
          var s = a.child;
          o = o.firstContext;
          a: for (; o !== null; ) {
            var c = o;
            o = a;
            for (var l = 0; l < t.length; l++)
              if (c.context === t[l]) {
                ((o.lanes |= n),
                  (c = o.alternate),
                  c !== null && (c.lanes |= n),
                  Ki(o.return, n, e),
                  r || (s = null));
                break a;
              }
            o = c.next;
          }
        } else if (a.tag === 18) {
          if (((s = a.return), s === null)) throw Error(i(341));
          ((s.lanes |= n),
            (o = s.alternate),
            o !== null && (o.lanes |= n),
            Ki(s, n, e),
            (s = null));
        } else s = a.child;
        if (s !== null) s.return = a;
        else
          for (s = a; s !== null; ) {
            if (s === e) {
              s = null;
              break;
            }
            if (((a = s.sibling), a !== null)) {
              ((a.return = s.return), (s = a));
              break;
            }
            s = s.return;
          }
        a = s;
      }
    }
    function Ji(e, t, n, r) {
      e = null;
      for (var a = t, o = !1; a !== null; ) {
        if (!o) {
          if (a.flags & 524288) o = !0;
          else if (a.flags & 262144) break;
        }
        if (a.tag === 10) {
          var s = a.alternate;
          if (s === null) throw Error(i(387));
          if (((s = s.memoizedProps), s !== null)) {
            var c = a.type;
            vr(a.pendingProps.value, s.value) ||
              (e === null ? (e = [c]) : e.push(c));
          }
        } else if (a === fe.current) {
          if (((s = a.alternate), s === null)) throw Error(i(387));
          s.memoizedState.memoizedState !== a.memoizedState.memoizedState &&
            (e === null ? (e = [Qf]) : e.push(Qf));
        }
        a = a.return;
      }
      (e !== null && qi(t, e, n, r), (t.flags |= 262144));
    }
    function Yi(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!vr(e.context._currentValue, e.memoizedValue)) return !0;
        e = e.next;
      }
      return !1;
    }
    function Xi(e) {
      ((Hi = e),
        (Ui = null),
        (e = e.dependencies),
        e !== null && (e.firstContext = null));
    }
    function Zi(e) {
      return $i(Hi, e);
    }
    function Qi(e, t) {
      return (Hi === null && Xi(e), $i(e, t));
    }
    function $i(e, t) {
      var n = t._currentValue;
      if (((t = { context: t, memoizedValue: n, next: null }), Ui === null)) {
        if (e === null) throw Error(i(308));
        ((Ui = t),
          (e.dependencies = { lanes: 0, firstContext: t }),
          (e.flags |= 524288));
      } else Ui = Ui.next = t;
      return n;
    }
    var ea =
        typeof AbortController < `u`
          ? AbortController
          : function () {
              var e = [],
                t = (this.signal = {
                  aborted: !1,
                  addEventListener: function (t, n) {
                    e.push(n);
                  },
                });
              this.abort = function () {
                ((t.aborted = !0),
                  e.forEach(function (e) {
                    return e();
                  }));
              };
            },
      ta = t.unstable_scheduleCallback,
      na = t.unstable_NormalPriority,
      ra = {
        $$typeof: C,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function ia() {
      return { controller: new ea(), data: new Map(), refCount: 0 };
    }
    function aa(e) {
      (e.refCount--,
        e.refCount === 0 &&
          ta(na, function () {
            e.controller.abort();
          }));
    }
    var oa = null,
      sa = 0,
      ca = 0,
      la = null;
    function ua(e, t) {
      if (oa === null) {
        var n = (oa = []);
        ((sa = 0),
          (ca = ud()),
          (la = {
            status: `pending`,
            value: void 0,
            then: function (e) {
              n.push(e);
            },
          }));
      }
      return (sa++, t.then(da, da), t);
    }
    function da() {
      if (--sa === 0 && oa !== null) {
        la !== null && (la.status = `fulfilled`);
        var e = oa;
        ((oa = null), (ca = 0), (la = null));
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function fa(e, t) {
      var n = [],
        r = {
          status: `pending`,
          value: null,
          reason: null,
          then: function (e) {
            n.push(e);
          },
        };
      return (
        e.then(
          function () {
            ((r.status = `fulfilled`), (r.value = t));
            for (var e = 0; e < n.length; e++) (0, n[e])(t);
          },
          function (e) {
            for (r.status = `rejected`, r.reason = e, e = 0; e < n.length; e++)
              (0, n[e])(void 0);
          },
        ),
        r
      );
    }
    var pa = A.S;
    A.S = function (e, t) {
      ((Ql = ke()),
        typeof t == `object` && t && typeof t.then == `function` && ua(e, t),
        pa !== null && pa(e, t));
    };
    var ma = le(null);
    function ha() {
      var e = ma.current;
      return e === null ? Y.pooledCache : e;
    }
    function ga(e, t) {
      t === null ? N(ma, ma.current) : N(ma, t.pool);
    }
    function _a() {
      var e = ha();
      return e === null ? null : { parent: ra._currentValue, pool: e };
    }
    var va = Error(i(460)),
      ya = Error(i(474)),
      ba = Error(i(542)),
      xa = { then: function () {} };
    function Sa(e) {
      return ((e = e.status), e === `fulfilled` || e === `rejected`);
    }
    function Ca(e, t, n) {
      switch (
        ((n = e[n]),
        n === void 0 ? e.push(t) : n !== t && (t.then(H, H), (t = n)),
        t.status)
      ) {
        case `fulfilled`:
          return t.value;
        case `rejected`:
          throw ((e = t.reason), Da(e), e);
        default:
          if (typeof t.status == `string`) t.then(H, H);
          else {
            if (((e = Y), e !== null && 100 < e.shellSuspendCounter))
              throw Error(i(482));
            ((e = t),
              (e.status = `pending`),
              e.then(
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    ((n.status = `fulfilled`), (n.value = e));
                  }
                },
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    ((n.status = `rejected`), (n.reason = e));
                  }
                },
              ));
          }
          switch (t.status) {
            case `fulfilled`:
              return t.value;
            case `rejected`:
              throw ((e = t.reason), Da(e), e);
          }
          throw ((Ta = t), va);
      }
    }
    function wa(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (e) {
        throw typeof e == `object` && e && typeof e.then == `function`
          ? ((Ta = e), va)
          : e;
      }
    }
    var Ta = null;
    function Ea() {
      if (Ta === null) throw Error(i(459));
      var e = Ta;
      return ((Ta = null), e);
    }
    function Da(e) {
      if (e === va || e === ba) throw Error(i(483));
    }
    var Oa = null,
      ka = 0;
    function Aa(e) {
      var t = ka;
      return ((ka += 1), Oa === null && (Oa = []), Ca(Oa, e, t));
    }
    function ja(e, t) {
      ((t = t.props.ref), (e.ref = t === void 0 ? null : t));
    }
    function Ma(e, t) {
      throw t.$$typeof === g
        ? Error(i(525))
        : ((e = Object.prototype.toString.call(t)),
          Error(
            i(
              31,
              e === `[object Object]`
                ? `object with keys {` + Object.keys(t).join(`, `) + `}`
                : e,
            ),
          ));
    }
    function Na(e) {
      function t(t, n) {
        if (e) {
          var r = t.deletions;
          r === null ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
        }
      }
      function n(n, r) {
        if (!e) return null;
        for (; r !== null; ) (t(n, r), (r = r.sibling));
        return null;
      }
      function r(e) {
        for (var t = new Map(); e !== null; )
          (e.key === null ? t.set(e.index, e) : t.set(e.key, e),
            (e = e.sibling));
        return t;
      }
      function a(e, t) {
        return ((e = oi(e, t)), (e.index = 0), (e.sibling = null), e);
      }
      function o(t, n, r) {
        return (
          (t.index = r),
          e
            ? ((r = t.alternate),
              r === null
                ? ((t.flags |= 67108866), n)
                : ((r = r.index), r < n ? ((t.flags |= 67108866), n) : r))
            : ((t.flags |= 1048576), n)
        );
      }
      function s(t) {
        return (e && t.alternate === null && (t.flags |= 67108866), t);
      }
      function c(e, t, n, r) {
        return t === null || t.tag !== 6
          ? ((t = ui(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function l(e, t, n, r) {
        var i = n.type;
        return i === y
          ? d(e, t, n.props.children, r, n.key)
          : t !== null &&
              (t.elementType === i ||
                (typeof i == `object` &&
                  i &&
                  i.$$typeof === D &&
                  wa(i) === t.type))
            ? ((t = a(t, n.props)), ja(t, n), (t.return = e), t)
            : ((t = ci(n.type, n.key, n.props, null, e.mode, r)),
              ja(t, n),
              (t.return = e),
              t);
      }
      function u(e, t, n, r) {
        return t === null ||
          t.tag !== 4 ||
          t.stateNode.containerInfo !== n.containerInfo ||
          t.stateNode.implementation !== n.implementation
          ? ((t = fi(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n.children || [])), (t.return = e), t);
      }
      function d(e, t, n, r, i) {
        return t === null || t.tag !== 7
          ? ((t = li(n, e.mode, r, i)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function f(e, t, n) {
        if (
          (typeof t == `string` && t !== ``) ||
          typeof t == `number` ||
          typeof t == `bigint`
        )
          return ((t = ui(`` + t, e.mode, n)), (t.return = e), t);
        if (typeof t == `object` && t) {
          switch (t.$$typeof) {
            case _:
              return (
                (n = ci(t.type, t.key, t.props, null, e.mode, n)),
                ja(n, t),
                (n.return = e),
                n
              );
            case v:
              return ((t = fi(t, e.mode, n)), (t.return = e), t);
            case D:
              return ((t = wa(t)), f(e, t, n));
          }
          if (ae(t) || re(t))
            return ((t = li(t, e.mode, n, null)), (t.return = e), t);
          if (typeof t.then == `function`) return f(e, Aa(t), n);
          if (t.$$typeof === C) return f(e, Qi(e, t), n);
          Ma(e, t);
        }
        return null;
      }
      function p(e, t, n, r) {
        var i = t === null ? null : t.key;
        if (
          (typeof n == `string` && n !== ``) ||
          typeof n == `number` ||
          typeof n == `bigint`
        )
          return i === null ? c(e, t, `` + n, r) : null;
        if (typeof n == `object` && n) {
          switch (n.$$typeof) {
            case _:
              return n.key === i ? l(e, t, n, r) : null;
            case v:
              return n.key === i ? u(e, t, n, r) : null;
            case D:
              return ((n = wa(n)), p(e, t, n, r));
          }
          if (ae(n) || re(n)) return i === null ? d(e, t, n, r, null) : null;
          if (typeof n.then == `function`) return p(e, t, Aa(n), r);
          if (n.$$typeof === C) return p(e, t, Qi(e, n), r);
          Ma(e, n);
        }
        return null;
      }
      function m(e, t, n, r, i) {
        if (
          (typeof r == `string` && r !== ``) ||
          typeof r == `number` ||
          typeof r == `bigint`
        )
          return ((e = e.get(n) || null), c(t, e, `` + r, i));
        if (typeof r == `object` && r) {
          switch (r.$$typeof) {
            case _:
              return (
                (e = e.get(r.key === null ? n : r.key) || null),
                l(t, e, r, i)
              );
            case v:
              return (
                (e = e.get(r.key === null ? n : r.key) || null),
                u(t, e, r, i)
              );
            case D:
              return ((r = wa(r)), m(e, t, n, r, i));
          }
          if (ae(r) || re(r))
            return ((e = e.get(n) || null), d(t, e, r, i, null));
          if (typeof r.then == `function`) return m(e, t, n, Aa(r), i);
          if (r.$$typeof === C) return m(e, t, n, Qi(t, r), i);
          Ma(t, r);
        }
        return null;
      }
      function h(i, a, s, c) {
        for (
          var l = null, u = null, d = a, h = (a = 0), g = null;
          d !== null && h < s.length;
          h++
        ) {
          d.index > h ? ((g = d), (d = null)) : (g = d.sibling);
          var _ = p(i, d, s[h], c);
          if (_ === null) {
            d === null && (d = g);
            break;
          }
          (e && d && _.alternate === null && t(i, d),
            (a = o(_, a, h)),
            u === null ? (l = _) : (u.sibling = _),
            (u = _),
            (d = g));
        }
        if (h === s.length) return (n(i, d), U && wi(i, h), l);
        if (d === null) {
          for (; h < s.length; h++)
            ((d = f(i, s[h], c)),
              d !== null &&
                ((a = o(d, a, h)),
                u === null ? (l = d) : (u.sibling = d),
                (u = d)));
          return (U && wi(i, h), l);
        }
        for (d = r(d); h < s.length; h++)
          ((g = m(d, i, h, s[h], c)),
            g !== null &&
              (e &&
                g.alternate !== null &&
                d.delete(g.key === null ? h : g.key),
              (a = o(g, a, h)),
              u === null ? (l = g) : (u.sibling = g),
              (u = g)));
        return (
          e &&
            d.forEach(function (e) {
              return t(i, e);
            }),
          U && wi(i, h),
          l
        );
      }
      function g(a, s, c, l) {
        if (c == null) throw Error(i(151));
        for (
          var u = null, d = null, h = s, g = (s = 0), _ = null, v = c.next();
          h !== null && !v.done;
          g++, v = c.next()
        ) {
          h.index > g ? ((_ = h), (h = null)) : (_ = h.sibling);
          var y = p(a, h, v.value, l);
          if (y === null) {
            h === null && (h = _);
            break;
          }
          (e && h && y.alternate === null && t(a, h),
            (s = o(y, s, g)),
            d === null ? (u = y) : (d.sibling = y),
            (d = y),
            (h = _));
        }
        if (v.done) return (n(a, h), U && wi(a, g), u);
        if (h === null) {
          for (; !v.done; g++, v = c.next())
            ((v = f(a, v.value, l)),
              v !== null &&
                ((s = o(v, s, g)),
                d === null ? (u = v) : (d.sibling = v),
                (d = v)));
          return (U && wi(a, g), u);
        }
        for (h = r(h); !v.done; g++, v = c.next())
          ((v = m(h, a, g, v.value, l)),
            v !== null &&
              (e &&
                v.alternate !== null &&
                h.delete(v.key === null ? g : v.key),
              (s = o(v, s, g)),
              d === null ? (u = v) : (d.sibling = v),
              (d = v)));
        return (
          e &&
            h.forEach(function (e) {
              return t(a, e);
            }),
          U && wi(a, g),
          u
        );
      }
      function b(e, r, o, c) {
        if (
          (typeof o == `object` &&
            o &&
            o.type === y &&
            o.key === null &&
            (o = o.props.children),
          typeof o == `object` && o)
        ) {
          switch (o.$$typeof) {
            case _:
              a: {
                for (var l = o.key; r !== null; ) {
                  if (r.key === l) {
                    if (((l = o.type), l === y)) {
                      if (r.tag === 7) {
                        (n(e, r.sibling),
                          (c = a(r, o.props.children)),
                          (c.return = e),
                          (e = c));
                        break a;
                      }
                    } else if (
                      r.elementType === l ||
                      (typeof l == `object` &&
                        l &&
                        l.$$typeof === D &&
                        wa(l) === r.type)
                    ) {
                      (n(e, r.sibling),
                        (c = a(r, o.props)),
                        ja(c, o),
                        (c.return = e),
                        (e = c));
                      break a;
                    }
                    n(e, r);
                    break;
                  } else t(e, r);
                  r = r.sibling;
                }
                o.type === y
                  ? ((c = li(o.props.children, e.mode, c, o.key)),
                    (c.return = e),
                    (e = c))
                  : ((c = ci(o.type, o.key, o.props, null, e.mode, c)),
                    ja(c, o),
                    (c.return = e),
                    (e = c));
              }
              return s(e);
            case v:
              a: {
                for (l = o.key; r !== null; ) {
                  if (r.key === l)
                    if (
                      r.tag === 4 &&
                      r.stateNode.containerInfo === o.containerInfo &&
                      r.stateNode.implementation === o.implementation
                    ) {
                      (n(e, r.sibling),
                        (c = a(r, o.children || [])),
                        (c.return = e),
                        (e = c));
                      break a;
                    } else {
                      n(e, r);
                      break;
                    }
                  else t(e, r);
                  r = r.sibling;
                }
                ((c = fi(o, e.mode, c)), (c.return = e), (e = c));
              }
              return s(e);
            case D:
              return ((o = wa(o)), b(e, r, o, c));
          }
          if (ae(o)) return h(e, r, o, c);
          if (re(o)) {
            if (((l = re(o)), typeof l != `function`)) throw Error(i(150));
            return ((o = l.call(o)), g(e, r, o, c));
          }
          if (typeof o.then == `function`) return b(e, r, Aa(o), c);
          if (o.$$typeof === C) return b(e, r, Qi(e, o), c);
          Ma(e, o);
        }
        return (typeof o == `string` && o !== ``) ||
          typeof o == `number` ||
          typeof o == `bigint`
          ? ((o = `` + o),
            r !== null && r.tag === 6
              ? (n(e, r.sibling), (c = a(r, o)), (c.return = e), (e = c))
              : (n(e, r), (c = ui(o, e.mode, c)), (c.return = e), (e = c)),
            s(e))
          : n(e, r);
      }
      return function (e, t, n, r) {
        try {
          ka = 0;
          var i = b(e, t, n, r);
          return ((Oa = null), i);
        } catch (t) {
          if (t === va || t === ba) throw t;
          var a = ii(29, t, null, e.mode);
          return ((a.lanes = r), (a.return = e), a);
        }
      };
    }
    var Pa = Na(!0),
      Fa = Na(!1),
      Ia = !1;
    function La(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function Ra(e, t) {
      ((e = e.updateQueue),
        t.updateQueue === e &&
          (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            callbacks: null,
          }));
    }
    function za(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function Ba(e, t, n) {
      var r = e.updateQueue;
      if (r === null) return null;
      if (((r = r.shared), Il & 2)) {
        var i = r.pending;
        return (
          i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
          (r.pending = t),
          (t = ti(e)),
          ei(e, null, n),
          t
        );
      }
      return (Zr(e, r, t, n), ti(e));
    }
    function Va(e, t, n) {
      if (((t = t.updateQueue), t !== null && ((t = t.shared), n & 4194048))) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), nt(e, n));
      }
    }
    function Ha(e, t) {
      var n = e.updateQueue,
        r = e.alternate;
      if (r !== null && ((r = r.updateQueue), n === r)) {
        var i = null,
          a = null;
        if (((n = n.firstBaseUpdate), n !== null)) {
          do {
            var o = {
              lane: n.lane,
              tag: n.tag,
              payload: n.payload,
              callback: null,
              next: null,
            };
            (a === null ? (i = a = o) : (a = a.next = o), (n = n.next));
          } while (n !== null);
          a === null ? (i = a = t) : (a = a.next = t);
        } else i = a = t;
        ((n = {
          baseState: r.baseState,
          firstBaseUpdate: i,
          lastBaseUpdate: a,
          shared: r.shared,
          callbacks: r.callbacks,
        }),
          (e.updateQueue = n));
        return;
      }
      ((e = n.lastBaseUpdate),
        e === null ? (n.firstBaseUpdate = t) : (e.next = t),
        (n.lastBaseUpdate = t));
    }
    var Ua = !1;
    function Wa() {
      if (Ua) {
        var e = la;
        if (e !== null) throw e;
      }
    }
    function Ga(e, t, n, r) {
      Ua = !1;
      var i = e.updateQueue;
      Ia = !1;
      var a = i.firstBaseUpdate,
        o = i.lastBaseUpdate,
        s = i.shared.pending;
      if (s !== null) {
        i.shared.pending = null;
        var c = s,
          l = c.next;
        ((c.next = null), o === null ? (a = l) : (o.next = l), (o = c));
        var u = e.alternate;
        u !== null &&
          ((u = u.updateQueue),
          (s = u.lastBaseUpdate),
          s !== o &&
            (s === null ? (u.firstBaseUpdate = l) : (s.next = l),
            (u.lastBaseUpdate = c)));
      }
      if (a !== null) {
        var d = i.baseState;
        ((o = 0), (u = l = c = null), (s = a));
        do {
          var f = s.lane & -536870913,
            p = f !== s.lane;
          if (p ? (Z & f) === f : (r & f) === f) {
            (f !== 0 && f === ca && (Ua = !0),
              u !== null &&
                (u = u.next =
                  {
                    lane: 0,
                    tag: s.tag,
                    payload: s.payload,
                    callback: null,
                    next: null,
                  }));
            a: {
              var m = e,
                g = s;
              f = t;
              var _ = n;
              switch (g.tag) {
                case 1:
                  if (((m = g.payload), typeof m == `function`)) {
                    d = m.call(_, d, f);
                    break a;
                  }
                  d = m;
                  break a;
                case 3:
                  m.flags = (m.flags & -65537) | 128;
                case 0:
                  if (
                    ((m = g.payload),
                    (f = typeof m == `function` ? m.call(_, d, f) : m),
                    f == null)
                  )
                    break a;
                  d = h({}, d, f);
                  break a;
                case 2:
                  Ia = !0;
              }
            }
            ((f = s.callback),
              f !== null &&
                ((e.flags |= 64),
                p && (e.flags |= 8192),
                (p = i.callbacks),
                p === null ? (i.callbacks = [f]) : p.push(f)));
          } else
            ((p = {
              lane: f,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            }),
              u === null ? ((l = u = p), (c = d)) : (u = u.next = p),
              (o |= f));
          if (((s = s.next), s === null)) {
            if (((s = i.shared.pending), s === null)) break;
            ((p = s),
              (s = p.next),
              (p.next = null),
              (i.lastBaseUpdate = p),
              (i.shared.pending = null));
          }
        } while (1);
        (u === null && (c = d),
          (i.baseState = c),
          (i.firstBaseUpdate = l),
          (i.lastBaseUpdate = u),
          a === null && (i.shared.lanes = 0),
          (Ul |= o),
          (e.lanes = o),
          (e.memoizedState = d));
      }
    }
    function Ka(e, t) {
      if (typeof e != `function`) throw Error(i(191, e));
      e.call(t);
    }
    function qa(e, t) {
      var n = e.callbacks;
      if (n !== null)
        for (e.callbacks = null, e = 0; e < n.length; e++) Ka(n[e], t);
    }
    var Ja = le(null),
      Ya = le(0);
    function Xa(e, t) {
      ((e = Vl), N(Ya, e), N(Ja, t), (Vl = e | t.baseLanes));
    }
    function Za() {
      (N(Ya, Vl), N(Ja, Ja.current));
    }
    function Qa() {
      ((Vl = Ya.current), M(Ja), M(Ya));
    }
    var $a = le(null),
      eo = null;
    function to(e) {
      var t = e.alternate;
      (N(oo, oo.current & 1),
        N($a, e),
        eo === null &&
          (t === null || Ja.current !== null || t.memoizedState !== null) &&
          (eo = e));
    }
    function no(e) {
      (N(oo, oo.current), N($a, e), eo === null && (eo = e));
    }
    function ro(e) {
      e.tag === 22
        ? (N(oo, oo.current), N($a, e), eo === null && (eo = e))
        : io(e);
    }
    function io() {
      (N(oo, oo.current), N($a, $a.current));
    }
    function ao(e) {
      (M($a), eo === e && (eo = null), M(oo));
    }
    var oo = le(0);
    function so(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var n = t.memoizedState;
          if (n !== null && ((n = n.dehydrated), n === null || af(n) || of(n)))
            return t;
        } else if (
          t.tag === 19 &&
          (t.memoizedProps.revealOrder === `forwards` ||
            t.memoizedProps.revealOrder === `backwards` ||
            t.memoizedProps.revealOrder === `unstable_legacy-backwards` ||
            t.memoizedProps.revealOrder === `together`)
        ) {
          if (t.flags & 128) return t;
        } else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
      return null;
    }
    var co = 0,
      W = null,
      lo = null,
      uo = null,
      fo = !1,
      po = !1,
      mo = !1,
      ho = 0,
      go = 0,
      _o = null,
      vo = 0;
    function yo() {
      throw Error(i(321));
    }
    function bo(e, t) {
      if (t === null) return !1;
      for (var n = 0; n < t.length && n < e.length; n++)
        if (!vr(e[n], t[n])) return !1;
      return !0;
    }
    function xo(e, t, n, r, i, a) {
      return (
        (co = a),
        (W = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (A.H = e === null || e.memoizedState === null ? Fs : Is),
        (mo = !1),
        (a = n(r, i)),
        (mo = !1),
        po && (a = Co(t, n, r, i)),
        So(e),
        a
      );
    }
    function So(e) {
      A.H = Ps;
      var t = lo !== null && lo.next !== null;
      if (((co = 0), (uo = lo = W = null), (fo = !1), (go = 0), (_o = null), t))
        throw Error(i(300));
      e === null ||
        $s ||
        ((e = e.dependencies), e !== null && Yi(e) && ($s = !0));
    }
    function Co(e, t, n, r) {
      W = e;
      var a = 0;
      do {
        if ((po && (_o = null), (go = 0), (po = !1), 25 <= a))
          throw Error(i(301));
        if (((a += 1), (uo = lo = null), e.updateQueue != null)) {
          var o = e.updateQueue;
          ((o.lastEffect = null),
            (o.events = null),
            (o.stores = null),
            o.memoCache != null && (o.memoCache.index = 0));
        }
        ((A.H = Ls), (o = t(n, r)));
      } while (po);
      return o;
    }
    function wo() {
      var e = A.H,
        t = e.useState()[0];
      return (
        (t = typeof t.then == `function` ? jo(t) : t),
        (e = e.useState()[0]),
        (lo === null ? null : lo.memoizedState) !== e && (W.flags |= 1024),
        t
      );
    }
    function To() {
      var e = ho !== 0;
      return ((ho = 0), e);
    }
    function Eo(e, t, n) {
      ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
    }
    function Do(e) {
      if (fo) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          (t !== null && (t.pending = null), (e = e.next));
        }
        fo = !1;
      }
      ((co = 0), (uo = lo = W = null), (po = !1), (go = ho = 0), (_o = null));
    }
    function Oo() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
      };
      return (
        uo === null ? (W.memoizedState = uo = e) : (uo = uo.next = e),
        uo
      );
    }
    function ko() {
      if (lo === null) {
        var e = W.alternate;
        e = e === null ? null : e.memoizedState;
      } else e = lo.next;
      var t = uo === null ? W.memoizedState : uo.next;
      if (t !== null) ((uo = t), (lo = e));
      else {
        if (e === null)
          throw W.alternate === null ? Error(i(467)) : Error(i(310));
        ((lo = e),
          (e = {
            memoizedState: lo.memoizedState,
            baseState: lo.baseState,
            baseQueue: lo.baseQueue,
            queue: lo.queue,
            next: null,
          }),
          uo === null ? (W.memoizedState = uo = e) : (uo = uo.next = e));
      }
      return uo;
    }
    function Ao() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function jo(e) {
      var t = go;
      return (
        (go += 1),
        _o === null && (_o = []),
        (e = Ca(_o, e, t)),
        (t = W),
        (uo === null ? t.memoizedState : uo.next) === null &&
          ((t = t.alternate),
          (A.H = t === null || t.memoizedState === null ? Fs : Is)),
        e
      );
    }
    function Mo(e) {
      if (typeof e == `object` && e) {
        if (typeof e.then == `function`) return jo(e);
        if (e.$$typeof === C) return Zi(e);
      }
      throw Error(i(438, String(e)));
    }
    function No(e) {
      var t = null,
        n = W.updateQueue;
      if ((n !== null && (t = n.memoCache), t == null)) {
        var r = W.alternate;
        r !== null &&
          ((r = r.updateQueue),
          r !== null &&
            ((r = r.memoCache),
            r != null &&
              (t = {
                data: r.data.map(function (e) {
                  return e.slice();
                }),
                index: 0,
              })));
      }
      if (
        ((t ??= { data: [], index: 0 }),
        n === null && ((n = Ao()), (W.updateQueue = n)),
        (n.memoCache = t),
        (n = t.data[t.index]),
        n === void 0)
      )
        for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ne;
      return (t.index++, n);
    }
    function Po(e, t) {
      return typeof t == `function` ? t(e) : t;
    }
    function Fo(e) {
      return Io(ko(), lo, e);
    }
    function Io(e, t, n) {
      var r = e.queue;
      if (r === null) throw Error(i(311));
      r.lastRenderedReducer = n;
      var a = e.baseQueue,
        o = r.pending;
      if (o !== null) {
        if (a !== null) {
          var s = a.next;
          ((a.next = o.next), (o.next = s));
        }
        ((t.baseQueue = a = o), (r.pending = null));
      }
      if (((o = e.baseState), a === null)) e.memoizedState = o;
      else {
        t = a.next;
        var c = (s = null),
          l = null,
          u = t,
          d = !1;
        do {
          var f = u.lane & -536870913;
          if (f === u.lane ? (co & f) === f : (Z & f) === f) {
            var p = u.revertLane;
            if (p === 0)
              (l !== null &&
                (l = l.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: u.action,
                    hasEagerState: u.hasEagerState,
                    eagerState: u.eagerState,
                    next: null,
                  }),
                f === ca && (d = !0));
            else if ((co & p) === p) {
              ((u = u.next), p === ca && (d = !0));
              continue;
            } else
              ((f = {
                lane: 0,
                revertLane: u.revertLane,
                gesture: null,
                action: u.action,
                hasEagerState: u.hasEagerState,
                eagerState: u.eagerState,
                next: null,
              }),
                l === null ? ((c = l = f), (s = o)) : (l = l.next = f),
                (W.lanes |= p),
                (Ul |= p));
            ((f = u.action),
              mo && n(o, f),
              (o = u.hasEagerState ? u.eagerState : n(o, f)));
          } else
            ((p = {
              lane: f,
              revertLane: u.revertLane,
              gesture: u.gesture,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
              l === null ? ((c = l = p), (s = o)) : (l = l.next = p),
              (W.lanes |= f),
              (Ul |= f));
          u = u.next;
        } while (u !== null && u !== t);
        if (
          (l === null ? (s = o) : (l.next = c),
          !vr(o, e.memoizedState) && (($s = !0), d && ((n = la), n !== null)))
        )
          throw n;
        ((e.memoizedState = o),
          (e.baseState = s),
          (e.baseQueue = l),
          (r.lastRenderedState = o));
      }
      return (a === null && (r.lanes = 0), [e.memoizedState, r.dispatch]);
    }
    function Lo(e) {
      var t = ko(),
        n = t.queue;
      if (n === null) throw Error(i(311));
      n.lastRenderedReducer = e;
      var r = n.dispatch,
        a = n.pending,
        o = t.memoizedState;
      if (a !== null) {
        n.pending = null;
        var s = (a = a.next);
        do ((o = e(o, s.action)), (s = s.next));
        while (s !== a);
        (vr(o, t.memoizedState) || ($s = !0),
          (t.memoizedState = o),
          t.baseQueue === null && (t.baseState = o),
          (n.lastRenderedState = o));
      }
      return [o, r];
    }
    function Ro(e, t, n) {
      var r = W,
        a = ko(),
        o = U;
      if (o) {
        if (n === void 0) throw Error(i(407));
        n = n();
      } else n = t();
      var s = !vr((lo || a).memoizedState, n);
      if (
        (s && ((a.memoizedState = n), ($s = !0)),
        (a = a.queue),
        ss(Vo.bind(null, r, a, e), [e]),
        a.getSnapshot !== t || s || (uo !== null && uo.memoizedState.tag & 1))
      ) {
        if (
          ((r.flags |= 2048),
          ns(9, { destroy: void 0 }, Bo.bind(null, r, a, n, t), null),
          Y === null)
        )
          throw Error(i(349));
        o || co & 127 || zo(r, t, n);
      }
      return n;
    }
    function zo(e, t, n) {
      ((e.flags |= 16384),
        (e = { getSnapshot: t, value: n }),
        (t = W.updateQueue),
        t === null
          ? ((t = Ao()), (W.updateQueue = t), (t.stores = [e]))
          : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
    }
    function Bo(e, t, n, r) {
      ((t.value = n), (t.getSnapshot = r), Ho(t) && Uo(e));
    }
    function Vo(e, t, n) {
      return n(function () {
        Ho(t) && Uo(e);
      });
    }
    function Ho(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !vr(e, n);
      } catch {
        return !0;
      }
    }
    function Uo(e) {
      var t = $r(e, 2);
      t !== null && pu(t, e, 2);
    }
    function G(e) {
      var t = Oo();
      if (typeof e == `function`) {
        var n = e;
        if (((e = n()), mo)) {
          Be(!0);
          try {
            n();
          } finally {
            Be(!1);
          }
        }
      }
      return (
        (t.memoizedState = t.baseState = e),
        (t.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Po,
          lastRenderedState: e,
        }),
        t
      );
    }
    function Wo(e, t, n, r) {
      return ((e.baseState = n), Io(e, lo, typeof r == `function` ? r : Po));
    }
    function Go(e, t, n, r, a) {
      if (js(e)) throw Error(i(485));
      if (((e = t.action), e !== null)) {
        var o = {
          payload: a,
          action: e,
          next: null,
          isTransition: !0,
          status: `pending`,
          value: null,
          reason: null,
          listeners: [],
          then: function (e) {
            o.listeners.push(e);
          },
        };
        (A.T === null ? (o.isTransition = !1) : n(!0),
          r(o),
          (n = t.pending),
          n === null
            ? ((o.next = t.pending = o), Ko(t, o))
            : ((o.next = n.next), (t.pending = n.next = o)));
      }
    }
    function Ko(e, t) {
      var n = t.action,
        r = t.payload,
        i = e.state;
      if (t.isTransition) {
        var a = A.T,
          o = {};
        A.T = o;
        try {
          var s = n(i, r),
            c = A.S;
          (c !== null && c(o, s), qo(e, t, s));
        } catch (n) {
          Yo(e, t, n);
        } finally {
          (a !== null && o.types !== null && (a.types = o.types), (A.T = a));
        }
      } else
        try {
          ((a = n(i, r)), qo(e, t, a));
        } catch (n) {
          Yo(e, t, n);
        }
    }
    function qo(e, t, n) {
      typeof n == `object` && n && typeof n.then == `function`
        ? n.then(
            function (n) {
              Jo(e, t, n);
            },
            function (n) {
              return Yo(e, t, n);
            },
          )
        : Jo(e, t, n);
    }
    function Jo(e, t, n) {
      ((t.status = `fulfilled`),
        (t.value = n),
        Xo(t),
        (e.state = n),
        (t = e.pending),
        t !== null &&
          ((n = t.next),
          n === t
            ? (e.pending = null)
            : ((n = n.next), (t.next = n), Ko(e, n))));
    }
    function Yo(e, t, n) {
      var r = e.pending;
      if (((e.pending = null), r !== null)) {
        r = r.next;
        do ((t.status = `rejected`), (t.reason = n), Xo(t), (t = t.next));
        while (t !== r);
      }
      e.action = null;
    }
    function Xo(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function Zo(e, t) {
      return t;
    }
    function Qo(e, t) {
      if (U) {
        var n = Y.formState;
        if (n !== null) {
          a: {
            var r = W;
            if (U) {
              if (Ai) {
                b: {
                  for (var i = Ai, a = Mi; i.nodeType !== 8; ) {
                    if (!a) {
                      i = null;
                      break b;
                    }
                    if (((i = cf(i.nextSibling)), i === null)) {
                      i = null;
                      break b;
                    }
                  }
                  ((a = i.data), (i = a === `F!` || a === `F` ? i : null));
                }
                if (i) {
                  ((Ai = cf(i.nextSibling)), (r = i.data === `F!`));
                  break a;
                }
              }
              Pi(r);
            }
            r = !1;
          }
          r && (t = n[0]);
        }
      }
      return (
        (n = Oo()),
        (n.memoizedState = n.baseState = t),
        (r = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Zo,
          lastRenderedState: t,
        }),
        (n.queue = r),
        (n = Os.bind(null, W, r)),
        (r.dispatch = n),
        (r = G(!1)),
        (a = As.bind(null, W, !1, r.queue)),
        (r = Oo()),
        (i = { state: t, dispatch: null, action: e, pending: null }),
        (r.queue = i),
        (n = Go.bind(null, W, i, a, n)),
        (i.dispatch = n),
        (r.memoizedState = e),
        [t, n, !1]
      );
    }
    function $o(e) {
      return es(ko(), lo, e);
    }
    function es(e, t, n) {
      if (
        ((t = Io(e, t, Zo)[0]),
        (e = Fo(Po)[0]),
        typeof t == `object` && t && typeof t.then == `function`)
      )
        try {
          var r = jo(t);
        } catch (e) {
          throw e === va ? ba : e;
        }
      else r = t;
      t = ko();
      var i = t.queue,
        a = i.dispatch;
      return (
        n !== t.memoizedState &&
          ((W.flags |= 2048),
          ns(9, { destroy: void 0 }, K.bind(null, i, n), null)),
        [r, a, e]
      );
    }
    function K(e, t) {
      e.action = t;
    }
    function ts(e) {
      var t = ko(),
        n = lo;
      if (n !== null) return es(t, n, e);
      (ko(), (t = t.memoizedState), (n = ko()));
      var r = n.queue.dispatch;
      return ((n.memoizedState = e), [t, r, !1]);
    }
    function ns(e, t, n, r) {
      return (
        (e = { tag: e, create: n, deps: r, inst: t, next: null }),
        (t = W.updateQueue),
        t === null && ((t = Ao()), (W.updateQueue = t)),
        (n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
        e
      );
    }
    function rs() {
      return ko().memoizedState;
    }
    function is(e, t, n, r) {
      var i = Oo();
      ((W.flags |= e),
        (i.memoizedState = ns(
          1 | t,
          { destroy: void 0 },
          n,
          r === void 0 ? null : r,
        )));
    }
    function as(e, t, n, r) {
      var i = ko();
      r = r === void 0 ? null : r;
      var a = i.memoizedState.inst;
      lo !== null && r !== null && bo(r, lo.memoizedState.deps)
        ? (i.memoizedState = ns(t, a, n, r))
        : ((W.flags |= e), (i.memoizedState = ns(1 | t, a, n, r)));
    }
    function os(e, t) {
      is(8390656, 8, e, t);
    }
    function ss(e, t) {
      as(2048, 8, e, t);
    }
    function q(e) {
      W.flags |= 4;
      var t = W.updateQueue;
      if (t === null) ((t = Ao()), (W.updateQueue = t), (t.events = [e]));
      else {
        var n = t.events;
        n === null ? (t.events = [e]) : n.push(e);
      }
    }
    function cs(e) {
      var t = ko().memoizedState;
      return (
        q({ ref: t, nextImpl: e }),
        function () {
          if (Il & 2) throw Error(i(440));
          return t.impl.apply(void 0, arguments);
        }
      );
    }
    function ls(e, t) {
      return as(4, 2, e, t);
    }
    function us(e, t) {
      return as(4, 4, e, t);
    }
    function ds(e, t) {
      if (typeof t == `function`) {
        e = e();
        var n = t(e);
        return function () {
          typeof n == `function` ? n() : t(null);
        };
      }
      if (t != null)
        return (
          (e = e()),
          (t.current = e),
          function () {
            t.current = null;
          }
        );
    }
    function fs(e, t, n) {
      ((n = n == null ? null : n.concat([e])),
        as(4, 4, ds.bind(null, t, e), n));
    }
    function ps() {}
    function ms(e, t) {
      var n = ko();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      return t !== null && bo(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
    }
    function hs(e, t) {
      var n = ko();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      if (t !== null && bo(t, r[1])) return r[0];
      if (((r = e()), mo)) {
        Be(!0);
        try {
          e();
        } finally {
          Be(!1);
        }
      }
      return ((n.memoizedState = [r, t]), r);
    }
    function gs(e, t, n) {
      return n === void 0 || (co & 1073741824 && !(Z & 261930))
        ? (e.memoizedState = t)
        : ((e.memoizedState = n), (e = fu()), (W.lanes |= e), (Ul |= e), n);
    }
    function _s(e, t, n, r) {
      return vr(n, t)
        ? n
        : Ja.current === null
          ? !(co & 42) || (co & 1073741824 && !(Z & 261930))
            ? (($s = !0), (e.memoizedState = n))
            : ((e = fu()), (W.lanes |= e), (Ul |= e), t)
          : ((e = gs(e, n, r)), vr(e, t) || ($s = !0), e);
    }
    function vs(e, t, n, r, i) {
      var a = j.p;
      j.p = a !== 0 && 8 > a ? a : 8;
      var o = A.T,
        s = {};
      ((A.T = s), As(e, !1, t, n));
      try {
        var c = i(),
          l = A.S;
        (l !== null && l(s, c),
          typeof c == `object` && c && typeof c.then == `function`
            ? ks(e, t, fa(c, r), du(e))
            : ks(e, t, r, du(e)));
      } catch (n) {
        ks(e, t, { then: function () {}, status: `rejected`, reason: n }, du());
      } finally {
        ((j.p = a),
          o !== null && s.types !== null && (o.types = s.types),
          (A.T = o));
      }
    }
    function ys() {}
    function bs(e, t, n, r) {
      if (e.tag !== 5) throw Error(i(476));
      var a = xs(e).queue;
      vs(
        e,
        a,
        t,
        oe,
        n === null
          ? ys
          : function () {
              return (Ss(e), n(r));
            },
      );
    }
    function xs(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: oe,
        baseState: oe,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Po,
          lastRenderedState: oe,
        },
        next: null,
      };
      var n = {};
      return (
        (t.next = {
          memoizedState: n,
          baseState: n,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Po,
            lastRenderedState: n,
          },
          next: null,
        }),
        (e.memoizedState = t),
        (e = e.alternate),
        e !== null && (e.memoizedState = t),
        t
      );
    }
    function Ss(e) {
      var t = xs(e);
      (t.next === null && (t = e.alternate.memoizedState),
        ks(e, t.next.queue, {}, du()));
    }
    function Cs() {
      return Zi(Qf);
    }
    function ws() {
      return ko().memoizedState;
    }
    function Ts() {
      return ko().memoizedState;
    }
    function Es(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var n = du();
            e = za(n);
            var r = Ba(t, e, n);
            (r !== null && (pu(r, t, n), Va(r, t, n)),
              (t = { cache: ia() }),
              (e.payload = t));
            return;
        }
        t = t.return;
      }
    }
    function Ds(e, t, n) {
      var r = du();
      ((n = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        js(e)
          ? Ms(t, n)
          : ((n = Qr(e, t, n, r)), n !== null && (pu(n, e, r), Ns(n, t, r))));
    }
    function Os(e, t, n) {
      ks(e, t, n, du());
    }
    function ks(e, t, n, r) {
      var i = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (js(e)) Ms(t, i);
      else {
        var a = e.alternate;
        if (
          e.lanes === 0 &&
          (a === null || a.lanes === 0) &&
          ((a = t.lastRenderedReducer), a !== null)
        )
          try {
            var o = t.lastRenderedState,
              s = a(o, n);
            if (((i.hasEagerState = !0), (i.eagerState = s), vr(s, o)))
              return (Zr(e, t, i, 0), Y === null && Xr(), !1);
          } catch {}
        if (((n = Qr(e, t, i, r)), n !== null))
          return (pu(n, e, r), Ns(n, t, r), !0);
      }
      return !1;
    }
    function As(e, t, n, r) {
      if (
        ((r = {
          lane: 2,
          revertLane: ud(),
          gesture: null,
          action: r,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        js(e))
      ) {
        if (t) throw Error(i(479));
      } else ((t = Qr(e, n, r, 2)), t !== null && pu(t, e, 2));
    }
    function js(e) {
      var t = e.alternate;
      return e === W || (t !== null && t === W);
    }
    function Ms(e, t) {
      po = fo = !0;
      var n = e.pending;
      (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
        (e.pending = t));
    }
    function Ns(e, t, n) {
      if (n & 4194048) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), nt(e, n));
      }
    }
    var Ps = {
      readContext: Zi,
      use: Mo,
      useCallback: yo,
      useContext: yo,
      useEffect: yo,
      useImperativeHandle: yo,
      useLayoutEffect: yo,
      useInsertionEffect: yo,
      useMemo: yo,
      useReducer: yo,
      useRef: yo,
      useState: yo,
      useDebugValue: yo,
      useDeferredValue: yo,
      useTransition: yo,
      useSyncExternalStore: yo,
      useId: yo,
      useHostTransitionStatus: yo,
      useFormState: yo,
      useActionState: yo,
      useOptimistic: yo,
      useMemoCache: yo,
      useCacheRefresh: yo,
    };
    Ps.useEffectEvent = yo;
    var Fs = {
        readContext: Zi,
        use: Mo,
        useCallback: function (e, t) {
          return ((Oo().memoizedState = [e, t === void 0 ? null : t]), e);
        },
        useContext: Zi,
        useEffect: os,
        useImperativeHandle: function (e, t, n) {
          ((n = n == null ? null : n.concat([e])),
            is(4194308, 4, ds.bind(null, t, e), n));
        },
        useLayoutEffect: function (e, t) {
          return is(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          is(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var n = Oo();
          t = t === void 0 ? null : t;
          var r = e();
          if (mo) {
            Be(!0);
            try {
              e();
            } finally {
              Be(!1);
            }
          }
          return ((n.memoizedState = [r, t]), r);
        },
        useReducer: function (e, t, n) {
          var r = Oo();
          if (n !== void 0) {
            var i = n(t);
            if (mo) {
              Be(!0);
              try {
                n(t);
              } finally {
                Be(!1);
              }
            }
          } else i = t;
          return (
            (r.memoizedState = r.baseState = i),
            (e = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: e,
              lastRenderedState: i,
            }),
            (r.queue = e),
            (e = e.dispatch = Ds.bind(null, W, e)),
            [r.memoizedState, e]
          );
        },
        useRef: function (e) {
          var t = Oo();
          return ((e = { current: e }), (t.memoizedState = e));
        },
        useState: function (e) {
          e = G(e);
          var t = e.queue,
            n = Os.bind(null, W, t);
          return ((t.dispatch = n), [e.memoizedState, n]);
        },
        useDebugValue: ps,
        useDeferredValue: function (e, t) {
          return gs(Oo(), e, t);
        },
        useTransition: function () {
          var e = G(!1);
          return (
            (e = vs.bind(null, W, e.queue, !0, !1)),
            (Oo().memoizedState = e),
            [!1, e]
          );
        },
        useSyncExternalStore: function (e, t, n) {
          var r = W,
            a = Oo();
          if (U) {
            if (n === void 0) throw Error(i(407));
            n = n();
          } else {
            if (((n = t()), Y === null)) throw Error(i(349));
            Z & 127 || zo(r, t, n);
          }
          a.memoizedState = n;
          var o = { value: n, getSnapshot: t };
          return (
            (a.queue = o),
            os(Vo.bind(null, r, o, e), [e]),
            (r.flags |= 2048),
            ns(9, { destroy: void 0 }, Bo.bind(null, r, o, n, t), null),
            n
          );
        },
        useId: function () {
          var e = Oo(),
            t = Y.identifierPrefix;
          if (U) {
            var n = Ci,
              r = Si;
            ((n = (r & ~(1 << (32 - Ve(r) - 1))).toString(32) + n),
              (t = `_` + t + `R_` + n),
              (n = ho++),
              0 < n && (t += `H` + n.toString(32)),
              (t += `_`));
          } else ((n = vo++), (t = `_` + t + `r_` + n.toString(32) + `_`));
          return (e.memoizedState = t);
        },
        useHostTransitionStatus: Cs,
        useFormState: Qo,
        useActionState: Qo,
        useOptimistic: function (e) {
          var t = Oo();
          t.memoizedState = t.baseState = e;
          var n = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return (
            (t.queue = n),
            (t = As.bind(null, W, !0, n)),
            (n.dispatch = t),
            [e, t]
          );
        },
        useMemoCache: No,
        useCacheRefresh: function () {
          return (Oo().memoizedState = Es.bind(null, W));
        },
        useEffectEvent: function (e) {
          var t = Oo(),
            n = { impl: e };
          return (
            (t.memoizedState = n),
            function () {
              if (Il & 2) throw Error(i(440));
              return n.impl.apply(void 0, arguments);
            }
          );
        },
      },
      Is = {
        readContext: Zi,
        use: Mo,
        useCallback: ms,
        useContext: Zi,
        useEffect: ss,
        useImperativeHandle: fs,
        useInsertionEffect: ls,
        useLayoutEffect: us,
        useMemo: hs,
        useReducer: Fo,
        useRef: rs,
        useState: function () {
          return Fo(Po);
        },
        useDebugValue: ps,
        useDeferredValue: function (e, t) {
          return _s(ko(), lo.memoizedState, e, t);
        },
        useTransition: function () {
          var e = Fo(Po)[0],
            t = ko().memoizedState;
          return [typeof e == `boolean` ? e : jo(e), t];
        },
        useSyncExternalStore: Ro,
        useId: ws,
        useHostTransitionStatus: Cs,
        useFormState: $o,
        useActionState: $o,
        useOptimistic: function (e, t) {
          return Wo(ko(), lo, e, t);
        },
        useMemoCache: No,
        useCacheRefresh: Ts,
      };
    Is.useEffectEvent = cs;
    var Ls = {
      readContext: Zi,
      use: Mo,
      useCallback: ms,
      useContext: Zi,
      useEffect: ss,
      useImperativeHandle: fs,
      useInsertionEffect: ls,
      useLayoutEffect: us,
      useMemo: hs,
      useReducer: Lo,
      useRef: rs,
      useState: function () {
        return Lo(Po);
      },
      useDebugValue: ps,
      useDeferredValue: function (e, t) {
        var n = ko();
        return lo === null ? gs(n, e, t) : _s(n, lo.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Lo(Po)[0],
          t = ko().memoizedState;
        return [typeof e == `boolean` ? e : jo(e), t];
      },
      useSyncExternalStore: Ro,
      useId: ws,
      useHostTransitionStatus: Cs,
      useFormState: ts,
      useActionState: ts,
      useOptimistic: function (e, t) {
        var n = ko();
        return lo === null
          ? ((n.baseState = e), [e, n.queue.dispatch])
          : Wo(n, lo, e, t);
      },
      useMemoCache: No,
      useCacheRefresh: Ts,
    };
    Ls.useEffectEvent = cs;
    function Rs(e, t, n, r) {
      ((t = e.memoizedState),
        (n = n(r, t)),
        (n = n == null ? t : h({}, t, n)),
        (e.memoizedState = n),
        e.lanes === 0 && (e.updateQueue.baseState = n));
    }
    var zs = {
      enqueueSetState: function (e, t, n) {
        e = e._reactInternals;
        var r = du(),
          i = za(r);
        ((i.payload = t),
          n != null && (i.callback = n),
          (t = Ba(e, i, r)),
          t !== null && (pu(t, e, r), Va(t, e, r)));
      },
      enqueueReplaceState: function (e, t, n) {
        e = e._reactInternals;
        var r = du(),
          i = za(r);
        ((i.tag = 1),
          (i.payload = t),
          n != null && (i.callback = n),
          (t = Ba(e, i, r)),
          t !== null && (pu(t, e, r), Va(t, e, r)));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var n = du(),
          r = za(n);
        ((r.tag = 2),
          t != null && (r.callback = t),
          (t = Ba(e, r, n)),
          t !== null && (pu(t, e, n), Va(t, e, n)));
      },
    };
    function Bs(e, t, n, r, i, a, o) {
      return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == `function`
          ? e.shouldComponentUpdate(r, a, o)
          : t.prototype && t.prototype.isPureReactComponent
            ? !yr(n, r) || !yr(i, a)
            : !0
      );
    }
    function Vs(e, t, n, r) {
      ((e = t.state),
        typeof t.componentWillReceiveProps == `function` &&
          t.componentWillReceiveProps(n, r),
        typeof t.UNSAFE_componentWillReceiveProps == `function` &&
          t.UNSAFE_componentWillReceiveProps(n, r),
        t.state !== e && zs.enqueueReplaceState(t, t.state, null));
    }
    function Hs(e, t) {
      var n = t;
      if (`ref` in t) for (var r in ((n = {}), t)) r !== `ref` && (n[r] = t[r]);
      if ((e = e.defaultProps))
        for (var i in (n === t && (n = h({}, n)), e))
          n[i] === void 0 && (n[i] = e[i]);
      return n;
    }
    function Us(e) {
      Kr(e);
    }
    function Ws(e) {
      console.error(e);
    }
    function Gs(e) {
      Kr(e);
    }
    function Ks(e, t) {
      try {
        var n = e.onUncaughtError;
        n(t.value, { componentStack: t.stack });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function qs(e, t, n) {
      try {
        var r = e.onCaughtError;
        r(n.value, {
          componentStack: n.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null,
        });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function Js(e, t, n) {
      return (
        (n = za(n)),
        (n.tag = 3),
        (n.payload = { element: null }),
        (n.callback = function () {
          Ks(e, t);
        }),
        n
      );
    }
    function Ys(e) {
      return ((e = za(e)), (e.tag = 3), e);
    }
    function Xs(e, t, n, r) {
      var i = n.type.getDerivedStateFromError;
      if (typeof i == `function`) {
        var a = r.value;
        ((e.payload = function () {
          return i(a);
        }),
          (e.callback = function () {
            qs(t, n, r);
          }));
      }
      var o = n.stateNode;
      o !== null &&
        typeof o.componentDidCatch == `function` &&
        (e.callback = function () {
          (qs(t, n, r),
            typeof i != `function` &&
              (tu === null ? (tu = new Set([this])) : tu.add(this)));
          var e = r.stack;
          this.componentDidCatch(r.value, {
            componentStack: e === null ? `` : e,
          });
        });
    }
    function Zs(e, t, n, r, a) {
      if (
        ((n.flags |= 32768),
        typeof r == `object` && r && typeof r.then == `function`)
      ) {
        if (
          ((t = n.alternate),
          t !== null && Ji(t, n, a, !0),
          (n = $a.current),
          n !== null)
        ) {
          switch (n.tag) {
            case 31:
            case 13:
              return (
                eo === null
                  ? Tu()
                  : n.alternate === null && Hl === 0 && (Hl = 3),
                (n.flags &= -257),
                (n.flags |= 65536),
                (n.lanes = a),
                r === xa
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null ? (n.updateQueue = new Set([r])) : t.add(r),
                    Wu(e, r, a)),
                !1
              );
            case 22:
              return (
                (n.flags |= 65536),
                r === xa
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null
                      ? ((t = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([r]),
                        }),
                        (n.updateQueue = t))
                      : ((n = t.retryQueue),
                        n === null ? (t.retryQueue = new Set([r])) : n.add(r)),
                    Wu(e, r, a)),
                !1
              );
          }
          throw Error(i(435, n.tag));
        }
        return (Wu(e, r, a), Tu(), !1);
      }
      if (U)
        return (
          (t = $a.current),
          t === null
            ? (r !== Ni && ((t = Error(i(423), { cause: r })), Bi(mi(t, n))),
              (e = e.current.alternate),
              (e.flags |= 65536),
              (a &= -a),
              (e.lanes |= a),
              (r = mi(r, n)),
              (a = Js(e.stateNode, r, a)),
              Ha(e, a),
              Hl !== 4 && (Hl = 2))
            : (!(t.flags & 65536) && (t.flags |= 256),
              (t.flags |= 65536),
              (t.lanes = a),
              r !== Ni && ((e = Error(i(422), { cause: r })), Bi(mi(e, n)))),
          !1
        );
      var o = Error(i(520), { cause: r });
      if (
        ((o = mi(o, n)),
        Jl === null ? (Jl = [o]) : Jl.push(o),
        Hl !== 4 && (Hl = 2),
        t === null)
      )
        return !0;
      ((r = mi(r, n)), (n = t));
      do {
        switch (n.tag) {
          case 3:
            return (
              (n.flags |= 65536),
              (e = a & -a),
              (n.lanes |= e),
              (e = Js(n.stateNode, r, e)),
              Ha(n, e),
              !1
            );
          case 1:
            if (
              ((t = n.type),
              (o = n.stateNode),
              !(n.flags & 128) &&
                (typeof t.getDerivedStateFromError == `function` ||
                  (o !== null &&
                    typeof o.componentDidCatch == `function` &&
                    (tu === null || !tu.has(o)))))
            )
              return (
                (n.flags |= 65536),
                (a &= -a),
                (n.lanes |= a),
                (a = Ys(a)),
                Xs(a, e, n, r),
                Ha(n, a),
                !1
              );
        }
        n = n.return;
      } while (n !== null);
      return !1;
    }
    var Qs = Error(i(461)),
      $s = !1;
    function ec(e, t, n, r) {
      t.child = e === null ? Fa(t, null, n, r) : Pa(t, e.child, n, r);
    }
    function tc(e, t, n, r, i) {
      n = n.render;
      var a = t.ref;
      if (`ref` in r) {
        var o = {};
        for (var s in r) s !== `ref` && (o[s] = r[s]);
      } else o = r;
      return (
        Xi(t),
        (r = xo(e, t, n, o, a, i)),
        (s = To()),
        e !== null && !$s
          ? (Eo(e, t, i), Tc(e, t, i))
          : (U && s && Ei(t), (t.flags |= 1), ec(e, t, r, i), t.child)
      );
    }
    function nc(e, t, n, r, i) {
      if (e === null) {
        var a = n.type;
        return typeof a == `function` &&
          !ai(a) &&
          a.defaultProps === void 0 &&
          n.compare === null
          ? ((t.tag = 15), (t.type = a), rc(e, t, a, r, i))
          : ((e = ci(n.type, null, r, t, t.mode, i)),
            (e.ref = t.ref),
            (e.return = t),
            (t.child = e));
      }
      if (((a = e.child), !Ec(e, i))) {
        var o = a.memoizedProps;
        if (
          ((n = n.compare),
          (n = n === null ? yr : n),
          n(o, r) && e.ref === t.ref)
        )
          return Tc(e, t, i);
      }
      return (
        (t.flags |= 1),
        (e = oi(a, r)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e)
      );
    }
    function rc(e, t, n, r, i) {
      if (e !== null) {
        var a = e.memoizedProps;
        if (yr(a, r) && e.ref === t.ref)
          if ((($s = !1), (t.pendingProps = r = a), Ec(e, i)))
            e.flags & 131072 && ($s = !0);
          else return ((t.lanes = e.lanes), Tc(e, t, i));
      }
      return dc(e, t, n, r, i);
    }
    function ic(e, t, n, r) {
      var i = r.children,
        a = e === null ? null : e.memoizedState;
      if (
        (e === null &&
          t.stateNode === null &&
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        r.mode === `hidden`)
      ) {
        if (t.flags & 128) {
          if (((a = a === null ? n : a.baseLanes | n), e !== null)) {
            for (r = t.child = e.child, i = 0; r !== null; )
              ((i = i | r.lanes | r.childLanes), (r = r.sibling));
            r = i & ~a;
          } else ((r = 0), (t.child = null));
          return oc(e, t, a, n, r);
        }
        if (n & 536870912)
          ((t.memoizedState = { baseLanes: 0, cachePool: null }),
            e !== null && ga(t, a === null ? null : a.cachePool),
            a === null ? Za() : Xa(t, a),
            ro(t));
        else
          return (
            (r = t.lanes = 536870912),
            oc(e, t, a === null ? n : a.baseLanes | n, n, r)
          );
      } else
        a === null
          ? (e !== null && ga(t, null), Za(), io(t))
          : (ga(t, a.cachePool), Xa(t, a), io(t), (t.memoizedState = null));
      return (ec(e, t, i, n), t.child);
    }
    function ac(e, t) {
      return (
        (e !== null && e.tag === 22) ||
          t.stateNode !== null ||
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        t.sibling
      );
    }
    function oc(e, t, n, r, i) {
      var a = ha();
      return (
        (a = a === null ? null : { parent: ra._currentValue, pool: a }),
        (t.memoizedState = { baseLanes: n, cachePool: a }),
        e !== null && ga(t, null),
        Za(),
        ro(t),
        e !== null && Ji(e, t, r, !0),
        (t.childLanes = i),
        null
      );
    }
    function sc(e, t) {
      return (
        (t = bc({ mode: t.mode, children: t.children }, e.mode)),
        (t.ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function cc(e, t, n) {
      return (
        Pa(t, e.child, null, n),
        (e = sc(t, t.pendingProps)),
        (e.flags |= 2),
        ao(t),
        (t.memoizedState = null),
        e
      );
    }
    function lc(e, t, n) {
      var r = t.pendingProps,
        a = (t.flags & 128) != 0;
      if (((t.flags &= -129), e === null)) {
        if (U) {
          if (r.mode === `hidden`)
            return ((e = sc(t, r)), (t.lanes = 536870912), ac(null, e));
          if (
            (no(t),
            (e = Ai)
              ? ((e = rf(e, Mi)),
                (e = e !== null && e.data === `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: xi === null ? null : { id: Si, overflow: Ci },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = di(e)),
                  (n.return = t),
                  (t.child = n),
                  (ki = t),
                  (Ai = null)))
              : (e = null),
            e === null)
          )
            throw Pi(t);
          return ((t.lanes = 536870912), null);
        }
        return sc(t, r);
      }
      var o = e.memoizedState;
      if (o !== null) {
        var s = o.dehydrated;
        if ((no(t), a))
          if (t.flags & 256) ((t.flags &= -257), (t = cc(e, t, n)));
          else if (t.memoizedState !== null)
            ((t.child = e.child), (t.flags |= 128), (t = null));
          else throw Error(i(558));
        else if (
          ($s || Ji(e, t, n, !1), (a = (n & e.childLanes) !== 0), $s || a)
        ) {
          if (
            ((r = Y),
            r !== null && ((s = I(r, n)), s !== 0 && s !== o.retryLane))
          )
            throw ((o.retryLane = s), $r(e, s), pu(r, e, s), Qs);
          (Tu(), (t = cc(e, t, n)));
        } else
          ((e = o.treeContext),
            (Ai = cf(s.nextSibling)),
            (ki = t),
            (U = !0),
            (ji = null),
            (Mi = !1),
            e !== null && Oi(t, e),
            (t = sc(t, r)),
            (t.flags |= 4096));
        return t;
      }
      return (
        (e = oi(e.child, { mode: r.mode, children: r.children })),
        (e.ref = t.ref),
        (t.child = e),
        (e.return = t),
        e
      );
    }
    function uc(e, t) {
      var n = t.ref;
      if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof n != `function` && typeof n != `object`) throw Error(i(284));
        (e === null || e.ref !== n) && (t.flags |= 4194816);
      }
    }
    function dc(e, t, n, r, i) {
      return (
        Xi(t),
        (n = xo(e, t, n, r, void 0, i)),
        (r = To()),
        e !== null && !$s
          ? (Eo(e, t, i), Tc(e, t, i))
          : (U && r && Ei(t), (t.flags |= 1), ec(e, t, n, i), t.child)
      );
    }
    function fc(e, t, n, r, i, a) {
      return (
        Xi(t),
        (t.updateQueue = null),
        (n = Co(t, r, n, i)),
        So(e),
        (r = To()),
        e !== null && !$s
          ? (Eo(e, t, a), Tc(e, t, a))
          : (U && r && Ei(t), (t.flags |= 1), ec(e, t, n, a), t.child)
      );
    }
    function pc(e, t, n, r, i) {
      if ((Xi(t), t.stateNode === null)) {
        var a = ni,
          o = n.contextType;
        (typeof o == `object` && o && (a = Zi(o)),
          (a = new n(r, a)),
          (t.memoizedState =
            a.state !== null && a.state !== void 0 ? a.state : null),
          (a.updater = zs),
          (t.stateNode = a),
          (a._reactInternals = t),
          (a = t.stateNode),
          (a.props = r),
          (a.state = t.memoizedState),
          (a.refs = {}),
          La(t),
          (o = n.contextType),
          (a.context = typeof o == `object` && o ? Zi(o) : ni),
          (a.state = t.memoizedState),
          (o = n.getDerivedStateFromProps),
          typeof o == `function` &&
            (Rs(t, n, o, r), (a.state = t.memoizedState)),
          typeof n.getDerivedStateFromProps == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function` ||
            (typeof a.UNSAFE_componentWillMount != `function` &&
              typeof a.componentWillMount != `function`) ||
            ((o = a.state),
            typeof a.componentWillMount == `function` && a.componentWillMount(),
            typeof a.UNSAFE_componentWillMount == `function` &&
              a.UNSAFE_componentWillMount(),
            o !== a.state && zs.enqueueReplaceState(a, a.state, null),
            Ga(t, r, a, i),
            Wa(),
            (a.state = t.memoizedState)),
          typeof a.componentDidMount == `function` && (t.flags |= 4194308),
          (r = !0));
      } else if (e === null) {
        a = t.stateNode;
        var s = t.memoizedProps,
          c = Hs(n, s);
        a.props = c;
        var l = a.context,
          u = n.contextType;
        ((o = ni), typeof u == `object` && u && (o = Zi(u)));
        var d = n.getDerivedStateFromProps;
        ((u =
          typeof d == `function` ||
          typeof a.getSnapshotBeforeUpdate == `function`),
          (s = t.pendingProps !== s),
          u ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((s || l !== o) && Vs(t, a, r, o)),
          (Ia = !1));
        var f = t.memoizedState;
        ((a.state = f),
          Ga(t, r, a, i),
          Wa(),
          (l = t.memoizedState),
          s || f !== l || Ia
            ? (typeof d == `function` &&
                (Rs(t, n, d, r), (l = t.memoizedState)),
              (c = Ia || Bs(t, n, c, r, f, l, o))
                ? (u ||
                    (typeof a.UNSAFE_componentWillMount != `function` &&
                      typeof a.componentWillMount != `function`) ||
                    (typeof a.componentWillMount == `function` &&
                      a.componentWillMount(),
                    typeof a.UNSAFE_componentWillMount == `function` &&
                      a.UNSAFE_componentWillMount()),
                  typeof a.componentDidMount == `function` &&
                    (t.flags |= 4194308))
                : (typeof a.componentDidMount == `function` &&
                    (t.flags |= 4194308),
                  (t.memoizedProps = r),
                  (t.memoizedState = l)),
              (a.props = r),
              (a.state = l),
              (a.context = o),
              (r = c))
            : (typeof a.componentDidMount == `function` && (t.flags |= 4194308),
              (r = !1)));
      } else {
        ((a = t.stateNode),
          Ra(e, t),
          (o = t.memoizedProps),
          (u = Hs(n, o)),
          (a.props = u),
          (d = t.pendingProps),
          (f = a.context),
          (l = n.contextType),
          (c = ni),
          typeof l == `object` && l && (c = Zi(l)),
          (s = n.getDerivedStateFromProps),
          (l =
            typeof s == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function`) ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((o !== d || f !== c) && Vs(t, a, r, c)),
          (Ia = !1),
          (f = t.memoizedState),
          (a.state = f),
          Ga(t, r, a, i),
          Wa());
        var p = t.memoizedState;
        o !== d ||
        f !== p ||
        Ia ||
        (e !== null && e.dependencies !== null && Yi(e.dependencies))
          ? (typeof s == `function` && (Rs(t, n, s, r), (p = t.memoizedState)),
            (u =
              Ia ||
              Bs(t, n, u, r, f, p, c) ||
              (e !== null && e.dependencies !== null && Yi(e.dependencies)))
              ? (l ||
                  (typeof a.UNSAFE_componentWillUpdate != `function` &&
                    typeof a.componentWillUpdate != `function`) ||
                  (typeof a.componentWillUpdate == `function` &&
                    a.componentWillUpdate(r, p, c),
                  typeof a.UNSAFE_componentWillUpdate == `function` &&
                    a.UNSAFE_componentWillUpdate(r, p, c)),
                typeof a.componentDidUpdate == `function` && (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate == `function` &&
                  (t.flags |= 1024))
              : (typeof a.componentDidUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = r),
                (t.memoizedState = p)),
            (a.props = r),
            (a.state = p),
            (a.context = c),
            (r = u))
          : (typeof a.componentDidUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (r = !1));
      }
      return (
        (a = r),
        uc(e, t),
        (r = (t.flags & 128) != 0),
        a || r
          ? ((a = t.stateNode),
            (n =
              r && typeof n.getDerivedStateFromError != `function`
                ? null
                : a.render()),
            (t.flags |= 1),
            e !== null && r
              ? ((t.child = Pa(t, e.child, null, i)),
                (t.child = Pa(t, null, n, i)))
              : ec(e, t, n, i),
            (t.memoizedState = a.state),
            (e = t.child))
          : (e = Tc(e, t, i)),
        e
      );
    }
    function mc(e, t, n, r) {
      return (Ri(), (t.flags |= 256), ec(e, t, n, r), t.child);
    }
    var hc = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null,
    };
    function gc(e) {
      return { baseLanes: e, cachePool: _a() };
    }
    function _c(e, t, n) {
      return ((e = e === null ? 0 : e.childLanes & ~n), t && (e |= Kl), e);
    }
    function vc(e, t, n) {
      var r = t.pendingProps,
        a = !1,
        o = (t.flags & 128) != 0,
        s;
      if (
        ((s = o) ||
          (s =
            e !== null && e.memoizedState === null
              ? !1
              : (oo.current & 2) != 0),
        s && ((a = !0), (t.flags &= -129)),
        (s = (t.flags & 32) != 0),
        (t.flags &= -33),
        e === null)
      ) {
        if (U) {
          if (
            (a ? to(t) : io(t),
            (e = Ai)
              ? ((e = rf(e, Mi)),
                (e = e !== null && e.data !== `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: xi === null ? null : { id: Si, overflow: Ci },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = di(e)),
                  (n.return = t),
                  (t.child = n),
                  (ki = t),
                  (Ai = null)))
              : (e = null),
            e === null)
          )
            throw Pi(t);
          return (of(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
        }
        var c = r.children;
        return (
          (r = r.fallback),
          a
            ? (io(t),
              (a = t.mode),
              (c = bc({ mode: `hidden`, children: c }, a)),
              (r = li(r, a, n, null)),
              (c.return = t),
              (r.return = t),
              (c.sibling = r),
              (t.child = c),
              (r = t.child),
              (r.memoizedState = gc(n)),
              (r.childLanes = _c(e, s, n)),
              (t.memoizedState = hc),
              ac(null, r))
            : (to(t), yc(t, c))
        );
      }
      var l = e.memoizedState;
      if (l !== null && ((c = l.dehydrated), c !== null)) {
        if (o)
          t.flags & 256
            ? (to(t), (t.flags &= -257), (t = xc(e, t, n)))
            : t.memoizedState === null
              ? (io(t),
                (c = r.fallback),
                (a = t.mode),
                (r = bc({ mode: `visible`, children: r.children }, a)),
                (c = li(c, a, n, null)),
                (c.flags |= 2),
                (r.return = t),
                (c.return = t),
                (r.sibling = c),
                (t.child = r),
                Pa(t, e.child, null, n),
                (r = t.child),
                (r.memoizedState = gc(n)),
                (r.childLanes = _c(e, s, n)),
                (t.memoizedState = hc),
                (t = ac(null, r)))
              : (io(t), (t.child = e.child), (t.flags |= 128), (t = null));
        else if ((to(t), of(c))) {
          if (((s = c.nextSibling && c.nextSibling.dataset), s)) var u = s.dgst;
          ((s = u),
            (r = Error(i(419))),
            (r.stack = ``),
            (r.digest = s),
            Bi({ value: r, source: null, stack: null }),
            (t = xc(e, t, n)));
        } else if (
          ($s || Ji(e, t, n, !1), (s = (n & e.childLanes) !== 0), $s || s)
        ) {
          if (
            ((s = Y),
            s !== null && ((r = I(s, n)), r !== 0 && r !== l.retryLane))
          )
            throw ((l.retryLane = r), $r(e, r), pu(s, e, r), Qs);
          (af(c) || Tu(), (t = xc(e, t, n)));
        } else
          af(c)
            ? ((t.flags |= 192), (t.child = e.child), (t = null))
            : ((e = l.treeContext),
              (Ai = cf(c.nextSibling)),
              (ki = t),
              (U = !0),
              (ji = null),
              (Mi = !1),
              e !== null && Oi(t, e),
              (t = yc(t, r.children)),
              (t.flags |= 4096));
        return t;
      }
      return a
        ? (io(t),
          (c = r.fallback),
          (a = t.mode),
          (l = e.child),
          (u = l.sibling),
          (r = oi(l, { mode: `hidden`, children: r.children })),
          (r.subtreeFlags = l.subtreeFlags & 65011712),
          u === null
            ? ((c = li(c, a, n, null)), (c.flags |= 2))
            : (c = oi(u, c)),
          (c.return = t),
          (r.return = t),
          (r.sibling = c),
          (t.child = r),
          ac(null, r),
          (r = t.child),
          (c = e.child.memoizedState),
          c === null
            ? (c = gc(n))
            : ((a = c.cachePool),
              a === null
                ? (a = _a())
                : ((l = ra._currentValue),
                  (a = a.parent === l ? a : { parent: l, pool: l })),
              (c = { baseLanes: c.baseLanes | n, cachePool: a })),
          (r.memoizedState = c),
          (r.childLanes = _c(e, s, n)),
          (t.memoizedState = hc),
          ac(e.child, r))
        : (to(t),
          (n = e.child),
          (e = n.sibling),
          (n = oi(n, { mode: `visible`, children: r.children })),
          (n.return = t),
          (n.sibling = null),
          e !== null &&
            ((s = t.deletions),
            s === null ? ((t.deletions = [e]), (t.flags |= 16)) : s.push(e)),
          (t.child = n),
          (t.memoizedState = null),
          n);
    }
    function yc(e, t) {
      return (
        (t = bc({ mode: `visible`, children: t }, e.mode)),
        (t.return = e),
        (e.child = t)
      );
    }
    function bc(e, t) {
      return ((e = ii(22, e, null, t)), (e.lanes = 0), e);
    }
    function xc(e, t, n) {
      return (
        Pa(t, e.child, null, n),
        (e = yc(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function Sc(e, t, n) {
      e.lanes |= t;
      var r = e.alternate;
      (r !== null && (r.lanes |= t), Ki(e.return, t, n));
    }
    function Cc(e, t, n, r, i, a) {
      var o = e.memoizedState;
      o === null
        ? (e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: n,
            tailMode: i,
            treeForkCount: a,
          })
        : ((o.isBackwards = t),
          (o.rendering = null),
          (o.renderingStartTime = 0),
          (o.last = r),
          (o.tail = n),
          (o.tailMode = i),
          (o.treeForkCount = a));
    }
    function wc(e, t, n) {
      var r = t.pendingProps,
        i = r.revealOrder,
        a = r.tail;
      r = r.children;
      var o = oo.current,
        s = (o & 2) != 0;
      if (
        (s ? ((o = (o & 1) | 2), (t.flags |= 128)) : (o &= 1),
        N(oo, o),
        ec(e, t, r, n),
        (r = U ? vi : 0),
        !s && e !== null && e.flags & 128)
      )
        a: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && Sc(e, n, t);
          else if (e.tag === 19) Sc(e, n, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break a;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break a;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      switch (i) {
        case `forwards`:
          for (n = t.child, i = null; n !== null; )
            ((e = n.alternate),
              e !== null && so(e) === null && (i = n),
              (n = n.sibling));
          ((n = i),
            n === null
              ? ((i = t.child), (t.child = null))
              : ((i = n.sibling), (n.sibling = null)),
            Cc(t, !1, i, n, a, r));
          break;
        case `backwards`:
        case `unstable_legacy-backwards`:
          for (n = null, i = t.child, t.child = null; i !== null; ) {
            if (((e = i.alternate), e !== null && so(e) === null)) {
              t.child = i;
              break;
            }
            ((e = i.sibling), (i.sibling = n), (n = i), (i = e));
          }
          Cc(t, !0, n, null, a, r);
          break;
        case `together`:
          Cc(t, !1, null, null, void 0, r);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function Tc(e, t, n) {
      if (
        (e !== null && (t.dependencies = e.dependencies),
        (Ul |= t.lanes),
        (n & t.childLanes) === 0)
      )
        if (e !== null) {
          if ((Ji(e, t, n, !1), (n & t.childLanes) === 0)) return null;
        } else return null;
      if (e !== null && t.child !== e.child) throw Error(i(153));
      if (t.child !== null) {
        for (
          e = t.child, n = oi(e, e.pendingProps), t.child = n, n.return = t;
          e.sibling !== null;

        )
          ((e = e.sibling),
            (n = n.sibling = oi(e, e.pendingProps)),
            (n.return = t));
        n.sibling = null;
      }
      return t.child;
    }
    function Ec(e, t) {
      return (e.lanes & t) === 0
        ? ((e = e.dependencies), !!(e !== null && Yi(e)))
        : !0;
    }
    function Dc(e, t, n) {
      switch (t.tag) {
        case 3:
          (pe(t, t.stateNode.containerInfo),
            Wi(t, ra, e.memoizedState.cache),
            Ri());
          break;
        case 27:
        case 5:
          he(t);
          break;
        case 4:
          pe(t, t.stateNode.containerInfo);
          break;
        case 10:
          Wi(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return ((t.flags |= 128), no(t), null);
          break;
        case 13:
          var r = t.memoizedState;
          if (r !== null)
            return r.dehydrated === null
              ? (n & t.child.childLanes) === 0
                ? (to(t), (e = Tc(e, t, n)), e === null ? null : e.sibling)
                : vc(e, t, n)
              : (to(t), (t.flags |= 128), null);
          to(t);
          break;
        case 19:
          var i = (e.flags & 128) != 0;
          if (
            ((r = (n & t.childLanes) !== 0),
            (r ||= (Ji(e, t, n, !1), (n & t.childLanes) !== 0)),
            i)
          ) {
            if (r) return wc(e, t, n);
            t.flags |= 128;
          }
          if (
            ((i = t.memoizedState),
            i !== null &&
              ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
            N(oo, oo.current),
            r)
          )
            break;
          return null;
        case 22:
          return ((t.lanes = 0), ic(e, t, n, t.pendingProps));
        case 24:
          Wi(t, ra, e.memoizedState.cache);
      }
      return Tc(e, t, n);
    }
    function Oc(e, t, n) {
      if (e !== null)
        if (e.memoizedProps !== t.pendingProps) $s = !0;
        else {
          if (!Ec(e, n) && !(t.flags & 128)) return (($s = !1), Dc(e, t, n));
          $s = !!(e.flags & 131072);
        }
      else (($s = !1), U && t.flags & 1048576 && Ti(t, vi, t.index));
      switch (((t.lanes = 0), t.tag)) {
        case 16:
          a: {
            var r = t.pendingProps;
            if (((e = wa(t.elementType)), (t.type = e), typeof e == `function`))
              ai(e)
                ? ((r = Hs(e, r)), (t.tag = 1), (t = pc(null, t, e, r, n)))
                : ((t.tag = 0), (t = dc(null, t, e, r, n)));
            else {
              if (e != null) {
                var a = e.$$typeof;
                if (a === w) {
                  ((t.tag = 11), (t = tc(null, t, e, r, n)));
                  break a;
                } else if (a === E) {
                  ((t.tag = 14), (t = nc(null, t, e, r, n)));
                  break a;
                }
              }
              throw ((t = ie(e) || e), Error(i(306, t, ``)));
            }
          }
          return t;
        case 0:
          return dc(e, t, t.type, t.pendingProps, n);
        case 1:
          return ((r = t.type), (a = Hs(r, t.pendingProps)), pc(e, t, r, a, n));
        case 3:
          a: {
            if ((pe(t, t.stateNode.containerInfo), e === null))
              throw Error(i(387));
            r = t.pendingProps;
            var o = t.memoizedState;
            ((a = o.element), Ra(e, t), Ga(t, r, null, n));
            var s = t.memoizedState;
            if (
              ((r = s.cache),
              Wi(t, ra, r),
              r !== o.cache && qi(t, [ra], n, !0),
              Wa(),
              (r = s.element),
              o.isDehydrated)
            )
              if (
                ((o = { element: r, isDehydrated: !1, cache: s.cache }),
                (t.updateQueue.baseState = o),
                (t.memoizedState = o),
                t.flags & 256)
              ) {
                t = mc(e, t, r, n);
                break a;
              } else if (r !== a) {
                ((a = mi(Error(i(424)), t)), Bi(a), (t = mc(e, t, r, n)));
                break a;
              } else {
                switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                  case 9:
                    e = e.body;
                    break;
                  default:
                    e = e.nodeName === `HTML` ? e.ownerDocument.body : e;
                }
                for (
                  Ai = cf(e.firstChild),
                    ki = t,
                    U = !0,
                    ji = null,
                    Mi = !0,
                    n = Fa(t, null, r, n),
                    t.child = n;
                  n;

                )
                  ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
              }
            else {
              if ((Ri(), r === a)) {
                t = Tc(e, t, n);
                break a;
              }
              ec(e, t, r, n);
            }
            t = t.child;
          }
          return t;
        case 26:
          return (
            uc(e, t),
            e === null
              ? (n = kf(t.type, null, t.pendingProps, null))
                ? (t.memoizedState = n)
                : U ||
                  ((n = t.type),
                  (e = t.pendingProps),
                  (r = Bd(de.current).createElement(n)),
                  (r[R] = t),
                  (r[st] = e),
                  Pd(r, n, e),
                  _t(r),
                  (t.stateNode = r))
              : (t.memoizedState = kf(
                  t.type,
                  e.memoizedProps,
                  t.pendingProps,
                  e.memoizedState,
                )),
            null
          );
        case 27:
          return (
            he(t),
            e === null &&
              U &&
              ((r = t.stateNode = ff(t.type, t.pendingProps, de.current)),
              (ki = t),
              (Mi = !0),
              (a = Ai),
              Zd(t.type) ? ((lf = a), (Ai = cf(r.firstChild))) : (Ai = a)),
            ec(e, t, t.pendingProps.children, n),
            uc(e, t),
            e === null && (t.flags |= 4194304),
            t.child
          );
        case 5:
          return (
            e === null &&
              U &&
              ((a = r = Ai) &&
                ((r = tf(r, t.type, t.pendingProps, Mi)),
                r === null
                  ? (a = !1)
                  : ((t.stateNode = r),
                    (ki = t),
                    (Ai = cf(r.firstChild)),
                    (Mi = !1),
                    (a = !0))),
              a || Pi(t)),
            he(t),
            (a = t.type),
            (o = t.pendingProps),
            (s = e === null ? null : e.memoizedProps),
            (r = o.children),
            Ud(a, o) ? (r = null) : s !== null && Ud(a, s) && (t.flags |= 32),
            t.memoizedState !== null &&
              ((a = xo(e, t, wo, null, null, n)), (Qf._currentValue = a)),
            uc(e, t),
            ec(e, t, r, n),
            t.child
          );
        case 6:
          return (
            e === null &&
              U &&
              ((e = n = Ai) &&
                ((n = nf(n, t.pendingProps, Mi)),
                n === null
                  ? (e = !1)
                  : ((t.stateNode = n), (ki = t), (Ai = null), (e = !0))),
              e || Pi(t)),
            null
          );
        case 13:
          return vc(e, t, n);
        case 4:
          return (
            pe(t, t.stateNode.containerInfo),
            (r = t.pendingProps),
            e === null ? (t.child = Pa(t, null, r, n)) : ec(e, t, r, n),
            t.child
          );
        case 11:
          return tc(e, t, t.type, t.pendingProps, n);
        case 7:
          return (ec(e, t, t.pendingProps, n), t.child);
        case 8:
          return (ec(e, t, t.pendingProps.children, n), t.child);
        case 12:
          return (ec(e, t, t.pendingProps.children, n), t.child);
        case 10:
          return (
            (r = t.pendingProps),
            Wi(t, t.type, r.value),
            ec(e, t, r.children, n),
            t.child
          );
        case 9:
          return (
            (a = t.type._context),
            (r = t.pendingProps.children),
            Xi(t),
            (a = Zi(a)),
            (r = r(a)),
            (t.flags |= 1),
            ec(e, t, r, n),
            t.child
          );
        case 14:
          return nc(e, t, t.type, t.pendingProps, n);
        case 15:
          return rc(e, t, t.type, t.pendingProps, n);
        case 19:
          return wc(e, t, n);
        case 31:
          return lc(e, t, n);
        case 22:
          return ic(e, t, n, t.pendingProps);
        case 24:
          return (
            Xi(t),
            (r = Zi(ra)),
            e === null
              ? ((a = ha()),
                a === null &&
                  ((a = Y),
                  (o = ia()),
                  (a.pooledCache = o),
                  o.refCount++,
                  o !== null && (a.pooledCacheLanes |= n),
                  (a = o)),
                (t.memoizedState = { parent: r, cache: a }),
                La(t),
                Wi(t, ra, a))
              : ((e.lanes & n) !== 0 && (Ra(e, t), Ga(t, null, null, n), Wa()),
                (a = e.memoizedState),
                (o = t.memoizedState),
                a.parent === r
                  ? ((r = o.cache),
                    Wi(t, ra, r),
                    r !== a.cache && qi(t, [ra], n, !0))
                  : ((a = { parent: r, cache: r }),
                    (t.memoizedState = a),
                    t.lanes === 0 &&
                      (t.memoizedState = t.updateQueue.baseState = a),
                    Wi(t, ra, r))),
            ec(e, t, t.pendingProps.children, n),
            t.child
          );
        case 29:
          throw t.pendingProps;
      }
      throw Error(i(156, t.tag));
    }
    function kc(e) {
      e.flags |= 4;
    }
    function Ac(e, t, n, r, i) {
      if (((t = (e.mode & 32) != 0) && (t = !1), t)) {
        if (((e.flags |= 16777216), (i & 335544128) === i))
          if (e.stateNode.complete) e.flags |= 8192;
          else if (Su()) e.flags |= 8192;
          else throw ((Ta = xa), ya);
      } else e.flags &= -16777217;
    }
    function jc(e, t) {
      if (t.type !== `stylesheet` || t.state.loading & 4) e.flags &= -16777217;
      else if (((e.flags |= 16777216), !Wf(t)))
        if (Su()) e.flags |= 8192;
        else throw ((Ta = xa), ya);
    }
    function Mc(e, t) {
      (t !== null && (e.flags |= 4),
        e.flags & 16384 &&
          ((t = e.tag === 22 ? 536870912 : Qe()), (e.lanes |= t), (ql |= t)));
    }
    function Nc(e, t) {
      if (!U)
        switch (e.tailMode) {
          case `hidden`:
            t = e.tail;
            for (var n = null; t !== null; )
              (t.alternate !== null && (n = t), (t = t.sibling));
            n === null ? (e.tail = null) : (n.sibling = null);
            break;
          case `collapsed`:
            n = e.tail;
            for (var r = null; n !== null; )
              (n.alternate !== null && (r = n), (n = n.sibling));
            r === null
              ? t || e.tail === null
                ? (e.tail = null)
                : (e.tail.sibling = null)
              : (r.sibling = null);
        }
    }
    function Pc(e) {
      var t = e.alternate !== null && e.alternate.child === e.child,
        n = 0,
        r = 0;
      if (t)
        for (var i = e.child; i !== null; )
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags & 65011712),
            (r |= i.flags & 65011712),
            (i.return = e),
            (i = i.sibling));
      else
        for (i = e.child; i !== null; )
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags),
            (r |= i.flags),
            (i.return = e),
            (i = i.sibling));
      return ((e.subtreeFlags |= r), (e.childLanes = n), t);
    }
    function Fc(e, t, n) {
      var r = t.pendingProps;
      switch ((Di(t), t.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (Pc(t), null);
        case 1:
          return (Pc(t), null);
        case 3:
          return (
            (n = t.stateNode),
            (r = null),
            e !== null && (r = e.memoizedState.cache),
            t.memoizedState.cache !== r && (t.flags |= 2048),
            Gi(ra),
            me(),
            n.pendingContext &&
              ((n.context = n.pendingContext), (n.pendingContext = null)),
            (e === null || e.child === null) &&
              (Li(t)
                ? kc(t)
                : e === null ||
                  (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
                  ((t.flags |= 1024), zi())),
            Pc(t),
            null
          );
        case 26:
          var a = t.type,
            o = t.memoizedState;
          return (
            e === null
              ? (kc(t),
                o === null ? (Pc(t), Ac(t, a, null, r, n)) : (Pc(t), jc(t, o)))
              : o
                ? o === e.memoizedState
                  ? (Pc(t), (t.flags &= -16777217))
                  : (kc(t), Pc(t), jc(t, o))
                : ((e = e.memoizedProps),
                  e !== r && kc(t),
                  Pc(t),
                  Ac(t, a, e, r, n)),
            null
          );
        case 27:
          if (
            (ge(t),
            (n = de.current),
            (a = t.type),
            e !== null && t.stateNode != null)
          )
            e.memoizedProps !== r && kc(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(i(166));
              return (Pc(t), null);
            }
            ((e = ue.current),
              Li(t) ? Fi(t, e) : ((e = ff(a, r, n)), (t.stateNode = e), kc(t)));
          }
          return (Pc(t), null);
        case 5:
          if ((ge(t), (a = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== r && kc(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(i(166));
              return (Pc(t), null);
            }
            if (((o = ue.current), Li(t))) Fi(t, o);
            else {
              var s = Bd(de.current);
              switch (o) {
                case 1:
                  o = s.createElementNS(`http://www.w3.org/2000/svg`, a);
                  break;
                case 2:
                  o = s.createElementNS(
                    `http://www.w3.org/1998/Math/MathML`,
                    a,
                  );
                  break;
                default:
                  switch (a) {
                    case `svg`:
                      o = s.createElementNS(`http://www.w3.org/2000/svg`, a);
                      break;
                    case `math`:
                      o = s.createElementNS(
                        `http://www.w3.org/1998/Math/MathML`,
                        a,
                      );
                      break;
                    case `script`:
                      ((o = s.createElement(`div`)),
                        (o.innerHTML = `<script><\/script>`),
                        (o = o.removeChild(o.firstChild)));
                      break;
                    case `select`:
                      ((o =
                        typeof r.is == `string`
                          ? s.createElement(`select`, { is: r.is })
                          : s.createElement(`select`)),
                        r.multiple
                          ? (o.multiple = !0)
                          : r.size && (o.size = r.size));
                      break;
                    default:
                      o =
                        typeof r.is == `string`
                          ? s.createElement(a, { is: r.is })
                          : s.createElement(a);
                  }
              }
              ((o[R] = t), (o[st] = r));
              a: for (s = t.child; s !== null; ) {
                if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
                else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                  ((s.child.return = s), (s = s.child));
                  continue;
                }
                if (s === t) break a;
                for (; s.sibling === null; ) {
                  if (s.return === null || s.return === t) break a;
                  s = s.return;
                }
                ((s.sibling.return = s.return), (s = s.sibling));
              }
              t.stateNode = o;
              a: switch ((Pd(o, a, r), a)) {
                case `button`:
                case `input`:
                case `select`:
                case `textarea`:
                  r = !!r.autoFocus;
                  break a;
                case `img`:
                  r = !0;
                  break a;
                default:
                  r = !1;
              }
              r && kc(t);
            }
          }
          return (
            Pc(t),
            Ac(
              t,
              t.type,
              e === null ? null : e.memoizedProps,
              t.pendingProps,
              n,
            ),
            null
          );
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== r && kc(t);
          else {
            if (typeof r != `string` && t.stateNode === null)
              throw Error(i(166));
            if (((e = de.current), Li(t))) {
              if (
                ((e = t.stateNode),
                (n = t.memoizedProps),
                (r = null),
                (a = ki),
                a !== null)
              )
                switch (a.tag) {
                  case 27:
                  case 5:
                    r = a.memoizedProps;
                }
              ((e[R] = t),
                (e = !!(
                  e.nodeValue === n ||
                  (r !== null && !0 === r.suppressHydrationWarning) ||
                  jd(e.nodeValue, n)
                )),
                e || Pi(t, !0));
            } else
              ((e = Bd(e).createTextNode(r)), (e[R] = t), (t.stateNode = e));
          }
          return (Pc(t), null);
        case 31:
          if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
            if (((r = Li(t)), n !== null)) {
              if (e === null) {
                if (!r) throw Error(i(318));
                if (
                  ((e = t.memoizedState),
                  (e = e === null ? null : e.dehydrated),
                  !e)
                )
                  throw Error(i(557));
                e[R] = t;
              } else
                (Ri(),
                  !(t.flags & 128) && (t.memoizedState = null),
                  (t.flags |= 4));
              (Pc(t), (e = !1));
            } else
              ((n = zi()),
                e !== null &&
                  e.memoizedState !== null &&
                  (e.memoizedState.hydrationErrors = n),
                (e = !0));
            if (!e) return t.flags & 256 ? (ao(t), t) : (ao(t), null);
            if (t.flags & 128) throw Error(i(558));
          }
          return (Pc(t), null);
        case 13:
          if (
            ((r = t.memoizedState),
            e === null ||
              (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
          ) {
            if (((a = Li(t)), r !== null && r.dehydrated !== null)) {
              if (e === null) {
                if (!a) throw Error(i(318));
                if (
                  ((a = t.memoizedState),
                  (a = a === null ? null : a.dehydrated),
                  !a)
                )
                  throw Error(i(317));
                a[R] = t;
              } else
                (Ri(),
                  !(t.flags & 128) && (t.memoizedState = null),
                  (t.flags |= 4));
              (Pc(t), (a = !1));
            } else
              ((a = zi()),
                e !== null &&
                  e.memoizedState !== null &&
                  (e.memoizedState.hydrationErrors = a),
                (a = !0));
            if (!a) return t.flags & 256 ? (ao(t), t) : (ao(t), null);
          }
          return (
            ao(t),
            t.flags & 128
              ? ((t.lanes = n), t)
              : ((n = r !== null),
                (e = e !== null && e.memoizedState !== null),
                n &&
                  ((r = t.child),
                  (a = null),
                  r.alternate !== null &&
                    r.alternate.memoizedState !== null &&
                    r.alternate.memoizedState.cachePool !== null &&
                    (a = r.alternate.memoizedState.cachePool.pool),
                  (o = null),
                  r.memoizedState !== null &&
                    r.memoizedState.cachePool !== null &&
                    (o = r.memoizedState.cachePool.pool),
                  o !== a && (r.flags |= 2048)),
                n !== e && n && (t.child.flags |= 8192),
                Mc(t, t.updateQueue),
                Pc(t),
                null)
          );
        case 4:
          return (
            me(),
            e === null && xd(t.stateNode.containerInfo),
            Pc(t),
            null
          );
        case 10:
          return (Gi(t.type), Pc(t), null);
        case 19:
          if ((M(oo), (r = t.memoizedState), r === null)) return (Pc(t), null);
          if (((a = (t.flags & 128) != 0), (o = r.rendering), o === null))
            if (a) Nc(r, !1);
            else {
              if (Hl !== 0 || (e !== null && e.flags & 128))
                for (e = t.child; e !== null; ) {
                  if (((o = so(e)), o !== null)) {
                    for (
                      t.flags |= 128,
                        Nc(r, !1),
                        e = o.updateQueue,
                        t.updateQueue = e,
                        Mc(t, e),
                        t.subtreeFlags = 0,
                        e = n,
                        n = t.child;
                      n !== null;

                    )
                      (si(n, e), (n = n.sibling));
                    return (
                      N(oo, (oo.current & 1) | 2),
                      U && wi(t, r.treeForkCount),
                      t.child
                    );
                  }
                  e = e.sibling;
                }
              r.tail !== null &&
                ke() > $l &&
                ((t.flags |= 128), (a = !0), Nc(r, !1), (t.lanes = 4194304));
            }
          else {
            if (!a)
              if (((e = so(o)), e !== null)) {
                if (
                  ((t.flags |= 128),
                  (a = !0),
                  (e = e.updateQueue),
                  (t.updateQueue = e),
                  Mc(t, e),
                  Nc(r, !0),
                  r.tail === null &&
                    r.tailMode === `hidden` &&
                    !o.alternate &&
                    !U)
                )
                  return (Pc(t), null);
              } else
                2 * ke() - r.renderingStartTime > $l &&
                  n !== 536870912 &&
                  ((t.flags |= 128), (a = !0), Nc(r, !1), (t.lanes = 4194304));
            r.isBackwards
              ? ((o.sibling = t.child), (t.child = o))
              : ((e = r.last),
                e === null ? (t.child = o) : (e.sibling = o),
                (r.last = o));
          }
          return r.tail === null
            ? (Pc(t), null)
            : ((e = r.tail),
              (r.rendering = e),
              (r.tail = e.sibling),
              (r.renderingStartTime = ke()),
              (e.sibling = null),
              (n = oo.current),
              N(oo, a ? (n & 1) | 2 : n & 1),
              U && wi(t, r.treeForkCount),
              e);
        case 22:
        case 23:
          return (
            ao(t),
            Qa(),
            (r = t.memoizedState !== null),
            e === null
              ? r && (t.flags |= 8192)
              : (e.memoizedState !== null) !== r && (t.flags |= 8192),
            r
              ? n & 536870912 &&
                !(t.flags & 128) &&
                (Pc(t), t.subtreeFlags & 6 && (t.flags |= 8192))
              : Pc(t),
            (n = t.updateQueue),
            n !== null && Mc(t, n.retryQueue),
            (n = null),
            e !== null &&
              e.memoizedState !== null &&
              e.memoizedState.cachePool !== null &&
              (n = e.memoizedState.cachePool.pool),
            (r = null),
            t.memoizedState !== null &&
              t.memoizedState.cachePool !== null &&
              (r = t.memoizedState.cachePool.pool),
            r !== n && (t.flags |= 2048),
            e !== null && M(ma),
            null
          );
        case 24:
          return (
            (n = null),
            e !== null && (n = e.memoizedState.cache),
            t.memoizedState.cache !== n && (t.flags |= 2048),
            Gi(ra),
            Pc(t),
            null
          );
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(i(156, t.tag));
    }
    function Ic(e, t) {
      switch ((Di(t), t.tag)) {
        case 1:
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 3:
          return (
            Gi(ra),
            me(),
            (e = t.flags),
            e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 26:
        case 27:
        case 5:
          return (ge(t), null);
        case 31:
          if (t.memoizedState !== null) {
            if ((ao(t), t.alternate === null)) throw Error(i(340));
            Ri();
          }
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 13:
          if (
            (ao(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)
          ) {
            if (t.alternate === null) throw Error(i(340));
            Ri();
          }
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 19:
          return (M(oo), null);
        case 4:
          return (me(), null);
        case 10:
          return (Gi(t.type), null);
        case 22:
        case 23:
          return (
            ao(t),
            Qa(),
            e !== null && M(ma),
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 24:
          return (Gi(ra), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Lc(e, t) {
      switch ((Di(t), t.tag)) {
        case 3:
          (Gi(ra), me());
          break;
        case 26:
        case 27:
        case 5:
          ge(t);
          break;
        case 4:
          me();
          break;
        case 31:
          t.memoizedState !== null && ao(t);
          break;
        case 13:
          ao(t);
          break;
        case 19:
          M(oo);
          break;
        case 10:
          Gi(t.type);
          break;
        case 22:
        case 23:
          (ao(t), Qa(), e !== null && M(ma));
          break;
        case 24:
          Gi(ra);
      }
    }
    function Rc(e, t) {
      try {
        var n = t.updateQueue,
          r = n === null ? null : n.lastEffect;
        if (r !== null) {
          var i = r.next;
          n = i;
          do {
            if ((n.tag & e) === e) {
              r = void 0;
              var a = n.create,
                o = n.inst;
              ((r = a()), (o.destroy = r));
            }
            n = n.next;
          } while (n !== i);
        }
      } catch (e) {
        Uu(t, t.return, e);
      }
    }
    function zc(e, t, n) {
      try {
        var r = t.updateQueue,
          i = r === null ? null : r.lastEffect;
        if (i !== null) {
          var a = i.next;
          r = a;
          do {
            if ((r.tag & e) === e) {
              var o = r.inst,
                s = o.destroy;
              if (s !== void 0) {
                ((o.destroy = void 0), (i = t));
                var c = n,
                  l = s;
                try {
                  l();
                } catch (e) {
                  Uu(i, c, e);
                }
              }
            }
            r = r.next;
          } while (r !== a);
        }
      } catch (e) {
        Uu(t, t.return, e);
      }
    }
    function Bc(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var n = e.stateNode;
        try {
          qa(t, n);
        } catch (t) {
          Uu(e, e.return, t);
        }
      }
    }
    function Vc(e, t, n) {
      ((n.props = Hs(e.type, e.memoizedProps)), (n.state = e.memoizedState));
      try {
        n.componentWillUnmount();
      } catch (n) {
        Uu(e, t, n);
      }
    }
    function Hc(e, t) {
      try {
        var n = e.ref;
        if (n !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var r = e.stateNode;
              break;
            case 30:
              r = e.stateNode;
              break;
            default:
              r = e.stateNode;
          }
          typeof n == `function` ? (e.refCleanup = n(r)) : (n.current = r);
        }
      } catch (n) {
        Uu(e, t, n);
      }
    }
    function Uc(e, t) {
      var n = e.ref,
        r = e.refCleanup;
      if (n !== null)
        if (typeof r == `function`)
          try {
            r();
          } catch (n) {
            Uu(e, t, n);
          } finally {
            ((e.refCleanup = null),
              (e = e.alternate),
              e != null && (e.refCleanup = null));
          }
        else if (typeof n == `function`)
          try {
            n(null);
          } catch (n) {
            Uu(e, t, n);
          }
        else n.current = null;
    }
    function Wc(e) {
      var t = e.type,
        n = e.memoizedProps,
        r = e.stateNode;
      try {
        a: switch (t) {
          case `button`:
          case `input`:
          case `select`:
          case `textarea`:
            n.autoFocus && r.focus();
            break a;
          case `img`:
            n.src ? (r.src = n.src) : n.srcSet && (r.srcset = n.srcSet);
        }
      } catch (t) {
        Uu(e, e.return, t);
      }
    }
    function Gc(e, t, n) {
      try {
        var r = e.stateNode;
        (Fd(r, e.type, n, t), (r[st] = t));
      } catch (t) {
        Uu(e, e.return, t);
      }
    }
    function Kc(e) {
      return (
        e.tag === 5 ||
        e.tag === 3 ||
        e.tag === 26 ||
        (e.tag === 27 && Zd(e.type)) ||
        e.tag === 4
      );
    }
    function qc(e) {
      a: for (;;) {
        for (; e.sibling === null; ) {
          if (e.return === null || Kc(e.return)) return null;
          e = e.return;
        }
        for (
          e.sibling.return = e.return, e = e.sibling;
          e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

        ) {
          if (
            (e.tag === 27 && Zd(e.type)) ||
            e.flags & 2 ||
            e.child === null ||
            e.tag === 4
          )
            continue a;
          ((e.child.return = e), (e = e.child));
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Jc(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6)
        ((e = e.stateNode),
          t
            ? (n.nodeType === 9
                ? n.body
                : n.nodeName === `HTML`
                  ? n.ownerDocument.body
                  : n
              ).insertBefore(e, t)
            : ((t =
                n.nodeType === 9
                  ? n.body
                  : n.nodeName === `HTML`
                    ? n.ownerDocument.body
                    : n),
              t.appendChild(e),
              (n = n._reactRootContainer),
              n != null || t.onclick !== null || (t.onclick = H)));
      else if (
        r !== 4 &&
        (r === 27 && Zd(e.type) && ((n = e.stateNode), (t = null)),
        (e = e.child),
        e !== null)
      )
        for (Jc(e, t, n), e = e.sibling; e !== null; )
          (Jc(e, t, n), (e = e.sibling));
    }
    function Yc(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6)
        ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
      else if (
        r !== 4 &&
        (r === 27 && Zd(e.type) && (n = e.stateNode), (e = e.child), e !== null)
      )
        for (Yc(e, t, n), e = e.sibling; e !== null; )
          (Yc(e, t, n), (e = e.sibling));
    }
    function Xc(e) {
      var t = e.stateNode,
        n = e.memoizedProps;
      try {
        for (var r = e.type, i = t.attributes; i.length; )
          t.removeAttributeNode(i[0]);
        (Pd(t, r, n), (t[R] = e), (t[st] = n));
      } catch (t) {
        Uu(e, e.return, t);
      }
    }
    var Zc = !1,
      Qc = !1,
      $c = !1,
      el = typeof WeakSet == `function` ? WeakSet : Set,
      tl = null;
    function nl(e, t) {
      if (((e = e.containerInfo), (Rd = sp), (e = Cr(e)), wr(e))) {
        if (`selectionStart` in e)
          var n = { start: e.selectionStart, end: e.selectionEnd };
        else
          a: {
            n = ((n = e.ownerDocument) && n.defaultView) || window;
            var r = n.getSelection && n.getSelection();
            if (r && r.rangeCount !== 0) {
              n = r.anchorNode;
              var a = r.anchorOffset,
                o = r.focusNode;
              r = r.focusOffset;
              try {
                (n.nodeType, o.nodeType);
              } catch {
                n = null;
                break a;
              }
              var s = 0,
                c = -1,
                l = -1,
                u = 0,
                d = 0,
                f = e,
                p = null;
              b: for (;;) {
                for (
                  var m;
                  f !== n || (a !== 0 && f.nodeType !== 3) || (c = s + a),
                    f !== o || (r !== 0 && f.nodeType !== 3) || (l = s + r),
                    f.nodeType === 3 && (s += f.nodeValue.length),
                    (m = f.firstChild) !== null;

                )
                  ((p = f), (f = m));
                for (;;) {
                  if (f === e) break b;
                  if (
                    (p === n && ++u === a && (c = s),
                    p === o && ++d === r && (l = s),
                    (m = f.nextSibling) !== null)
                  )
                    break;
                  ((f = p), (p = f.parentNode));
                }
                f = m;
              }
              n = c === -1 || l === -1 ? null : { start: c, end: l };
            } else n = null;
          }
        n ||= { start: 0, end: 0 };
      } else n = null;
      for (
        zd = { focusedElem: e, selectionRange: n }, sp = !1, tl = t;
        tl !== null;

      )
        if (((t = tl), (e = t.child), t.subtreeFlags & 1028 && e !== null))
          ((e.return = t), (tl = e));
        else
          for (; tl !== null; ) {
            switch (((t = tl), (o = t.alternate), (e = t.flags), t.tag)) {
              case 0:
                if (
                  e & 4 &&
                  ((e = t.updateQueue),
                  (e = e === null ? null : e.events),
                  e !== null)
                )
                  for (n = 0; n < e.length; n++)
                    ((a = e[n]), (a.ref.impl = a.nextImpl));
                break;
              case 11:
              case 15:
                break;
              case 1:
                if (e & 1024 && o !== null) {
                  ((e = void 0),
                    (n = t),
                    (a = o.memoizedProps),
                    (o = o.memoizedState),
                    (r = n.stateNode));
                  try {
                    var h = Hs(n.type, a);
                    ((e = r.getSnapshotBeforeUpdate(h, o)),
                      (r.__reactInternalSnapshotBeforeUpdate = e));
                  } catch (e) {
                    Uu(n, n.return, e);
                  }
                }
                break;
              case 3:
                if (e & 1024) {
                  if (
                    ((e = t.stateNode.containerInfo), (n = e.nodeType), n === 9)
                  )
                    ef(e);
                  else if (n === 1)
                    switch (e.nodeName) {
                      case `HEAD`:
                      case `HTML`:
                      case `BODY`:
                        ef(e);
                        break;
                      default:
                        e.textContent = ``;
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if (e & 1024) throw Error(i(163));
            }
            if (((e = t.sibling), e !== null)) {
              ((e.return = t.return), (tl = e));
              break;
            }
            tl = t.return;
          }
    }
    function rl(e, t, n) {
      var r = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (vl(e, n), r & 4 && Rc(5, n));
          break;
        case 1:
          if ((vl(e, n), r & 4))
            if (((e = n.stateNode), t === null))
              try {
                e.componentDidMount();
              } catch (e) {
                Uu(n, n.return, e);
              }
            else {
              var i = Hs(n.type, t.memoizedProps);
              t = t.memoizedState;
              try {
                e.componentDidUpdate(
                  i,
                  t,
                  e.__reactInternalSnapshotBeforeUpdate,
                );
              } catch (e) {
                Uu(n, n.return, e);
              }
            }
          (r & 64 && Bc(n), r & 512 && Hc(n, n.return));
          break;
        case 3:
          if ((vl(e, n), r & 64 && ((e = n.updateQueue), e !== null))) {
            if (((t = null), n.child !== null))
              switch (n.child.tag) {
                case 27:
                case 5:
                  t = n.child.stateNode;
                  break;
                case 1:
                  t = n.child.stateNode;
              }
            try {
              qa(e, t);
            } catch (e) {
              Uu(n, n.return, e);
            }
          }
          break;
        case 27:
          t === null && r & 4 && Xc(n);
        case 26:
        case 5:
          (vl(e, n), t === null && r & 4 && Wc(n), r & 512 && Hc(n, n.return));
          break;
        case 12:
          vl(e, n);
          break;
        case 31:
          (vl(e, n), r & 4 && ll(e, n));
          break;
        case 13:
          (vl(e, n),
            r & 4 && ul(e, n),
            r & 64 &&
              ((e = n.memoizedState),
              e !== null &&
                ((e = e.dehydrated),
                e !== null && ((n = qu.bind(null, n)), sf(e, n)))));
          break;
        case 22:
          if (((r = n.memoizedState !== null || Zc), !r)) {
            ((t = (t !== null && t.memoizedState !== null) || Qc), (i = Zc));
            var a = Qc;
            ((Zc = r),
              (Qc = t) && !a
                ? bl(e, n, (n.subtreeFlags & 8772) != 0)
                : vl(e, n),
              (Zc = i),
              (Qc = a));
          }
          break;
        case 30:
          break;
        default:
          vl(e, n);
      }
    }
    function il(e) {
      var t = e.alternate;
      (t !== null && ((e.alternate = null), il(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 && ((t = e.stateNode), t !== null && B(t)),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null));
    }
    var al = null,
      ol = !1;
    function sl(e, t, n) {
      for (n = n.child; n !== null; ) (cl(e, t, n), (n = n.sibling));
    }
    function cl(e, t, n) {
      if (ze && typeof ze.onCommitFiberUnmount == `function`)
        try {
          ze.onCommitFiberUnmount(Re, n);
        } catch {}
      switch (n.tag) {
        case 26:
          (Qc || Uc(n, t),
            sl(e, t, n),
            n.memoizedState
              ? n.memoizedState.count--
              : n.stateNode &&
                ((n = n.stateNode), n.parentNode.removeChild(n)));
          break;
        case 27:
          Qc || Uc(n, t);
          var r = al,
            i = ol;
          (Zd(n.type) && ((al = n.stateNode), (ol = !1)),
            sl(e, t, n),
            pf(n.stateNode),
            (al = r),
            (ol = i));
          break;
        case 5:
          Qc || Uc(n, t);
        case 6:
          if (
            ((r = al),
            (i = ol),
            (al = null),
            sl(e, t, n),
            (al = r),
            (ol = i),
            al !== null)
          )
            if (ol)
              try {
                (al.nodeType === 9
                  ? al.body
                  : al.nodeName === `HTML`
                    ? al.ownerDocument.body
                    : al
                ).removeChild(n.stateNode);
              } catch (e) {
                Uu(n, t, e);
              }
            else
              try {
                al.removeChild(n.stateNode);
              } catch (e) {
                Uu(n, t, e);
              }
          break;
        case 18:
          al !== null &&
            (ol
              ? ((e = al),
                Qd(
                  e.nodeType === 9
                    ? e.body
                    : e.nodeName === `HTML`
                      ? e.ownerDocument.body
                      : e,
                  n.stateNode,
                ),
                Np(e))
              : Qd(al, n.stateNode));
          break;
        case 4:
          ((r = al),
            (i = ol),
            (al = n.stateNode.containerInfo),
            (ol = !0),
            sl(e, t, n),
            (al = r),
            (ol = i));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (zc(2, n, t), Qc || zc(4, n, t), sl(e, t, n));
          break;
        case 1:
          (Qc ||
            (Uc(n, t),
            (r = n.stateNode),
            typeof r.componentWillUnmount == `function` && Vc(n, t, r)),
            sl(e, t, n));
          break;
        case 21:
          sl(e, t, n);
          break;
        case 22:
          ((Qc = (r = Qc) || n.memoizedState !== null), sl(e, t, n), (Qc = r));
          break;
        default:
          sl(e, t, n);
      }
    }
    function ll(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
      ) {
        e = e.dehydrated;
        try {
          Np(e);
        } catch (e) {
          Uu(t, t.return, e);
        }
      }
    }
    function ul(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate),
        e !== null &&
          ((e = e.memoizedState),
          e !== null && ((e = e.dehydrated), e !== null)))
      )
        try {
          Np(e);
        } catch (e) {
          Uu(t, t.return, e);
        }
    }
    function dl(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return (t === null && (t = e.stateNode = new el()), t);
        case 22:
          return (
            (e = e.stateNode),
            (t = e._retryCache),
            t === null && (t = e._retryCache = new el()),
            t
          );
        default:
          throw Error(i(435, e.tag));
      }
    }
    function fl(e, t) {
      var n = dl(e);
      t.forEach(function (t) {
        if (!n.has(t)) {
          n.add(t);
          var r = Ju.bind(null, e, t);
          t.then(r, r);
        }
      });
    }
    function pl(e, t) {
      var n = t.deletions;
      if (n !== null)
        for (var r = 0; r < n.length; r++) {
          var a = n[r],
            o = e,
            s = t,
            c = s;
          a: for (; c !== null; ) {
            switch (c.tag) {
              case 27:
                if (Zd(c.type)) {
                  ((al = c.stateNode), (ol = !1));
                  break a;
                }
                break;
              case 5:
                ((al = c.stateNode), (ol = !1));
                break a;
              case 3:
              case 4:
                ((al = c.stateNode.containerInfo), (ol = !0));
                break a;
            }
            c = c.return;
          }
          if (al === null) throw Error(i(160));
          (cl(o, s, a),
            (al = null),
            (ol = !1),
            (o = a.alternate),
            o !== null && (o.return = null),
            (a.return = null));
        }
      if (t.subtreeFlags & 13886)
        for (t = t.child; t !== null; ) (hl(t, e), (t = t.sibling));
    }
    var ml = null;
    function hl(e, t) {
      var n = e.alternate,
        r = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (pl(t, e),
            gl(e),
            r & 4 && (zc(3, e, e.return), Rc(3, e), zc(5, e, e.return)));
          break;
        case 1:
          (pl(t, e),
            gl(e),
            r & 512 && (Qc || n === null || Uc(n, n.return)),
            r & 64 &&
              Zc &&
              ((e = e.updateQueue),
              e !== null &&
                ((r = e.callbacks),
                r !== null &&
                  ((n = e.shared.hiddenCallbacks),
                  (e.shared.hiddenCallbacks = n === null ? r : n.concat(r))))));
          break;
        case 26:
          var a = ml;
          if (
            (pl(t, e),
            gl(e),
            r & 512 && (Qc || n === null || Uc(n, n.return)),
            r & 4)
          ) {
            var o = n === null ? null : n.memoizedState;
            if (((r = e.memoizedState), n === null))
              if (r === null)
                if (e.stateNode === null) {
                  a: {
                    ((r = e.type),
                      (n = e.memoizedProps),
                      (a = a.ownerDocument || a));
                    b: switch (r) {
                      case `title`:
                        ((o = a.getElementsByTagName(`title`)[0]),
                          (!o ||
                            o[ft] ||
                            o[R] ||
                            o.namespaceURI === `http://www.w3.org/2000/svg` ||
                            o.hasAttribute(`itemprop`)) &&
                            ((o = a.createElement(r)),
                            a.head.insertBefore(
                              o,
                              a.querySelector(`head > title`),
                            )),
                          Pd(o, r, n),
                          (o[R] = e),
                          _t(o),
                          (r = o));
                        break a;
                      case `link`:
                        var s = Vf(`link`, `href`, a).get(r + (n.href || ``));
                        if (s) {
                          for (var c = 0; c < s.length; c++)
                            if (
                              ((o = s[c]),
                              o.getAttribute(`href`) ===
                                (n.href == null || n.href === ``
                                  ? null
                                  : n.href) &&
                                o.getAttribute(`rel`) ===
                                  (n.rel == null ? null : n.rel) &&
                                o.getAttribute(`title`) ===
                                  (n.title == null ? null : n.title) &&
                                o.getAttribute(`crossorigin`) ===
                                  (n.crossOrigin == null
                                    ? null
                                    : n.crossOrigin))
                            ) {
                              s.splice(c, 1);
                              break b;
                            }
                        }
                        ((o = a.createElement(r)),
                          Pd(o, r, n),
                          a.head.appendChild(o));
                        break;
                      case `meta`:
                        if (
                          (s = Vf(`meta`, `content`, a).get(
                            r + (n.content || ``),
                          ))
                        ) {
                          for (c = 0; c < s.length; c++)
                            if (
                              ((o = s[c]),
                              o.getAttribute(`content`) ===
                                (n.content == null ? null : `` + n.content) &&
                                o.getAttribute(`name`) ===
                                  (n.name == null ? null : n.name) &&
                                o.getAttribute(`property`) ===
                                  (n.property == null ? null : n.property) &&
                                o.getAttribute(`http-equiv`) ===
                                  (n.httpEquiv == null ? null : n.httpEquiv) &&
                                o.getAttribute(`charset`) ===
                                  (n.charSet == null ? null : n.charSet))
                            ) {
                              s.splice(c, 1);
                              break b;
                            }
                        }
                        ((o = a.createElement(r)),
                          Pd(o, r, n),
                          a.head.appendChild(o));
                        break;
                      default:
                        throw Error(i(468, r));
                    }
                    ((o[R] = e), _t(o), (r = o));
                  }
                  e.stateNode = r;
                } else Hf(a, e.type, e.stateNode);
              else e.stateNode = If(a, r, e.memoizedProps);
            else
              o === r
                ? r === null &&
                  e.stateNode !== null &&
                  Gc(e, e.memoizedProps, n.memoizedProps)
                : (o === null
                    ? n.stateNode !== null &&
                      ((n = n.stateNode), n.parentNode.removeChild(n))
                    : o.count--,
                  r === null
                    ? Hf(a, e.type, e.stateNode)
                    : If(a, r, e.memoizedProps));
          }
          break;
        case 27:
          (pl(t, e),
            gl(e),
            r & 512 && (Qc || n === null || Uc(n, n.return)),
            n !== null && r & 4 && Gc(e, e.memoizedProps, n.memoizedProps));
          break;
        case 5:
          if (
            (pl(t, e),
            gl(e),
            r & 512 && (Qc || n === null || Uc(n, n.return)),
            e.flags & 32)
          ) {
            a = e.stateNode;
            try {
              Ut(a, ``);
            } catch (t) {
              Uu(e, e.return, t);
            }
          }
          (r & 4 &&
            e.stateNode != null &&
            ((a = e.memoizedProps), Gc(e, a, n === null ? a : n.memoizedProps)),
            r & 1024 && ($c = !0));
          break;
        case 6:
          if ((pl(t, e), gl(e), r & 4)) {
            if (e.stateNode === null) throw Error(i(162));
            ((r = e.memoizedProps), (n = e.stateNode));
            try {
              n.nodeValue = r;
            } catch (t) {
              Uu(e, e.return, t);
            }
          }
          break;
        case 3:
          if (
            ((Bf = null),
            (a = ml),
            (ml = gf(t.containerInfo)),
            pl(t, e),
            (ml = a),
            gl(e),
            r & 4 && n !== null && n.memoizedState.isDehydrated)
          )
            try {
              Np(t.containerInfo);
            } catch (t) {
              Uu(e, e.return, t);
            }
          $c && (($c = !1), _l(e));
          break;
        case 4:
          ((r = ml),
            (ml = gf(e.stateNode.containerInfo)),
            pl(t, e),
            gl(e),
            (ml = r));
          break;
        case 12:
          (pl(t, e), gl(e));
          break;
        case 31:
          (pl(t, e),
            gl(e),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), fl(e, r))));
          break;
        case 13:
          (pl(t, e),
            gl(e),
            e.child.flags & 8192 &&
              (e.memoizedState !== null) !=
                (n !== null && n.memoizedState !== null) &&
              (Zl = ke()),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), fl(e, r))));
          break;
        case 22:
          a = e.memoizedState !== null;
          var l = n !== null && n.memoizedState !== null,
            u = Zc,
            d = Qc;
          if (
            ((Zc = u || a),
            (Qc = d || l),
            pl(t, e),
            (Qc = d),
            (Zc = u),
            gl(e),
            r & 8192)
          )
            a: for (
              t = e.stateNode,
                t._visibility = a ? t._visibility & -2 : t._visibility | 1,
                a && (n === null || l || Zc || Qc || yl(e)),
                n = null,
                t = e;
              ;

            ) {
              if (t.tag === 5 || t.tag === 26) {
                if (n === null) {
                  l = n = t;
                  try {
                    if (((o = l.stateNode), a))
                      ((s = o.style),
                        typeof s.setProperty == `function`
                          ? s.setProperty(`display`, `none`, `important`)
                          : (s.display = `none`));
                    else {
                      c = l.stateNode;
                      var f = l.memoizedProps.style,
                        p =
                          f != null && f.hasOwnProperty(`display`)
                            ? f.display
                            : null;
                      c.style.display =
                        p == null || typeof p == `boolean`
                          ? ``
                          : (`` + p).trim();
                    }
                  } catch (e) {
                    Uu(l, l.return, e);
                  }
                }
              } else if (t.tag === 6) {
                if (n === null) {
                  l = t;
                  try {
                    l.stateNode.nodeValue = a ? `` : l.memoizedProps;
                  } catch (e) {
                    Uu(l, l.return, e);
                  }
                }
              } else if (t.tag === 18) {
                if (n === null) {
                  l = t;
                  try {
                    var m = l.stateNode;
                    a ? $d(m, !0) : $d(l.stateNode, !1);
                  } catch (e) {
                    Uu(l, l.return, e);
                  }
                }
              } else if (
                ((t.tag !== 22 && t.tag !== 23) ||
                  t.memoizedState === null ||
                  t === e) &&
                t.child !== null
              ) {
                ((t.child.return = t), (t = t.child));
                continue;
              }
              if (t === e) break a;
              for (; t.sibling === null; ) {
                if (t.return === null || t.return === e) break a;
                (n === t && (n = null), (t = t.return));
              }
              (n === t && (n = null),
                (t.sibling.return = t.return),
                (t = t.sibling));
            }
          r & 4 &&
            ((r = e.updateQueue),
            r !== null &&
              ((n = r.retryQueue),
              n !== null && ((r.retryQueue = null), fl(e, n))));
          break;
        case 19:
          (pl(t, e),
            gl(e),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), fl(e, r))));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          (pl(t, e), gl(e));
      }
    }
    function gl(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var n, r = e.return; r !== null; ) {
            if (Kc(r)) {
              n = r;
              break;
            }
            r = r.return;
          }
          if (n == null) throw Error(i(160));
          switch (n.tag) {
            case 27:
              var a = n.stateNode;
              Yc(e, qc(e), a);
              break;
            case 5:
              var o = n.stateNode;
              (n.flags & 32 && (Ut(o, ``), (n.flags &= -33)), Yc(e, qc(e), o));
              break;
            case 3:
            case 4:
              var s = n.stateNode.containerInfo;
              Jc(e, qc(e), s);
              break;
            default:
              throw Error(i(161));
          }
        } catch (t) {
          Uu(e, e.return, t);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function _l(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; e !== null; ) {
          var t = e;
          (_l(t),
            t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
            (e = e.sibling));
        }
    }
    function vl(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null; )
          (rl(e, t.alternate, t), (t = t.sibling));
    }
    function yl(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (zc(4, t, t.return), yl(t));
            break;
          case 1:
            Uc(t, t.return);
            var n = t.stateNode;
            (typeof n.componentWillUnmount == `function` && Vc(t, t.return, n),
              yl(t));
            break;
          case 27:
            pf(t.stateNode);
          case 26:
          case 5:
            (Uc(t, t.return), yl(t));
            break;
          case 22:
            t.memoizedState === null && yl(t);
            break;
          case 30:
            yl(t);
            break;
          default:
            yl(t);
        }
        e = e.sibling;
      }
    }
    function bl(e, t, n) {
      for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null; ) {
        var r = t.alternate,
          i = e,
          a = t,
          o = a.flags;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            (bl(i, a, n), Rc(4, a));
            break;
          case 1:
            if (
              (bl(i, a, n),
              (r = a),
              (i = r.stateNode),
              typeof i.componentDidMount == `function`)
            )
              try {
                i.componentDidMount();
              } catch (e) {
                Uu(r, r.return, e);
              }
            if (((r = a), (i = r.updateQueue), i !== null)) {
              var s = r.stateNode;
              try {
                var c = i.shared.hiddenCallbacks;
                if (c !== null)
                  for (
                    i.shared.hiddenCallbacks = null, i = 0;
                    i < c.length;
                    i++
                  )
                    Ka(c[i], s);
              } catch (e) {
                Uu(r, r.return, e);
              }
            }
            (n && o & 64 && Bc(a), Hc(a, a.return));
            break;
          case 27:
            Xc(a);
          case 26:
          case 5:
            (bl(i, a, n), n && r === null && o & 4 && Wc(a), Hc(a, a.return));
            break;
          case 12:
            bl(i, a, n);
            break;
          case 31:
            (bl(i, a, n), n && o & 4 && ll(i, a));
            break;
          case 13:
            (bl(i, a, n), n && o & 4 && ul(i, a));
            break;
          case 22:
            (a.memoizedState === null && bl(i, a, n), Hc(a, a.return));
            break;
          case 30:
            break;
          default:
            bl(i, a, n);
        }
        t = t.sibling;
      }
    }
    function xl(e, t) {
      var n = null;
      (e !== null &&
        e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (n = e.memoizedState.cachePool.pool),
        (e = null),
        t.memoizedState !== null &&
          t.memoizedState.cachePool !== null &&
          (e = t.memoizedState.cachePool.pool),
        e !== n && (e != null && e.refCount++, n != null && aa(n)));
    }
    function Sl(e, t) {
      ((e = null),
        t.alternate !== null && (e = t.alternate.memoizedState.cache),
        (t = t.memoizedState.cache),
        t !== e && (t.refCount++, e != null && aa(e)));
    }
    function J(e, t, n, r) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; ) (Cl(e, t, n, r), (t = t.sibling));
    }
    function Cl(e, t, n, r) {
      var i = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (J(e, t, n, r), i & 2048 && Rc(9, t));
          break;
        case 1:
          J(e, t, n, r);
          break;
        case 3:
          (J(e, t, n, r),
            i & 2048 &&
              ((e = null),
              t.alternate !== null && (e = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache),
              t !== e && (t.refCount++, e != null && aa(e))));
          break;
        case 12:
          if (i & 2048) {
            (J(e, t, n, r), (e = t.stateNode));
            try {
              var a = t.memoizedProps,
                o = a.id,
                s = a.onPostCommit;
              typeof s == `function` &&
                s(
                  o,
                  t.alternate === null ? `mount` : `update`,
                  e.passiveEffectDuration,
                  -0,
                );
            } catch (e) {
              Uu(t, t.return, e);
            }
          } else J(e, t, n, r);
          break;
        case 31:
          J(e, t, n, r);
          break;
        case 13:
          J(e, t, n, r);
          break;
        case 23:
          break;
        case 22:
          ((a = t.stateNode),
            (o = t.alternate),
            t.memoizedState === null
              ? a._visibility & 2
                ? J(e, t, n, r)
                : ((a._visibility |= 2),
                  wl(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1))
              : a._visibility & 2
                ? J(e, t, n, r)
                : Tl(e, t),
            i & 2048 && xl(o, t));
          break;
        case 24:
          (J(e, t, n, r), i & 2048 && Sl(t.alternate, t));
          break;
        default:
          J(e, t, n, r);
      }
    }
    function wl(e, t, n, r, i) {
      for (
        i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child;
        t !== null;

      ) {
        var a = e,
          o = t,
          s = n,
          c = r,
          l = o.flags;
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            (wl(a, o, s, c, i), Rc(8, o));
            break;
          case 23:
            break;
          case 22:
            var u = o.stateNode;
            (o.memoizedState === null
              ? ((u._visibility |= 2), wl(a, o, s, c, i))
              : u._visibility & 2
                ? wl(a, o, s, c, i)
                : Tl(a, o),
              i && l & 2048 && xl(o.alternate, o));
            break;
          case 24:
            (wl(a, o, s, c, i), i && l & 2048 && Sl(o.alternate, o));
            break;
          default:
            wl(a, o, s, c, i);
        }
        t = t.sibling;
      }
    }
    function Tl(e, t) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; ) {
          var n = e,
            r = t,
            i = r.flags;
          switch (r.tag) {
            case 22:
              (Tl(n, r), i & 2048 && xl(r.alternate, r));
              break;
            case 24:
              (Tl(n, r), i & 2048 && Sl(r.alternate, r));
              break;
            default:
              Tl(n, r);
          }
          t = t.sibling;
        }
    }
    var El = 8192;
    function Dl(e, t, n) {
      if (e.subtreeFlags & El)
        for (e = e.child; e !== null; ) (Ol(e, t, n), (e = e.sibling));
    }
    function Ol(e, t, n) {
      switch (e.tag) {
        case 26:
          (Dl(e, t, n),
            e.flags & El &&
              e.memoizedState !== null &&
              Gf(n, ml, e.memoizedState, e.memoizedProps));
          break;
        case 5:
          Dl(e, t, n);
          break;
        case 3:
        case 4:
          var r = ml;
          ((ml = gf(e.stateNode.containerInfo)), Dl(e, t, n), (ml = r));
          break;
        case 22:
          e.memoizedState === null &&
            ((r = e.alternate),
            r !== null && r.memoizedState !== null
              ? ((r = El), (El = 16777216), Dl(e, t, n), (El = r))
              : Dl(e, t, n));
          break;
        default:
          Dl(e, t, n);
      }
    }
    function kl(e) {
      var t = e.alternate;
      if (t !== null && ((e = t.child), e !== null)) {
        t.child = null;
        do ((t = e.sibling), (e.sibling = null), (e = t));
        while (e !== null);
      }
    }
    function Al(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((tl = r), Nl(r, e));
          }
        kl(e);
      }
      if (e.subtreeFlags & 10256)
        for (e = e.child; e !== null; ) (jl(e), (e = e.sibling));
    }
    function jl(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (Al(e), e.flags & 2048 && zc(9, e, e.return));
          break;
        case 3:
          Al(e);
          break;
        case 12:
          Al(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null &&
          t._visibility & 2 &&
          (e.return === null || e.return.tag !== 13)
            ? ((t._visibility &= -3), Ml(e))
            : Al(e);
          break;
        default:
          Al(e);
      }
    }
    function Ml(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((tl = r), Nl(r, e));
          }
        kl(e);
      }
      for (e = e.child; e !== null; ) {
        switch (((t = e), t.tag)) {
          case 0:
          case 11:
          case 15:
            (zc(8, t, t.return), Ml(t));
            break;
          case 22:
            ((n = t.stateNode),
              n._visibility & 2 && ((n._visibility &= -3), Ml(t)));
            break;
          default:
            Ml(t);
        }
        e = e.sibling;
      }
    }
    function Nl(e, t) {
      for (; tl !== null; ) {
        var n = tl;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            zc(8, n, t);
            break;
          case 23:
          case 22:
            if (
              n.memoizedState !== null &&
              n.memoizedState.cachePool !== null
            ) {
              var r = n.memoizedState.cachePool.pool;
              r != null && r.refCount++;
            }
            break;
          case 24:
            aa(n.memoizedState.cache);
        }
        if (((r = n.child), r !== null)) ((r.return = n), (tl = r));
        else
          a: for (n = e; tl !== null; ) {
            r = tl;
            var i = r.sibling,
              a = r.return;
            if ((il(r), r === n)) {
              tl = null;
              break a;
            }
            if (i !== null) {
              ((i.return = a), (tl = i));
              break a;
            }
            tl = a;
          }
      }
    }
    var Pl = {
        getCacheForType: function (e) {
          var t = Zi(ra),
            n = t.data.get(e);
          return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
        },
        cacheSignal: function () {
          return Zi(ra).controller.signal;
        },
      },
      Fl = typeof WeakMap == `function` ? WeakMap : Map,
      Il = 0,
      Y = null,
      X = null,
      Z = 0,
      Q = 0,
      Ll = null,
      Rl = !1,
      zl = !1,
      Bl = !1,
      Vl = 0,
      Hl = 0,
      Ul = 0,
      Wl = 0,
      Gl = 0,
      Kl = 0,
      ql = 0,
      Jl = null,
      Yl = null,
      Xl = !1,
      Zl = 0,
      Ql = 0,
      $l = 1 / 0,
      eu = null,
      tu = null,
      nu = 0,
      ru = null,
      iu = null,
      au = 0,
      ou = 0,
      su = null,
      cu = null,
      lu = 0,
      uu = null;
    function du() {
      return Il & 2 && Z !== 0 ? Z & -Z : A.T === null ? at() : ud();
    }
    function fu() {
      if (Kl === 0)
        if (!(Z & 536870912) || U) {
          var e = Ke;
          ((Ke <<= 1), !(Ke & 3932160) && (Ke = 262144), (Kl = e));
        } else Kl = 536870912;
      return ((e = $a.current), e !== null && (e.flags |= 32), Kl);
    }
    function pu(e, t, n) {
      (((e === Y && (Q === 2 || Q === 9)) || e.cancelPendingCommit !== null) &&
        (bu(e, 0), _u(e, Z, Kl, !1)),
        et(e, n),
        (!(Il & 2) || e !== Y) &&
          (e === Y && (!(Il & 2) && (Wl |= n), Hl === 4 && _u(e, Z, Kl, !1)),
          nd(e)));
    }
    function mu(e, t, n) {
      if (Il & 6) throw Error(i(327));
      var r = (!n && (t & 127) == 0 && (t & e.expiredLanes) === 0) || Xe(e, t),
        a = r ? Ou(e, t) : Eu(e, t, !0),
        o = r;
      do {
        if (a === 0) {
          zl && !r && _u(e, t, 0, !1);
          break;
        } else {
          if (((n = e.current.alternate), o && !gu(n))) {
            ((a = Eu(e, t, !1)), (o = !1));
            continue;
          }
          if (a === 2) {
            if (((o = t), e.errorRecoveryDisabledLanes & o)) var s = 0;
            else
              ((s = e.pendingLanes & -536870913),
                (s = s === 0 ? (s & 536870912 ? 536870912 : 0) : s));
            if (s !== 0) {
              t = s;
              a: {
                var c = e;
                a = Jl;
                var l = c.current.memoizedState.isDehydrated;
                if (
                  (l && (bu(c, s).flags |= 256), (s = Eu(c, s, !1)), s !== 2)
                ) {
                  if (Bl && !l) {
                    ((c.errorRecoveryDisabledLanes |= o), (Wl |= o), (a = 4));
                    break a;
                  }
                  ((o = Yl),
                    (Yl = a),
                    o !== null &&
                      (Yl === null ? (Yl = o) : Yl.push.apply(Yl, o)));
                }
                a = s;
              }
              if (((o = !1), a !== 2)) continue;
            }
          }
          if (a === 1) {
            (bu(e, 0), _u(e, t, 0, !0));
            break;
          }
          a: {
            switch (((r = e), (o = a), o)) {
              case 0:
              case 1:
                throw Error(i(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                _u(r, t, Kl, !Rl);
                break a;
              case 2:
                Yl = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(i(329));
            }
            if ((t & 62914560) === t && ((a = Zl + 300 - ke()), 10 < a)) {
              if ((_u(r, t, Kl, !Rl), Ye(r, 0, !0) !== 0)) break a;
              ((au = t),
                (r.timeoutHandle = Kd(
                  hu.bind(
                    null,
                    r,
                    n,
                    Yl,
                    eu,
                    Xl,
                    t,
                    Kl,
                    Wl,
                    ql,
                    Rl,
                    o,
                    `Throttled`,
                    -0,
                    0,
                  ),
                  a,
                )));
              break a;
            }
            hu(r, n, Yl, eu, Xl, t, Kl, Wl, ql, Rl, o, null, -0, 0);
          }
        }
        break;
      } while (1);
      nd(e);
    }
    function hu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
      if (
        ((e.timeoutHandle = -1),
        (d = t.subtreeFlags),
        d & 8192 || (d & 16785408) == 16785408)
      ) {
        ((d = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: H,
        }),
          Ol(t, a, d));
        var m =
          (a & 62914560) === a
            ? Zl - ke()
            : (a & 4194048) === a
              ? Ql - ke()
              : 0;
        if (((m = qf(d, m)), m !== null)) {
          ((au = a),
            (e.cancelPendingCommit = m(
              Fu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p),
            )),
            _u(e, a, o, !l));
          return;
        }
      }
      Fu(e, t, a, n, r, i, o, s, c);
    }
    function gu(e) {
      for (var t = e; ; ) {
        var n = t.tag;
        if (
          (n === 0 || n === 11 || n === 15) &&
          t.flags & 16384 &&
          ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
        )
          for (var r = 0; r < n.length; r++) {
            var i = n[r],
              a = i.getSnapshot;
            i = i.value;
            try {
              if (!vr(a(), i)) return !1;
            } catch {
              return !1;
            }
          }
        if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
          ((n.return = t), (t = n));
        else {
          if (t === e) break;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return !0;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      }
      return !0;
    }
    function _u(e, t, n, r) {
      ((t &= ~Gl),
        (t &= ~Wl),
        (e.suspendedLanes |= t),
        (e.pingedLanes &= ~t),
        r && (e.warmLanes |= t),
        (r = e.expirationTimes));
      for (var i = t; 0 < i; ) {
        var a = 31 - Ve(i),
          o = 1 << a;
        ((r[a] = -1), (i &= ~o));
      }
      n !== 0 && tt(e, n, t);
    }
    function vu() {
      return Il & 6 ? !0 : (rd(0, !1), !1);
    }
    function yu() {
      if (X !== null) {
        if (Q === 0) var e = X.return;
        else ((e = X), (Ui = Hi = null), Do(e), (Oa = null), (ka = 0), (e = X));
        for (; e !== null; ) (Lc(e.alternate, e), (e = e.return));
        X = null;
      }
    }
    function bu(e, t) {
      var n = e.timeoutHandle;
      (n !== -1 && ((e.timeoutHandle = -1), qd(n)),
        (n = e.cancelPendingCommit),
        n !== null && ((e.cancelPendingCommit = null), n()),
        (au = 0),
        yu(),
        (Y = e),
        (X = n = oi(e.current, null)),
        (Z = t),
        (Q = 0),
        (Ll = null),
        (Rl = !1),
        (zl = Xe(e, t)),
        (Bl = !1),
        (ql = Kl = Gl = Wl = Ul = Hl = 0),
        (Yl = Jl = null),
        (Xl = !1),
        t & 8 && (t |= t & 32));
      var r = e.entangledLanes;
      if (r !== 0)
        for (e = e.entanglements, r &= t; 0 < r; ) {
          var i = 31 - Ve(r),
            a = 1 << i;
          ((t |= e[i]), (r &= ~a));
        }
      return ((Vl = t), Xr(), n);
    }
    function xu(e, t) {
      ((W = null),
        (A.H = Ps),
        t === va || t === ba
          ? ((t = Ea()), (Q = 3))
          : t === ya
            ? ((t = Ea()), (Q = 4))
            : (Q =
                t === Qs
                  ? 8
                  : typeof t == `object` && t && typeof t.then == `function`
                    ? 6
                    : 1),
        (Ll = t),
        X === null && ((Hl = 1), Ks(e, mi(t, e.current))));
    }
    function Su() {
      var e = $a.current;
      return e === null
        ? !0
        : (Z & 4194048) === Z
          ? eo === null
          : (Z & 62914560) === Z || Z & 536870912
            ? e === eo
            : !1;
    }
    function Cu() {
      var e = A.H;
      return ((A.H = Ps), e === null ? Ps : e);
    }
    function wu() {
      var e = A.A;
      return ((A.A = Pl), e);
    }
    function Tu() {
      ((Hl = 4),
        Rl || ((Z & 4194048) !== Z && $a.current !== null) || (zl = !0),
        (!(Ul & 134217727) && !(Wl & 134217727)) ||
          Y === null ||
          _u(Y, Z, Kl, !1));
    }
    function Eu(e, t, n) {
      var r = Il;
      Il |= 2;
      var i = Cu(),
        a = wu();
      ((Y !== e || Z !== t) && ((eu = null), bu(e, t)), (t = !1));
      var o = Hl;
      a: do
        try {
          if (Q !== 0 && X !== null) {
            var s = X,
              c = Ll;
            switch (Q) {
              case 8:
                (yu(), (o = 6));
                break a;
              case 3:
              case 2:
              case 9:
              case 6:
                $a.current === null && (t = !0);
                var l = Q;
                if (((Q = 0), (Ll = null), Mu(e, s, c, l), n && zl)) {
                  o = 0;
                  break a;
                }
                break;
              default:
                ((l = Q), (Q = 0), (Ll = null), Mu(e, s, c, l));
            }
          }
          (Du(), (o = Hl));
          break;
        } catch (t) {
          xu(e, t);
        }
      while (1);
      return (
        t && e.shellSuspendCounter++,
        (Ui = Hi = null),
        (Il = r),
        (A.H = i),
        (A.A = a),
        X === null && ((Y = null), (Z = 0), Xr()),
        o
      );
    }
    function Du() {
      for (; X !== null; ) Au(X);
    }
    function Ou(e, t) {
      var n = Il;
      Il |= 2;
      var r = Cu(),
        a = wu();
      Y !== e || Z !== t
        ? ((eu = null), ($l = ke() + 500), bu(e, t))
        : (zl = Xe(e, t));
      a: do
        try {
          if (Q !== 0 && X !== null) {
            t = X;
            var o = Ll;
            b: switch (Q) {
              case 1:
                ((Q = 0), (Ll = null), Mu(e, t, o, 1));
                break;
              case 2:
              case 9:
                if (Sa(o)) {
                  ((Q = 0), (Ll = null), ju(t));
                  break;
                }
                ((t = function () {
                  ((Q !== 2 && Q !== 9) || Y !== e || (Q = 7), nd(e));
                }),
                  o.then(t, t));
                break a;
              case 3:
                Q = 7;
                break a;
              case 4:
                Q = 5;
                break a;
              case 7:
                Sa(o)
                  ? ((Q = 0), (Ll = null), ju(t))
                  : ((Q = 0), (Ll = null), Mu(e, t, o, 7));
                break;
              case 5:
                var s = null;
                switch (X.tag) {
                  case 26:
                    s = X.memoizedState;
                  case 5:
                  case 27:
                    var c = X;
                    if (s ? Wf(s) : c.stateNode.complete) {
                      ((Q = 0), (Ll = null));
                      var l = c.sibling;
                      if (l !== null) X = l;
                      else {
                        var u = c.return;
                        u === null ? (X = null) : ((X = u), Nu(u));
                      }
                      break b;
                    }
                }
                ((Q = 0), (Ll = null), Mu(e, t, o, 5));
                break;
              case 6:
                ((Q = 0), (Ll = null), Mu(e, t, o, 6));
                break;
              case 8:
                (yu(), (Hl = 6));
                break a;
              default:
                throw Error(i(462));
            }
          }
          ku();
          break;
        } catch (t) {
          xu(e, t);
        }
      while (1);
      return (
        (Ui = Hi = null),
        (A.H = r),
        (A.A = a),
        (Il = n),
        X === null ? ((Y = null), (Z = 0), Xr(), Hl) : 0
      );
    }
    function ku() {
      for (; X !== null && !De(); ) Au(X);
    }
    function Au(e) {
      var t = Oc(e.alternate, e, Vl);
      ((e.memoizedProps = e.pendingProps), t === null ? Nu(e) : (X = t));
    }
    function ju(e) {
      var t = e,
        n = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = fc(n, t, t.pendingProps, t.type, void 0, Z);
          break;
        case 11:
          t = fc(n, t, t.pendingProps, t.type.render, t.ref, Z);
          break;
        case 5:
          Do(t);
        default:
          (Lc(n, t), (t = X = si(t, Vl)), (t = Oc(n, t, Vl)));
      }
      ((e.memoizedProps = e.pendingProps), t === null ? Nu(e) : (X = t));
    }
    function Mu(e, t, n, r) {
      ((Ui = Hi = null), Do(t), (Oa = null), (ka = 0));
      var i = t.return;
      try {
        if (Zs(e, i, t, n, Z)) {
          ((Hl = 1), Ks(e, mi(n, e.current)), (X = null));
          return;
        }
      } catch (t) {
        if (i !== null) throw ((X = i), t);
        ((Hl = 1), Ks(e, mi(n, e.current)), (X = null));
        return;
      }
      t.flags & 32768
        ? (U || r === 1
            ? (e = !0)
            : zl || Z & 536870912
              ? (e = !1)
              : ((Rl = e = !0),
                (r === 2 || r === 9 || r === 3 || r === 6) &&
                  ((r = $a.current),
                  r !== null && r.tag === 13 && (r.flags |= 16384))),
          Pu(t, e))
        : Nu(t);
    }
    function Nu(e) {
      var t = e;
      do {
        if (t.flags & 32768) {
          Pu(t, Rl);
          return;
        }
        e = t.return;
        var n = Fc(t.alternate, t, Vl);
        if (n !== null) {
          X = n;
          return;
        }
        if (((t = t.sibling), t !== null)) {
          X = t;
          return;
        }
        X = t = e;
      } while (t !== null);
      Hl === 0 && (Hl = 5);
    }
    function Pu(e, t) {
      do {
        var n = Ic(e.alternate, e);
        if (n !== null) {
          ((n.flags &= 32767), (X = n));
          return;
        }
        if (
          ((n = e.return),
          n !== null &&
            ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
          !t && ((e = e.sibling), e !== null))
        ) {
          X = e;
          return;
        }
        X = e = n;
      } while (e !== null);
      ((Hl = 6), (X = null));
    }
    function Fu(e, t, n, r, a, o, s, c, l) {
      e.cancelPendingCommit = null;
      do Bu();
      while (nu !== 0);
      if (Il & 6) throw Error(i(327));
      if (t !== null) {
        if (t === e.current) throw Error(i(177));
        if (
          ((o = t.lanes | t.childLanes),
          (o |= Yr),
          F(e, n, o, s, c, l),
          e === Y && ((X = Y = null), (Z = 0)),
          (iu = t),
          (ru = e),
          (au = n),
          (ou = o),
          (su = a),
          (cu = r),
          t.subtreeFlags & 10256 || t.flags & 10256
            ? ((e.callbackNode = null),
              (e.callbackPriority = 0),
              Yu(Ne, function () {
                return (Vu(), null);
              }))
            : ((e.callbackNode = null), (e.callbackPriority = 0)),
          (r = (t.flags & 13878) != 0),
          t.subtreeFlags & 13878 || r)
        ) {
          ((r = A.T), (A.T = null), (a = j.p), (j.p = 2), (s = Il), (Il |= 4));
          try {
            nl(e, t, n);
          } finally {
            ((Il = s), (j.p = a), (A.T = r));
          }
        }
        ((nu = 1), Iu(), Lu(), Ru());
      }
    }
    function Iu() {
      if (nu === 1) {
        nu = 0;
        var e = ru,
          t = iu,
          n = (t.flags & 13878) != 0;
        if (t.subtreeFlags & 13878 || n) {
          ((n = A.T), (A.T = null));
          var r = j.p;
          j.p = 2;
          var i = Il;
          Il |= 4;
          try {
            hl(t, e);
            var a = zd,
              o = Cr(e.containerInfo),
              s = a.focusedElem,
              c = a.selectionRange;
            if (
              o !== s &&
              s &&
              s.ownerDocument &&
              Sr(s.ownerDocument.documentElement, s)
            ) {
              if (c !== null && wr(s)) {
                var l = c.start,
                  u = c.end;
                if ((u === void 0 && (u = l), `selectionStart` in s))
                  ((s.selectionStart = l),
                    (s.selectionEnd = Math.min(u, s.value.length)));
                else {
                  var d = s.ownerDocument || document,
                    f = (d && d.defaultView) || window;
                  if (f.getSelection) {
                    var p = f.getSelection(),
                      m = s.textContent.length,
                      h = Math.min(c.start, m),
                      g = c.end === void 0 ? h : Math.min(c.end, m);
                    !p.extend && h > g && ((o = g), (g = h), (h = o));
                    var _ = xr(s, h),
                      v = xr(s, g);
                    if (
                      _ &&
                      v &&
                      (p.rangeCount !== 1 ||
                        p.anchorNode !== _.node ||
                        p.anchorOffset !== _.offset ||
                        p.focusNode !== v.node ||
                        p.focusOffset !== v.offset)
                    ) {
                      var y = d.createRange();
                      (y.setStart(_.node, _.offset),
                        p.removeAllRanges(),
                        h > g
                          ? (p.addRange(y), p.extend(v.node, v.offset))
                          : (y.setEnd(v.node, v.offset), p.addRange(y)));
                    }
                  }
                }
              }
              for (d = [], p = s; (p = p.parentNode); )
                p.nodeType === 1 &&
                  d.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for (
                typeof s.focus == `function` && s.focus(), s = 0;
                s < d.length;
                s++
              ) {
                var b = d[s];
                ((b.element.scrollLeft = b.left),
                  (b.element.scrollTop = b.top));
              }
            }
            ((sp = !!Rd), (zd = Rd = null));
          } finally {
            ((Il = i), (j.p = r), (A.T = n));
          }
        }
        ((e.current = t), (nu = 2));
      }
    }
    function Lu() {
      if (nu === 2) {
        nu = 0;
        var e = ru,
          t = iu,
          n = (t.flags & 8772) != 0;
        if (t.subtreeFlags & 8772 || n) {
          ((n = A.T), (A.T = null));
          var r = j.p;
          j.p = 2;
          var i = Il;
          Il |= 4;
          try {
            rl(e, t.alternate, t);
          } finally {
            ((Il = i), (j.p = r), (A.T = n));
          }
        }
        nu = 3;
      }
    }
    function Ru() {
      if (nu === 4 || nu === 3) {
        ((nu = 0), Oe());
        var e = ru,
          t = iu,
          n = au,
          r = cu;
        t.subtreeFlags & 10256 || t.flags & 10256
          ? (nu = 5)
          : ((nu = 0), (iu = ru = null), zu(e, e.pendingLanes));
        var i = e.pendingLanes;
        if (
          (i === 0 && (tu = null),
          it(n),
          (t = t.stateNode),
          ze && typeof ze.onCommitFiberRoot == `function`)
        )
          try {
            ze.onCommitFiberRoot(Re, t, void 0, (t.current.flags & 128) == 128);
          } catch {}
        if (r !== null) {
          ((t = A.T), (i = j.p), (j.p = 2), (A.T = null));
          try {
            for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
              var s = r[o];
              a(s.value, { componentStack: s.stack });
            }
          } finally {
            ((A.T = t), (j.p = i));
          }
        }
        (au & 3 && Bu(),
          nd(e),
          (i = e.pendingLanes),
          n & 261930 && i & 42
            ? e === uu
              ? lu++
              : ((lu = 0), (uu = e))
            : (lu = 0),
          rd(0, !1));
      }
    }
    function zu(e, t) {
      (e.pooledCacheLanes &= t) === 0 &&
        ((t = e.pooledCache), t != null && ((e.pooledCache = null), aa(t)));
    }
    function Bu() {
      return (Iu(), Lu(), Ru(), Vu());
    }
    function Vu() {
      if (nu !== 5) return !1;
      var e = ru,
        t = ou;
      ou = 0;
      var n = it(au),
        r = A.T,
        a = j.p;
      try {
        ((j.p = 32 > n ? 32 : n), (A.T = null), (n = su), (su = null));
        var o = ru,
          s = au;
        if (((nu = 0), (iu = ru = null), (au = 0), Il & 6)) throw Error(i(331));
        var c = Il;
        if (
          ((Il |= 4),
          jl(o.current),
          Cl(o, o.current, s, n),
          (Il = c),
          rd(0, !1),
          ze && typeof ze.onPostCommitFiberRoot == `function`)
        )
          try {
            ze.onPostCommitFiberRoot(Re, o);
          } catch {}
        return !0;
      } finally {
        ((j.p = a), (A.T = r), zu(e, t));
      }
    }
    function Hu(e, t, n) {
      ((t = mi(n, t)),
        (t = Js(e.stateNode, t, 2)),
        (e = Ba(e, t, 2)),
        e !== null && (et(e, 2), nd(e)));
    }
    function Uu(e, t, n) {
      if (e.tag === 3) Hu(e, e, n);
      else
        for (; t !== null; ) {
          if (t.tag === 3) {
            Hu(t, e, n);
            break;
          } else if (t.tag === 1) {
            var r = t.stateNode;
            if (
              typeof t.type.getDerivedStateFromError == `function` ||
              (typeof r.componentDidCatch == `function` &&
                (tu === null || !tu.has(r)))
            ) {
              ((e = mi(n, e)),
                (n = Ys(2)),
                (r = Ba(t, n, 2)),
                r !== null && (Xs(n, r, t, e), et(r, 2), nd(r)));
              break;
            }
          }
          t = t.return;
        }
    }
    function Wu(e, t, n) {
      var r = e.pingCache;
      if (r === null) {
        r = e.pingCache = new Fl();
        var i = new Set();
        r.set(t, i);
      } else ((i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i)));
      i.has(n) ||
        ((Bl = !0), i.add(n), (e = Gu.bind(null, e, t, n)), t.then(e, e));
    }
    function Gu(e, t, n) {
      var r = e.pingCache;
      (r !== null && r.delete(t),
        (e.pingedLanes |= e.suspendedLanes & n),
        (e.warmLanes &= ~n),
        Y === e &&
          (Z & n) === n &&
          (Hl === 4 || (Hl === 3 && (Z & 62914560) === Z && 300 > ke() - Zl)
            ? !(Il & 2) && bu(e, 0)
            : (Gl |= n),
          ql === Z && (ql = 0)),
        nd(e));
    }
    function Ku(e, t) {
      (t === 0 && (t = Qe()), (e = $r(e, t)), e !== null && (et(e, t), nd(e)));
    }
    function qu(e) {
      var t = e.memoizedState,
        n = 0;
      (t !== null && (n = t.retryLane), Ku(e, n));
    }
    function Ju(e, t) {
      var n = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var r = e.stateNode,
            a = e.memoizedState;
          a !== null && (n = a.retryLane);
          break;
        case 19:
          r = e.stateNode;
          break;
        case 22:
          r = e.stateNode._retryCache;
          break;
        default:
          throw Error(i(314));
      }
      (r !== null && r.delete(t), Ku(e, n));
    }
    function Yu(e, t) {
      return Te(e, t);
    }
    var Xu = null,
      Zu = null,
      Qu = !1,
      $u = !1,
      ed = !1,
      td = 0;
    function nd(e) {
      (e !== Zu &&
        e.next === null &&
        (Zu === null ? (Xu = Zu = e) : (Zu = Zu.next = e)),
        ($u = !0),
        Qu || ((Qu = !0), ld()));
    }
    function rd(e, t) {
      if (!ed && $u) {
        ed = !0;
        do
          for (var n = !1, r = Xu; r !== null; ) {
            if (!t)
              if (e !== 0) {
                var i = r.pendingLanes;
                if (i === 0) var a = 0;
                else {
                  var o = r.suspendedLanes,
                    s = r.pingedLanes;
                  ((a = (1 << (31 - Ve(42 | e) + 1)) - 1),
                    (a &= i & ~(o & ~s)),
                    (a = a & 201326741 ? (a & 201326741) | 1 : a ? a | 2 : 0));
                }
                a !== 0 && ((n = !0), cd(r, a));
              } else
                ((a = Z),
                  (a = Ye(
                    r,
                    r === Y ? a : 0,
                    r.cancelPendingCommit !== null || r.timeoutHandle !== -1,
                  )),
                  !(a & 3) || Xe(r, a) || ((n = !0), cd(r, a)));
            r = r.next;
          }
        while (n);
        ed = !1;
      }
    }
    function id() {
      ad();
    }
    function ad() {
      $u = Qu = !1;
      var e = 0;
      td !== 0 && Gd() && (e = td);
      for (var t = ke(), n = null, r = Xu; r !== null; ) {
        var i = r.next,
          a = od(r, t);
        (a === 0
          ? ((r.next = null),
            n === null ? (Xu = i) : (n.next = i),
            i === null && (Zu = n))
          : ((n = r), (e !== 0 || a & 3) && ($u = !0)),
          (r = i));
      }
      ((nu !== 0 && nu !== 5) || rd(e, !1), td !== 0 && (td = 0));
    }
    function od(e, t) {
      for (
        var n = e.suspendedLanes,
          r = e.pingedLanes,
          i = e.expirationTimes,
          a = e.pendingLanes & -62914561;
        0 < a;

      ) {
        var o = 31 - Ve(a),
          s = 1 << o,
          c = i[o];
        (c === -1
          ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Ze(s, t))
          : c <= t && (e.expiredLanes |= s),
          (a &= ~s));
      }
      if (
        ((t = Y),
        (n = Z),
        (n = Ye(
          e,
          e === t ? n : 0,
          e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
        )),
        (r = e.callbackNode),
        n === 0 ||
          (e === t && (Q === 2 || Q === 9)) ||
          e.cancelPendingCommit !== null)
      )
        return (
          r !== null && r !== null && Ee(r),
          (e.callbackNode = null),
          (e.callbackPriority = 0)
        );
      if (!(n & 3) || Xe(e, n)) {
        if (((t = n & -n), t === e.callbackPriority)) return t;
        switch ((r !== null && Ee(r), it(n))) {
          case 2:
          case 8:
            n = Me;
            break;
          case 32:
            n = Ne;
            break;
          case 268435456:
            n = Fe;
            break;
          default:
            n = Ne;
        }
        return (
          (r = sd.bind(null, e)),
          (n = Te(n, r)),
          (e.callbackPriority = t),
          (e.callbackNode = n),
          t
        );
      }
      return (
        r !== null && r !== null && Ee(r),
        (e.callbackPriority = 2),
        (e.callbackNode = null),
        2
      );
    }
    function sd(e, t) {
      if (nu !== 0 && nu !== 5)
        return ((e.callbackNode = null), (e.callbackPriority = 0), null);
      var n = e.callbackNode;
      if (Bu() && e.callbackNode !== n) return null;
      var r = Z;
      return (
        (r = Ye(
          e,
          e === Y ? r : 0,
          e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
        )),
        r === 0
          ? null
          : (mu(e, r, t),
            od(e, ke()),
            e.callbackNode != null && e.callbackNode === n
              ? sd.bind(null, e)
              : null)
      );
    }
    function cd(e, t) {
      if (Bu()) return null;
      mu(e, t, !0);
    }
    function ld() {
      Yd(function () {
        Il & 6 ? Te(je, id) : ad();
      });
    }
    function ud() {
      if (td === 0) {
        var e = ca;
        (e === 0 && ((e = Ge), (Ge <<= 1), !(Ge & 261888) && (Ge = 256)),
          (td = e));
      }
      return td;
    }
    function dd(e) {
      return e == null || typeof e == `symbol` || typeof e == `boolean`
        ? null
        : typeof e == `function`
          ? e
          : Yt(`` + e);
    }
    function fd(e, t) {
      var n = t.ownerDocument.createElement(`input`);
      return (
        (n.name = t.name),
        (n.value = t.value),
        e.id && n.setAttribute(`form`, e.id),
        t.parentNode.insertBefore(n, t),
        (e = new FormData(e)),
        n.parentNode.removeChild(n),
        e
      );
    }
    function pd(e, t, n, r, i) {
      if (t === `submit` && n && n.stateNode === i) {
        var a = dd((i[st] || null).action),
          o = r.submitter;
        o &&
          ((t = (t = o[st] || null)
            ? dd(t.formAction)
            : o.getAttribute(`formAction`)),
          t !== null && ((a = t), (o = null)));
        var s = new _n(`action`, `action`, null, r, i);
        e.push({
          event: s,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (r.defaultPrevented) {
                  if (td !== 0) {
                    var e = o ? fd(i, o) : new FormData(i);
                    bs(
                      n,
                      { pending: !0, data: e, method: i.method, action: a },
                      null,
                      e,
                    );
                  }
                } else
                  typeof a == `function` &&
                    (s.preventDefault(),
                    (e = o ? fd(i, o) : new FormData(i)),
                    bs(
                      n,
                      { pending: !0, data: e, method: i.method, action: a },
                      a,
                      e,
                    ));
              },
              currentTarget: i,
            },
          ],
        });
      }
    }
    for (var md = 0; md < Wr.length; md++) {
      var hd = Wr[md];
      Gr(hd.toLowerCase(), `on` + (hd[0].toUpperCase() + hd.slice(1)));
    }
    (Gr(Ir, `onAnimationEnd`),
      Gr(Lr, `onAnimationIteration`),
      Gr(Rr, `onAnimationStart`),
      Gr(`dblclick`, `onDoubleClick`),
      Gr(`focusin`, `onFocus`),
      Gr(`focusout`, `onBlur`),
      Gr(zr, `onTransitionRun`),
      Gr(Br, `onTransitionStart`),
      Gr(Vr, `onTransitionCancel`),
      Gr(Hr, `onTransitionEnd`),
      xt(`onMouseEnter`, [`mouseout`, `mouseover`]),
      xt(`onMouseLeave`, [`mouseout`, `mouseover`]),
      xt(`onPointerEnter`, [`pointerout`, `pointerover`]),
      xt(`onPointerLeave`, [`pointerout`, `pointerover`]),
      bt(
        `onChange`,
        `change click focusin focusout input keydown keyup selectionchange`.split(
          ` `,
        ),
      ),
      bt(
        `onSelect`,
        `focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(
          ` `,
        ),
      ),
      bt(`onBeforeInput`, [`compositionend`, `keypress`, `textInput`, `paste`]),
      bt(
        `onCompositionEnd`,
        `compositionend focusout keydown keypress keyup mousedown`.split(` `),
      ),
      bt(
        `onCompositionStart`,
        `compositionstart focusout keydown keypress keyup mousedown`.split(` `),
      ),
      bt(
        `onCompositionUpdate`,
        `compositionupdate focusout keydown keypress keyup mousedown`.split(
          ` `,
        ),
      ));
    var gd =
        `abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(
          ` `,
        ),
      _d = new Set(
        `beforetoggle cancel close invalid load scroll scrollend toggle`
          .split(` `)
          .concat(gd),
      );
    function vd(e, t) {
      t = (t & 4) != 0;
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          i = r.event;
        r = r.listeners;
        a: {
          var a = void 0;
          if (t)
            for (var o = r.length - 1; 0 <= o; o--) {
              var s = r[o],
                c = s.instance,
                l = s.currentTarget;
              if (((s = s.listener), c !== a && i.isPropagationStopped()))
                break a;
              ((a = s), (i.currentTarget = l));
              try {
                a(i);
              } catch (e) {
                Kr(e);
              }
              ((i.currentTarget = null), (a = c));
            }
          else
            for (o = 0; o < r.length; o++) {
              if (
                ((s = r[o]),
                (c = s.instance),
                (l = s.currentTarget),
                (s = s.listener),
                c !== a && i.isPropagationStopped())
              )
                break a;
              ((a = s), (i.currentTarget = l));
              try {
                a(i);
              } catch (e) {
                Kr(e);
              }
              ((i.currentTarget = null), (a = c));
            }
        }
      }
    }
    function $(e, t) {
      var n = t[ct];
      n === void 0 && (n = t[ct] = new Set());
      var r = e + `__bubble`;
      n.has(r) || (Sd(t, e, 2, !1), n.add(r));
    }
    function yd(e, t, n) {
      var r = 0;
      (t && (r |= 4), Sd(n, e, r, t));
    }
    var bd = `_reactListening` + Math.random().toString(36).slice(2);
    function xd(e) {
      if (!e[bd]) {
        ((e[bd] = !0),
          vt.forEach(function (t) {
            t !== `selectionchange` &&
              (_d.has(t) || yd(t, !1, e), yd(t, !0, e));
          }));
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[bd] || ((t[bd] = !0), yd(`selectionchange`, !1, t));
      }
    }
    function Sd(e, t, n, r) {
      switch (mp(t)) {
        case 2:
          var i = cp;
          break;
        case 8:
          i = lp;
          break;
        default:
          i = up;
      }
      ((n = i.bind(null, t, n, e)),
        (i = void 0),
        !on ||
          (t !== `touchstart` && t !== `touchmove` && t !== `wheel`) ||
          (i = !0),
        r
          ? i === void 0
            ? e.addEventListener(t, n, !0)
            : e.addEventListener(t, n, { capture: !0, passive: i })
          : i === void 0
            ? e.addEventListener(t, n, !1)
            : e.addEventListener(t, n, { passive: i }));
    }
    function Cd(e, t, n, r, i) {
      var a = r;
      if (!(t & 1) && !(t & 2) && r !== null)
        a: for (;;) {
          if (r === null) return;
          var s = r.tag;
          if (s === 3 || s === 4) {
            var c = r.stateNode.containerInfo;
            if (c === i) break;
            if (s === 4)
              for (s = r.return; s !== null; ) {
                var l = s.tag;
                if ((l === 3 || l === 4) && s.stateNode.containerInfo === i)
                  return;
                s = s.return;
              }
            for (; c !== null; ) {
              if (((s = pt(c)), s === null)) return;
              if (((l = s.tag), l === 5 || l === 6 || l === 26 || l === 27)) {
                r = a = s;
                continue a;
              }
              c = c.parentNode;
            }
          }
          r = r.return;
        }
      nn(function () {
        var r = a,
          i = Zt(n),
          s = [];
        a: {
          var c = Ur.get(e);
          if (c !== void 0) {
            var l = _n,
              u = e;
            switch (e) {
              case `keypress`:
                if (fn(n) === 0) break a;
              case `keydown`:
              case `keyup`:
                l = Fn;
                break;
              case `focusin`:
                ((u = `focus`), (l = En));
                break;
              case `focusout`:
                ((u = `blur`), (l = En));
                break;
              case `beforeblur`:
              case `afterblur`:
                l = En;
                break;
              case `click`:
                if (n.button === 2) break a;
              case `auxclick`:
              case `dblclick`:
              case `mousedown`:
              case `mousemove`:
              case `mouseup`:
              case `mouseout`:
              case `mouseover`:
              case `contextmenu`:
                l = wn;
                break;
              case `drag`:
              case `dragend`:
              case `dragenter`:
              case `dragexit`:
              case `dragleave`:
              case `dragover`:
              case `dragstart`:
              case `drop`:
                l = Tn;
                break;
              case `touchcancel`:
              case `touchend`:
              case `touchmove`:
              case `touchstart`:
                l = Ln;
                break;
              case Ir:
              case Lr:
              case Rr:
                l = Dn;
                break;
              case Hr:
                l = Rn;
                break;
              case `scroll`:
              case `scrollend`:
                l = yn;
                break;
              case `wheel`:
                l = zn;
                break;
              case `copy`:
              case `cut`:
              case `paste`:
                l = On;
                break;
              case `gotpointercapture`:
              case `lostpointercapture`:
              case `pointercancel`:
              case `pointerdown`:
              case `pointermove`:
              case `pointerout`:
              case `pointerover`:
              case `pointerup`:
                l = In;
                break;
              case `toggle`:
              case `beforetoggle`:
                l = Bn;
            }
            var d = (t & 4) != 0,
              f = !d && (e === `scroll` || e === `scrollend`),
              p = d ? (c === null ? null : c + `Capture`) : c;
            d = [];
            for (var m = r, h; m !== null; ) {
              var g = m;
              if (
                ((h = g.stateNode),
                (g = g.tag),
                (g !== 5 && g !== 26 && g !== 27) ||
                  h === null ||
                  p === null ||
                  ((g = rn(m, p)), g != null && d.push(wd(m, g, h))),
                f)
              )
                break;
              m = m.return;
            }
            0 < d.length &&
              ((c = new l(c, u, null, n, i)),
              s.push({ event: c, listeners: d }));
          }
        }
        if (!(t & 7)) {
          a: {
            if (
              ((c = e === `mouseover` || e === `pointerover`),
              (l = e === `mouseout` || e === `pointerout`),
              c &&
                n !== Xt &&
                (u = n.relatedTarget || n.fromElement) &&
                (pt(u) || u[z]))
            )
              break a;
            if (
              (l || c) &&
              ((c =
                i.window === i
                  ? i
                  : (c = i.ownerDocument)
                    ? c.defaultView || c.parentWindow
                    : window),
              l
                ? ((u = n.relatedTarget || n.toElement),
                  (l = r),
                  (u = u ? pt(u) : null),
                  u !== null &&
                    ((f = o(u)),
                    (d = u.tag),
                    u !== f || (d !== 5 && d !== 27 && d !== 6)) &&
                    (u = null))
                : ((l = null), (u = r)),
              l !== u)
            ) {
              if (
                ((d = wn),
                (g = `onMouseLeave`),
                (p = `onMouseEnter`),
                (m = `mouse`),
                (e === `pointerout` || e === `pointerover`) &&
                  ((d = In),
                  (g = `onPointerLeave`),
                  (p = `onPointerEnter`),
                  (m = `pointer`)),
                (f = l == null ? c : ht(l)),
                (h = u == null ? c : ht(u)),
                (c = new d(g, m + `leave`, l, n, i)),
                (c.target = f),
                (c.relatedTarget = h),
                (g = null),
                pt(i) === r &&
                  ((d = new d(p, m + `enter`, u, n, i)),
                  (d.target = h),
                  (d.relatedTarget = f),
                  (g = d)),
                (f = g),
                l && u)
              )
                b: {
                  for (d = Ed, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
                  g = 0;
                  for (var _ = m; _; _ = d(_)) g++;
                  for (; 0 < h - g; ) ((p = d(p)), h--);
                  for (; 0 < g - h; ) ((m = d(m)), g--);
                  for (; h--; ) {
                    if (p === m || (m !== null && p === m.alternate)) {
                      d = p;
                      break b;
                    }
                    ((p = d(p)), (m = d(m)));
                  }
                  d = null;
                }
              else d = null;
              (l !== null && Dd(s, c, l, d, !1),
                u !== null && f !== null && Dd(s, f, u, d, !0));
            }
          }
          a: {
            if (
              ((c = r ? ht(r) : window),
              (l = c.nodeName && c.nodeName.toLowerCase()),
              l === `select` || (l === `input` && c.type === `file`))
            )
              var v = or;
            else if (er(c))
              if (sr) v = gr;
              else {
                v = mr;
                var y = pr;
              }
            else
              ((l = c.nodeName),
                !l ||
                l.toLowerCase() !== `input` ||
                (c.type !== `checkbox` && c.type !== `radio`)
                  ? r && qt(r.elementType) && (v = or)
                  : (v = hr));
            if ((v &&= v(e, r))) {
              tr(s, v, n, i);
              break a;
            }
            (y && y(e, c, r),
              e === `focusout` &&
                r &&
                c.type === `number` &&
                r.memoizedProps.value != null &&
                zt(c, `number`, c.value));
          }
          switch (((y = r ? ht(r) : window), e)) {
            case `focusin`:
              (er(y) || y.contentEditable === `true`) &&
                ((Er = y), (Dr = r), (Or = null));
              break;
            case `focusout`:
              Or = Dr = Er = null;
              break;
            case `mousedown`:
              kr = !0;
              break;
            case `contextmenu`:
            case `mouseup`:
            case `dragend`:
              ((kr = !1), Ar(s, n, i));
              break;
            case `selectionchange`:
              if (Tr) break;
            case `keydown`:
            case `keyup`:
              Ar(s, n, i);
          }
          var b;
          if (Hn)
            b: {
              switch (e) {
                case `compositionstart`:
                  var x = `onCompositionStart`;
                  break b;
                case `compositionend`:
                  x = `onCompositionEnd`;
                  break b;
                case `compositionupdate`:
                  x = `onCompositionUpdate`;
                  break b;
              }
              x = void 0;
            }
          else
            Xn
              ? Jn(e, n) && (x = `onCompositionEnd`)
              : e === `keydown` &&
                n.keyCode === 229 &&
                (x = `onCompositionStart`);
          (x &&
            (Gn &&
              n.locale !== `ko` &&
              (Xn || x !== `onCompositionStart`
                ? x === `onCompositionEnd` && Xn && (b = dn())
                : ((cn = i),
                  (ln = `value` in cn ? cn.value : cn.textContent),
                  (Xn = !0))),
            (y = Td(r, x)),
            0 < y.length &&
              ((x = new kn(x, e, null, n, i)),
              s.push({ event: x, listeners: y }),
              b ? (x.data = b) : ((b = Yn(n)), b !== null && (x.data = b)))),
            (b = Wn ? Zn(e, n) : Qn(e, n)) &&
              ((x = Td(r, `onBeforeInput`)),
              0 < x.length &&
                ((y = new kn(`onBeforeInput`, `beforeinput`, null, n, i)),
                s.push({ event: y, listeners: x }),
                (y.data = b))),
            pd(s, e, r, n, i));
        }
        vd(s, t);
      });
    }
    function wd(e, t, n) {
      return { instance: e, listener: t, currentTarget: n };
    }
    function Td(e, t) {
      for (var n = t + `Capture`, r = []; e !== null; ) {
        var i = e,
          a = i.stateNode;
        if (
          ((i = i.tag),
          (i !== 5 && i !== 26 && i !== 27) ||
            a === null ||
            ((i = rn(e, n)),
            i != null && r.unshift(wd(e, i, a)),
            (i = rn(e, t)),
            i != null && r.push(wd(e, i, a))),
          e.tag === 3)
        )
          return r;
        e = e.return;
      }
      return [];
    }
    function Ed(e) {
      if (e === null) return null;
      do e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function Dd(e, t, n, r, i) {
      for (var a = t._reactName, o = []; n !== null && n !== r; ) {
        var s = n,
          c = s.alternate,
          l = s.stateNode;
        if (((s = s.tag), c !== null && c === r)) break;
        ((s !== 5 && s !== 26 && s !== 27) ||
          l === null ||
          ((c = l),
          i
            ? ((l = rn(n, a)), l != null && o.unshift(wd(n, l, c)))
            : i || ((l = rn(n, a)), l != null && o.push(wd(n, l, c)))),
          (n = n.return));
      }
      o.length !== 0 && e.push({ event: t, listeners: o });
    }
    var Od = /\r\n?/g,
      kd = /\u0000|\uFFFD/g;
    function Ad(e) {
      return (typeof e == `string` ? e : `` + e)
        .replace(
          Od,
          `
`,
        )
        .replace(kd, ``);
    }
    function jd(e, t) {
      return ((t = Ad(t)), Ad(e) === t);
    }
    function Md(e, t, n, r, a, o) {
      switch (n) {
        case `children`:
          typeof r == `string`
            ? t === `body` || (t === `textarea` && r === ``) || Ut(e, r)
            : (typeof r == `number` || typeof r == `bigint`) &&
              t !== `body` &&
              Ut(e, `` + r);
          break;
        case `className`:
          Dt(e, `class`, r);
          break;
        case `tabIndex`:
          Dt(e, `tabindex`, r);
          break;
        case `dir`:
        case `role`:
        case `viewBox`:
        case `width`:
        case `height`:
          Dt(e, n, r);
          break;
        case `style`:
          Kt(e, r, o);
          break;
        case `data`:
          if (t !== `object`) {
            Dt(e, `data`, r);
            break;
          }
        case `src`:
        case `href`:
          if (r === `` && (t !== `a` || n !== `href`)) {
            e.removeAttribute(n);
            break;
          }
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `symbol` ||
            typeof r == `boolean`
          ) {
            e.removeAttribute(n);
            break;
          }
          ((r = Yt(`` + r)), e.setAttribute(n, r));
          break;
        case `action`:
        case `formAction`:
          if (typeof r == `function`) {
            e.setAttribute(
              n,
              `javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`,
            );
            break;
          } else
            typeof o == `function` &&
              (n === `formAction`
                ? (t !== `input` && Md(e, t, `name`, a.name, a, null),
                  Md(e, t, `formEncType`, a.formEncType, a, null),
                  Md(e, t, `formMethod`, a.formMethod, a, null),
                  Md(e, t, `formTarget`, a.formTarget, a, null))
                : (Md(e, t, `encType`, a.encType, a, null),
                  Md(e, t, `method`, a.method, a, null),
                  Md(e, t, `target`, a.target, a, null)));
          if (r == null || typeof r == `symbol` || typeof r == `boolean`) {
            e.removeAttribute(n);
            break;
          }
          ((r = Yt(`` + r)), e.setAttribute(n, r));
          break;
        case `onClick`:
          r != null && (e.onclick = H);
          break;
        case `onScroll`:
          r != null && $(`scroll`, e);
          break;
        case `onScrollEnd`:
          r != null && $(`scrollend`, e);
          break;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(i(61));
            if (((n = r.__html), n != null)) {
              if (a.children != null) throw Error(i(60));
              e.innerHTML = n;
            }
          }
          break;
        case `multiple`:
          e.multiple = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `muted`:
          e.muted = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `defaultValue`:
        case `defaultChecked`:
        case `innerHTML`:
        case `ref`:
          break;
        case `autoFocus`:
          break;
        case `xlinkHref`:
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `boolean` ||
            typeof r == `symbol`
          ) {
            e.removeAttribute(`xlink:href`);
            break;
          }
          ((n = Yt(`` + r)),
            e.setAttributeNS(`http://www.w3.org/1999/xlink`, `xlink:href`, n));
          break;
        case `contentEditable`:
        case `spellCheck`:
        case `draggable`:
        case `value`:
        case `autoReverse`:
        case `externalResourcesRequired`:
        case `focusable`:
        case `preserveAlpha`:
          r != null && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, `` + r)
            : e.removeAttribute(n);
          break;
        case `inert`:
        case `allowFullScreen`:
        case `async`:
        case `autoPlay`:
        case `controls`:
        case `default`:
        case `defer`:
        case `disabled`:
        case `disablePictureInPicture`:
        case `disableRemotePlayback`:
        case `formNoValidate`:
        case `hidden`:
        case `loop`:
        case `noModule`:
        case `noValidate`:
        case `open`:
        case `playsInline`:
        case `readOnly`:
        case `required`:
        case `reversed`:
        case `scoped`:
        case `seamless`:
        case `itemScope`:
          r && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, ``)
            : e.removeAttribute(n);
          break;
        case `capture`:
        case `download`:
          !0 === r
            ? e.setAttribute(n, ``)
            : !1 !== r &&
                r != null &&
                typeof r != `function` &&
                typeof r != `symbol`
              ? e.setAttribute(n, r)
              : e.removeAttribute(n);
          break;
        case `cols`:
        case `rows`:
        case `size`:
        case `span`:
          r != null &&
          typeof r != `function` &&
          typeof r != `symbol` &&
          !isNaN(r) &&
          1 <= r
            ? e.setAttribute(n, r)
            : e.removeAttribute(n);
          break;
        case `rowSpan`:
        case `start`:
          r == null ||
          typeof r == `function` ||
          typeof r == `symbol` ||
          isNaN(r)
            ? e.removeAttribute(n)
            : e.setAttribute(n, r);
          break;
        case `popover`:
          ($(`beforetoggle`, e), $(`toggle`, e), Et(e, `popover`, r));
          break;
        case `xlinkActuate`:
          Ot(e, `http://www.w3.org/1999/xlink`, `xlink:actuate`, r);
          break;
        case `xlinkArcrole`:
          Ot(e, `http://www.w3.org/1999/xlink`, `xlink:arcrole`, r);
          break;
        case `xlinkRole`:
          Ot(e, `http://www.w3.org/1999/xlink`, `xlink:role`, r);
          break;
        case `xlinkShow`:
          Ot(e, `http://www.w3.org/1999/xlink`, `xlink:show`, r);
          break;
        case `xlinkTitle`:
          Ot(e, `http://www.w3.org/1999/xlink`, `xlink:title`, r);
          break;
        case `xlinkType`:
          Ot(e, `http://www.w3.org/1999/xlink`, `xlink:type`, r);
          break;
        case `xmlBase`:
          Ot(e, `http://www.w3.org/XML/1998/namespace`, `xml:base`, r);
          break;
        case `xmlLang`:
          Ot(e, `http://www.w3.org/XML/1998/namespace`, `xml:lang`, r);
          break;
        case `xmlSpace`:
          Ot(e, `http://www.w3.org/XML/1998/namespace`, `xml:space`, r);
          break;
        case `is`:
          Et(e, `is`, r);
          break;
        case `innerText`:
        case `textContent`:
          break;
        default:
          (!(2 < n.length) ||
            (n[0] !== `o` && n[0] !== `O`) ||
            (n[1] !== `n` && n[1] !== `N`)) &&
            ((n = V.get(n) || n), Et(e, n, r));
      }
    }
    function Nd(e, t, n, r, a, o) {
      switch (n) {
        case `style`:
          Kt(e, r, o);
          break;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(i(61));
            if (((n = r.__html), n != null)) {
              if (a.children != null) throw Error(i(60));
              e.innerHTML = n;
            }
          }
          break;
        case `children`:
          typeof r == `string`
            ? Ut(e, r)
            : (typeof r == `number` || typeof r == `bigint`) && Ut(e, `` + r);
          break;
        case `onScroll`:
          r != null && $(`scroll`, e);
          break;
        case `onScrollEnd`:
          r != null && $(`scrollend`, e);
          break;
        case `onClick`:
          r != null && (e.onclick = H);
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `innerHTML`:
        case `ref`:
          break;
        case `innerText`:
        case `textContent`:
          break;
        default:
          if (!yt.hasOwnProperty(n))
            a: {
              if (
                n[0] === `o` &&
                n[1] === `n` &&
                ((a = n.endsWith(`Capture`)),
                (t = n.slice(2, a ? n.length - 7 : void 0)),
                (o = e[st] || null),
                (o = o == null ? null : o[n]),
                typeof o == `function` && e.removeEventListener(t, o, a),
                typeof r == `function`)
              ) {
                (typeof o != `function` &&
                  o !== null &&
                  (n in e
                    ? (e[n] = null)
                    : e.hasAttribute(n) && e.removeAttribute(n)),
                  e.addEventListener(t, r, a));
                break a;
              }
              n in e
                ? (e[n] = r)
                : !0 === r
                  ? e.setAttribute(n, ``)
                  : Et(e, n, r);
            }
      }
    }
    function Pd(e, t, n) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `img`:
          ($(`error`, e), $(`load`, e));
          var r = !1,
            a = !1,
            o;
          for (o in n)
            if (n.hasOwnProperty(o)) {
              var s = n[o];
              if (s != null)
                switch (o) {
                  case `src`:
                    r = !0;
                    break;
                  case `srcSet`:
                    a = !0;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    throw Error(i(137, t));
                  default:
                    Md(e, t, o, s, n, null);
                }
            }
          (a && Md(e, t, `srcSet`, n.srcSet, n, null),
            r && Md(e, t, `src`, n.src, n, null));
          return;
        case `input`:
          $(`invalid`, e);
          var c = (o = s = a = null),
            l = null,
            u = null;
          for (r in n)
            if (n.hasOwnProperty(r)) {
              var d = n[r];
              if (d != null)
                switch (r) {
                  case `name`:
                    a = d;
                    break;
                  case `type`:
                    s = d;
                    break;
                  case `checked`:
                    l = d;
                    break;
                  case `defaultChecked`:
                    u = d;
                    break;
                  case `value`:
                    o = d;
                    break;
                  case `defaultValue`:
                    c = d;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    if (d != null) throw Error(i(137, t));
                    break;
                  default:
                    Md(e, t, r, d, n, null);
                }
            }
          Rt(e, o, c, l, u, s, a, !1);
          return;
        case `select`:
          for (a in ($(`invalid`, e), (r = s = o = null), n))
            if (n.hasOwnProperty(a) && ((c = n[a]), c != null))
              switch (a) {
                case `value`:
                  o = c;
                  break;
                case `defaultValue`:
                  s = c;
                  break;
                case `multiple`:
                  r = c;
                default:
                  Md(e, t, a, c, n, null);
              }
          ((t = o),
            (n = s),
            (e.multiple = !!r),
            t == null ? n != null && Bt(e, !!r, n, !0) : Bt(e, !!r, t, !1));
          return;
        case `textarea`:
          for (s in ($(`invalid`, e), (o = a = r = null), n))
            if (n.hasOwnProperty(s) && ((c = n[s]), c != null))
              switch (s) {
                case `value`:
                  r = c;
                  break;
                case `defaultValue`:
                  a = c;
                  break;
                case `children`:
                  o = c;
                  break;
                case `dangerouslySetInnerHTML`:
                  if (c != null) throw Error(i(91));
                  break;
                default:
                  Md(e, t, s, c, n, null);
              }
          Ht(e, r, a, o);
          return;
        case `option`:
          for (l in n)
            if (n.hasOwnProperty(l) && ((r = n[l]), r != null))
              switch (l) {
                case `selected`:
                  e.selected =
                    r && typeof r != `function` && typeof r != `symbol`;
                  break;
                default:
                  Md(e, t, l, r, n, null);
              }
          return;
        case `dialog`:
          ($(`beforetoggle`, e), $(`toggle`, e), $(`cancel`, e), $(`close`, e));
          break;
        case `iframe`:
        case `object`:
          $(`load`, e);
          break;
        case `video`:
        case `audio`:
          for (r = 0; r < gd.length; r++) $(gd[r], e);
          break;
        case `image`:
          ($(`error`, e), $(`load`, e));
          break;
        case `details`:
          $(`toggle`, e);
          break;
        case `embed`:
        case `source`:
        case `link`:
          ($(`error`, e), $(`load`, e));
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (u in n)
            if (n.hasOwnProperty(u) && ((r = n[u]), r != null))
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  throw Error(i(137, t));
                default:
                  Md(e, t, u, r, n, null);
              }
          return;
        default:
          if (qt(t)) {
            for (d in n)
              n.hasOwnProperty(d) &&
                ((r = n[d]), r !== void 0 && Nd(e, t, d, r, n, void 0));
            return;
          }
      }
      for (c in n)
        n.hasOwnProperty(c) &&
          ((r = n[c]), r != null && Md(e, t, c, r, n, null));
    }
    function Fd(e, t, n, r) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `input`:
          var a = null,
            o = null,
            s = null,
            c = null,
            l = null,
            u = null,
            d = null;
          for (m in n) {
            var f = n[m];
            if (n.hasOwnProperty(m) && f != null)
              switch (m) {
                case `checked`:
                  break;
                case `value`:
                  break;
                case `defaultValue`:
                  l = f;
                default:
                  r.hasOwnProperty(m) || Md(e, t, m, null, r, f);
              }
          }
          for (var p in r) {
            var m = r[p];
            if (((f = n[p]), r.hasOwnProperty(p) && (m != null || f != null)))
              switch (p) {
                case `type`:
                  o = m;
                  break;
                case `name`:
                  a = m;
                  break;
                case `checked`:
                  u = m;
                  break;
                case `defaultChecked`:
                  d = m;
                  break;
                case `value`:
                  s = m;
                  break;
                case `defaultValue`:
                  c = m;
                  break;
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (m != null) throw Error(i(137, t));
                  break;
                default:
                  m !== f && Md(e, t, p, m, r, f);
              }
          }
          Lt(e, s, c, l, u, d, o, a);
          return;
        case `select`:
          for (o in ((m = s = c = p = null), n))
            if (((l = n[o]), n.hasOwnProperty(o) && l != null))
              switch (o) {
                case `value`:
                  break;
                case `multiple`:
                  m = l;
                default:
                  r.hasOwnProperty(o) || Md(e, t, o, null, r, l);
              }
          for (a in r)
            if (
              ((o = r[a]),
              (l = n[a]),
              r.hasOwnProperty(a) && (o != null || l != null))
            )
              switch (a) {
                case `value`:
                  p = o;
                  break;
                case `defaultValue`:
                  c = o;
                  break;
                case `multiple`:
                  s = o;
                default:
                  o !== l && Md(e, t, a, o, r, l);
              }
          ((t = c),
            (n = s),
            (r = m),
            p == null
              ? !!r != !!n &&
                (t == null ? Bt(e, !!n, n ? [] : ``, !1) : Bt(e, !!n, t, !0))
              : Bt(e, !!n, p, !1));
          return;
        case `textarea`:
          for (c in ((m = p = null), n))
            if (
              ((a = n[c]),
              n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c))
            )
              switch (c) {
                case `value`:
                  break;
                case `children`:
                  break;
                default:
                  Md(e, t, c, null, r, a);
              }
          for (s in r)
            if (
              ((a = r[s]),
              (o = n[s]),
              r.hasOwnProperty(s) && (a != null || o != null))
            )
              switch (s) {
                case `value`:
                  p = a;
                  break;
                case `defaultValue`:
                  m = a;
                  break;
                case `children`:
                  break;
                case `dangerouslySetInnerHTML`:
                  if (a != null) throw Error(i(91));
                  break;
                default:
                  a !== o && Md(e, t, s, a, r, o);
              }
          Vt(e, p, m);
          return;
        case `option`:
          for (var h in n)
            if (
              ((p = n[h]),
              n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h))
            )
              switch (h) {
                case `selected`:
                  e.selected = !1;
                  break;
                default:
                  Md(e, t, h, null, r, p);
              }
          for (l in r)
            if (
              ((p = r[l]),
              (m = n[l]),
              r.hasOwnProperty(l) && p !== m && (p != null || m != null))
            )
              switch (l) {
                case `selected`:
                  e.selected =
                    p && typeof p != `function` && typeof p != `symbol`;
                  break;
                default:
                  Md(e, t, l, p, r, m);
              }
          return;
        case `img`:
        case `link`:
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `embed`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `source`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (var g in n)
            ((p = n[g]),
              n.hasOwnProperty(g) &&
                p != null &&
                !r.hasOwnProperty(g) &&
                Md(e, t, g, null, r, p));
          for (u in r)
            if (
              ((p = r[u]),
              (m = n[u]),
              r.hasOwnProperty(u) && p !== m && (p != null || m != null))
            )
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (p != null) throw Error(i(137, t));
                  break;
                default:
                  Md(e, t, u, p, r, m);
              }
          return;
        default:
          if (qt(t)) {
            for (var _ in n)
              ((p = n[_]),
                n.hasOwnProperty(_) &&
                  p !== void 0 &&
                  !r.hasOwnProperty(_) &&
                  Nd(e, t, _, void 0, r, p));
            for (d in r)
              ((p = r[d]),
                (m = n[d]),
                !r.hasOwnProperty(d) ||
                  p === m ||
                  (p === void 0 && m === void 0) ||
                  Nd(e, t, d, p, r, m));
            return;
          }
      }
      for (var v in n)
        ((p = n[v]),
          n.hasOwnProperty(v) &&
            p != null &&
            !r.hasOwnProperty(v) &&
            Md(e, t, v, null, r, p));
      for (f in r)
        ((p = r[f]),
          (m = n[f]),
          !r.hasOwnProperty(f) ||
            p === m ||
            (p == null && m == null) ||
            Md(e, t, f, p, r, m));
    }
    function Id(e) {
      switch (e) {
        case `css`:
        case `script`:
        case `font`:
        case `img`:
        case `image`:
        case `input`:
        case `link`:
          return !0;
        default:
          return !1;
      }
    }
    function Ld() {
      if (typeof performance.getEntriesByType == `function`) {
        for (
          var e = 0, t = 0, n = performance.getEntriesByType(`resource`), r = 0;
          r < n.length;
          r++
        ) {
          var i = n[r],
            a = i.transferSize,
            o = i.initiatorType,
            s = i.duration;
          if (a && s && Id(o)) {
            for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
              var c = n[r],
                l = c.startTime;
              if (l > s) break;
              var u = c.transferSize,
                d = c.initiatorType;
              u &&
                Id(d) &&
                ((c = c.responseEnd),
                (o += u * (c < s ? 1 : (s - l) / (c - l))));
            }
            if ((--r, (t += (8 * (a + o)) / (i.duration / 1e3)), e++, 10 < e))
              break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection &&
        ((e = navigator.connection.downlink), typeof e == `number`)
        ? e
        : 5;
    }
    var Rd = null,
      zd = null;
    function Bd(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Vd(e) {
      switch (e) {
        case `http://www.w3.org/2000/svg`:
          return 1;
        case `http://www.w3.org/1998/Math/MathML`:
          return 2;
        default:
          return 0;
      }
    }
    function Hd(e, t) {
      if (e === 0)
        switch (t) {
          case `svg`:
            return 1;
          case `math`:
            return 2;
          default:
            return 0;
        }
      return e === 1 && t === `foreignObject` ? 0 : e;
    }
    function Ud(e, t) {
      return (
        e === `textarea` ||
        e === `noscript` ||
        typeof t.children == `string` ||
        typeof t.children == `number` ||
        typeof t.children == `bigint` ||
        (typeof t.dangerouslySetInnerHTML == `object` &&
          t.dangerouslySetInnerHTML !== null &&
          t.dangerouslySetInnerHTML.__html != null)
      );
    }
    var Wd = null;
    function Gd() {
      var e = window.event;
      return e && e.type === `popstate`
        ? e === Wd
          ? !1
          : ((Wd = e), !0)
        : ((Wd = null), !1);
    }
    var Kd = typeof setTimeout == `function` ? setTimeout : void 0,
      qd = typeof clearTimeout == `function` ? clearTimeout : void 0,
      Jd = typeof Promise == `function` ? Promise : void 0,
      Yd =
        typeof queueMicrotask == `function`
          ? queueMicrotask
          : Jd === void 0
            ? Kd
            : function (e) {
                return Jd.resolve(null).then(e).catch(Xd);
              };
    function Xd(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function Zd(e) {
      return e === `head`;
    }
    function Qd(e, t) {
      var n = t,
        r = 0;
      do {
        var i = n.nextSibling;
        if ((e.removeChild(n), i && i.nodeType === 8))
          if (((n = i.data), n === `/$` || n === `/&`)) {
            if (r === 0) {
              (e.removeChild(i), Np(t));
              return;
            }
            r--;
          } else if (
            n === `$` ||
            n === `$?` ||
            n === `$~` ||
            n === `$!` ||
            n === `&`
          )
            r++;
          else if (n === `html`) pf(e.ownerDocument.documentElement);
          else if (n === `head`) {
            ((n = e.ownerDocument.head), pf(n));
            for (var a = n.firstChild; a; ) {
              var o = a.nextSibling,
                s = a.nodeName;
              (a[ft] ||
                s === `SCRIPT` ||
                s === `STYLE` ||
                (s === `LINK` && a.rel.toLowerCase() === `stylesheet`) ||
                n.removeChild(a),
                (a = o));
            }
          } else n === `body` && pf(e.ownerDocument.body);
        n = i;
      } while (n);
      Np(t);
    }
    function $d(e, t) {
      var n = e;
      e = 0;
      do {
        var r = n.nextSibling;
        if (
          (n.nodeType === 1
            ? t
              ? ((n._stashedDisplay = n.style.display),
                (n.style.display = `none`))
              : ((n.style.display = n._stashedDisplay || ``),
                n.getAttribute(`style`) === `` && n.removeAttribute(`style`))
            : n.nodeType === 3 &&
              (t
                ? ((n._stashedText = n.nodeValue), (n.nodeValue = ``))
                : (n.nodeValue = n._stashedText || ``)),
          r && r.nodeType === 8)
        )
          if (((n = r.data), n === `/$`)) {
            if (e === 0) break;
            e--;
          } else (n !== `$` && n !== `$?` && n !== `$~` && n !== `$!`) || e++;
        n = r;
      } while (n);
    }
    function ef(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var n = t;
        switch (((t = t.nextSibling), n.nodeName)) {
          case `HTML`:
          case `HEAD`:
          case `BODY`:
            (ef(n), B(n));
            continue;
          case `SCRIPT`:
          case `STYLE`:
            continue;
          case `LINK`:
            if (n.rel.toLowerCase() === `stylesheet`) continue;
        }
        e.removeChild(n);
      }
    }
    function tf(e, t, n, r) {
      for (; e.nodeType === 1; ) {
        var i = n;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!r && (e.nodeName !== `INPUT` || e.type !== `hidden`)) break;
        } else if (!r)
          if (t === `input` && e.type === `hidden`) {
            var a = i.name == null ? null : `` + i.name;
            if (i.type === `hidden` && e.getAttribute(`name`) === a) return e;
          } else return e;
        else if (!e[ft])
          switch (t) {
            case `meta`:
              if (!e.hasAttribute(`itemprop`)) break;
              return e;
            case `link`:
              if (
                ((a = e.getAttribute(`rel`)),
                (a === `stylesheet` && e.hasAttribute(`data-precedence`)) ||
                  a !== i.rel ||
                  e.getAttribute(`href`) !==
                    (i.href == null || i.href === `` ? null : i.href) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin) ||
                  e.getAttribute(`title`) !==
                    (i.title == null ? null : i.title))
              )
                break;
              return e;
            case `style`:
              if (e.hasAttribute(`data-precedence`)) break;
              return e;
            case `script`:
              if (
                ((a = e.getAttribute(`src`)),
                (a !== (i.src == null ? null : i.src) ||
                  e.getAttribute(`type`) !== (i.type == null ? null : i.type) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin)) &&
                  a &&
                  e.hasAttribute(`async`) &&
                  !e.hasAttribute(`itemprop`))
              )
                break;
              return e;
            default:
              return e;
          }
        if (((e = cf(e.nextSibling)), e === null)) break;
      }
      return null;
    }
    function nf(e, t, n) {
      if (t === ``) return null;
      for (; e.nodeType !== 3; )
        if (
          ((e.nodeType !== 1 ||
            e.nodeName !== `INPUT` ||
            e.type !== `hidden`) &&
            !n) ||
          ((e = cf(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function rf(e, t) {
      for (; e.nodeType !== 8; )
        if (
          ((e.nodeType !== 1 ||
            e.nodeName !== `INPUT` ||
            e.type !== `hidden`) &&
            !t) ||
          ((e = cf(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function af(e) {
      return e.data === `$?` || e.data === `$~`;
    }
    function of(e) {
      return (
        e.data === `$!` ||
        (e.data === `$?` && e.ownerDocument.readyState !== `loading`)
      );
    }
    function sf(e, t) {
      var n = e.ownerDocument;
      if (e.data === `$~`) e._reactRetry = t;
      else if (e.data !== `$?` || n.readyState !== `loading`) t();
      else {
        var r = function () {
          (t(), n.removeEventListener(`DOMContentLoaded`, r));
        };
        (n.addEventListener(`DOMContentLoaded`, r), (e._reactRetry = r));
      }
    }
    function cf(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (
            ((t = e.data),
            t === `$` ||
              t === `$!` ||
              t === `$?` ||
              t === `$~` ||
              t === `&` ||
              t === `F!` ||
              t === `F`)
          )
            break;
          if (t === `/$` || t === `/&`) return null;
        }
      }
      return e;
    }
    var lf = null;
    function uf(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === `/$` || n === `/&`) {
            if (t === 0) return cf(e.nextSibling);
            t--;
          } else
            (n !== `$` &&
              n !== `$!` &&
              n !== `$?` &&
              n !== `$~` &&
              n !== `&`) ||
              t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function df(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (
            n === `$` ||
            n === `$!` ||
            n === `$?` ||
            n === `$~` ||
            n === `&`
          ) {
            if (t === 0) return e;
            t--;
          } else (n !== `/$` && n !== `/&`) || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function ff(e, t, n) {
      switch (((t = Bd(n)), e)) {
        case `html`:
          if (((e = t.documentElement), !e)) throw Error(i(452));
          return e;
        case `head`:
          if (((e = t.head), !e)) throw Error(i(453));
          return e;
        case `body`:
          if (((e = t.body), !e)) throw Error(i(454));
          return e;
        default:
          throw Error(i(451));
      }
    }
    function pf(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      B(e);
    }
    var mf = new Map(),
      hf = new Set();
    function gf(e) {
      return typeof e.getRootNode == `function`
        ? e.getRootNode()
        : e.nodeType === 9
          ? e
          : e.ownerDocument;
    }
    var _f = j.d;
    j.d = { f: vf, r: yf, D: Sf, C: Cf, L: wf, m: Tf, X: Df, S: Ef, M: Of };
    function vf() {
      var e = _f.f(),
        t = vu();
      return e || t;
    }
    function yf(e) {
      var t = mt(e);
      t !== null && t.tag === 5 && t.type === `form` ? Ss(t) : _f.r(e);
    }
    var bf = typeof document > `u` ? null : document;
    function xf(e, t, n) {
      var r = bf;
      if (r && typeof t == `string` && t) {
        var i = It(t);
        ((i = `link[rel="` + e + `"][href="` + i + `"]`),
          typeof n == `string` && (i += `[crossorigin="` + n + `"]`),
          hf.has(i) ||
            (hf.add(i),
            (e = { rel: e, crossOrigin: n, href: t }),
            r.querySelector(i) === null &&
              ((t = r.createElement(`link`)),
              Pd(t, `link`, e),
              _t(t),
              r.head.appendChild(t))));
      }
    }
    function Sf(e) {
      (_f.D(e), xf(`dns-prefetch`, e, null));
    }
    function Cf(e, t) {
      (_f.C(e, t), xf(`preconnect`, e, t));
    }
    function wf(e, t, n) {
      _f.L(e, t, n);
      var r = bf;
      if (r && e && t) {
        var i = `link[rel="preload"][as="` + It(t) + `"]`;
        t === `image` && n && n.imageSrcSet
          ? ((i += `[imagesrcset="` + It(n.imageSrcSet) + `"]`),
            typeof n.imageSizes == `string` &&
              (i += `[imagesizes="` + It(n.imageSizes) + `"]`))
          : (i += `[href="` + It(e) + `"]`);
        var a = i;
        switch (t) {
          case `style`:
            a = Af(e);
            break;
          case `script`:
            a = Pf(e);
        }
        mf.has(a) ||
          ((e = h(
            {
              rel: `preload`,
              href: t === `image` && n && n.imageSrcSet ? void 0 : e,
              as: t,
            },
            n,
          )),
          mf.set(a, e),
          r.querySelector(i) !== null ||
            (t === `style` && r.querySelector(jf(a))) ||
            (t === `script` && r.querySelector(Ff(a))) ||
            ((t = r.createElement(`link`)),
            Pd(t, `link`, e),
            _t(t),
            r.head.appendChild(t)));
      }
    }
    function Tf(e, t) {
      _f.m(e, t);
      var n = bf;
      if (n && e) {
        var r = t && typeof t.as == `string` ? t.as : `script`,
          i =
            `link[rel="modulepreload"][as="` +
            It(r) +
            `"][href="` +
            It(e) +
            `"]`,
          a = i;
        switch (r) {
          case `audioworklet`:
          case `paintworklet`:
          case `serviceworker`:
          case `sharedworker`:
          case `worker`:
          case `script`:
            a = Pf(e);
        }
        if (
          !mf.has(a) &&
          ((e = h({ rel: `modulepreload`, href: e }, t)),
          mf.set(a, e),
          n.querySelector(i) === null)
        ) {
          switch (r) {
            case `audioworklet`:
            case `paintworklet`:
            case `serviceworker`:
            case `sharedworker`:
            case `worker`:
            case `script`:
              if (n.querySelector(Ff(a))) return;
          }
          ((r = n.createElement(`link`)),
            Pd(r, `link`, e),
            _t(r),
            n.head.appendChild(r));
        }
      }
    }
    function Ef(e, t, n) {
      _f.S(e, t, n);
      var r = bf;
      if (r && e) {
        var i = gt(r).hoistableStyles,
          a = Af(e);
        t ||= `default`;
        var o = i.get(a);
        if (!o) {
          var s = { loading: 0, preload: null };
          if ((o = r.querySelector(jf(a)))) s.loading = 5;
          else {
            ((e = h({ rel: `stylesheet`, href: e, "data-precedence": t }, n)),
              (n = mf.get(a)) && Rf(e, n));
            var c = (o = r.createElement(`link`));
            (_t(c),
              Pd(c, `link`, e),
              (c._p = new Promise(function (e, t) {
                ((c.onload = e), (c.onerror = t));
              })),
              c.addEventListener(`load`, function () {
                s.loading |= 1;
              }),
              c.addEventListener(`error`, function () {
                s.loading |= 2;
              }),
              (s.loading |= 4),
              Lf(o, t, r));
          }
          ((o = { type: `stylesheet`, instance: o, count: 1, state: s }),
            i.set(a, o));
        }
      }
    }
    function Df(e, t) {
      _f.X(e, t);
      var n = bf;
      if (n && e) {
        var r = gt(n).hoistableScripts,
          i = Pf(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(Ff(i))),
          a ||
            ((e = h({ src: e, async: !0 }, t)),
            (t = mf.get(i)) && zf(e, t),
            (a = n.createElement(`script`)),
            _t(a),
            Pd(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function Of(e, t) {
      _f.M(e, t);
      var n = bf;
      if (n && e) {
        var r = gt(n).hoistableScripts,
          i = Pf(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(Ff(i))),
          a ||
            ((e = h({ src: e, async: !0, type: `module` }, t)),
            (t = mf.get(i)) && zf(e, t),
            (a = n.createElement(`script`)),
            _t(a),
            Pd(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function kf(e, t, n, r) {
      var a = (a = de.current) ? gf(a) : null;
      if (!a) throw Error(i(446));
      switch (e) {
        case `meta`:
        case `title`:
          return null;
        case `style`:
          return typeof n.precedence == `string` && typeof n.href == `string`
            ? ((t = Af(n.href)),
              (n = gt(a).hoistableStyles),
              (r = n.get(t)),
              r ||
                ((r = { type: `style`, instance: null, count: 0, state: null }),
                n.set(t, r)),
              r)
            : { type: `void`, instance: null, count: 0, state: null };
        case `link`:
          if (
            n.rel === `stylesheet` &&
            typeof n.href == `string` &&
            typeof n.precedence == `string`
          ) {
            e = Af(n.href);
            var o = gt(a).hoistableStyles,
              s = o.get(e);
            if (
              (s ||
                ((a = a.ownerDocument || a),
                (s = {
                  type: `stylesheet`,
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                o.set(e, s),
                (o = a.querySelector(jf(e))) &&
                  !o._p &&
                  ((s.instance = o), (s.state.loading = 5)),
                mf.has(e) ||
                  ((n = {
                    rel: `preload`,
                    as: `style`,
                    href: n.href,
                    crossOrigin: n.crossOrigin,
                    integrity: n.integrity,
                    media: n.media,
                    hrefLang: n.hrefLang,
                    referrerPolicy: n.referrerPolicy,
                  }),
                  mf.set(e, n),
                  o || Nf(a, e, n, s.state))),
              t && r === null)
            )
              throw Error(i(528, ``));
            return s;
          }
          if (t && r !== null) throw Error(i(529, ``));
          return null;
        case `script`:
          return (
            (t = n.async),
            (n = n.src),
            typeof n == `string` &&
            t &&
            typeof t != `function` &&
            typeof t != `symbol`
              ? ((t = Pf(n)),
                (n = gt(a).hoistableScripts),
                (r = n.get(t)),
                r ||
                  ((r = {
                    type: `script`,
                    instance: null,
                    count: 0,
                    state: null,
                  }),
                  n.set(t, r)),
                r)
              : { type: `void`, instance: null, count: 0, state: null }
          );
        default:
          throw Error(i(444, e));
      }
    }
    function Af(e) {
      return `href="` + It(e) + `"`;
    }
    function jf(e) {
      return `link[rel="stylesheet"][` + e + `]`;
    }
    function Mf(e) {
      return h({}, e, { "data-precedence": e.precedence, precedence: null });
    }
    function Nf(e, t, n, r) {
      e.querySelector(`link[rel="preload"][as="style"][` + t + `]`)
        ? (r.loading = 1)
        : ((t = e.createElement(`link`)),
          (r.preload = t),
          t.addEventListener(`load`, function () {
            return (r.loading |= 1);
          }),
          t.addEventListener(`error`, function () {
            return (r.loading |= 2);
          }),
          Pd(t, `link`, n),
          _t(t),
          e.head.appendChild(t));
    }
    function Pf(e) {
      return `[src="` + It(e) + `"]`;
    }
    function Ff(e) {
      return `script[async]` + e;
    }
    function If(e, t, n) {
      if ((t.count++, t.instance === null))
        switch (t.type) {
          case `style`:
            var r = e.querySelector(`style[data-href~="` + It(n.href) + `"]`);
            if (r) return ((t.instance = r), _t(r), r);
            var a = h({}, n, {
              "data-href": n.href,
              "data-precedence": n.precedence,
              href: null,
              precedence: null,
            });
            return (
              (r = (e.ownerDocument || e).createElement(`style`)),
              _t(r),
              Pd(r, `style`, a),
              Lf(r, n.precedence, e),
              (t.instance = r)
            );
          case `stylesheet`:
            a = Af(n.href);
            var o = e.querySelector(jf(a));
            if (o) return ((t.state.loading |= 4), (t.instance = o), _t(o), o);
            ((r = Mf(n)),
              (a = mf.get(a)) && Rf(r, a),
              (o = (e.ownerDocument || e).createElement(`link`)),
              _t(o));
            var s = o;
            return (
              (s._p = new Promise(function (e, t) {
                ((s.onload = e), (s.onerror = t));
              })),
              Pd(o, `link`, r),
              (t.state.loading |= 4),
              Lf(o, n.precedence, e),
              (t.instance = o)
            );
          case `script`:
            return (
              (o = Pf(n.src)),
              (a = e.querySelector(Ff(o)))
                ? ((t.instance = a), _t(a), a)
                : ((r = n),
                  (a = mf.get(o)) && ((r = h({}, n)), zf(r, a)),
                  (e = e.ownerDocument || e),
                  (a = e.createElement(`script`)),
                  _t(a),
                  Pd(a, `link`, r),
                  e.head.appendChild(a),
                  (t.instance = a))
            );
          case `void`:
            return null;
          default:
            throw Error(i(443, t.type));
        }
      else
        t.type === `stylesheet` &&
          !(t.state.loading & 4) &&
          ((r = t.instance), (t.state.loading |= 4), Lf(r, n.precedence, e));
      return t.instance;
    }
    function Lf(e, t, n) {
      for (
        var r = n.querySelectorAll(
            `link[rel="stylesheet"][data-precedence],style[data-precedence]`,
          ),
          i = r.length ? r[r.length - 1] : null,
          a = i,
          o = 0;
        o < r.length;
        o++
      ) {
        var s = r[o];
        if (s.dataset.precedence === t) a = s;
        else if (a !== i) break;
      }
      a
        ? a.parentNode.insertBefore(e, a.nextSibling)
        : ((t = n.nodeType === 9 ? n.head : n),
          t.insertBefore(e, t.firstChild));
    }
    function Rf(e, t) {
      ((e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.title ??= t.title));
    }
    function zf(e, t) {
      ((e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.integrity ??= t.integrity));
    }
    var Bf = null;
    function Vf(e, t, n) {
      if (Bf === null) {
        var r = new Map(),
          i = (Bf = new Map());
        i.set(n, r);
      } else ((i = Bf), (r = i.get(n)), r || ((r = new Map()), i.set(n, r)));
      if (r.has(e)) return r;
      for (
        r.set(e, null), n = n.getElementsByTagName(e), i = 0;
        i < n.length;
        i++
      ) {
        var a = n[i];
        if (
          !(
            a[ft] ||
            a[R] ||
            (e === `link` && a.getAttribute(`rel`) === `stylesheet`)
          ) &&
          a.namespaceURI !== `http://www.w3.org/2000/svg`
        ) {
          var o = a.getAttribute(t) || ``;
          o = e + o;
          var s = r.get(o);
          s ? s.push(a) : r.set(o, [a]);
        }
      }
      return r;
    }
    function Hf(e, t, n) {
      ((e = e.ownerDocument || e),
        e.head.insertBefore(
          n,
          t === `title` ? e.querySelector(`head > title`) : null,
        ));
    }
    function Uf(e, t, n) {
      if (n === 1 || t.itemProp != null) return !1;
      switch (e) {
        case `meta`:
        case `title`:
          return !0;
        case `style`:
          if (
            typeof t.precedence != `string` ||
            typeof t.href != `string` ||
            t.href === ``
          )
            break;
          return !0;
        case `link`:
          if (
            typeof t.rel != `string` ||
            typeof t.href != `string` ||
            t.href === `` ||
            t.onLoad ||
            t.onError
          )
            break;
          switch (t.rel) {
            case `stylesheet`:
              return (
                (e = t.disabled),
                typeof t.precedence == `string` && e == null
              );
            default:
              return !0;
          }
        case `script`:
          if (
            t.async &&
            typeof t.async != `function` &&
            typeof t.async != `symbol` &&
            !t.onLoad &&
            !t.onError &&
            t.src &&
            typeof t.src == `string`
          )
            return !0;
      }
      return !1;
    }
    function Wf(e) {
      return !(e.type === `stylesheet` && !(e.state.loading & 3));
    }
    function Gf(e, t, n, r) {
      if (
        n.type === `stylesheet` &&
        (typeof r.media != `string` || !1 !== matchMedia(r.media).matches) &&
        !(n.state.loading & 4)
      ) {
        if (n.instance === null) {
          var i = Af(r.href),
            a = t.querySelector(jf(i));
          if (a) {
            ((t = a._p),
              typeof t == `object` &&
                t &&
                typeof t.then == `function` &&
                (e.count++, (e = Jf.bind(e)), t.then(e, e)),
              (n.state.loading |= 4),
              (n.instance = a),
              _t(a));
            return;
          }
          ((a = t.ownerDocument || t),
            (r = Mf(r)),
            (i = mf.get(i)) && Rf(r, i),
            (a = a.createElement(`link`)),
            _t(a));
          var o = a;
          ((o._p = new Promise(function (e, t) {
            ((o.onload = e), (o.onerror = t));
          })),
            Pd(a, `link`, r),
            (n.instance = a));
        }
        (e.stylesheets === null && (e.stylesheets = new Map()),
          e.stylesheets.set(n, t),
          (t = n.state.preload) &&
            !(n.state.loading & 3) &&
            (e.count++,
            (n = Jf.bind(e)),
            t.addEventListener(`load`, n),
            t.addEventListener(`error`, n)));
      }
    }
    var Kf = 0;
    function qf(e, t) {
      return (
        e.stylesheets && e.count === 0 && Xf(e, e.stylesheets),
        0 < e.count || 0 < e.imgCount
          ? function (n) {
              var r = setTimeout(function () {
                if ((e.stylesheets && Xf(e, e.stylesheets), e.unsuspend)) {
                  var t = e.unsuspend;
                  ((e.unsuspend = null), t());
                }
              }, 6e4 + t);
              0 < e.imgBytes && Kf === 0 && (Kf = 62500 * Ld());
              var i = setTimeout(
                function () {
                  if (
                    ((e.waitingForImages = !1),
                    e.count === 0 &&
                      (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend))
                  ) {
                    var t = e.unsuspend;
                    ((e.unsuspend = null), t());
                  }
                },
                (e.imgBytes > Kf ? 50 : 800) + t,
              );
              return (
                (e.unsuspend = n),
                function () {
                  ((e.unsuspend = null), clearTimeout(r), clearTimeout(i));
                }
              );
            }
          : null
      );
    }
    function Jf() {
      if (
        (this.count--,
        this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
      ) {
        if (this.stylesheets) Xf(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          ((this.unsuspend = null), e());
        }
      }
    }
    var Yf = null;
    function Xf(e, t) {
      ((e.stylesheets = null),
        e.unsuspend !== null &&
          (e.count++,
          (Yf = new Map()),
          t.forEach(Zf, e),
          (Yf = null),
          Jf.call(e)));
    }
    function Zf(e, t) {
      if (!(t.state.loading & 4)) {
        var n = Yf.get(e);
        if (n) var r = n.get(null);
        else {
          ((n = new Map()), Yf.set(e, n));
          for (
            var i = e.querySelectorAll(
                `link[data-precedence],style[data-precedence]`,
              ),
              a = 0;
            a < i.length;
            a++
          ) {
            var o = i[a];
            (o.nodeName === `LINK` || o.getAttribute(`media`) !== `not all`) &&
              (n.set(o.dataset.precedence, o), (r = o));
          }
          r && n.set(null, r);
        }
        ((i = t.instance),
          (o = i.getAttribute(`data-precedence`)),
          (a = n.get(o) || r),
          a === r && n.set(null, i),
          n.set(o, i),
          this.count++,
          (r = Jf.bind(this)),
          i.addEventListener(`load`, r),
          i.addEventListener(`error`, r),
          a
            ? a.parentNode.insertBefore(i, a.nextSibling)
            : ((e = e.nodeType === 9 ? e.head : e),
              e.insertBefore(i, e.firstChild)),
          (t.state.loading |= 4));
      }
    }
    var Qf = {
      $$typeof: C,
      Provider: null,
      Consumer: null,
      _currentValue: oe,
      _currentValue2: oe,
      _threadCount: 0,
    };
    function $f(e, t, n, r, i, a, o, s, c) {
      ((this.tag = 1),
        (this.containerInfo = e),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = $e(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = $e(0)),
        (this.hiddenUpdates = $e(null)),
        (this.identifierPrefix = r),
        (this.onUncaughtError = i),
        (this.onCaughtError = a),
        (this.onRecoverableError = o),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = c),
        (this.incompleteTransitions = new Map()));
    }
    function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
      return (
        (e = new $f(e, t, n, o, c, l, u, d, s)),
        (t = 1),
        !0 === a && (t |= 24),
        (a = ii(3, null, null, t)),
        (e.current = a),
        (a.stateNode = e),
        (t = ia()),
        t.refCount++,
        (e.pooledCache = t),
        t.refCount++,
        (a.memoizedState = { element: r, isDehydrated: n, cache: t }),
        La(a),
        e
      );
    }
    function tp(e) {
      return e ? ((e = ni), e) : ni;
    }
    function np(e, t, n, r, i, a) {
      ((i = tp(i)),
        r.context === null ? (r.context = i) : (r.pendingContext = i),
        (r = za(t)),
        (r.payload = { element: n }),
        (a = a === void 0 ? null : a),
        a !== null && (r.callback = a),
        (n = Ba(e, r, t)),
        n !== null && (pu(n, e, t), Va(n, e, t)));
    }
    function rp(e, t) {
      if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var n = e.retryLane;
        e.retryLane = n !== 0 && n < t ? n : t;
      }
    }
    function ip(e, t) {
      (rp(e, t), (e = e.alternate) && rp(e, t));
    }
    function ap(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = $r(e, 67108864);
        (t !== null && pu(t, e, 67108864), ip(e, 67108864));
      }
    }
    function op(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = du();
        t = rt(t);
        var n = $r(e, t);
        (n !== null && pu(n, e, t), ip(e, t));
      }
    }
    var sp = !0;
    function cp(e, t, n, r) {
      var i = A.T;
      A.T = null;
      var a = j.p;
      try {
        ((j.p = 2), up(e, t, n, r));
      } finally {
        ((j.p = a), (A.T = i));
      }
    }
    function lp(e, t, n, r) {
      var i = A.T;
      A.T = null;
      var a = j.p;
      try {
        ((j.p = 8), up(e, t, n, r));
      } finally {
        ((j.p = a), (A.T = i));
      }
    }
    function up(e, t, n, r) {
      if (sp) {
        var i = dp(r);
        if (i === null) (Cd(e, t, r, fp, n), Cp(e, r));
        else if (Tp(i, e, t, n, r)) r.stopPropagation();
        else if ((Cp(e, r), t & 4 && -1 < Sp.indexOf(e))) {
          for (; i !== null; ) {
            var a = mt(i);
            if (a !== null)
              switch (a.tag) {
                case 3:
                  if (
                    ((a = a.stateNode), a.current.memoizedState.isDehydrated)
                  ) {
                    var o = Je(a.pendingLanes);
                    if (o !== 0) {
                      var s = a;
                      for (s.pendingLanes |= 2, s.entangledLanes |= 2; o; ) {
                        var c = 1 << (31 - Ve(o));
                        ((s.entanglements[1] |= c), (o &= ~c));
                      }
                      (nd(a), !(Il & 6) && (($l = ke() + 500), rd(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((s = $r(a, 2)), s !== null && pu(s, a, 2), vu(), ip(a, 2));
              }
            if (((a = dp(r)), a === null && Cd(e, t, r, fp, n), a === i)) break;
            i = a;
          }
          i !== null && r.stopPropagation();
        } else Cd(e, t, r, null, n);
      }
    }
    function dp(e) {
      return ((e = Zt(e)), pp(e));
    }
    var fp = null;
    function pp(e) {
      if (((fp = null), (e = pt(e)), e !== null)) {
        var t = o(e);
        if (t === null) e = null;
        else {
          var n = t.tag;
          if (n === 13) {
            if (((e = s(t)), e !== null)) return e;
            e = null;
          } else if (n === 31) {
            if (((e = c(t)), e !== null)) return e;
            e = null;
          } else if (n === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return ((fp = e), null);
    }
    function mp(e) {
      switch (e) {
        case `beforetoggle`:
        case `cancel`:
        case `click`:
        case `close`:
        case `contextmenu`:
        case `copy`:
        case `cut`:
        case `auxclick`:
        case `dblclick`:
        case `dragend`:
        case `dragstart`:
        case `drop`:
        case `focusin`:
        case `focusout`:
        case `input`:
        case `invalid`:
        case `keydown`:
        case `keypress`:
        case `keyup`:
        case `mousedown`:
        case `mouseup`:
        case `paste`:
        case `pause`:
        case `play`:
        case `pointercancel`:
        case `pointerdown`:
        case `pointerup`:
        case `ratechange`:
        case `reset`:
        case `resize`:
        case `seeked`:
        case `submit`:
        case `toggle`:
        case `touchcancel`:
        case `touchend`:
        case `touchstart`:
        case `volumechange`:
        case `change`:
        case `selectionchange`:
        case `textInput`:
        case `compositionstart`:
        case `compositionend`:
        case `compositionupdate`:
        case `beforeblur`:
        case `afterblur`:
        case `beforeinput`:
        case `blur`:
        case `fullscreenchange`:
        case `focus`:
        case `hashchange`:
        case `popstate`:
        case `select`:
        case `selectstart`:
          return 2;
        case `drag`:
        case `dragenter`:
        case `dragexit`:
        case `dragleave`:
        case `dragover`:
        case `mousemove`:
        case `mouseout`:
        case `mouseover`:
        case `pointermove`:
        case `pointerout`:
        case `pointerover`:
        case `scroll`:
        case `touchmove`:
        case `wheel`:
        case `mouseenter`:
        case `mouseleave`:
        case `pointerenter`:
        case `pointerleave`:
          return 8;
        case `message`:
          switch (Ae()) {
            case je:
              return 2;
            case Me:
              return 8;
            case Ne:
            case Pe:
              return 32;
            case Fe:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var hp = !1,
      gp = null,
      _p = null,
      vp = null,
      yp = new Map(),
      bp = new Map(),
      xp = [],
      Sp =
        `mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(
          ` `,
        );
    function Cp(e, t) {
      switch (e) {
        case `focusin`:
        case `focusout`:
          gp = null;
          break;
        case `dragenter`:
        case `dragleave`:
          _p = null;
          break;
        case `mouseover`:
        case `mouseout`:
          vp = null;
          break;
        case `pointerover`:
        case `pointerout`:
          yp.delete(t.pointerId);
          break;
        case `gotpointercapture`:
        case `lostpointercapture`:
          bp.delete(t.pointerId);
      }
    }
    function wp(e, t, n, r, i, a) {
      return e === null || e.nativeEvent !== a
        ? ((e = {
            blockedOn: t,
            domEventName: n,
            eventSystemFlags: r,
            nativeEvent: a,
            targetContainers: [i],
          }),
          t !== null && ((t = mt(t)), t !== null && ap(t)),
          e)
        : ((e.eventSystemFlags |= r),
          (t = e.targetContainers),
          i !== null && t.indexOf(i) === -1 && t.push(i),
          e);
    }
    function Tp(e, t, n, r, i) {
      switch (t) {
        case `focusin`:
          return ((gp = wp(gp, e, t, n, r, i)), !0);
        case `dragenter`:
          return ((_p = wp(_p, e, t, n, r, i)), !0);
        case `mouseover`:
          return ((vp = wp(vp, e, t, n, r, i)), !0);
        case `pointerover`:
          var a = i.pointerId;
          return (yp.set(a, wp(yp.get(a) || null, e, t, n, r, i)), !0);
        case `gotpointercapture`:
          return (
            (a = i.pointerId),
            bp.set(a, wp(bp.get(a) || null, e, t, n, r, i)),
            !0
          );
      }
      return !1;
    }
    function Ep(e) {
      var t = pt(e.target);
      if (t !== null) {
        var n = o(t);
        if (n !== null) {
          if (((t = n.tag), t === 13)) {
            if (((t = s(n)), t !== null)) {
              ((e.blockedOn = t),
                L(e.priority, function () {
                  op(n);
                }));
              return;
            }
          } else if (t === 31) {
            if (((t = c(n)), t !== null)) {
              ((e.blockedOn = t),
                L(e.priority, function () {
                  op(n);
                }));
              return;
            }
          } else if (
            t === 3 &&
            n.stateNode.current.memoizedState.isDehydrated
          ) {
            e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function Dp(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var n = dp(e.nativeEvent);
        if (n === null) {
          n = e.nativeEvent;
          var r = new n.constructor(n.type, n);
          ((Xt = r), n.target.dispatchEvent(r), (Xt = null));
        } else return ((t = mt(n)), t !== null && ap(t), (e.blockedOn = n), !1);
        t.shift();
      }
      return !0;
    }
    function Op(e, t, n) {
      Dp(e) && n.delete(t);
    }
    function kp() {
      ((hp = !1),
        gp !== null && Dp(gp) && (gp = null),
        _p !== null && Dp(_p) && (_p = null),
        vp !== null && Dp(vp) && (vp = null),
        yp.forEach(Op),
        bp.forEach(Op));
    }
    function Ap(e, n) {
      e.blockedOn === n &&
        ((e.blockedOn = null),
        hp ||
          ((hp = !0),
          t.unstable_scheduleCallback(t.unstable_NormalPriority, kp)));
    }
    var jp = null;
    function Mp(e) {
      jp !== e &&
        ((jp = e),
        t.unstable_scheduleCallback(t.unstable_NormalPriority, function () {
          jp === e && (jp = null);
          for (var t = 0; t < e.length; t += 3) {
            var n = e[t],
              r = e[t + 1],
              i = e[t + 2];
            if (typeof r != `function`) {
              if (pp(r || n) === null) continue;
              break;
            }
            var a = mt(n);
            a !== null &&
              (e.splice(t, 3),
              (t -= 3),
              bs(
                a,
                { pending: !0, data: i, method: n.method, action: r },
                r,
                i,
              ));
          }
        }));
    }
    function Np(e) {
      function t(t) {
        return Ap(t, e);
      }
      (gp !== null && Ap(gp, e),
        _p !== null && Ap(_p, e),
        vp !== null && Ap(vp, e),
        yp.forEach(t),
        bp.forEach(t));
      for (var n = 0; n < xp.length; n++) {
        var r = xp[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
      for (; 0 < xp.length && ((n = xp[0]), n.blockedOn === null); )
        (Ep(n), n.blockedOn === null && xp.shift());
      if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
        for (r = 0; r < n.length; r += 3) {
          var i = n[r],
            a = n[r + 1],
            o = i[st] || null;
          if (typeof a == `function`) o || Mp(n);
          else if (o) {
            var s = null;
            if (a && a.hasAttribute(`formAction`)) {
              if (((i = a), (o = a[st] || null))) s = o.formAction;
              else if (pp(i) !== null) continue;
            } else s = o.action;
            (typeof s == `function`
              ? (n[r + 1] = s)
              : (n.splice(r, 3), (r -= 3)),
              Mp(n));
          }
        }
    }
    function Pp() {
      function e(e) {
        e.canIntercept &&
          e.info === `react-transition` &&
          e.intercept({
            handler: function () {
              return new Promise(function (e) {
                return (i = e);
              });
            },
            focusReset: `manual`,
            scroll: `manual`,
          });
      }
      function t() {
        (i !== null && (i(), (i = null)), r || setTimeout(n, 20));
      }
      function n() {
        if (!r && !navigation.transition) {
          var e = navigation.currentEntry;
          e &&
            e.url != null &&
            navigation.navigate(e.url, {
              state: e.getState(),
              info: `react-transition`,
              history: `replace`,
            });
        }
      }
      if (typeof navigation == `object`) {
        var r = !1,
          i = null;
        return (
          navigation.addEventListener(`navigate`, e),
          navigation.addEventListener(`navigatesuccess`, t),
          navigation.addEventListener(`navigateerror`, t),
          setTimeout(n, 100),
          function () {
            ((r = !0),
              navigation.removeEventListener(`navigate`, e),
              navigation.removeEventListener(`navigatesuccess`, t),
              navigation.removeEventListener(`navigateerror`, t),
              i !== null && (i(), (i = null)));
          }
        );
      }
    }
    function Fp(e) {
      this._internalRoot = e;
    }
    ((Ip.prototype.render = Fp.prototype.render =
      function (e) {
        var t = this._internalRoot;
        if (t === null) throw Error(i(409));
        var n = t.current;
        np(n, du(), e, t, null, null);
      }),
      (Ip.prototype.unmount = Fp.prototype.unmount =
        function () {
          var e = this._internalRoot;
          if (e !== null) {
            this._internalRoot = null;
            var t = e.containerInfo;
            (np(e.current, 2, null, e, null, null), vu(), (t[z] = null));
          }
        }));
    function Ip(e) {
      this._internalRoot = e;
    }
    Ip.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = at();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < xp.length && t !== 0 && t < xp[n].priority; n++);
        (xp.splice(n, 0, e), n === 0 && Ep(e));
      }
    };
    var Lp = n.version;
    if (Lp !== `19.2.6`) throw Error(i(527, Lp, `19.2.6`));
    j.findDOMNode = function (e) {
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == `function`
          ? Error(i(188))
          : ((e = Object.keys(e).join(`,`)), Error(i(268, e)));
      return (
        (e = d(t)),
        (e = e === null ? null : p(e)),
        (e = e === null ? null : e.stateNode),
        e
      );
    };
    var Rp = {
      bundleType: 0,
      version: `19.2.6`,
      rendererPackageName: `react-dom`,
      currentDispatcherRef: A,
      reconcilerVersion: `19.2.6`,
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u`) {
      var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!zp.isDisabled && zp.supportsFiber)
        try {
          ((Re = zp.inject(Rp)), (ze = zp));
        } catch {}
    }
    e.createRoot = function (e, t) {
      if (!a(e)) throw Error(i(299));
      var n = !1,
        r = ``,
        o = Us,
        s = Ws,
        c = Gs;
      return (
        t != null &&
          (!0 === t.unstable_strictMode && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
          t.onCaughtError !== void 0 && (s = t.onCaughtError),
          t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
        (t = ep(e, 1, !1, null, null, n, r, null, o, s, c, Pp)),
        (e[z] = t.current),
        xd(e),
        new Fp(t)
      );
    };
  });
var g = o((e, t) => {
    function n() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = h()));
  });
var _ = (...e) =>
    e
      .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
      .join(` `)
      .trim();
var v = (e) => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase();
var y = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) =>
      n ? n.toUpperCase() : t.toLowerCase(),
    );
var b = (e) => {
    let t = y(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
var x = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    strokeWidth: 2,
    strokeLinecap: `round`,
    strokeLinejoin: `round`,
  };
var S = (e) => {
    for (let t in e)
      if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
    return !1;
  };
var C = c(u(), 1);
var w = (0, C.createContext)({});
var T = () => (0, C.useContext)(w);
var ee = (0, C.forwardRef)(
    (
      {
        color: e,
        size: t,
        strokeWidth: n,
        absoluteStrokeWidth: r,
        className: i = ``,
        children: a,
        iconNode: o,
        ...s
      },
      c,
    ) => {
      let {
          size: l = 24,
          strokeWidth: u = 2,
          absoluteStrokeWidth: d = !1,
          color: f = `currentColor`,
          className: p = ``,
        } = T() ?? {},
        m = (r ?? d) ? (Number(n ?? u) * 24) / Number(t ?? l) : (n ?? u);
      return (0, C.createElement)(
        `svg`,
        {
          ref: c,
          ...x,
          width: t ?? l ?? x.width,
          height: t ?? l ?? x.height,
          stroke: e ?? f,
          strokeWidth: m,
          className: _(`lucide`, p, i),
          ...(!a && !S(s) && { "aria-hidden": `true` }),
          ...s,
        },
        [
          ...o.map(([e, t]) => (0, C.createElement)(e, t)),
          ...(Array.isArray(a) ? a : [a]),
        ],
      );
    },
  );
var E = (e, t) => {
    let n = (0, C.forwardRef)(({ className: n, ...r }, i) =>
      (0, C.createElement)(ee, {
        ref: i,
        iconNode: t,
        className: _(`lucide-${v(b(e))}`, `lucide-${e}`, n),
        ...r,
      }),
    );
    return ((n.displayName = b(e)), n);
  };
var D = E(`arrow-right`, [
    [`path`, { d: `M5 12h14`, key: `1ays0h` }],
    [`path`, { d: `m12 5 7 7-7 7`, key: `xquz4c` }],
  ]);
var te = E(`arrow-up-right`, [
    [`path`, { d: `M7 7h10v10`, key: `1tivn9` }],
    [`path`, { d: `M7 17 17 7`, key: `1vkiza` }],
  ]);
var ne = E(`castle`, [
    [`path`, { d: `M10 5V3`, key: `1y54qe` }],
    [`path`, { d: `M14 5V3`, key: `m6isi` }],
    [`path`, { d: `M15 21v-3a3 3 0 0 0-6 0v3`, key: `lbp5hj` }],
    [`path`, { d: `M18 3v8`, key: `2ollhf` }],
    [`path`, { d: `M18 5H6`, key: `98imr9` }],
    [`path`, { d: `M22 11H2`, key: `1lmjae` }],
    [`path`, { d: `M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9`, key: `1rly83` }],
    [`path`, { d: `M6 3v8`, key: `csox7g` }],
  ]);
var O = E(`check`, [[`path`, { d: `M20 6 9 17l-5-5`, key: `1gmf2c` }]]);
var re = E(`chevron-right`, [[`path`, { d: `m9 18 6-6-6-6`, key: `mthhwq` }]]);
var k = E(`clock`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`path`, { d: `M12 6v6l4 2`, key: `mmk7yg` }],
  ]);
var ie = E(`cloud-off`, [
    [
      `path`,
      {
        d: `M10.94 5.274A7 7 0 0 1 15.71 10h1.79a4.5 4.5 0 0 1 4.222 6.057`,
        key: `1uxyv8`,
      },
    ],
    [
      `path`,
      {
        d: `M18.796 18.81A4.5 4.5 0 0 1 17.5 19H9A7 7 0 0 1 5.79 5.78`,
        key: `99tcn7`,
      },
    ],
    [`path`, { d: `m2 2 20 20`, key: `1ooewy` }],
  ]);
var ae = E(`cloud`, [
    [
      `path`,
      {
        d: `M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z`,
        key: `p7xjir`,
      },
    ],
  ]);
var A = E(`coins`, [
    [`path`, { d: `M13.744 17.736a6 6 0 1 1-7.48-7.48`, key: `bq4yh3` }],
    [`path`, { d: `M15 6h1v4`, key: `11y1tn` }],
    [`path`, { d: `m6.134 14.768.866-.5 2 3.464`, key: `17snzx` }],
    [`circle`, { cx: `16`, cy: `8`, r: `6`, key: `14bfc9` }],
  ]);
var j = E(`compass`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [
      `path`,
      {
        d: `m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z`,
        key: `9ktpf1`,
      },
    ],
  ]);
var oe = E(`crown`, [
    [
      `path`,
      {
        d: `M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z`,
        key: `1vdc57`,
      },
    ],
    [`path`, { d: `M5 21h14`, key: `11awu3` }],
  ]);
var se = E(`flag`, [
    [
      `path`,
      {
        d: `M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528`,
        key: `1jaruq`,
      },
    ],
  ]);
var ce = E(`flame`, [
    [
      `path`,
      {
        d: `M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4`,
        key: `1slcih`,
      },
    ],
  ]);
var le = E(`flower-2`, [
    [
      `path`,
      {
        d: `M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1`,
        key: `3pnvol`,
      },
    ],
    [`circle`, { cx: `12`, cy: `8`, r: `2`, key: `1822b1` }],
    [`path`, { d: `M12 10v12`, key: `6ubwww` }],
    [
      `path`,
      { d: `M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z`, key: `9hd38g` },
    ],
    [
      `path`,
      { d: `M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z`, key: `ufn41s` },
    ],
  ]);
var M = E(`gem`, [
    [`path`, { d: `M10.5 3 8 9l4 13 4-13-2.5-6`, key: `b3dvk1` }],
    [
      `path`,
      {
        d: `M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z`,
        key: `7w4byz`,
      },
    ],
    [`path`, { d: `M2 9h20`, key: `16fsjt` }],
  ]);
var N = E(`hammer`, [
    [`path`, { d: `m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9`, key: `1hayfq` }],
    [`path`, { d: `m18 15 4-4`, key: `16gjal` }],
    [
      `path`,
      {
        d: `m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5`,
        key: `15ts47`,
      },
    ],
  ]);
var ue = E(`locate-fixed`, [
    [`line`, { x1: `2`, x2: `5`, y1: `12`, y2: `12`, key: `bvdh0s` }],
    [`line`, { x1: `19`, x2: `22`, y1: `12`, y2: `12`, key: `1tbv5k` }],
    [`line`, { x1: `12`, x2: `12`, y1: `2`, y2: `5`, key: `11lu5j` }],
    [`line`, { x1: `12`, x2: `12`, y1: `19`, y2: `22`, key: `x3vr5v` }],
    [`circle`, { cx: `12`, cy: `12`, r: `7`, key: `fim9np` }],
    [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
  ]);
var P = E(`lock`, [
    [
      `rect`,
      {
        width: `18`,
        height: `11`,
        x: `3`,
        y: `11`,
        rx: `2`,
        ry: `2`,
        key: `1w4ew1`,
      },
    ],
    [`path`, { d: `M7 11V7a5 5 0 0 1 10 0v4`, key: `fwvmzm` }],
  ]);
var de = E(`minus`, [[`path`, { d: `M5 12h14`, key: `1ays0h` }]]);
var fe = E(`mountain`, [
    [`path`, { d: `m8 3 4 8 5-5 5 15H2L8 3z`, key: `otkl63` }],
  ]);
var pe = E(`move`, [
    [`path`, { d: `M12 2v20`, key: `t6zp3m` }],
    [`path`, { d: `m15 19-3 3-3-3`, key: `11eu04` }],
    [`path`, { d: `m19 9 3 3-3 3`, key: `1mg7y2` }],
    [`path`, { d: `M2 12h20`, key: `9i4pu4` }],
    [`path`, { d: `m5 9-3 3 3 3`, key: `j64kie` }],
    [`path`, { d: `m9 5 3-3 3 3`, key: `l8vdw6` }],
  ]);
var me = E(`play`, [
    [
      `path`,
      {
        d: `M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z`,
        key: `10ikf1`,
      },
    ],
  ]);
var he = E(`plus`, [
    [`path`, { d: `M5 12h14`, key: `1ays0h` }],
    [`path`, { d: `M12 5v14`, key: `s699le` }],
  ]);
var ge = E(`rotate-ccw`, [
    [
      `path`,
      { d: `M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`, key: `1357e3` },
    ],
    [`path`, { d: `M3 3v5h5`, key: `1xhq8a` }],
  ]);
var _e = E(`route`, [
    [`circle`, { cx: `6`, cy: `19`, r: `3`, key: `1kj8tv` }],
    [
      `path`,
      {
        d: `M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15`,
        key: `1d8sl`,
      },
    ],
    [`circle`, { cx: `18`, cy: `5`, r: `3`, key: `gq8acd` }],
  ]);
var ve = E(`scroll-text`, [
    [`path`, { d: `M15 12h-5`, key: `r7krc0` }],
    [`path`, { d: `M15 8h-5`, key: `1khuty` }],
    [`path`, { d: `M19 17V5a2 2 0 0 0-2-2H4`, key: `zz82l3` }],
    [
      `path`,
      {
        d: `M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3`,
        key: `1ph1d7`,
      },
    ],
  ]);
var ye = E(`settings`, [
    [
      `path`,
      {
        d: `M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,
        key: `1i5ecw`,
      },
    ],
    [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
  ]);
var be = E(`shield`, [
    [
      `path`,
      {
        d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
        key: `oel41y`,
      },
    ],
  ]);
var xe = E(`ship`, [
    [`path`, { d: `M12 10.189V14`, key: `1p8cqu` }],
    [`path`, { d: `M12 2v3`, key: `qbqxhf` }],
    [`path`, { d: `M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6`, key: `qpkstq` }],
    [
      `path`,
      {
        d: `M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76`,
        key: `7tigtc`,
      },
    ],
    [
      `path`,
      {
        d: `M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1`,
        key: `1924j5`,
      },
    ],
  ]);
var Se = E(`shovel`, [
    [
      `path`,
      {
        d: `M21.56 4.56a1.5 1.5 0 0 1 0 2.122l-.47.47a3 3 0 0 1-4.212-.03 3 3 0 0 1 0-4.243l.44-.44a1.5 1.5 0 0 1 2.121 0z`,
        key: `1gcedi`,
      },
    ],
    [
      `path`,
      {
        d: `M3 22a1 1 0 0 1-1-1v-3.586a1 1 0 0 1 .293-.707l3.355-3.355a1.205 1.205 0 0 1 1.704 0l3.296 3.296a1.205 1.205 0 0 1 0 1.704l-3.355 3.355a1 1 0 0 1-.707.293z`,
        key: `pg9kv3`,
      },
    ],
    [`path`, { d: `m9 15 7.879-7.878`, key: `1o1zgh` }],
  ]);
var Ce = E(`skip-forward`, [
    [`path`, { d: `M21 4v16`, key: `7j8fe9` }],
    [
      `path`,
      {
        d: `M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z`,
        key: `zs4d6`,
      },
    ],
  ]);
var we = E(`swords`, [
    [`polyline`, { points: `14.5 17.5 3 6 3 3 6 3 17.5 14.5`, key: `1hfsw2` }],
    [`line`, { x1: `13`, x2: `19`, y1: `19`, y2: `13`, key: `1vrmhu` }],
    [`line`, { x1: `16`, x2: `20`, y1: `16`, y2: `20`, key: `1bron3` }],
    [`line`, { x1: `19`, x2: `21`, y1: `21`, y2: `19`, key: `13pww6` }],
    [`polyline`, { points: `14.5 6.5 18 3 21 3 21 6 17.5 9.5`, key: `hbey2j` }],
    [`line`, { x1: `5`, x2: `9`, y1: `14`, y2: `18`, key: `1hf58s` }],
    [`line`, { x1: `7`, x2: `4`, y1: `17`, y2: `20`, key: `pidxm4` }],
    [`line`, { x1: `3`, x2: `5`, y1: `19`, y2: `21`, key: `1pehsh` }],
  ]);
var Te = E(`trees`, [
    [
      `path`,
      {
        d: `M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z`,
        key: `1l6gj6`,
      },
    ],
    [`path`, { d: `M7 16v6`, key: `1a82de` }],
    [`path`, { d: `M13 19v3`, key: `13sx9i` }],
    [
      `path`,
      {
        d: `M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5`,
        key: `1sj9kv`,
      },
    ],
  ]);
var Ee = E(`trophy`, [
    [
      `path`,
      { d: `M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2`, key: `pwuv1l` },
    ],
    [
      `path`,
      { d: `M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2`, key: `1y54w1` },
    ],
    [
      `path`,
      {
        d: `M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3`,
        key: `e30mpu`,
      },
    ],
    [`path`, { d: `M4 22h16`, key: `57wxv0` }],
    [
      `path`,
      {
        d: `M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z`,
        key: `1mhfuq`,
      },
    ],
    [
      `path`,
      {
        d: `M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3`,
        key: `i0yafy`,
      },
    ],
  ]);
var De = E(`users`, [
    [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
    [`path`, { d: `M16 3.128a4 4 0 0 1 0 7.744`, key: `16gr8j` }],
    [`path`, { d: `M22 21v-2a4 4 0 0 0-3-3.87`, key: `kshegd` }],
    [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
  ]);
var Oe = E(`volume-2`, [
    [
      `path`,
      {
        d: `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,
        key: `uqj9uw`,
      },
    ],
    [`path`, { d: `M16 9a5 5 0 0 1 0 6`, key: `1q6k2b` }],
    [`path`, { d: `M19.364 18.364a9 9 0 0 0 0-12.728`, key: `ijwkga` }],
  ]);
var ke = E(`volume-x`, [
    [
      `path`,
      {
        d: `M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z`,
        key: `uqj9uw`,
      },
    ],
    [`line`, { x1: `22`, x2: `16`, y1: `9`, y2: `15`, key: `1ewh16` }],
    [`line`, { x1: `16`, x2: `22`, y1: `9`, y2: `15`, key: `5ykzw1` }],
  ]);
var Ae = E(`wheat`, [
    [`path`, { d: `M2 22 16 8`, key: `60hf96` }],
    [
      `path`,
      {
        d: `M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z`,
        key: `1rdhi6`,
      },
    ],
    [
      `path`,
      {
        d: `M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z`,
        key: `1sdzmb`,
      },
    ],
    [
      `path`,
      {
        d: `M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z`,
        key: `eoatbi`,
      },
    ],
    [
      `path`,
      { d: `M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z`, key: `19rau1` },
    ],
    [
      `path`,
      {
        d: `M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z`,
        key: `tc8ph9`,
      },
    ],
    [
      `path`,
      {
        d: `M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z`,
        key: `2m8kc5`,
      },
    ],
    [
      `path`,
      {
        d: `M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z`,
        key: `vex3ng`,
      },
    ],
  ]);
var je = E(`x`, [
    [`path`, { d: `M18 6 6 18`, key: `1bl5f8` }],
    [`path`, { d: `m6 6 12 12`, key: `d8bk6v` }],
  ]);
var Me = Object.defineProperty;
var Ne = (e, t) => Me(e, `name`, { value: t, configurable: !0 });
function Pe(e, t) {
  if (typeof e == `function`) return e(t);
  e != null && (e.current = t);
}
Ne(Pe, `setRef`);
function Fe(...e) {
  return (t) => {
    let n = !1,
      r = e.map((e) => {
        let r = Pe(e, t);
        return (!n && typeof r == `function` && (n = !0), r);
      });
    if (n)
      return () => {
        for (let t = 0; t < r.length; t++) {
          let n = r[t];
          typeof n == `function` ? n() : Pe(e[t], null);
        }
      };
  };
}
Ne(Fe, `composeRefs`);
function Ie(...e) {
  return C.useCallback(Fe(...e), e);
}
Ne(Ie, `useComposedRefs`);
var Le = Object.defineProperty;
var Re = (e, t) => Le(e, `name`, { value: t, configurable: !0 });
function ze(e) {
  let t = C.forwardRef((t, n) => {
    let { children: r, ...i } = t,
      a = null,
      o = !1,
      s = [];
    (qe(r) && typeof Ze == `function` && (r = Ze(r._payload)),
      C.Children.forEach(r, (e) => {
        if (Ge(e)) {
          o = !0;
          let t = e,
            n = `child` in t.props ? t.props.child : t.props.children;
          (qe(n) && typeof Ze == `function` && (n = Ze(n._payload)),
            (a = He(t, n)),
            s.push(a?.props?.children));
        } else s.push(e);
      }),
      a
        ? (a = C.cloneElement(a, void 0, s))
        : !o && C.Children.count(r) === 1 && C.isValidElement(r) && (a = r));
    let c = a ? We(a) : void 0,
      l = Ie(n, c);
    if (!a) {
      if (r || r === 0) throw Error(o ? Xe(e) : Ye(e));
      return r;
    }
    let u = Ue(i, a.props ?? {});
    return (a.type !== C.Fragment && (u.ref = n ? l : c), C.cloneElement(a, u));
  });
  return ((t.displayName = `${e}.Slot`), t);
}
Re(ze, `createSlot`);
var Be = Symbol.for(`radix.slottable`);
function Ve(e) {
  let t = Re(
    (e) => (`child` in e ? e.children(e.child) : e.children),
    `Slottable`,
  );
  return ((t.displayName = `${e}.Slottable`), (t.__radixId = Be), t);
}
Re(Ve, `createSlottable`);
var He = Re((e, t) => {
  if (`child` in e.props) {
    let t = e.props.child;
    return C.isValidElement(t)
      ? C.cloneElement(t, void 0, e.props.children(t.props.children))
      : null;
  }
  return C.isValidElement(t) ? t : null;
}, `getSlottableElementFromSlottable`);
function Ue(e, t) {
  let n = { ...t };
  for (let r in t) {
    let i = e[r],
      a = t[r];
    /^on[A-Z]/.test(r)
      ? i && a
        ? (n[r] = (...e) => {
            let t = a(...e);
            return (i(...e), t);
          })
        : i && (n[r] = i)
      : r === `style`
        ? (n[r] = { ...i, ...a })
        : r === `className` && (n[r] = [i, a].filter(Boolean).join(` `));
  }
  return { ...e, ...n };
}
Re(Ue, `mergeProps`);
function We(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, `ref`)?.get,
    n = t && `isReactWarning` in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, `ref`)?.get),
      (n = t && `isReactWarning` in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
Re(We, `getElementRef`);
function Ge(e) {
  return (
    C.isValidElement(e) &&
    typeof e.type == `function` &&
    `__radixId` in e.type &&
    e.type.__radixId === Be
  );
}
Re(Ge, `isSlottable`);
var Ke = Symbol.for(`react.lazy`);
function qe(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `$$typeof` in e &&
    e.$$typeof === Ke &&
    `_payload` in e &&
    Je(e._payload)
  );
}
Re(qe, `isLazyComponent`);
function Je(e) {
  return typeof e == `object` && !!e && `then` in e;
}
Re(Je, `isPromiseLike`);
var Ye = Re(
    (e) =>
      `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`,
    `createSlotError`,
  );
var Xe = Re(
    (e) =>
      `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,
    `createSlottableError`,
  );
var Ze = C.use;
var Qe = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.fragment`);
    function r(e, n, r) {
      var i = null;
      if (
        (r !== void 0 && (i = `` + r),
        n.key !== void 0 && (i = `` + n.key),
        `key` in n)
      )
        for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a]);
      else r = n;
      return (
        (n = r.ref),
        { $$typeof: t, type: e, key: i, ref: n === void 0 ? null : n, props: r }
      );
    }
    ((e.Fragment = n), (e.jsx = r), (e.jsxs = r));
  });
var $e = o((e, t) => {
    t.exports = Qe();
  });
var et = c(m(), 1);
var F = $e();
var tt = Object.defineProperty;
var nt = (e, t) => tt(e, `name`, { value: t, configurable: !0 });
var I = [
    `a`,
    `button`,
    `div`,
    `form`,
    `h2`,
    `h3`,
    `img`,
    `input`,
    `label`,
    `li`,
    `nav`,
    `ol`,
    `p`,
    `select`,
    `span`,
    `svg`,
    `ul`,
  ].reduce((e, t) => {
    let n = ze(`Primitive.${t}`),
      r = C.forwardRef((e, r) => {
        let { asChild: i, ...a } = e,
          o = i ? n : t;
        return (
          typeof window < `u` && (window[Symbol.for(`radix-ui`)] = !0),
          (0, F.jsx)(o, { ...a, ref: r })
        );
      });
    return ((r.displayName = `Primitive.${t}`), { ...e, [t]: r });
  }, {});
function rt(e, t) {
  e && et.flushSync(() => e.dispatchEvent(t));
}
nt(rt, `dispatchDiscreteCustomEvent`);
var it = Object.defineProperty;
var at = (e, t) => it(e, `name`, { value: t, configurable: !0 });
function L(e, t) {
  let n = C.createContext(t);
  n.displayName = e + `Context`;
  let r = at((e) => {
    let { children: t, ...r } = e,
      i = C.useMemo(() => r, Object.values(r));
    return (0, F.jsx)(n.Provider, { value: i, children: t });
  }, `Provider`);
  r.displayName = e + `Provider`;
  function i(r, i = {}) {
    let { optional: a = !1 } = i,
      o = C.useContext(n);
    if (o) return o;
    if (t !== void 0) return t;
    if (!a) throw Error(`\`${r}\` must be used within \`${e}\``);
  }
  return (at(i, `useContext`), [r, i]);
}
at(L, `createContext`);
function ot(e, t = []) {
  let n = [];
  function r(t, r) {
    let i = C.createContext(r);
    i.displayName = t + `Context`;
    let a = n.length;
    n = [...n, r];
    let o = at((t) => {
      let { scope: n, children: r, ...o } = t,
        s = n?.[e]?.[a] || i,
        c = C.useMemo(() => o, Object.values(o));
      return (0, F.jsx)(s.Provider, { value: c, children: r });
    }, `Provider`);
    o.displayName = t + `Provider`;
    function s(n, o, s = {}) {
      let { optional: c = !1 } = s,
        l = o?.[e]?.[a] || i,
        u = C.useContext(l);
      if (u) return u;
      if (r !== void 0) return r;
      if (!c) throw Error(`\`${n}\` must be used within \`${t}\``);
    }
    return (at(s, `useContext`), [o, s]);
  }
  at(r, `createContext`);
  let i = at(() => {
    let t = n.map((e) => C.createContext(e));
    return at(function (n) {
      let r = n?.[e] || t;
      return C.useMemo(() => ({ [`__scope${e}`]: { ...n, [e]: r } }), [n, r]);
    }, `useScope`);
  }, `createScope`);
  return ((i.scopeName = e), [r, R(i, ...t)]);
}
at(ot, `createContextScope`);
function R(...e) {
  let t = e[0];
  if (e.length === 1) return t;
  let n = at(() => {
    let n = e.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
    return at(function (e) {
      let r = n.reduce((t, { useScope: n, scopeName: r }) => {
        let i = n(e)[`__scope${r}`];
        return { ...t, ...i };
      }, {});
      return C.useMemo(() => ({ [`__scope${t.scopeName}`]: r }), [r]);
    }, `useComposedScopes`);
  }, `createScope`);
  return ((n.scopeName = t.scopeName), n);
}
at(R, `composeContextScopes`);
var st = Object.defineProperty;
var z = (e, t) => st(e, `name`, { value: t, configurable: !0 });
function ct(e) {
  let t = e + `CollectionProvider`,
    [n, r] = ot(t),
    [i, a] = n(t, { collectionRef: { current: null }, itemMap: new Map() }),
    o = z((e) => {
      let { scope: t, children: n } = e,
        r = C.useRef(null),
        a = C.useRef(new Map()).current;
      return (0, F.jsx)(i, {
        scope: t,
        itemMap: a,
        collectionRef: r,
        children: n,
      });
    }, `CollectionProvider`);
  o.displayName = t;
  let s = e + `CollectionSlot`,
    c = ze(s),
    l = C.forwardRef((e, t) => {
      let { scope: n, children: r } = e;
      return (0, F.jsx)(c, { ref: Ie(t, a(s, n).collectionRef), children: r });
    });
  l.displayName = s;
  let u = e + `CollectionItemSlot`,
    d = `data-radix-collection-item`,
    f = ze(u),
    p = C.forwardRef((e, t) => {
      let { scope: n, children: r, ...i } = e,
        o = C.useRef(null),
        s = Ie(t, o),
        c = a(u, n);
      return (
        C.useEffect(
          () => (
            c.itemMap.set(o, { ref: o, ...i }),
            () => void c.itemMap.delete(o)
          ),
        ),
        (0, F.jsx)(f, { [d]: ``, ref: s, children: r })
      );
    });
  p.displayName = u;
  function m(t) {
    let n = a(e + `CollectionConsumer`, t);
    return C.useCallback(() => {
      let e = n.collectionRef.current;
      if (!e) return [];
      let t = Array.from(e.querySelectorAll(`[${d}]`));
      return Array.from(n.itemMap.values()).sort(
        (e, n) => t.indexOf(e.ref.current) - t.indexOf(n.ref.current),
      );
    }, [n.collectionRef, n.itemMap]);
  }
  return (z(m, `useCollection`), [{ Provider: o, Slot: l, ItemSlot: p }, m, r]);
}
z(ct, `createCollection`);
var lt = new WeakMap();
var ut = class e extends Map {
    static {
      z(this, `OrderedDict`);
    }
    #e;
    constructor(e) {
      (super(e), (this.#e = [...super.keys()]), lt.set(this, !0));
    }
    set(e, t) {
      return (
        lt.get(this) &&
          (this.has(e) ? (this.#e[this.#e.indexOf(e)] = e) : this.#e.push(e)),
        super.set(e, t),
        this
      );
    }
    insert(e, t, n) {
      let r = this.has(t),
        i = this.#e.length,
        a = B(e),
        o = a >= 0 ? a : i + a,
        s = o < 0 || o >= i ? -1 : o;
      if (s === this.size || (r && s === this.size - 1) || s === -1)
        return (this.set(t, n), this);
      let c = this.size + +!r;
      a < 0 && o++;
      let l = [...this.#e],
        u,
        d = !1;
      for (let e = o; e < c; e++)
        if (o === e) {
          let i = l[e];
          (l[e] === t && (i = l[e + 1]),
            r && this.delete(t),
            (u = this.get(i)),
            this.set(t, n));
        } else {
          !d && l[e - 1] === t && (d = !0);
          let n = l[d ? e : e - 1],
            r = u;
          ((u = this.get(n)), this.delete(n), this.set(n, r));
        }
      return this;
    }
    with(t, n, r) {
      let i = new e(this);
      return (i.insert(t, n, r), i);
    }
    before(e) {
      let t = this.#e.indexOf(e) - 1;
      if (!(t < 0)) return this.entryAt(t);
    }
    setBefore(e, t, n) {
      let r = this.#e.indexOf(e);
      return r === -1 ? this : this.insert(r, t, n);
    }
    after(e) {
      let t = this.#e.indexOf(e);
      if (((t = t === -1 || t === this.size - 1 ? -1 : t + 1), t !== -1))
        return this.entryAt(t);
    }
    setAfter(e, t, n) {
      let r = this.#e.indexOf(e);
      return r === -1 ? this : this.insert(r + 1, t, n);
    }
    first() {
      return this.entryAt(0);
    }
    last() {
      return this.entryAt(-1);
    }
    clear() {
      return ((this.#e = []), super.clear());
    }
    delete(e) {
      let t = super.delete(e);
      return (t && this.#e.splice(this.#e.indexOf(e), 1), t);
    }
    deleteAt(e) {
      let t = this.keyAt(e);
      return t === void 0 ? !1 : this.delete(t);
    }
    at(e) {
      let t = dt(this.#e, e);
      if (t !== void 0) return this.get(t);
    }
    entryAt(e) {
      let t = dt(this.#e, e);
      if (t !== void 0) return [t, this.get(t)];
    }
    indexOf(e) {
      return this.#e.indexOf(e);
    }
    keyAt(e) {
      return dt(this.#e, e);
    }
    from(e, t) {
      let n = this.indexOf(e);
      if (n === -1) return;
      let r = n + t;
      return (
        r < 0 && (r = 0),
        r >= this.size && (r = this.size - 1),
        this.at(r)
      );
    }
    keyFrom(e, t) {
      let n = this.indexOf(e);
      if (n === -1) return;
      let r = n + t;
      return (
        r < 0 && (r = 0),
        r >= this.size && (r = this.size - 1),
        this.keyAt(r)
      );
    }
    find(e, t) {
      let n = 0;
      for (let r of this) {
        if (Reflect.apply(e, t, [r, n, this])) return r;
        n++;
      }
    }
    findIndex(e, t) {
      let n = 0;
      for (let r of this) {
        if (Reflect.apply(e, t, [r, n, this])) return n;
        n++;
      }
      return -1;
    }
    filter(t, n) {
      let r = [],
        i = 0;
      for (let e of this) (Reflect.apply(t, n, [e, i, this]) && r.push(e), i++);
      return new e(r);
    }
    map(t, n) {
      let r = [],
        i = 0;
      for (let e of this)
        (r.push([e[0], Reflect.apply(t, n, [e, i, this])]), i++);
      return new e(r);
    }
    reduce(...e) {
      let [t, n] = e,
        r = 0,
        i = n ?? this.at(0);
      for (let n of this)
        ((i =
          r === 0 && e.length === 1
            ? n
            : Reflect.apply(t, this, [i, n, r, this])),
          r++);
      return i;
    }
    reduceRight(...e) {
      let [t, n] = e,
        r = n ?? this.at(-1);
      for (let n = this.size - 1; n >= 0; n--) {
        let i = this.at(n);
        r =
          n === this.size - 1 && e.length === 1
            ? i
            : Reflect.apply(t, this, [r, i, n, this]);
      }
      return r;
    }
    toSorted(t) {
      return new e([...this.entries()].sort(t));
    }
    toReversed() {
      let t = new e();
      for (let e = this.size - 1; e >= 0; e--) {
        let n = this.keyAt(e),
          r = this.get(n);
        t.set(n, r);
      }
      return t;
    }
    toSpliced(...t) {
      let n = [...this.entries()];
      return (n.splice(...t), new e(n));
    }
    slice(t, n) {
      let r = new e(),
        i = this.size - 1;
      if (t === void 0) return r;
      (t < 0 && (t += this.size), n !== void 0 && n > 0 && (i = n - 1));
      for (let e = t; e <= i; e++) {
        let t = this.keyAt(e),
          n = this.get(t);
        r.set(t, n);
      }
      return r;
    }
    every(e, t) {
      let n = 0;
      for (let r of this) {
        if (!Reflect.apply(e, t, [r, n, this])) return !1;
        n++;
      }
      return !0;
    }
    some(e, t) {
      let n = 0;
      for (let r of this) {
        if (Reflect.apply(e, t, [r, n, this])) return !0;
        n++;
      }
      return !1;
    }
  };
function dt(e, t) {
  if (`at` in Array.prototype) return Array.prototype.at.call(e, t);
  let n = ft(e, t);
  return n === -1 ? void 0 : e[n];
}
z(dt, `at`);
function ft(e, t) {
  let n = e.length,
    r = B(t),
    i = r >= 0 ? r : n + r;
  return i < 0 || i >= n ? -1 : i;
}
z(ft, `toSafeIndex`);
function B(e) {
  return e !== e || e === 0 ? 0 : Math.trunc(e);
}
z(B, `toSafeInteger`);
function pt(e) {
  let t = e + `CollectionProvider`,
    [n, r] = ot(t),
    [i, a] = n(t, {
      collectionElement: null,
      collectionRef: { current: null },
      collectionRefObject: { current: null },
      itemMap: new ut(),
      setItemMap: z(() => void 0, `setItemMap`),
    }),
    o = z(
      ({ state: e, ...t }) =>
        e ? (0, F.jsx)(c, { ...t, state: e }) : (0, F.jsx)(s, { ...t }),
      `CollectionProvider`,
    );
  o.displayName = t;
  let s = z((e) => {
    let t = h();
    return (0, F.jsx)(c, { ...e, state: t });
  }, `CollectionInit`);
  s.displayName = t + `Init`;
  let c = z((e) => {
    let { scope: t, children: n, state: r } = e,
      a = C.useRef(null),
      [o, s] = C.useState(null),
      c = Ie(a, s),
      [l, u] = r;
    return (
      C.useEffect(() => {
        if (!o) return;
        let e = _t(() => {});
        return (
          e.observe(o, { childList: !0, subtree: !0 }),
          () => {
            e.disconnect();
          }
        );
      }, [o]),
      (0, F.jsx)(i, {
        scope: t,
        itemMap: l,
        setItemMap: u,
        collectionRef: c,
        collectionRefObject: a,
        collectionElement: o,
        children: n,
      })
    );
  }, `CollectionProviderImpl`);
  c.displayName = t + `Impl`;
  let l = e + `CollectionSlot`,
    u = ze(l),
    d = C.forwardRef((e, t) => {
      let { scope: n, children: r } = e;
      return (0, F.jsx)(u, { ref: Ie(t, a(l, n).collectionRef), children: r });
    });
  d.displayName = l;
  let f = e + `CollectionItemSlot`,
    p = ze(f),
    m = C.forwardRef((e, t) => {
      let { scope: n, children: r, ...i } = e,
        o = C.useRef(null),
        [s, c] = C.useState(null),
        l = Ie(t, o, c),
        { setItemMap: u } = a(f, n),
        d = C.useRef(i);
      mt(d.current, i) || (d.current = i);
      let m = d.current;
      return (
        C.useEffect(() => {
          let e = m;
          return (
            u((t) =>
              s
                ? t.has(s)
                  ? t.set(s, { ...e, element: s }).toSorted(gt)
                  : (t.set(s, { ...e, element: s }), t.toSorted(gt))
                : t,
            ),
            () => {
              u((e) => (!s || !e.has(s) ? e : (e.delete(s), new ut(e))));
            }
          );
        }, [s, m, u]),
        (0, F.jsx)(p, { "data-radix-collection-item": ``, ref: l, children: r })
      );
    });
  m.displayName = f;
  function h() {
    return C.useState(new ut());
  }
  z(h, `useInitCollection`);
  function g(t) {
    let { itemMap: n } = a(e + `CollectionConsumer`, t);
    return n;
  }
  return (
    z(g, `useCollection`),
    [
      { Provider: o, Slot: d, ItemSlot: m },
      { createCollectionScope: r, useCollection: g, useInitCollection: h },
    ]
  );
}
z(pt, `createCollection`);
function mt(e, t) {
  if (e === t) return !0;
  if (typeof e != `object` || typeof t != `object` || e == null || t == null)
    return !1;
  let n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (let r of n)
    if (!Object.prototype.hasOwnProperty.call(t, r) || e[r] !== t[r]) return !1;
  return !0;
}
z(mt, `shallowEqual`);
function ht(e, t) {
  return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING);
}
z(ht, `isElementPreceding`);
function gt(e, t) {
  return !e[1].element || !t[1].element
    ? 0
    : ht(e[1].element, t[1].element)
      ? -1
      : 1;
}
z(gt, `sortByDocumentPosition`);
function _t(e) {
  return new MutationObserver((t) => {
    for (let n of t)
      if (n.type === `childList`) {
        e();
        return;
      }
  });
}
z(_t, `getChildListObserver`);
var vt = Object.defineProperty;
var yt = (e, t) => vt(e, `name`, { value: t, configurable: !0 });
var bt = !!(
    typeof window < `u` &&
    window.document &&
    window.document.createElement
  );
function xt(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return yt(function (r) {
    if ((e?.(r), n === !1 || !r || !r.defaultPrevented)) return t?.(r);
  }, `handleEvent`);
}
yt(xt, `composeEventHandlers`);
function St(e) {
  if (!bt) throw Error(`Cannot access window outside of the DOM`);
  return e?.ownerDocument?.defaultView ?? window;
}
yt(St, `getOwnerWindow`);
function Ct(e) {
  if (!bt) throw Error(`Cannot access document outside of the DOM`);
  return e?.ownerDocument ?? document;
}
yt(Ct, `getOwnerDocument`);
function wt(e, t = !1) {
  let { activeElement: n } = Ct(e);
  if (!n?.nodeName) return null;
  if (Tt(n) && n.contentDocument) return wt(n.contentDocument.body, t);
  if (t) {
    let e = n.getAttribute(`aria-activedescendant`);
    if (e) {
      let t = Ct(n).getElementById(e);
      if (t) return t;
    }
  }
  return n;
}
yt(wt, `getActiveElement`);
function Tt(e) {
  return e.tagName === `IFRAME`;
}
yt(Tt, `isFrame`);
var Et = globalThis?.document ? C.useLayoutEffect : () => {};
var Dt = Object.defineProperty;
var Ot = (e, t) => Dt(e, `name`, { value: t, configurable: !0 });
var kt = C.useEffectEvent;
var At = C.useInsertionEffect;
function jt(e) {
  if (typeof kt == `function`) return kt(e);
  let t = C.useRef(() => {
    throw Error(`Cannot call an event handler while rendering.`);
  });
  return (
    typeof At == `function`
      ? At(() => {
          t.current = e;
        })
      : Et(() => {
          t.current = e;
        }),
    C.useMemo(
      () =>
        (...e) =>
          t.current?.(...e),
      [],
    )
  );
}
Ot(jt, `useEffectEvent`);
var Mt = Object.defineProperty;
var Nt = (e, t) => Mt(e, `name`, { value: t, configurable: !0 });
var Pt = C.useInsertionEffect || Et;
function Ft({
  prop: e,
  defaultProp: t,
  onChange: n = Nt(() => {}, `onChange`),
  caller: r,
}) {
  let [i, a, o] = It({ defaultProp: t, onChange: n }),
    s = e !== void 0;
  return [
    s ? e : i,
    C.useCallback(
      (t) => {
        if (s) {
          let n = Lt(t) ? t(e) : t;
          n !== e && o.current?.(n);
        } else a(t);
      },
      [s, e, a, o],
    ),
  ];
}
Nt(Ft, `useControllableState`);
function It({ defaultProp: e, onChange: t }) {
  let [n, r] = C.useState(e),
    i = C.useRef(n),
    a = C.useRef(t);
  return (
    Pt(() => {
      a.current = t;
    }, [t]),
    C.useEffect(() => {
      i.current !== n && (a.current?.(n), (i.current = n));
    }, [n, i]),
    [n, r, a]
  );
}
Nt(It, `useUncontrolledState`);
function Lt(e) {
  return typeof e == `function`;
}
Nt(Lt, `isFunction`);
var Rt = Symbol(`RADIX:SYNC_STATE`);
function zt(e, t, n, r) {
  let { prop: i, defaultProp: a, onChange: o, caller: s } = t,
    c = i !== void 0,
    l = jt(o),
    u = [{ ...n, state: a }];
  r && u.push(r);
  let [d, f] = C.useReducer(
      (t, n) => {
        if (n.type === Rt) return { ...t, state: n.state };
        let r = e(t, n);
        return (c && !Object.is(r.state, t.state) && l(r.state), r);
      },
      ...u,
    ),
    p = d.state,
    m = C.useRef(p);
  C.useEffect(() => {
    m.current !== p && ((m.current = p), c || l(p));
  }, [p, m, c]);
  let h = C.useMemo(() => (i === void 0 ? d : { ...d, state: i }), [d, i]);
  return (
    C.useEffect(() => {
      c && !Object.is(i, d.state) && f({ type: Rt, state: i });
    }, [i, d.state, c]),
    [h, f]
  );
}
Nt(zt, `useControllableStateReducer`);
var Bt = Object.defineProperty;
var Vt = (e, t) => Bt(e, `name`, { value: t, configurable: !0 });
function Ht(e, t) {
  return C.useReducer((e, n) => t[e][n] ?? e, e);
}
Vt(Ht, `useStateMachine`);
var Ut = Vt((e) => {
  let { present: t, children: n } = e,
    r = Wt(t),
    i =
      typeof n == `function` ? n({ present: r.isPresent }) : C.Children.only(n),
    a = Kt(r.ref, V(i));
  return typeof n == `function` || r.isPresent
    ? C.cloneElement(i, { ref: a })
    : null;
}, `Presence`);
function Wt(e) {
  let [t, n] = C.useState(),
    r = C.useRef(null),
    i = C.useRef(e),
    a = C.useRef(`none`),
    o = C.useRef(void 0),
    [s, c] = Ht(e ? `mounted` : `unmounted`, {
      mounted: { UNMOUNT: `unmounted`, ANIMATION_OUT: `unmountSuspended` },
      unmountSuspended: { MOUNT: `mounted`, ANIMATION_END: `unmounted` },
      unmounted: { MOUNT: `mounted` },
    });
  return (
    C.useEffect(() => {
      s === `mounted`
        ? ((a.current = o.current ?? qt(r.current)), (o.current = void 0))
        : (a.current = `none`);
    }, [s]),
    Et(() => {
      let t = r.current,
        n = i.current;
      if (n !== e) {
        let r = a.current,
          s = qt(t);
        (e
          ? ((o.current = s), c(`MOUNT`))
          : s === `none` || t?.display === `none`
            ? c(`UNMOUNT`)
            : c(n && r !== s ? `ANIMATION_OUT` : `UNMOUNT`),
          (i.current = e));
      }
    }, [e, c]),
    Et(() => {
      if (t) {
        let e,
          n = t.ownerDocument.defaultView ?? window,
          o = Vt((a) => {
            let o = qt(r.current).includes(CSS.escape(a.animationName));
            if (a.target === t && o && (c(`ANIMATION_END`), !i.current)) {
              let r = t.style.animationFillMode;
              ((t.style.animationFillMode = `forwards`),
                (e = n.setTimeout(() => {
                  t.style.animationFillMode === `forwards` &&
                    (t.style.animationFillMode = r);
                })));
            }
          }, `handleAnimationEnd`),
          s = Vt((e) => {
            e.target === t && (a.current = qt(r.current));
          }, `handleAnimationStart`);
        return (
          t.addEventListener(`animationstart`, s),
          t.addEventListener(`animationcancel`, o),
          t.addEventListener(`animationend`, o),
          () => {
            (n.clearTimeout(e),
              t.removeEventListener(`animationstart`, s),
              t.removeEventListener(`animationcancel`, o),
              t.removeEventListener(`animationend`, o));
          }
        );
      } else c(`ANIMATION_END`);
    }, [t, c]),
    {
      isPresent: [`mounted`, `unmountSuspended`].includes(s),
      ref: C.useCallback((e) => {
        if (e) {
          let t = getComputedStyle(e);
          ((r.current = t), (o.current = qt(t)));
        } else r.current = null;
        n(e);
      }, []),
    }
  );
}
Vt(Wt, `usePresence`);
function Gt(e, t) {
  if (typeof e == `function`) return e(t);
  e != null && (e.current = t);
}
Vt(Gt, `setRef`);
function Kt(...e) {
  let t = C.useRef(e);
  return (
    (t.current = e),
    C.useCallback((e) => {
      let n = t.current,
        r = !1,
        i = n.map((t) => {
          let n = Gt(t, e);
          return (!r && typeof n == `function` && (r = !0), n);
        });
      if (r)
        return () => {
          for (let e = 0; e < i.length; e++) {
            let t = i[e];
            typeof t == `function` ? t() : Gt(n[e], null);
          }
        };
    }, [])
  );
}
Vt(Kt, `useStableComposedRefs`);
function qt(e) {
  return e?.animationName || `none`;
}
Vt(qt, `getAnimationName`);
function V(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, `ref`)?.get,
    n = t && `isReactWarning` in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, `ref`)?.get),
      (n = t && `isReactWarning` in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
Vt(V, `getElementRef`);
var Jt = Object.defineProperty;
var Yt = (e, t) => Jt(e, `name`, { value: t, configurable: !0 });
var H = C.useId || (() => void 0);
var Xt = 0;
function Zt(e) {
  let [t, n] = C.useState(H());
  return (
    Et(() => {
      e || n((e) => e ?? String(Xt++));
    }, [e]),
    e || (t ? `radix-${t}` : ``)
  );
}
Yt(Zt, `useId`);
var Qt = Object.defineProperty;
var $t = (e, t) => Qt(e, `name`, { value: t, configurable: !0 });
var en = C.createContext(void 0);
function tn(e) {
  let t = C.useContext(en);
  return e || t || `ltr`;
}
$t(tn, `useDirection`);
var nn = Object.defineProperty;
var rn = (e, t) => nn(e, `name`, { value: t, configurable: !0 });
function an(e) {
  let t = C.useRef(e);
  return (
    C.useEffect(() => {
      t.current = e;
    }),
    C.useMemo(
      () =>
        (...e) =>
          t.current?.(...e),
      [],
    )
  );
}
rn(an, `useCallbackRef`);
var on = Object.defineProperty;
var sn = (e, t) => on(e, `name`, { value: t, configurable: !0 });
var cn = `dismissableLayer.update`;
var ln = `dismissableLayer.pointerDownOutside`;
var un = `dismissableLayer.focusOutside`;
var dn;
var fn = C.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
    dismissableSurfaces: new Set(),
  });
var pn = C.forwardRef(
    sn(function (e, t) {
      let {
          disableOutsidePointerEvents: n = !1,
          deferPointerDownOutside: r = !1,
          onEscapeKeyDown: i,
          onPointerDownOutside: a,
          onFocusOutside: o,
          onInteractOutside: s,
          onDismiss: c,
          ...l
        } = e,
        u = C.useContext(fn),
        [d, f] = C.useState(null),
        p = d?.ownerDocument ?? globalThis?.document,
        [, m] = C.useState({}),
        h = Ie(t, f),
        g = Array.from(u.layers),
        [_] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1),
        v = _ ? g.indexOf(_) : -1,
        y = d ? g.indexOf(d) : -1,
        b = u.layersWithOutsidePointerEventsDisabled.size > 0,
        x = y >= v,
        S = C.useRef(!1),
        w = gn(
          (e) => {
            (a?.(e), s?.(e), e.defaultPrevented || c?.());
          },
          {
            ownerDocument: p,
            deferPointerDownOutside: r,
            isDeferredPointerDownOutsideRef: S,
            dismissableSurfaces: u.dismissableSurfaces,
            shouldHandlePointerDownOutside: C.useCallback(
              (e) => {
                if (!(e instanceof Node)) return !1;
                let t = [...u.branches].some((t) => t.contains(e));
                return x && !t;
              },
              [u.branches, x],
            ),
          },
        ),
        T = _n((e) => {
          if (r && S.current) return;
          let t = e.target;
          [...u.branches].some((e) => e.contains(t)) ||
            (o?.(e), s?.(e), e.defaultPrevented || c?.());
        }, p),
        ee = d ? y === g.length - 1 : !1,
        E = an((e) => {
          e.key === `Escape` &&
            (i?.(e), !e.defaultPrevented && c && (e.preventDefault(), c()));
        });
      return (
        C.useEffect(() => {
          if (ee)
            return (
              p.addEventListener(`keydown`, E, { capture: !0 }),
              () => p.removeEventListener(`keydown`, E, { capture: !0 })
            );
        }, [p, ee, E]),
        C.useEffect(() => {
          if (d)
            return (
              n &&
                (u.layersWithOutsidePointerEventsDisabled.size === 0 &&
                  ((dn = p.body.style.pointerEvents),
                  (p.body.style.pointerEvents = `none`)),
                u.layersWithOutsidePointerEventsDisabled.add(d)),
              u.layers.add(d),
              vn(),
              () => {
                n &&
                  (u.layersWithOutsidePointerEventsDisabled.delete(d),
                  u.layersWithOutsidePointerEventsDisabled.size === 0 &&
                    (p.body.style.pointerEvents = dn));
              }
            );
        }, [d, p, n, u]),
        C.useEffect(
          () => () => {
            d &&
              (u.layers.delete(d),
              u.layersWithOutsidePointerEventsDisabled.delete(d),
              vn());
          },
          [d, u],
        ),
        C.useEffect(() => {
          let e = sn(() => m({}), `handleUpdate`);
          return (
            document.addEventListener(cn, e),
            () => document.removeEventListener(cn, e)
          );
        }, []),
        (0, F.jsx)(I.div, {
          ...l,
          ref: h,
          style: {
            pointerEvents: b ? (x ? `auto` : `none`) : void 0,
            ...e.style,
          },
          onFocusCapture: xt(e.onFocusCapture, T.onFocusCapture),
          onBlurCapture: xt(e.onBlurCapture, T.onBlurCapture),
          onPointerDownCapture: xt(
            e.onPointerDownCapture,
            w.onPointerDownCapture,
          ),
        })
      );
    }, `DismissableLayer`),
  );
function mn() {
  let e = C.useContext(fn),
    [t, n] = C.useState(null);
  return (
    C.useEffect(() => {
      if (t)
        return (
          e.dismissableSurfaces.add(t),
          () => {
            e.dismissableSurfaces.delete(t);
          }
        );
    }, [t, e.dismissableSurfaces]),
    n
  );
}
sn(mn, `useDismissableLayerSurface`);
var hn = sn(() => !0, `IS_TRUE`);
function gn(e, t) {
  let {
      ownerDocument: n = globalThis?.document,
      deferPointerDownOutside: r = !1,
      isDeferredPointerDownOutsideRef: i,
      dismissableSurfaces: a,
      shouldHandlePointerDownOutside: o = hn,
    } = t,
    s = an(e),
    c = C.useRef(!1),
    l = C.useRef(!1),
    u = C.useRef(new Map()),
    d = C.useRef(() => {});
  return (
    C.useEffect(() => {
      function e() {
        ((l.current = !1), (i.current = !1), u.current.clear());
      }
      sn(e, `resetOutsideInteraction`);
      function t() {
        return Array.from(u.current.values()).some(Boolean);
      }
      sn(t, `isOutsideInteractionIntercepted`);
      function f(e) {
        if (!l.current) return;
        let t = e.target;
        ((t instanceof Node && [...a].some((e) => e.contains(t))) ||
          u.current.set(e.type, !0),
          e.type === `click` &&
            window.setTimeout(() => {
              l.current && d.current();
            }, 0));
      }
      sn(f, `handleInteractionCapture`);
      function p(e) {
        l.current && u.current.set(e.type, !1);
      }
      sn(p, `handleInteractionBubble`);
      let m = sn((a) => {
          if (a.target && !c.current) {
            let f = function () {
              n.removeEventListener(`click`, d.current);
              let r = t();
              (e(), r || yn(ln, s, p, { discrete: !0 }));
            };
            if (
              (sn(f, `handleAndDispatchPointerDownOutsideEvent`), !o(a.target))
            ) {
              (n.removeEventListener(`click`, d.current),
                e(),
                (c.current = !1));
              return;
            }
            let p = { originalEvent: a };
            ((l.current = !0),
              (i.current = r && a.button === 0),
              u.current.clear(),
              !r || a.button !== 0
                ? f()
                : (n.removeEventListener(`click`, d.current),
                  (d.current = f),
                  n.addEventListener(`click`, d.current, { once: !0 })));
          } else (n.removeEventListener(`click`, d.current), e());
          c.current = !1;
        }, `handlePointerDown`),
        h = [
          `pointerup`,
          `mousedown`,
          `mouseup`,
          `touchstart`,
          `touchend`,
          `click`,
        ];
      for (let e of h) (n.addEventListener(e, f, !0), n.addEventListener(e, p));
      let g = window.setTimeout(() => {
        n.addEventListener(`pointerdown`, m);
      }, 0);
      return () => {
        (window.clearTimeout(g),
          n.removeEventListener(`pointerdown`, m),
          n.removeEventListener(`click`, d.current));
        for (let e of h)
          (n.removeEventListener(e, f, !0), n.removeEventListener(e, p));
      };
    }, [n, s, r, i, a, o]),
    { onPointerDownCapture: sn(() => (c.current = !0), `onPointerDownCapture`) }
  );
}
sn(gn, `usePointerDownOutside`);
function _n(e, t = globalThis?.document) {
  let n = an(e),
    r = C.useRef(!1);
  return (
    C.useEffect(() => {
      let e = sn((e) => {
        e.target &&
          !r.current &&
          yn(un, n, { originalEvent: e }, { discrete: !1 });
      }, `handleFocus`);
      return (
        t.addEventListener(`focusin`, e),
        () => t.removeEventListener(`focusin`, e)
      );
    }, [t, n]),
    {
      onFocusCapture: sn(() => (r.current = !0), `onFocusCapture`),
      onBlurCapture: sn(() => (r.current = !1), `onBlurCapture`),
    }
  );
}
sn(_n, `useFocusOutside`);
function vn() {
  let e = new CustomEvent(cn);
  document.dispatchEvent(e);
}
sn(vn, `dispatchUpdate`);
function yn(e, t, n, { discrete: r }) {
  let i = n.originalEvent.target,
    a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  (t && i.addEventListener(e, t, { once: !0 }),
    r ? rt(i, a) : i.dispatchEvent(a));
}
sn(yn, `handleAndDispatchCustomEvent`);
var bn = Object.defineProperty;
var xn = (e, t) => bn(e, `name`, { value: t, configurable: !0 });
var Sn = `focusScope.autoFocusOnMount`;
var Cn = `focusScope.autoFocusOnUnmount`;
var wn = { bubbles: !1, cancelable: !0 };
var Tn = C.forwardRef(
    xn(function (e, t) {
      let {
          loop: n = !1,
          trapped: r = !1,
          onMountAutoFocus: i,
          onUnmountAutoFocus: a,
          ...o
        } = e,
        [s, c] = C.useState(null),
        l = an(i),
        u = an(a),
        d = C.useRef(null),
        f = Ie(t, c),
        p = C.useRef({
          paused: !1,
          pause() {
            this.paused = !0;
          },
          resume() {
            this.paused = !1;
          },
        }).current;
      (C.useEffect(() => {
        if (r) {
          let e = function (e) {
              if (p.paused || !s) return;
              let t = e.target;
              s.contains(t) ? (d.current = t) : Mn(d.current, { select: !0 });
            },
            t = function (e) {
              if (p.paused || !s) return;
              let t = e.relatedTarget;
              t !== null && (s.contains(t) || Mn(d.current, { select: !0 }));
            },
            n = function (e) {
              if (document.activeElement === document.body)
                for (let t of e) t.removedNodes.length > 0 && Mn(s);
            };
          (xn(e, `handleFocusIn`),
            xn(t, `handleFocusOut`),
            xn(n, `handleMutations`),
            document.addEventListener(`focusin`, e),
            document.addEventListener(`focusout`, t));
          let r = new MutationObserver(n);
          return (
            s && r.observe(s, { childList: !0, subtree: !0 }),
            () => {
              (document.removeEventListener(`focusin`, e),
                document.removeEventListener(`focusout`, t),
                r.disconnect());
            }
          );
        }
      }, [r, s, p.paused]),
        C.useEffect(() => {
          if (s) {
            Nn.add(p);
            let e = document.activeElement;
            if (!s.contains(e)) {
              let t = new CustomEvent(Sn, wn);
              (s.addEventListener(Sn, l),
                s.dispatchEvent(t),
                t.defaultPrevented ||
                  (En(In(On(s)), { select: !0 }),
                  document.activeElement === e && Mn(s)));
            }
            return () => {
              (s.removeEventListener(Sn, l),
                setTimeout(() => {
                  let t = new CustomEvent(Cn, wn);
                  (s.addEventListener(Cn, u),
                    s.dispatchEvent(t),
                    t.defaultPrevented ||
                      Mn(e ?? document.body, { select: !0 }),
                    s.removeEventListener(Cn, u),
                    Nn.remove(p));
                }, 0));
            };
          }
        }, [s, l, u, p]));
      let m = C.useCallback(
        (e) => {
          if ((!n && !r) || p.paused) return;
          let t = e.key === `Tab` && !e.altKey && !e.ctrlKey && !e.metaKey,
            i = document.activeElement;
          if (t && i) {
            let t = e.currentTarget,
              [r, a] = Dn(t);
            r && a
              ? !e.shiftKey && i === a
                ? (e.preventDefault(), n && Mn(r, { select: !0 }))
                : e.shiftKey &&
                  i === r &&
                  (e.preventDefault(), n && Mn(a, { select: !0 }))
              : i === t && e.preventDefault();
          }
        },
        [n, r, p.paused],
      );
      return (0, F.jsx)(I.div, { tabIndex: -1, ...o, ref: f, onKeyDown: m });
    }, `FocusScope`),
  );
function En(e, { select: t = !1 } = {}) {
  let n = document.activeElement;
  for (let r of e)
    if ((Mn(r, { select: t }), document.activeElement !== n)) return;
}
xn(En, `focusFirst`);
function Dn(e) {
  let t = On(e);
  return [kn(t, e), kn(t.reverse(), e)];
}
xn(Dn, `getTabbableEdges`);
function On(e) {
  let t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: xn((e) => {
        let t = e.tagName === `INPUT` && e.type === `hidden`;
        return e.disabled || e.hidden || t
          ? NodeFilter.FILTER_SKIP
          : e.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      }, `acceptNode`),
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
xn(On, `getTabbableCandidates`);
function kn(e, t) {
  let n =
    typeof t.checkVisibility == `function` &&
    t.checkVisibility({ checkVisibilityCSS: !0 });
  for (let r of e)
    if (
      !(n ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : An(r, { upTo: t }))
    )
      return r;
}
xn(kn, `findVisible`);
function An(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === `hidden`) return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === `none`) return !0;
    e = e.parentElement;
  }
  return !1;
}
xn(An, `isHidden`);
function jn(e) {
  return e instanceof HTMLInputElement && `select` in e;
}
xn(jn, `isSelectableInput`);
function Mn(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    let n = document.activeElement;
    (e.focus({ preventScroll: !0 }), e !== n && jn(e) && t && e.select());
  }
}
xn(Mn, `focus`);
var Nn = Pn();
function Pn() {
  let e = [];
  return {
    add(t) {
      let n = e[0];
      (t !== n && n?.pause(), (e = Fn(e, t)), e.unshift(t));
    },
    remove(t) {
      ((e = Fn(e, t)), e[0]?.resume());
    },
  };
}
xn(Pn, `createFocusScopesStack`);
function Fn(e, t) {
  let n = [...e],
    r = n.indexOf(t);
  return (r !== -1 && n.splice(r, 1), n);
}
xn(Fn, `arrayRemove`);
function In(e) {
  return e.filter((e) => e.tagName !== `A`);
}
xn(In, `removeLinks`);
var Ln = Object.defineProperty;
var Rn = C.forwardRef(
    ((e, t) => Ln(e, `name`, { value: t, configurable: !0 }))(function (e, t) {
      let { container: n, ...r } = e,
        [i, a] = C.useState(!1);
      Et(() => a(!0), []);
      let o = n || (i && globalThis?.document?.body);
      return o ? et.createPortal((0, F.jsx)(I.div, { ...r, ref: t }), o) : null;
    }, `Portal`),
  );
var zn = Object.defineProperty;
var Bn = (e, t) => zn(e, `name`, { value: t, configurable: !0 });
var Vn = 0;
var Hn = null;
function Un(e) {
  return (Wn(), e.children);
}
Bn(Un, `FocusGuards`);
function Wn() {
  C.useEffect(() => {
    Hn ||= { start: Gn(), end: Gn() };
    let { start: e, end: t } = Hn;
    return (
      document.body.firstElementChild !== e &&
        document.body.insertAdjacentElement(`afterbegin`, e),
      document.body.lastElementChild !== t &&
        document.body.insertAdjacentElement(`beforeend`, t),
      Vn++,
      () => {
        (Vn === 1 && (Hn?.start.remove(), Hn?.end.remove(), (Hn = null)),
          (Vn = Math.max(0, Vn - 1)));
      }
    );
  }, []);
}
Bn(Wn, `useFocusGuards`);
function Gn() {
  let e = document.createElement(`span`);
  return (
    e.setAttribute(`data-radix-focus-guard`, ``),
    (e.tabIndex = 0),
    (e.style.outline = `none`),
    (e.style.opacity = `0`),
    (e.style.position = `fixed`),
    (e.style.pointerEvents = `none`),
    e
  );
}
Bn(Gn, `createFocusGuard`);
var Kn = function () {
  return (
    (Kn =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++)
          for (var i in ((t = arguments[n]), t))
            Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }),
    Kn.apply(this, arguments)
  );
};
function qn(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == `function`)
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
        (n[r[i]] = e[r[i]]);
  return n;
}
function Jn(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, i = t.length, a; r < i; r++)
      (a || !(r in t)) &&
        ((a ||= Array.prototype.slice.call(t, 0, r)), (a[r] = t[r]));
  return e.concat(a || Array.prototype.slice.call(t));
}
var Yn = `right-scroll-bar-position`;
var Xn = `width-before-scroll-bar`;
var Zn = `with-scroll-bars-hidden`;
var Qn = `--removed-body-scroll-bar-size`;
function $n(e, t) {
  return (typeof e == `function` ? e(t) : e && (e.current = t), e);
}
function er(e, t) {
  var n = (0, C.useState)(function () {
    return {
      value: e,
      callback: t,
      facade: {
        get current() {
          return n.value;
        },
        set current(e) {
          var t = n.value;
          t !== e && ((n.value = e), n.callback(e, t));
        },
      },
    };
  })[0];
  return ((n.callback = t), n.facade);
}
var tr = typeof window < `u` ? C.useLayoutEffect : C.useEffect;
var nr = new WeakMap();
function rr(e, t) {
  var n = er(t || null, function (t) {
    return e.forEach(function (e) {
      return $n(e, t);
    });
  });
  return (
    tr(
      function () {
        var t = nr.get(n);
        if (t) {
          var r = new Set(t),
            i = new Set(e),
            a = n.current;
          (r.forEach(function (e) {
            i.has(e) || $n(e, null);
          }),
            i.forEach(function (e) {
              r.has(e) || $n(e, a);
            }));
        }
        nr.set(n, e);
      },
      [e],
    ),
    n
  );
}
function ir(e) {
  return e;
}
function ar(e, t) {
  t === void 0 && (t = ir);
  var n = [],
    r = !1;
  return {
    read: function () {
      if (r)
        throw Error(
          "Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.",
        );
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function (e) {
      var i = t(e, r);
      return (
        n.push(i),
        function () {
          n = n.filter(function (e) {
            return e !== i;
          });
        }
      );
    },
    assignSyncMedium: function (e) {
      for (r = !0; n.length; ) {
        var t = n;
        ((n = []), t.forEach(e));
      }
      n = {
        push: function (t) {
          return e(t);
        },
        filter: function () {
          return n;
        },
      };
    },
    assignMedium: function (e) {
      r = !0;
      var t = [];
      if (n.length) {
        var i = n;
        ((n = []), i.forEach(e), (t = n));
      }
      var a = function () {
          var n = t;
          ((t = []), n.forEach(e));
        },
        o = function () {
          return Promise.resolve().then(a);
        };
      (o(),
        (n = {
          push: function (e) {
            (t.push(e), o());
          },
          filter: function (e) {
            return ((t = t.filter(e)), n);
          },
        }));
    },
  };
}
function or(e) {
  e === void 0 && (e = {});
  var t = ar(null);
  return ((t.options = Kn({ async: !0, ssr: !1 }, e)), t);
}
var sr = function (e) {
  var t = e.sideCar,
    n = qn(e, [`sideCar`]);
  if (!t)
    throw Error(
      "Sidecar: please provide `sideCar` property to import the right car",
    );
  var r = t.read();
  if (!r) throw Error(`Sidecar medium not found`);
  return C.createElement(r, Kn({}, n));
};
sr.isSideCarExport = !0;
function cr(e, t) {
  return (e.useMedium(t), sr);
}
var lr = or();
var ur = function () {};
var dr = C.forwardRef(function (e, t) {
    var n = C.useRef(null),
      r = C.useState({
        onScrollCapture: ur,
        onWheelCapture: ur,
        onTouchMoveCapture: ur,
      }),
      i = r[0],
      a = r[1],
      o = e.forwardProps,
      s = e.children,
      c = e.className,
      l = e.removeScrollBar,
      u = e.enabled,
      d = e.shards,
      f = e.sideCar,
      p = e.noRelative,
      m = e.noIsolation,
      h = e.inert,
      g = e.allowPinchZoom,
      _ = e.as,
      v = _ === void 0 ? `div` : _,
      y = e.gapMode,
      b = qn(e, [
        `forwardProps`,
        `children`,
        `className`,
        `removeScrollBar`,
        `enabled`,
        `shards`,
        `sideCar`,
        `noRelative`,
        `noIsolation`,
        `inert`,
        `allowPinchZoom`,
        `as`,
        `gapMode`,
      ]),
      x = f,
      S = rr([n, t]),
      w = Kn(Kn({}, b), i);
    return C.createElement(
      C.Fragment,
      null,
      u &&
        C.createElement(x, {
          sideCar: lr,
          removeScrollBar: l,
          shards: d,
          noRelative: p,
          noIsolation: m,
          inert: h,
          setCallbacks: a,
          allowPinchZoom: !!g,
          lockRef: n,
          gapMode: y,
        }),
      o
        ? C.cloneElement(C.Children.only(s), Kn(Kn({}, w), { ref: S }))
        : C.createElement(v, Kn({}, w, { className: c, ref: S }), s),
    );
  });
((dr.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 }),
  (dr.classNames = { fullWidth: Xn, zeroRight: Yn }));
var fr;
var pr = function () {
    if (fr) return fr;
    if (typeof __webpack_nonce__ < `u`) return __webpack_nonce__;
  };
function mr() {
  if (!document) return null;
  var e = document.createElement(`style`);
  e.type = `text/css`;
  var t = pr();
  return (t && e.setAttribute(`nonce`, t), e);
}
function hr(e, t) {
  e.styleSheet
    ? (e.styleSheet.cssText = t)
    : e.appendChild(document.createTextNode(t));
}
function gr(e) {
  (document.head || document.getElementsByTagName(`head`)[0]).appendChild(e);
}
var _r = function () {
    var e = 0,
      t = null;
    return {
      add: function (n) {
        (e == 0 && (t = mr()) && (hr(t, n), gr(t)), e++);
      },
      remove: function () {
        (e--,
          !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null)));
      },
    };
  };
var vr = function () {
    var e = _r();
    return function (t, n) {
      C.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove();
            }
          );
        },
        [t && n],
      );
    };
  };
var yr = function () {
    var e = vr();
    return function (t) {
      var n = t.styles,
        r = t.dynamic;
      return (e(n, r), null);
    };
  };
var br = { left: 0, top: 0, right: 0, gap: 0 };
var xr = function (e) {
    return parseInt(e || ``, 10) || 0;
  };
var Sr = function (e) {
    var t = window.getComputedStyle(document.body),
      n = t[e === `padding` ? `paddingLeft` : `marginLeft`],
      r = t[e === `padding` ? `paddingTop` : `marginTop`],
      i = t[e === `padding` ? `paddingRight` : `marginRight`];
    return [xr(n), xr(r), xr(i)];
  };
var Cr = function (e) {
    if ((e === void 0 && (e = `margin`), typeof window > `u`)) return br;
    var t = Sr(e),
      n = document.documentElement.clientWidth,
      r = window.innerWidth;
    return {
      left: t[0],
      top: t[1],
      right: t[2],
      gap: Math.max(0, r - n + t[2] - t[0]),
    };
  };
var wr = yr();
var Tr = `data-scroll-locked`;
var Er = function (e, t, n, r) {
    var i = e.left,
      a = e.top,
      o = e.right,
      s = e.gap;
    return (
      n === void 0 && (n = `margin`),
      `
  .${Zn} {
   overflow: hidden ${r};
   padding-right: ${s}px ${r};
  }
  body[${Tr}] {
    overflow: hidden ${r};
    overscroll-behavior: contain;
    ${[
      t && `position: relative ${r};`,
      n === `margin` &&
        `
    padding-left: ${i}px;
    padding-top: ${a}px;
    padding-right: ${o}px;
    margin-left:0;
    margin-top:0;
    margin-right: ${s}px ${r};
    `,
      n === `padding` && `padding-right: ${s}px ${r};`,
    ]
      .filter(Boolean)
      .join(``)}
  }
  
  .${Yn} {
    right: ${s}px ${r};
  }
  
  .${Xn} {
    margin-right: ${s}px ${r};
  }
  
  .${Yn} .${Yn} {
    right: 0 ${r};
  }
  
  .${Xn} .${Xn} {
    margin-right: 0 ${r};
  }
  
  body[${Tr}] {
    ${Qn}: ${s}px;
  }
`
    );
  };
var Dr = function () {
    var e = parseInt(
      document.body.getAttribute(`data-scroll-locked`) || `0`,
      10,
    );
    return isFinite(e) ? e : 0;
  };
var Or = function () {
    C.useEffect(function () {
      return (
        document.body.setAttribute(Tr, (Dr() + 1).toString()),
        function () {
          var e = Dr() - 1;
          e <= 0
            ? document.body.removeAttribute(Tr)
            : document.body.setAttribute(Tr, e.toString());
        }
      );
    }, []);
  };
var kr = function (e) {
    var t = e.noRelative,
      n = e.noImportant,
      r = e.gapMode,
      i = r === void 0 ? `margin` : r;
    Or();
    var a = C.useMemo(
      function () {
        return Cr(i);
      },
      [i],
    );
    return C.createElement(wr, { styles: Er(a, !t, i, n ? `` : `!important`) });
  };
var Ar = !1;
if (typeof window < `u`)
  try {
    var jr = Object.defineProperty({}, `passive`, {
      get: function () {
        return ((Ar = !0), !0);
      },
    });
    (window.addEventListener(`test`, jr, jr),
      window.removeEventListener(`test`, jr, jr));
  } catch {
    Ar = !1;
  }
var Mr = Ar ? { passive: !1 } : !1;
var Nr = function (e) {
    return e.tagName === `TEXTAREA`;
  };
var Pr = function (e, t) {
    if (!(e instanceof Element)) return !1;
    var n = window.getComputedStyle(e);
    return (
      n[t] !== `hidden` &&
      !(n.overflowY === n.overflowX && !Nr(e) && n[t] === `visible`)
    );
  };
var Fr = function (e) {
    return Pr(e, `overflowY`);
  };
var Ir = function (e) {
    return Pr(e, `overflowX`);
  };
var Lr = function (e, t) {
    var n = t.ownerDocument,
      r = t;
    do {
      if (
        (typeof ShadowRoot < `u` && r instanceof ShadowRoot && (r = r.host),
        Br(e, r))
      ) {
        var i = Vr(e, r);
        if (i[1] > i[2]) return !0;
      }
      r = r.parentNode;
    } while (r && r !== n.body);
    return !1;
  };
var Rr = function (e) {
    return [e.scrollTop, e.scrollHeight, e.clientHeight];
  };
var zr = function (e) {
    return [e.scrollLeft, e.scrollWidth, e.clientWidth];
  };
var Br = function (e, t) {
    return e === `v` ? Fr(t) : Ir(t);
  };
var Vr = function (e, t) {
    return e === `v` ? Rr(t) : zr(t);
  };
var Hr = function (e, t) {
    return e === `h` && t === `rtl` ? -1 : 1;
  };
var Ur = function (e, t, n, r, i) {
    var a = Hr(e, window.getComputedStyle(t).direction),
      o = a * r,
      s = n.target,
      c = t.contains(s),
      l = !1,
      u = o > 0,
      d = 0,
      f = 0;
    do {
      if (!s) break;
      var p = Vr(e, s),
        m = p[0],
        h = p[1] - p[2] - a * m;
      (m || h) && Br(e, s) && ((d += h), (f += m));
      var g = s.parentNode;
      s = g && g.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? g.host : g;
    } while ((!c && s !== document.body) || (c && (t.contains(s) || t === s)));
    return (
      ((u && ((i && Math.abs(d) < 1) || (!i && o > d))) ||
        (!u && ((i && Math.abs(f) < 1) || (!i && -o > f)))) &&
        (l = !0),
      l
    );
  };
var Wr = function (e) {
    return `changedTouches` in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  };
var Gr = function (e) {
    return [e.deltaX, e.deltaY];
  };
var Kr = function (e) {
    return e && `current` in e ? e.current : e;
  };
var qr = function (e, t) {
    return e[0] === t[0] && e[1] === t[1];
  };
var Jr = function (e) {
    return `
  .block-interactivity-${e} {pointer-events: none;}
  .allow-interactivity-${e} {pointer-events: all;}
`;
  };
var Yr = 0;
var Xr = [];
function Zr(e) {
  var t = C.useRef([]),
    n = C.useRef([0, 0]),
    r = C.useRef(),
    i = C.useState(Yr++)[0],
    a = C.useState(yr)[0],
    o = C.useRef(e);
  (C.useEffect(
    function () {
      o.current = e;
    },
    [e],
  ),
    C.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add(`block-interactivity-${i}`);
          var t = Jn([e.lockRef.current], (e.shards || []).map(Kr), !0).filter(
            Boolean,
          );
          return (
            t.forEach(function (e) {
              return e.classList.add(`allow-interactivity-${i}`);
            }),
            function () {
              (document.body.classList.remove(`block-interactivity-${i}`),
                t.forEach(function (e) {
                  return e.classList.remove(`allow-interactivity-${i}`);
                }));
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    ));
  var s = C.useCallback(function (e, t) {
      if (
        (`touches` in e && e.touches.length === 2) ||
        (e.type === `wheel` && e.ctrlKey)
      )
        return !o.current.allowPinchZoom;
      var i = Wr(e),
        a = n.current,
        s = `deltaX` in e ? e.deltaX : a[0] - i[0],
        c = `deltaY` in e ? e.deltaY : a[1] - i[1],
        l,
        u = e.target,
        d = Math.abs(s) > Math.abs(c) ? `h` : `v`;
      if (`touches` in e && d === `h` && u.type === `range`) return !1;
      var f = window.getSelection(),
        p = f && f.anchorNode;
      if (p && (p === u || p.contains(u))) return !1;
      var m = Lr(d, u);
      if (!m) return !0;
      if ((m ? (l = d) : ((l = d === `v` ? `h` : `v`), (m = Lr(d, u))), !m))
        return !1;
      if (
        (!r.current && `changedTouches` in e && (s || c) && (r.current = l), !l)
      )
        return !0;
      var h = r.current || l;
      return Ur(h, t, e, h === `h` ? s : c, !0);
    }, []),
    c = C.useCallback(function (e) {
      var n = e;
      if (!(!Xr.length || Xr[Xr.length - 1] !== a)) {
        var r = `deltaY` in n ? Gr(n) : Wr(n),
          i = t.current.filter(function (e) {
            return (
              e.name === n.type &&
              (e.target === n.target || n.target === e.shadowParent) &&
              qr(e.delta, r)
            );
          })[0];
        if (i && i.should) {
          n.cancelable && n.preventDefault();
          return;
        }
        if (!i) {
          var c = (o.current.shards || [])
            .map(Kr)
            .filter(Boolean)
            .filter(function (e) {
              return e.contains(n.target);
            });
          (c.length > 0 ? s(n, c[0]) : !o.current.noIsolation) &&
            n.cancelable &&
            n.preventDefault();
        }
      }
    }, []),
    l = C.useCallback(function (e, n, r, i) {
      var a = { name: e, delta: n, target: r, should: i, shadowParent: Qr(r) };
      (t.current.push(a),
        setTimeout(function () {
          t.current = t.current.filter(function (e) {
            return e !== a;
          });
        }, 1));
    }, []),
    u = C.useCallback(function (e) {
      ((n.current = Wr(e)), (r.current = void 0));
    }, []),
    d = C.useCallback(function (t) {
      l(t.type, Gr(t), t.target, s(t, e.lockRef.current));
    }, []),
    f = C.useCallback(function (t) {
      l(t.type, Wr(t), t.target, s(t, e.lockRef.current));
    }, []);
  C.useEffect(function () {
    return (
      Xr.push(a),
      e.setCallbacks({
        onScrollCapture: d,
        onWheelCapture: d,
        onTouchMoveCapture: f,
      }),
      document.addEventListener(`wheel`, c, Mr),
      document.addEventListener(`touchmove`, c, Mr),
      document.addEventListener(`touchstart`, u, Mr),
      function () {
        ((Xr = Xr.filter(function (e) {
          return e !== a;
        })),
          document.removeEventListener(`wheel`, c, Mr),
          document.removeEventListener(`touchmove`, c, Mr),
          document.removeEventListener(`touchstart`, u, Mr));
      }
    );
  }, []);
  var p = e.removeScrollBar,
    m = e.inert;
  return C.createElement(
    C.Fragment,
    null,
    m ? C.createElement(a, { styles: Jr(i) }) : null,
    p
      ? C.createElement(kr, { noRelative: e.noRelative, gapMode: e.gapMode })
      : null,
  );
}
function Qr(e) {
  for (var t = null; e !== null; )
    (e instanceof ShadowRoot && ((t = e.host), (e = e.host)),
      (e = e.parentNode));
  return t;
}
var $r = cr(lr, Zr);
var ei = C.forwardRef(function (e, t) {
    return C.createElement(dr, Kn({}, e, { ref: t, sideCar: $r }));
  });
ei.classNames = dr.classNames;
var ti = function (e) {
    return typeof document > `u`
      ? null
      : (Array.isArray(e) ? e[0] : e).ownerDocument.body;
  };
var ni = new WeakMap();
var ri = new WeakMap();
var ii = {};
var ai = 0;
var oi = function (e) {
    return e && (e.host || oi(e.parentNode));
  };
var si = function (e, t) {
    return t
      .map(function (t) {
        if (e.contains(t)) return t;
        var n = oi(t);
        return n && e.contains(n)
          ? n
          : (console.error(
              `aria-hidden`,
              t,
              `in not contained inside`,
              e,
              `. Doing nothing`,
            ),
            null);
      })
      .filter(function (e) {
        return !!e;
      });
  };
var ci = function (e, t, n, r) {
    var i = si(t, Array.isArray(e) ? e : [e]);
    ii[n] || (ii[n] = new WeakMap());
    var a = ii[n],
      o = [],
      s = new Set(),
      c = new Set(i),
      l = function (e) {
        !e || s.has(e) || (s.add(e), l(e.parentNode));
      };
    i.forEach(l);
    var u = function (e) {
      !e ||
        c.has(e) ||
        Array.prototype.forEach.call(e.children, function (e) {
          if (s.has(e)) u(e);
          else
            try {
              var t = e.getAttribute(r),
                i = t !== null && t !== `false`,
                c = (ni.get(e) || 0) + 1,
                l = (a.get(e) || 0) + 1;
              (ni.set(e, c),
                a.set(e, l),
                o.push(e),
                c === 1 && i && ri.set(e, !0),
                l === 1 && e.setAttribute(n, `true`),
                i || e.setAttribute(r, `true`));
            } catch (t) {
              console.error(`aria-hidden: cannot operate on `, e, t);
            }
        });
    };
    return (
      u(t),
      s.clear(),
      ai++,
      function () {
        (o.forEach(function (e) {
          var t = ni.get(e) - 1,
            i = a.get(e) - 1;
          (ni.set(e, t),
            a.set(e, i),
            t || (ri.has(e) || e.removeAttribute(r), ri.delete(e)),
            i || e.removeAttribute(n));
        }),
          ai--,
          ai ||
            ((ni = new WeakMap()),
            (ni = new WeakMap()),
            (ri = new WeakMap()),
            (ii = {})));
      }
    );
  };
var li = function (e, t, n) {
    n === void 0 && (n = `data-aria-hidden`);
    var r = Array.from(Array.isArray(e) ? e : [e]),
      i = t || ti(e);
    return i
      ? (r.push.apply(r, Array.from(i.querySelectorAll(`[aria-live], script`))),
        ci(r, i, n, `aria-hidden`))
      : function () {
          return null;
        };
  };
var ui = Object.defineProperty;
var di = (e, t) => ui(e, `name`, { value: t, configurable: !0 });
var fi = `Dialog`;
var [pi, mi] = ot(fi);
var [hi, gi] = pi(fi);
var _i = di((e) => {
    let {
        __scopeDialog: t,
        children: n,
        open: r,
        defaultOpen: i,
        onOpenChange: a,
        modal: o = !0,
      } = e,
      s = C.useRef(null),
      c = C.useRef(null),
      [l, u] = Ft({ prop: r, defaultProp: i ?? !1, onChange: a, caller: fi }),
      [d, f] = C.useState(0),
      [p, m] = C.useState(0);
    return (0, F.jsx)(hi, {
      scope: t,
      triggerRef: s,
      contentRef: c,
      contentId: Zt(),
      titleId: Zt(),
      descriptionId: Zt(),
      titlePresent: d > 0,
      descriptionPresent: p > 0,
      setTitleCount: f,
      setDescriptionCount: m,
      open: l,
      onOpenChange: u,
      onOpenToggle: C.useCallback(() => u((e) => !e), [u]),
      modal: o,
      children: n,
    });
  }, `Dialog`);
var vi = `DialogPortal`;
var [yi, bi] = pi(vi, { forceMount: void 0 });
var xi = di((e) => {
    let { __scopeDialog: t, forceMount: n, children: r, container: i } = e,
      a = gi(vi, t);
    return (0, F.jsx)(yi, {
      scope: t,
      forceMount: n,
      children: C.Children.map(r, (e) =>
        (0, F.jsx)(Ut, {
          present: n || a.open,
          children: (0, F.jsx)(Rn, { asChild: !0, container: i, children: e }),
        }),
      ),
    });
  }, `DialogPortal`);
var Si = `DialogOverlay`;
var Ci = C.forwardRef(
    di(function (e, t) {
      let n = bi(Si, e.__scopeDialog),
        { forceMount: r = n.forceMount, ...i } = e,
        a = gi(Si, e.__scopeDialog);
      return a.modal
        ? (0, F.jsx)(Ut, {
            present: r || a.open,
            children: (0, F.jsx)(Ti, { ...i, ref: t }),
          })
        : null;
    }, `DialogOverlay`),
  );
var wi = ze(`DialogOverlay.RemoveScroll`);
var Ti = C.forwardRef(
    di(function (e, t) {
      let { __scopeDialog: n, ...r } = e,
        i = gi(Si, n),
        a = Ie(t, mn());
      return (0, F.jsx)(ei, {
        as: wi,
        allowPinchZoom: !0,
        shards: [i.contentRef],
        children: (0, F.jsx)(I.div, {
          "data-state": Ii(i.open),
          ...r,
          ref: a,
          style: { pointerEvents: `auto`, ...r.style },
        }),
      });
    }, `DialogOverlayImpl`),
  );
var Ei = `DialogContent`;
var Di = C.forwardRef(
    di(function (e, t) {
      let n = bi(Ei, e.__scopeDialog),
        { forceMount: r = n.forceMount, ...i } = e,
        a = gi(Ei, e.__scopeDialog);
      return (0, F.jsx)(Ut, {
        present: r || a.open,
        children: a.modal
          ? (0, F.jsx)(Oi, { ...i, ref: t })
          : (0, F.jsx)(ki, { ...i, ref: t }),
      });
    }, `DialogContent`),
  );
var Oi = C.forwardRef(
    di(function (e, t) {
      let n = gi(Ei, e.__scopeDialog),
        r = C.useRef(null),
        i = Ie(t, n.contentRef, r);
      return (
        C.useEffect(() => {
          let e = r.current;
          if (e) return li(e);
        }, []),
        (0, F.jsx)(Ai, {
          ...e,
          ref: i,
          trapFocus: n.open,
          disableOutsidePointerEvents: n.open,
          onCloseAutoFocus: xt(e.onCloseAutoFocus, (e) => {
            (e.preventDefault(), n.triggerRef.current?.focus());
          }),
          onPointerDownOutside: xt(e.onPointerDownOutside, (e) => {
            let t = e.detail.originalEvent,
              n = t.button === 0 && t.ctrlKey === !0;
            (t.button === 2 || n) && e.preventDefault();
          }),
          onFocusOutside: xt(e.onFocusOutside, (e) => e.preventDefault()),
        })
      );
    }, `DialogContentModal`),
  );
var ki = C.forwardRef(
    di(function (e, t) {
      let n = gi(Ei, e.__scopeDialog),
        r = C.useRef(!1),
        i = C.useRef(!1);
      return (0, F.jsx)(Ai, {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (t) => {
          (e.onCloseAutoFocus?.(t),
            t.defaultPrevented ||
              (r.current || n.triggerRef.current?.focus(), t.preventDefault()),
            (r.current = !1),
            (i.current = !1));
        },
        onInteractOutside: (t) => {
          (e.onInteractOutside?.(t),
            t.defaultPrevented ||
              ((r.current = !0),
              t.detail.originalEvent.type === `pointerdown` &&
                (i.current = !0)));
          let a = t.target;
          (n.triggerRef.current?.contains(a) && t.preventDefault(),
            t.detail.originalEvent.type === `focusin` &&
              i.current &&
              t.preventDefault());
        },
      });
    }, `DialogContentNonModal`),
  );
var Ai = C.forwardRef(
    di(function (e, t) {
      let {
          __scopeDialog: n,
          trapFocus: r,
          onOpenAutoFocus: i,
          onCloseAutoFocus: a,
          ...o
        } = e,
        s = gi(Ei, n);
      return (
        Wn(),
        (0, F.jsx)(F.Fragment, {
          children: (0, F.jsx)(Tn, {
            asChild: !0,
            loop: !0,
            trapped: r,
            onMountAutoFocus: i,
            onUnmountAutoFocus: a,
            children: (0, F.jsx)(pn, {
              role: `dialog`,
              id: s.contentId,
              "aria-describedby": s.descriptionPresent
                ? s.descriptionId
                : void 0,
              "aria-labelledby": s.titlePresent ? s.titleId : void 0,
              "data-state": Ii(s.open),
              ...o,
              ref: t,
              deferPointerDownOutside: !0,
              onDismiss: () => s.onOpenChange(!1),
            }),
          }),
        })
      );
    }, `DialogContentImpl`),
  );
var U = `DialogTitle`;
var ji = C.forwardRef(
    di(function (e, t) {
      let { __scopeDialog: n, ...r } = e,
        i = gi(U, n),
        { setTitleCount: a } = i;
      return (
        Et(() => (a((e) => e + 1), () => a((e) => e - 1)), [a]),
        (0, F.jsx)(I.h2, { id: i.titleId, ...r, ref: t })
      );
    }, `DialogTitle`),
  );
var Mi = `DialogDescription`;
var Ni = C.forwardRef(
    di(function (e, t) {
      let { __scopeDialog: n, ...r } = e,
        i = gi(Mi, n),
        { setDescriptionCount: a } = i;
      return (
        Et(() => (a((e) => e + 1), () => a((e) => e - 1)), [a]),
        (0, F.jsx)(I.p, { id: i.descriptionId, ...r, ref: t })
      );
    }, `DialogDescription`),
  );
var Pi = `DialogClose`;
var Fi = C.forwardRef(
    di(function (e, t) {
      let { __scopeDialog: n, ...r } = e,
        i = gi(Pi, n);
      return (0, F.jsx)(I.button, {
        type: `button`,
        ...r,
        ref: t,
        onClick: xt(e.onClick, () => i.onOpenChange(!1)),
      });
    }, `DialogClose`),
  );
function Ii(e) {
  return e ? `open` : `closed`;
}
di(Ii, `getState`);
var Li = Object.defineProperty;
var Ri = (e, t) => Li(e, `name`, { value: t, configurable: !0 });
var zi = !1;
function Bi() {
  let [e, t] = C.useState(zi);
  return (
    C.useEffect(() => {
      zi || ((zi = !0), t(!0));
    }, []),
    e
  );
}
Ri(Bi, `useIsHydrated`);
var Vi = C.useSyncExternalStore;
function Hi() {
  return () => {};
}
Ri(Hi, `subscribe`);
function Ui() {
  return Vi(
    Hi,
    () => !0,
    () => !1,
  );
}
Ri(Ui, `useIsHydratedModern`);
var Wi = typeof Vi == `function` ? Ui : Bi;
var Gi = Object.defineProperty;
var Ki = (e, t) => Gi(e, `name`, { value: t, configurable: !0 });
var qi = `rovingFocusGroup.onEntryFocus`;
var Ji = { bubbles: !1, cancelable: !0 };
var Yi = `RovingFocusGroup`;
var [Xi, Zi, Qi] = ct(Yi);
var [$i, ea] = ot(Yi, [Qi]);
var [ta, na] = $i(Yi);
var ra = C.forwardRef(
    Ki(function (e, t) {
      return (0, F.jsx)(Xi.Provider, {
        scope: e.__scopeRovingFocusGroup,
        children: (0, F.jsx)(Xi.Slot, {
          scope: e.__scopeRovingFocusGroup,
          children: (0, F.jsx)(ia, { ...e, ref: t }),
        }),
      });
    }, `RovingFocusGroup`),
  );
var ia = C.forwardRef(
    Ki(function (e, t) {
      let {
          __scopeRovingFocusGroup: n,
          orientation: r,
          loop: i = !1,
          dir: a,
          currentTabStopId: o,
          defaultCurrentTabStopId: s,
          onCurrentTabStopIdChange: c,
          onEntryFocus: l,
          preventScrollOnEntryFocus: u = !1,
          ...d
        } = e,
        f = C.useRef(null),
        p = Ie(t, f),
        m = tn(a),
        [h, g] = Ft({
          prop: o,
          defaultProp: s ?? null,
          onChange: c,
          caller: Yi,
        }),
        [_, v] = C.useState(!1),
        y = an(l),
        b = Zi(n),
        x = C.useRef(!1),
        [S, w] = C.useState(0);
      return (
        C.useEffect(() => {
          let e = f.current;
          if (e)
            return (
              e.addEventListener(qi, y),
              () => e.removeEventListener(qi, y)
            );
        }, [y]),
        (0, F.jsx)(ta, {
          scope: n,
          orientation: r,
          dir: m,
          loop: i,
          currentTabStopId: h,
          onItemFocus: C.useCallback((e) => g(e), [g]),
          onItemShiftTab: C.useCallback(() => v(!0), []),
          onFocusableItemAdd: C.useCallback(() => w((e) => e + 1), []),
          onFocusableItemRemove: C.useCallback(() => w((e) => e - 1), []),
          children: (0, F.jsx)(I.div, {
            tabIndex: _ || S === 0 ? -1 : 0,
            "data-orientation": r,
            ...d,
            ref: p,
            style: { outline: `none`, ...e.style },
            onMouseDown: xt(e.onMouseDown, () => {
              x.current = !0;
            }),
            onFocus: xt(e.onFocus, (e) => {
              let t = !x.current;
              if (e.target === e.currentTarget && t && !_) {
                let t = new CustomEvent(qi, Ji);
                if ((e.currentTarget.dispatchEvent(t), !t.defaultPrevented)) {
                  let e = b().filter((e) => e.focusable);
                  ua(
                    [e.find((e) => e.active), e.find((e) => e.id === h), ...e]
                      .filter(Boolean)
                      .map((e) => e.ref.current),
                    u,
                  );
                }
              }
              x.current = !1;
            }),
            onBlur: xt(e.onBlur, () => v(!1)),
          }),
        })
      );
    }, `RovingFocusGroupImpl`),
  );
var aa = `RovingFocusGroupItem`;
var oa = C.forwardRef(
    Ki(function (e, t) {
      let {
          __scopeRovingFocusGroup: n,
          focusable: r = !0,
          active: i = !1,
          tabStopId: a,
          children: o,
          ...s
        } = e,
        c = Zt(),
        l = a || c,
        u = na(aa, n),
        d = u.currentTabStopId === l,
        f = Zi(n),
        {
          onFocusableItemAdd: p,
          onFocusableItemRemove: m,
          currentTabStopId: h,
        } = u,
        g = Wi();
      return (
        Et(() => {
          if (!(!g || !r)) return (p(), () => m());
        }, [g, r, p, m]),
        C.useEffect(() => {
          if (!(g || !r)) return (p(), () => m());
        }, [g, r, p, m]),
        (0, F.jsx)(Xi.ItemSlot, {
          scope: n,
          id: l,
          focusable: r,
          active: i,
          children: (0, F.jsx)(I.span, {
            tabIndex: d ? 0 : -1,
            "data-orientation": u.orientation,
            ...s,
            ref: t,
            onMouseDown: xt(e.onMouseDown, (e) => {
              r ? u.onItemFocus(l) : e.preventDefault();
            }),
            onFocus: xt(e.onFocus, () => u.onItemFocus(l)),
            onKeyDown: xt(e.onKeyDown, (e) => {
              if (e.key === `Tab` && e.shiftKey) {
                u.onItemShiftTab();
                return;
              }
              if (e.target !== e.currentTarget) return;
              let t = la(e, u.orientation, u.dir);
              if (t !== void 0) {
                if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
                e.preventDefault();
                let n = f()
                  .filter((e) => e.focusable)
                  .map((e) => e.ref.current);
                if (t === `last`) n.reverse();
                else if (t === `prev` || t === `next`) {
                  t === `prev` && n.reverse();
                  let r = n.indexOf(e.currentTarget);
                  n = u.loop ? da(n, r + 1) : n.slice(r + 1);
                }
                setTimeout(() => ua(n));
              }
            }),
            children:
              typeof o == `function`
                ? o({ isCurrentTabStop: d, hasTabStop: h != null })
                : o,
          }),
        })
      );
    }, `RovingFocusGroupItem`),
  );
var sa = {
    ArrowLeft: `prev`,
    ArrowUp: `prev`,
    ArrowRight: `next`,
    ArrowDown: `next`,
    PageUp: `first`,
    Home: `first`,
    PageDown: `last`,
    End: `last`,
  };
function ca(e, t) {
  return t === `rtl`
    ? e === `ArrowLeft`
      ? `ArrowRight`
      : e === `ArrowRight`
        ? `ArrowLeft`
        : e
    : e;
}
Ki(ca, `getDirectionAwareKey`);
function la(e, t, n) {
  let r = ca(e.key, n);
  if (
    !(t === `vertical` && [`ArrowLeft`, `ArrowRight`].includes(r)) &&
    !(t === `horizontal` && [`ArrowUp`, `ArrowDown`].includes(r))
  )
    return sa[r];
}
Ki(la, `getFocusIntent`);
function ua(e, t = !1) {
  let n = document.activeElement;
  for (let r of e)
    if (
      r === n ||
      (r.focus({ preventScroll: t }), document.activeElement !== n)
    )
      return;
}
Ki(ua, `focusFirst`);
function da(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
Ki(da, `wrapArray`);
var fa = ra;
var pa = oa;
var ma = Object.defineProperty;
var ha = (e, t) => ma(e, `name`, { value: t, configurable: !0 });
var ga = `Progress`;
var _a = 100;
var [va, ya] = ot(ga);
var [ba, xa] = va(ga);
var Sa = C.forwardRef(
    ha(function (e, t) {
      let {
        __scopeProgress: n,
        value: r = null,
        max: i,
        getValueLabel: a = Ta,
        ...o
      } = e;
      (i || i === 0) && !Oa(i) && console.error(Aa(`${i}`, `Progress`));
      let s = Oa(i) ? i : _a;
      r !== null && !ka(r, s) && console.error(ja(`${r}`, `Progress`));
      let c = ka(r, s) ? r : null,
        l = Da(c) ? a(c, s) : void 0;
      return (0, F.jsx)(ba, {
        scope: n,
        value: c,
        max: s,
        children: (0, F.jsx)(I.div, {
          "aria-valuemax": s,
          "aria-valuemin": 0,
          "aria-valuenow": Da(c) ? c : void 0,
          "aria-valuetext": l,
          role: `progressbar`,
          "data-state": Ea(c, s),
          "data-value": c ?? void 0,
          "data-max": s,
          ...o,
          ref: t,
        }),
      });
    }, `Progress`),
  );
var Ca = `ProgressIndicator`;
var wa = C.forwardRef(
    ha(function (e, t) {
      let { __scopeProgress: n, ...r } = e,
        i = xa(Ca, n);
      return (0, F.jsx)(I.div, {
        "data-state": Ea(i.value, i.max),
        "data-value": i.value ?? void 0,
        "data-max": i.max,
        ...r,
        ref: t,
      });
    }, `ProgressIndicator`),
  );
function Ta(e, t) {
  return `${Math.round((e / t) * 100)}%`;
}
ha(Ta, `defaultGetValueLabel`);
function Ea(e, t) {
  return e == null ? `indeterminate` : e === t ? `complete` : `loading`;
}
ha(Ea, `getProgressState`);
function Da(e) {
  return typeof e == `number`;
}
ha(Da, `isNumber`);
function Oa(e) {
  return Da(e) && !isNaN(e) && e > 0;
}
ha(Oa, `isValidMaxNumber`);
function ka(e, t) {
  return Da(e) && !isNaN(e) && e <= t && e >= 0;
}
ha(ka, `isValidValueNumber`);
function Aa(e, t) {
  return `Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${_a}\`.`;
}
ha(Aa, `getInvalidMaxError`);
function ja(e, t) {
  return `Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${_a} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
ha(ja, `getInvalidValueError`);
var Ma = Sa;
var Na = wa;
var Pa = Object.defineProperty;
var Fa = (e, t) => Pa(e, `name`, { value: t, configurable: !0 });
var Ia = `Tabs`;
var [La, Ra] = ot(Ia, [ea]);
var za = ea();
var [Ba, Va] = La(Ia);
var Ha = C.forwardRef(
    Fa(function (e, t) {
      let {
          __scopeTabs: n,
          value: r,
          onValueChange: i,
          defaultValue: a,
          orientation: o = `horizontal`,
          dir: s,
          activationMode: c = `automatic`,
          ...l
        } = e,
        u = tn(s),
        [d, f] = Ft({ prop: r, onChange: i, defaultProp: a ?? ``, caller: Ia });
      return (0, F.jsx)(Ba, {
        scope: n,
        baseId: Zt(),
        value: d,
        onValueChange: f,
        orientation: o,
        dir: u,
        activationMode: c,
        children: (0, F.jsx)(I.div, {
          dir: u,
          "data-orientation": o,
          ...l,
          ref: t,
        }),
      });
    }, `Tabs`),
  );
var Ua = `TabsList`;
var Wa = C.forwardRef(
    Fa(function (e, t) {
      let { __scopeTabs: n, loop: r = !0, ...i } = e,
        a = Va(Ua, n),
        o = za(n);
      return (0, F.jsx)(fa, {
        asChild: !0,
        ...o,
        orientation: a.orientation,
        dir: a.dir,
        loop: r,
        children: (0, F.jsx)(I.div, {
          role: `tablist`,
          "aria-orientation": a.orientation,
          ...i,
          ref: t,
        }),
      });
    }, `TabsList`),
  );
var Ga = `TabsTrigger`;
var Ka = C.forwardRef(
    Fa(function (e, t) {
      let { __scopeTabs: n, value: r, disabled: i = !1, ...a } = e,
        o = Va(Ga, n),
        s = za(n),
        c = qa(o.baseId, r),
        l = Ja(o.baseId, r),
        u = r === o.value;
      return (0, F.jsx)(pa, {
        asChild: !0,
        ...s,
        focusable: !i,
        active: u,
        children: (0, F.jsx)(I.button, {
          type: `button`,
          role: `tab`,
          "aria-selected": u,
          "aria-controls": l,
          "data-state": u ? `active` : `inactive`,
          "data-disabled": i ? `` : void 0,
          disabled: i,
          id: c,
          ...a,
          ref: t,
          onMouseDown: xt(e.onMouseDown, (e) => {
            !i && e.button === 0 && e.ctrlKey === !1
              ? o.onValueChange(r)
              : e.preventDefault();
          }),
          onKeyDown: xt(e.onKeyDown, (e) => {
            i ||
              e.target !== e.currentTarget ||
              ([` `, `Enter`].includes(e.key) && o.onValueChange(r));
          }),
          onFocus: xt(e.onFocus, () => {
            let e = o.activationMode !== `manual`;
            !u && !i && e && o.onValueChange(r);
          }),
        }),
      });
    }, `TabsTrigger`),
  );
function qa(e, t) {
  return `${e}-trigger-${t}`;
}
Fa(qa, `makeTriggerId`);
function Ja(e, t) {
  return `${e}-content-${t}`;
}
Fa(Ja, `makeContentId`);
var Ya = Ha;
var Xa = Wa;
var Za = Ka;
var Qa = g();
function $a(e) {
  var t,
    n,
    r = ``;
  if (typeof e == `string` || typeof e == `number`) r += e;
  else if (typeof e == `object`)
    if (Array.isArray(e)) {
      var i = e.length;
      for (t = 0; t < i; t++)
        e[t] && (n = $a(e[t])) && (r && (r += ` `), (r += n));
    } else for (n in e) e[n] && (r && (r += ` `), (r += n));
  return r;
}
function eo() {
  for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++)
    (e = arguments[n]) && (t = $a(e)) && (r && (r += ` `), (r += t));
  return r;
}
var to = (e, t) => {
    let n = Array(e.length + t.length);
    for (let t = 0; t < e.length; t++) n[t] = e[t];
    for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
    return n;
  };
var no = (e, t) => ({ classGroupId: e, validator: t });
var ro = (e = new Map(), t = null, n) => ({
    nextPart: e,
    validators: t,
    classGroupId: n,
  });
var io = `-`;
var ao = [];
var oo = `arbitrary..`;
var so = (e) => {
    let t = lo(e),
      { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
    return {
      getClassGroupId: (e) => {
        if (e.startsWith(`[`) && e.endsWith(`]`)) return W(e);
        let n = e.split(io);
        return co(n, +(n[0] === `` && n.length > 1), t);
      },
      getConflictingClassGroupIds: (e, t) => {
        if (t) {
          let t = r[e],
            i = n[e];
          return t ? (i ? to(i, t) : t) : i || ao;
        }
        return n[e] || ao;
      },
    };
  };
var co = (e, t, n) => {
    if (e.length - t === 0) return n.classGroupId;
    let r = e[t],
      i = n.nextPart.get(r);
    if (i) {
      let n = co(e, t + 1, i);
      if (n) return n;
    }
    let a = n.validators;
    if (a === null) return;
    let o = t === 0 ? e.join(io) : e.slice(t).join(io),
      s = a.length;
    for (let e = 0; e < s; e++) {
      let t = a[e];
      if (t.validator(o)) return t.classGroupId;
    }
  };
var W = (e) =>
    e.slice(1, -1).indexOf(`:`) === -1
      ? void 0
      : (() => {
          let t = e.slice(1, -1),
            n = t.indexOf(`:`),
            r = t.slice(0, n);
          return r ? oo + r : void 0;
        })();
var lo = (e) => {
    let { theme: t, classGroups: n } = e;
    return uo(n, t);
  };
var uo = (e, t) => {
    let n = ro();
    for (let r in e) {
      let i = e[r];
      fo(i, n, r, t);
    }
    return n;
  };
var fo = (e, t, n, r) => {
    let i = e.length;
    for (let a = 0; a < i; a++) {
      let i = e[a];
      po(i, t, n, r);
    }
  };
var po = (e, t, n, r) => {
    if (typeof e == `string`) {
      mo(e, t, n);
      return;
    }
    if (typeof e == `function`) {
      ho(e, t, n, r);
      return;
    }
    go(e, t, n, r);
  };
var mo = (e, t, n) => {
    let r = e === `` ? t : _o(t, e);
    r.classGroupId = n;
  };
var ho = (e, t, n, r) => {
    if (vo(e)) {
      fo(e(r), t, n, r);
      return;
    }
    (t.validators === null && (t.validators = []), t.validators.push(no(n, e)));
  };
var go = (e, t, n, r) => {
    let i = Object.entries(e),
      a = i.length;
    for (let e = 0; e < a; e++) {
      let [a, o] = i[e];
      fo(o, _o(t, a), n, r);
    }
  };
var _o = (e, t) => {
    let n = e,
      r = t.split(io),
      i = r.length;
    for (let e = 0; e < i; e++) {
      let t = r[e],
        i = n.nextPart.get(t);
      (i || ((i = ro()), n.nextPart.set(t, i)), (n = i));
    }
    return n;
  };
var vo = (e) => `isThemeGetter` in e && e.isThemeGetter === !0;
var yo = (e) => {
    if (e < 1) return { get: () => void 0, set: () => {} };
    let t = 0,
      n = Object.create(null),
      r = Object.create(null),
      i = (i, a) => {
        ((n[i] = a),
          t++,
          t > e && ((t = 0), (r = n), (n = Object.create(null))));
      };
    return {
      get(e) {
        let t = n[e];
        if (t !== void 0) return t;
        if ((t = r[e]) !== void 0) return (i(e, t), t);
      },
      set(e, t) {
        e in n ? (n[e] = t) : i(e, t);
      },
    };
  };
var bo = `!`;
var xo = `:`;
var So = [];
var Co = (e, t, n, r, i) => ({
    modifiers: e,
    hasImportantModifier: t,
    baseClassName: n,
    maybePostfixModifierPosition: r,
    isExternal: i,
  });
var wo = (e) => {
    let { prefix: t, experimentalParseClassName: n } = e,
      r = (e) => {
        let t = [],
          n = 0,
          r = 0,
          i = 0,
          a,
          o = e.length;
        for (let s = 0; s < o; s++) {
          let o = e[s];
          if (n === 0 && r === 0) {
            if (o === xo) {
              (t.push(e.slice(i, s)), (i = s + 1));
              continue;
            }
            if (o === `/`) {
              a = s;
              continue;
            }
          }
          o === `[`
            ? n++
            : o === `]`
              ? n--
              : o === `(`
                ? r++
                : o === `)` && r--;
        }
        let s = t.length === 0 ? e : e.slice(i),
          c = s,
          l = !1;
        s.endsWith(bo)
          ? ((c = s.slice(0, -1)), (l = !0))
          : s.startsWith(bo) && ((c = s.slice(1)), (l = !0));
        let u = a && a > i ? a - i : void 0;
        return Co(t, l, c, u);
      };
    if (t) {
      let e = t + xo,
        n = r;
      r = (t) =>
        t.startsWith(e) ? n(t.slice(e.length)) : Co(So, !1, t, void 0, !0);
    }
    if (n) {
      let e = r;
      r = (t) => n({ className: t, parseClassName: e });
    }
    return r;
  };
var To = (e) => {
    let t = new Map();
    return (
      e.orderSensitiveModifiers.forEach((e, n) => {
        t.set(e, 1e6 + n);
      }),
      (e) => {
        let n = [],
          r = [];
        for (let i = 0; i < e.length; i++) {
          let a = e[i],
            o = a[0] === `[`,
            s = t.has(a);
          o || s
            ? (r.length > 0 && (r.sort(), n.push(...r), (r = [])), n.push(a))
            : r.push(a);
        }
        return (r.length > 0 && (r.sort(), n.push(...r)), n);
      }
    );
  };
var Eo = (e) => ({
    cache: yo(e.cacheSize),
    parseClassName: wo(e),
    sortModifiers: To(e),
    postfixLookupClassGroupIds: Do(e),
    ...so(e),
  });
var Do = (e) => {
    let t = Object.create(null),
      n = e.postfixLookupClassGroups;
    if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
    return t;
  };
var Oo = /\s+/;
var ko = (e, t) => {
    let {
        parseClassName: n,
        getClassGroupId: r,
        getConflictingClassGroupIds: i,
        sortModifiers: a,
        postfixLookupClassGroupIds: o,
      } = t,
      s = [],
      c = e.trim().split(Oo),
      l = ``;
    for (let e = c.length - 1; e >= 0; --e) {
      let t = c[e],
        {
          isExternal: u,
          modifiers: d,
          hasImportantModifier: f,
          baseClassName: p,
          maybePostfixModifierPosition: m,
        } = n(t);
      if (u) {
        l = t + (l.length > 0 ? ` ` + l : l);
        continue;
      }
      let h = !!m,
        g;
      if (h) {
        g = r(p.substring(0, m));
        let e = g && o[g] ? r(p) : void 0;
        e && e !== g && ((g = e), (h = !1));
      } else g = r(p);
      if (!g) {
        if (!h) {
          l = t + (l.length > 0 ? ` ` + l : l);
          continue;
        }
        if (((g = r(p)), !g)) {
          l = t + (l.length > 0 ? ` ` + l : l);
          continue;
        }
        h = !1;
      }
      let _ = d.length === 0 ? `` : d.length === 1 ? d[0] : a(d).join(`:`),
        v = f ? _ + bo : _,
        y = v + g;
      if (s.indexOf(y) > -1) continue;
      s.push(y);
      let b = i(g, h);
      for (let e = 0; e < b.length; ++e) {
        let t = b[e];
        s.push(v + t);
      }
      l = t + (l.length > 0 ? ` ` + l : l);
    }
    return l;
  };
var Ao = (...e) => {
    let t = 0,
      n,
      r,
      i = ``;
    for (; t < e.length; )
      (n = e[t++]) && (r = jo(n)) && (i && (i += ` `), (i += r));
    return i;
  };
var jo = (e) => {
    if (typeof e == `string`) return e;
    let t,
      n = ``;
    for (let r = 0; r < e.length; r++)
      e[r] && (t = jo(e[r])) && (n && (n += ` `), (n += t));
    return n;
  };
var Mo = (e, ...t) => {
    let n,
      r,
      i,
      a,
      o = (o) => (
        (n = Eo(t.reduce((e, t) => t(e), e()))),
        (r = n.cache.get),
        (i = n.cache.set),
        (a = s),
        s(o)
      ),
      s = (e) => {
        let t = r(e);
        if (t) return t;
        let a = ko(e, n);
        return (i(e, a), a);
      };
    return ((a = o), (...e) => a(Ao(...e)));
  };
var No = [];
var Po = (e) => {
    let t = (t) => t[e] || No;
    return ((t.isThemeGetter = !0), t);
  };
var Fo = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var Io = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var Lo = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
var Ro = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var zo =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var Bo = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var Vo = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var Ho =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var Uo = (e) => Lo.test(e);
var G = (e) => !!e && !Number.isNaN(Number(e));
var Wo = (e) => !!e && Number.isInteger(Number(e));
var Go = (e) => e.endsWith(`%`) && G(e.slice(0, -1));
var Ko = (e) => Ro.test(e);
var qo = () => !0;
var Jo = (e) => zo.test(e) && !Bo.test(e);
var Yo = () => !1;
var Xo = (e) => Vo.test(e);
var Zo = (e) => Ho.test(e);
var Qo = (e) => !K(e) && !q(e);
var $o = (e) =>
    e.startsWith(`@container`) &&
    ((e[10] === `/` && e[11] !== void 0) ||
      (e[11] === `s` && e[16] !== void 0 && e.startsWith(`-size/`, 10)) ||
      (e[11] === `n` && e[18] !== void 0 && e.startsWith(`-normal/`, 10)));
var es = (e) => hs(e, ys, Yo);
var K = (e) => Fo.test(e);
var ts = (e) => hs(e, bs, Jo);
var ns = (e) => hs(e, xs, G);
var rs = (e) => hs(e, Cs, qo);
var is = (e) => hs(e, Ss, Yo);
var as = (e) => hs(e, _s, Yo);
var os = (e) => hs(e, vs, Zo);
var ss = (e) => hs(e, ws, Xo);
var q = (e) => Io.test(e);
var cs = (e) => gs(e, bs);
var ls = (e) => gs(e, Ss);
var us = (e) => gs(e, _s);
var ds = (e) => gs(e, ys);
var fs = (e) => gs(e, vs);
var ps = (e) => gs(e, ws, !0);
var ms = (e) => gs(e, Cs, !0);
var hs = (e, t, n) => {
    let r = Fo.exec(e);
    return r ? (r[1] ? t(r[1]) : n(r[2])) : !1;
  };
var gs = (e, t, n = !1) => {
    let r = Io.exec(e);
    return r ? (r[1] ? t(r[1]) : n) : !1;
  };
var _s = (e) => e === `position` || e === `percentage`;
var vs = (e) => e === `image` || e === `url`;
var ys = (e) => e === `length` || e === `size` || e === `bg-size`;
var bs = (e) => e === `length`;
var xs = (e) => e === `number`;
var Ss = (e) => e === `family-name`;
var Cs = (e) => e === `number` || e === `weight`;
var ws = (e) => e === `shadow`;
var Ts = Mo(() => {
    let e = Po(`color`),
      t = Po(`font`),
      n = Po(`text`),
      r = Po(`font-weight`),
      i = Po(`tracking`),
      a = Po(`leading`),
      o = Po(`breakpoint`),
      s = Po(`container`),
      c = Po(`spacing`),
      l = Po(`radius`),
      u = Po(`shadow`),
      d = Po(`inset-shadow`),
      f = Po(`text-shadow`),
      p = Po(`drop-shadow`),
      m = Po(`blur`),
      h = Po(`perspective`),
      g = Po(`aspect`),
      _ = Po(`ease`),
      v = Po(`animate`),
      y = () => [
        `auto`,
        `avoid`,
        `all`,
        `avoid-page`,
        `page`,
        `left`,
        `right`,
        `column`,
      ],
      b = () => [
        `center`,
        `top`,
        `bottom`,
        `left`,
        `right`,
        `top-left`,
        `left-top`,
        `top-right`,
        `right-top`,
        `bottom-right`,
        `right-bottom`,
        `bottom-left`,
        `left-bottom`,
      ],
      x = () => [...b(), q, K],
      S = () => [`auto`, `hidden`, `clip`, `visible`, `scroll`],
      C = () => [`auto`, `contain`, `none`],
      w = () => [q, K, c],
      T = () => [Uo, `full`, `auto`, ...w()],
      ee = () => [Wo, `none`, `subgrid`, q, K],
      E = () => [`auto`, { span: [`full`, Wo, q, K] }, Wo, q, K],
      D = () => [Wo, `auto`, q, K],
      te = () => [`auto`, `min`, `max`, `fr`, q, K],
      ne = () => [
        `start`,
        `end`,
        `center`,
        `between`,
        `around`,
        `evenly`,
        `stretch`,
        `baseline`,
        `center-safe`,
        `end-safe`,
      ],
      O = () => [
        `start`,
        `end`,
        `center`,
        `stretch`,
        `center-safe`,
        `end-safe`,
      ],
      re = () => [`auto`, ...w()],
      k = () => [
        Uo,
        `auto`,
        `full`,
        `dvw`,
        `dvh`,
        `lvw`,
        `lvh`,
        `svw`,
        `svh`,
        `min`,
        `max`,
        `fit`,
        ...w(),
      ],
      ie = () => [
        Uo,
        `screen`,
        `full`,
        `dvw`,
        `lvw`,
        `svw`,
        `min`,
        `max`,
        `fit`,
        ...w(),
      ],
      ae = () => [
        Uo,
        `screen`,
        `full`,
        `lh`,
        `dvh`,
        `lvh`,
        `svh`,
        `min`,
        `max`,
        `fit`,
        ...w(),
      ],
      A = () => [e, q, K],
      j = () => [...b(), us, as, { position: [q, K] }],
      oe = () => [`no-repeat`, { repeat: [``, `x`, `y`, `space`, `round`] }],
      se = () => [`auto`, `cover`, `contain`, ds, es, { size: [q, K] }],
      ce = () => [Go, cs, ts],
      le = () => [``, `none`, `full`, l, q, K],
      M = () => [``, G, cs, ts],
      N = () => [`solid`, `dashed`, `dotted`, `double`],
      ue = () => [
        `normal`,
        `multiply`,
        `screen`,
        `overlay`,
        `darken`,
        `lighten`,
        `color-dodge`,
        `color-burn`,
        `hard-light`,
        `soft-light`,
        `difference`,
        `exclusion`,
        `hue`,
        `saturation`,
        `color`,
        `luminosity`,
      ],
      P = () => [G, Go, us, as],
      de = () => [``, `none`, m, q, K],
      fe = () => [`none`, G, q, K],
      pe = () => [`none`, G, q, K],
      me = () => [G, q, K],
      he = () => [Uo, `full`, ...w()];
    return {
      cacheSize: 500,
      theme: {
        animate: [`spin`, `ping`, `pulse`, `bounce`],
        aspect: [`video`],
        blur: [Ko],
        breakpoint: [Ko],
        color: [qo],
        container: [Ko],
        "drop-shadow": [Ko],
        ease: [`in`, `out`, `in-out`],
        font: [Qo],
        "font-weight": [
          `thin`,
          `extralight`,
          `light`,
          `normal`,
          `medium`,
          `semibold`,
          `bold`,
          `extrabold`,
          `black`,
        ],
        "inset-shadow": [Ko],
        leading: [`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`],
        perspective: [
          `dramatic`,
          `near`,
          `normal`,
          `midrange`,
          `distant`,
          `none`,
        ],
        radius: [Ko],
        shadow: [Ko],
        spacing: [`px`, G],
        text: [Ko],
        "text-shadow": [Ko],
        tracking: [`tighter`, `tight`, `normal`, `wide`, `wider`, `widest`],
      },
      classGroups: {
        aspect: [{ aspect: [`auto`, `square`, Uo, K, q, g] }],
        container: [`container`],
        "container-type": [{ "@container": [``, `normal`, `size`, q, K] }],
        "container-named": [$o],
        columns: [{ columns: [G, K, q, s] }],
        "break-after": [{ "break-after": y() }],
        "break-before": [{ "break-before": y() }],
        "break-inside": [
          { "break-inside": [`auto`, `avoid`, `avoid-page`, `avoid-column`] },
        ],
        "box-decoration": [{ "box-decoration": [`slice`, `clone`] }],
        box: [{ box: [`border`, `content`] }],
        display: [
          `block`,
          `inline-block`,
          `inline`,
          `flex`,
          `inline-flex`,
          `table`,
          `inline-table`,
          `table-caption`,
          `table-cell`,
          `table-column`,
          `table-column-group`,
          `table-footer-group`,
          `table-header-group`,
          `table-row-group`,
          `table-row`,
          `flow-root`,
          `grid`,
          `inline-grid`,
          `contents`,
          `list-item`,
          `hidden`,
        ],
        sr: [`sr-only`, `not-sr-only`],
        float: [{ float: [`right`, `left`, `none`, `start`, `end`] }],
        clear: [{ clear: [`left`, `right`, `both`, `none`, `start`, `end`] }],
        isolation: [`isolate`, `isolation-auto`],
        "object-fit": [
          { object: [`contain`, `cover`, `fill`, `none`, `scale-down`] },
        ],
        "object-position": [{ object: x() }],
        overflow: [{ overflow: S() }],
        "overflow-x": [{ "overflow-x": S() }],
        "overflow-y": [{ "overflow-y": S() }],
        overscroll: [{ overscroll: C() }],
        "overscroll-x": [{ "overscroll-x": C() }],
        "overscroll-y": [{ "overscroll-y": C() }],
        position: [`static`, `fixed`, `absolute`, `relative`, `sticky`],
        inset: [{ inset: T() }],
        "inset-x": [{ "inset-x": T() }],
        "inset-y": [{ "inset-y": T() }],
        start: [{ "inset-s": T(), start: T() }],
        end: [{ "inset-e": T(), end: T() }],
        "inset-bs": [{ "inset-bs": T() }],
        "inset-be": [{ "inset-be": T() }],
        top: [{ top: T() }],
        right: [{ right: T() }],
        bottom: [{ bottom: T() }],
        left: [{ left: T() }],
        visibility: [`visible`, `invisible`, `collapse`],
        z: [{ z: [Wo, `auto`, q, K] }],
        basis: [{ basis: [Uo, `full`, `auto`, s, ...w()] }],
        "flex-direction": [
          { flex: [`row`, `row-reverse`, `col`, `col-reverse`] },
        ],
        "flex-wrap": [{ flex: [`nowrap`, `wrap`, `wrap-reverse`] }],
        flex: [{ flex: [G, Uo, `auto`, `initial`, `none`, K] }],
        grow: [{ grow: [``, G, q, K] }],
        shrink: [{ shrink: [``, G, q, K] }],
        order: [{ order: [Wo, `first`, `last`, `none`, q, K] }],
        "grid-cols": [{ "grid-cols": ee() }],
        "col-start-end": [{ col: E() }],
        "col-start": [{ "col-start": D() }],
        "col-end": [{ "col-end": D() }],
        "grid-rows": [{ "grid-rows": ee() }],
        "row-start-end": [{ row: E() }],
        "row-start": [{ "row-start": D() }],
        "row-end": [{ "row-end": D() }],
        "grid-flow": [
          { "grid-flow": [`row`, `col`, `dense`, `row-dense`, `col-dense`] },
        ],
        "auto-cols": [{ "auto-cols": te() }],
        "auto-rows": [{ "auto-rows": te() }],
        gap: [{ gap: w() }],
        "gap-x": [{ "gap-x": w() }],
        "gap-y": [{ "gap-y": w() }],
        "justify-content": [{ justify: [...ne(), `normal`] }],
        "justify-items": [{ "justify-items": [...O(), `normal`] }],
        "justify-self": [{ "justify-self": [`auto`, ...O()] }],
        "align-content": [{ content: [`normal`, ...ne()] }],
        "align-items": [{ items: [...O(), { baseline: [``, `last`] }] }],
        "align-self": [{ self: [`auto`, ...O(), { baseline: [``, `last`] }] }],
        "place-content": [{ "place-content": ne() }],
        "place-items": [{ "place-items": [...O(), `baseline`] }],
        "place-self": [{ "place-self": [`auto`, ...O()] }],
        p: [{ p: w() }],
        px: [{ px: w() }],
        py: [{ py: w() }],
        ps: [{ ps: w() }],
        pe: [{ pe: w() }],
        pbs: [{ pbs: w() }],
        pbe: [{ pbe: w() }],
        pt: [{ pt: w() }],
        pr: [{ pr: w() }],
        pb: [{ pb: w() }],
        pl: [{ pl: w() }],
        m: [{ m: re() }],
        mx: [{ mx: re() }],
        my: [{ my: re() }],
        ms: [{ ms: re() }],
        me: [{ me: re() }],
        mbs: [{ mbs: re() }],
        mbe: [{ mbe: re() }],
        mt: [{ mt: re() }],
        mr: [{ mr: re() }],
        mb: [{ mb: re() }],
        ml: [{ ml: re() }],
        "space-x": [{ "space-x": w() }],
        "space-x-reverse": [`space-x-reverse`],
        "space-y": [{ "space-y": w() }],
        "space-y-reverse": [`space-y-reverse`],
        size: [{ size: k() }],
        "inline-size": [{ inline: [`auto`, ...ie()] }],
        "min-inline-size": [{ "min-inline": [`auto`, ...ie()] }],
        "max-inline-size": [{ "max-inline": [`none`, ...ie()] }],
        "block-size": [{ block: [`auto`, ...ae()] }],
        "min-block-size": [{ "min-block": [`auto`, ...ae()] }],
        "max-block-size": [{ "max-block": [`none`, ...ae()] }],
        w: [{ w: [s, `screen`, ...k()] }],
        "min-w": [{ "min-w": [s, `screen`, `none`, ...k()] }],
        "max-w": [
          { "max-w": [s, `screen`, `none`, `prose`, { screen: [o] }, ...k()] },
        ],
        h: [{ h: [`screen`, `lh`, ...k()] }],
        "min-h": [{ "min-h": [`screen`, `lh`, `none`, ...k()] }],
        "max-h": [{ "max-h": [`screen`, `lh`, ...k()] }],
        "font-size": [{ text: [`base`, n, cs, ts] }],
        "font-smoothing": [`antialiased`, `subpixel-antialiased`],
        "font-style": [`italic`, `not-italic`],
        "font-weight": [{ font: [r, ms, rs] }],
        "font-stretch": [
          {
            "font-stretch": [
              `ultra-condensed`,
              `extra-condensed`,
              `condensed`,
              `semi-condensed`,
              `normal`,
              `semi-expanded`,
              `expanded`,
              `extra-expanded`,
              `ultra-expanded`,
              Go,
              K,
            ],
          },
        ],
        "font-family": [{ font: [ls, is, t] }],
        "font-features": [{ "font-features": [K] }],
        "fvn-normal": [`normal-nums`],
        "fvn-ordinal": [`ordinal`],
        "fvn-slashed-zero": [`slashed-zero`],
        "fvn-figure": [`lining-nums`, `oldstyle-nums`],
        "fvn-spacing": [`proportional-nums`, `tabular-nums`],
        "fvn-fraction": [`diagonal-fractions`, `stacked-fractions`],
        tracking: [{ tracking: [i, q, K] }],
        "line-clamp": [{ "line-clamp": [G, `none`, q, ns] }],
        leading: [{ leading: [a, ...w()] }],
        "list-image": [{ "list-image": [`none`, q, K] }],
        "list-style-position": [{ list: [`inside`, `outside`] }],
        "list-style-type": [{ list: [`disc`, `decimal`, `none`, q, K] }],
        "text-alignment": [
          { text: [`left`, `center`, `right`, `justify`, `start`, `end`] },
        ],
        "placeholder-color": [{ placeholder: A() }],
        "text-color": [{ text: A() }],
        "text-decoration": [
          `underline`,
          `overline`,
          `line-through`,
          `no-underline`,
        ],
        "text-decoration-style": [{ decoration: [...N(), `wavy`] }],
        "text-decoration-thickness": [
          { decoration: [G, `from-font`, `auto`, q, ts] },
        ],
        "text-decoration-color": [{ decoration: A() }],
        "underline-offset": [{ "underline-offset": [G, `auto`, q, K] }],
        "text-transform": [
          `uppercase`,
          `lowercase`,
          `capitalize`,
          `normal-case`,
        ],
        "text-overflow": [`truncate`, `text-ellipsis`, `text-clip`],
        "text-wrap": [{ text: [`wrap`, `nowrap`, `balance`, `pretty`] }],
        indent: [{ indent: w() }],
        "tab-size": [{ tab: [Wo, q, K] }],
        "vertical-align": [
          {
            align: [
              `baseline`,
              `top`,
              `middle`,
              `bottom`,
              `text-top`,
              `text-bottom`,
              `sub`,
              `super`,
              q,
              K,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              `normal`,
              `nowrap`,
              `pre`,
              `pre-line`,
              `pre-wrap`,
              `break-spaces`,
            ],
          },
        ],
        break: [{ break: [`normal`, `words`, `all`, `keep`] }],
        wrap: [{ wrap: [`break-word`, `anywhere`, `normal`] }],
        hyphens: [{ hyphens: [`none`, `manual`, `auto`] }],
        content: [{ content: [`none`, q, K] }],
        "bg-attachment": [{ bg: [`fixed`, `local`, `scroll`] }],
        "bg-clip": [{ "bg-clip": [`border`, `padding`, `content`, `text`] }],
        "bg-origin": [{ "bg-origin": [`border`, `padding`, `content`] }],
        "bg-position": [{ bg: j() }],
        "bg-repeat": [{ bg: oe() }],
        "bg-size": [{ bg: se() }],
        "bg-image": [
          {
            bg: [
              `none`,
              {
                linear: [
                  { to: [`t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`] },
                  Wo,
                  q,
                  K,
                ],
                radial: [``, q, K],
                conic: [Wo, q, K],
              },
              fs,
              os,
            ],
          },
        ],
        "bg-color": [{ bg: A() }],
        "gradient-from-pos": [{ from: ce() }],
        "gradient-via-pos": [{ via: ce() }],
        "gradient-to-pos": [{ to: ce() }],
        "gradient-from": [{ from: A() }],
        "gradient-via": [{ via: A() }],
        "gradient-to": [{ to: A() }],
        rounded: [{ rounded: le() }],
        "rounded-s": [{ "rounded-s": le() }],
        "rounded-e": [{ "rounded-e": le() }],
        "rounded-t": [{ "rounded-t": le() }],
        "rounded-r": [{ "rounded-r": le() }],
        "rounded-b": [{ "rounded-b": le() }],
        "rounded-l": [{ "rounded-l": le() }],
        "rounded-ss": [{ "rounded-ss": le() }],
        "rounded-se": [{ "rounded-se": le() }],
        "rounded-ee": [{ "rounded-ee": le() }],
        "rounded-es": [{ "rounded-es": le() }],
        "rounded-tl": [{ "rounded-tl": le() }],
        "rounded-tr": [{ "rounded-tr": le() }],
        "rounded-br": [{ "rounded-br": le() }],
        "rounded-bl": [{ "rounded-bl": le() }],
        "border-w": [{ border: M() }],
        "border-w-x": [{ "border-x": M() }],
        "border-w-y": [{ "border-y": M() }],
        "border-w-s": [{ "border-s": M() }],
        "border-w-e": [{ "border-e": M() }],
        "border-w-bs": [{ "border-bs": M() }],
        "border-w-be": [{ "border-be": M() }],
        "border-w-t": [{ "border-t": M() }],
        "border-w-r": [{ "border-r": M() }],
        "border-w-b": [{ "border-b": M() }],
        "border-w-l": [{ "border-l": M() }],
        "divide-x": [{ "divide-x": M() }],
        "divide-x-reverse": [`divide-x-reverse`],
        "divide-y": [{ "divide-y": M() }],
        "divide-y-reverse": [`divide-y-reverse`],
        "border-style": [{ border: [...N(), `hidden`, `none`] }],
        "divide-style": [{ divide: [...N(), `hidden`, `none`] }],
        "border-color": [{ border: A() }],
        "border-color-x": [{ "border-x": A() }],
        "border-color-y": [{ "border-y": A() }],
        "border-color-s": [{ "border-s": A() }],
        "border-color-e": [{ "border-e": A() }],
        "border-color-bs": [{ "border-bs": A() }],
        "border-color-be": [{ "border-be": A() }],
        "border-color-t": [{ "border-t": A() }],
        "border-color-r": [{ "border-r": A() }],
        "border-color-b": [{ "border-b": A() }],
        "border-color-l": [{ "border-l": A() }],
        "divide-color": [{ divide: A() }],
        "outline-style": [{ outline: [...N(), `none`, `hidden`] }],
        "outline-offset": [{ "outline-offset": [G, q, K] }],
        "outline-w": [{ outline: [``, G, cs, ts] }],
        "outline-color": [{ outline: A() }],
        shadow: [{ shadow: [``, `none`, u, ps, ss] }],
        "shadow-color": [{ shadow: A() }],
        "inset-shadow": [{ "inset-shadow": [`none`, d, ps, ss] }],
        "inset-shadow-color": [{ "inset-shadow": A() }],
        "ring-w": [{ ring: M() }],
        "ring-w-inset": [`ring-inset`],
        "ring-color": [{ ring: A() }],
        "ring-offset-w": [{ "ring-offset": [G, ts] }],
        "ring-offset-color": [{ "ring-offset": A() }],
        "inset-ring-w": [{ "inset-ring": M() }],
        "inset-ring-color": [{ "inset-ring": A() }],
        "text-shadow": [{ "text-shadow": [`none`, f, ps, ss] }],
        "text-shadow-color": [{ "text-shadow": A() }],
        opacity: [{ opacity: [G, q, K] }],
        "mix-blend": [
          { "mix-blend": [...ue(), `plus-darker`, `plus-lighter`] },
        ],
        "bg-blend": [{ "bg-blend": ue() }],
        "mask-clip": [
          {
            "mask-clip": [
              `border`,
              `padding`,
              `content`,
              `fill`,
              `stroke`,
              `view`,
            ],
          },
          `mask-no-clip`,
        ],
        "mask-composite": [
          { mask: [`add`, `subtract`, `intersect`, `exclude`] },
        ],
        "mask-image-linear-pos": [{ "mask-linear": [G] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": P() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": P() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": A() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": A() }],
        "mask-image-t-from-pos": [{ "mask-t-from": P() }],
        "mask-image-t-to-pos": [{ "mask-t-to": P() }],
        "mask-image-t-from-color": [{ "mask-t-from": A() }],
        "mask-image-t-to-color": [{ "mask-t-to": A() }],
        "mask-image-r-from-pos": [{ "mask-r-from": P() }],
        "mask-image-r-to-pos": [{ "mask-r-to": P() }],
        "mask-image-r-from-color": [{ "mask-r-from": A() }],
        "mask-image-r-to-color": [{ "mask-r-to": A() }],
        "mask-image-b-from-pos": [{ "mask-b-from": P() }],
        "mask-image-b-to-pos": [{ "mask-b-to": P() }],
        "mask-image-b-from-color": [{ "mask-b-from": A() }],
        "mask-image-b-to-color": [{ "mask-b-to": A() }],
        "mask-image-l-from-pos": [{ "mask-l-from": P() }],
        "mask-image-l-to-pos": [{ "mask-l-to": P() }],
        "mask-image-l-from-color": [{ "mask-l-from": A() }],
        "mask-image-l-to-color": [{ "mask-l-to": A() }],
        "mask-image-x-from-pos": [{ "mask-x-from": P() }],
        "mask-image-x-to-pos": [{ "mask-x-to": P() }],
        "mask-image-x-from-color": [{ "mask-x-from": A() }],
        "mask-image-x-to-color": [{ "mask-x-to": A() }],
        "mask-image-y-from-pos": [{ "mask-y-from": P() }],
        "mask-image-y-to-pos": [{ "mask-y-to": P() }],
        "mask-image-y-from-color": [{ "mask-y-from": A() }],
        "mask-image-y-to-color": [{ "mask-y-to": A() }],
        "mask-image-radial": [{ "mask-radial": [q, K] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": P() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": P() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": A() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": A() }],
        "mask-image-radial-shape": [{ "mask-radial": [`circle`, `ellipse`] }],
        "mask-image-radial-size": [
          {
            "mask-radial": [
              { closest: [`side`, `corner`], farthest: [`side`, `corner`] },
            ],
          },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": b() }],
        "mask-image-conic-pos": [{ "mask-conic": [G] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": P() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": P() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": A() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": A() }],
        "mask-mode": [{ mask: [`alpha`, `luminance`, `match`] }],
        "mask-origin": [
          {
            "mask-origin": [
              `border`,
              `padding`,
              `content`,
              `fill`,
              `stroke`,
              `view`,
            ],
          },
        ],
        "mask-position": [{ mask: j() }],
        "mask-repeat": [{ mask: oe() }],
        "mask-size": [{ mask: se() }],
        "mask-type": [{ "mask-type": [`alpha`, `luminance`] }],
        "mask-image": [{ mask: [`none`, q, K] }],
        filter: [{ filter: [``, `none`, q, K] }],
        blur: [{ blur: de() }],
        brightness: [{ brightness: [G, q, K] }],
        contrast: [{ contrast: [G, q, K] }],
        "drop-shadow": [{ "drop-shadow": [``, `none`, p, ps, ss] }],
        "drop-shadow-color": [{ "drop-shadow": A() }],
        grayscale: [{ grayscale: [``, G, q, K] }],
        "hue-rotate": [{ "hue-rotate": [G, q, K] }],
        invert: [{ invert: [``, G, q, K] }],
        saturate: [{ saturate: [G, q, K] }],
        sepia: [{ sepia: [``, G, q, K] }],
        "backdrop-filter": [{ "backdrop-filter": [``, `none`, q, K] }],
        "backdrop-blur": [{ "backdrop-blur": de() }],
        "backdrop-brightness": [{ "backdrop-brightness": [G, q, K] }],
        "backdrop-contrast": [{ "backdrop-contrast": [G, q, K] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": [``, G, q, K] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [G, q, K] }],
        "backdrop-invert": [{ "backdrop-invert": [``, G, q, K] }],
        "backdrop-opacity": [{ "backdrop-opacity": [G, q, K] }],
        "backdrop-saturate": [{ "backdrop-saturate": [G, q, K] }],
        "backdrop-sepia": [{ "backdrop-sepia": [``, G, q, K] }],
        "border-collapse": [{ border: [`collapse`, `separate`] }],
        "border-spacing": [{ "border-spacing": w() }],
        "border-spacing-x": [{ "border-spacing-x": w() }],
        "border-spacing-y": [{ "border-spacing-y": w() }],
        "table-layout": [{ table: [`auto`, `fixed`] }],
        caption: [{ caption: [`top`, `bottom`] }],
        transition: [
          {
            transition: [
              ``,
              `all`,
              `colors`,
              `opacity`,
              `shadow`,
              `transform`,
              `none`,
              q,
              K,
            ],
          },
        ],
        "transition-behavior": [{ transition: [`normal`, `discrete`] }],
        duration: [{ duration: [G, `initial`, q, K] }],
        ease: [{ ease: [`linear`, `initial`, _, q, K] }],
        delay: [{ delay: [G, q, K] }],
        animate: [{ animate: [`none`, v, q, K] }],
        backface: [{ backface: [`hidden`, `visible`] }],
        perspective: [{ perspective: [h, q, K] }],
        "perspective-origin": [{ "perspective-origin": x() }],
        rotate: [{ rotate: fe() }],
        "rotate-x": [{ "rotate-x": fe() }],
        "rotate-y": [{ "rotate-y": fe() }],
        "rotate-z": [{ "rotate-z": fe() }],
        scale: [{ scale: pe() }],
        "scale-x": [{ "scale-x": pe() }],
        "scale-y": [{ "scale-y": pe() }],
        "scale-z": [{ "scale-z": pe() }],
        "scale-3d": [`scale-3d`],
        skew: [{ skew: me() }],
        "skew-x": [{ "skew-x": me() }],
        "skew-y": [{ "skew-y": me() }],
        transform: [{ transform: [q, K, ``, `none`, `gpu`, `cpu`] }],
        "transform-origin": [{ origin: x() }],
        "transform-style": [{ transform: [`3d`, `flat`] }],
        translate: [{ translate: he() }],
        "translate-x": [{ "translate-x": he() }],
        "translate-y": [{ "translate-y": he() }],
        "translate-z": [{ "translate-z": he() }],
        "translate-none": [`translate-none`],
        zoom: [{ zoom: [Wo, q, K] }],
        accent: [{ accent: A() }],
        appearance: [{ appearance: [`none`, `auto`] }],
        "caret-color": [{ caret: A() }],
        "color-scheme": [
          {
            scheme: [
              `normal`,
              `dark`,
              `light`,
              `light-dark`,
              `only-dark`,
              `only-light`,
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              `auto`,
              `default`,
              `pointer`,
              `wait`,
              `text`,
              `move`,
              `help`,
              `not-allowed`,
              `none`,
              `context-menu`,
              `progress`,
              `cell`,
              `crosshair`,
              `vertical-text`,
              `alias`,
              `copy`,
              `no-drop`,
              `grab`,
              `grabbing`,
              `all-scroll`,
              `col-resize`,
              `row-resize`,
              `n-resize`,
              `e-resize`,
              `s-resize`,
              `w-resize`,
              `ne-resize`,
              `nw-resize`,
              `se-resize`,
              `sw-resize`,
              `ew-resize`,
              `ns-resize`,
              `nesw-resize`,
              `nwse-resize`,
              `zoom-in`,
              `zoom-out`,
              q,
              K,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": [`fixed`, `content`] }],
        "pointer-events": [{ "pointer-events": [`auto`, `none`] }],
        resize: [{ resize: [`none`, ``, `y`, `x`] }],
        "scroll-behavior": [{ scroll: [`auto`, `smooth`] }],
        "scrollbar-thumb-color": [{ "scrollbar-thumb": A() }],
        "scrollbar-track-color": [{ "scrollbar-track": A() }],
        "scrollbar-gutter": [
          { "scrollbar-gutter": [`auto`, `stable`, `both`] },
        ],
        "scrollbar-w": [{ scrollbar: [`auto`, `thin`, `none`] }],
        "scroll-m": [{ "scroll-m": w() }],
        "scroll-mx": [{ "scroll-mx": w() }],
        "scroll-my": [{ "scroll-my": w() }],
        "scroll-ms": [{ "scroll-ms": w() }],
        "scroll-me": [{ "scroll-me": w() }],
        "scroll-mbs": [{ "scroll-mbs": w() }],
        "scroll-mbe": [{ "scroll-mbe": w() }],
        "scroll-mt": [{ "scroll-mt": w() }],
        "scroll-mr": [{ "scroll-mr": w() }],
        "scroll-mb": [{ "scroll-mb": w() }],
        "scroll-ml": [{ "scroll-ml": w() }],
        "scroll-p": [{ "scroll-p": w() }],
        "scroll-px": [{ "scroll-px": w() }],
        "scroll-py": [{ "scroll-py": w() }],
        "scroll-ps": [{ "scroll-ps": w() }],
        "scroll-pe": [{ "scroll-pe": w() }],
        "scroll-pbs": [{ "scroll-pbs": w() }],
        "scroll-pbe": [{ "scroll-pbe": w() }],
        "scroll-pt": [{ "scroll-pt": w() }],
        "scroll-pr": [{ "scroll-pr": w() }],
        "scroll-pb": [{ "scroll-pb": w() }],
        "scroll-pl": [{ "scroll-pl": w() }],
        "snap-align": [{ snap: [`start`, `end`, `center`, `align-none`] }],
        "snap-stop": [{ snap: [`normal`, `always`] }],
        "snap-type": [{ snap: [`none`, `x`, `y`, `both`] }],
        "snap-strictness": [{ snap: [`mandatory`, `proximity`] }],
        touch: [{ touch: [`auto`, `none`, `manipulation`] }],
        "touch-x": [{ "touch-pan": [`x`, `left`, `right`] }],
        "touch-y": [{ "touch-pan": [`y`, `up`, `down`] }],
        "touch-pz": [`touch-pinch-zoom`],
        select: [{ select: [`none`, `text`, `all`, `auto`] }],
        "will-change": [
          { "will-change": [`auto`, `scroll`, `contents`, `transform`, q, K] },
        ],
        fill: [{ fill: [`none`, ...A()] }],
        "stroke-w": [{ stroke: [G, cs, ts, ns] }],
        stroke: [{ stroke: [`none`, ...A()] }],
        "forced-color-adjust": [{ "forced-color-adjust": [`auto`, `none`] }],
      },
      conflictingClassGroups: {
        "container-named": [`container-type`],
        overflow: [`overflow-x`, `overflow-y`],
        overscroll: [`overscroll-x`, `overscroll-y`],
        inset: [
          `inset-x`,
          `inset-y`,
          `inset-bs`,
          `inset-be`,
          `start`,
          `end`,
          `top`,
          `right`,
          `bottom`,
          `left`,
        ],
        "inset-x": [`right`, `left`],
        "inset-y": [`top`, `bottom`],
        flex: [`basis`, `grow`, `shrink`],
        gap: [`gap-x`, `gap-y`],
        p: [`px`, `py`, `ps`, `pe`, `pbs`, `pbe`, `pt`, `pr`, `pb`, `pl`],
        px: [`pr`, `pl`],
        py: [`pt`, `pb`],
        m: [`mx`, `my`, `ms`, `me`, `mbs`, `mbe`, `mt`, `mr`, `mb`, `ml`],
        mx: [`mr`, `ml`],
        my: [`mt`, `mb`],
        size: [`w`, `h`],
        "font-size": [`leading`],
        "fvn-normal": [
          `fvn-ordinal`,
          `fvn-slashed-zero`,
          `fvn-figure`,
          `fvn-spacing`,
          `fvn-fraction`,
        ],
        "fvn-ordinal": [`fvn-normal`],
        "fvn-slashed-zero": [`fvn-normal`],
        "fvn-figure": [`fvn-normal`],
        "fvn-spacing": [`fvn-normal`],
        "fvn-fraction": [`fvn-normal`],
        "line-clamp": [`display`, `overflow`],
        rounded: [
          `rounded-s`,
          `rounded-e`,
          `rounded-t`,
          `rounded-r`,
          `rounded-b`,
          `rounded-l`,
          `rounded-ss`,
          `rounded-se`,
          `rounded-ee`,
          `rounded-es`,
          `rounded-tl`,
          `rounded-tr`,
          `rounded-br`,
          `rounded-bl`,
        ],
        "rounded-s": [`rounded-ss`, `rounded-es`],
        "rounded-e": [`rounded-se`, `rounded-ee`],
        "rounded-t": [`rounded-tl`, `rounded-tr`],
        "rounded-r": [`rounded-tr`, `rounded-br`],
        "rounded-b": [`rounded-br`, `rounded-bl`],
        "rounded-l": [`rounded-tl`, `rounded-bl`],
        "border-spacing": [`border-spacing-x`, `border-spacing-y`],
        "border-w": [
          `border-w-x`,
          `border-w-y`,
          `border-w-s`,
          `border-w-e`,
          `border-w-bs`,
          `border-w-be`,
          `border-w-t`,
          `border-w-r`,
          `border-w-b`,
          `border-w-l`,
        ],
        "border-w-x": [`border-w-r`, `border-w-l`],
        "border-w-y": [`border-w-t`, `border-w-b`],
        "border-color": [
          `border-color-x`,
          `border-color-y`,
          `border-color-s`,
          `border-color-e`,
          `border-color-bs`,
          `border-color-be`,
          `border-color-t`,
          `border-color-r`,
          `border-color-b`,
          `border-color-l`,
        ],
        "border-color-x": [`border-color-r`, `border-color-l`],
        "border-color-y": [`border-color-t`, `border-color-b`],
        translate: [`translate-x`, `translate-y`, `translate-none`],
        "translate-none": [
          `translate`,
          `translate-x`,
          `translate-y`,
          `translate-z`,
        ],
        "scroll-m": [
          `scroll-mx`,
          `scroll-my`,
          `scroll-ms`,
          `scroll-me`,
          `scroll-mbs`,
          `scroll-mbe`,
          `scroll-mt`,
          `scroll-mr`,
          `scroll-mb`,
          `scroll-ml`,
        ],
        "scroll-mx": [`scroll-mr`, `scroll-ml`],
        "scroll-my": [`scroll-mt`, `scroll-mb`],
        "scroll-p": [
          `scroll-px`,
          `scroll-py`,
          `scroll-ps`,
          `scroll-pe`,
          `scroll-pbs`,
          `scroll-pbe`,
          `scroll-pt`,
          `scroll-pr`,
          `scroll-pb`,
          `scroll-pl`,
        ],
        "scroll-px": [`scroll-pr`, `scroll-pl`],
        "scroll-py": [`scroll-pt`, `scroll-pb`],
        touch: [`touch-x`, `touch-y`, `touch-pz`],
        "touch-x": [`touch`],
        "touch-y": [`touch`],
        "touch-pz": [`touch`],
      },
      conflictingClassGroupModifiers: { "font-size": [`leading`] },
      postfixLookupClassGroups: [`container-type`],
      orderSensitiveModifiers: [
        `*`,
        `**`,
        `after`,
        `backdrop`,
        `before`,
        `details-content`,
        `file`,
        `first-letter`,
        `first-line`,
        `marker`,
        `placeholder`,
        `selection`,
      ],
    };
  });
function Es(...e) {
  return Ts(eo(e));
}
var Ds = (e) => (typeof e == `boolean` ? `${e}` : e === 0 ? `0` : e);
var Os = eo;
var ks = (e, t) => (n) => {
    if (t?.variants == null) return Os(e, n?.class, n?.className);
    let { variants: r, defaultVariants: i } = t,
      a = Object.keys(r).map((e) => {
        let t = n?.[e],
          a = i?.[e];
        if (t === null) return null;
        let o = Ds(t) || Ds(a);
        return r[e][o];
      }),
      o =
        n &&
        Object.entries(n).reduce((e, t) => {
          let [n, r] = t;
          return (r === void 0 || (e[n] = r), e);
        }, {});
    return Os(
      e,
      a,
      t?.compoundVariants?.reduce((e, t) => {
        let { class: n, className: r, ...a } = t;
        return Object.entries(a).every((e) => {
          let [t, n] = e;
          return Array.isArray(n)
            ? n.includes({ ...i, ...o }[t])
            : { ...i, ...o }[t] === n;
        })
          ? [...e, n, r]
          : e;
      }, []),
      n?.class,
      n?.className,
    );
  };
function As({ ...e }) {
  return (0, F.jsx)(_i, { "data-slot": `dialog`, ...e });
}
function js({ ...e }) {
  return (0, F.jsx)(xi, { "data-slot": `dialog-portal`, ...e });
}
function Ms({ className: e, ...t }) {
  return (0, F.jsx)(Ci, {
    "data-slot": `dialog-overlay`,
    className: Es(
      `fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0`,
      e,
    ),
    ...t,
  });
}
function Ns({ className: e, children: t, showCloseButton: n = !0, ...r }) {
  return (0, F.jsxs)(js, {
    "data-slot": `dialog-portal`,
    children: [
      (0, F.jsx)(Ms, {}),
      (0, F.jsxs)(Di, {
        "data-slot": `dialog-content`,
        className: Es(
          `fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg`,
          e,
        ),
        ...r,
        children: [
          t,
          n &&
            (0, F.jsxs)(Fi, {
              "data-slot": `dialog-close`,
              className: `absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
              children: [
                (0, F.jsx)(je, {}),
                (0, F.jsx)(`span`, { className: `sr-only`, children: `Close` }),
              ],
            }),
        ],
      }),
    ],
  });
}
function Ps({ className: e, ...t }) {
  return (0, F.jsx)(`div`, {
    "data-slot": `dialog-header`,
    className: Es(`flex flex-col gap-2 text-center sm:text-left`, e),
    ...t,
  });
}
function Fs({ className: e, ...t }) {
  return (0, F.jsx)(ji, {
    "data-slot": `dialog-title`,
    className: Es(`text-lg leading-none font-semibold`, e),
    ...t,
  });
}
function Is({ className: e, ...t }) {
  return (0, F.jsx)(Ni, {
    "data-slot": `dialog-description`,
    className: Es(`text-sm text-muted-foreground`, e),
    ...t,
  });
}
function Ls({ className: e, orientation: t = `horizontal`, ...n }) {
  return (0, F.jsx)(Ya, {
    "data-slot": `tabs`,
    "data-orientation": t,
    orientation: t,
    className: Es(
      `group/tabs flex gap-2 data-[orientation=horizontal]:flex-col`,
      e,
    ),
    ...n,
  });
}
var Rs = ks(
  `group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none`,
  {
    variants: {
      variant: { default: `bg-muted`, line: `gap-1 bg-transparent` },
    },
    defaultVariants: { variant: `default` },
  },
);
function zs({ className: e, variant: t = `default`, ...n }) {
  return (0, F.jsx)(Xa, {
    "data-slot": `tabs-list`,
    "data-variant": t,
    className: Es(Rs({ variant: t }), e),
    ...n,
  });
}
function Bs({ className: e, ...t }) {
  return (0, F.jsx)(Za, {
    "data-slot": `tabs-trigger`,
    className: Es(
      `relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
      `group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent`,
      `data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground`,
      `after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100`,
      e,
    ),
    ...t,
  });
}
function Vs({ className: e, value: t, ...n }) {
  return (0, F.jsx)(Ma, {
    "data-slot": `progress`,
    value: t,
    className: Es(
      `relative h-2 w-full overflow-hidden rounded-full bg-primary/20`,
      e,
    ),
    ...n,
    children: (0, F.jsx)(Na, {
      "data-slot": `progress-indicator`,
      className: `h-full w-full flex-1 bg-primary transition-all`,
      style: { transform: `translateX(-${100 - (t ?? 0)}%)` },
    }),
  });
}
function Hs(e) {
  if (!e || typeof document > `u`) return;
  let t = document.head || document.getElementsByTagName(`head`)[0],
    n = document.createElement(`style`);
  ((n.type = `text/css`),
    t.appendChild(n),
    n.styleSheet
      ? (n.styleSheet.cssText = e)
      : n.appendChild(document.createTextNode(e)));
}
var Us = (e) => {
    switch (e) {
      case `success`:
        return Ks;
      case `info`:
        return Js;
      case `warning`:
        return qs;
      case `error`:
        return Ys;
      default:
        return null;
    }
  };
var Ws = Array(12).fill(0);
var Gs = ({ visible: e, className: t }) =>
    C.createElement(
      `div`,
      {
        className: [`sonner-loading-wrapper`, t].filter(Boolean).join(` `),
        "data-visible": e,
      },
      C.createElement(
        `div`,
        { className: `sonner-spinner` },
        Ws.map((e, t) =>
          C.createElement(`div`, {
            className: `sonner-loading-bar`,
            key: `spinner-bar-${t}`,
          }),
        ),
      ),
    );
var Ks = C.createElement(
    `svg`,
    {
      xmlns: `http://www.w3.org/2000/svg`,
      viewBox: `0 0 20 20`,
      fill: `currentColor`,
      height: `20`,
      width: `20`,
      "aria-hidden": `true`,
    },
    C.createElement(`path`, {
      fillRule: `evenodd`,
      d: `M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z`,
      clipRule: `evenodd`,
    }),
  );
var qs = C.createElement(
    `svg`,
    {
      xmlns: `http://www.w3.org/2000/svg`,
      viewBox: `0 0 24 24`,
      fill: `currentColor`,
      height: `20`,
      width: `20`,
      "aria-hidden": `true`,
    },
    C.createElement(`path`, {
      fillRule: `evenodd`,
      d: `M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z`,
      clipRule: `evenodd`,
    }),
  );
var Js = C.createElement(
    `svg`,
    {
      xmlns: `http://www.w3.org/2000/svg`,
      viewBox: `0 0 20 20`,
      fill: `currentColor`,
      height: `20`,
      width: `20`,
      "aria-hidden": `true`,
    },
    C.createElement(`path`, {
      fillRule: `evenodd`,
      d: `M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z`,
      clipRule: `evenodd`,
    }),
  );
var Ys = C.createElement(
    `svg`,
    {
      xmlns: `http://www.w3.org/2000/svg`,
      viewBox: `0 0 20 20`,
      fill: `currentColor`,
      height: `20`,
      width: `20`,
      "aria-hidden": `true`,
    },
    C.createElement(`path`, {
      fillRule: `evenodd`,
      d: `M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z`,
      clipRule: `evenodd`,
    }),
  );
var Xs = C.createElement(
    `svg`,
    {
      xmlns: `http://www.w3.org/2000/svg`,
      width: `12`,
      height: `12`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.5`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      "aria-hidden": `true`,
    },
    C.createElement(`line`, { x1: `18`, y1: `6`, x2: `6`, y2: `18` }),
    C.createElement(`line`, { x1: `6`, y1: `6`, x2: `18`, y2: `18` }),
  );
var Zs = () => {
    let [e, t] = C.useState(document.hidden);
    return (
      C.useEffect(() => {
        let e = () => {
          t(document.hidden);
        };
        return (
          document.addEventListener(`visibilitychange`, e),
          () => document.removeEventListener(`visibilitychange`, e)
        );
      }, []),
      e
    );
  };
var Qs = 1;
var $s = 100;
var ec = (e) => (typeof e?.id == `number` || e?.id?.length > 0 ? e.id : Qs++);
var tc = new (class {
    constructor() {
      ((this.subscribe = (e) => (
        this.subscribers.push(e),
        this.getActiveToasts().forEach((t) => e(t)),
        () => {
          let t = this.subscribers.indexOf(e);
          this.subscribers.splice(t, 1);
        }
      )),
        (this.publish = (e) => {
          this.subscribers.forEach((t) => t(e));
        }),
        (this.addToast = (e) => {
          (this.publish(e),
            (this.toasts = [...this.toasts, e]),
            this.trimHistory());
        }),
        (this.trimHistory = () => {
          let e = this.toasts.length - $s;
          e <= 0 ||
            (this.toasts = this.toasts.filter((t) =>
              e > 0 && this.dismissedToasts.has(t.id)
                ? (this.dismissedToasts.delete(t.id), e--, !1)
                : !0,
            ));
        }),
        (this.create = (e) => {
          let { message: t, ...n } = e,
            r = ec(e),
            i = this.pendingDismissals.get(r);
          i !== void 0 &&
            (cancelAnimationFrame(i),
            this.pendingDismissals.delete(r),
            this.dismissedToasts.delete(r));
          let a = this.dismissedToasts.has(r),
            o = e.dismissible === void 0 ? !0 : e.dismissible;
          return (
            a &&
              (this.dismissedToasts.delete(r),
              (this.toasts = this.toasts.filter((e) => e.id !== r))),
            !a && this.toasts.find((e) => e.id === r)
              ? (this.toasts = this.toasts.map((n) =>
                  n.id === r
                    ? (this.publish({ ...n, ...e, id: r, title: t }),
                      { ...n, ...e, id: r, dismissible: o, title: t })
                    : n,
                ))
              : this.addToast({ title: t, ...n, dismissible: o, id: r }),
            r
          );
        }),
        (this.dismiss = (e) => {
          if (e == null)
            return (
              this.getActiveToasts().forEach((e) => {
                (this.dismissedToasts.add(e.id),
                  this.subscribers.forEach((t) =>
                    t({ id: e.id, dismiss: !0 }),
                  ));
              }),
              e
            );
          this.dismissedToasts.add(e);
          let t = this.pendingDismissals.get(e);
          return (
            t !== void 0 && cancelAnimationFrame(t),
            this.pendingDismissals.set(
              e,
              requestAnimationFrame(() => {
                (this.pendingDismissals.delete(e),
                  this.subscribers.forEach((t) => t({ id: e, dismiss: !0 })));
              }),
            ),
            e
          );
        }),
        (this.message = (e, t) =>
          this.create({ ...t, message: e, type: void 0 })),
        (this.error = (e, t) =>
          this.create({ ...t, message: e, type: `error` })),
        (this.success = (e, t) =>
          this.create({ ...t, type: `success`, message: e })),
        (this.info = (e, t) => this.create({ ...t, type: `info`, message: e })),
        (this.warning = (e, t) =>
          this.create({ ...t, type: `warning`, message: e })),
        (this.loading = (e, t) =>
          this.create({ ...t, type: `loading`, message: e })),
        (this.promise = (e, t) => {
          if (!t) return;
          let n;
          t.loading !== void 0 &&
            (n = this.create({
              ...t,
              promise: e,
              type: `loading`,
              message: t.loading,
              description:
                typeof t.description == `function` ? void 0 : t.description,
            }));
          let r = Promise.resolve(e instanceof Function ? e() : e),
            i = n !== void 0,
            a,
            o = r
              .then(async (e) => {
                if (((a = [`resolve`, e]), C.isValidElement(e)))
                  ((i = !1),
                    this.create({ id: n, type: `default`, message: e }));
                else if (rc(e) && !e.ok) {
                  i = !1;
                  let r =
                      typeof t.error == `function`
                        ? await t.error(`HTTP error! status: ${e.status}`)
                        : t.error,
                    a =
                      typeof t.description == `function`
                        ? await t.description(`HTTP error! status: ${e.status}`)
                        : t.description,
                    o =
                      typeof r == `object` && !C.isValidElement(r)
                        ? r
                        : { message: r };
                  this.create({ id: n, type: `error`, description: a, ...o });
                } else if (e instanceof Error) {
                  i = !1;
                  let r =
                      typeof t.error == `function` ? await t.error(e) : t.error,
                    a =
                      typeof t.description == `function`
                        ? await t.description(e)
                        : t.description,
                    o =
                      typeof r == `object` && !C.isValidElement(r)
                        ? r
                        : { message: r };
                  this.create({ id: n, type: `error`, description: a, ...o });
                } else if (t.success !== void 0) {
                  i = !1;
                  let r =
                      typeof t.success == `function`
                        ? await t.success(e)
                        : t.success,
                    a =
                      typeof t.description == `function`
                        ? await t.description(e)
                        : t.description,
                    o =
                      typeof r == `object` && !C.isValidElement(r)
                        ? r
                        : { message: r };
                  this.create({ id: n, type: `success`, description: a, ...o });
                }
              })
              .catch(async (e) => {
                if (((a = [`reject`, e]), t.error !== void 0)) {
                  i = !1;
                  let r =
                      typeof t.error == `function` ? await t.error(e) : t.error,
                    a =
                      typeof t.description == `function`
                        ? await t.description(e)
                        : t.description,
                    o =
                      typeof r == `object` && !C.isValidElement(r)
                        ? r
                        : { message: r };
                  this.create({ id: n, type: `error`, description: a, ...o });
                }
              })
              .finally(() => {
                (i && (this.dismiss(n), (n = void 0)),
                  t.finally == null || t.finally.call(t));
              }),
            s = () =>
              new Promise((e, t) =>
                o.then(() => (a[0] === `reject` ? t(a[1]) : e(a[1]))).catch(t),
              );
          return typeof n != `string` && typeof n != `number`
            ? { unwrap: s }
            : Object.assign(n, { unwrap: s });
        }),
        (this.custom = (e, t) => {
          let n = ec(t);
          return (this.create({ ...t, jsx: e(n), id: n, type: void 0 }), n);
        }),
        (this.getActiveToasts = () =>
          this.toasts.filter((e) => !this.dismissedToasts.has(e.id))),
        (this.subscribers = []),
        (this.toasts = []),
        (this.dismissedToasts = new Set()),
        (this.pendingDismissals = new Map()));
    }
  })();
var nc = (e, t) => tc.message(e, t);
var rc = (e) =>
    e &&
    typeof e == `object` &&
    `ok` in e &&
    typeof e.ok == `boolean` &&
    `status` in e &&
    typeof e.status == `number`;
var ic = Object.assign(
    nc,
    {
      success: tc.success,
      info: tc.info,
      warning: tc.warning,
      error: tc.error,
      custom: tc.custom,
      message: tc.message,
      promise: tc.promise,
      dismiss: tc.dismiss,
      loading: tc.loading,
    },
    { getHistory: () => tc.toasts, getToasts: () => tc.getActiveToasts() },
  );
Hs(
  `[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--normal-text);background:var(--normal-bg);border:1px solid var(--normal-border);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{-webkit-user-select:none;user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}`,
);
function ac(e) {
  return e.label !== void 0;
}
var oc = 3;
var sc = `24px`;
var cc = `16px`;
var lc = 4e3;
var uc = 356;
var dc = 14;
var fc = 45;
var pc = 200;
function mc(...e) {
  return e.filter(Boolean).join(` `);
}
function hc(e) {
  let [t, n] = e.split(`-`),
    r = [];
  return (t && r.push(t), n && r.push(n), r);
}
var gc = (e) => {
  let {
      invert: t,
      toast: n,
      unstyled: r,
      interacting: i,
      setHeights: a,
      visibleToasts: o,
      heights: s,
      index: c,
      toasts: l,
      expanded: u,
      removeToast: d,
      defaultRichColors: f,
      closeButton: p,
      style: m,
      cancelButtonStyle: h,
      actionButtonStyle: g,
      className: _ = ``,
      descriptionClassName: v = ``,
      duration: y,
      position: b,
      gap: x,
      expandByDefault: S,
      classNames: w,
      icons: T,
      closeButtonAriaLabel: ee = `Close toast`,
    } = e,
    [E, D] = C.useState(null),
    [te, ne] = C.useState(null),
    [O, re] = C.useState(!1),
    [k, ie] = C.useState(!1),
    [ae, A] = C.useState(!1),
    [j, oe] = C.useState(!1),
    [se, ce] = C.useState(!1),
    [le, M] = C.useState(0),
    [N, ue] = C.useState(0),
    P = C.useRef(n.duration || y || lc),
    de = C.useRef(null),
    fe = C.useRef(null),
    pe = c === 0,
    me = c + 1 <= o,
    he = n.type,
    ge = he ?? `default`,
    _e = n.dismissible !== !1,
    ve = n.className || ``,
    ye = n.descriptionClassName || ``,
    be = C.useMemo(
      () => s.findIndex((e) => e.toastId === n.id) || 0,
      [s, n.id],
    ),
    xe = C.useMemo(() => n.closeButton ?? p, [n.closeButton, p]),
    Se = C.useMemo(() => n.duration || y || lc, [n.duration, y]),
    Ce = C.useRef(0),
    we = C.useRef(0),
    Te = C.useRef(0),
    Ee = C.useRef(null),
    [De, Oe] = b.split(`-`),
    ke = C.useMemo(
      () => s.reduce((e, t, n) => (n >= be ? e : e + t.height), 0),
      [s, be],
    ),
    Ae = Zs(),
    je = C.useMemo(() => e.swipeDirections ?? hc(b), [e.swipeDirections, b]),
    Me = n.invert || t,
    Ne = he === `loading`;
  ((we.current = C.useMemo(() => be * x + ke, [be, ke])),
    C.useEffect(() => {
      P.current = Se;
    }, [Se]),
    C.useEffect(() => {
      re(!0);
    }, []),
    C.useEffect(() => {
      let e = fe.current;
      if (e) {
        let t = e.getBoundingClientRect().height;
        return (
          ue(t),
          a((e) => [{ toastId: n.id, height: t, position: n.position }, ...e]),
          () => a((e) => e.filter((e) => e.toastId !== n.id))
        );
      }
    }, [a, n.id]),
    C.useLayoutEffect(() => {
      if (!O) return;
      let e = fe.current,
        t = e.style.height;
      e.style.height = `auto`;
      let r = e.getBoundingClientRect().height;
      ((e.style.height = t),
        ue(r),
        a((e) =>
          e.find((e) => e.toastId === n.id)
            ? e.map((e) => (e.toastId === n.id ? { ...e, height: r } : e))
            : [{ toastId: n.id, height: r, position: n.position }, ...e],
        ));
    }, [O, n.title, n.description, a, n.id, n.jsx, n.action, n.cancel]));
  let Pe = C.useCallback(() => {
    (ie(!0),
      M(we.current),
      a((e) => e.filter((e) => e.toastId !== n.id)),
      setTimeout(() => {
        d(n);
      }, pc));
  }, [n, d, a, we]);
  (C.useEffect(() => {
    if (
      (n.promise && he === `loading`) ||
      n.duration === 1 / 0 ||
      n.type === `loading`
    )
      return;
    let e;
    return (
      u || i || Ae
        ? (() => {
            if (Te.current < Ce.current) {
              let e = new Date().getTime() - Ce.current;
              P.current -= e;
            }
            Te.current = new Date().getTime();
          })()
        : P.current !== 1 / 0 &&
          ((Ce.current = new Date().getTime()),
          (e = setTimeout(() => {
            (n.onAutoClose == null || n.onAutoClose.call(n, n), Pe());
          }, P.current))),
      () => clearTimeout(e)
    );
  }, [u, i, n, he, Ae, Pe]),
    C.useEffect(() => {
      n.delete && (Pe(), n.onDismiss == null || n.onDismiss.call(n, n));
    }, [Pe, n.delete]));
  function Fe() {
    return T?.loading
      ? C.createElement(
          `div`,
          {
            className: mc(w?.loader, n?.classNames?.loader, `sonner-loader`),
            "data-visible": he === `loading`,
          },
          T.loading,
        )
      : C.createElement(Gs, {
          className: mc(w?.loader, n?.classNames?.loader),
          visible: he === `loading`,
        });
  }
  let Ie = n.icon || T?.[he] || Us(he);
  return C.createElement(
    `li`,
    {
      tabIndex: 0,
      ref: fe,
      className: mc(
        _,
        ve,
        w?.toast,
        n?.classNames?.toast,
        w?.[ge],
        n?.classNames?.[ge],
      ),
      "data-sonner-toast": ``,
      "data-rich-colors": n.richColors ?? f,
      "data-styled": !(n.jsx || n.unstyled || r),
      "data-mounted": O,
      "data-promise": !!n.promise,
      "data-swiped": se,
      "data-removed": k,
      "data-visible": me,
      "data-y-position": De,
      "data-x-position": Oe,
      "data-index": c,
      "data-front": pe,
      "data-swiping": ae,
      "data-dismissible": _e,
      "data-type": he,
      "data-invert": Me,
      "data-swipe-out": j,
      "data-swipe-direction": te,
      "data-expanded": !!(u || (S && O)),
      "data-testid": n.testId,
      style: {
        "--index": c,
        "--toasts-before": c,
        "--z-index": l.length - c,
        "--offset": `${k ? le : we.current}px`,
        "--initial-height": S ? `auto` : `${N}px`,
        ...m,
        ...n.style,
      },
      onDragEnd: () => {
        (A(!1), D(null), (Ee.current = null));
      },
      onPointerDown: (e) => {
        e.button !== 2 &&
          (Ne ||
            !_e ||
            ((de.current = new Date()),
            M(we.current),
            e.target.setPointerCapture(e.pointerId),
            e.target.tagName !== `BUTTON` &&
              (A(!0), (Ee.current = { x: e.clientX, y: e.clientY }))));
      },
      onPointerUp: () => {
        if (j || !_e) return;
        Ee.current = null;
        let e = Number(
            fe.current?.style
              .getPropertyValue(`--swipe-amount-x`)
              .replace(`px`, ``) || 0,
          ),
          t = Number(
            fe.current?.style
              .getPropertyValue(`--swipe-amount-y`)
              .replace(`px`, ``) || 0,
          ),
          r = new Date().getTime() - de.current?.getTime(),
          i = E === `x` ? e : t,
          a = Math.abs(i) / r;
        if (
          (E === `x`
            ? je.includes(e > 0 ? `right` : `left`)
            : je.includes(t > 0 ? `bottom` : `top`)) &&
          (Math.abs(i) >= fc || a > 0.11)
        ) {
          (M(we.current),
            n.onDismiss == null || n.onDismiss.call(n, n),
            ne(E === `x` ? (e > 0 ? `right` : `left`) : t > 0 ? `down` : `up`),
            Pe(),
            oe(!0));
          return;
        } else {
          var o, s;
          ((o = fe.current) == null ||
            o.style.setProperty(`--swipe-amount-x`, `0px`),
            (s = fe.current) == null ||
              s.style.setProperty(`--swipe-amount-y`, `0px`));
        }
        (ce(!1), A(!1), D(null));
      },
      onPointerMove: (e) => {
        var t, n;
        if (!Ee.current || !_e || window.getSelection()?.toString().length > 0)
          return;
        let r = e.clientY - Ee.current.y,
          i = e.clientX - Ee.current.x;
        !E &&
          (Math.abs(i) > 1 || Math.abs(r) > 1) &&
          D(Math.abs(i) > Math.abs(r) ? `x` : `y`);
        let a = { x: 0, y: 0 },
          o = (e) => 1 / (1.5 + Math.abs(e) / 20);
        if (E === `y`) {
          if (je.includes(`top`) || je.includes(`bottom`))
            if (
              (je.includes(`top`) && r < 0) ||
              (je.includes(`bottom`) && r > 0)
            )
              a.y = r;
            else {
              let e = r * o(r);
              a.y = Math.abs(e) < Math.abs(r) ? e : r;
            }
        } else if (E === `x` && (je.includes(`left`) || je.includes(`right`)))
          if ((je.includes(`left`) && i < 0) || (je.includes(`right`) && i > 0))
            a.x = i;
          else {
            let e = i * o(i);
            a.x = Math.abs(e) < Math.abs(i) ? e : i;
          }
        ((Math.abs(a.x) > 0 || Math.abs(a.y) > 0) && ce(!0),
          (t = fe.current) == null ||
            t.style.setProperty(`--swipe-amount-x`, `${a.x}px`),
          (n = fe.current) == null ||
            n.style.setProperty(`--swipe-amount-y`, `${a.y}px`));
      },
    },
    xe && !n.jsx && he !== `loading`
      ? C.createElement(
          `button`,
          {
            "aria-label": ee,
            "data-disabled": Ne,
            "data-close-button": !0,
            onClick:
              Ne || !_e
                ? () => {}
                : () => {
                    (Pe(), n.onDismiss == null || n.onDismiss.call(n, n));
                  },
            className: mc(w?.closeButton, n?.classNames?.closeButton),
          },
          T?.close ?? Xs,
        )
      : null,
    (he || n.icon || n.promise) &&
      n.icon !== null &&
      (T?.[he] !== null || n.icon)
      ? C.createElement(
          `div`,
          { "data-icon": ``, className: mc(w?.icon, n?.classNames?.icon) },
          he === `loading` ? n.icon || Fe() : n.promise ? Fe() : null,
          he === `loading` ? null : Ie,
        )
      : null,
    C.createElement(
      `div`,
      { "data-content": ``, className: mc(w?.content, n?.classNames?.content) },
      C.createElement(
        `div`,
        { "data-title": ``, className: mc(w?.title, n?.classNames?.title) },
        n.jsx ? n.jsx : typeof n.title == `function` ? n.title() : n.title,
      ),
      n.description
        ? C.createElement(
            `div`,
            {
              "data-description": ``,
              className: mc(v, ye, w?.description, n?.classNames?.description),
            },
            typeof n.description == `function`
              ? n.description()
              : n.description,
          )
        : null,
    ),
    C.isValidElement(n.cancel)
      ? n.cancel
      : n.cancel && ac(n.cancel)
        ? C.createElement(
            `button`,
            {
              "data-button": !0,
              "data-cancel": !0,
              style: n.cancelButtonStyle || h,
              onClick: (e) => {
                ac(n.cancel) &&
                  _e &&
                  (n.cancel.onClick == null ||
                    n.cancel.onClick.call(n.cancel, e),
                  Pe());
              },
              className: mc(w?.cancelButton, n?.classNames?.cancelButton),
            },
            n.cancel.label,
          )
        : null,
    C.isValidElement(n.action)
      ? n.action
      : n.action && ac(n.action)
        ? C.createElement(
            `button`,
            {
              "data-button": !0,
              "data-action": !0,
              style: n.actionButtonStyle || g,
              onClick: (e) => {
                ac(n.action) &&
                  (n.action.onClick == null ||
                    n.action.onClick.call(n.action, e),
                  !e.defaultPrevented && Pe());
              },
              className: mc(w?.actionButton, n?.classNames?.actionButton),
            },
            n.action.label,
          )
        : null,
  );
};
function _c() {
  if (typeof window > `u` || typeof document > `u`) return `ltr`;
  let e = document.documentElement.getAttribute(`dir`);
  return e === `auto` || !e
    ? window.getComputedStyle(document.documentElement).direction
    : e;
}
function vc(e, t) {
  let n = {};
  return (
    [e, t].forEach((e, t) => {
      let r = t === 1,
        i = r ? `--mobile-offset` : `--offset`,
        a = r ? cc : sc;
      function o(e) {
        [`top`, `right`, `bottom`, `left`].forEach((t) => {
          n[`${i}-${t}`] = typeof e == `number` ? `${e}px` : e;
        });
      }
      typeof e == `number` || typeof e == `string`
        ? o(e)
        : typeof e == `object`
          ? [`top`, `right`, `bottom`, `left`].forEach((t) => {
              e[t] === void 0
                ? (n[`${i}-${t}`] = a)
                : (n[`${i}-${t}`] =
                    typeof e[t] == `number` ? `${e[t]}px` : e[t]);
            })
          : o(a);
    }),
    n
  );
}
var yc = C.forwardRef(function (e, t) {
    let {
        id: n,
        invert: r,
        position: i = `bottom-right`,
        hotkey: a = [`altKey`, `KeyT`],
        expand: o,
        closeButton: s,
        className: c,
        offset: l,
        mobileOffset: u,
        theme: d = `light`,
        richColors: f,
        duration: p,
        style: m,
        visibleToasts: h = oc,
        toastOptions: g,
        dir: _ = _c(),
        gap: v = dc,
        icons: y,
        customAriaLabel: b,
        containerAriaLabel: x = `Notifications`,
      } = e,
      [S, w] = C.useState([]),
      T = C.useMemo(
        () =>
          n
            ? S.filter((e) => e.toasterId === n)
            : S.filter((e) => !e.toasterId),
        [S, n],
      ),
      ee = C.useMemo(
        () =>
          Array.from(
            new Set(
              [i].concat(T.filter((e) => e.position).map((e) => e.position)),
            ),
          ),
        [T, i],
      ),
      [E, D] = C.useState([]),
      [te, ne] = C.useState(!1),
      [O, re] = C.useState(!1),
      [k, ie] = C.useState(
        d === `system`
          ? typeof window < `u` &&
            window.matchMedia &&
            window.matchMedia(`(prefers-color-scheme: dark)`).matches
            ? `dark`
            : `light`
          : d,
      ),
      ae = C.useRef(null),
      A = a.join(`+`).replace(/Key/g, ``).replace(/Digit/g, ``),
      j = C.useRef(null),
      oe = C.useRef(!1),
      se = C.useCallback((e) => {
        w(
          (t) => (
            t.find((t) => t.id === e.id)?.delete || tc.dismiss(e.id),
            t.filter(({ id: t }) => t !== e.id)
          ),
        );
      }, []);
    return (
      C.useEffect(
        () =>
          tc.subscribe((e) => {
            if (e.dismiss) {
              requestAnimationFrame(() => {
                w((t) =>
                  t.map((t) => (t.id === e.id ? { ...t, delete: !0 } : t)),
                );
              });
              return;
            }
            setTimeout(() => {
              et.flushSync(() => {
                w((t) => {
                  let n = t.findIndex((t) => t.id === e.id);
                  return n === -1
                    ? [e, ...t]
                    : [...t.slice(0, n), { ...t[n], ...e }, ...t.slice(n + 1)];
                });
              });
            });
          }),
        [],
      ),
      C.useEffect(() => {
        if (d !== `system`) {
          ie(d);
          return;
        }
        if (
          (d === `system` &&
            (window.matchMedia &&
            window.matchMedia(`(prefers-color-scheme: dark)`).matches
              ? ie(`dark`)
              : ie(`light`)),
          typeof window > `u`)
        )
          return;
        let e = window.matchMedia(`(prefers-color-scheme: dark)`);
        try {
          e.addEventListener(`change`, ({ matches: e }) => {
            ie(e ? `dark` : `light`);
          });
        } catch {
          e.addListener(({ matches: e }) => {
            try {
              ie(e ? `dark` : `light`);
            } catch (e) {
              console.error(e);
            }
          });
        }
      }, [d]),
      C.useEffect(() => {
        S.length <= 1 && ne(!1);
      }, [S]),
      C.useEffect(() => {
        let e = (e) => {
          if (a.length > 0 && a.every((t) => e[t] || e.code === t)) {
            var t;
            (ne(!0), (t = ae.current) == null || t.focus());
          }
          e.code === `Escape` &&
            (document.activeElement === ae.current ||
              ae.current?.contains(document.activeElement)) &&
            ne(!1);
        };
        return (
          document.addEventListener(`keydown`, e),
          () => document.removeEventListener(`keydown`, e)
        );
      }, [a]),
      C.useEffect(() => {
        if (ae.current)
          return () => {
            j.current &&
              (j.current.focus({ preventScroll: !0 }),
              (j.current = null),
              (oe.current = !1));
          };
      }, [ae.current]),
      C.createElement(
        `section`,
        {
          ref: t,
          "aria-label": b ?? `${x} ${A}`,
          tabIndex: -1,
          "aria-live": `polite`,
          "aria-relevant": `additions text`,
          "aria-atomic": `false`,
          suppressHydrationWarning: !0,
          "data-react-aria-top-layer": !0,
        },
        ee.map((t, n) => {
          let [i, a] = t.split(`-`);
          return T.length
            ? C.createElement(
                `ol`,
                {
                  key: t,
                  dir: _ === `auto` ? _c() : _,
                  tabIndex: -1,
                  ref: ae,
                  className: c,
                  "data-sonner-toaster": !0,
                  "data-sonner-theme": k,
                  "data-y-position": i,
                  "data-x-position": a,
                  style: {
                    "--front-toast-height": `${E[0]?.height || 0}px`,
                    "--width": `${uc}px`,
                    "--gap": `${v}px`,
                    ...m,
                    ...vc(l, u),
                  },
                  onBlur: (e) => {
                    oe.current &&
                      !e.currentTarget.contains(e.relatedTarget) &&
                      ((oe.current = !1),
                      (j.current &&=
                        (j.current.focus({ preventScroll: !0 }), null)));
                  },
                  onFocus: (e) => {
                    (e.target instanceof HTMLElement &&
                      e.target.dataset.dismissible === `false`) ||
                      oe.current ||
                      ((oe.current = !0), (j.current = e.relatedTarget));
                  },
                  onMouseEnter: () => ne(!0),
                  onMouseMove: () => ne(!0),
                  onMouseLeave: () => {
                    O || ne(!1);
                  },
                  onDragEnd: () => ne(!1),
                  onPointerDown: (e) => {
                    (e.target instanceof HTMLElement &&
                      e.target.dataset.dismissible === `false`) ||
                      re(!0);
                  },
                  onPointerUp: () => re(!1),
                },
                T.filter(
                  (e) => (!e.position && n === 0) || e.position === t,
                ).map((n, i) =>
                  C.createElement(gc, {
                    key: n.id,
                    icons: y,
                    index: i,
                    toast: n,
                    defaultRichColors: f,
                    duration: g?.duration ?? p,
                    className: g?.className,
                    descriptionClassName: g?.descriptionClassName,
                    invert: r,
                    visibleToasts: h,
                    closeButton: g?.closeButton ?? s,
                    interacting: O,
                    position: t,
                    style: g?.style,
                    unstyled: g?.unstyled,
                    classNames: g?.classNames,
                    cancelButtonStyle: g?.cancelButtonStyle,
                    actionButtonStyle: g?.actionButtonStyle,
                    closeButtonAriaLabel: g?.closeButtonAriaLabel,
                    removeToast: se,
                    toasts: T.filter((e) => e.position == n.position),
                    heights: E.filter((e) => e.position == n.position),
                    setHeights: D,
                    expandByDefault: o,
                    gap: v,
                    expanded: te,
                    swipeDirections: e.swipeDirections,
                  }),
                ),
              )
            : null;
        }),
      )
    );
  });
export { e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T, ee, E, D, te, ne, O, re, k, ie, ae, A, j, oe, se, ce, le, M, N, ue, P, de, fe, pe, me, he, ge, _e, ve, ye, be, xe, Se, Ce, we, Te, Ee, De, Oe, ke, Ae, je, Me, Ne, Pe, Fe, Ie, Le, Re, ze, Be, Ve, He, Ue, We, Ge, Ke, qe, Je, Ye, Xe, Ze, Qe, $e, et, F, tt, nt, I, rt, it, at, L, ot, R, st, z, ct, lt, ut, dt, ft, B, pt, mt, ht, gt, _t, vt, yt, bt, xt, St, Ct, wt, Tt, Et, Dt, Ot, kt, At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt, Gt, Kt, qt, V, Jt, Yt, H, Xt, Zt, Qt, $t, en, tn, nn, rn, an, on, sn, cn, ln, un, dn, fn, pn, mn, hn, gn, _n, vn, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn, On, kn, An, jn, Mn, Nn, Pn, Fn, In, Ln, Rn, zn, Bn, Vn, Hn, Un, Wn, Gn, Kn, qn, Jn, Yn, Xn, Zn, Qn, $n, er, tr, nr, rr, ir, ar, or, sr, cr, lr, ur, dr, fr, pr, mr, hr, gr, _r, vr, yr, br, xr, Sr, Cr, wr, Tr, Er, Dr, Or, kr, Ar, jr, Mr, Nr, Pr, Fr, Ir, Lr, Rr, zr, Br, Vr, Hr, Ur, Wr, Gr, Kr, qr, Jr, Yr, Xr, Zr, Qr, $r, ei, ti, ni, ri, ii, ai, oi, si, ci, li, ui, di, fi, pi, mi, hi, gi, _i, vi, yi, bi, xi, Si, Ci, wi, Ti, Ei, Di, Oi, ki, Ai, U, ji, Mi, Ni, Pi, Fi, Ii, Li, Ri, zi, Bi, Vi, Hi, Ui, Wi, Gi, Ki, qi, Ji, Yi, Xi, Zi, Qi, $i, ea, ta, na, ra, ia, aa, oa, sa, ca, la, ua, da, fa, pa, ma, ha, ga, _a, va, ya, ba, xa, Sa, Ca, wa, Ta, Ea, Da, Oa, ka, Aa, ja, Ma, Na, Pa, Fa, Ia, La, Ra, za, Ba, Va, Ha, Ua, Wa, Ga, Ka, qa, Ja, Ya, Xa, Za, Qa, $a, eo, to, no, ro, io, ao, oo, so, co, W, lo, uo, fo, po, mo, ho, go, _o, vo, yo, bo, xo, So, Co, wo, To, Eo, Do, Oo, ko, Ao, jo, Mo, No, Po, Fo, Io, Lo, Ro, zo, Bo, Vo, Ho, Uo, G, Wo, Go, Ko, qo, Jo, Yo, Xo, Zo, Qo, $o, es, K, ts, ns, rs, is, as, os, ss, q, cs, ls, us, ds, fs, ps, ms, hs, gs, _s, vs, ys, bs, xs, Ss, Cs, ws, Ts, Es, Ds, Os, ks, As, js, Ms, Ns, Ps, Fs, Is, Ls, Rs, zs, Bs, Vs, Hs, Us, Ws, Gs, Ks, qs, Js, Ys, Xs, Zs, Qs, $s, ec, tc, nc, rc, ic, ac, oc, sc, cc, lc, uc, dc, fc, pc, mc, hc, gc, _c, vc, yc };
