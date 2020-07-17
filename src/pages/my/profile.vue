<template>
  <qui-page :data-qui-theme="theme" class="profile">
    <!-- #ifdef H5-->
    <qui-header-back :title="i18n.t('profile.myprofile')"></qui-header-back>
    <!-- #endif -->
    <view class="my-profile">
      <!-- canEditUsername 是否允许修改用户名-->
      <navigator
        :url="`/pages/modify/editusername?id=${userId}`"
        hover-class="none"
        v-if="profile.canEditUsername"
      >
        <qui-cell-item
          :title="i18n.t('profile.username')"
          arrow
          :addon="profile.username"
        ></qui-cell-item>
      </navigator>
      <qui-cell-item
        :title="i18n.t('profile.username')"
        arrow
        class="no-arrow"
        v-if="!profile.canEditUsername"
        :addon="profile.username"
      ></qui-cell-item>
      <qui-cell-item :title="i18n.t('profile.avatar')" slot-right arrow @tap="changeAvatar">
        <qui-avatar class="my-profile__avatar" :user="profile" />
      </qui-cell-item>
      <!-- qcloud_sms 是否开启短信服务  没有绑定手机号码，跳到“设置新手机”页,反之跳到修改手机号页面，-->
      <navigator
        :url="
          profile.mobile
            ? `/pages/modify/mobile?id=${userId}`
            : `/pages/modify/setphon?id=${userId}`
        "
        hover-class="none"
        v-if="forums.qcloud && forums.qcloud.qcloud_sms"
      >
        <qui-cell-item
          :title="i18n.t('profile.mobile')"
          arrow
          :addon="profile.mobile ? profile.mobile : i18n.t('profile.bindingmobile')"
        ></qui-cell-item>
      </navigator>
      <!--没有密码，跳到“设置密码”页,反之跳到密码是修改页面，-->
      <navigator
        :url="
          profile.hasPassword
            ? `/pages/modify/editpwd?id=${userId}`
            : `/pages/modify/newpwd?id=${userId}`
        "
        hover-class="none"
      >
        <qui-cell-item
          :title="i18n.t('profile.password')"
          arrow
          :addon="profile.hasPassword ? i18n.t('profile.modify') : i18n.t('profile.setpassword')"
        ></qui-cell-item>
      </navigator>
      <qui-cell-item
        :title="i18n.t('profile.wechat')"
        :addon="profile.wechat && profile.wechat.nickname"
        arrow
        class="no-arrow"
      ></qui-cell-item>
      <!-- qcloud_faceid 是否开启实名认证 -->
      <qui-cell-item
        v-if="profile.realname && forums.qcloud && forums.qcloud.qcloud_faceid"
        :title="i18n.t('profile.certification')"
        :addon="profile.realname"
        arrow
        class="no-arrow"
      ></qui-cell-item>
      <navigator
        :url="`/pages/modify/realname?id=${userId}`"
        hover-class="none"
        v-if="!profile.realname && forums.qcloud && forums.qcloud.qcloud_faceid"
      >
        <qui-cell-item
          :title="i18n.t('profile.certification')"
          arrow
          :addon="i18n.t('profile.tocertification')"
        ></qui-cell-item>
      </navigator>
      <navigator :url="`/pages/modify/signature?id=${userId}`" hover-class="none">
        <qui-cell-item
          :title="i18n.t('profile.signature')"
          arrow
          :addon="i18n.t('profile.modify')"
          :border="false"
        ></qui-cell-item>
      </navigator>
      <qui-uploader
        :url="`${host}api/users/${userId}/avatar`"
        :header="header"
        :form-data="formData"
        async-clear
        count="1"
        ref="upload"
        name="avatar"
        @uploadSuccess="uploadSuccess"
        @uploadFail="uploadFail"
        @chooseSuccess="chooseSuccess"
      ></qui-uploader>
      <qui-toast ref="toast"></qui-toast>
    </view>
  </qui-page>
</template>

<script>
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import forums from '@/mixin/forums';

export default {
  mixins: [forums],
  data() {
    return {
      hasPassword: false,
      header: {},
      formData: {},
      show: false,
      host: DISCUZ_REQUEST_HOST,
      userId: this.$store.getters['session/get']('userId'), // 获取当前登陆用户的ID
    };
  },
  computed: {
    profile() {
      const data = this.$store.getters['jv/get'](`users/${this.userId}`);
      data.avatarUrl = data.avatarUrl || '/static/noavatar.gif';
      return data;
    },
  },
  // 解决左上角返回数据不刷新情况
  onShow() {
    const params = {
      include: 'groups,wechat',
    };
    this.$store.dispatch('jv/get', [`users/${this.userId}`, { params }]);
  },
  onLoad() {
    const token = uni.getStorageSync('access_token');
    this.header = {
      authorization: `Bearer ${token}`,
    };
    this.formData = {
      type: 1,
    };
  },
  methods: {
    uploadSuccess(res) {
      uni.hideLoading();
      if (res.statusCode >= 200 && res.statusCode < 300) {
        this.$refs.toast.show({ message: this.i18n.t('profile.successfullyuploadedtheavatar') });
        const newAvatar = JSON.parse(res.data).data.attributes.avatarUrl;
        this.profile.avatarUrl = newAvatar;
      } else {
        const { code } = JSON.parse(res.data).errors[0];
        if (code === 'upload_time_not_up') {
          this.$refs.toast.show({ message: this.i18n.t('profile.uploadtimenotup') });
        } else if (code === 'validation_error') {
          this.$refs.toast.show({ message: this.i18n.t('profile.validationerror') });
        } else {
          this.$refs.toast.show({ message: code });
        }
      }
    },
    changeAvatar() {
      this.$refs.upload.uploadClick();
    },
    chooseSuccess() {
      uni.showLoading();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.profile /deep/ {
  overflow: hidden;
  .my-profile {
    position: relative;
    padding-top: 40rpx;
    padding-left: 40rpx;
    /* #ifdef H5 */
    margin-top: 50rpx;
    /* #endif */
    background: --color(--qui-BG-2);
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    box-sizing: border-box;
  }
  .cell-item {
    padding-right: 40rpx;
  }
  .cell-item__body__content-title {
    color: --color(--qui-FC-777);
  }
  .cell-item__body__right {
    color: --color(--qui-FC-333);
  }
  .qui-uploader-box {
    display: none;
  }
  .no-arrow .arrow {
    visibility: hidden;
  }
}

.my-profile__avatar {
  position: absolute;
  top: 13rpx;
  right: 44rpx;
  width: 75rpx;
  height: 75rpx;
}
</style>
