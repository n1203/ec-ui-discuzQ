<template>
  <qui-page :data-qui-theme="theme">
    <!-- #ifdef H5-->
    <qui-header-back :title="navTitle"></qui-header-back>
    <!-- #endif -->
    <!-- #ifdef H5-->
    <view class="head-gap"></view>
    <!-- #endif -->
    <view class="post-box" v-if="loadStatus">
      <view class="post-box__title" v-if="type === 1">
        <input
          class="post-box__title-input"
          type="text"
          v-model="postTitle"
          :focus="type === 1"
          :placeholder="i18n.t('discuzq.post.pleaseEnterAPostTitle')"
        />
      </view>
      <view class="post-box__hd">
        <view class="post-box__hd-l">
          <qui-icon
            class="post-box__hd-l__icon"
            name="icon-expression"
            size="40"
            :color="emojiShow ? '#1878F3' : '#777'"
            @click="emojiclick"
          ></qui-icon>
          <qui-icon
            class="post-box__hd-l__icon"
            name="icon-call"
            size="40"
            color="#777"
            @click="callClick"
          ></qui-icon>
          <qui-icon
            class="post-box__hd-l__icon"
            name="icon-wei"
            size="40"
            color="#777"
            @click="topicPage"
          ></qui-icon>
        </view>
        <text class="post-box__hd-r">
          {{
        textAreaValue.length &lt;= textAreaLength
        ? i18n.t('discuzq.post.note', { num: textAreaLength - textAreaValue.length })
        : i18n.t('discuzq.post.exceed', { num: textAreaValue.length - textAreaLength })
          }}
        </text>
      </view>
      <view class="emoji-bd" v-show="emojiShow">
        <qui-emoji
          position="absolute"
          top="20rpx"
          border-radius="10rpx"
          @click="getEmojiClick"
        ></qui-emoji>
      </view>
      <view class="post-box__con">
        <textarea
          id="textarea"
          ref="textarea"
          class="post-box__con-text"
          :placeholder="i18n.t('discuzq.post.placeholder')"
          placeholder-class="textarea-placeholder"
          v-model="textAreaValue"
          auto-height="true"
          :show-confirm-bar="barStatus"
          :adjust-position="true"
          cursor-spacing="30"
          cursor="cursor"
          :maxlength="10000"
          :focus="type !== 1"
          v-show="textShow"
          @blur="contBlur"
          @focus="focusEvent"
        ></textarea>
        <view class="post-box__con-text post-box__con-text--static" v-show="!textShow">
          <text class="text-cover">{{ textAreaValue }}</text>
        </view>
        <view class="markdown-box" v-if="markdownShow">
          <view>
            <qui-icon
              name="icon-bold"
              size="30"
              class="qui-icon"
              @click="toolBarClick('bold')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-title"
              size="30"
              class="qui-icon"
              @click="toolBarClick('title')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-italic"
              size="30"
              class="qui-icon"
              @click="toolBarClick('italic')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-quote"
              size="30"
              class="qui-icon"
              @click="toolBarClick('quote')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-code"
              size="30"
              class="qui-icon"
              @click="toolBarClick('code')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-link"
              size="30"
              class="qui-icon"
              @click="toolBarClick('link')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-strikethrough"
              size="30"
              class="qui-icon"
              @click="toolBarClick('strikethrough')"
            ></qui-icon>
          </view>
          <!--<view>
            <qui-icon
              name="icon-undeline"
              size="30"
              class="qui-icon"
              @click="toolBarClick('undeline')"
            ></qui-icon>
          </view>
          <view>
            <qui-icon
              name="icon-strikethrough"
              size="30"
              class="qui-icon"
              @click="toolBarClick('strikethrough')"
            ></qui-icon>
          </view>-->
          <!--<md-unordered-list>
            <qui-icon
              name="icon-unordered-list"
              size="30"
              class="qui-icon"
              @click="toolBarClick('unordered')"
            ></qui-icon>
          </md-unordered-list>
          <md-ordered-list>
            <qui-icon
              name="icon-ordered-list"
              size="30"
              class="qui-icon"
              @click="toolBarClick('ordered')"
            ></qui-icon>
          </md-ordered-list>-->
        </view>
      </view>

      <qui-uploader
        :url="`${url}api/attachments`"
        :header="header"
        :form-data="formData"
        :file-preview="filePreview"
        name="file"
        async-clear
        ref="upload"
        v-if="type === 1 || type === 3"
        @change="uploadChange"
        @clear="uploadClear"
        @uploadClick="uploadClick"
      ></qui-uploader>
      <qui-upload-file
        :url="`${url}api/attachments`"
        ref="uploadFiles"
        :header="header"
        :attachment-list="attachmentList"
        :file-format="forums.set_attach && forums.set_attach.support_file_ext"
        :file-size="forums.set_attach && forums.set_attach.support_max_size"
        v-if="type === 1"
        @deleteItem="deleteFile"
      ></qui-upload-file>
      <view class="post-box__video" v-if="type === 2">
        <view class="post-box__video__play" v-for="(item, index) in videoBeforeList" :key="index">
          <video
            id="video"
            v-if="type === 2"
            class="post-box__video__play__video"
            :src="item.path"
            :controls="controlsStatus"
            @fullscreenchange="fullscreenchange"
          ></video>
          <view class="post-box__video__play__load play-load" v-if="videoPercent * 100 < 100">
            <view class="post-box__video__play__load__mask"></view>
            <text class="post-box__video__play__load__text">
              {{ i18n.t('discuzq.video.videoUploading') }}
            </text>

            <progress
              :percent="videoPercent * 100"
              active
              stroke-width="3"
              activeColor="#fff"
              backgroundColor="#b5b5b5"
            />
          </view>

          <view class="post-box__video__play__icon-del">
            <qui-icon
              name="icon-close"
              class=""
              color="#fff"
              size="40"
              @click="videoDel"
            ></qui-icon>
          </view>
          <view class="controls-play-icon" @click.stop="playVideo">
            <qui-icon name="icon-play" size="50" color="#fff"></qui-icon>
          </view>
        </view>
        <view class="post-box__video__add" @click="uploadVideo" v-if="videoBeforeList.length < 1">
          <qui-icon name="icon-add" color="#B5B5B5" size="40"></qui-icon>
        </view>
      </view>
      <qui-cell-item
        :class="price > 0 ? 'cell-item-right-text' : ''"
        :title="i18n.t('discuzq.post.paymentAmount')"
        :addon="showPrice"
        arrow
        v-if="type !== 0 && showHidden"
        @click="cellClick('pay')"
      ></qui-cell-item>
      <qui-cell-item
        :title="i18n.t('discuzq.post.freeWordCount')"
        :addon="i18n.t('discuzq.post.word', { num: word })"
        v-if="price > 0 && type !== 3 && type !== 2 && type !== 0"
        arrow
        @click="cellClick('word')"
      ></qui-cell-item>
      <view class="post-box__ft">
        <text class="post-box__ft-tit">{{ i18n.t('discuzq.post.chooseCategory') }}</text>
        <view class="post-box__ft-categories">
          <qui-button
            v-for="(item, index) in allCategories"
            :key="item._jv.id"
            :type="Number(item._jv.id) === Number(categoryId) ? 'primary' : ''"
            :plain="Number(item._jv.id) === Number(categoryId)"
            :class="Number(item._jv.id) === Number(categoryId) ? 'cateActive' : ''"
            @click="checkClass(item, index)"
          >
            {{ item.name }}
          </qui-button>
        </view>
        <qui-button
          :loading="postLoading"
          type="primary"
          size="large"
          id="TencentCaptcha"
          :data-appid="forums.qcloud.qcloud_captcha_app_id || ''"
          @click="postClick"
          :disabled="textAreaValue.length > textAreaLength"
        >
          {{ i18n.t('discuzq.post.post') }}
        </qui-button>
      </view>
      <uni-popup ref="popupBtm" type="bottom">
        <view class="popup-share">
          <view class="popup-share-content">
            <text class="popup-title">
              {{
                setType === 'pay'
                  ? i18n.t('discuzq.post.selectToViewPaymentAmount')
                  : i18n.t('discuzq.post.selectToViewFreeWordCount')
              }}
            </text>
            <view class="popup-content-btn" v-if="setType === 'pay'">
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
          <view class="popup-share-content-space"></view>
          <text class="popup-share-btn" @click="cancel()">{{ i18n.t('discuzq.post.cancel') }}</text>
        </view>
      </uni-popup>
      <uni-popup ref="popup" type="center">
        <view class="popup-dialog">
          <view class="popup-dialog__top">
            <text>
              {{
                setType === 'pay'
                  ? i18n.t('discuzq.post.enterToViewPaymentAmount')
                  : i18n.t('discuzq.post.enterTheWordCount')
              }}
            </text>
          </view>
          <view class="popup-dialog__cont">
            <qui-icon
              class="popup-dialog__cont-rmb"
              name="icon-rmb"
              size="40"
              v-if="setType === 'pay'"
            ></qui-icon>
            <text class="popup-dialog__cont-rmb" v-else>
              {{ i18n.t('discuzq.post.word', { num: '' }) }}
            </text>
            <input
              class="popup-dialog__cont-input"
              v-if="setType === 'pay'"
              v-model="inputPrice"
              type="digit"
              placeholder="0.0"
              :maxlength="maxLength"
              :focus="setType === 'pay'"
              @input="checkNum"
            />
            <input
              class="popup-dialog__cont-input"
              v-else
              v-model="inputWord"
              type="digit"
              placeholder="0"
              :maxlength="5"
              :focus="setType === 'word'"
            />
          </view>
          <view class="popup-dialog__ft">
            <button class="popup-btn--close" @click="diaLogClose">
              {{ i18n.t('discuzq.close') }}
            </button>
            <button
              class="popup-btn--ok"
              v-if="setType === 'pay'"
              :class="inputPrice > 0 ? 'popup-btn--ok--blue' : ''"
              :disabled="inputPrice === ''"
              @click="diaLogOk"
            >
              {{ i18n.t('discuzq.ok') }}
            </button>
            <button
              class="popup-btn--ok"
              v-else
              :class="inputWord > 0 ? 'popup-btn--ok--blue' : ''"
              :disabled="inputWord === ''"
              @click="diaLogOk"
            >
              {{ i18n.t('discuzq.ok') }}
            </button>
          </view>
        </view>
      </uni-popup>
      <qui-toast ref="toast"></qui-toast>
    </view>
  </qui-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { DISCUZ_REQUEST_HOST } from '@/common/const';
import VodUploader from '@/common/cos-wx-sdk-v5.1';
import forums from '@/mixin/forums';
// #ifdef  H5
import tcaptchs from '@/utils/tcaptcha';
import TcVod from 'vod-js-sdk-v6';
// #endif

export default {
  name: 'Post',
  mixins: [
    forums,
    // #ifdef  H5
    tcaptchs,
    // #endif
  ],
  data() {
    return {
      navTitle: '发布', // 导航栏标题
      loadStatus: '',
      textAreaValue: '', // 输入框内容
      markdownShow: false, // 是否显示markdown菜单
      barStatus: false, // 是否显示输入框获取焦点时完成的那一栏
      textAreaLength: 450, // 输入框可输入字
      postTitle: '', // 标题
      checkClassData: [],
      type: 0, // 帖子类型
      price: 0, // 付费金额
      inputPrice: '', // 付费金额输入框
      maxLength: 7, // 输入框长度
      inputWord: '', // 查看字数输入框
      operating: '', // 编辑或发布类型
      emojiShow: false, // 表情是否显示
      textShow: true, // 文本域是否显示
      header: {}, // 图片请求头部
      formData: {}, // 图片请求data
      captcha: null, // 腾讯云验证码实例
      captcha_ticket: '', // 腾讯云验证码返回票据
      captcha_rand_str: '', // 腾讯云验证码返回随机字符串
      payNum: [
        {
          name: this.i18n.t('discuzq.post.free'),
          pay: 0,
        },
        {
          name: '￥2',
          pay: 2,
        },
        {
          name: '￥5',
          pay: 5,
        },
        {
          name: '￥10',
          pay: 10,
        },
        {
          name: '￥20',
          pay: 20,
        },
        {
          name: '￥50',
          pay: 50,
        },
        {
          name: '￥88',
          pay: 88,
        },
        {
          name: '￥128',
          pay: 128,
        },
        {
          name: this.i18n.t('discuzq.post.customize'),
          pay: 0,
        },
      ], // 付费金额
      payNumCheck: [
        {
          name: this.i18n.t('discuzq.post.free'),
          pay: 0,
        },
      ], // 付费金额选中
      uploadFile: [], // 图片上传列表
      cursor: 0, // 内容输入框光标未知
      wordCountCheck: [
        {
          name: this.i18n.t('discuzq.post.word', { num: 0 }),
          num: 0,
        },
      ], // 查看字数选中
      word: 0, // 可查看字数
      setType: 'pay', // 金额或查看字
      controlsStatus: false, // 是否显示默认播放控件
      videoBeforeList: [], // 视频上传列表
      fullscreenStatus: false, // 视频全屏状态
      videoName: '', // 视频名称
      percent: 0, // 视频上传进度
      videoPercent: 0, // 视频上传进度，用来控制进度条
      fileId: '', // 视频ID
      url: '', // 视频url
      postLoading: false, // 发布按钮loading状态
      allCategories: [], // 所有分类
      categoryIndex: '', // 分类下标
      categoryId: '', // 分类id
      threadId: '', // 编辑时主题id
      firstPostId: '', // 编辑时帖子id
      postDetails: {}, // 编辑时帖子详情
      filePreview: [], // 服务器上传
      uploadStatus: true, // 图片上传状态
      showHidden: true, // 付费金额的显示隐藏
      ticket: '',
      randstr: '',
      captchaResult: {},
      attachmentList: [], // 附件列表
      preAttachmentList: [], // 编辑的时候只传新增的用于比较是否是新增的
      signatureVal: '',
    };
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
    // allEmoji() {
    //   return this.$store.getters['jv/get']('emoji');
    // },
    showPrice() {
      let pay = this.i18n.t('discuzq.post.free');

      if (this.price <= 0) {
        pay = this.i18n.t('discuzq.post.free');
      } else {
        pay = `￥${this.price + this.i18n.t('discuzq.post.yuan')}`;
      }
      return pay;
    },
  },
  updated() {
    // #ifndef MP-WEIXIN
    this.$nextTick(() => {
      if (this.$refs.textarea) {
        this.$refs.textarea.$refs.textarea.style.overflowY = 'scroll';
        this.$refs.textarea.$refs.textarea.style.paddingRight = '10px';
      }
    });
    // #endif
  },
  methods: {
    focusEvent() {
      // 这是获取焦点
    },
    toolBarClick(type) {
      let text = '';
      if (type === 'bold') {
        text = `${`${this.textAreaValue.slice(
          0,
          this.cursor,
        )}**粗体文字**${this.textAreaValue.slice(this.cursor)}`}`;
        this.cursor += 2;
        this.focusEvent(this.cursor);
      } else if (type === 'italic') {
        // this.textareaValue += '*斜体* ';
        text = `${`${this.textAreaValue.slice(0, this.cursor)}__${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 1;
        this.focusEvent(this.cursor);
      } else if (type === 'title') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}\n### ${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 4;
        this.focusEvent(this.cursor);
      } else if (type === 'quote') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}\n> ${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 1;
        this.focusEvent(this.cursor);
      } else if (type === 'link') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}[](url)${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 1;
        this.focusEvent(this.cursor);
      } else if (type === 'code') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}\`\`${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 1;
        this.focusEvent(this.cursor);
      } else if (type === 'strikethrough') {
        text = `${`${this.textAreaValue.slice(0, this.cursor)}~~~~${this.textAreaValue.slice(
          this.cursor,
        )}`}`;
        this.cursor += 2;
        this.focusEvent(this.cursor);
      }
      //  else if (type === 'undeline') {
      //   text = `${`${this.textAreaValue.slice(0, this.cursor)}++++${this.textAreaValue.slice(
      //     this.cursor,
      //   )}`}`;
      //   this.cursor += 2;
      //   this.focusEvent(this.cursor);
      // } else if (type === 'strikethrough') {
      //   text = `${`${this.textAreaValue.slice(0, this.cursor)}~~~~${this.textAreaValue.slice(
      //     this.cursor,
      //   )}`}`;
      //   this.cursor += 2;
      //   this.focusEvent(this.cursor);
      // }
      //  else if (type == 'unordered') {
      //   text = `${this.textAreaValue.slice(0, this.cursor) +
      //     '\n- ' +
      //     this.textAreaValue.slice(this.cursor)}`;
      //   this.cursor = this.cursor + 1;
      //   this.focusEvent(this.cursor);
      // } else if (type == 'ordered') {
      //   text = `${this.textAreaValue.slice(0, this.cursor) +
      //     '\n1. ' +
      //     this.textAreaValue.slice(this.cursor)}`;
      //   this.cursor = this.cursor + 1;
      //   this.focusEvent(this.cursor);
      // }
      this.textAreaValue = text;
    },
    ...mapMutations({
      setAtMember: 'atMember/SET_ATMEMBER',
    }),
    // 文章类型（0:文字  1:帖子  2:视频  3:图片）
    // 处理金额
    /* eslint-disable */
    checkNum(e) {
      let that = this;
      let price = e.target.value;
      let maxLength = price.indexOf('.');

      if (price.indexOf('.') < 0 && price != '') {
        // '超过4位则大于1万元';
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

    // video相关方法
    videoDel() {
      this.videoBeforeList = [];
      this.percent = 0;
      this.videoPercent = 0;
    },
    playVideo() {
      this.controlsStatus = true;
      this.videoContext.play();
      this.videoContext.requestFullScreen();
    },
    fullscreenchange(e) {
      this.fullscreenStatus = e.detail.fullScreen;
      if (!e.detail.fullScreen) {
        this.controlsStatus = false;
        this.videoContext.pause();
      }
    },
    uploadVideo() {
      const _this = this;
      uni.chooseVideo({
        count: 1,
        compressed: false,
        sourceType: ['camera', 'album'],
        success(res) {
          _this.$refs.toast.show({
            message: _this.i18n.t('uploader.videoUploading'),
          });
          _this.videoName = res.name ? res.name : _this.i18n.t('discuzq.post.fromWeChatApplet');
          _this.videoBeforeList.push({
            path: res.tempFilePath,
          });
          // #ifdef MP-WEIXIN
          VodUploader.start({
            mediaFile: res,
            getSignature: _this.getSignature,

            mediaName: res.name,
            success(result) {},
            error(result) {
              _this.$refs.toast.show({ message: _this.i18n.t('uploader.uploadFailed') });
              _this.videoPercent = 0;
            },
            progress(result) {
              _this.percent = result.percent;

              if (result.percent === 1) {
                _this.videoPercent = 0.9;
                // _this.$refs.toast.hideLoading();
              }

              _this.videoPercent = result.percent;
            },
            finish(result) {
              _this.fileId = result.fileId;
              _this.postVideo(result.fileId);
              // _this.$refs.toast.show({
              //   message: _this.i18n.t('uploader.videoUploadedSuccessfully'),
              // });
            },
          });
          // #endif
          // #ifndef  MP-WEIXIN
          _this.getSignature(getSignature => {
            new TcVod({
              getSignature,
            })
              .upload({
                mediaFile: res.tempFile,
              })
              .on('media_progress', info => {
                _this.percent = info.percent; // 进度处理
                // _this.videoPercent = info.percent;
                if (info.percent === 1) {
                  _this.videoPercent = 0.9;
                  // _this.$refs.toast.hideLoading();
                }
                _this.videoPercent = info.percent;
              })
              .done()
              .then(doneResult => {
                _this.fileId = doneResult.fileId;
                _this.postVideo(doneResult.fileId);
              });
          });
          // #endif
        },
      });
    },

    // 点击表情
    emojiclick() {
      this.emojiShow = !this.emojiShow;
      this.textShow = !this.textShow;
    },
    // 弹框相关方法
    contBlur(e) {
      this.cursor = e.detail.cursor;
    },
    diaLogClose() {
      this.$refs.popup.close();
      this.textShow = true;
    },
    diaLogOk() {
      if (this.setType === 'pay') {
        this.price = this.inputPrice;
      } else {
        this.word = this.inputWord;
      }

      this.$refs.popup.close();
      this.textShow = true;
    },

    moneyClick(index) {
      this.setType = 'pay';
      this.payNumCheck = [];
      this.payNumCheck.push(this.payNum[index]);

      if (this.payNumCheck[0].name === this.i18n.t('discuzq.post.customize')) {
        this.textShow = false;
        this.$refs.popupBtm.close();

        this.$nextTick(() => {
          this.inputPrice = '';
          this.$refs.popup.open();
          this.textShow = false;
        });
      } else {
        this.price = this.payNumCheck[0].pay;
        this.$refs.popupBtm.close();
        this.textShow = true;
      }
    },
    cellClick(type) {
      this.setType = type;
      if (type === 'word') {
        this.$refs.popup.open();
      } else {
        this.$refs.popupBtm.open();
      }
      this.textShow = false;
    },
    cancel() {
      this.$refs.popupBtm.close();
      this.textShow = true;
    },

    // 图片上传相关方法
    uploadClick(e) {
      this.uploadStatus = e;
    },
    uploadChange(e, status) {
      this.uploadFile = e;
      // e.map((file, index) => {
      //   this.formData = {
      //     type: 1,
      //     order: index,
      //   };
      // });
      this.uploadStatus = status;
    },
    uploadClear(list, del) {
      // const id = this.operating === 'edit' ? list.id : list.data.id;
      const id = list.id;
      this.delAttachments(id, del).then(() => {
        this.$refs.upload.clear(del);
      });
    },

    // 表情点击事件
    getEmojiClick(code) {
      let text = '';
      text = `${this.textAreaValue.slice(0, this.cursor) +
        code +
        this.textAreaValue.slice(this.cursor)}`;
      this.cursor = text.length;
      this.textAreaValue = text;
      this.emojiShow = false;
      this.textShow = true;
    },
    // @人员跳转
    callClick() {
      uni.navigateTo({ url: '/pages/user/at-member' });
    },
    topicPage() {
      uni.navigateTo({ url: '/pages/topic/topic' });
    },
    // 分类点击
    checkClass(e, index) {
      // 单选功能
      this.categoryIndex = index;
      this.categoryId = e._jv.id;
      this.checkClassData = [];
      this.checkClassData.push(this.allCategories[index]);
    },
    // 发布按钮点击，检测条件是否符合，符合的话调用接口
    postClick() {
      if (!this.categoryId) {
        this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theclassifyCanNotBeBlank') });
        return false;
      }
      let status = true;
      switch (this.type) {
        case 0:
          if (this.textAreaValue.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theContentCanNotBeBlank') });
            status = false;
          } else {
            status = true;
          }
          break;
        case 1:
          if (this.postTitle.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theTitleCanNotBeBlank') });
            status = false;
          } else if (this.textAreaValue.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.theContentCanNotBeBlank') });
            status = false;
          } else if (!this.uploadStatus) {
            this.$refs.toast.show({
              message: this.i18n.t('discuzq.post.pleaseWaitForTheImageUploadToComplete'),
            });
            status = false;
          } else {
            status = true;
          }
          break;
        case 2:
          if (this.videoBeforeList.length < 1) {
            this.$refs.toast.show({ message: this.i18n.t('discuzq.post.videoCannotBeEmpty') });
            status = false;
          } else if (this.percent !== 1) {
            this.$refs.toast.show({
              message: this.i18n.t('discuzq.post.pleaseWaitForTheVideoUploadToComplete'),
            });
            status = false;
          } else {
            status = true;
          }
          break;
        case 3:
          if (this.operating !== 'edit') {
            if (!this.uploadStatus) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.pleaseWaitForTheImageUploadToComplete'),
              });
              status = false;
            } else if (this.uploadFile.length < 1) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.imageCannotBeEmpty'),
              });
              status = false;
            } else {
              status = true;
            }
          } else {
            if (!this.uploadStatus) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.pleaseWaitForTheImageUploadToComplete'),
              });
              status = false;
            } else {
              status = true;
            }
          }
          break;
        default:
          status = false;
          this.$refs.toast.show({ message: this.i18n.t('core.postTypesDoNotMatch') });
      }

      if (status) {
        this.postLoading = true;
        uni.showLoading();

        if (this.operating === 'edit') {
          if (this.type === 3) {
            if (this.uploadFile.length < 1) {
              this.$refs.toast.show({
                message: this.i18n.t('discuzq.post.imageCannotBeEmpty'),
              });
              uni.hideLoading();
              this.postLoading = false;
            } else {
              this.editThread().then(res => {
                this.postLoading = false;
                uni.hideLoading();
                // uni.navigateBack({
                //   delta: 1,
                // });
                if (res && this.threadId) {
                  uni.redirectTo({
                    url: `/pages/topic/index?id=${this.threadId}`,
                  });
                }
              });
            }
          } else {
            this.editThread().then(res => {
              this.postLoading = false;
              uni.hideLoading();
              // uni.navigateBack({
              //   delta: 1,
              // });
              if (res && this.threadId) {
                uni.redirectTo({
                  url: `/pages/topic/index?id=${this.threadId}`,
                });
              }
            });
          }
        } else {
          if (this.forums.qcloud.qcloud_captcha && this.forums.other.create_thread_with_captcha) {
            if (!this.ticket || !this.randstr) {
              this.toTCaptcha();
              return false;
            }
          }
          this.postThread().then(res => {
            this.postLoading = false;
            uni.hideLoading();
            if (res && res.isApproved === 1) {
              this.$u.event.$emit('addThread', res);
            }
            if (res && res._jv.json.data.id) {
              uni.redirectTo({
                url: `/pages/topic/index?id=${res._jv.json.data.id}`,
              });
            }
          });
        }
      }
    },

    // 编辑回显主题，处理附件
    setAnnex(type, data) {
      switch (type) {
        case 'img':
          data.firstPost.images.map(item => {
            this.filePreview.push({
              path: item.thumbUrl,
              id: item._jv.id,
              order: item.order,
            });
            return item;
          });
          break;
        case 'video':
          this.videoBeforeList.push({
            path: data.threadVideo.media_url,
          });
          break;
        default:
          console.log('没有匹配模式');
          break;
      }
    },
    // 发布主题，处理图片
    addImg() {
      const attachments = {};
      attachments.data = [];
      this.uploadFile.forEach(item => {
        if (item) {
          attachments.data.push({
            type: 'attachments',
            id: item.id,
          });
        }
      });
      // 附件
      if (this.type === 1 && this.$refs.uploadFiles) {
        const fileList = this.$refs.uploadFiles.getValue();
        const preAttachmentList = this.preAttachmentList;
        fileList.forEach(item => {
          for (let i = 0; i < preAttachmentList.length; i += 1) {
            if (preAttachmentList[i]._jv.id === item.id) {
              return;
            }
          }
          if (item.id) {
            attachments.data.push({
              type: 'attachments',
              id: item.id,
            });
          }
        });
      }
      return attachments;
    },
    deleteFile(id) {
      const params = {
        _jv: {
          type: 'attachments',
          id,
        },
      };
      this.$store.dispatch('jv/delete', params).then(res => {
        console.log(res);
      });
    },

    // 接口请求
    getCategories() {
      this.$store.dispatch('jv/get', ['categories?filter[createThread]=1', {}]).then(res => {
        this.allCategories = res;
        res.map(item => {
          if (Number(item._jv.id) === Number(this.categoryId)) {
            this.checkClassData.push(item);
          }
          return item;
        });
      });
    },
    // getEmoji() {
    //   this.$store.dispatch('jv/get', ['emoji', {}]);
    // },
    postThread() {
      const params = {
        _jv: {
          type: 'threads',
          relationships: {
            category: {
              data: {
                type: 'categories',
                id: this.checkClassData[0]._jv.id,
              },
            },
          },
        },
        content: this.textAreaValue,
        type: this.type,
        price: this.price,
        free_words: this.word,
        captcha_ticket: this.ticket,
        captcha_rand_str: this.randstr,
      };

      const postPromise = new Promise((resolve, reject) => {
        switch (this.type) {
          case 0:
            resolve();
            break;
          case 1:
            params.title = this.postTitle;
            params._jv.relationships.attachments = this.addImg();
            resolve();
            break;
          case 2:
            params.file_id = this.fileId;
            params.file_name = this.videoName;
            resolve();
            break;
          case 3:
            params._jv.relationships.attachments = this.addImg();
            resolve();
            break;
          default:
            reject();
            this.$refs.toast.show({ message: this.i18n.t('core.postTypesDoNotMatch') });
        }
      });

      return postPromise.then(() => {
        return this.$store
          .dispatch('jv/post', params)
          .then(res => {
            return res;
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    delAttachments(id, index) {
      const params = {
        _jv: {
          type: 'attachments',
          id,
        },
      };

      return this.$store
        .dispatch('jv/delete', params)
        .then(res => {
          // 当编辑帖子时删除图片后传参给首页
          if (this.operating === 'edit') {
            this.$u.event.$emit('deleteImg', {
              threadId: this.postDetails._jv.id,
              index,
            });
          }

          const post = this.$store.getters['jv/get'](`posts/${this.postDetails.firstPost._jv.id}`);
          post.images.splice(index, 1);
          post._jv.relationships.images.data.splice(index, 1);
          this.uploadFile.forEach((value, key, item) => {
            value.id == id && item.splice(key, 1);
          });
          return res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSignature(callBack = null) {
      this.$store.dispatch('jv/get', ['signature', {}]).then(res => {
        // #ifndef MP-WEIXIN
        callBack(() => res.signature);
        // #endif
        callBack(res.signature);
      });
    },
    postVideo(fileId) {
      const params = {
        _jv: {
          type: 'thread/video',
        },
        file_id: fileId,
      };
      this.$store.dispatch('jv/post', params);
    },
    // 获取当前编辑的主题数据
    getPostThread() {
      const params = {
        include: [
          'firstPost',
          'firstPost.images',
          'threadVideo',
          'category',
          'firstPost.attachments',
        ],
      };

      this.$store.dispatch('jv/get', [`threads/${this.threadId}`, { params }]).then(res => {
        this.postDetails = res;
        this.firstPostId = res.firstPost._jv.id;
        this.type = res.type;

        // #ifdef MP-WEIXIN
        this.markdownShow = false;
        // #endif
        // #ifdef H5
        if (this.type === 1) {
          this.markdownShow = true;
        }
        // #endif
        this.attachmentList = res.firstPost.attachments || [];
        this.preAttachmentList = res.firstPost.attachments || [];
        this.textAreaValue = res.firstPost.content;
        this.categoryId = res.category._jv.id;
        this.checkClassData.push(res.category);
        // this.uploadFile = res.firstPost.images;
        if (res.firstPost.images) {
          res.firstPost.images.forEach(item => {
            if (item) {
              this.uploadFile.push({
                type: 'attachments',
                id: item._jv.id,
                order: item.order,
              });
            }
          });
        }

        this.loadStatus = true;
        if (Number(res.price) > 0) {
          this.price = res.price;
          this.word = res.freeWords;
        }
        this.textAreaLength = this.type === 1 ? 10000 : 450;
        switch (Number(res.type)) {
          case 0:
            break;
          case 1:
            this.postTitle = res.title;
            this.setAnnex('img', res);
            break;
          case 2:
            this.percent = 1;
            this.setAnnex('video', res);
            break;
          case 3:
            this.setAnnex('img', res);
            break;
          default:
            console.log('未知类型');
        }
      });
    },
    // 编辑帖子接口
    async editThread() {
      let state = 0;
      const posts = {
        _jv: {
          type: 'posts',
          // id: `${this.firstPostId}?include=user,thread,images`,
          id: this.firstPostId,
          relationships: {},
          links: {
            self: `posts/${this.firstPostId}?include=user,thread,images`,
          },
        },
        content: this.textAreaValue,
      };
      const threads = {
        _jv: {
          type: 'threads',
          id: this.threadId,
          relationships: {
            category: {
              data: {
                type: 'categories',
                id: this.checkClassData[0]._jv.id,
              },
            },
          },
        },
      };

      switch (this.type) {
        case 0:
          break;
        case 1:
          threads.title = this.postTitle;
          threads.price = this.price;
          threads.free_words = this.word;
          posts._jv.relationships.attachments = this.addImg();
          break;
        case 2:
          threads.file_id = this.fileId;
          threads.file_name = this.videoName;
          threads.price = this.price;
          break;
        case 3:
          threads.price = this.price;
          posts._jv.relationships.attachments = this.addImg();
          break;
        default:
          break;
      }

      await this.$store.dispatch('jv/patch', posts).then(res => {
        if (res._jv.json.data.id) state += 1;
        if (res._jv.json.data.attributes.isApproved === 1) {
          this.$u.event.$emit('refreshImg', {
            id: this.firstPostId,
            threadId: this.threadId,
            images: this.addImg(),
          });
        }
        // 更新详情页的信息
        this.$u.event.$emit('refreshFiles');
        return res;
      });
      await this.$store.dispatch('jv/patch', threads).then(res => {
        if (res._jv.json.data.id) state += 1;
      });

      if (state === 2) {
        return state;
      }
      throw new Error('出错了');
    },
    // 小程序内发布按钮验证码验证
    toTCaptcha() {
      // #ifdef MP-WEIXIN
      let _this = this;
      wx.navigateToMiniProgram({
        appId: 'wx5a3a7366fd07e119',
        path: '/pages/captcha/index',
        envVersion: 'release',
        extraData: {
          appId: this.forums.qcloud.qcloud_captcha_app_id, //您申请的验证码的 appId
        },
        success(res) {
          console.log('验证码成功打开');
        },
        fail(err) {
          uni.hideLoading();
          _this.postLoading = false;
        },
      });
      // #endif
      // h5内发布按钮验证码验证
      // #ifdef H5

      this.captcha = new TencentCaptcha(this.forums.qcloud.qcloud_captcha_app_id, res => {
        if (res.ret === 0) {
          this.ticket = res.ticket;
          this.randstr = res.randstr;
          //验证通过后发布
          this.postClick();
        }
        if (res.ret === 2) {
          this.postLoading = false;
          uni.hideLoading();
        }
      });
      // 显示验证码
      this.captcha.show();
      // #endif
    },
  },
  onLoad(option) {
    this.url = DISCUZ_REQUEST_HOST;
    const token = uni.getStorageSync('access_token');

    this.header = {
      authorization: `Bearer ${token}`,
    };
    this.formData = {
      type: 1,
    };
    this.getCategories();
    if (option.type) this.type = Number(option.type);
    if (option.operating) this.operating = option.operating;
    if (option.threadId) this.threadId = option.threadId;

    if (option.categoryIndex) {
      if (option.categoryIndex === '0') {
        this.categoryIndex = '';
      } else {
        this.categoryIndex = Number(option.categoryIndex);
      }
    }
    if (option.categoryId)
      this.categoryId = Number(option.categoryId) === 0 ? '' : Number(option.categoryId);
    this.textAreaLength = Number(option.type) === 1 ? 10000 : 450;

    if (this.operating === 'edit') {
      this.loadStatus = false;
      this.getPostThread();
    } else {
      this.loadStatus = true;
    }

    try {
      // #ifndef H5
      const res = uni.getSystemInfoSync();
      if (
        res.platform === 'ios' &&
        this.forums.set_site.site_mode === 'public' &&
        this.forums.paycenter.wxpay_ios === false
      ) {
        this.showHidden = false;
      } else if (
        res.platform === 'ios' &&
        this.forums.set_site.site_mode === 'public' &&
        this.forums.paycenter.wxpay_ios === true
      ) {
        this.showHidden = true;
      } else {
        this.showHidden = true;
      }
      // #endif
      // #ifdef H5
      this.showHidden = true;
      // #endif
    } catch (e) {
      // error
    }
    // #ifdef MP-WEIXIN
    this.markdownShow = false;
    // #endif
    // #ifdef H5
    if (this.type === 1) {
      this.markdownShow = true;
    }
    // #endif
    // 接受验证码captchaResult
    this.$u.event.$on('captchaResult', result => {
      this.ticket = result.ticket;
      this.randstr = result.randstr;
      this.postClick();
    });
    this.$u.event.$on('closeChaReault', () => {
      this.postLoading = false;
      uni.hideLoading();
    });

    uni.$on('clickTopic', data => {
      if (data.keywords)
        this.textAreaValue = `${this.textAreaValue.slice(0, this.cursor)}  #${data.keywords.replace(
          /\s+/g,
          '',
        )}#${this.textAreaValue.slice(this.cursor)}  `;
      this.cursor = this.textAreaValue ? this.textAreaValue.length : 0;
    });
  },
  onShow() {
    // #ifndef  MP-WEIXIN
    // this.tcVod = new TcVod({
    //   getSignature: this.getSignature,
    // });
    // #endif
    let atMemberList = '';
    this.getAtMemberData.map(item => {
      atMemberList += `@${item.username} `;
      return atMemberList;
    });

    this.textAreaValue = `${this.textAreaValue.slice(0, this.cursor) +
      atMemberList +
      this.textAreaValue.slice(this.cursor)}`;
    this.setAtMember([]);
    this.cursor = this.textAreaValue ? this.textAreaValue.length : 0;
  },
  onReady() {
    this.videoContext = uni.createVideoContext('video');
  },
  onUnload() {
    this.$u.event.$off('captchaResult');
    this.$u.event.$off('closeChaReault');
    uni.$off('clickTopic');
    // 隐藏验证码
    if (this.captcha) {
      this.captcha.destroy();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.head-gap {
  height: 44px;
}
.post-box {
  width: 100vw;
  height: 100%;
  padding: 40rpx;
  overflow: hidden;
  background-color: --color(--qui-BG-2);
  box-sizing: border-box;

  &__title {
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100rpx;
    margin-bottom: 30rpx;
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
    &-input {
      width: 100%;
      padding-right: 80rpx;
      font-size: $fg-f34;
    }
  }
  &__hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-l {
      &__icon {
        margin-right: 54rpx;
      }
    }
    &-r {
      font-size: $fg-f24;
      color: --color(--qui-FC-777);
    }
  }
  &__con {
    width: 100%;
    // max-height: 900rpx;
    padding: 10rpx 0 0;
    margin-top: 20rpx;
    overflow: hidden;
    background-color: --color(--qui-BG-1);
    border: 1rpx solid --color(--qui-BOR-DDD);
    border-radius: 7rpx;
    box-sizing: border-box;
  }
  &__con-text {
    z-index: 0;
    width: 100%;
    max-height: 900rpx;
    min-height: 400rpx;
    padding: 10rpx 20rpx 20rpx;
    font-size: $fg-f28;
    line-height: 40rpx;
    box-sizing: border-box;

    .text-cover {
      font-size: $fg-f28;
      line-height: 40rpx;
    }
    &--static {
      overflow: auto;
    }
  }

  &__video {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-height: 160rpx;
    padding: 30rpx 0;

    &__play {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160rpx;
      height: 160rpx;
      margin-right: 13rpx;

      &__video {
        z-index: 0;
        width: 100%;
        height: 100%;
        border: 1px solid #ededed;
        border-radius: 5rpx;
      }
      &__load {
        position: absolute;
        top: 0;
        z-index: 98;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        text-align: center;
        border: 1px solid --color(--qui-BOR-ED);
        border-radius: 5rpx;
      }
      &__icon-del {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50rpx;
        height: 50rpx;
        background-color: #dd524d;
        border-radius: 50px;
      }
      .controls-play-icon {
        position: absolute;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(1, 1, 1, 0.5);
      }
    }

    &__add {
      width: 160rpx;
      height: 160rpx;
      line-height: 160rpx;
      text-align: center;
      background-color: #f7f7f7;
      border: 1px solid #ededed;
      border-radius: 5rpx;
    }
  }
  &__ft {
    &-tit {
      display: block;
      margin: 30rpx 0;
      font-size: $fg-f28;
      color: --color(--qui-FC-7D7979);
    }
    &-categories {
      margin-bottom: 40rpx;
    }
  }
}

.play-load {
  .post-box__video__play__load__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: --color(--qui-BG-ED);
    border: 1px solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
    opacity: 0.7;
  }

  .post-box__video__play__load__text {
    position: relative;
    z-index: 2;
    font-size: $fg-f28;
    line-height: 160rpx;
    color: --color(--qui-FC-34);
  }

  progress {
    position: absolute;
    bottom: 9.5rpx;
    z-index: 3;
    width: 87.5%;
  }
}
.post-box__ft-categories /deep/ .qui-button--button {
  margin-top: 10rpx;
  margin-right: 20rpx;
  margin-bottom: 10rpx;
  &[size='default'] {
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}
.post-box__ft-categories /deep/ .qui-button--button:after {
  border: none;
}
.post-box__ft-categories /deep/ .cateActive {
  &[size='default'] {
    border: 1px solid #1878f3;
  }
}

.popup-content-btn {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .popup-btn {
    margin-top: 20rpx;
  }
}

.popup-share {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-share-content {
  height: 477rpx;
  padding: 40rpx 45rpx;
  text-align: center;
  box-sizing: border-box;
  .popup-title {
    font-size: $fg-f28;
  }
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-BG-ED);
}

.emoji-bd {
  position: relative;
  width: 100%;
}
/deep/ textarea .textarea-placeholder {
  font-size: $fg-f28;
  color: --color(--qui-FC-B5);
}
/deep/ input .input-placeholder {
  font-size: $fg-f34;
  color: --color(--qui-FC-AAA);
}

.cell-item-right-text {
  /deep/ .cell-item__body__right-text {
    color: --color(--qui-RED);
  }
}
/deep/ .cell-item__body__right .cell-item__body__right-text {
  font-size: $fg-f34;
}
/deep/ .cell-item__body__content-title {
  color: --color(--qui-FC-777);
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
      font-size: 40rpx;
      text-align: right;
      border: 1px solid --color(--qui-BOR-DDD);
      border-radius: 7rpx;
      box-sizing: border-box;
    }
  }

  &__ft {
    display: flex;
    align-items: center;
    height: 100rpx;
    border-top: 2rpx solid --color(--qui-BOR-DDD);
    box-sizing: border-box;

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

/deep/ .uni-video-cover {
  display: none;
}
.markdown-box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  background: --color(--qui-BG-FFF);
  border-top: 1px solid --color(--qui-BOR-DDD);
}
</style>
