<template>
  <qui-page :data-qui-theme="theme" class="site">
    <qui-header
      :head-img="
        forums.set_site && forums.set_site.site_logo
          ? forums.set_site.site_logo
          : '/static/logo.png'
      "
      :theme="i18n.t('home.theme')"
      :theme-num="forums.other && forums.other.count_users"
      :post-num="forums.other && forums.other.count_threads"
      :share-btn="shareBtn"
      :share-show="shareShow"
      :is-show-more="false"
      :is-show-back="false"
      :is-show-home="false"
      :iconcolor="theme === $u.light() ? '#333' : '#fff'"
      @click="open"
      @closeShare="closeShare"
    ></qui-header>
    <uni-popup ref="popupHead" type="bottom">
      <qui-share @close="cancel"></qui-share>
    </uni-popup>
    <view class="site-item">
      <qui-cell-item
        class="cell-item--left cell-item--auto"
        :title="i18n.t('site.circleintroduction')"
        :addon="forums.set_site && forums.set_site.site_introduction"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.creationtime')"
        :addon="forums.set_site && forums.set_site.site_install"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('discuzq.post.paymentAmount')"
        :addon="'¥' + ((forums.set_site && forums.set_site.site_price) || 0)"
        class="site-item__pay"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('site.periodvalidity')"
        :addon="
          forums.set_site && forums.set_site.site_expire
            ? (forums.set_site && forums.set_site.site_expire) + i18n.t('site.day')
            : i18n.t('site.permanent')
        "
      ></qui-cell-item>
      <qui-cell-item :title="i18n.t('site.circlemaster')" slot-right>
        <view class="site-item__owner">
          <qui-avatar
            class="site-item__owner-avatar"
            :user="{
              username: forums.set_site && forums.set_site.site_author.username,
              avatarUrl: forums.set_site && forums.set_site.site_author.avatar,
            }"
            size="60"
          />
          <text class="site-item__owner-name">
            {{ forums.set_site && forums.set_site.site_author.username }}
          </text>
        </view>
      </qui-cell-item>
      <qui-cell-item :title="i18n.t('home.theme')" slot-right :border="false">
        <view class="site-item__person">
          <view
            v-for="(item, index) in forums.users"
            :key="index"
            class="site-item__person__content"
          >
            <qui-avatar class="site-item__person__content-avatar" :user="item" size="60" />
          </view>
        </view>
      </qui-cell-item>
    </view>
    <view class="site-invite">
      <!-- #ifdef MP-WEIXIN -->
      <view class="site-invite__detail">
        <text>{{ i18n.t('site.justonelaststepjoinnow') }}</text>
        <text class="site-invite__detail__bold">
          {{ forums.set_site && forums.set_site.site_name }}
        </text>
        <text>{{ i18n.t('site.site') }}</text>
      </view>
      <view class="site-invite__button">
        <qui-button type="primary" size="large" @click="submit">
          {{ i18n.t('site.paynow') }}，¥{{ (forums.set_site && forums.set_site.site_price) || 0 }}
          {{
            forums.set_site && forums.set_site.site_expire
              ? `  / ${i18n.t('site.periodvalidity')}${forums.set_site &&
                  forums.set_site.site_expire}${i18n.t('site.day')}`
              : ` / ${i18n.t('site.permanent')}`
          }}
        </qui-button>
      </view>
      <!-- #endif -->

      <!-- #ifdef H5 -->
      <view class="site-invite__detail" v-if="isLogin">
        <text>{{ i18n.t('site.justonelaststepjoinnow') }}</text>
        <text class="site-invite__detail__bold">
          {{ forums.set_site && forums.set_site.site_name }}
        </text>
        <text>{{ i18n.t('site.site') }}</text>
      </view>
      <view class="site-invite__button" v-if="isLogin">
        <qui-button type="primary" size="large" @click="submit">
          {{ i18n.t('site.paynow') }}，¥{{ (forums.set_site && forums.set_site.site_price) || 0 }}
          {{
            forums.set_site && forums.set_site.site_expire
              ? `  / ${i18n.t('site.periodvalidity')}${forums.set_site &&
                  forums.set_site.site_expire}${i18n.t('site.day')}`
              : ` / ${i18n.t('site.permanent')}`
          }}
        </qui-button>
      </view>
      <view class="site-invite__join" v-if="!isLogin">
        <qui-button type="primary" size="large" @click="toLogin">
          {{ i18n.t('site.join') }}{{ i18n.t('site.site') }}
        </qui-button>
      </view>
      <!-- #endif -->

      <view v-if="payShowStatus">
        <qui-pay
          ref="payShow"
          :money="forums.set_site && parseFloat(forums.set_site.site_price)"
          :wallet-status="true"
          :balance="10"
          :pay-type-data="payTypeData"
          @radioMyHead="radioMyHead"
          @onInput="onInput"
          @paysureShow="paysureShow"
        ></qui-pay>
      </view>
      <uni-popup ref="codePopup" type="center" class="code-popup-box">
        <view class="code-content" v-if="qrcodeShow">
          <view class="code-title">{{ pay.payNow }}</view>
          <view class="code-pay-money">
            <view class="code-yuan">￥</view>
            {{ forums.set_site && forums.set_site.site_price }}
          </view>
          <view class="code-type-box">
            <view class="code-type-tit">{{ pay.payType }}</view>
            <view class="code-type">
              <qui-icon
                class="code-type-icon"
                name="icon-wxPay"
                size="36"
                color="#09bb07"
              ></qui-icon>
              <view class="code-type-text">{{ pay.wxPay }}</view>
            </view>
          </view>
          <image :src="codeUrl" class="code-img"></image>
          <view class="code-tip">{{ pay.wechatIdentificationQRcode }}</view>
        </view>
      </uni-popup>
      <qui-toast ref="toast"></qui-toast>
    </view>
  </qui-page>
</template>

<script>
import forums from '@/mixin/forums';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
import loginAuth from '@/mixin/loginAuth-h5';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
// #endif

let payWechat = null;

export default {
  mixins: [
    forums,
    // #ifdef  H5
    wxshare,
    appCommonH,
    loginAuth,
    // #endif
  ],
  data() {
    return {
      payShowStatus: true, // 是否显示支付
      codeUrl: '', // 二维码支付url，base64
      shareBtn: 'icon-share1',
      shareShow: false, // h5内分享提示信息
      isAnonymous: '0',
      qrcodeShow: false, // 二维码弹框
      isWeixin: '', // 是否是微信浏览器内
      isPhone: false,
      wxRes: '',
      browser: 0, // 0为小程序，1为除小程序之外的设备
      payStatus: false, // 订单支付状态
      orderSn: '', // 订单编号
      isLogin: this.$store.getters['session/get']('isLogin'),
      payTypeData: [
        {
          name: this.i18n.t('pay.wxPay'),
          icon: 'icon-wxPay',
          color: '#09bb07',
          value: '0',
        },
      ],
    };
  },
  computed: {
    // pay支付语言包
    pay() {
      return this.i18n.t('pay');
    },
    userId() {
      return this.$store.getters['session/get']('userId');
    },
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    uni.hideHomeButton();
    // #endif
    this.$u.event.$on('logind', data => {
      // 点击授权登陆成功后如果是已付费去首页
      if (data.paid) {
        uni.redirectTo({
          url: '/pages/home/index',
        });
      }
    });
    // #ifdef  H5
    this.isWeixin = appCommonH.isWeixin().isWeixin;
    this.isPhone = appCommonH.isWeixin().isPhone;
    this.browser = 1;
    // #endif
    // 已经支付过的直接去首页
    if (!this.userId) {
      return;
    }
    this.userInfo();
  },
  onUnload() {
    clearInterval(payWechat);
  },
  // 唤起小程序原声分享
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      return {
        title: this.forums.set_site.site_name,
      };
    }
    return {
      title: this.forums.set_site.site_name,
    };
  },
  methods: {
    userInfo() {
      const params = {
        include: 'groups,wechat',
      };
      this.$store.dispatch('jv/get', [`users/${this.userId}`, { params }]).then(res => {
        if (res.paid) {
          window.location.href = '/pages/home/index';
        }
      });
    },
    // 首页头部分享按钮弹窗
    open() {
      // #ifdef MP-WEIXIN
      this.$refs.popupHead.open();
      // #endif
      // #ifdef H5
      if (this.isWeixin === true) {
        this.shareShow = true;
      } else {
        this.h5Share({
          title: this.forums.set_site.site_name,
          url: 'pages/site/info',
        });
      }
      // #endif
    },
    closeShare() {
      this.shareShow = false;
    },
    // 取消按钮
    cancel() {
      this.$refs.popupHead.close();
    },
    // 支付是否显示用户头像
    radioMyHead(val) {
      this.isAnonymous = val;
    },
    // 输入密码完成时
    onInput(val) {
      this.value = val;
      this.creatOrder(this.forums.set_site.site_price, 1, val);
    },
    // 支付方式选择完成点击确定时
    paysureShow() {
      this.creatOrder(this.forums.set_site.site_price, 1, this.value);
    },
    // 创建订单
    creatOrder(amount, type, value) {
      const params = {
        _jv: {
          type: 'orders',
        },
        type,
        amount,
        is_anonymous: this.isAnonymous,
      };
      this.$store.dispatch('jv/post', params).then(res => {
        this.orderSn = res.order_sn;
        if (this.browser === 0) {
          this.orderPay(13, value, this.orderSn, '0'); // 微信小程序
        } else if (this.isWeixin && this.isPhone) {
          this.orderPay(12, value, this.orderSn, '1'); // 微信浏览器
        } else if (this.isPhone) {
          this.orderPay(11, value, this.orderSn, '2'); // 手机浏览器
        } else {
          this.orderPay(10, value, this.orderSn, '3'); // pc浏览器
        }
      });
    },
    // 订单支付
    orderPay(type, value, orderSn, browserType) {
      let params = {};
      params = {
        _jv: {
          type: `trade/pay/order/${orderSn}`,
        },
        payment_type: type,
      };
      this.$store.dispatch('jv/post', params).then(res => {
        this.wxRes = res;
        if (browserType === '0') {
          this.wechatPay(
            res.wechat_js.timeStamp,
            res.wechat_js.nonceStr,
            res.wechat_js.package,
            res.wechat_js.signType,
            res.wechat_js.paySign,
          );
        } else if (browserType === '1') {
          if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(res), false);
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(res));
              document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(res));
            }
          } else {
            this.onBridgeReady(res);
          }
        } else if (browserType === '2') {
          const url = encodeURI(`${DISCUZ_REQUEST_HOST}pages/site/info`);
          window.location.replace(`${res.wechat_h5_link}&redirect_url=${url}`);
        } else if (browserType === '3') {
          if (res) {
            this.codeUrl = res.wechat_qrcode;
            this.payShowStatus = false;
            this.$refs.codePopup.open();
            this.qrcodeShow = true;
            payWechat = setInterval(() => {
              if (this.payStatus === 1) {
                clearInterval(payWechat);
                return;
              }
              this.getOrderStatus(this.orderSn, browserType);
              uni.hideLoading();
            }, 3000);
          }
        }
      });
    },
    // 查询订单支状 browserType: 0是小程序，1是微信浏览器，2是h5，3是pc
    getOrderStatus(orderSn, browserType) {
      this.$store
        .dispatch('jv/get', [`orders/${orderSn}`, { custom: { loading: false } }])
        .then(res => {
          this.payStatus = res.status;
          if (this.payStatus === 1) {
            this.payShowStatus = false;
            this.coverLoading = false;
            if (browserType === '3') {
              // 这是pc扫码支付完成
              this.$refs.codePopup.close();
              this.qrcodeShow = false;
            }
            window.location.href = '/pages/home/index';
            this.$refs.toast.show({ message: this.p.paySuccess });
          }
        })
        .catch(() => {
          this.coverLoading = false;
          this.$refs.toast.show({ message: this.pay.payFail });
        });
    },
    // 非小程序内微信支付
    onBridgeReady(data) {
      // eslint-disable-next-line no-undef
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: data.wechat_js.appId, // 公众号名称，由商户传入
          timeStamp: data.wechat_js.timeStamp, // 时间戳，自1970年以来的秒数
          nonceStr: data.wechat_js.nonceStr, // 随机串
          package: data.wechat_js.package,
          signType: 'MD5', // 微信签名方式：
          paySign: data.wechat_js.paySign, // 微信签名
        },
        res => {
          // alert('支付唤醒');
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            uni.redirectTo({
              url: '/pages/home/index',
            });
            // 微信支付成功，进行支付成功处理
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            // 取消支付
            clearInterval(payWechat);
          } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
            // 支付失败
            clearInterval(payWechat);
          }
        },
      );

      payWechat = setInterval(() => {
        if (this.payStatus === 1) {
          clearInterval(payWechat);
          return;
        }
        this.getOrderStatus(this.orderSn, '1');
      }, 3000);
    },
    wechatPay(timeStamp, nonceStr, packageVal, signType, paySign) {
      // 小程序支付。
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp,
        nonceStr,
        package: packageVal,
        signType,
        paySign,
        success() {
          uni.navigateTo({
            url: '/pages/home/index',
          });
        },
        fail(err) {
          console.log(`fail:${JSON.stringify(err)}`);
        },
      });
    },
    // 跳支付页面
    submit() {
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.$store.getters['session/get']('auth').open();
        // #endif
        // #ifdef H5
        if (!this.handleLogin()) {
          return;
        }
        // #endif
        return;
      }
      this.payStatus = false;
      this.payShowStatus = true;
      this.$nextTick(() => {
        this.$refs.payShow.payClickShow();
      });
    },
    toLogin() {
      this.handleLogin();
    },
    // 调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.site /deep/ {
  .header {
    height: auto;
    margin-bottom: 30rpx;
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  .header .circleDet {
    padding: 60rpx 40rpx 50rpx;
    opacity: 1;
  }
  .header .circleDet-txt {
    color: --color(--qui-FC-333);
    opacity: 1;
  }
  .header .logo {
    height: 75rpx;
    padding-top: 71rpx;
  }
  .cell-item__body__content-title {
    width: 120rpx;
    margin-right: 40rpx;
    color: --color(--qui-FC-777);
  }
  .header .circleDet-num,
  .header .circleDet-share {
    color: --color(--qui-FC-333);
  }
  .site-invite {
    padding-bottom: 50rpx;
    text-align: center;
  }
  .site-invite__join {
    margin-top: 50rpx;
  }
  .cell-item--auto .cell-item__body {
    height: auto;
    padding: 35rpx 0;
    align-items: flex-start;
  }
  .cell-item--left .cell-item__body__right {
    text-align: left;
  }
  .popup-pay {
    .pay-title,
    .pay-radio {
      display: none;
    }
    .pay-btn {
      margin-top: 40rpx;
      margin-bottom: 40rpx;
    }
  }
  .popup-pay-type {
    padding-top: 40rpx;
    .pay-title {
      display: none;
    }
    .pay-tip {
      display: none;
    }
    .pay-type-chi {
      margin-bottom: 40rpx;
    }
  }
}
// 微信二维码弹框

.code-content {
  position: fixed;
  top: 10%;
  left: 11%;
  z-index: 22;
  display: flex;
  flex-direction: column;
  width: 78%;
  padding: 40rpx;
  background: --color(--qui-BG-FFF);
  border-radius: 16rpx;
  box-sizing: border-box;
  .code-title {
    text-align: center;
  }
  .code-pay-money {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 36rpx;
    padding-bottom: 36rpx;
    font-size: 70rpx;
    .code-yuan {
      font-size: 48rpx;
      line-height: 66rpx;
    }
  }
}

.code-type-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 24rpx 0 34rpx;
  line-height: 36rpx;
  border-top: 1px solid --color(--qui-BG-ED);
  .code-type-tit {
    color: --color(--qui-FC-AAA);
  }
  .code-type {
    display: flex;
    flex-direction: row;
    .code-type-icon {
      font-size: 36rpx;
    }
    .code-type-text {
      padding-left: 12rpx;
    }
  }
}
.code-img {
  align-self: center;
  width: 380rpx;
  height: 380rpx;
}
.code-tip {
  padding: 14rpx 0 20rpx;
}
//下面部分样式
.site-item {
  padding-left: 40rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.site .cell-item {
  padding-right: 40rpx;
}
.site-invite__detail__bold {
  margin: 0 5rpx;
  font-weight: bold;
}
.site-invite__detail {
  width: 90%;
  padding: 0 20rpx;
  margin: 50rpx auto 30rpx;
  font-size: 28rpx;
}
.site-item__pay .cell-item__body__right-text {
  color: --color(--qui-RED);
}
.site-item__person__content-avatar,
.site-item__owner-avatar {
  margin-left: 8rpx;
}
.site-item__person__content-avatar {
  margin-left: 8rpx;
}
.site-item__owner {
  display: flex;
  align-items: center;
}
.site-item__owner-avatar {
  margin-right: 20rpx;
}
.site-item__person {
  display: flex;
  height: 60rpx;
  overflow: hidden;
  font-size: 0;
}
.site-item__person__content {
  display: inline-block;
}
</style>
