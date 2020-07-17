import forums from '@/mixin/forums';
import user from '@/mixin/user';
import appCommonH from '@/utils/commonHelper';
import { getRandomChars } from '@/utils/getRandomChars';
import { i18n } from '@/locale';

module.exports = {
  mixins: [forums, user, appCommonH],
  methods: {
    handleLogin(code) {
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
        this.login('', '', code);
      }
      return false;
    },
    login(nickname, wxtoken, code) {
      const { isWeixin } = appCommonH.isWeixin();
      const url = '/pages/home/index';
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
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
            // 无感模式
            this.noSenseh5Register(wxtoken, nickname, code);
          }
        } else {
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
            // 用户名模式
            console.log('用户名模式跳转到注册页');
            uni.navigateTo({
              url: `/pages/user/register?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
            // 手机号模式
            console.log('手机号模式跳转到手机号+验证码登陆页');
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
            });
          }
          if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
            if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
              // 手机号模式
              console.log('手机号模式跳转到手机号+验证码登陆页');
              uni.navigateTo({
                url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
              });
            } else {
              // 用户名模式
              console.log('用户名模式跳转到注册页');
              uni.navigateTo({
                url: `/pages/user/register?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
              });
            }
          }
        }
      } else {
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 0) {
          // 用户名模式
          console.log('用户名模式跳转到注册页');
          uni.navigateTo({
            url: `/pages/user/register?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 1) {
          // 手机号模式
          console.log('手机号模式跳转到手机号+验证码登陆页');
          uni.navigateTo({
            url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
          });
        }
        if (this.forums && this.forums.set_reg && this.forums.set_reg.register_type === 2) {
          if (this.forums && this.forums.qcloud && this.forums.qcloud.qcloud_sms) {
            // 手机号模式
            console.log('手机号模式跳转到手机号+验证码登陆页');
            uni.navigateTo({
              url: `/pages/user/verification-code-login?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
            });
          } else {
            // 用户名模式
            console.log('用户名模式跳转到注册页');
            uni.navigateTo({
              url: `/pages/user/register?url=${url}&validate=${this.forums.set_reg.register_validate}&code=${code}`,
            });
          }
        }
      }
    },
    noSenseh5Register(wxtoken, nickname, code) {
      let username = '';
      if (this.state) {
        username = nickname;
      } else if (nickname.length >= 15) {
        const name = nickname.slice(0, 9);
        username = `${name}${getRandomChars(6)}`;
      } else {
        username = `${nickname}${getRandomChars(6)}`;
      }
      const params = {
        data: {
          attributes: {
            username,
            password: '',
            token: wxtoken,
          },
        },
      };
      if (code !== '') {
        params.data.attributes.code = code;
      }
      this.$store
        .dispatch('session/h5Register', params)
        .then(result => {
          if (result && result.data && result.data.data && result.data.data.id) {
            this.state = true;
            console.log('注册成功', result);
            this.logind();
            uni.showToast({
              title: i18n.t('user.registerSuccess'),
              duration: 2000,
            });
          }
          if (
            result &&
            result.data &&
            result.data.errors &&
            result.data.errors[0].code === 'validation_error'
          ) {
            this.state = false;
            this.noSenseh5Register(wxtoken, nickname, code);
          }
        })
        .catch(registerErr => {
          console.log(registerErr);
        });
    },
  },
};
