<template>
  <view class="themeCount">
    <view class="themeItem">
      <view class="themeItem__header">
        <view class="themeItem__header__img" @click="personJump">
          <qui-avatar :user="{ username: userName, avatarUrl: commentAvatarUrl }" />
        </view>
        <view class="themeItem__header__title">
          <view class="themeItem__header__title__top">
            <text class="themeItem__header__title__username" @click="personJump">
              {{ userName }}
            </text>

            <text
              class="themeItem__header__title__isAdmin"
              v-for="(group, index) in userRole"
              :key="index"
            >
              {{ group.isDisplay ? `（${group.name}）` : '' }}
            </text>
          </view>
          <view class="themeItem__header__title__time">{{ localTime }}</view>
        </view>
        <view class="themeItem__header__r">
          <view v-if="commentStatus == 0" class="comment-status">{{ t.inReview }}</view>
          <view v-else @click="commentLikeClick" class="comment-like">
            <qui-icon v-if="isLiked" name="icon-liked" class="like"></qui-icon>
            <qui-icon v-else name="icon-like" class="like" size="30"></qui-icon>
            <view class="comment-like-count">
              {{ commentLikeCount == 0 ? t.like : commentLikeCount }}
            </view>
          </view>
        </view>
      </view>

      <view class="themeItem__content">
        <view class="themeItem__content__text" @click="commentJump">
          <qui-uparse :content="commentContent"></qui-uparse>
        </view>

        <qui-image :images-list="imagesList"></qui-image>
        <qui-reply
          v-if="replyList.length > 0"
          :reply-list="replyList"
          @commentJump="commentJump"
        ></qui-reply>
      </view>

      <view class="themeItem__comment"></view>
      <view
        class="themeItem__footer"
        :style="{ justifyContent: replyCount > 0 ? 'space-between' : 'flex-end' }"
      >
        <view class="themeItem__footer__l" v-if="replyCount > 3" @click="commentJump">
          <view class="themeItem__footer__con">{{ replyCount }}{{ t.item }}{{ t.reply }}</view>
          <qui-icon
            class="count-jt"
            name="icon-folding-r"
            size="22"
            @click="handleClick"
          ></qui-icon>
        </view>
        <view v-else></view>
        <view class="themeItem__footer__r">
          <view class="footer__r__child" v-if="canDelete" @click="deleteComment">
            <qui-icon class="icon" name="icon-delete" size="26" color="#AAA"></qui-icon>
            <view class="themeItem__footer__con">{{ t.delete }}</view>
          </view>
          <view class="footer__r__child" @click="replyComment" v-if="commentShow">
            <qui-icon class="icon" name="icon-comments" size="26" color="#AAA"></qui-icon>
            <view class="themeItem__footer__con">{{ t.reply }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { time2MorningOrAfternoon } from '@/utils/time';

export default {
  props: {
    // 回复的用户头像
    commentAvatarUrl: {
      type: String,
      default: '',
    },
    // 回复的id
    postId: {
      type: [Number, String],
      default: '',
    },
    // 回复的用户名
    userName: {
      type: String,
      default: '',
    },
    // 回复的用户的角色
    userRole: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 回复的审核状态
    commentStatus: {
      type: [String, Number],
      default: '1',
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    // 回复的内容
    commentContent: {
      type: String,
      default: '',
    },
    // 回复的评论
    replyList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 评论的回复数
    replyCount: {
      type: Number,
      default: 0,
    },
    // 回复的时间
    commentTime: {
      type: String,
      default: '',
    },
    // 回复的图片
    imagesList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 图片裁剪、缩放的模式
    modeVal: {
      type: String,
      default: 'aspectFill',
    },
    // 是否显示评论的回复按钮
    commentShow: {
      type: Boolean,
      default: false,
    },
    // 回复的点赞数
    commentLikeCount: {
      type: Number,
      default: 0,
    },
    // 是否显示删除
    canDelete: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      isAdmin: true,
      isGreat: false,
      imageStatus: true,
    };
  },
  computed: {
    t() {
      return this.i18n.t('topic');
    },
    // 时间转化
    localTime() {
      return time2MorningOrAfternoon(this.commentTime);
    },
  },
  watch: {
    // 监听得到的数据
    commentLikeCount: {
      handler(newVal) {
        this.commentLikeCount = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 点击内容事件
    commentJump() {
      this.$emit('commentJump');
    },
    // 点击头像以及用户名事件
    personJump() {
      this.$emit('personJump');
    },
    // 评论点赞
    commentLikeClick(evt) {
      this.$emit('commentLikeClick', evt);
    },
    // 删除事件
    deleteComment() {
      this.$emit('deleteComment');
    },
    // 回复事件
    replyComment() {
      this.$emit('replyComment');
    },
    // 点击图片事件(默认参数图片id)
    // imageClick(imageId) {
    //   this.$emit('imageClick', imageId);
    // },
    // 预览图片
    previewPicture(index) {
      const _this = this;
      const preview = [];
      for (let i = 0, len = _this.imagesList.length; i < len; i += 1) {
        preview.push(_this.imagesList[i].url);
      }
      uni.previewImage({
        current: index,
        urls: preview,
        indicator: 'number',
      });
    },
    // 头像加载失败,显示默认头像
    imageError() {
      this.imageStatus = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.themeCount {
  position: relative;
  .addFine {
    position: absolute;
    top: -10rpx;
    left: 679rpx;
    width: 31rpx;
    height: 41rpx;
  }
}
.themeItem {
  width: 100%;
  padding: 30rpx 40rpx;
  border-bottom: 1px solid --color(--qui-BOR-ED);
  box-sizing: border-box;

  &__header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 80rpx;
    margin-bottom: 20rpx;

    &__img {
      width: 80rpx;
      height: 80rpx;
      margin-right: 18rpx;
      background: #ccc;
      border-radius: 100%;

      image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }

    &__title {
      flex: 1;
      &__top {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 37rpx;
        margin-bottom: 10rpx;
        margin-left: 2rpx;
        font-size: 28rpx;
        line-height: 37rpx;
      }

      &__username {
        display: flex;
        height: 37rpx;
        max-width: 286rpx;
        overflow: hidden;
        font-weight: bold;
        line-height: 37rpx;
        color: --color(--qui-FC-000);
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__isAdmin {
        display: inline-block;
        height: 37rpx;
        font-weight: 400;
        line-height: 37rpx;
        color: --color(--qui-FC-AAA);
      }

      &__time {
        font-size: 24rpx;
        font-weight: 400;
        line-height: 31rpx;
        color: --color(--qui-FC-AAA);
      }

      &__jumpBtn {
        float: right;
        width: 10rpx;
        height: 37rpx;
        font-size: 10rpx;
        line-height: 37rpx;
        color: #ddd;
      }
    }
    &__r {
      width: 100rpx;
      .comment-status {
        font-size: 26rpx;
        color: --color(--qui-RED);
        text-align: right;
      }
    }
  }

  &__content {
    &__text {
      overflow: hidden;
      font-size: 28rpx;
      font-weight: 400;
      line-height: 45rpx;
      color: --color(--qui-FC-333);
      word-break: break-all;
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;

      &__item {
        height: 50rpx;
        padding: 0 20rpx;
        margin-right: 10rpx;
        margin-bottom: 8rpx;
        font-family: $font-family;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 50rpx;
        color: rgba(119, 119, 119, 1);
        text-align: center;
        background: rgba(247, 247, 247, 1);
        border-radius: 6rpx;
      }
    }
  }
}
.themeItem__footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-top: 20rpx;
  .themeItem__footer__con {
    font-size: $fg-f26;
    line-height: 37rpx;
  }
  &__l {
    display: flex;
    flex-direction: row;
    line-height: 37rpx;
    color: --color(--qui-LINK);
    text-align: left;
    align-items: center;
    .count-jt {
      padding-left: 6rpx;
      line-height: 34rpx;
      color: --color(--qui-LINK);
    }
  }
  &__r {
    display: flex;
    flex-direction: row;
    line-height: 37rpx;
    color: rgba(170, 170, 170, 1);
    text-align: right;
    align-items: center;
  }
}
.footer__r__child {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 120rpx;
  text-align: right;
  .icon {
    padding-right: 10rpx;
    font-size: $fg-f28;
    line-height: 37rpx;
    color: rgba(170, 170, 170, 1);
  }
}
.comment-like {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .like {
    margin-right: 15rpx;
    font-size: 30rpx;
    line-height: 37rpx;
    color: --color(--qui-FC-777);
  }
  .comment-like-count {
    font-size: $fg-f28;
    line-height: 37rpx;
    color: --color(--qui-FC-777);
  }
}
</style>
