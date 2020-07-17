import { DISCUZ_REQUEST_HOST } from '@/common/const';

const wx = require('jweixin-module');

module.exports = {
  methods: {
    /**
     * @description 微信分享
     * @param {title: string, desc: string, logo: string} shareData
     */
    wxShare(shareData) {
      // 这里使用 urlencode 编码下
      const url = this.getUrl();
      const forums = this.$store.getters['jv/get']('forums/1');
      if (forums.passport && !forums.passport.offiaccount_close) {
        return;
      }
      this.$store
        .dispatch('jv/get', [`offiaccount/jssdk?url=${encodeURIComponent(url)}`, {}])
        .then(data => {
          const { appId, nonceStr, signature, timestamp } = data;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId, // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名，见附录1
            jsApiList: [
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'hideMenuItems',
              'showMenuItems',
            ],
          });
          wx.ready(() => {
            // 需在用户可能点击分享按钮前就先调用
            const dataInfo = {
              title: shareData.title || 'Discuz!Q', // 分享标题
              desc: shareData.desc || forums.set_site.site_introduction, // 分享描述
              link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: shareData.logo || forums.set_site.site_favicon, // 分享图标
            };
            wx.updateAppMessageShareData(dataInfo); // 分享给朋友
            wx.updateTimelineShareData(dataInfo); // 分享到朋友圈
          });
        });
    },
    /**
     * @description h5分享复制链接
     * @param {string} title 主题title
     */
    // #ifdef H5
    h5Share(shareInfo) {
      let themeTitle = '';
      switch (typeof shareInfo) {
        case 'undefined':
          themeTitle = 'Discuz!Q';
          break;
        case 'string':
          themeTitle = shareInfo;
          break;
        default:
          themeTitle = shareInfo.title || 'Discuz!Q';
      }
      const id = shareInfo.id ? `?id=${shareInfo.id}` : '';
      const url = `${DISCUZ_REQUEST_HOST}${shareInfo.url}${id}`;
      const oInput = document.createElement('input');
      const reTag = /<img(?:.|\s)*?>/g;
      const reTag2 = /(<\/?br.*?>)/gi;
      const reTag3 = /(<\/?p.*?>)/gi;
      themeTitle = themeTitle.toString().replace(reTag, '');
      themeTitle = themeTitle.toString().replace(reTag2, '');
      themeTitle = themeTitle.toString().replace(reTag3, '');
      themeTitle = themeTitle.toString().replace(/\s+/g, '');
      themeTitle = `${themeTitle.substring(0, 17)}...`;
      oInput.value = `${themeTitle}  ${url}`;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      oInput.readOnly = true;
      oInput.id = 'copyInp';
      document.execCommand('Copy');
      oInput.setAttribute('onfocus', this.copyFocus(oInput));
      // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.style.display = 'none';
      uni.showToast({
        icon: 'none',
        title: '分享链接已复制成功',
      });
      // document.body.removeChild(oInput);
    },
    copyFocus(obj) {
      obj.blur();
      document.body.removeChild(obj);
    },
    getUrl() {
      const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      let url = window.location.href.split('#')[0];
      if (isiOS && window.entryUrl && !/wechatdevtools/.test(navigator.userAgent)) {
        // iOS下，URL必须设置为整个SPA的入口URL
        url = window.entryUrl;
      }
      return url;
    },
    // removeHtmlTag(str) {
    //   return str.replace(/<[^>]+>|\n/g, ''); // 正则去掉所有的html标记
    // },
    // #endif
  },
};
