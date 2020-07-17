<template>
  <qui-page :data-qui-theme="theme" class="content bg">
    <!-- #ifdef H5-->
    <qui-header-back :title="navTitle"></qui-header-back>
    <!-- #endif -->
    <view v-if="loaded && status">
      <scroll-view
        scroll-y="true"
        scroll-with-animation="true"
        show-scrollbar="false"
        class="scroll-y"
        @scrolltolower="pullDown"
      >
        <view class="content" v-if="status">
          <view class="ft-gap">
            <view class="bg-white">
              <view class="detail-tip" v-if="thread.isApproved == 0">
                {{ t.examineTip }}
              </view>

              <view class="detail-tip" v-else-if="post.isApproved == 0">
                {{ t.commentTip }}
              </view>
              <qui-topic-content
                :topic-status="thread.isApproved"
                :avatar-url="post.user.avatarUrl"
                :user-name="post.user.username"
                :theme-time="post.createdAt"
                :theme-content="post.contentHtml"
                :user-role="post.user.groups"
                :images-list="post.images"
                @personJump="personJump(post.user._jv.id)"
              ></qui-topic-content>
              <view class="thread-box" v-if="loadDetailStatus && !thread.isApproved == 0">
                <view class="thread" v-if="thread.isApproved == 1">
                  <view class="thread__header">
                    <view class="thread__header__img" @click="personJump(thread.user._jv.id)">
                      <qui-avatar :user="thread.user" />
                    </view>
                    <view class="thread__header__title">
                      <view class="thread__header__title__top">
                        <span
                          class="thread__header__title__username"
                          @click="personJump(thread.user._jv.id)"
                        >
                          {{ thread.user.username }}
                        </span>
                        <span
                          class="thread__header__title__isAdmin"
                          v-for="(group, gindex) in thread.user.groups"
                          :key="gindex"
                        >
                          {{ group.isDisplay ? `（${group.name}）` : '' }}
                        </span>
                      </view>
                      <view class="thread__header__title__time">
                        {{ localTime }}
                      </view>
                    </view>
                    <image
                      v-if="thread.isEssence"
                      src="@/static/essence.png"
                      alt
                      class="addFine"
                    ></image>
                  </view>

                  <view class="thread__content" @click="contentClick">
                    <view class="thread__content__text">
                      <qui-uparse :content="thread.title" v-if="thread.type == 1"></qui-uparse>
                      <qui-uparse :content="thread.firstPost.summary" v-else></qui-uparse>
                    </view>
                  </view>
                </view>
              </view>
              <view>
                <!-- 点赞用户列表 -->
                <qui-person-list
                  :type="t.giveLike"
                  :person-num="post.likeCount"
                  :limit-count="limitShowNum"
                  :person-list="post.likedUsers"
                  :btn-show="false"
                  @personJump="personJump"
                ></qui-person-list>
              </view>
              <view class="det-con-ft">
                <view
                  v-if="post.canHide"
                  class="det-con-ft-child"
                  @click="deleteReply(post._jv.id, post.canHide)"
                >
                  <qui-icon name="icon-delete" class="qui-icon"></qui-icon>
                  <view>{{ t.delete }}</view>
                </view>
                <view
                  class="det-con-ft-child"
                  @click="postLikeClick(post._jv.id, '1', post.canLike, post.isLiked)"
                >
                  <qui-icon
                    :name="post.isLiked ? 'icon-liked' : 'icon-like'"
                    class="qui-icon"
                  ></qui-icon>
                  <view class="ft-child-word">
                    {{ post.isLiked ? t.giveLikeAlready : t.giveLike }}
                  </view>
                </view>
                <view class="det-con-ft-child" @click="replyComment(post._jv.id, thread.canReply)">
                  <qui-icon name="icon-comments" class="qui-icon"></qui-icon>
                  <view>{{ t.reply }}</view>
                </view>
              </view>
            </view>
            <!-- 评论 -->
            <view class="comment">
              <view
                class="comment-num"
                :style="{ paddingBottom: post.postCount > 1 ? '0' : '40rpx' }"
              >
                {{ post.replyCount }}{{ t.item }}{{ t.comment }}
              </view>
              <view v-if="postComments.length > 0">
                <view v-for="(commentPost, index) in postComments" :key="index">
                  <qui-topic-comment
                    v-if="!commentPost.isDeleted"
                    :post-id="commentPost._jv.id"
                    :comment-avatar-url="commentPost.user.avatarUrl"
                    :user-name="commentPost.user.username"
                    :is-liked="commentPost.isLiked"
                    :user-role="commentPost.user.groups"
                    :comment-time="commentPost.createdAt"
                    :comment-status="commentPost.isApproved"
                    :comment-content="commentPost.contentHtml"
                    :comment-like-count="commentPost.likeCount"
                    :images-list="commentPost.images"
                    :reply-count="commentPost.replyCount"
                    :can-delete="commentPost.canHide"
                    :comment-show="false"
                    @personJump="personJump(commentPost.user.id)"
                    @commentLikeClick="
                      commentLikeClick(
                        commentPost._jv.id,
                        '4',
                        commentPost.canLike,
                        commentPost.isLiked,
                        index,
                        commentPost,
                      )
                    "
                    @commentJump="commentJump(commentPost._jv.id)"
                    @imageClick="imageClick"
                    @deleteComment="
                      deleteComment(
                        commentPost._jv.id,
                        '3',
                        commentPost.canHide,
                        commentPost.isDeleted,
                        commentPost,
                      )
                    "
                  ></qui-topic-comment>
                </view>
              </view>
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
      <!--#ifdef MP-WEIXIN-->
      <!--适配小程序底部弹框-->
      <view class="det-ft"></view>
      <!-- #endif -->
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
                  @click="expressionClick"
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
          <button class="publish-btn" @click="publishClick()">
            {{ t.publish }}
          </button>
        </view>
      </uni-popup>
    </view>
    <view
      v-else-if="(loadingStatus && !loaded && !thread.isDeleted) || (loadingStatus && !status)"
      class="loading"
    >
      <u-loading :size="60"></u-loading>
    </view>
    <qui-page-message
      v-else-if="thread.isDeleted || post.isDeleted || !loaded || !status"
    ></qui-page-message>
  </qui-page>
</template>

<script>
/* eslint-disable */
import { status, utils } from '@/library/jsonapi-vuex/index';
import { mapState, mapMutations } from 'vuex';
import user from '@/mixin/user';
import { time2MorningOrAfternoon } from '@/utils/time';
import { DISCUZ_REQUEST_HOST } from '@/common/const';

export default {
  mixins: [user],
  data() {
    return {
      navTitle: '评论详情页', // 导航栏标题
      threadId: '',
      commentId: '',
      thread: {},
      // post: {},
      loadDetailStatus: {},
      loaded: false,
      status: false,
      loadingStatus: true,
      topicStatus: 0, // 0 是不合法 1 是合法 2 是忽略
      posts: [],
      commentIndex: '', //当前回复的index
      postComments: [], //当前评论的回复列表
      postsStatus: false,
      footerShow: true, // 默认显示底部
      commentShow: false, // 显示评论
      commentPopupStatus: false, //回复弹框内容状态是否显示
      emojiShow: false, //表情组件显示状态
      textAreaValue: '', // 评论输入框
      barStatus: false, // 是否显示输入框获取焦点时完成的那一栏
      uploadFile: [], //上传的文件
      publishClickStatus: true, //发布按钮点击状态
      focusVal: true, // 默认输入框获取焦点状态
      header: {},
      formData: {}, // 图片请求data
      placeholderColor: 'color:#b5b5b5', // 默认textarea的placeholder颜色
      isLiked: false, // 主题点赞状态
      role: '管理员',
      isActive: true,
      bottomData: [
        {
          text: '生成海报',
          icon: 'icon-word',
          name: 'wx',
        },
        {
          text: '微信分享',
          icon: 'icon-img',
          name: 'wx',
        },
      ],

      seleShow: false, // 默认收起管理菜单
      selectList: [
        { text: '编辑', type: '0' },
        { text: '精华', type: '2' },
        { text: '置顶', type: '3' },
        { text: '删除', type: '4' },
      ], // 管理菜单

      limitShowNum: 12,
      paidStatus: false, // 是否有已支付数据
      rewardStatus: false, // 是否已有打赏数据
      likedStatus: false, // 是否已有点赞数据
      commentStatus: {}, //回复状态
      commentId: '', //当前评论的Id
      loadingType: 'more', // 上拉加载状态
      pageNum: 1, //这是主题回复当前页数
      pageSize: 20, //这是主题回复每页数据条数
      contentnomoreVal: '', //数据加载状态提示 暂无评论/没有更多数据
      url: '',
      imageStatus: true, // 头像地址错误时显示默认头像
    };
  },
  computed: {
    ...mapState({
      getAtMemberData: state => state.atMember.atMemberData,
    }),
    post() {
      const commentId = this.commentId;
      return utils.deepCopy(this.$store.getters['jv/get'](`posts/${commentId}`));
    },
    // postList() {
    //   // console.log(this.$store.getters['jv/get']('posts'));
    //   return this.$store.getters['jv/get']('posts');
    // },
    // 语言包
    t() {
      return this.i18n.t('topic');
    },
    // core公共变量语言包
    c() {
      return this.i18n.t('core');
    },
    // 时间转化
    localTime() {
      if (this.thread.createdAt) {
        return time2MorningOrAfternoon(this.thread.createdAt);
      }
    },
  },
  onLoad(option) {
    this.threadId = option.threadId;
    this.commentId = option.commentId;
    this.loadPost();
    this.loadThread();
    this.loadPostComments();
    this.url = DISCUZ_REQUEST_HOST;
    const token = uni.getStorageSync('access_token');

    this.header = {
      authorization: `Bearer ${token}`,
    };
    this.formData = {
      type: 1,
    };
  },
  onUnload() {
    this.$store.dispatch('forum/setError', { loading: false });
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
    }),
    // 加载当前评论数据
    loadPost() {
      const params = {
        include: [
          'user',
          'likedUsers',
          'commentPosts',
          'commentPosts.user',
          'commentPosts.user.groups',
          'commentPosts.replyUser',
          'commentPosts.replyUser.groups',
          'commentPosts.mentionUsers',
          'commentPosts.images',
          'images',
          'attachments',
        ],
      };
      this.loadPostStatus = status.run(() =>
        this.$store
          .dispatch('jv/get', ['posts/' + this.commentId, { params }])
          .then(data => {
            if (data.isDeleted) {
              this.$store.dispatch('forum/setError', {
                code: 'TYPE_404',
                status: 500,
              });
              this.loaded = false;
            } else {
              // #ifndef MP-WEIXIN
              if (data.summaryText) {
                uni.setNavigationBarTitle({
                  title: data.summaryText.slice(0, 80),
                });
              } else {
                uni.setNavigationBarTitle({
                  title: this.t.commentPageTitle,
                });
              }
              // #endif
              this.loaded = true;
            }
            this.loadingStatus = false;
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
          }),
      );
    },
    // 加载当前回复的主题数据
    loadThread() {
      const params = {
        'filter[isDeleted]': 'no',
        include: ['user.groups', 'user', 'firstPost'],
      };
      this.loadDetailStatus = status.run(() =>
        this.$store
          .dispatch('jv/get', ['threads/' + this.threadId, { params }])
          .then(data => {
            if (data.isDeleted) {
              this.$store.dispatch('forum/setError', {
                code: 'thread_deleted',
                status: 500,
              });
              this.status = false;
            } else {
              this.status = true;
            }
            this.thread = data;
            this.loadingStatus = false;
          })
          .catch(err => {
            this.status = false;
            this.loadingStatus = false;
            console.log(err);
            if (err.statusCode === 404) {
              this.$store.dispatch('forum/setError', {
                code: 'type_404',
                status: 500,
              });
            }
          }),
      );
    },

    // post操作调用接口（包括type 1评论点赞，2删除回复，3删除回复的评论，4评论的回复点赞）
    postOpera(id, type, canStatus, isStatus, commentPost) {
      if (type == '1' && !canStatus) {
        this.$refs.toast.show({ message: this.t.noReplyLikePermission });
        return;
      }
      if (type == '4' && !canStatus) {
        this.$refs.toast.show({ message: this.t.noCommentLikePermission });
        return;
      }
      const jvObj = {
        type: 'posts',
        id: id,
      };
      let params = {};
      if (type == '1') {
        params = {
          _jv: jvObj,
          isLiked: !isStatus,
        };
      } else if (type == '2') {
        params = {
          _jv: jvObj,
          isDeleted: !isStatus,
        };
      } else if (type == '3') {
        params = {
          _jv: jvObj,
          isDeleted: !isStatus,
        };
      } else if (type == '4') {
        params = {
          _jv: jvObj,
          isLiked: !isStatus,
        };
      }
      this.$store
        .dispatch('jv/patch', params)
        .then(data => {
          if (type == '1') {
            const orgignPost = this.$store.getters['jv/get'](`posts/${id}`);
            // 当前评论点赞
            this.isLiked = data.isLiked;
            if (this.isLiked) {
              this.post.likedUsers.unshift(this.user);
              orgignPost._jv.relationships.likedUsers.data.unshift({
                type: this.user._jv.type,
                id: this.user._jv.id,
              });
            } else {
              this.post.likedUsers.forEach((value, key, item) => {
                value.id == this.user.id && item.splice(key, 1);
              });
              orgignPost._jv.relationships.likedUsers.data.forEach((value, key, item) => {
                value.id == this.user.id && item.splice(key, 1);
              });
            }
          } else if (type == '2') {
            if (data.isDeleted) {
              uni.navigateBack({
                url: '/pages/topic/index?id=' + this.threadId,
              });
              this.$refs.toast.show({ message: this.t.deleteSuccessAndJumpToTopic });
            } else {
              this.$refs.toast.show({ message: this.t.deleteFailed });
            }
          } else if (type == '3') {
            let postArr = commentPost;
            postArr.isDeleted = data.isDeleted;
            commentPost = postArr;
            // this.post.replyCount--;
            const orgignPost = this.$store.getters['jv/get'](`posts/${this.commentId}`);
            orgignPost.replyCount -= 1;
            if (data.isDeleted) {
              // 回复的评论删除成功
              this.$u.event.$emit('deleteComment', { data: data, commentId: this.commentId });
              this.$refs.toast.show({ message: this.t.deleteSuccess });
            } else {
              // 回复的评论删除失败
              this.$refs.toast.show({ message: this.t.deleteFailed });
            }
          } else if (type == '4') {
            let postArr = commentPost;
            postArr.isLiked = data.isLiked;
            postArr.likeCount = data.likeCount;
            commentPost = postArr;
            if (data.isLiked) {
              // 评论点赞成功
            } else {
              // 评论点赞失败
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 主题回复调用接口
    postComment() {
      if (this.textAreaValue.length < 1) {
        this.$refs.toast.show({ message: this.t.replyContentCannotBeEmpty });
        this.publishClickStatus = true;
        return false;
      }
      const params = {
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
          if (res.isApproved == 1) {
            this.postComments.push(res);
            this.$u.event.$emit('addComment', { data: res, commentId: this.commentId });
          } else {
            this.$refs.toast.show({ message: this.t.publishExamineTip });
          }
          this.$refs.commentPopup.close();
          this.commentPopupStatus = false;
          this.publishClickStatus = true;
          const orgignPost = this.$store.getters['jv/get'](`posts/${this.commentId}`);
          orgignPost.replyCount += 1;
          this.textAreaValue = '';
          this.uploadFile = '';
        })
        .catch(err => {
          this.publishClickStatus = true;
          console.log(err);
        });
    },

    // 加载当前评论的回复数据
    loadPostComments() {
      const params = {
        'filter[isApproved]': 1,
        'filter[thread]': this.threadId,
        'filter[reply]': this.commentId,
        'filter[isDeleted]': 'no',
        'filter[isComment]': 'yes',
        include: ['replyUser', 'user.groups', 'user', 'images'],
      };
      this.loadPostCommentStatus = status.run(() =>
        this.$store.dispatch('jv/get', ['posts', { params }]).then(data => {
          delete data._jv;
          this.postComments = [...this.postComments, ...data];
          this.loadingType = data.length === this.pageSize ? 'more' : 'nomore';
          if (data.length == 0) {
            this.contentnomoreVal = this.t.noComment;
          } else {
            this.contentnomoreVal = this.t.noMoreData;
          }
          this.postsStatus = true;
        }),
      );
    },
    // 对象转数组
    limitArray(obj) {
      const arr = [];
      Object.values(obj).forEach(item => {
        arr.push(item);
      });
      return arr;
    },

    // 跳转到用户主页
    personJump(id) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
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
    expressionClick() {
      this.emojiShow = !this.emojiShow;
    },
    // 点击@跳转到@页
    callClick() {
      uni.navigateTo({
        url: `/pages/user/at-member`,
      });
    },

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

    // 评论点回复击发布事件
    publishClick() {
      this.publishClickStatus = false;
      this.postComment(this.commentId);
    },
    // // 评论点赞
    postLikeClick(postId, type, canStatus, isStatus) {
      this.postOpera(postId, type, canStatus, isStatus);
    },
    // 删除当前回复
    deleteReply(postId, canStatus) {
      this.postOpera(postId, '2');
    },
    // 删除回复的评论
    deleteComment(postId, type, canStatus, isStatus, commentPost) {
      this.postOpera(postId, '3', canStatus, isStatus, commentPost);
    },
    // 评论的回复
    replyComment(postId, canStatus) {
      if (!canStatus) {
        this.$refs.toast.show({ message: this.t.noReplyPermission });
      } else {
        // this.commentId = postId;
        this.$refs.commentPopup.open();
        this.commentPopupStatus = true;
      }
    },
    // 跳回到主题详情页
    contentClick() {
      const pages = getCurrentPages();
      const delta = pages.indexOf(pages[pages.length - 1]);
      if (pages[delta - 1].route == 'pages/topic/index') {
        uni.navigateBack({
          delta: 1,
        });
      } else {
        uni.navigateTo({
          url: `/pages/topic/index?id=${this.threadId}`,
        });
      }

      // if (pages.length === 1) {
      //   // uni.navigateTo({
      //   //   url: '/pages/home/index',
      //   // });
      // } else {
      //   // uni.navigateBack({
      //   //   delta,
      //   // });
      // }
      // uni.redirectTo({
      //   url: `/pages/topic/index?id=${this.threadId}`,
      // });
    },
    // 当前回复点赞
    commentLikeClick(postId, type, canLike, isLiked, commentIndex, commentPost) {
      this.commentIndex = commentIndex;
      this.postOpera(postId, '4', canLike, isLiked, commentPost);
    },
    // 下拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.loadPostComments();
    },
    // 头像失效
    imageError() {
      this.imageStatus = false;
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
* {
  padding: 0;
  margin: 0;
  font-size: $fg-f28;
  color: --color(--qui-FC-333);
}
.flex {
  display: flex;
}
.content {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
}
.bg-white {
  background-color: --color(--qui-BG-2);
  border: 1px solid --color(--qui-BOR-ED);
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
  margin-top: 88rpx;
  /* #endif */
  margin-bottom: 80rpx;
}
.det-ft {
  position: fixed;
  bottom: 0;
  left: 0;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 0;
  line-height: 80rpx;
  background: --color(--qui-FC-FFF);
  box-shadow: 0 -3rpx 6rpx rgba(0, 0, 0, 0.05);
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
  line-height: 100rpx;
  color: --color(--qui-FC-FFF);
  text-align: center;
  background: --color(--qui-MAIN);
  border-radius: 0;
}

.popup-share {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background: --color(--qui-BG-2);
}
.popup-share-box {
  width: 120rpx;
  height: 120rpx;
  line-height: 120rpx;
  background: --color(--qui-BG-40);
  border-radius: 10px;
}
.popup-share-content-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  width: 120rpx;
  height: 164rpx;
  // background: --color(--qui-BG-2);
}
.popup-share-content-image {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: center;
  // align-items: center;
  width: 120rpx;
  height: 120rpx;
  overflow: hidden;
  border-radius: 7rpx;
}
.content-image {
  width: 60rpx;
  height: 60rpx;
  margin: 35rpx;
  line-height: 60rpx;
}
.popup-share-content-text {
  padding-top: 5px;
  font-size: $fg-f26;
  color: --color(--qui-FC-TAG);
}
.popup-share-content-space {
  width: 100%;
  height: 9rpx;
  background: --color(--qui-FC-DDD);
}
.thread-box {
  padding: 50rpx 40rpx 80rpx;
}
.thread {
  padding: 20rpx;
  background: --color(--qui-BG-ED);
  border-radius: 5rpx;
  &__header {
    position: relative;
    display: flex;
    width: 100%;
    height: 80rpx;
    margin-bottom: 12rpx;
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
        font-size: $fg-f28;
        line-height: 37rpx;
      }

      &__username {
        display: flex;
        height: 37rpx;
        max-width: 326rpx;
        overflow: hidden;
        font-weight: bold;
        line-height: 37rpx;
        color: rgba(51, 51, 51, 1);
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__isAdmin {
        display: inline-block;
        height: 37rpx;
        font-weight: 400;
        line-height: 37rpx;
        color: rgba(170, 170, 170, 1);
      }

      &__time {
        font-size: 24rpx;
        font-weight: 400;
        line-height: 31rpx;
        color: rgba(170, 170, 170, 1);
      }

      &__jumpBtn {
        float: right;
        width: 10rpx;
        height: 37rpx;
        font-size: 10rpx;
        line-height: 37rpx;
        color: #ddd;
      }
      &__deleteBtn {
        float: right;
      }
      &__reward {
        float: right;
        font-size: $fg-f28;
        font-weight: bold;
        color: --color(--qui-RED);
      }
    }
  }
  &__content {
    &__text {
      display: flex;
      overflow: hidden;
      flex-direction: column;
      flex-wrap: wrap;
      font-size: $fg-f28;
      line-height: 45rpx;
      word-break: break-all;
    }
  }
}
.addFine {
  position: absolute;
  top: -25rpx;
  right: 0;
  width: 31rpx;
  height: 41rpx;
}
</style>
