<template>
  <qui-page :data-qui-theme="theme" class="content">
    <!-- #ifdef H5-->
    <qui-header-back :title="navTitle"></qui-header-back>
    <!-- #endif -->
    <view v-if="loaded">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        show-scrollbar="false"
        class="scroll-y"
        @scrolltolower="pullDown"
      >
        <view class="ft-gap">
          <view class="bg-white">
            <view class="detail-tip" v-if="thread.type == 2 && thread.threadVideo.status == 0">
              {{ t.transcodingTip }}
            </view>

            <view class="detail-tip" v-else-if="thread.type == 2 && thread.threadVideo.status == 2">
              {{ t.transcodingFailedTip }}
            </view>
            <view class="detail-tip" v-else-if="thread.isApproved == 0">
              {{ t.examineTip }}
            </view>

            <qui-topic-content
              :topic-status="thread.isApproved"
              :pay-status="thread.price > 0 && thread.paid"
              :video-status="(thread.price > 0 && thread.paid) || thread.price == 0"
              :avatar-url="thread.user.avatarUrl"
              :user-name="thread.user.username"
              :user-role="thread.user.groups"
              :theme-type="thread.type"
              :theme-time="thread.createdAt"
              :management-show="
                selectList[0].canOpera ||
                  selectList[1].canOpera ||
                  selectList[2].canOpera ||
                  selectList[3].canOpera
              "
              :theme-title="thread.type == 1 ? thread.title : ''"
              :theme-content="thread.firstPost.contentHtml"
              :images-list="thread.firstPost.images"
              :select-list="selectList"
              :tags="[thread.category]"
              :thread-price="thread.price"
              :thread-is-essence="thread.isEssence"
              :media-url="thread.type == 2 ? thread.threadVideo.media_url : ''"
              :video-width="thread.type == 2 ? thread.threadVideo.width : 0"
              :video-height="thread.type == 2 ? thread.threadVideo.height : 0"
              :cover-image="thread.type == 2 ? thread.threadVideo.cover_url : ''"
              :file-list="
                thread.type == 1 && thread.firstPost.attachments ? thread.firstPost.attachments : []
              "
              @personJump="personJump(thread.user._jv.id)"
              @selectChoice="selectChoice"
              @videocoverClick="payClickShow"
              @previewPicture="payClickShow"
              @tagClick="tagClick"
            ></qui-topic-content>
            <!-- <qui-button size="max" type="primary" class="publishBtn" @tap="payClickShow()">
            {{ p.pay }}
          </qui-button> -->
            <!-- 已支付用户列表 -->
            <view v-if="paidStatus">
              <qui-person-list
                :type="t.pay"
                :person-num="thread.paidCount"
                :limit-count="limitShowNum"
                :person-list="thread.paidUsers"
                :btn-show="paidBtnStatus"
                :btn-icon-show="true"
                btn-icon-name="rmb"
                :btn-text="payThreadTypeText"
                @personJump="personJump"
                @btnClick="payClickShow"
              ></qui-person-list>
            </view>
            <!-- 打赏用户列表 -->
            <view v-if="rewardStatus">
              <qui-person-list
                :type="t.reward"
                :person-num="thread.rewardedCount"
                :limit-count="limitShowNum"
                :person-list="rewardedUsers"
                :btn-show="true"
                :btn-icon-show="true"
                btn-icon-name="reward"
                :btn-text="t.reward"
                @personJump="personJump"
                @btnClick="rewardClick"
              ></qui-person-list>
            </view>
            <view v-if="thread.firstPost.likedUsers.length > 0">
              <!-- 点赞用户列表 -->
              <qui-person-list
                :type="t.giveLike"
                :person-num="thread.firstPost.likeCount"
                :limit-count="limitShowNum"
                :person-list="thread.firstPost.likedUsers"
                :btn-show="false"
                @personJump="personJump"
              ></qui-person-list>
            </view>
            <view class="det-con-ft">
              <view class="det-con-ft-child">{{ t.read }}{{ thread.viewCount }}</view>
              <view
                class="det-con-ft-child"
                @click="
                  threadCollectionClick(thread._jv.id, thread.canFavorite, thread.isFavorite, '1')
                "
              >
                <qui-icon
                  v-if="thread.isFavorite"
                  name="icon-collectioned"
                  class="qui-icon"
                ></qui-icon>

                <qui-icon v-else name="icon-collection" class="qui-icon"></qui-icon>
                <view v-if="thread.isFavorite">{{ t.collectionAlready }}</view>
                <view v-else>{{ t.collection }}</view>
              </view>
            </view>
          </view>
          <!-- 评论 -->
          <view class="comment">
            <view
              class="comment-num"
              :style="{ paddingBottom: thread.postCount > 1 ? '0' : '40rpx' }"
            >
              {{ thread.postCount - 1 }}{{ t.item }}{{ t.comment }}
            </view>

            <view v-if="posts.length > 0">
              <view v-for="(post, index) in posts" :key="index">
                <qui-topic-comment
                  v-if="!post.isDeleted"
                  :post-id="post._jv.id"
                  :comment-avatar-url="post.user.avatarUrl"
                  :user-name="post.user.username"
                  :is-liked="post.isLiked"
                  :user-role="post.user.groups"
                  :comment-time="post.createdAt"
                  :comment-status="post.isApproved"
                  :comment-content="post.summary"
                  :reply-list="post.lastThreeComments"
                  :comment-like-count="post.likeCount"
                  :images-list="post.images"
                  :reply-count="post.replyCount"
                  :can-delete="post.canHide"
                  :comment-show="true"
                  @personJump="personJump(post.user.id)"
                  @commentLikeClick="
                    commentLikeClick(post._jv.id, '4', post.canLike, post.isLiked, index, post)
                  "
                  @commentJump="commentJump(threadId, post._jv.id)"
                  @imageClick="imageClick"
                  @deleteComment="
                    deleteComment(post._jv.id, '3', post.canHide, post.isDeleted, post)
                  "
                  @replyComment="replyComment(post._jv.id, index)"
                ></qui-topic-comment>
              </view>
              <!--<view v-for="(post, index) in posts" :key="index">
              {{ post.likeCount }}
              <view v-for="(group, gindex) in post.user.groups" :key="gindex">{{ group.name }}</view>
            </view>-->
            </view>
          </view>
        </view>

        <qui-load-more
          :status="loadingType"
          :content-text="{
            contentdown: c.contentdown,
            contentrefresh: c.contentrefresh,
            contentnomore: contentnomoreVal,
          }"
        ></qui-load-more>
      </scroll-view>
      <!--详情页底部-->
      <view
        class="det-ft"
        :style="{
          bottom: detectionModel() ? '20rpx' : 0,
        }"
        v-if="footerShow"
      >
        <view class="det-ft-con">
          <view
            class="det-ft-child flex"
            @click="
              threadLikeClick(
                thread.firstPost._jv.id,
                thread.firstPost.canLike,
                thread.firstPost.isLiked,
              )
            "
          >
            <qui-icon
              :name="thread.firstPost.isLiked ? 'icon-liked' : 'icon-like'"
              class="qui-icon"
            ></qui-icon>
            <view class="ft-child-word">
              {{ thread.firstPost.isLiked ? t.giveLikeAlready : t.giveLike }}
            </view>
          </view>
          <view class="det-ft-child flex" @click="threadComment(thread._jv.id)">
            <qui-icon name="icon-comments" class="qui-icon"></qui-icon>
            <view class="ft-child-word">{{ t.writeComment }}</view>
          </view>
          <view class="det-ft-child flex" @click="shareClick">
            <qui-icon name="icon-share" class="qui-icon"></qui-icon>
            <view class="ft-child-word">{{ t.share }}</view>
          </view>
        </view>
      </view>
      <view class="mask" v-if="shareShow" @click="closeShare">
        <view class="wxShareTip">
          <img src="/static/sharePoint.png" alt class="sharePoint" />
          <img src="/static/shareKnow.png" alt class="shareKnow" />
        </view>
      </view>
      <!--分享弹框-->
      <uni-popup ref="sharePopup" type="bottom">
        <view class="popup-share">
          <view class="popup-share-content">
            <button class="popup-share-button" open-type="share"></button>
            <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
              <view class="popup-share-content-image">
                <view class="popup-share-box" @click="shareContent(index)">
                  <qui-icon
                    class="content-image"
                    :name="item.icon"
                    size="46"
                    color="#777777"
                  ></qui-icon>
                </view>
              </view>
              <text class="popup-share-content-text">{{ item.text }}</text>
            </view>
          </view>
          <view class="popup-share-content-space"></view>
          <text class="popup-share-btn" @click="cancel('share')">{{ c.cancel }}</text>
        </view>
      </uni-popup>
      <!--打赏选择金额弹框-->
      <uni-popup ref="rewardPopup" type="bottom">
        <view class="popup-box">
          <view class="popup-reward-content">
            <text class="popup-title">
              {{ t.supportTheAuthorToCreate }}
            </text>
            <view class="popup-content-btn">
              <qui-button
                class="popup-btn"
                v-for="(item, index) in payNum"
                :key="index"
                :type="payNumCheck[0].name === item.name ? 'primary' : 'post'"
                plain
                size="post"
                @click="moneyClick(index)"
              >
                {{ item.name }}
              </qui-button>
            </view>
          </view>
          <view class="popup-content-space"></view>
          <text class="popup-cancel-btn" @click="cancelReward()">
            {{ i18n.t('discuzq.post.cancel') }}
          </text>
        </view>
      </uni-popup>
      <!--自定义打赏金额弹框-->
      <uni-popup ref="customAmountPopup" type="center">
        <view v-if="customAmountStatus">
          <view class="popup-dialog">
            <view class="popup-dialog__top">
              <text>
                {{ t.enterTheRewardPaymeAmount }}
              </text>
            </view>
            <view class="popup-dialog__cont">
              <qui-icon class="popup-dialog__cont-rmb" name="icon-rmb" size="40"></qui-icon>
              <input
                class="popup-dialog__cont-input"
                v-model="inputPrice"
                type="digit"
                placeholder="0.0"
                focus
                :maxlength="maxLength"
                @input="checkNum"
              />
            </view>
            <view class="popup-dialog__ft">
              <button class="popup-btn--close" @click="diaLogClose">
                {{ i18n.t('discuzq.close') }}
              </button>
              <button
                class="popup-btn--ok"
                :class="inputPrice > 0 ? 'popup-btn--ok--blue' : ''"
                :disabled="inputPrice === ''"
                @click="diaLogOk"
              >
                {{ i18n.t('discuzq.ok') }}
              </button>
            </view>
          </view>
        </view>
      </uni-popup>

      <!--支付组件-->
      <view v-if="payShowStatus">
        <qui-pay
          ref="payShow"
          :pay-type-val="payTypeVal"
          :thread-id="thread._jv.id"
          :money="price"
          :wallet-status="user.canWalletPay"
          :pay-password="pwdVal"
          :balance="Number(user.walletBalance)"
          :pay-type-data="payTypeData"
          :to-name="thread.user.username"
          :pay-type="payTypeText"
          @radioMyHead="radioMyHead"
          @radioChange="radioChange"
          @onInput="onInput"
          @paysureShow="paysureShow"
        ></qui-pay>
      </view>
      <!--遮罩层组件-->
      <qui-loading-cover v-if="coverLoading" mask-zindex="111"></qui-loading-cover>
      <!--轻提示-->
      <qui-toast ref="toast"></qui-toast>
      <!--回复弹框-->
      <uni-popup ref="commentPopup" type="bottom" class="comment-popup-box">
        <view class="comment-popup" v-if="commentPopupStatus">
          <view class="comment-popup-topbox">
            <view class="comment-popup-top">
              <view class="comment-popup-top-l">
                <qui-icon
                  name="icon-expression"
                  class="comm-icon"
                  :size="40"
                  @click="emojiShow = !emojiShow"
                ></qui-icon>
                <qui-icon
                  name="icon-call"
                  :size="40"
                  class="comm-icon"
                  @click="callClick"
                ></qui-icon>
              </view>
              <view class="text-word-tip">
                {{ t.canWrite }}{{ 450 - textAreaValue.length }}{{ t.word }}
              </view>
            </view>
            <qui-emoji
              v-if="emojiShow"
              position="absolute"
              top="104rpx"
              border-radius="10rpx"
              :color="emojiShow ? '#1878F3' : '#777'"
              @click="getEmojiClick"
            ></qui-emoji>
          </view>

          <view class="comment-content-box">
            <view class="comment-content">
              <textarea
                ref="commentText"
                :focus="focusVal"
                :maxlength="450"
                class="comment-textarea"
                :placeholder="t.writeComments"
                placeholder-style="color:#b5b5b5;font-size: 28rpx;"
                placeholder-class="text-placeholder"
                :show-confirm-bar="barStatus"
                cursor-spacing="80"
                v-if="!emojiShow"
                v-model="textAreaValue"
                @blur="contBlur"
              />
              <view class="comment-textarea" v-show="emojiShow">
                {{ textAreaValue }}
              </view>
              <qui-uploader
                :url="`${url}api/attachments`"
                :header="header"
                :form-data="formData"
                :count="3"
                name="file"
                async-clear
                ref="upload"
                @change="uploadChange"
                @clear="uploadClear"
              ></qui-uploader>
            </view>
          </view>
          <button class="publish-btn" @click="publishClickStatus && publishClick()">
            {{ t.publish }}
          </button>
        </view>
      </uni-popup>
      <uni-popup ref="codePopup" type="center" class="code-popup-box" @change="codeImgChange">
        <view class="code-content" v-if="qrcodeShow">
          <view class="code-title">{{ p.payNow }}</view>
          <view class="code-pay-money">
            <view class="code-yuan">￥</view>
            {{ price }}
          </view>
          <view class="code-type-box">
            <view class="code-type-tit">{{ p.payType }}</view>
            <view class="code-type">
              <qui-icon
                class="code-type-icon"
                name="icon-wxPay"
                size="36"
                color="#09bb07"
              ></qui-icon>
              <view class="code-type-text">{{ p.wxPay }}</view>
            </view>
          </view>
          <image :src="codeUrl" class="code-img"></image>
          <view class="code-tip">{{ p.wechatIdentificationQRcode }}</view>
        </view>
      </uni-popup>
    </view>
    <view v-else-if="loadingStatus && !loaded && !thread.isDeleted" class="loading">
      <u-loading :size="60"></u-loading>
    </view>
    <qui-page-message v-else-if="thread.isDeleted || loaded === false"></qui-page-message>
  </qui-page>
</template>

<script>
/* eslint-disable */
// import { status, utils } from '@/library/jsonapi-vuex/index';
import { status } from '@/library/jsonapi-vuex/index';
import { mapState, mapMutations } from 'vuex';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import user from '@/mixin/user';
import forums from '@/mixin/forums';
import detectionModel from '@/mixin/detectionModel';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
// #endif
// #ifndef MP-WEIXIN
import appCommonH from '@/utils/commonHelper';
// #endif

let payWechat = null;
let payPhone = null;

export default {
  mixins: [
    user,
    forums,
    // #ifdef H5
    wxshare,
    // #endif
    detectionModel,
  ],
  // #ifndef MP-WEIXIN
  utils: [appCommonH],
  // #endif
  data() {
    return {
      navTitle: '内容详情页', // 导航栏标题
      threadId: '', // 主题id
      // userId: 57, //当前用户Id
      // userInfo: '', //当前用户信息
      // thread: {}, //主题数据
      loadDetailStatusId: 0, // 主题接口请求状态
      // topicStatus: 1, // 0 是不合法 1 是合法 2 是忽略
      posts: [], // 评论列表数据
      loadingType: 'more', // 上拉加载状态
      pageNum: 1, // 这是主题回复当前页数
      pageSize: 20, // 这是主题回复每页数据条数
      payThreadTypeText: '', // 主题支付类型不同，支付按钮文字显示不同的支付提示
      loadDetailCommnetStatusId: 0,
      postIndex: '', // 点击主题评论时的index
      footerShow: true, // 默认显示底部
      commentShow: false, // 显示评论
      commentPopupStatus: false, // 回复弹框内容状态是否显示
      cursor: 0, // 光标位置
      textAreaValue: '', // 评论输入框
      barStatus: false, // 是否显示输入框获取焦点时完成的那一栏
      uploadFile: [], // 上传的文件
      isLiked: false, // 主题点赞状态
      role: '管理员',
      isActive: true,
      shareShow: false, // h5微信分享
      bottomData: [
        {
          text: this.i18n.t('core.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
        },
        {
          text: this.i18n.t('core.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wxFriends',
        },
      ], // 分享方式

      seleShow: false, // 默认收起管理菜单
      selectList: [
        { text: this.i18n.t('topic.edit'), type: '0' },
        { text: this.i18n.t('topic.essence'), type: '2' },
        { text: this.i18n.t('topic.sticky'), type: '3' },
        { text: this.i18n.t('topic.delete'), type: '4' },
      ], // 管理菜单

      limitShowNum: 12,
      paidStatus: false, // 是否有已支付数据
      paidBtnStatus: true, // 支付按钮是否显示（在ios里不显示，已支付主题后不显示）
      rewardStatus: false, // 是否已有打赏数据
      likedStatus: false, // 是否已有点赞数据
      commentStatus: {}, // 回复状态
      commentReply: false, // 发布的是否是回复的回复
      emojiShow: false, // 表情组件显示状态
      // uploaderShow: false, //图片上传组件显示状态
      publishClickStatus: true, // 发布按钮点击状态
      focusVal: true, // 默认输入框获取焦点状态
      header: {},
      formData: {}, // 图片请求data
      commentId: '', // 评论id
      isAnonymous: '0', // 支付时是否显示头像，默认不显示
      payTypeText: '',
      payTypeVal: 0, // 点击的支付类型， 0主题支付  1主题打赏
      payNum: [
        {
          name: '￥1',
          pay: 1.0,
        },
        {
          name: '￥2',
          pay: 2.0,
        },
        {
          name: '￥5',
          pay: 5.0,
        },
        {
          name: '￥10',
          pay: 10.0,
        },
        {
          name: '￥20',
          pay: 20.0,
        },
        {
          name: '￥50',
          pay: 50.0,
        },
        {
          name: '￥88',
          pay: 88.0,
        },
        {
          name: '￥128',
          pay: 128.0,
        },
        {
          name: this.i18n.t('discuzq.post.customize'),
          pay: '0',
        },
      ], // 打赏金额数组列表
      payNumCheck: [
        {
          name: '',
          pay: '',
        },
      ],
      price: 0.0, // 需要支付的金额
      inputPrice: 0, // 自定义金额输入框的值
      maxLength: 7, //输入框最大长度
      payShowStatus: true, // 是否显示支付
      pwdVal: '', // 支付密码
      orderSn: '', // 订单编号
      payStatus: false, // 订单支付状态
      coverLoading: false, // loading显示状态
      payTypeData: [
        {
          name: '微信支付',
          icon: 'icon-wxPay',
          color: '#09bb07',
          value: '0',
        },
        {
          name: '钱包支付',
          icon: 'icon-walletPay',
          color: '#1878f3',
          value: '1',
        },
      ], // 支付方式
      currentReplyPost: {},
      contentnomoreVal: '',
      url: '',
      customAmountStatus: false, // 自定义价格弹框初始化状态
      windowHeight: '', // 设备高度
      system: '', // 设备系统
      detectionmodel: '', // 站点模式
      paymentmodel: '', // 是否付费
      loaded: false,
      loadingStatus: true,
      isWeixin: false,
      isPhone: false,
      qrcodeShow: false, // 二维码弹框
      codeUrl: '', // 二维码支付url，base64
      browser: 0, // 0为小程序，1为除小程序之外的设备
      wxRes: '',
      contentVal: '', // 这是分享需要传的标题
      shareLogo: '', // 这是分享需要传的图片
      desc: '', // 这是分享需要传的描述
      rewardedUsers: [],
    };
  },
  onReady() {},
  onUnload() {
    this.$store.dispatch('forum/setError', { loading: false });
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
    thread() {
      const thread = this.$store.getters['jv/get'](`threads/${this.threadId}`);
      this.rewardedUsers = thread.rewardedUsers;
      return thread;
    },
    // 语言包
    // topic详情页语言包
    t() {
      return this.i18n.t('topic');
    },
    // pay支付语言包
    p() {
      return this.i18n.t('pay');
    },
    // core公共变量语言包
    c() {
      return this.i18n.t('core');
    },
    status() {
      return status.status;
    },
  },
  onLoad(option) {
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    // #endif
    // #ifndef MP-WEIXIN
    this.isWeixin = appCommonH.isWeixin().isWeixin; // 这是微信网页
    this.isPhone = appCommonH.isWeixin().isPhone; // 这是h5
    this.browser = 1;
    // #endif
    // 评论详情页新增一条回复，内容详情页给当前评论新增一条回复
    this.$u.event.$on('addComment', data => {
      Object.keys(this.posts).forEach(index => {
        if (this.posts[index]._jv.id === data.commentId) {
          if (this.posts[index].lastThreeComments.length >= 3) {
            this.posts[index].lastThreeComments.pop();
          }
          if (data.data) {
            this.posts[index].lastThreeComments.unshift(data.data);
          }
        }
      });
    });
    // 删除评论的回复后清除当前列表评论的这条回复
    this.$u.event.$on('deleteComment', data => {
      Object.keys(this.posts).forEach(index => {
        // for (const index in this.posts) {
        if (this.posts[index]._jv.id === data.commentId) {
          this.posts[index].lastThreeComments = [];
          if (data.data._jv.json.data.relationships.lastThreeComments.data) {
            data.data._jv.json.data.relationships.lastThreeComments.data.forEach(item => {
              this.posts[index].lastThreeComments.push(
                this.$store.getters['jv/get'](`${item.type}/${item.id}`),
              );
            });
          }
          // break;
        }
      });
    });
    this.threadId = option.id;
    this.loadThread();
    this.loadThreadPosts();

    this.url = DISCUZ_REQUEST_HOST;
    const token = uni.getStorageSync('access_token');

    this.header = {
      authorization: `Bearer ${token}`,
    };
    this.formData = {
      type: 1,
    };
    try {
      const res = uni.getSystemInfoSync();
      this.system = res.platform;
      this.detectionmodel = this.forums.set_site.site_mode;
      this.paymentmodel = this.forums.paycenter.wxpay_ios;
    } catch (e) {
      // error
    }

    // 编辑发帖回来后更新信息
    this.$u.event.$on('refreshFiles', () => {
      this.loadThread();
    });
  },
  // 唤起小程序原声分享
  onShareAppMessage(res) {
    // 来自页面内分享按钮
    if (res.from === 'button') {
      const threadShare = this.$store.getters['jv/get'](`/threads/${this.threadId}`);
      return {
        title: threadShare.type === 1 ? this.thread.title : this.thread.firstPost.summaryText,
      };
    }
    return {
      title: this.forums.set_site.site_name,
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    const threadShare = this.$store.getters['jv/get'](`/threads/${this.threadId}`);
    return {
      title: threadShare.type === 1 ? this.thread.title : this.thread.firstPost.summaryText,
      query: `id=${this.threadId}`,
    };
  },
  onShow() {
    let atMemberList = '';
    this.getAtMemberData.map(item => {
      atMemberList += `@${item.username} `;
      return atMemberList;
    });
    this.textAreaValue = `${this.textAreaValue.slice(0, this.cursor) +
      atMemberList +
      this.textAreaValue.slice(this.cursor)}`;
    this.setAtMember([]);
  },
  methods: {
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
      setCategoryId: 'session/SET_CATEGORYID',
      setCategoryIndex: 'session/SET_CATEGORYINDEX',
      setFooterIndex: 'footerTab/SET_FOOTERINDEX',
    }),

    // 表情接口请求
    // getEmoji() {
    //   this.$store.dispatch('jv/get', ['emoji', {}]).then(data => {
    //     this.allEmoji = data;
    //   });
    // },
    // 加载当前主题数据
    loadThread() {
      const params = {
        include: [
          'posts.replyUser',
          'user.groups',
          'user',
          'posts',
          'posts.user',
          'posts.likedUsers',
          'posts.images',
          'firstPost',
          'firstPost.likedUsers',
          'firstPost.images',
          'firstPost.attachments',
          'rewardedUsers',
          'category',
          'threadVideo',
          'paidUsers',
        ],
      };
      const threadAction = status.run(() =>
        this.$store.dispatch('jv/get', [`threads/${this.threadId}`, { params }]),
      );

      this.loadDetailStatusId = threadAction._statusID;

      threadAction
        .then(data => {
          if (data.isDeleted) {
            this.$store.dispatch('forum/setError', {
              code: 'thread_deleted',
              status: 500,
            });

            this.loaded = false;
          } else {
            // #ifndef MP-WEIXIN
            let titleText = '';
            if (data.type === 1) {
              titleText = data.title;
            } else {
              if (data.firstPost.summaryText) {
                titleText = data.firstPost.summaryText.slice(0, 80);
              } else {
                titleText = this.t.topicPageTitle;
              }
            }
            uni.setNavigationBarTitle({
              title: titleText,
            });
            // #endif
            this.loaded = true;
            this.loadingStatus = false;
            // 分享数据
            switch (data.type) {
              case 0:
                // 文字帖
                this.contentVal = data.firstPost.summaryText;
                this.desc = data.firstPost.summaryText;
                this.logo = '';
                break;
              case 1:
                // 长文帖
                this.contentVal = data.title;
                if (data.price > 0) {
                  this.desc = data.title;
                  this.shareLogo = '';
                } else {
                  this.desc = data.firstPost.summaryText;
                  this.shareLogo =
                    data.firstPost.images.length > 0 ? data.firstPost.images[0].thumbUrl : '';
                }
                break;
              case 2:
                // 视频帖
                this.contentVal = data.firstPost.summaryText;
                this.desc = data.firstPost.summaryText;
                this.shareLogo = data.threadVideo.coverUrl;
                break;
              case 3:
                // 图片帖
                this.contentVal = data.firstPost.summaryText;
                this.desc = data.firstPost.summaryText;
                this.shareLogo =
                  data.price == 0 && data.firstPost.images.length > 0
                    ? data.firstPost.images[0].thumbUrl
                    : '';
                break;
              default:
            }
          }
          // #ifdef H5
          this.wxShare({
            title: this.contentVal,
            desc: this.desc,
            logo: this.shareLogo,
          });
          // #endif

          // 追加管理菜单权限字段
          this.selectList[0].canOpera = this.thread.firstPost.canEdit;
          this.selectList[1].canOpera = this.thread.canEssence;
          this.selectList[2].canOpera = this.thread.canSticky;
          this.selectList[3].canOpera = this.thread.canHide;
          // this.selectList[0].isStatus = true;
          this.selectList[1].isStatus = this.thread.isEssence;
          this.selectList[2].isStatus = this.thread.isSticky;
          this.selectList[3].isStatus = false;
          if (data.isEssence) {
            // 如果初始化状态为true
            this.selectList[1].text = this.t.cancelEssence;
          }
          if (data.isSticky) {
            // 如果初始化状态为true

            this.selectList[2].text = this.t.cancelSticky;
          }
          this.isLiked = data.firstPost.isLiked;
          if (!data.paid || data.paidUsers.length > 0) {
            // #ifndef H5
            if (
              this.system === 'ios' &&
              this.detectionmodel === 'public' &&
              this.paymentmodel === false
            ) {
              this.paidStatus = false;
            } else if (
              this.system === 'ios' &&
              this.detectionmodel === 'public' &&
              this.paymentmodel === true
            ) {
              this.paidStatus = true;
            } else {
              this.paidStatus = true;
            }
            // #endif
            // #ifdef H5
            this.paidStatus = true;
            if (data.paid === true) {
              this.paidBtnStatus = false;
            } else {
              this.paidBtnStatus = true;
            }
            // #endif
          } else {
            this.paidStatus = false;
          }
          if (data.type === 3) {
            this.payThreadTypeText = this.t.pay + data.price + this.t.paymentViewPicture;
          } else if (data.type === 2) {
            this.payThreadTypeText = this.t.pay + data.price + this.t.paymentViewVideo;
          } else if (data.type === 1) {
            this.payThreadTypeText = this.t.pay + data.price + this.t.paymentViewRemainingContent;
          }
          if (data.price <= 0) {
            // #ifndef H5
            if (
              this.system === 'ios' &&
              this.detectionmodel === 'public' &&
              this.paymentmodel === false
            ) {
              this.rewardStatus = false;
            } else if (
              this.system === 'ios' &&
              this.detectionmodel === 'public' &&
              this.paymentmodel === true
            ) {
              this.rewardStatus = true;
            } else {
              this.paidBtnStatus = false;
              this.rewardStatus = true;
            }
            // #endif
            // #ifdef H5
            this.paidBtnStatus = false;
            this.rewardStatus = true;
            // #endif
          } else {
            // #ifndef H5
            if (
              this.system === 'ios' &&
              this.detectionmodel === 'public' &&
              this.paymentmodel === false
            ) {
              this.paidBtnStatus = false;
            } else if (
              this.system === 'ios' &&
              this.detectionmodel === 'public' &&
              this.paymentmodel === true &&
              data.paid === false
            ) {
              this.paidBtnStatus = true;
            } else if (data.paid === true) {
              this.paidBtnStatus = false;
            }
            // #endif
            this.rewardStatus = false;
            // #ifdef H5
            if (data.paid === true) {
              this.paidBtnStatus = false;
            } else {
              this.paidBtnStatus = true;
            }
            // #endif
          }
          if (data.firstPost.likedUsers.length < 1) {
            this.likedStatus = false;
          } else {
            this.likedStatus = true;
          }
        })
        .catch(err => {
          this.loaded = false;
          this.loadingStatus = false;
          console.log(err);
          if (err.statusCode === 404) {
            this.$store.dispatch('forum/setError', {
              code: 'type_404',
              status: 500,
            });
          }
        });
    },
    // post操作调用接口（包括type 1主题点赞，3删除回复，4回复点赞）
    postOpera(id, type, canStatus, isStatus, post) {
      if (type === '1' && !canStatus) {
        // 没有主题点赞权限
        this.$refs.toast.show({ message: this.t.noThreadLikePermission });
        return;
      }
      if (type === '4' && !canStatus) {
        // 没有评论点赞权限
        this.$refs.toast.show({ message: this.t.noReplyLikePermission });
        return;
      }
      const jvObj = {
        type: 'posts',
        id,
      };
      let params = {};
      if (type === '1') {
        params = {
          _jv: jvObj,
          isLiked: !isStatus,
        };
      } else if (type === '3') {
        params = {
          _jv: jvObj,
          isDeleted: !isStatus,
        };
      } else if (type === '4') {
        params = {
          _jv: jvObj,
          isLiked: !isStatus,
        };
      }
      this.$store
        .dispatch('jv/patch', params)
        .then(data => {
          if (type === '1') {
            // 主题点赞
            this._updateLikedUsers(data.isLiked);
          } else if (type === '2') {
            if (data.isDeleted) {
              uni.navigateBack({
                url: `/pages/home/index`,
              });
            } else {
              // 主题删除失败
            }
          } else if (type === '3') {
            const postArr = post;
            postArr.isDeleted = data.isDeleted;
            post = postArr;
          } else if (type === '4') {
            const postArr = post;
            postArr.isLiked = data.isLiked;
            postArr.likeCount = data.likeCount;
            post = postArr;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 主题其他操作调用接口（包括 type 1主题收藏，2主题加精，3主题置顶，else删除主题）
    threadOpera(id, canStatus, isStatus, type) {
      const jvObj = {
        type: 'threads',
        id,
      };
      let params = {};
      if (type === '1') {
        // 主题收藏
        params = {
          _jv: jvObj,
          isFavorite: !isStatus,
        };
      } else if (type === '2') {
        // 主题加精
        params = {
          _jv: jvObj,
          isEssence: !isStatus,
        };
      } else if (type === '3') {
        // 主题置顶
        params = {
          _jv: jvObj,
          isSticky: !isStatus,
        };
      } else {
        // 主题删除
        params = {
          _jv: jvObj,
          isDeleted: !isStatus,
        };
      }
      this.$store
        .dispatch('jv/patch', params)
        .then(data => {
          if (type === '1') {
            // 收藏
            this.thread.isFavorite = data.isFavorite;
          } else if (type === '2') {
            // 这是精华操作
            this.selectList[1].isStatus = data.isEssence;
            if (data.isEssence) {
              this.selectList[1].text = this.t.cancelEssence;
            } else {
              this.selectList[1].text = this.t.essence;
            }
          } else if (type === '3') {
            this.selectList[2].isStatus = data.isSticky;
            if (data.isSticky) {
              this.selectList[2].text = this.t.cancelSticky;
              // 详情页置顶,将首页列表中该帖子移除并添加到置顶列表中
              this.$u.event.$emit('stickyThread', data);
            } else {
              this.selectList[2].text = this.t.sticky;
              // 详情页取消置顶,将首页置顶数据移除
              this.$u.event.$emit('cancelSticky', data);
            }
          } else if (type === '4') {
            if (data.isDeleted) {
              // 删除成功，跳转到首页
              this.$refs.toast.show({ message: this.t.deleteSuccessAndJumpToBack });
              const pages = getCurrentPages();
              // const delta = pages.indexOf(pages[pages.length - 1]);
              const naviBack = setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                });
              }, 1000);
              this.$u.event.$emit('deleteThread', this.threadId);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 主题回复，评论的回复调用接口
    postComment() {
      if (this.textAreaValue.length < 1) {
        this.$refs.toast.show({ message: this.t.replyContentCannotBeEmpty });
        this.publishClickStatus = true;
        return false;
      }
      let params = {};
      if (this.commentReply) {
        params = {
          _jv: {
            type: 'posts',
            relationships: {
              thread: {
                data: {
                  type: 'threads',
                  id: this.threadId,
                },
              },
            },
          },
          content: this.textAreaValue,
          isComment: true,
          replyId: this.commentId,
        };
      } else {
        params = {
          _jv: {
            type: 'posts',
            relationships: {
              thread: {
                data: {
                  type: 'threads',
                  id: this.threadId,
                },
              },
            },
          },
          content: this.textAreaValue,
        };
      }
      params._jv.relationships.attachments = {
        data: [],
      };
      if (this.uploadFile) {
        this.uploadFile.forEach(item => {
          params._jv.relationships.attachments.data.push({
            type: 'attachments',
            id: item.id,
          });
        });
      }
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.$refs.commentPopup.close();
          this.commentReply = false;
          this.commentPopupStatus = false;
          this.publishClickStatus = true;
          if (res.isApproved === 1) {
            if (!res.isComment) {
              this.posts.push(res);
            } else {
              if (!this.posts[this.postIndex].lastThreeComments) {
                this.posts[this.postIndex].lastThreeComments = [];
              }
              this.posts[this.postIndex].lastThreeComments.unshift(res);
              this.posts[this.postIndex].replyCount += 1;
            }
          } else {
            this.$refs.toast.show({ message: '您发布的内容正在审核中哦' });
          }

          this.textAreaValue = '';
          this.uploadFile = '';
        })
        .catch(err => {
          this.publishClickStatus = true;
          console.log(err);
        });
    },

    // 加载当前主题评论的数据
    loadThreadPosts() {
      const params = {
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[isComment]': 'no',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        'filter[thread]': this.threadId,
        include: [
          'replyUser',
          'user.groups',
          'user',
          'images',
          'lastThreeComments',
          'lastThreeComments.user',
          'lastThreeComments.replyUser',
        ],
      };
      const loadDetailCommnetAction = status.run(() =>
        this.$store.dispatch('jv/get', ['posts', { params }]),
      );

      this.loadDetailCommnetStatusId = loadDetailCommnetAction._statusID;
      loadDetailCommnetAction.then(data => {
        /* eslint-disable */
        delete data._jv;
        this.loadingType = data.length === this.pageSize ? 'more' : 'nomore';
        this.posts = [...this.posts, ...data];
        if (data.length === 0) {
          this.contentnomoreVal = this.t.noComment;
        } else {
          this.contentnomoreVal = this.t.noMoreData;
        }
      });
    },
    // 非小程序内微信支付
    onBridgeReady(data) {
      // const that = this;
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
        function(data) {
          // alert('支付唤醒');
          if (data.err_msg == 'get_brand_wcpay_request:ok') {
            //微信支付成功，进行支付成功处理
          } else if (data.err_msg == 'get_brand_wcpay_request:cancel') {
            // 取消支付
            clearInterval(payWechat);
            resolve;
          } else if (data.err_msg == 'get_brand_wcpay_request:fail') {
            // 支付失败
            clearInterval(payWechat);
            resolve;
          }
        },
      );
      payWechat = setInterval(() => {
        if (this.payStatus === 1) {
          clearInterval(payWechat);
          return;
        }
        this.getOrderStatus(this.orderSn);
      }, 3000);
    },
    // 创建订单
    creatOrder(amount, type, value, payType) {
      const params = {
        _jv: {
          type: 'orders',
        },
        type,
        thread_id: this.threadId,
        amount,
        is_anonymous: this.isAnonymous,
      };
      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.orderSn = res.order_sn;
          if (payType === 0) {
            // 微信支付
            if (this.browser == 0) {
              // 这是微信小程序内的支付
              this.orderPay(13, value, this.orderSn, payType, '0');
            } else {
              // 这是除微信小程序之外, this.isWeixin, this.isPhone
              if (this.isWeixin && this.isPhone) {
                // 这是微信浏览器
                this.orderPay(12, value, this.orderSn, payType, '1');
              } else if (this.isPhone) {
                this.orderPay(11, value, this.orderSn, payType, '2');
              } else {
                // 这是pc，没调接口之前
                this.orderPay(10, value, this.orderSn, payType, '3');
              }
            }
          } else if (payType === 1) {
            // 钱包支付
            this.orderPay(20, value, this.orderSn, payType);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 订单支付       broswerType: 0是小程序，1是微信浏览器，2是h5，3是pc
    orderPay(type, value, orderSn, payType, broswerType) {
      let params = {};
      if (payType === 0) {
        params = {
          _jv: {
            type: `trade/pay/order/${orderSn}`,
          },
          payment_type: type,
        };
      } else if (payType === 1) {
        params = {
          _jv: {
            type: `trade/pay/order/${orderSn}`,
          },
          payment_type: type,
          pay_password: value,
        };
      }

      this.$store
        .dispatch('jv/post', params)
        .then(res => {
          this.wxRes = res;
          if (payType === 0) {
            if (broswerType === '0') {
              this.wechatPay(
                res.wechat_js.timeStamp,
                res.wechat_js.nonceStr,
                res.wechat_js.package,
                res.wechat_js.signType,
                res.wechat_js.paySign,
              );
            } else if (broswerType === '1') {
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
            } else if (broswerType === '2') {
              payPhone = setInterval(() => {
                if (this.payStatus === 1) {
                  clearInterval(payPhone);
                  return;
                }
                this.getOrderStatus(orderSn, broswerType);
              }, 3000);
              window.location.href = res.wechat_h5_link;
            } else if (broswerType === '3') {
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
                  this.getOrderStatus(this.orderSn, broswerType);
                  uni.hideLoading();
                }, 3000);
              }
            }
          } else if (payType === 1) {
            if (res.wallet_pay.result === 'success') {
              if (this.payTypeVal === 0) {
                // 这是主题支付，支付完成刷新详情页，重新请求数据
                this.loadThread();
              } else if (this.payTypeVal === 1) {
                // 这是主题打赏，打赏完成，给主题打赏列表新增一条数据
                this._updateRewardUsers();
              }
              this.payShowStatus = false;
              this.coverLoading = false;
            }
            this.coverLoading = false;
          }
        })
        .catch(err => {
          // 清空支付的密码
          console.log(err);
          this.$refs.payShow.clearPassword();
        });
    },
    // 查询订单支状 broswerType: 0是小程序，1是微信浏览器，2是h5，3是pc
    getOrderStatus(orderSn, broswerType) {
      this.$store
        .dispatch('jv/get', [`orders/${orderSn}`, { custom: { loading: false } }])
        .then(res => {
          this.payStatus = res.status;
          if (this.payStatus === 1) {
            this.payShowStatus = false;
            this.coverLoading = false;
            if (broswerType === '2') {
              // return false;
            } else if (broswerType === '3') {
              // 这是pc扫码支付完成
              this.$refs.codePopup.close();
              this.qrcodeShow = false;
              this.loadThread();
            }

            if (this.payTypeVal === 0) {
              // 这是主题支付，支付完成刷新详情页，重新请求数据
              this.loadThread();
            } else if (this.payTypeVal === 1) {
              // 这是主题打赏，打赏完成，给主题打赏列表新增一条数据
              this._updateRewardUsers();
            }
            this.$refs.toast.show({ message: this.p.paySuccess });
          }
        })
        .catch(err => {
          console.log(err);
          this.coverLoading = false;
          this.$refs.toast.show({ message: this.p.payFail });
        });
    },

    wechatPay(timeStamp, nonceStr, packageVal, signType, paySign) {
      // 小程序支付。
      const _this = this;
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp,
        nonceStr,
        package: packageVal,
        signType,
        paySign,
        success(res) {
          _this.coverLoading = true;
          payWechat = setInterval(() => {
            if (_this.payStatus === 1) {
              clearInterval(payWechat);
              return;
            }
            _this.getOrderStatus(_this.orderSn);
          }, 3000);
        },
        fail(err) {
          _this.payShowStatus = false;
          _this.coverLoading = false;
          _this.$refs.toast.show({ message: _this.p.payFail });
        },
      });
    },
    // 输入密码完成时
    onInput(val) {
      this.value = val;
      if (this.payTypeVal === 0) {
        // 这是主题支付
        this.creatOrder(this.thread.price, 3, val, 1);
      } else if (this.payTypeVal === 1) {
        // 这是主题打赏
        this.creatOrder(this.price, 2, val, 1);
      }
    },
    // 支付方式选择完成点击确定时
    paysureShow(payType) {
      if (payType === 0) {
        if (this.payTypeVal === 0) {
          // 这是主题支付
          this.creatOrder(this.thread.price, 3, this.value, payType);
        } else if (this.payTypeVal === 1) {
          // 这是主题打赏
          this.creatOrder(this.price, 2, this.value, payType);
        }
      } else if (payType === 1) {
        // 这是详情页获取到的支付方式---钱包
      }
    },
    // 对象转数组
    limitArray(obj) {
      const arr = [];
      Object.values(obj).forEach(item => {
        arr.push(item);
      });
      return arr;
    },
    // 管理菜单点击事件
    selectClick() {
      this.seleShow = !this.seleShow;
    },
    // 管理菜单内标签点击事件
    selectChoice(param) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
      }
      if (param.type === '0') {
        uni.redirectTo({
          url: `/pages/topic/post?operating=edit&threadId=${this.thread._jv.id}`,
        });
      } else {
        this.threadOpera(this.threadId, param.canOpera, param.status, param.type);
      }
    },
    // 跳转到用户主页
    personJump(id) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 主题支付
    payClickShow() {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      this.payStatus = false;
      this.payShowStatus = true;
      this.payTypeVal = 0; // payTypeVal, '这是类型，0为主题支付，1为主题打赏
      if (this.thread.type === 3) {
        this.payTypeText = this.t.pay + this.t.paymentViewPicture;
      } else if (this.thread.type === 1) {
        this.payTypeText = this.t.pay + this.t.paymentViewRemainingContent;
      } else if (this.thread.type === 2) {
        this.payTypeText = this.t.pay + this.t.paymentViewVideo;
      }
      this.price = this.thread.price;
      this.$nextTick(() => {
        this.$refs.payShow.payClickShow(this.payTypeVal);
      });
    },
    // 支付是否显示用户头像
    radioMyHead(val) {
      // 是否显示用户头像
      this.isAnonymous = val;
    },

    // 选择支付方式，获取值
    radioChange(val) {
      // val, 这是父级得到的
    },
    // 打赏
    rewardClick() {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      if (this.user._jv.id === this.thread.user._jv.id) {
        this.$refs.toast.show({ message: this.t.iCantRewardMyself });
        return false;
      }
      // 这是打赏
      this.payStatus = false;
      this.payTypeVal = 1;
      this.payTypeText = this.t.supportTheAuthorToCreate;
      // this.payShowStatus = true;
      this.payNumCheck = [
        {
          name: '',
          pay: '',
        },
      ];
      this.$refs.rewardPopup.open();
    },
    // 取消打赏
    cancelReward() {
      this.payNumCheck = [
        {
          name: '',
          pay: '',
        },
      ];
      this.$refs.rewardPopup.close();
    },
    // 打赏选择付费金额
    moneyClick(index) {
      // this.setType = 'pay';
      this.payNumCheck = [];
      this.payNumCheck.push(this.payNum[index]);

      if (this.payNumCheck[0].name === '自定义') {
        this.$refs.rewardPopup.close();

        this.$nextTick(() => {
          this.$refs.customAmountPopup.open();
          this.customAmountStatus = true;
        });
      } else {
        this.price = this.payNumCheck[0].pay;
        this.payShowStatus = true;
        this.$refs.rewardPopup.close();
        this.payTypeVal = 1;
        this.$nextTick(() => {
          // this.$refs.payShow.payClickShow();
          this.$refs.payShow.payClickShow(this.payTypeVal);
        });
      }
    },
    // 处理金额
    checkNum(e) {
      let that = this;
      let price = e.target.value;
      let maxLength = price.indexOf('.');

      if (price.indexOf('.') < 0 && price != '') {
        // 超过4位则大于1万元
        if (price.length > 6) {
          price = price.substring(0, price.length - 1);
          uni.showToast({
            title: that.c.TheAmountCannotExceedOneMillion,
            icon: 'none',
          });
        } else {
          price = parseFloat(price);
        }
      } else if (price.indexOf('.') == 0) {
        //'首位小数点情况'
        price = price.replace(/[^$#$]/g, '0.');
        price = price.replace(/\.{2,}/g, '.');
      } else if (!/^(\d?)+(\.\d{0,2})?$/.test(price)) {
        //去掉最后一位
        price = price.substring(0, price.length - 1);
      }
      that.$nextTick(function() {
        //'有小数点时，最大长度为9位，没有则是7位'
        that.maxLength = maxLength == -1 ? 7 : 10;
        that.inputPrice = price;
      });
    },
    // 自定义付费金额弹框点击关闭时
    diaLogClose() {
      this.$refs.customAmountPopup.close();
      this.customAmountStatus = false;
    },
    // 自定义付费金额弹框点击确定时
    diaLogOk() {
      if (this.inputPrice <= 0) {
        this.$refs.toast.show({ message: this.p.AmountCannotBeLessThan0 });
      } else {
        this.price = Number(this.inputPrice);
        this.$refs.customAmountPopup.close();
        this.customAmountStatus = false;
        this.payShowStatus = true;
        // this.$refs.payShow.payClickShow();
        this.$nextTick(() => {
          this.$refs.payShow.payClickShow(this.payTypeVal);
        });
      }
    },
    // 回复文本域失去焦点时，获取光标位置
    contBlur(e) {
      this.cursor = e.detail.cursor;
    },
    // 点击表情插入到文本域
    getEmojiClick(code) {
      let text = '';
      text = `${this.textAreaValue.slice(0, this.cursor) +
        code +
        this.textAreaValue.slice(this.cursor)}`;
      this.textAreaValue = text;
      this.emojiShow = false;
    },

    // 点击@跳转到@页
    callClick() {
      uni.navigateTo({ url: '/pages/user/at-member' });
    },
    // // 上传图片
    // imageUploader() {
    //   // this.uploaderShow = true;
    //   // if (this.uploadFile.length == 3) {
    //   //   this.$refs.toast.show({ message: this.t.imageNumLimit });
    //   //   return;
    //   // }
    //   this.$nextTick(() => {
    //     this.$refs.upload.uploadClick();
    //   });
    // },
    // 上传图片
    uploadChange(e) {
      this.uploadFile = e;
    },
    // 删除图片
    uploadClear(list, del) {
      const id = list.id;
      this.delAttachments(id, del).then(() => {
        this.$refs.upload.clear(del);
      });
    },
    // 删除图片
    delAttachments(id) {
      const params = {
        _jv: {
          type: 'attachments',
          id,
        },
      };

      return this.$store
        .dispatch('jv/delete', params)
        .then(res => {
          return res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 主题评论点击发布事件
    publishClick() {
      this.publishClickStatus = false;
      this.postComment(this.commentId);
    },
    // 跳转到评论详情页
    commentJump(threadId, postId) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      uni.navigateTo({
        url: `/pages/topic/comment?threadId=${threadId}&commentId=${postId}`,
      });
    },
    // 评论点赞
    commentLikeClick(postId, type, canStatus, isStatus, index, post) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      this.postIndex = index;
      this.postOpera(postId, type, canStatus, isStatus, post);
    },
    // 删除评论
    deleteComment(postId, type, canStatus, isStatus, post) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      this.postOpera(postId, '3', canStatus, isStatus, post);
    },
    // 评论的回复
    replyComment(postId, postIndex) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      if (!this.thread.canReply) {
        this.$refs.toast.show({ message: this.t.noReplyPermission });
      } else {
        this.commentReply = true;
        this.postIndex = postIndex;
        this.commentId = postId;
        this.$refs.commentPopup.open();
        this.commentPopupStatus = true;
        this.focusVal = true;
      }
    },
    // 点击图片
    imageClick() {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      // this.previewImg();
    },
    // 点击分类标签
    tagClick(tagId) {
      this.$u.event.$emit('tagClick', tagId);
      const pages = getCurrentPages();
      const delta = pages.indexOf(pages[pages.length - 1]);
      if (
        pages.length > 1 &&
        pages[delta - 1].route &&
        pages[delta - 1].route === 'pages/home/index'
      ) {
        uni.navigateBack({
          delta,
        });
        this.setFooterIndex(0);
      } else {
        uni.navigateTo({
          url: '/pages/home/index',
        });
        this.setFooterIndex(0);
      }
    },
    // 主题点赞
    threadLikeClick(postId, canLike, isLiked) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      this.postOpera(postId, '1', canLike, isLiked);
    },
    // 主题收藏
    threadCollectionClick(id, canStatus, isStatus, type) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      this.threadOpera(id, canStatus, isStatus, type);
    },
    // 主题回复
    threadComment(threadId) {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      if (this.thread.canReply && this.thread.category.canReplyThread) {
        this.commentId = threadId;
        this.$refs.commentPopup.open();
        this.commentPopupStatus = true;
        this.focusVal = true;
      } else {
        this.$refs.toast.show({ message: this.t.noReplyPermission });
      }
    },
    // 分享
    shareClick() {
      if (!this.$store.getters['session/get']('isLogin')) {
        this.$store.getters['session/get']('auth').open();
        return;
      }
      // #ifdef MP-WEIXIN
      this.$refs.sharePopup.open();
      if (this.forums.set_site.site_mode === 'pay') {
        this.bottomData.forEach((value, key, bottomData) => {
          // this.bottomData.map((value, key, bottomData) => {
          value.name === 'wxFriends' && bottomData.splice(key, 1);
        });
      }
      // #endif
      // #ifdef H5
      if (this.isWeixin === true) {
        // 微信内
        this.shareShow = true;
      } else {
        this.h5Share({
          title: this.contentVal,
          id: this.threadId,
          url: 'pages/topic/index',
        });
      }
      // #endif
    },
    // #ifdef H5
    closeShare() {
      this.shareShow = false;
    },
    // #endif
    // 取消分享
    cancel() {
      this.$refs.sharePopup.close();
    },
    // 内容部分分享海报,跳到分享海报页面
    shareContent(index) {
      if (index === 0) {
        uni.navigateTo({
          url: `/pages/share/topic?id=${this.threadId}`,
        });
      }
      this.cancel();
    },

    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.loadThreadPosts();
    },
    codeImgChange(params) {
      if (!params.show) {
        clearInterval(payWechat);
      }
    },
    _updateLikedUsers(liked = true) {
      this.isLiked = liked;
      // 主题点赞
      if (this.isLiked) {
        this.thread.firstPost.likedUsers.unshift(this.user);
        this.thread.firstPost._jv.relationships.likedUsers.data.unshift({
          type: this.user._jv.type,
          id: this.user._jv.id,
        });
      } else {
        this.thread.firstPost.likedUsers.forEach((value, key, item) => {
          value.id == this.user.id && item.splice(key, 1);
        });
        this.thread.firstPost._jv.relationships.likedUsers.data.forEach((value, key, item) => {
          value.id == this.user.id && item.splice(key, 1);
        });
      }
      this.$forceUpdate();
    },
    _updateRewardUsers(payType = 0) {
      if (this.payTypeVal === 1) {
        this.thread.rewardedCount++;
        if (!this.rewardStatus) {
          this.rewardStatus = true;
        }
      }

      this.rewardedUsers.unshift(this.user);
      this.thread._jv.relationships.rewardedUsers.data.unshift({
        type: this.user._jv.type,
        id: this.user._jv.id,
      });
      this.$forceUpdate();
    },
    onUnload() {
      clearInterval(payWechat);
      clearInterval(payPhone);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

page {
  padding: 0;
  margin: 0;
  font-size: $fg-f28;
  color: --color(--qui-FC-333);
}
.flex {
  display: flex;
}
.skeletonScreen {
  width: 100%;
  height: 100%;
  background: --color(--qui-BG-2);
}
.scroll-y {
  // max-height: calc(100vh - 497rpx);
  max-height: calc(100vh - 80rpx);
}
.content {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
}
.bg-white {
  background-color: --color(--qui-BG-2);
  border-bottom: 1px solid --color(--qui-BOR-ED);
}
.detail-tip {
  display: block;
  width: 100%;
  font-size: $fg-f28;
  line-height: 60rpx;
  color: #fff;
  text-align: center;
  background: --color(--qui-RED);
}
.detail-hd {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 30rpx 40rpx 37rpx;
  box-sizing: border-box;
  .det-hd-per-head-box {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    .det-hd-per-head {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .det-hd-per-info {
    width: 400rpx;
    padding-left: 20rpx;
    .det-hd-per-name {
      margin-bottom: 10px;
      font-size: $fg-f28;
      font-weight: bold;
      line-height: 37rpx;
    }
    .det-hd-post-time {
      font-size: $fg-f24;
      line-height: 31rpx;
      color: --color(--qui-FC-AAA);
    }
  }
}
.det-hd-opera {
  align-self: flex-end;
  text-align: right;
  flex-shrink: 0;
  .essence {
    display: inline-block;
    width: 39rpx;
    height: 44rpx;
  }
}
.det-hd-operaCli {
  position: relative;
  z-index: 10;
  .det-hd-management {
    display: flex;
    flex-direction: row;
    line-height: 1;
    .icon-management {
      margin-right: 7rpx;
      font-size: 26rpx;
    }
  }
  font-size: $fg-f28;
  line-height: 40rpx;
}
//详情页帖子内容
.detail-post-content {
  padding: 0 40rpx 30rpx;
  text-align: left;
  .det-post-con {
    line-height: 45rpx;
  }
  .det-post-img-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 30rpx 0;
    // flex-wrap: wrap;
  }
  .det-post-img-box {
    .det-post-img {
      width: 314rpx;
      vertical-align: top;
    }
  }
  .det-post-tag-list {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    .det-post-tag {
      padding: 10rpx 20rpx;
    }
  }
}

.det-con-ft {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0 40rpx 30rpx;
  background: --color(--qui-BG-2);
  box-sizing: border-box;
  &-child {
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: $fg-f28;
    color: --color(--qui-FC-777);
    align-items: center;
    .qui-icon {
      margin-right: 17rpx;
      font-size: 30rpx;
    }
    * {
      font-size: $fg-f28;
      color: --color(--qui-FC-777);
    }
  }
}
.pad-top {
  padding-top: 0;
}
//评论
.comment {
  width: 100%;
  padding: 40rpx 0 0;
  margin-top: 30rpx;
  background: --color(--qui-BG-2);
  box-sizing: border-box;
}
.comment-num {
  padding: 0 40rpx;
  font-size: $fg-f28;
  font-weight: bold;
  line-height: 37rpx;
}
.comment-child {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40rpx 0;
}
.comment-child-hd {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  .comment-child-per-head-box {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    .comment-child-per-head {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .comment-child-status {
    align-items: flex-start;
    padding-top: 8rpx;
    font-size: $fg-f26;
    line-height: 35rpx;
    color: --color(--qui-RED);
  }
}
.comment-child-per-info {
  width: 480rpx;
  padding-left: 20rpx;
  .comment-child-per-det {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .comment-child-per-name {
      margin-bottom: 10rpx;
      font-weight: bold;
      line-height: 37rpx;
    }
    .comment-chile-per-role {
      line-height: 37rpx;
      color: --color(--qui-FC-AAA);
    }
  }
  .comment-child-time {
    font-size: $fg-f24;
    line-height: 31rpx;
    color: --color(--qui-FC-AAA);
  }
}
.comment-child-con {
  padding: 20rpx 0 40rpx;
  font-size: $fg-f28;
  line-height: 45rpx;
  text-align: left;
  .comment-child-con-all {
    color: --color(--qui-LINK);
    * {
      color: --color(--qui-LINK);
    }
  }
}
.ft-gap {
  width: 100%;
  /* #ifdef H5 */
  margin-top: 44px;
  /* #endif */
  margin-bottom: 80rpx;
}
.det-ft {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: --color(--qui-BG-2);
  box-shadow: 0 -3rpx 6rpx rgba(0, 0, 0, 0.05);
}
.det-ft-con {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: center;
}
.det-ft-child {
  flex: auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  line-height: 80rpx;
  color: --color(--qui-FC-777);
  .qui-icon {
    margin-right: 18rpx;
    font-size: 30rpx;
    line-height: 80rpx;
  }
  .ft-child-word {
    font-size: $fg-f28;
    color: --color(--qui-FC-777);
  }
}
.comment-popup-box {
  width: 100%;
  padding-top: 40rpx;
}
.comment-popup {
  width: 100%;
  background: --color(--qui-BG-2);
  border-top-right-radius: 10rpx;
  border-top-left-radius: 10rpx;
  box-sizing: border-box;
}
.comment-popup-topbox {
  position: relative;
  padding: 40rpx 0 20rpx;
  margin: 0 40rpx;
}
.comment-popup-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .comment-popup-top-l {
    // flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 195rpx;
  }
  .text-word-tip {
    font-size: $fg-f24;
    line-height: 1;
    color: --color(--qui-FC-777);
  }
  .comm-icon {
    flex: 1;
    color: --color(--qui-FC-777);
  }
}
.comment-content-box {
  padding: 0 40rpx 30rpx;
  .comment-content {
    width: 100%;
    height: 420rpx;
    padding: 20rpx;
    background: --color(--qui-FC-GRAY);
    border: 1px solid --color(--qui-FC-DDD);
    border-radius: 7rpx;
    box-sizing: border-box;
  }
  .comment-textarea {
    width: 100%;
    height: 94rpx;
    min-height: 70rpx;
    font-size: $fg-f28;
    line-height: 37rpx;
  }
  .text-placeholder {
    font-size: 28rpx;
  }
}
.publish-btn {
  width: 100%;
  height: 100rpx;
  font-size: $fg-f28;
  font-weight: normal;
  line-height: 100rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background: --color(--qui-MAIN);
  border-radius: 0;
}

.popup-box {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-cancel-btn {
  height: 100rpx;
  font-size: $fg-f28;
  line-height: 100rpx;
  color: #666;
  text-align: center;
  border-top-color: #f5f5f5;
  border-top-style: solid;
  border-top-width: 1px;
}
.popup-content-space {
  width: 100%;
  height: 10rpx;
  background: --color(--qui-BG-ED);
}
.popup-content-btn {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .popup-btn {
    margin-top: 20rpx;
  }
}
.popup-reward-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: center;
  height: 477rpx;
  padding: 40rpx 45rpx;
  background: --color(--qui-BG-BTN-GRAY-1);
  box-sizing: border-box;
  .popup-title {
    height: 37rpx;
    font-size: $fg-f28;
    text-align: center;
  }
}
.popup-dialog {
  width: 670rpx;
  height: 342rpx;
  background-color: --color(--qui-BG-2);
  border-radius: 14rpx;
  &__top {
    padding-top: 40rpx;
    text-align: center;
    text {
      font-size: $fg-f28;
      color: --color(--qui-FC-333);
    }
  }

  &__cont {
    position: relative;
    display: flex;
    align-items: center;
    padding: 24rpx 52rpx 40rpx;
    &-rmb {
      position: absolute;
      margin-left: 25rpx;
    }
    &-input {
      width: 100%;
      height: 100rpx;
      padding: 0 25rpx 0 80rpx;
      text-align: right;
      border: 1px solid --color(--qui-BOR-DDD);
      box-sizing: border-box;
    }
  }

  &__ft {
    display: flex;
    height: 100rpx;
    border-top: 2rpx solid --color(--qui-BOR-DDD);

    button {
      width: 50%;
      color: --color(--qui-FC-777);
      background-color: --color(--qui-BG-2);
      border-radius: 0;
      &:after {
        border: none;
      }
      &:last-of-type {
        border-left: 2rpx solid --color(--qui-BOR-DDD);
        border-bottom-right-radius: 10rpx;
      }
      &:first-of-type {
        border-bottom-left-radius: 10rpx;
      }
    }
    .popup-btn--ok--blue {
      color: --color(--qui-BG-HIGH-LIGHT);
    }
  }
}
.popup-share-content {
  box-sizing: border-box;
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
.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 170;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.6);
}
.wxShareTip {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2222222222222;
  width: 100%;
  height: 100%;
  text-align: right;
  .sharePoint {
    display: inline-block;
    width: 70%;
    margin-top: 10rpx;
    margin-right: 30rpx;
  }
  .shareKnow {
    display: block;
    width: 35%;
    margin: 20vh auto 30rpx;
  }
}
</style>
