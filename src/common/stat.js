'use strict';
// #ifndef H5
import { DISCUZ_REQUEST_HOST } from '@/common/const';

let customConf = {};
customConf.config = {
  appkey: '179E80BB32C54EA58539924926EFB3A6',
  appName: 'dzq',
  versionName: '1.0',
  versionCode: '20200522',
  wxAppid: 'wxbf0fc4ac9d6a2171',
  getLocation: false, // 默认不获取用户位置
};
const THIS_SITE_HOST = getLocation(DISCUZ_REQUEST_HOST).hostname.replace(/\./g, '_');
function getLocation(href) {
  const match = href.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
  );
  return (
    match && {
      href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}
function resetFn() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
    t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '',
    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {},
    i = e[t];
  e[t] = function(e) {
    i && i.call(this, e), n.call(this, e);
  };
}
var _typeof =
    'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
      ? function(e) {
          return typeof e;
        }
      : function(e) {
          return e &&
            'function' == typeof Symbol &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? 'symbol'
            : typeof e;
        },
  _requestUrl = `${DISCUZ_REQUEST_HOST}api/statistic/miniprogram`,
  _version = ['3', '0', '7'],
  waitFlag = { device: !0, network: !0, uid: !0 },
  appInfo = {
    sdk: {
      version: _version[0],
      minorVersion: _version[1],
      build: _version[2],
      platform: 'Weapp',
      partner: '',
    },
    app: {
      versionCode: customConf.config.versionCode || '1',
      versionName: customConf.config.versionName || '1.0.0',
      installTime: 0,
      displayName: customConf.config.appName,
      appKey: customConf.config.appkey,
      uniqueId: customConf.config.wxAppid,
      channel: '',
    },
    device: {
      type: 'mobile',
      softwareConfig: {},
      hardwareConfig: {},
      deviceId: {},
    },
    networks: [
      { type: 'wifi', available: !1, connected: !1 },
      { type: 'cellular', available: !1, connected: !1, current: [] },
      { type: 'unknown', available: !1, connected: !1 },
    ],
    locations: [{}],
    appContext: {},
  },
  Util = {
    firstInit: !1,
    initTime: 0,
    sessionId: '',
    sessionStartTime: 0,
    appLaunchInfo: {},
    sendFailTimes: 0,
    bakData: {},
    Store: {
      set: function(e, t) {
        try {
          uni.setStorageSync('TDSDK_' + e, t);
        } catch (e) {}
        Util.bakData['TDSDK_' + e] = t;
      },
      get: function(e) {
        var t = null;
        try {
          t = uni.getStorageSync('TDSDK_' + e);
        } catch (e) {}
        return t || (t = Util.bakData['TDSDK_' + e] || null), t;
      },
      remove: function(e) {
        try {
          uni.removeStorageSync('TDSDK_' + e);
        } catch (e) {}
        delete Util.bakData['TDSDK_' + e];
      },
    },
    random: function() {
      for (
        var e = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
          t = e.length,
          n = '',
          i = 0;
        i < 12;
        i++
      )
        n += e.charAt(Math.floor(Math.random() * t));
      return n;
    },
    timestamp: function() {
      return new Date().getTime();
    },
    deviceId: function() {
      return 'weapp-' + this.timestamp() + '-' + this.random();
    },
    getEventId: function(e) {
      if (!e && !/0{1}/.test(e)) return '';
      var t = '';
      try {
        t = e.toString();
      } catch (n) {
        try {
          t = JSON.stringify(e);
        } catch (e) {}
      }
      return t.split(' ')[0].slice(0, 64);
    },
    addStoreData: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
        t = 'EVENT_' + Util.sessionId,
        n = Util.Store.get(t);
      (n = n && n.length ? n.concat(e) : e),
        Util.Store.set(t, n),
        n.length >= 30 && (onLaunchFn.sessionContinue(), onLaunchFn.startLoop());
    },
    eventHandle: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (e) {
        var n = getCurrentPages(),
          i = n[n.length - 1],
          a = {
            eventId: e,
            label: i.__route__,
            count: 1,
            startTime: Util.timestamp(),
          };
        if ('WeappShare' === e) {
          a.shareTickets = t.shareTickets;
          var o = JSON.parse(JSON.stringify(i.options || {}));
          (o.user = Util.deviceId),
            (o.title = t.title),
            (o.desc = t.desc),
            (o.path = t.path),
            (a.params = o);
        }
        Util.addStoreData([a]);
      }
    },
    getCacheData: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = Object.keys(e),
        n = [],
        i = [];
      return (
        t.length &&
          t.forEach(function(t) {
            var a = e[t];
            a && a.sendFail && a.data && ((n = n.concat(a.data)), i.push(t));
          }),
        { data: n, keys: i }
      );
    },
    sendCacheList: {},
    updateSendTime: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
        n = appInfo.device.deviceId,
        i = Util.Store.get('uid'),
        a = Util.Store.get('deviceId');
      return (
        e.forEach(function(o, s) {
          if (!o.device.deviceId.tid && !o.device.deviceId.uid)
            if (n.tid) {
              if (((o.device.deviceId.tid = n.tid), n.uid))
                return (o.device.deviceId.uid = n.uid), !0;
            } else {
              if (n.uid)
                return (o.device.deviceId.uid = n.uid), (o.device.deviceId.tid = n.uid), !0;
              if (TDID.isWaitingForOpenid) {
                if (i)
                  return (
                    (o.device.deviceId.uid = i),
                    (o.device.deviceId.tid = i),
                    (n.uid = i),
                    (n.tid = i),
                    !0
                  );
                if (a) (o.device.deviceId.tid = a), (o.device.deviceId.uid = '');
                else {
                  var r = Util.deviceId();
                  (n.tid = r),
                    (n.uid = ''),
                    Util.Store.set('deviceId', r),
                    (o.device.deviceId.tid = r),
                    (o.device.deviceId.uid = ''),
                    (TDID.shouldOverwriteTid = !1);
                }
              } else (o.device.deviceId.tid = n.tid), (o.device.deviceId.uid = n.uid);
            }
          o.action && o.action.data && (e[s].action.data.start = t);
        }),
        e
      );
    },
    getRequestData: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
        t = JSON.parse(JSON.stringify(e)),
        n = Util.sendCacheList;
      if (Object.keys(n).length) {
        var i = Util.getCacheData(n);
        (t = t.concat(i.data)),
          i.keys.forEach(function(e) {
            return delete n[e];
          });
      }
      var a = t.length;
      if (a) {
        var o = [];
        if (a >= 30) {
          JSON.stringify(t).length > 61440 && o.push(t.splice(0, a / 2)), o.push(t);
        } else o.push(t);
        o.forEach(function(e) {
          var t = Util.timestamp();
          n[t] = { data: e, sendFail: !1 };
          var i = Util.updateSendTime(e, Util.timestamp());
          Util.request(t, i);
        });
      }
    },
    request: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
      uni.request({
        url: _requestUrl,
        data: JSON.stringify(t),
        method: 'POST',
        success: function(t) {
          200 === t.statusCode &&
            (delete Util.sendCacheList[e],
            (Util.sendFailTimes = 0),
            appHandle.appIsHide ||
              (clearTimeout(onLaunchFn.timeout),
              (onLaunchFn.timeout = null),
              onLaunchFn.startLoop()));
        },
        fail: function() {
          appHandle.appIsHide
            ? (Util.Store.set('RESEND_' + e, t), delete Util.sendCacheList[e])
            : ((Util.sendCacheList[e].sendFail = !0),
              Util.sendFailTimes < 5 && Util.sendFailTimes++);
        },
      });
    },
  },
  TDID = {
    shouldOverwriteTid: !0,
    isWaitingForOpenid: !0,
    isFirst: !0,
    init: function() {
      var e = this,
        t = Util.Store.get('deviceId'),
        n = Util.Store.get('uid');
      if (n) {
        var i = t || n;
        e.setData(i, n);
      } else {
        var i = void 0;
        (i = t || Util.deviceId()),
          e.setData(i, ''),
          TDID.shouldOverwriteTid && Util.Store.set('deviceId', i),
          (TDID.isWaitingForOpenid = !1);
      }
    },
    setData: function(e, t) {
      TDID.shouldOverwriteTid
        ? (appInfo.device.deviceId = { tid: e, uid: t })
        : (appInfo.device.deviceId.uid = t),
        (waitFlag.uid = !1),
        onLaunchFn.getAppProfile();
    },
  },
  request = {
    sendTime: 0,
    statusType: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = [],
        n = JSON.parse(JSON.stringify(appInfo)),
        i = { domain: e.domain, name: e.name, data: e.data };
      (n.ts = e.data.start || Util.timestamp()), (n.action = i), t.push(n), Util.getRequestData(t);
    },
    dataType: function(e, t) {
      var n = this.getStoreList(e, t);
      Util.getRequestData(n);
    },
    getEventType: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      if (e.pageEvent) return { domain: 'page', name: 'leave' };
      if (e.eventId) {
        var t = e.eventId,
          n = {};
        switch (t) {
          case 'WeappShare':
            n = { domain: 'user', name: 'share' };
            break;
          case 'WeappPullDownRefresh':
            n = { domain: 'page', name: 'pullDownRefresh' };
            break;
          case 'WeappReachBottom':
            n = { domain: 'page', name: 'reachBottom' };
            break;
          default:
            n = { domain: 'appEvent', name: '' };
        }
        return n;
      }
    },
    getStoreList: function(e, t) {
      var n = this,
        i = [],
        a = e || Util.sessionId,
        o = JSON.stringify(appInfo),
        s = Util.Store.get('EVENT_' + a);
      return (
        s &&
          s.length &&
          (s.forEach(function(e) {
            var a = n.getEventType(e),
              s = JSON.parse(o);
            t && s.appContext && (s.appContext.sessionStartTime = t);
            var r = JSON.parse(JSON.stringify(e)),
              c = r.pageEvent ? r.leaveTime : r.startTime;
            r.pageEvent && delete r.pageEvent, r.leaveTime && delete r.leaveTime, (r.status = 2);
            var d = { domain: a.domain, name: a.name, data: r };
            (s.ts = c || Util.timestamp()), (s.action = d), i.push(s);
          }),
          Util.Store.remove('EVENT_' + a)),
        i
      );
    },
  },
  Account = {
    setAccountInfo: function(e) {
      var t = Util.Store.get(e);
      t && ('wxUserInfo' === e ? this.assignUserInfo(t) : 'account' === e && this.assignAccount(t));
    },
    updateAccountInfo: function(e, t) {
      Util.Store.set(e, t),
        'wxUserInfo' === e ? this.assignUserInfo(t) : 'account' === e && this.assignAccount(t);
    },
    assignUserInfo: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      appInfo.user = {
        accounts: [{ type: 'wechat', name: e.nickName || '', extra: [e] }],
      };
    },
    assignAccount: function(e) {
      appInfo.appContext.account = e;
    },
  },
  hasDataFlag = !1,
  onLaunchFn = {
    timeout: null,
    init: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      (Util.appLaunchInfo = JSON.parse(JSON.stringify(e))),
        (Util.appLaunchInfo.scene = e.scene ? e.scene.toString() : ''),
        TDID.init(),
        onLaunchFn.judgeRequireData(),
        onLaunchFn.getLocalParams(),
        customConf.config.getLocation && onLaunchFn.getLocation(),
        onLaunchFn.getSystemInfo(),
        onLaunchFn.getNetwork();
    },
    launchRequest: function() {
      var e = { first: !0 };
      request.statusType({ domain: 'app', name: 'init', data: e });
    },
    sessionStart: function(e) {
      var t = Util.appLaunchInfo || {},
        n = {
          status: 1,
          duration: 0,
          name: t.path,
          scene: t.scene,
          query: t.query || {},
          shareTicket: t.shareTicket,
          referrerInfo: t.referrerInfo,
        };
      e && onLaunchFn.setNewSession(),
        (n.start = Util.Store.get('session_time') || Util.timestamp()),
        (n.url = onLaunchFn.getUrl(n.name, n.query)),
        request.statusType({ domain: 'session', name: 'begin', data: n });
    },
    getUrl: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = Object.keys(t),
        i =
          n.sort(function(e, t) {
            return e > t;
          }) || [],
        a = i.length ? e + '?' : e;
      return (
        i.forEach(function(e, n) {
          0 !== n && (a += '&'), (a += e + '=' + t[e]);
        }),
        a
      );
    },
    sessionContinue: function() {
      request.dataType();
    },
    sessionEnd: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = { status: 3, start: e.startTime, duration: e.duration };
      request.statusType({ domain: 'session', name: 'end', data: t });
    },
    sendTmpSession: function() {
      onLaunchFn.sessionContinue(), onLaunchFn.startLoop();
    },
    startLoop: function() {
      onLaunchFn.timeout && (clearTimeout(onLaunchFn.timeout), (onLaunchFn.timeout = null));
      var e = 3e3 * (Util.sendFailTimes + 1);
      onLaunchFn.timeout = setTimeout(function() {
        onLaunchFn.sendTmpSession();
      }, e);
    },
    judgeRequireData: function() {
      appInfo.app.appKey ||
        ((appInfo.app.appKey = ''), console.error('请填写您在TalkingData申请的App ID')),
        appInfo.app.displayName ||
          ((appInfo.app.displayName = 'appname'), console.error('请填写您的小程序名称'));
    },
    getLocalParams: function() {
      var e = Util.Store.get('initTime');
      e
        ? (Util.initTime = e)
        : ((Util.initTime = Util.timestamp()),
          Util.Store.set('initTime', Util.initTime),
          (Util.firstInit = !0)),
        (appInfo.app.installTime = Util.initTime);
      var t = Util.appLaunchInfo.query || {},
        n = THIS_SITE_HOST;
      (appInfo.app.channel = n),
        Account.setAccountInfo('wxUserInfo'),
        Account.setAccountInfo('account'),
        onLaunchFn.setNewSession();
    },
    setNewSession: function() {
      (Util.sessionId = Util.deviceId()),
        (Util.sessionStartTime = Util.timestamp()),
        Util.Store.set('session_time', Util.sessionStartTime),
        (appInfo.appContext.sessionId = Util.sessionId),
        (appInfo.appContext.sessionStartTime = Util.sessionStartTime);
    },
    getLaunchInfo: function() {
      var e = JSON.parse(JSON.stringify(onLaunchFn.launchOptions));
      return (e.type = 'appLaunch'), e;
    },
    getAppProfile: function() {
      if (!hasDataFlag) {
        var e = ['device', 'network', 'uid'],
          t = !0;
        e.forEach(function(e) {
          waitFlag[e] && (t = !1);
        }),
          t && ((hasDataFlag = !0), this.startRequest());
      }
    },
    startRequest: function() {
      Util.firstInit && onLaunchFn.launchRequest(), this.sessionStart(), this.startLoop();
    },
    getLocation: function() {
      uni.getLocation({
        type: 'wgs84',
        complete: function(e) {
          if (e.longitude || e.latitude || e.horizontalAccuracy || e.verticalAccuracy) {
            var t = appInfo.locations[0];
            (t.lng = e.longitude),
              (t.lat = e.latitude),
              (t.hAccuracy = e.horizontalAccuracy),
              (t.vAccuracy = e.verticalAccuracy),
              (t.speed = e.speed),
              (t.altitude = e.altitude),
              (t.ts = new Date().getTime());
          }
        },
      });
    },
    getNetwork: function() {
      uni.getNetworkType({
        complete: function(e) {
          var t = appInfo.networks,
            n = e.networkType;
          'wifi' === n
            ? ((t[0].available = !0), (t[0].connected = !0))
            : 'unknown' === n
            ? ((t[2].available = !0), (t[2].connected = !0))
            : 'none' !== n &&
              ((t[1].available = !0), (t[1].connected = !0), t[1].current.push({ type: n })),
            (waitFlag.network = !1),
            onLaunchFn.getAppProfile();
        },
      });
    },
    getSystemInfo: function() {
      uni.getSystemInfo({
        complete: function(e) {
          if (e.model || e.system || e.SDKVersion) {
            var t = {
                model: e.model,
                pixel: e.screenWidth + '*' + e.screenHeight + '*' + e.pixelRatio,
                densityDpi: e.pixelRatio,
                brand: e.brand,
              },
              n = {
                os: e.system,
                local: e.language,
                language: 'zh_CN',
                osVersionCode: e.version,
                timezone: -new Date().getTimezoneOffset() / 60,
                mpVersion: e.SDKVersion,
              };
            (appInfo.device.hardwareConfig = t), (appInfo.device.softwareConfig = n);
          }
          (waitFlag.device = !1), onLaunchFn.getAppProfile();
        },
      });
    },
  },
  eventHandle = {
    event: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = Util.getEventId(e.id);
      if (t) {
        var n = {};
        (n.eventId = t),
          (n.label = Util.getEventId(e.label)),
          (n.count = e.count || 1),
          (n.params = e.params),
          (n.startTime = Util.timestamp()),
          Util.addStoreData([n]);
      }
    },
    share: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      Util.eventHandle('WeappShare', e);
    },
    pullDownRefresh: function() {
      customConf.config.autoOnPullDownRefresh || Util.eventHandle('WeappPullDownRefresh');
    },
    reachBottom: function() {
      customConf.config.autoOnReachBottom || Util.eventHandle('WeappReachBottom');
    },
    setAccount: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      return e.accountId || /0{1}/.test(e.accountId)
        ? e.accountType || /0{1}/.test(e.accountType)
          ? void Account.updateAccountInfo('account', e)
          : void console.warn('accountType为必填字段！')
        : void console.warn('accountId为必填字段！');
    },
    setWXUserInfo: function(e) {
      'object' !== (void 0 === e ? 'undefined' : _typeof(e)) || e instanceof Array
        ? console.warn('setUserInfo接口只接受json对象作为参数')
        : Account.updateAccountInfo('wxUserInfo', e);
    },
  },
  appHandle = {
    isHide2Show: !1,
    appIsHide: !1,
    lastHideTime: 0,
    show: function() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      if (((appHandle.appIsHide = !1), appHandle.getlastTmpData(), appHandle.isHide2Show)) {
        var t = Util.Store.get('TMP_time_end_' + Util.sessionId),
          n = e.scene ? e.scene.toString() : '';
        if (e.scene && n === Util.appLaunchInfo.scene) {
          Util.timestamp() - t > 3e4
            ? appHandle.sessionRestart(t)
            : ((appHandle.lastHideTime = t), Util.Store.remove('TMP_time_end_' + Util.sessionId));
        } else
          (Util.appLaunchInfo = JSON.parse(JSON.stringify(e))),
            (Util.appLaunchInfo.scene = n),
            appHandle.sessionRestart(t);
        (appHandle.isHide2Show = !1), onLaunchFn.startLoop();
      }
    },
    sessionRestart: function(e) {
      var t = Util.Store.get('TMP_time_start_' + Util.sessionId),
        n = { startTime: t, duration: parseInt((e - t) / 1e3) };
      onLaunchFn.sessionEnd(n),
        Util.Store.remove('TMP_time_start_' + Util.sessionId),
        Util.Store.remove('TMP_time_end_' + Util.sessionId),
        Util.Store.remove('session_time'),
        onLaunchFn.sessionStart(!0),
        (appHandle.lastHideTime = 0);
    },
    hide: function() {
      (appHandle.appIsHide = !0),
        clearTimeout(onLaunchFn.timeout),
        (onLaunchFn.timeout = null),
        onLaunchFn.sessionContinue(),
        (appHandle.isHide2Show = !0);
      var e = Util.Store.get('session_time'),
        t = Util.timestamp(),
        n = appHandle.lastHideTime ? t - appHandle.lastHideTime : t - e;
      Util.Store.set('TMP_time_start_' + Util.sessionId, e),
        Util.Store.set('TMP_time_end_' + Util.sessionId, t);
      var i = {
        start: t,
        duration: parseInt((t - e) / 1e3),
        durationHide: parseInt(n / 1e3),
      };
      request.statusType({ domain: 'session', name: 'hide', data: i });
    },
    getlastTmpData: function() {
      var e = [],
        t = uni.getStorageInfoSync().keys || [],
        n = void 0,
        i = void 0;
      t &&
        t.length &&
        ((n = t.filter(function(e) {
          return e.indexOf('TDSDK_EVENT') > -1;
        })),
        (i = t.filter(function(e) {
          return e.indexOf('TDSDK_RESEND') > -1;
        }))),
        n &&
          n.length &&
          (n.forEach(function(t) {
            var n = {};
            t.split('_')[2];
            (n.id = t.split('_')[2]), (n.time = n.id.split('-')[1]), e.push(n);
          }),
          appHandle.sendLastTmpData(e)),
        i &&
          i.length &&
          i.forEach(function(e) {
            uni.getStorage({
              key: e,
              success: function(t) {
                Util.getRequestData(t.data), uni.removeStorage({ key: e, success: function(e) {} });
              },
            });
          });
    },
    sendLastTmpData: function() {
      (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []).forEach(function(e) {
        request.dataType(e.id, e.time);
      });
    },
  },
  pageHandle = {
    curPagePath: '',
    refer: '',
    pageTime: 0,
    pageQuery: {},
    show: function() {
      var e = getCurrentPages(),
        t = e[e.length - 1];
      '' !== pageHandle.curPagePath && (pageHandle.refer = pageHandle.curPagePath),
        (pageHandle.curPagePath = t ? t.__route__ : ''),
        (pageHandle.pageTime = Util.timestamp()),
        (pageHandle.pageQuery = t ? t.options : '');
    },
    hide: function() {
      var e = Util.timestamp(),
        t = [
          {
            name: pageHandle.curPagePath,
            from: pageHandle.refer || '',
            query: pageHandle.pageQuery,
            scene: Util.appLaunchInfo.scene,
            duration: parseInt((e - pageHandle.pageTime) / 1e3),
            startTime: pageHandle.pageTime,
            pageEvent: !0,
            leaveTime: e,
          },
        ];
      Util.addStoreData(t);
    },
  },
  lifecycle = {
    onShow() {
      pageHandle.show();
    },
    onHide() {
      pageHandle.hide();
    },
    onUnload() {
      pageHandle.hide();
    },
  },
  appBak = App;
App = function(e) {
  var t = {
    onLaunch: onLaunchFn.init,
    onShow: appHandle.show,
    onHide: appHandle.hide,
  };
  Object.keys(t).forEach(function(n) {
    resetFn(e, n, t[n]);
  }),
    (e.td_app_sdk = eventHandle),
    appBak(e);
};

const Vue = require('vue');
(Vue.default || Vue).mixin(lifecycle);

// #endif

// #ifdef H5

window.sessionStorage.setItem('__TD_td_channel', window.location.hostname.replace(/\./g, "_"));
var tdjs = document.createElement("script");
tdjs.type = "text/javascript";
tdjs.async = true;
tdjs.src = "https://jic.talkingdata.com/app/h5/v1?appid=86697ADBE1104854B72523C08FFB688B";
document.getElementsByTagName("body")[0].appendChild(tdjs);

// #endif
