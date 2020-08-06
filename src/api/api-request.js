// 将 api 的请求链接统一写在这个文件中
// https://ext.dcloud.net.cn/plugin?id=392
import Request from '@/utils/request';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import { i18n } from '@/locale';
// #ifdef MP-WEIXIN
import Vue from 'vue';
// #endif

const http = new Request();
let tostTimeout;
let app;

/**
 * @description 修改全局默认配置
 * @param {Function}
 */
http.setConfig(config => {
  /* config 为默认全局配置 */
  Object.assign(config, {
    baseUrl: `${DISCUZ_REQUEST_HOST}api/`,
    header: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    },
  });
  // #ifdef MP-WEIXIN
  Object.assign(config.header, {
    'X-App-Platform': 'wx_miniprogram',
  });
  // #endif
  return config;
});
http.validateStatus = statusCode => {
  return statusCode >= 200 && statusCode < 300;
};
/**
 * @param { Function} cancel - 取消请求,调用cancel 会取消本次请求，但是该函数的catch() 仍会执行; 不会进入响应拦截器
 *
 * @param {String} text ['handle cancel'| any] - catch((err) => {}) err.errMsg === 'handle cancel'。非必传，默认'handle cancel'
 * @cancel {Object} config - catch((err) => {}) err.config === config; 非必传，默认为request拦截器修改之前的config
 * function cancel(text, config) {}
 */
http.interceptor.request(conf => {
  const config = conf;

  if (config.custom.loading) {
    uni.showLoading({
      title: i18n.t('core.loading'),
      mask: true,
    });
  }

  // #ifdef MP-WEIXIN
  app = Vue.prototype;
  // #endif

  // #ifdef H5
  app = getApp();
  // #endif

  // cancel 为函数，如果调用会取消本次请求。需要注意：调用cancel,本次请求的catch仍会执行。必须return config
  try {
    const accessToken = app.$store.getters['session/get']('accessToken');

    if (accessToken) {
      // eslint-disable-next-line no-param-reassign
      config.header.Authorization = `Bearer ${accessToken}`;
    }
  } catch (e) {
    // error
  }
  return config;
});

// 在请求之后拦截
http.interceptor.response(
  response => {
    if (response.config.custom.loading) {
      uni.hideLoading();
    }
    // 状态码 >= 200 < 300 会走这里
    response.status = response.statusCode;
    return response;
  },
  response => {
    if (response.config.custom.loading) {
      uni.hideLoading();
    }

    // #ifdef MP-WEIXIN
    app = getApp().$vm;
    // #endif

    // #ifdef H5
    app = getApp();
    // #endif

    // 对响应错误做点什么 （statusCode !== 200），必须return response
    if (response && response.data && response.data.errors) {
      response.data.errors.forEach(error => {
        switch (error.code) {
          case 'access_denied':
            // token 无效 重新请求
            delete response.config.header.Authorization;
            break;
          case 'model_not_found':
            console.log('模型未找到');
            app.$store.dispatch('forum/setError', {
              code: 'type_404',
              status: 500,
            });
            break;
          case 'permission_denied':
            console.log('没有查看权限');
            app.$store.dispatch('forum/setError', {
              code: 'type_401',
              status: 500,
            });
            break;
          case 'site_closed':
            uni.showToast({
              icon: 'none',
              title: i18n.t(`core.${error.code}`),
            });
            break;
          case 'not_install':
          case 'ban_user':
            break;
          default:
            if (response.config.custom.showTost) {
              clearTimeout(tostTimeout);
              tostTimeout = setTimeout(() => {
                // eslint-disable-next-line no-nested-ternary
                const title = error.detail
                  ? Array.isArray(error.detail)
                    ? error.detail[0]
                    : error.detail
                  : i18n.t(`core.${error.code}`);
                uni.showToast({
                  icon: 'none',
                  title,
                });
              });
            }
        }
      });
    } else if (response.config.custom.showTost) {
      uni.showToast({ title: response.errMsg });
    }
    return response;
  },
);

export { http };
