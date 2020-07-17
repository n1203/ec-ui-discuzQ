<template>
  <view>
    <qui-no-data :tips="i18n.t('manage.noContent')" v-if="!list || list.length <= 0"></qui-no-data>
    <view class="list-box" v-for="item in list" :key="item.id" v-else>
      <!-- 除系统通知以外的通知 -->
      <view class="list-box__notice" v-if="item.type !== 'system'">
        <view class="list-box__notice__h">
          <view class="list-box__notice__hl">
            <view class="list-box__notice__hl-image">
              <qui-avatar
                class="list-box__notice__hl-avatar"
                :user="item"
                @click="jumpUserPage(item.user_id)"
              />
            </view>
            <view class="list-box__notice__hl-box">
              <view>
                <view class="list-box__notice__hl-info">
                  <view
                    :class="[
                      item.type === 'rewarded' || item.type === 'rewarded'
                        ? 'list-box__notice__hl-info-con'
                        : '',
                    ]"
                  >
                    <text
                      :class="[
                        item.thread_user_groups ? '' : 'list-box__notice__hl-info-username-space',
                        'list-box__notice__hl-info-username',
                      ]"
                    >
                      {{ item.user_name }}
                    </text>
                    <!-- <text class="list-box__notice__hl-info-groupname" v-if="item.thread_user_groups">
                  （{{ item.thread_user_groups }}）
                </text> -->
                    <text class="list-box__notice__hl-info-title" v-if="item.type === 'related'">
                      {{ i18n.t('notice.relatedMe') }}
                    </text>
                    <text class="list-box__notice__hl-info-title" v-if="item.type === 'replied'">
                      {{ i18n.t('notice.repliedMe') }}
                    </text>
                    <text class="list-box__notice__hl-info-title" v-if="item.type === 'liked'">
                      {{ i18n.t('notice.likedMe') }}
                    </text>
                    <text class="list-box__notice__hl-info-title" v-if="item.type === 'rewarded'">
                      {{
                        item.order_type === 3
                          ? i18n.t('notice.payedMe')
                          : i18n.t('notice.rewardedMe')
                      }}
                    </text>
                  </view>
                  <view class="list-box__notice__hl-info-time">{{ item.time }}</view>
                </view>
              </view>
              <view class="">
                <text class="list-box__notice__hl__amount" v-if="item.type === 'rewarded'">
                  {{ item.money }}
                </text>
                <text class="list-box__notice__hl__cash-amount" v-if="item.type === 'withdrawal'">
                  {{ item.money }}
                </text>
              </view>
            </view>
          </view>
          <view class="list-box__notice__hr">
            <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
          </view>
        </view>
        <view class="list-box__notice__con">
          <view
            class="list-box__notice__con__text"
            v-if="item.post_content"
            v-html="item.post_content"
            @click="jumpMyComment(item)"
          ></view>
          <view
            class="list-box__notice__con__space"
            v-if="item.post_content && item.thread_id"
          ></view>
          <view class="list-box__notice__con__wrap" v-if="item.type === 'withdrawal'">
            <view v-if="item.cash_status === 2">
              {{ i18n.t('notice.approved') }}
            </view>
            <view v-if="item.cash_status === 3">
              {{ i18n.t('notice.unapproved') }}
            </view>
          </view>
          <view
            class="list-box__notice__con__wrap"
            v-if="item.thread_id && item.reply_post_id === 0"
            @click="jumpOtherTopic(item.thread_id)"
          >
            <view class="list-box__notice__con__wrap-info">
              <text class="list-box__notice__con__wrap-info-username">
                {{ item.thread_username }}：
              </text>
              <view
                v-if="item.type !== 'rewarded' && item.type !== 'system'"
                v-html="item.thread_title"
                style="display: inline-block;"
              ></view>
              <view
                v-if="item.type === 'rewarded'"
                v-html="item.content"
                style="display: inline-block;"
              ></view>
              <view class="list-box__notice__con__wrap-info-time">
                {{ item.thread_time }}
              </view>
            </view>
          </view>
          <view
            class="list-box__notice__con__wrap"
            v-if="
              item.thread_id &&
                item.reply_post_id !== 0 &&
                item.type !== 'system' &&
                item.type !== 'rewarded' &&
                item.type !== 'withdrawal'
            "
            @click="jumpMyComment(item)"
          >
            <view class="list-box__notice__con__wrap-info">
              <text class="list-box__notice__con__wrap-info-username">我</text>
              <text class="list-box__notice__con__wrap-info-text" decode>{{ reply }}</text>
              <text class="list-box__notice__con__wrap-info-username">
                {{ item.thread_username }}：
              </text>
              <view
                v-if="item.type !== 'rewarded' && item.type !== 'system'"
                v-html="item.reply_post_content"
                style="display: inline-block; word-break: break-all;"
              ></view>
              <view
                v-if="item.type === 'rewarded'"
                v-html="item.content"
                style="display: inline-block;"
              ></view>
              <view class="list-box__notice__con__wrap-info-time">
                {{ item.reply_time }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 系统通知 -->
      <view class="list-box__system-notice" @click="jumpNotice(item)" v-else>
        <view class="list-box__system-notice__h">
          <view>
            <view class="list-box__system-notice__hl__title">{{ item.title }}</view>
            <view class="list-box__system-notice__hl__time">{{ item.time }}</view>
          </view>
          <view class="list-box__system-notice__hr">
            <qui-icon class="arrow" name="icon-folding-r" size="22" color="#ddd"></qui-icon>
          </view>
        </view>
        <view class="list-box__system-notice__con">
          <view class="list-box__system-notice__con__text" v-if="item.type === 'system'">
            {{ item.content }}
          </view>
        </view>
      </view>
      <!-- 删除按钮 -->
      <view class="list-box__ft">
        <qui-icon name="icon-delete" size="26" @click="deleteNotification(item.id)"></qui-icon>
        <text class="list-box__ft__text" @click="deleteNotification(item.id)">
          {{ i18n.t('notice.delete') }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      reply: '&nbsp;回复了&nbsp;',
    };
  },

  methods: {
    jumpUserPage(id) {
      if (id) {
        console.log('跳转到个人主页', id);
        uni.navigateTo({
          url: `/pages/profile/index?userId=${id}`,
        });
      }
    },
    deleteNotification(id) {
      this.$emit('deleteNotice', id);
    },
    jumpMyComment(item) {
      console.log('跳转到评论页面：', item);
      if (item && item.reply_post_id !== 0) {
        uni.navigateTo({
          url: `/pages/topic/comment?threadId=${item.thread_id}&commentId=${item.reply_post_id}`,
        });
      } else {
        uni.navigateTo({
          url: `/pages/topic/comment?threadId=${item.thread_id}&commentId=${item.post_id}`,
        });
      }
    },
    jumpOtherTopic(topicId) {
      if (topicId) {
        console.log('跳转到帖子详情页面：', topicId);
        uni.navigateTo({
          url: `/pages/topic/index?id=${topicId}`,
        });
      }
    },
    jumpNotice(item) {
      if (
        item &&
        item.raw &&
        item.raw.tpl_id !== 6 &&
        item.raw.thread_id &&
        item.thread_is_approved === 1
      ) {
        console.log('系统通知跳转到帖子详情页面：', item);
        uni.navigateTo({
          url: `/pages/topic/index?id=${item.raw.thread_id}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';

.list-box {
  width: 100%;
  margin: 0 0 20rpx;
  font-size: $fg-f28;
  background-color: --color(--qui-BG-2);

  &__notice {
    padding: 20rpx 40rpx;

    &__h {
      display: flex;
      justify-content: space-between;
      margin: 0rpx 0rpx 20rpx;
    }

    &__hl {
      display: flex;
      align-items: center;
      width: 95%;

      &-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 100rpx;
        will-change: transform;
      }

      &-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 95%;
        margin: 0rpx 0rpx 0rpx 20rpx;
      }

      &-info-username {
        font-weight: bold;
        color: --color(--qui-FC-000);
      }

      &-info-username-space {
        margin: 0rpx 13rpx 0rpx 0rpx;
      }

      &-info-groupname,
      &-info-title {
        color: --color(--qui-FC-AAA);
      }

      &-info-time {
        font-size: 24rpx;
        color: --color(--qui-FC-AAA);
      }

      &__amount {
        margin-right: 20rpx;
        font-weight: bold;
        color: --color(--qui-RED);
      }

      &__cash-amount {
        margin-right: 20rpx;
        font-weight: bold;
        color: --color(--qui-GREEN);
      }
    }

    &__hr {
      display: flex;
      align-items: center;
    }

    &__con {
      &__text {
        color: --color(--qui-FC-333);
      }

      &__space {
        padding: 20rpx 0rpx;
      }

      &__wrap {
        padding: 20rpx;
        font-size: 24rpx;
        color: --color(--qui-FC-333);
        background-color: --color(--qui-BG-ED);
        border-radius: 10rpx;
      }

      &__wrap-info-username {
        font-weight: bold;
        vertical-align: top;
      }

      &__wrap-info-text {
        color: --color(--qui-FC-AAA);
        vertical-align: top;
      }

      &__wrap-info-time {
        margin: 10rpx 0rpx 0rpx;
        font-size: 20rpx;
        color: --color(--qui-FC-AAA);
      }
    }
  }

  &__system-notice {
    padding: 20rpx 40rpx;

    &__h {
      display: flex;
      justify-content: space-between;
      margin: 0rpx 0rpx 20rpx;

      &l__title {
        margin: 0rpx 0rpx 10rpx;
        font-weight: bold;
        color: --color(--qui-FC-000);
      }

      &l__time {
        font-size: 24rpx;
        color: --color(--qui-FC-AAA);
      }
    }

    &__con {
      &__text {
        color: --color(--qui-FC-333);
      }
    }
  }

  &__ft {
    padding: 0rpx 40rpx 40rpx 0rpx;
    color: --color(--qui-FC-777);
    text-align: right;

    &__text {
      padding: 0rpx 0rpx 0rpx 11rpx;
    }
  }
}
</style>
