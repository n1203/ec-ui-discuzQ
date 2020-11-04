<template>
  <!-- <qui-page :header="false" :data-qui-theme="theme" class="pages-list"> -->
  <qui-page :header="false" class="pages-list">
    <!-- <view class="qui-topic-page-box">
      <view class="qui-topic-page-box__hd">
        <view class="qui-topic-page-box__hd__sc">
          <qui-icon class="icon-search" name="icon-search" size="30"></qui-icon>
          <input
            class="topicSearchInput"
            type="text"
            placeholder-class="input-placeholder"
            confirm-type="search"
            :placeholder="i18n.t('topic.searchTopic')"
            v-model="keyword"
            @input="searchInput"
          />
        </view>
      </view>
    </view> -->
    <view class="topic_list">
      <view class="fbv topic_center">
        <view class="topic_zhuanshi">
          <qui-icon name="icon-zhuanshi" size="190" color="#f99020"></qui-icon>
        </view>
        <view class="fbh topic_text">
          <qui-icon name="icon-star" class="icon-star" size="55"></qui-icon>
          <h2>话题风云榜单</h2>
          <qui-icon name="icon-star" class="icon-star" size="55"></qui-icon>
        </view>
      </view>
    </view>
    <view class="topic-list-page">
      <view class="topic-list-page-header fbh">
        <view class="topic-list-page-header_title fbh">
          <view class="fbh">
            <qui-icon name="icon-xunzhang3" size="60" color="#f99020"></qui-icon>
          </view>
          <h2 class="txt fbh">{{ i18n.t('topic.topicList') }}</h2>
        </view>
        <view class="topic-list-page-header_sortBox fbh" @click="toggleDropDown">
          <view>
            <qui-icon class="icon-sort" name="icon-jiangxu2" size="30"></qui-icon>
            <text>{{ i18n.t('core.sort') }}</text>
          </view>
          <view class="dropDownBox" v-show="dropDownShow">
            <view @click="switchSort('-viewCount')" class="dropDownBox-view">
              {{ i18n.t('topic.hot') }}
            </view>
            <view @click="switchSort('-threadCount')">
              {{ i18n.t('topic.contents') }}
            </view>
          </view>
        </view>
      </view>
      <!-- <view style="clear: both;"></view> -->
      <view class="topic-page-list-item">
        <view v-for="(item, i) in topicData" :key="i">
          <!-- <navigator :url="'/pages/topic/content?id=' + item._jv.id">
          <view class="topic-page-list-item_title fbh">
            <view class="topic-page-list-item_title_icon">
              <qui-icon name="icon-wei" size="28" color="#fff" />
            </view>
            获取用户头像
            <view class="user_img" size="80" :user="{ avatarUrl: item.user.avatarUrl }">
              <image
                v-if="avatarUrl"
                :src="item.user.avatarUrl"
                :class="'qui-ava qui-avatar-' + size"
                @error="error"
              ></image>
            </view>
            <text># {{ item.content }} #</text>
          </view>
        </navigator> -->

          <view class="topic-page-list-item_details" v-if="item.lastThread.length">
            <view class="fbh">
              <!-- <qui-avatar
              class="user_img"
              size="80"
              :user="{ avatarUrl: item.user.avatarUrl, username: item.user.username }"
            /> -->
              <!-- <view class="topic-page-list-item_details_username">{{ item.user.username }}</view> -->
              <!-- 获取数组下标，得到排名序号 -->
              <view class="ranking">
                <view class="figure" v-if="i > 2">
                  <h3>{{ i + 1 }}</h3>
                </view>
              </view>
              <qui-icon
                v-if="i < 3"
                :name="arr[i].name"
                :style="{ color: arr[i].color, left: arr[i].left, top: arr[i].top }"
                class="ranking ranking_tothree"
                size="75"
              ></qui-icon>
              <!-- 获取用户头像 -->
              <view class="user_img" size="80" :user="{ avatarUrl: item.user.avatarUrl }">
                <image
                  :src="item.user.avatarUrl"
                  :class="'qui-ava qui-avatar-' + size"
                  @error="error"
                ></image>
              </view>
              <view class="fbv">
                <h4># {{ item.content }} #</h4>
                <navigator :url="'/pages/topic/index?id=' + item.lastThread[0]._jv.id">
                  <qui-uparse
                    class="topic-page-list-item_details_text"
                    :content="item.lastThread[0].firstPost.summary"
                  ></qui-uparse>
                </navigator>
              </view>
            </view>
            <qui-image
              class="topic-page-list-item_details_image"
              :images-list="item.lastThread[0].firstPost.images"
              v-if="item.lastThread[0].firstPost.images.length"
            ></qui-image>
            <view class="topic-page-list-item_other">
              <view class="topic-page-list-item_heat">
                <text>
                  {{
                    item.view_count > 10000
                      ? Number(item.view_count / 10000) + i18n.t('core.thousand')
                      : item.view_count
                  }}
                </text>
                {{ i18n.t('topic.hot') }}
              </view>
              <view class="topic-page-list-item_content">
                <text>
                  {{
                    item.thread_count > 1000
                      ? Number(item.thread_count / 1000) + 'k'
                      : item.thread_count
                  }}
                </text>
                {{ i18n.t('core.content') }}
              </view>
            </view>
          </view>
          <!-- <view class="topic-page-list-item_other" style="padding-left: 0.5rem;">
          <view class="topic-page-list-item_heat">
            <text>
              {{
                item.view_count > 10000
                  ? Number(item.view_count / 10000) + i18n.t('core.thousand')
                  : item.view_count
              }}
            </text>
            {{ i18n.t('topic.hot') }}
          </view>
          <view class="topic-page-list-item_content">
            <text>
              {{
                item.thread_count > 1000
                  ? Number(item.thread_count / 1000) + 'k'
                  : item.thread_count
              }}
            </text>
            {{ i18n.t('core.content') }}
          </view>
        </view> -->
        </view>
      </view>
    </view>
    <qui-load-more :content-text="contentText"></qui-load-more>
    <ec-footer-placeholder />
  </qui-page>
</template>

<script>
import user from '@/mixin/user';
import stringToColor from '@/utils/stringToColor';

let timer = null;
let currentPage = 1;
const sizes = {
  80: 'font-size: 48rpx;line-height: 80rpx;',
  70: 'font-size: 44rpx;line-height: 70rpx;',
  60: 'font-size: 40rpx;line-height: 60rpx;',
  50: 'font-size: 36rpx;line-height: 50rpx;',
};

export default {
  mixins: [user],
  props: {
    size: {
      type: [Number, String],
      default: 80,
    },
  },
  data() {
    return {
      dropDownShow: false,
      topicData: [],
      meta: {}, // 接口返回meta值
      contentText: {
        contentdown: this.i18n.t('topic.noMoreData'),
      },
      keyword: '',
      sort: '-viewCount',
      isShow: true,
      arr: [
        {
          name: 'icon-guanjun1',
          color: 'red',
          left: '-1.3%',
          top: '-6%',
        },
        {
          name: 'icon-yajun',
          color: '#f8af2a',
          left: '-1.3%',
          top: '-6%',
        },
        {
          name: 'icon-jijun',
          color: '#b7804d',
          left: '-1.3%',
          top: '-6%',
        },
      ],
    };
  },
  computed: {
    avatarUrl() {
      return this.user.avatarUrl && this.user.avatarUrl.indexOf('/static/noavatar.gif') !== 0;
    },
    usernameAt() {
      return this.user.username
        ? this.user.username.charAt(0).toUpperCase()
        : this.i18n.t('core.noavatar');
    },
  },
  created() {
    this.ontrueGetList();
    uni.$on('logind', () => {
      this.ontrueGetList();
    });
  },
  methods: {
    // 获取数组下标
    // indexbtn(i) {
    //   console.log(i);
    // },
    // rankColor(i) {
    //   switch (i) {
    //     case 0:
    //       if (i === 0) {
    //         return { color: 'red', left: '-1.3%', top: '-6%' };
    //       }
    //       break;
    //     case 1:
    //       if (i === 1) {
    //         return { color: '#f8af2a', left: '-1.3%', top: '-6%' };
    //       }
    //       break;
    //     case 2:
    //       if (i === 2) {
    //         return { color: '#b7804d', left: '-1.3%', top: '-6%' };
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    // },
    // rankIcon(i) {
    //   switch (i) {
    //     case 0:
    //       if (i === 0) {
    //         return 'icon-guanjun1';
    //       }
    //       break;
    //     case 1:
    //       if (i === 1) {
    //         return 'icon-yajun';
    //       }
    //       break;
    //     case 2:
    //       if (i === 2) {
    //         return 'icon-jijun';
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    // },
    // rankIcon(i) {
    //   if (i === 0) {
    //     return 'icon-guanjun1';
    //   }
    //   if (i === 1) {
    //     return 'icon-yajun';
    //   }
    //   if (i === 2) {
    //     return 'icon-jijun';
    //   }
    // },
    style() {
      const color = stringToColor(this.usernameAt);
      return `background-color: #${color};${sizes[this.size]}`;
    },
    error() {
      this.user.avatarUrl = false;
    },
    click() {
      this.$emit('click');
    },
    toggleDropDown() {
      this.dropDownShow = !this.dropDownShow;
    },
    searchInput() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // 为发送请求添加防抖处理
        this.ontrueGetList();
      }, 300);
    },
    switchSort(sort) {
      this.sort = sort;
      this.ontrueGetList();
    },
    ontrueGetList(page = 1, limit = 20) {
      const params = {
        include: 'user,lastThread,lastThread.firstPost,lastThread.firstPost.images',
        'page[number]': page,
        'page[limit]': limit,
        sort: this.sort,
      };
      if (this.keyword) {
        params['filter[content]'] = this.keyword;
      }

      return this.$store.dispatch('jv/get', ['topics', { params }]).then(data => {
        this.meta = data._jv.json.links;
        // eslint-disable-next-line no-param-reassign
        // delete data._jv;
        if (page > 1) {
          this.topicData = this.topicData.concat(data);
        } else {
          this.topicData = data;
        }
        if (this.meta.next) {
          this.contentText.contentdown = this.i18n.t('core.loadMore');
        } else if (this.meta.last && this.meta.first) {
          this.contentText.contentdown = this.i18n.t('core.noMoreData');
        } else {
          this.contentText.contentdown = this.i18n.t('core.available');
        }
      });
    },
  },
  // ontrueGetList() {
  //   this.ontrueGetList();
  // },
  onLoad() {
    this.ontrueGetList();
  },
  onReachBottom() {
    if (this.meta.next) {
      this.ontrueGetList((currentPage += 1));
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';
.dropDownBox {
  position: absolute;
  top: 430rpx;
  right: 20rpx;
  z-index: 10;
  width: 140rpx;
  padding: 10rpx;
  text-align: center;
  background: --color(--qui-BG-2);
  border-radius: 10rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
  view {
    height: 70rpx;
    font-size: $fg-f28;
    line-height: 70rpx;
    color: --color(--qui-FC-777);
    text-align: center;
  }
  &-view {
    border-bottom: 2rpx solid --color(--qui-BOR-ED);
  }
  &:before {
    position: absolute;
    top: -12rpx;
    right: 24rpx;
    width: 0;
    height: 0;
    border-color: transparent transparent --color(--qui-BOR-ED);
    border-style: solid;
    border-width: 0 12rpx 12rpx;
    content: '';
  }
  &:after {
    position: absolute;
    top: -10rpx;
    right: 24rpx;
    width: 0;
    height: 0;
    border-color: transparent transparent --color(--qui-BG-2);
    border-style: solid;
    border-width: 0 12rpx 12rpx;
    content: '';
  }
}

$otherHeight: 292rpx;
.topicSearchInput {
  font-size: 32rpx;
  color: #333;
}
.topic-list-page-header {
  align-items: center;
  justify-content: space-between;
  &_title {
    align-items: center;
    margin: 20rpx;
    margin-bottom: 4rpx;
    // font-size: 28rpx;
    letter-spacing: 8rpx;
  }
  h2 {
    margin-left: 10rpx;
  }
  &_sortBox {
    margin: 20rpx;
    margin-bottom: 4rpx;
    font-size: 28rpx;
    color: #1878f3;
  }
  .icon-sort {
    margin-right: 8rpx;
  }
}
.topic-page-list-item {
  padding: 10rpx 30rpx;
  margin: 20rpx 0;
  background: --color(--qui-BG-2);
  border-top-left-radius: 25rpx;
  border-top-right-radius: 25rpx;
  box-shadow: 0 4rpx 8rpx rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
  &_title {
    font-size: 35rpx;
    font-weight: 700;
    word-break: break-all;
    &_icon {
      background: --color(--qui-BG-HIGH-LIGHT);
      width: 50rpx;
      height: 50rpx;
      text-align: center;
      line-height: 50rpx;
      margin-right: 20rpx;
      border-radius: 50rpx;
    }
  }
  &_details {
    margin: 10rpx 0;
    // background: --color(--qui-BG-ED);
    padding: 10rpx 10rpx 10rpx 20rpx;
    position: relative;
    &_username {
      font-size: 24rpx;
      line-height: 50rpx;
      margin-left: 20rpx;
    }
    h4 {
      padding-left: 10rpx;
      padding-bottom: 10rpx;
    }
    &_text {
      margin-left: 10rpx;
      width: 100%;
      height: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      text-align: justify;
      font-size: 18rpx;
      color: --color(--qui-FC-333);
    }
  }

  &_heat,
  &_content {
    margin-right: 25rpx;
    font-size: 24rpx;
    color: --color(--qui-FC-AAA);
  }
  &_other {
    display: flex;
    padding-top: 5rpx;
  }
}
.ranking {
  position: absolute;
  z-index: 10;
  .figure {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50rpx;
    height: 50rpx;
    border-radius: 15rpx;
    background-color: #ccc;
    color: #fff;
    top: 10%;
    font-size: 26rpx;
  }
}
.topic-content-item {
  position: relative;
  height: 99.5rpx;
  margin-left: 40rpx;
  line-height: 99.5rpx;
  border-bottom: 0.5rpx solid #dedede;
  &_title {
    position: absolute;
    left: 0;
    padding-bottom: 34rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
  &_heat {
    position: absolute;
    right: 15rpx;
    font-size: 24rpx;
    color: #aaa;
  }
}
.qui-topic-page-box {
  width: 100%;
  height: 100%;
  background-color: --color(--qui-BG-2);
  &__hd {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 20rpx 40rpx;

    &__sc {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 10rpx;
      background-color: --color(--qui-BG-IT);
      border-radius: 7rpx;

      .icon-search {
        margin: 0 10rpx;
        color: #bbb;
      }
      input {
        width: 100%;
        height: 100%;
      }
      /deep/ input .input-placeholder {
        font-size: $fg-f28;
        color: --color(--qui-FC-C6);
      }
    }
  }
  &__lst {
    .scroll-Y {
      height: calc(100vh - #{$otherHeight});
      .loading-text {
        height: 100rpx;
        font-size: 28rpx;
        line-height: 100rpx;
        color: --color(--qui-FC-AAA);
        text-align: center;
      }
      .loading-text__cont {
        margin-left: 20rpx;
      }
    }
  }
  &__ft {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 40rpx;
    background-color: --color(--qui-BG-2);
    box-sizing: border-box;
    /deep/ .qui-button--button[size='large'] {
      border-radius: 5rpx;
    }
    /deep/ .qui-button--button[disabled] {
      color: #7d7979;
      background-color: #fff;
    }
  }
}

.topic-page-list-item_details_text {
  text-align: justify;
}
.topic_list {
  display: flex;
  width: 100vw;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, #f57c1a, rgb(243, 243, 3) 70%);
  .topic_center {
    padding: 50rpx;
    align-items: center;
    justify-content: center;
    .topic_zhuanshi {
      margin-top: 40rpx;
    }
    .topic_text {
      align-items: center;
      justify-content: center;
      margin-top: -60rpx;
      .icon-star {
        color: #fff;
      }
      h2 {
        padding: 0 10rpx 0 10rpx;
        font-size: 70rpx;
        color: #fff;
        letter-spacing: 10rpx;
      }
    }
  }
}
.qui-avatar {
  position: relative;
}
.qui-avatar .avatar,
.qui-ava {
  border-radius: 15rpx;
  margin-right: 10rpx;
}

.qui-avatar-80 {
  width: 140rpx;
  height: 140rpx;
}
.qui-avatar-70 {
  width: 90rpx;
  height: 90rpx;
}
.qui-avatar-60 {
  width: 70rpx;
  height: 70rpx;
}
.qui-avatar-50 {
  width: 60rpx;
  height: 60rpx;
}

.qui-avatar .avatar {
  color: #fff;
  text-align: center;
  background-color: #e7edf3;
}
</style>
