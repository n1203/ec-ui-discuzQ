/* eslint-disable */
!(function(t) {
  const e = {};
  function n(r) {
    if (e[r]) return e[r].exports;
    const o = (e[r] = { i: r, l: !1, exports: {} });
    return t[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
  }
  (n.m = t),
    (n.c = e),
    (n.d = function(t, e, r) {
      n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
    }),
    (n.r = function(t) {
      typeof Symbol !== 'undefined' &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(t, '__esModule', { value: !0 });
    }),
    (n.t = function(t, e) {
      if ((1 & e && (t = n(t)), 8 & e)) return t;
      if (4 & e && typeof t === 'object' && t && t.__esModule) return t;
      const r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, 'default', { enumerable: !0, value: t }),
        2 & e && typeof t !== 'string')
      )
        for (const o in t)
          n.d(
            r,
            o,
            function(e) {
              return t[e];
            }.bind(null, o),
          );
      return r;
    }),
    (n.n = function(t) {
      const e =
        t && t.__esModule
          ? function() {
              return t.default;
            }
          : function() {
              return t;
            };
      return n.d(e, 'a', e), e;
    }),
    (n.o = function(t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (n.p = ''),
    n((n.s = 16));
})([
  function(t, e, n) {
    function r() {
      return Math.floor(1e8 * Math.random());
    }
    const o = function(t) {
      t = t ? 1 : 0;
      try {
        return location.search.substr(t);
      } catch (r) {
        try {
          const e = document.URL;
          const n = e.indexOf('?');
          if (n >= 0) return e.substr(n + t);
        } catch (r) {}
      }
      return '';
    };
    const a = {};
    !(function() {
      for (let t = o(!0).split('&'), e = 0; e < t.length; e++) {
        const n = /(.*?)=(.*)/.exec(t[e]);
        n && (a[n[1]] = n[2]);
      }
    })();
    t.exports = {
      href() {
        try {
          return location.href;
        } catch (t) {
          try {
            return document.URL;
          } catch (t) {}
        }
        return '';
      },
      getQuery(t) {
        let e = o();
        return (
          (e = e ? `${e.replace(/&rand=[^&]+/, '')}&rand=${r()}` : `?rand=${r()}`),
          (t = t ? 1 : 0),
          e.substr(t)
        );
      },
      queryParam(t) {
        return a[t];
      },
      queryMap() {
        return $.extend({}, a);
      },
      parse2rgb(t) {
        if (!t || typeof t !== 'string') return null;
        t = t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(t, e, n, r) {
          return e + e + n + n + r + r;
        });
        const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
        return e
          ? {
              r: parseInt(e[1], 16),
              g: parseInt(e[2], 16),
              b: parseInt(e[3], 16),
              s: `#${e[1]}${e[2]}${e[3]}`,
            }
          : null;
      },
      arrIndexOf(t, e) {
        if (typeof t.indexOf === 'function') return t.indexOf(e);
        for (let n = 0; n < t.length; n++) if (t[n] === e) return n;
        return -1;
      },
    };
  },
  function(t, e, n) {
    const r = (function() {
      let t = 1;
      const e = /subsid=(\d+)/.exec(location.href);
      e && (t = parseInt(e[1], 10) + 1);
      const n = function(e, n) {
        const r = n || t;
        return (
          (e = /subsid=\d+/.test(e) ? e.replace(/subsid=\d+/g, `subsid=${r}`) : `${e}&subsid=${r}`),
          n || t++,
          e
        );
      };
      return (
        (n.get = function() {
          return t;
        }),
        (n.bind = function() {
          const e = t++;
          return function(t) {
            return n(t, e);
          };
        }),
        n
      );
    })();
    t.exports = r;
  },
  function(t, e, n) {
    const r = Object.prototype.hasOwnProperty;
    const o = Object.prototype.toString;
    const a = Object.defineProperty;
    const i = Object.getOwnPropertyDescriptor;
    const c = function(t) {
      return typeof Array.isArray === 'function'
        ? Array.isArray(t)
        : o.call(t) === '[object Array]';
    };
    const s = function(t) {
      if (!t || o.call(t) !== '[object Object]') return !1;
      let e;
      const n = r.call(t, 'constructor');
      const a =
        t.constructor &&
        t.constructor.prototype &&
        r.call(t.constructor.prototype, 'isPrototypeOf');
      if (t.constructor && !n && !a) return !1;
      for (e in t);
      return void 0 === e || r.call(t, e);
    };
    const u = function(t, e) {
      a && e.name === '__proto__'
        ? a(t, e.name, { enumerable: !0, configurable: !0, value: e.newValue, writable: !0 })
        : (t[e.name] = e.newValue);
    };
    const p = function(t, e) {
      if (e === '__proto__') {
        if (!r.call(t, e)) return;
        if (i) return i(t, e).value;
      }
      return t[e];
    };
    t.exports = function f() {
      let t;
      let e;
      let n;
      let r;
      let o;
      let a;
      let i = arguments[0];
      let l = 1;
      const d = arguments.length;
      let h = !1;
      for (
        typeof i === 'boolean' && ((h = i), (i = arguments[1] || {}), (l = 2)),
          (i == null || (typeof i !== 'object' && typeof i !== 'function')) && (i = {});
        l < d;
        ++l
      )
        if ((t = arguments[l]) != null)
          for (e in t)
            (n = p(i, e)),
              i !== (r = p(t, e)) &&
                (h && r && (s(r) || (o = c(r)))
                  ? (o ? ((o = !1), (a = n && c(n) ? n : [])) : (a = n && s(n) ? n : {}),
                    u(i, { name: e, newValue: f(h, a, r) }))
                  : void 0 !== r && u(i, { name: e, newValue: r }));
      return i;
    };
  },
  function(t, e, n) {
    let r;
    let o;
    const a = n(1);
    const i = {
      ERROR_TYPE_FRAMEJS_DOWNLOAD_FAIL: 16,
      ERROR_TYPE_JSONP_PREHANDLE: 17,
      ERROR_TYPE_FRAMEJS_CODE_ERROR: 18,
      CALLBACK_NAME: 19,
    };
    const c = {
      ERROR_TYPE_FRAMEJS_DOWNLOAD_FAIL: 'ERROR_TYPE_FRAMEJS_DOWNLOAD_FAIL',
      ERROR_TYPE_JSONP_PREHANDLE: 'ERROR_TYPE_JSONP_PREHANDLE',
      ERROR_TYPE_FRAMEJS_CODE_ERROR: 'ERROR_TYPE_FRAMEJS_CODE_ERROR',
      CALLBACK_NAME: 'CALLBACK_NAME',
    };
    const s =
      ((r = document.referrer),
      (o = location.href || document.URL),
      (r = r.length > 512 ? r.substr(0, 512) : r),
      (o = o.length > 1024 ? o.substr(0, 1024) : o),
      [`referer=${encodeURIComponent(r)}`, `href=${encodeURIComponent(o)}`].join('&'));
    t.exports = {
      type: i,
      send(t, e, n) {
        try {
          (n = n || c[t]).length > 1024 && n.substr(0, 1024);
          const r = [`type=${(t = i[t])}`, `appid=${e}`, `reason=${encodeURIComponent(n)}`];
          const o = `https://aq.qq.com/cn2/manage/mbtoken/cap_monitor?${s}&${r.join('&')}`;
          new Image().src = a(o);
        } catch (u) {}
      },
      perfectStack(t) {
        let e = '';
        t &&
          t.stack &&
          (e = t.stack
            .replace(/\n/gi, '')
            .split(/\bat\b/)
            .join('\n')
            .replace(/\?[^:]+/gi, ''));
        try {
          const n = t.toString();
          e.indexOf(n) < 0 && (e = `${n}@${e}`);
        } catch (r) {}
        return e;
      },
    };
  },
  ,
  function(t, e, n) {
    t.exports = {
      add(t, e, n) {
        t &&
          (t.addEventListener
            ? t.addEventListener(e, n, !1)
            : t.attachEvent
            ? t.attachEvent(`on${e}`, n)
            : (t[`on${e}`] = n));
      },
      remove(t, e, n) {
        t &&
          (t.removeEventListener
            ? t.removeEventListener(e, n, !1)
            : t.detachEvent
            ? t.detachEvent(`on${e}`, n)
            : (t[`on${e}`] = null));
      },
    };
  },
  function(t, e) {
    t.exports = function(t) {
      const e = [];
      return (
        (e.toString = function() {
          return this.map(function(e) {
            const n = (function(t, e) {
              const n = t[1] || '';
              const r = t[3];
              if (!r) return n;
              if (e && typeof btoa === 'function') {
                const o =
                  ((i = r),
                  `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${btoa(
                    unescape(encodeURIComponent(JSON.stringify(i))),
                  )} */`);
                const a = r.sources.map(function(t) {
                  return `/*# sourceURL=${r.sourceRoot}${t} */`;
                });
                return [n]
                  .concat(a)
                  .concat([o])
                  .join('\n');
              }
              let i;
              return [n].join('\n');
            })(e, t);
            return e[2] ? `@media ${e[2]}{${n}}` : n;
          }).join('');
        }),
        (e.i = function(t, n) {
          typeof t === 'string' && (t = [[null, t, '']]);
          for (var r = {}, o = 0; o < this.length; o++) {
            const a = this[o][0];
            typeof a === 'number' && (r[a] = !0);
          }
          for (o = 0; o < t.length; o++) {
            const i = t[o];
            (typeof i[0] === 'number' && r[i[0]]) ||
              (n && !i[2] ? (i[2] = n) : n && (i[2] = `(${i[2]}) and (${n})`), e.push(i));
          }
        }),
        e
      );
    };
  },
  function(t, e) {
    const n = {};
    const r = function(t) {
      let e;
      return function() {
        return void 0 === e && (e = t.apply(this, arguments)), e;
      };
    };
    const o = r(function() {
      return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
    });
    const a = r(function() {
      return document.head || document.getElementsByTagName('head')[0];
    });
    let i = null;
    let c = 0;
    function s(t, e) {
      for (let r = 0; r < t.length; r++) {
        const o = t[r];
        const a = n[o.id];
        if (a) {
          a.refs++;
          for (var i = 0; i < a.parts.length; i++) a.parts[i](o.parts[i]);
          for (; i < o.parts.length; i++) a.parts.push(l(o.parts[i], e));
        } else {
          const c = [];
          for (i = 0; i < o.parts.length; i++) c.push(l(o.parts[i], e));
          n[o.id] = { id: o.id, refs: 1, parts: c };
        }
      }
    }
    function u(t) {
      for (var e = [], n = {}, r = 0; r < t.length; r++) {
        const o = t[r];
        const a = o[0];
        const i = { css: o[1], media: o[2], sourceMap: o[3] };
        n[a] ? n[a].parts.push(i) : e.push((n[a] = { id: a, parts: [i] }));
      }
      return e;
    }
    function p(t, e) {
      const n = Array.prototype.slice.call(arguments, 2);
      return function() {
        const r = Array.prototype.slice.call(arguments);
        t.apply(e, n.concat(r));
      };
    }
    function f() {
      const t = document.createElement('style');
      const e = a();
      return (t.type = 'text/css'), e.appendChild(t), t;
    }
    function l(t, e) {
      let n;
      let r;
      let o;
      let s;
      let u;
      if (e.singleton) {
        const l = c++;
        (n = i || (i = f())), (r = p(y, null, n, l, !1)), (o = p(y, null, n, l, !0));
      } else
        t.sourceMap &&
        typeof URL === 'function' &&
        typeof URL.createObjectURL === 'function' &&
        typeof URL.revokeObjectURL === 'function' &&
        typeof Blob === 'function' &&
        typeof btoa === 'function'
          ? ((s = document.createElement('link')),
            (u = a()),
            (s.rel = 'stylesheet'),
            u.appendChild(s),
            (r = p(m, null, (n = s))),
            (o = function() {
              n.parentNode.removeChild(n), n.href && URL.revokeObjectURL(n.href);
            }))
          : ((n = f()),
            (r = p(b, null, n)),
            (o = function() {
              n.parentNode.removeChild(n);
            }));
      return (
        r(t),
        function(e) {
          if (e) {
            if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap) return;
            r((t = e));
          } else o();
        }
      );
    }
    t.exports = function(t, e) {
      if (typeof DEBUG !== 'undefined' && DEBUG && typeof document !== 'object')
        throw new Error('The style-loader cannot be used in a non-browser environment');
      typeof (e = e || {}).singleton === 'undefined' && (e.singleton = o());
      const r = u(t);
      return (
        s(r, e),
        function(t) {
          for (var o = [], a = 0; a < r.length; a++) {
            const i = r[a];
            (c = n[i.id]).refs--, o.push(c);
          }
          t && s(u(t), e);
          for (a = 0; a < o.length; a++) {
            var c;
            if ((c = o[a]).refs === 0) {
              for (let p = 0; p < c.parts.length; p++) c.parts[p]();
              delete n[c.id];
            }
          }
        }
      );
    };
    let d;
    const h =
      ((d = []),
      function(t, e) {
        const n = [];
        d[t] = e;
        for (let r = 0; r < d.length; r++) d[r] && n.push(d[r]);
        return n.join('\n');
      });
    function y(t, e, n, r) {
      const o = n ? '' : r.css;
      if (t.styleSheet) t.styleSheet.cssText = h(e, o);
      else {
        const a = document.createTextNode(o);
        const i = t.childNodes;
        i[e] && t.removeChild(i[e]), i.length ? t.insertBefore(a, i[e]) : t.appendChild(a);
      }
    }
    function b(t, e) {
      const n = e.css;
      const r = e.media;
      e.sourceMap;
      if ((r && t.setAttribute('media', r), t.styleSheet)) t.styleSheet.cssText = n;
      else {
        for (; t.firstChild; ) t.removeChild(t.firstChild);
        t.appendChild(document.createTextNode(n));
      }
    }
    function m(t, e) {
      let n = e.css;
      const r = (e.media, e.sourceMap);
      r &&
        (n += `\n/*# sourceMappingURL=data:application/json;base64,${btoa(
          unescape(encodeURIComponent(JSON.stringify(r))),
        )} */`);
      const o = new Blob([n], { type: 'text/css' });
      const a = t.href;
      (t.href = URL.createObjectURL(o)), a && URL.revokeObjectURL(a);
    }
  },
  function(module, exports, __webpack_require__) {
    const _typeof =
      typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
        ? function(t) {
            return typeof t;
          }
        : function(t) {
            return t &&
              typeof Symbol === 'function' &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? 'symbol'
              : typeof t;
          };
    (typeof JSON === 'undefined' ? 'undefined' : _typeof(JSON)) !== 'object' && (JSON = {}),
      (function() {
        const rx_one = /^[\],:{}\s]*$/;
        const rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        const rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        const rx_four = /(?:^|:|,)(?:\s*\[)+/g;
        const rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        const rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        let gap;
        let indent;
        let meta;
        let rep;
        function f(t) {
          return t < 10 ? `0${t}` : t;
        }
        function this_value() {
          return this.valueOf();
        }
        function quote(t) {
          return (
            (rx_escapable.lastIndex = 0),
            rx_escapable.test(t)
              ? `"${t.replace(rx_escapable, function(t) {
                  const e = meta[t];
                  return typeof e === 'string'
                    ? e
                    : `\\u${`0000${t.charCodeAt(0).toString(16)}`.slice(-4)}`;
                })}"`
              : `"${t}"`
          );
        }
        function str(t, e) {
          let n;
          let r;
          let o;
          let a;
          let i;
          const c = gap;
          let s = e[t];
          switch (
            (s &&
              (void 0 === s ? 'undefined' : _typeof(s)) === 'object' &&
              typeof s.toJSON === 'function' &&
              (s = s.toJSON(t)),
            typeof rep === 'function' && (s = rep.call(e, t, s)),
            void 0 === s ? 'undefined' : _typeof(s))
          ) {
            case 'string':
              return quote(s);
            case 'number':
              return isFinite(s) ? String(s) : 'null';
            case 'boolean':
            case 'null':
              return String(s);
            case 'object':
              if (!s) return 'null';
              if (
                ((gap += indent), (i = []), Object.prototype.toString.apply(s) === '[object Array]')
              ) {
                for (a = s.length, n = 0; n < a; n += 1) i[n] = str(n, s) || 'null';
                return (
                  (o =
                    i.length === 0
                      ? '[]'
                      : gap
                      ? `[\n${gap}${i.join(`,\n${gap}`)}\n${c}]`
                      : `[${i.join(',')}]`),
                  (gap = c),
                  o
                );
              }
              if (rep && (void 0 === rep ? 'undefined' : _typeof(rep)) === 'object')
                for (a = rep.length, n = 0; n < a; n += 1)
                  typeof rep[n] === 'string' &&
                    (o = str((r = rep[n]), s)) &&
                    i.push(quote(r) + (gap ? ': ' : ':') + o);
              else
                for (r in s)
                  Object.prototype.hasOwnProperty.call(s, r) &&
                    (o = str(r, s)) &&
                    i.push(quote(r) + (gap ? ': ' : ':') + o);
              return (
                (o =
                  i.length === 0
                    ? '{}'
                    : gap
                    ? `{\n${gap}${i.join(`,\n${gap}`)}\n${c}}`
                    : `{${i.join(',')}}`),
                (gap = c),
                o
              );
          }
        }
        typeof Date.prototype.toJSON !== 'function' &&
          ((Date.prototype.toJSON = function() {
            return isFinite(this.valueOf())
              ? `${this.getUTCFullYear()}-${f(this.getUTCMonth() + 1)}-${f(this.getUTCDate())}T${f(
                  this.getUTCHours(),
                )}:${f(this.getUTCMinutes())}:${f(this.getUTCSeconds())}Z`
              : null;
          }),
          (Boolean.prototype.toJSON = this_value),
          (Number.prototype.toJSON = this_value),
          (String.prototype.toJSON = this_value)),
          typeof JSON.stringify !== 'function' &&
            ((meta = {
              '\b': '\\b',
              '\t': '\\t',
              '\n': '\\n',
              '\f': '\\f',
              '\r': '\\r',
              '"': '\\"',
              '\\': '\\\\',
            }),
            (JSON.stringify = function(t, e, n) {
              let r;
              if (((gap = ''), (indent = ''), typeof n === 'number'))
                for (r = 0; r < n; r += 1) indent += ' ';
              else typeof n === 'string' && (indent = n);
              if (
                ((rep = e),
                e &&
                  typeof e !== 'function' &&
                  ((void 0 === e ? 'undefined' : _typeof(e)) !== 'object' ||
                    typeof e.length !== 'number'))
              )
                throw new Error('JSON.stringify');
              return str('', { '': t });
            })),
          typeof JSON.parse !== 'function' &&
            (JSON.parse = function(text, reviver) {
              let j;
              function walk(t, e) {
                let n;
                let r;
                const o = t[e];
                if (o && (void 0 === o ? 'undefined' : _typeof(o)) === 'object')
                  for (n in o)
                    Object.prototype.hasOwnProperty.call(o, n) &&
                      ((r = walk(o, n)) !== undefined ? (o[n] = r) : delete o[n]);
                return reviver.call(t, e, o);
              }
              if (
                ((text = String(text)),
                (rx_dangerous.lastIndex = 0),
                rx_dangerous.test(text) &&
                  (text = text.replace(rx_dangerous, function(t) {
                    return `\\u${`0000${t.charCodeAt(0).toString(16)}`.slice(-4)}`;
                  })),
                rx_one.test(
                  text
                    .replace(rx_two, '@')
                    .replace(rx_three, ']')
                    .replace(rx_four, ''),
                ))
              )
                return (
                  (j = eval(`(${text})`)), typeof reviver === 'function' ? walk({ '': j }, '') : j
                );
              throw new SyntaxError('JSON.parse');
            });
      })();
  },
  function(t, e, n) {
    const r =
      typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
        ? function(t) {
            return typeof t;
          }
        : function(t) {
            return t &&
              typeof Symbol === 'function' &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? 'symbol'
              : typeof t;
          };
    let o = '[CODE_VERIFY]';
    const a = 'postMessage' in window;
    function i(t, e, n) {
      let o = '';
      if (
        (arguments.length < 2
          ? (o = '[Msger] error 1')
          : (void 0 === t ? 'undefined' : r(t)) != 'object'
          ? (o = '[Msger] error 2')
          : typeof e !== 'string' && (o = '[Msger] error 3'),
        o)
      )
        throw new Error(o);
      (this.target = t), (this.name = e), (this.domain = n || '*');
    }
    function c(t, e) {
      (this.targets = {}),
        (this.name = t),
        (this.listenFunc = []),
        typeof (o = e || o) !== 'string' && (o = o.toString()),
        this.initListen();
    }
    (i.prototype.send = a
      ? function(t) {
          this.target.postMessage(t, this.domain);
        }
      : function(t) {
          const e = window.navigator[o + this.name];
          if (typeof e !== 'function') throw new Error('target callback function is not defined');
          e(t, window);
        }),
      (c.prototype.addTarget = function(t, e, n) {
        const r = new i(t, e, n);
        this.targets[e] = r;
      }),
      (c.prototype.initListen = function() {
        const t = this;
        const e = function(e) {
          (void 0 === e ? 'undefined' : r(e)) == 'object' && e.data && (e = e.data);
          for (let n = 0; n < t.listenFunc.length; n++) t.listenFunc[n](e);
        };
        a
          ? 'addEventListener' in document
            ? window.addEventListener('message', e, !1)
            : 'attachEvent' in document && window.attachEvent('onmessage', e)
          : (window.navigator[o + this.name] = e);
      }),
      (c.prototype.listen = function(t) {
        this.listenFunc.push(t);
      }),
      (c.prototype.clear = function() {
        this.listenFunc = [];
      }),
      (c.prototype.send = function(t) {
        let e;
        const n = this.targets;
        for (e in n) n.hasOwnProperty(e) && n[e].send(t);
      }),
      (window.TCapMsg = c),
      (t.exports = c);
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function(module, exports, __webpack_require__) {
    const _typeof =
      typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
        ? function(t) {
            return typeof t;
          }
        : function(t) {
            return t &&
              typeof Symbol === 'function' &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? 'symbol'
              : typeof t;
          };
    if (!0 === window.__TencentCaptchaExists__)
      throw new Error(
        '\u8bf7\u52ff\u591a\u6b21\u5f15\u7528\u817e\u8baf\u9a8c\u8bc1\u7801\u7684\u63a5\u5165js',
      );
    (window.__TencentCaptchaExists__ = !0), __webpack_require__(17), __webpack_require__(8);
    const Messenger = __webpack_require__(9);
    const domReady = __webpack_require__(19);
    const btoa = window.btoa || __webpack_require__(20);
    const extend = Object.assign || __webpack_require__(2);
    const loadScript = __webpack_require__(21);
    const eventListener = __webpack_require__(5);
    const Executor = __webpack_require__(22);
    const isIEVar = __webpack_require__(23);
    const isElement = __webpack_require__(24);
    const invisibleIframe = __webpack_require__(25);
    const getScriptDomain = __webpack_require__(26);
    const scriptDomain = getScriptDomain() || '';
    const isWechatDevtools = navigator.userAgent && /wechatdevtools/.test(navigator.userAgent);
    const isWindows = /windows/i.test(navigator.userAgent);
    const isMobile =
      !isWindows &&
      ('ontouchstart' in window ||
        'ontouchstart' in document.createElement('div') ||
        isWechatDevtools);
    let capDomain = 'https://ssl.captcha.qq.com';
    capDomain || (capDomain = scriptDomain);
    const grayscaleFrameJs = '/tcaptcha-frame.2de3157b.js';
    const grayscaleThreshold = 1;
    const grayscaleAppId = [
      '123',
      '2100049389',
      '2100049390',
      '2046103261',
      '2070173641',
      '2060075756',
    ];
    const grayscaleProb = Math.random();
    let needGrayscaleJs = void 0;
    let jsLoadStatus = 'none';
    const capError = __webpack_require__(3);
    const preVerifyData = {};
    let capObj = void 0;
    const initQueue = [];
    const defaultOpt = {
      type: 'popup',
      pos: isIEVar(6) ? 'absolute' : 'fixed',
      lang: 2052,
      showHeader: isMobile,
      needFeedBack: true,
      themeColor: '',
      tcaptchaFlag: !0,
      gettype: 'cap_union_prehandle',
      domain: capDomain,
      htdoc_path: capDomain,
    };
    const noop = function() {};
    const isGrayscaleAppId = function(t) {
      if (needGrayscaleJs !== undefined) return needGrayscaleJs;
      for (let e = 0, n = grayscaleAppId.length; e < n; e++)
        if (t == grayscaleAppId[e]) return (needGrayscaleJs = !0);
      return (needGrayscaleJs = !1);
    };
    const callbackWrap = function(t, e) {
      return function(n) {
        (void 0 === n ? 'undefined' : _typeof(n)) === 'object' &&
          (n = { bizState: t.options.bizState, appid: t.options.appid, ...n }),
          e && e(n);
      };
    };
    const executor = new Executor(function() {
      if (initQueue.length > 0) {
        for (let t = 0; t < initQueue.length; t++) initQueue[t].show();
        initQueue.length = 0;
      }
    }, 0);
    const Captcha = function Captcha($btn, appid, _tcallback_, opts) {
      let bizState = void 0;
      if (isElement($btn))
        if (appid && (void 0 === appid ? 'undefined' : _typeof(appid)) === 'object')
          (opts = appid), (appid = null), (_tcallback_ = null);
        else {
          if (((appid = appid || $btn.getAttribute('data-appid')), !_tcallback_)) {
            const callbackName = $btn.getAttribute('data-cbfn');
            try {
              _tcallback_ = eval(`window.${callbackName}`);
            } catch (e) {
              throw new Error('Lost `callback`');
            }
          }
          bizState = $btn.getAttribute('data-biz-state');
        }
      else {
        if (typeof $btn !== 'string' || typeof appid !== 'function')
          throw new Error('Arguments error.');
        (opts = _tcallback_), (_tcallback_ = appid), (appid = $btn), ($btn = null);
      }
      (opts = opts || {}),
        (opts.callback = _tcallback_ || opts.callback),
        (opts.start = opts.start || noop),
        (opts.end = opts.end || noop);
      const readyCallback = typeof opts.ready === 'function' ? opts.ready : noop;
      if (
        ((opts.ready = function(t) {
          readyCallback.call(this, t);
        }),
        (opts.appid = appid || opts.appid),
        (opts.bizState = bizState || opts.bizState),
        (opts.fwidth = parseFloat(opts.fwidth) || 0),
        (opts.sdkOpts = opts.sdkOpts || null),
        (opts.ele = $btn),
        (this.options = opts),
        typeof opts.callback !== 'function')
      )
        throw new Error('Lost `callback`');
      if (((this.initOpts = { ...defaultOpt, ...opts }), this.langFun(), $btn)) {
        const that = this;
        eventListener.add($btn, 'click', function() {
          that.show();
        });
      }
    };
    Captcha.prototype = {
      show() {
        if (executor.isDone) this.__show__();
        else {
          for (let t = 0; t < initQueue.length; t++) if (initQueue[t] === this) return;
          initQueue.push(this);
        }
      },
      __show__() {
        const t = this.initOpts;
        if (typeof window.AqSCode === 'undefined')
          return (
            capError.send('ERROR_TYPE_FRAMEJS_CODE_ERROR', t.appid),
            alert(
              '\u9875\u9762\u52a0\u8f7d\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5',
            )
          );
        this.destroy();
        const e = [];
        for (const n in (e.push(`aid=${t.appid}`),
        e.push('accver=1'),
        e.push(`showtype=${t.type}`),
        e.push(
          `ua=${encodeURIComponent(
            btoa((navigator.userAgent || '').replace(/[\u00ff-\uffff]+/g, '')),
          )}`,
        ),
        e.push(`noheader=${`${t.showHeader}` == 'false' ? '1' : '0'}`),
        e.push(`fb=${`${t.needFeedBack}` == 'false' ? '0' : '1'}`),
        e.push(`enableDarkMode=${t.enableDarkMode ? '1' : '0'}`),
        t.sid && e.push(`sid=${t.sid}`),
        preVerifyData))
          preVerifyData[n] && e.push(`${n}=${encodeURIComponent(preVerifyData[n])}`);
        (t.uid = `${t.uin || ''}`),
          needGrayscaleJs && (e.push('grayscale=1'), (t.grayscale = 1)),
          isMobile
            ? (e.push('clientype=1'),
              (t.clientype = 1),
              t.forceLang && e.push(`lang=${t.forceLang}`),
              (t.params = `?${e.join('&')}`))
            : (e.push('clientype=2'),
              (t.clientype = 2),
              needGrayscaleJs && t.forceLang && e.push(`lang=${t.forceLang}`),
              (t.params = `?${e.join('&')}`),
              (t.s_type_suffix = `?${e.join('&')}`),
              (t.src = `${capDomain}/template/new_placeholder.html${t.s_type_suffix}`),
              (t.s_type = `${capDomain}/cap_union_prehandle${t.s_type_suffix}`),
              (t.slide_src = `${capDomain}/template/new_slide_placeholder.html${t.s_type_suffix}`),
              (t.fb = `${t.needFeedBack}` == 'false' ? '0' : '1')),
          (capObj = new AqSCode(t)).listen(
            callbackWrap(this, t.callback),
            callbackWrap(this, t.ready),
          ),
          capObj.start(callbackWrap(t.start)),
          capObj.end(callbackWrap(t.end)),
          needGrayscaleJs
            ? ((t.top || t.left) &&
                capObj.initPos({ top: t.top || undefined, left: t.left || undefined }),
              capObj.create())
            : isMobile &&
              ((t.top || t.left) &&
                capObj.initPos({ top: t.top || undefined, left: t.left || undefined }),
              capObj.create());
      },
      langFun() {
        if (this.initOpts.forceLang) {
          const t = { 'zh-cn': '2052', 'zh-hk': '1028', en: '1033' };
          const e = this.initOpts.forceLang;
          t[e]
            ? ((this.initOpts.lang = t[e]),
              (this.initOpts.forceLang = t[e]),
              (this.initOpts.forcestyle = 1))
            : (this.initOpts.forceLang = '');
        }
      },
      destroy() {
        capObj && capObj.destroy && capObj.destroy();
      },
      refresh() {
        capObj && capObj.refresh && capObj.refresh();
      },
      getTicket() {
        if (capObj && capObj.getTicket) {
          let t = null;
          return (
            callbackWrap(this, function(e) {
              t = e;
            })(capObj.getTicket()),
            t
          );
        }
        return null;
      },
    };
    const autoBindBtn = function() {
      const t = document.getElementById('TencentCaptcha');
      t && new Captcha(t);
    };
    executor.exec(function(t) {
      domReady(function() {
        try {
          autoBindBtn();
        } catch (e) {}
        new Messenger('TCaptchaVerifyDetect').listen(function(t) {
          if (t && (void 0 === t ? 'undefined' : _typeof(t)) === 'object')
            switch (t.type) {
              case 'preVerify':
                extend(preVerifyData, t.data);
            }
        });
        try {
          invisibleIframe(`${capDomain}/template/captcha-pre-verify.html`);
        } catch (e) {}
        t();
      });
    }),
      executor.exec(function(t) {
        (jsLoadStatus = 'loading'),
          (needGrayscaleJs = !0),
          loadScript(
            grayscaleFrameJs,
            capDomain,
            capDomain,
            function() {
              return !!window.AqSCode;
            },
            function() {
              (jsLoadStatus = 'loaded'), t();
            },
            function() {
              (jsLoadStatus = 'none'), capError.send('ERROR_TYPE_FRAMEJS_DOWNLOAD_FAIL'), t();
            },
          );
      }),
      (window.TencentCaptcha = Captcha);
  },
  function(t, e, n) {
    let r = n(18);
    typeof r === 'string' && (r = [[t.i, r, '']]);
    n(7)(r, {});
    r.locals && (t.exports = r.locals);
  },
  function(t, e, n) {
    (t.exports = n(6)(!1)).push([
      t.i,
      '@keyframes animate_dots{0%{opacity:1}to{opacity:0}}@-webkit-keyframes animate_dots{0%{opacity:1}to{opacity:0}}.dot0,.dot1{animation:animate_dots .9s infinite;-moz-animation:animate_dots .9s infinite;-webkit-animation:animate_dots .9s infinite;-o-animation:animate_dots .9s infinite}.dot1{animation-delay:.2s;-webkit-animation-delay:.2s}.dot2{animation:animate_dots .9s infinite;-moz-animation:animate_dots .9s infinite;-webkit-animation:animate_dots .9s infinite;-o-animation:animate_dots .9s infinite;animation-delay:.4s;-webkit-animation-delay:.4s}.dots_item{display:inline-block;margin-right:5px;width:10px;height:10px;border-radius:50%;background:#4886ff}.verify-icon{position:absolute;width:100%;margin-top:70px;text-align:center}.t-mask{width:100%;height:100%;position:fixed;_position:absolute;left:0;top:0;background:#000;opacity:.5;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);z-index:2000000000}',
      '',
    ]);
  },
  function(t, e, n) {
    t.exports = (function(t) {
      let e;
      const n = [];
      const r = document;
      const o = r.documentElement;
      const a = o.doScroll;
      let i = (a ? /^loaded|^c/ : /^loaded|c/).test(r.readyState);
      function c(t) {
        for (i = 1; (t = n.shift()); ) t();
      }
      return (
        r.addEventListener &&
          r.addEventListener(
            'DOMContentLoaded',
            (e = function() {
              r.removeEventListener('DOMContentLoaded', e, !1), c();
            }),
            !1,
          ),
        a &&
          r.attachEvent(
            'onreadystatechange',
            (e = function() {
              /^c/.test(r.readyState) && (r.detachEvent('onreadystatechange', e), c());
            }),
          ),
        (t = a
          ? function(e) {
              self != top
                ? i
                  ? e()
                  : n.push(e)
                : (function() {
                    try {
                      o.doScroll('left');
                    } catch (n) {
                      return setTimeout(function() {
                        t(e);
                      }, 50);
                    }
                    e();
                  })();
            }
          : function(t) {
              i ? t() : n.push(t);
            })
      );
    })();
  },
  function(t, e, n) {
    const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const o = function(t) {
      const e = [0, 2, 1][t.length % 3];
      const n =
        (t.charCodeAt(0) << 16) |
        ((t.length > 1 ? t.charCodeAt(1) : 0) << 8) |
        (t.length > 2 ? t.charCodeAt(2) : 0);
      return [
        r.charAt(n >>> 18),
        r.charAt((n >>> 12) & 63),
        e >= 2 ? '=' : r.charAt((n >>> 6) & 63),
        e >= 1 ? '=' : r.charAt(63 & n),
      ].join('');
    };
    t.exports = function(t) {
      return t.replace(/[\s\S]{1,3}/g, o);
    };
  },
  function(t, e, n) {
    const r = 2;
    t.exports = function o(t, e, n, a, i, c, s) {
      s = s || 1;
      let u = !1;
      const p = document.createElement('script');
      function f(t) {
        u ||
          (((t && t.type === 'load') || /^(loaded|complete)$/.test(this.readyState)) &&
            (a() ? ((u = !0), i && i()) : l()));
      }
      (p.type = 'text/javascript'),
        (p.async = !0),
        (p.src = (s > 1 ? n : e) + t),
        'onload' in p ? (p.onload = f) : (p.onreadystatechange = f);
      var l = function() {
        u || ((u = !0), s >= r ? c && c() : o(t, e, n, a, i, c, s + 1));
      };
      (p.onerror = l),
        document
          .getElementsByTagName('head')
          .item(0)
          .appendChild(p);
    };
  },
  function(t, e, n) {
    const r = function(t, e) {
      (this.i = 0), (this.doneCallback = t), (this.isDone = !1), (this.timeout = e || 0);
      const n = this;
      this.immediateExec = setTimeout(function() {
        n.doneCheck();
      }, 0);
    };
    (r.prototype = {
      doneCheck(t, e) {
        try {
          t && t(e);
        } catch (n) {}
        if ((this.i--, this.i <= 0))
          try {
            (this.isDone = !0), this.doneCallback();
          } catch (n) {}
      },
      exec(t, e, n) {
        clearTimeout(this.immediateExec);
        let r = !1;
        let o = '';
        const a = this;
        this.i++, this.i > 0 && (this.isDone = !1);
        try {
          (o = t(function(t) {
            r ||
              ((r = !0),
              setTimeout(function() {
                a.doneCheck(e, t);
              }, 0));
          })) &&
            ((r = !0),
            setTimeout(function() {
              a.doneCheck(e, o);
            }, 0));
        } catch (i) {}
        (n = n || this.timeout || 0) > 0 &&
          setTimeout(function() {
            r || ((r = !0), a.doneCheck(e, ''));
          }, n);
      },
    }),
      (t.exports = r);
  },
  function(t, e, n) {
    t.exports = function(t) {
      const e = document.createElement('b');
      return (
        (e.innerHTML = `\x3c!--[if IE ${t}]><i></i><![endif]--\x3e`),
        e.getElementsByTagName('i') && e.getElementsByTagName('i').length === 1
      );
    };
  },
  function(t, e, n) {
    const r =
      typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
        ? function(t) {
            return typeof t;
          }
        : function(t) {
            return t &&
              typeof Symbol === 'function' &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? 'symbol'
              : typeof t;
          };
    t.exports = function(t) {
      try {
        return t instanceof HTMLElement;
      } catch (e) {
        return (
          (void 0 === t ? 'undefined' : r(t)) === 'object' &&
          t.nodeType === 1 &&
          r(t.style) === 'object' &&
          r(t.ownerDocument) === 'object'
        );
      }
    };
  },
  function(t, e, n) {
    t.exports = function(t) {
      const e = document.createElement('iframe');
      return (
        (e.src = t),
        (e.style.cssText = 'width: 0px; height: 0px; display: none;'),
        (document.body || document.getElementsByTagName('body').item('0')).appendChild(e),
        e
      );
    };
  },
  function(t, e, n) {
    const r = n(0).href;
    const o = function(t) {
      const e = t.split('?');
      if (e.length !== 2) return {};
      for (var n = e[1] && e[1].split('&'), r = {}, o = 0; o < n.length; o++) {
        const a = n[o].split('=');
        a[1] && (r[a[0]] = decodeURIComponent(a[1]));
      }
      return r;
    };
    const a = function() {
      for (let t = document.getElementsByTagName('script'), e = 0; e < t.length; e++) {
        const n = t[e];
        if (n.src.match(/captcha\.js/i)) return n;
      }
    };
    t.exports = function() {
      try {
        const t = document.getElementById('CaptchaScript') || a() || '';
        if (!t) return '';
        const e = t.src;
        const n = o(e).domain;
        if (n) return n;
        const i = /(https?\:\/\/[0-9a-zA-Z-:\.]+)\//i;
        const c = e.match(i) || r().match(i);
        return c ? c[1] : '';
      } catch (s) {
        return '';
      }
    };
  },
]);
