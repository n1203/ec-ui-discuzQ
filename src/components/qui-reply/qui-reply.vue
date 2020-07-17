<template>
  <view
    class="comment-child-comment-box"
    :style="{
      padding: padVal,
      borderRadius: radiusVal + 'rpx',
    }"
  >
    <view
      class="comment-child-reply"
      v-for="(reply, index) in replyList"
      :key="index"
      @click="commentJump"
    >
      <view class="reply-user">{{ reply.user.username }}</view>
      <view class="reply-user">：</view>
      <text class="reply-content">
        {{ reply.content }}
      </text>
      <!--<qui-uparse
        :content="reply.contentHtml"
        class="reply-content"
        style="display: inline;"
      ></qui-uparse>-->
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 盒子padding值
    padVal: {
      type: String,
      default: '20rpx',
    },
    // 盒子的圆角
    radiusVal: {
      type: Number,
      default: 10,
    },
    // 评论的回复列表
    replyList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 回复的id
    postId: {
      type: [Number, String],
      default: '',
    },
    // 评论回复的图片
    imagesList: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 图片裁剪、缩放的模式
    modeVal: {
      type: String,
      default: 'center',
    },
  },
  data: () => {
    return {
      isAdmin: true,
      isGreat: false,
    };
  },
  computed: {
    t() {
      return this.i18n.t('topic');
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
    // 删除事件
    deleteComment() {
      this.$emit('deleteComment');
    },
    // 点击图片事件(默认参数图片id)
    imageClick(imageId) {
      this.$emit('imageClick', imageId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.comment-child-comment-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-top: 40rpx;
  background: --color(--qui-BG-ED);
  border-radius: 7rpx;
  box-sizing: border-box;
}
.comment-reply-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.comment-child-reply {
  display: block;
  font-size: $fg-f26;
  line-height: 35rpx;
  word-break: break-all;
  .reply-user {
    display: inline;
    color: --color(--qui-LINK);
  }
  .reply-connector {
    display: inline;
    padding: 0 5px;
    color: --color(--qui-FC-777);
    flex-shrink: 0;
  }
  .reply-content {
    display: inline;
    color: --color(--qui-FC-777);
  }
}
</style>
