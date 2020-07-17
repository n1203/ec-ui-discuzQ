<template>
  <view
    v-if="list.length > 0"
    class="emoji-box"
    :style="{
      position: position,
      top: top,
      left: left,
      right: right,
      bottom: bottom,
      'border-radius': borderRadius,
    }"
  >
    <swiper indicator-dots="true" class="uni-swiper">
      <swiper-item v-for="(emo, index) of getSwiperItem" :key="index">
        <view class="emoji-box__item">
          <view
            class="emoji-box__item__view"
            v-for="(chi, j) of 35"
            :key="j"
            @click="getEmojiClick(index * 35 + j + 1)"
          >
            <image
              class="emoji"
              :src="list[index * 35 + j + 1] ? list[index * 35 + j + 1].url : ''"
            ></image>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'QuiEmoji',

  props: {
    // list: {
    //   default: Object,
    //   type: Object,
    // },
    position: {
      default: 'absolute',
      type: String,
    },
    top: {
      default: '20rpx',
      type: String,
    },
    left: {
      default: '',
      type: String,
    },
    right: {
      default: '',
      type: String,
    },
    bottom: {
      default: '',
      type: String,
    },
    borderRadius: {
      default: '0rpx',
      type: String,
    },
  },
  data() {
    return {
      list: [],
      code: '',
    };
  },

  computed: {
    getSwiperItem() {
      return Math.ceil(this.list.length / 35);
    },
  },

  created() {
    // 获取表情数据
    const emojis = this.$store.getters['emoji/get']('emojis');
    if (emojis.length) {
      this.list = emojis;
    } else {
      this.getEmoji();
    }
  },
  methods: {
    // 表情接口请求
    getEmoji() {
      this.$store.dispatch('jv/get', ['emoji', {}]).then(data => {
        this.list = data;
        delete this.list._jv;
        this.$store.commit('emoji/SET_EMOJI', this.list);
      });
    },
    getEmojiClick(num) {
      this.code = this.list[num].code;
      this.$emit('click', this.code);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.emoji-box {
  z-index: 1500;
  width: 100%;
  height: 370rpx;
  padding: 10rpx 0;
  background-color: --color(--qui-BG-2);
  border: 1rpx solid --color(--qui-BOR-DDD);
  border-radius: 7rpx;
  box-sizing: border-box;

  &__item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &__view {
      display: flex;
      justify-content: center;
      width: 14%;
      height: 24%;
    }
    .emoji {
      width: 58rpx;
      height: 58rpx;
    }
  }
}

/deep/ .uni-swiper {
  position: install;
  height: 350rpx;
}
</style>
