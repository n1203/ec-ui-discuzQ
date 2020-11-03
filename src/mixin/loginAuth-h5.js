import forums from '@/mixin/forums';
import user from '@/mixin/user';
import appCommonH from '@/utils/commonHelper';

module.exports = {
  mixins: [forums, user, appCommonH],
  methods: {
    handleLogin(url, code) {
      const { isWeixin } = appCommonH.isWeixin();
      if (
        isWeixin &&
        this.forums &&
        this.forums.passport &&
        this.forums.passport.offiaccount_close
      ) {
        // 微信授权跳转
        uni.setStorage({
          key: 'inviteCode',
          data: code,
        });
        this.$store.dispatch('session/wxh5Login');
      } else {
        this.login(url, '', code);
      }
      return false;
    },
    login(url = '/pages/home/index', wxtoken, code) {
      const { isWeixin } = appCommonH.isWeixin();
      // if (index) {
      //   this.setFooterIndex(parseInt(index, 10));
      // }
      if (isWeixin) {
        // 微信内
        if (this.forums && this.forums.passport && this.forums.passport.offiaccount_close) {
          // 开启微信公众号
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
            // 用户名模式 跳转到注册并绑定页
            uni.navigateTo({
              url: `/pages/user/register-bind?url=${url}&validate=${this.forums.set_reg.register_validate}&token=${wxtoken}&code=${code}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
            // 手机号模式 跳转到手机号+验证码登陆页
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&token=${wxtoken}&code=${code}`,
            });
          }
        } else {
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
            // 用户名模式
            uni.navigateTo({
              url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
            // 手机号模式
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
            if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
              // 手机号模式
              uni.navigateTo({
                url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
              });
            } else {
              // 用户名模式
              uni.navigateTo({
                url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
              });
            }
          }
        }
      } else {
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 用户名模式
          uni.navigateTo({
            url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 手机号模式
          uni.navigateTo({
            url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
            // 手机号模式
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
            });
          } else {
            // 用户名模式
            uni.navigateTo({
              url: `/pages/user/login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
            });
          }
        }
      }
    },
  },
};
