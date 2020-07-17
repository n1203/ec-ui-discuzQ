<template>
  <view class="home">
    <uni-nav-bar
      class="status-bar"
      :style="'transform:' + navBarTransform"
      :title="forums.set_site ? forums.set_site.site_name : ''"
      fixed="true"
      :color="navTheme === $u.light() ? '#000000' : '#ffffff'"
      :background-color="navTheme === $u.light() ? '#ffffff' : '#2e2f30'"
      status-bar
    ></uni-nav-bar>
    <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      show-scrollbar="false"
      class="scroll-y"
      @scroll="scroll"
      @scrolltolower="pullDown"
      @scrolltoupper="toUpper"
    >
      <qui-header
        :head-img="forums.set_site ? forums.set_site.site_header_logo : ''"
        :background-head-full-img="forums.set_site ? forums.set_site.site_background_image : ''"
        :theme="theme"
        :theme-num="forums.set_site ? forums.other.count_users : ''"
        :post-num="forums.set_site ? forums.other.count_threads : ''"
        :share-btn="shareBtn"
        :share-show="shareShow"
        :is-show-more="false"
        :is-show-back="false"
        :is-show-home="false"
        @click="open"
        @closeShare="closeShare"
      ></qui-header>
      <view
        class="nav"
        id="navId"
        :style="headerShow ? '' : 'width:100%;position:fixed;z-index:9;top:' + navbarHeight + 'px;'"
      >
        <view class="nav__box">
          <qui-icon
            class="nav__box__icon"
            name="icon-screen"
            size="28"
            :color="show ? '#1878F3' : '#777'"
            @tap="showFilter"
          ></qui-icon>
        </view>
        <u-tabs
          class="scroll-tab"
          :list="categories"
          :current="categoryIndex"
          @change="toggleTab"
          is-scroll="isScroll"
          active-color="#1878F3"
        ></u-tabs>
      </view>
      <view class="sticky" :style="headerShow ? 'margin-top:30rpx' : 'margin-top:130rpx'">
        <view
          class="sticky__isSticky"
          v-for="(item, index) in sticky"
          :key="index"
          @click="stickyClick(item._jv.id)"
        >
          <view class="sticky__isSticky__box">{{ i18n.t('home.sticky') }}</view>
          <view class="sticky__isSticky__count">
            <qui-uparse
              class="sticky__isSticky__text"
              :content="item.type == 1 ? item.title : item.firstPost.summary"
            ></qui-uparse>
            <!-- {{ item.type == 1 ? item.title : item.firstPost.summary }} -->
          </view>
        </view>
      </view>
      <!-- </view> -->
      <view class="main" id="main">
        <qui-content
          v-for="(item, index) in threads"
          :ref="'myVideo' + index"
          :key="index"
          :currentindex="index"
          :pay-status="(item.price > 0 && item.paid) || item.price == 0"
          :user-name="item.user.username"
          :theme-image="item.user.avatarUrl"
          :theme-btn="item.canHide || ''"
          :theme-reply-btn="item.canReply || ''"
          :user-groups="item.user && item.user.groups"
          :theme-time="item.createdAt"
          :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
          :thread-type="item.type"
          :media-url="item.threadVideo && item.threadVideo.media_url"
          :is-great="item.firstPost.isLiked"
          :theme-like="item.firstPost.likeCount"
          :theme-comment="item.postCount - 1"
          :tags="[item.category]"
          :images-list="item.firstPost.images"
          :theme-essence="item.isEssence"
          :video-width="item.threadVideo && item.threadVideo.width"
          :video-height="item.threadVideo && item.threadVideo.height"
          :video-id="item.threadVideo && item.threadVideo._jv.id"
          :cover-image="item.threadVideo && item.threadVideo.cover_url"
          :is-deleted="item.isDeleted"
          :scroll-top="scrollTop"
          @click="handleClickShare(item._jv.id)"
          @handleIsGreat="
            handleIsGreat(
              item.firstPost._jv.id,
              item.firstPost.canLike,
              item.firstPost.isLiked,
              item.firstPost.likeCount,
            )
          "
          @commentClick="commentClick(item._jv.id)"
          @contentClick="contentClick(item)"
          @backgroundClick="contentClick(item)"
          @headClick="headClick(item.user._jv.id)"
          @videoPlay="handleVideoPlay"
        ></qui-content>
        <qui-load-more :status="loadingType"></qui-load-more>
      </view>
      <!-- #ifdef H5-->
      <view class="record" v-if="forums.set_site ? forums.set_site.site_record : '' !== ''">
        <!-- <text>{{ i18n.t('home.record') }}</text> -->
        <text>{{ forums.set_site ? forums.set_site.site_record : '' }}</text>
      </view>
      <!-- #endif -->
    </scroll-view>
    <qui-filter-modal
      v-model="show"
      @confirm="confirm"
      @changeSelected="changeSelected"
      @change="changeType"
      :confirm-text="i18n.t('home.confirmText')"
      :if-need-confirm="ifNeedConfirm"
      :filter-list="filterList"
      :show-search="showSearch"
      @searchClick="searchClick"
      :content-top="filterTop"
      ref="filter"
    ></qui-filter-modal>
    <uni-popup ref="popupHead" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share" plain="true" id="top"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareHead(index)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="46"
                  color="#777777"
                ></qui-icon>
              </view>
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <uni-popup ref="popupContent" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share" plain="true"></button>
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
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';
import user from '@/mixin/user';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
import loginAuth from '@/mixin/loginAuth-h5';
// #endif
import { mapMutations, mapState } from 'vuex';

const sysInfo = uni.getSystemInfoSync();

const navbarHeight = sysInfo.statusBarHeight + 44; /* uni-nav-bar的高度 */
const navBarTransform = `translateY(-${navbarHeight}px)`;

export default {
  mixins: [
    forums,
    user,
    // #ifdef  H5
    wxshare,
    appCommonH,
    loginAuth,
    // #endif
  ],

  props: {
    navTheme: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      navBarTransform,
      suspended: false, // 是否吸顶状态
      checkoutTheme: false, // 切换主题  搭配是否吸顶使用
      threadType: '', // 主题类型 0普通 1长文 2视频 3图片（'' 不筛选）
      threadEssence: '', // 筛选精华 '' 不筛选 yes 精华 no 非精华
      threadFollow: 0, // 关注的主题 传当前用户 ID
      show: false,
      ifNeedConfirm: true,
      top: 500,
      filterSelected: { label: this.i18n.t('topic.whole'), value: '' }, // 筛选类型
      loadingType: 'more', // 上拉加载状态
      hasMore: false, // 是否有更多
      pageSize: 20, // 每页10条数据
      pageNum: 1, // 当前页数
      isLiked: false, // 主题点赞状态
      showSearch: true, // 筛选显示搜索
      navbarHeight, // 顶部导航栏的高度
      headerShow: true, // 是否显示标题图(背景+logo)，不显示标题图时，分类切换栏需要固定顶部
      navTop: 0, // 切换分类导航的top
      navHeight: 0, // 切换分类导航的高度
      nowThreadId: '', // 当前点击主题ID
      filterTop: '', // 筛选弹窗的位置
      shareShow: false, // h5内分享提示信息
      shareTitle: '', // h5内分享复制链接
      isWeixin: '', // 是否是微信浏览器内
      filterList: [
        {
          title: this.i18n.t('home.filterPlate'),
          data: [],
        },
        {
          title: this.i18n.t('home.filterType'),
          data: [
            { label: this.i18n.t('home.all'), value: '', selected: true },
            { label: this.i18n.t('home.text'), value: '0', selected: false },
            { label: this.i18n.t('home.invitation'), value: '1', selected: false },
            { label: this.i18n.t('home.video'), value: '2', selected: false },
            { label: this.i18n.t('home.picture'), value: '3', selected: false },
          ],
        },
        {
          title: this.i18n.t('home.confirmText'),
          data: [
            { label: this.i18n.t('home.all'), value: '', selected: true },
            { label: this.i18n.t('home.essence'), value: '1', selected: false },
            { label: this.i18n.t('home.followed'), value: '2', selected: false },
          ],
        },
      ],
      threads: [],
      sticky: [], // 置顶帖子内容
      shareBtn: 'icon-share1',
      tabIndex: 0, // 选中标签栏的序列,默认显示第一个
      isResetList: false, // 是否重置列表
      bottomData: [
        {
          text: this.i18n.t('home.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
          id: 1,
        },
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
          id: 2,
        },
      ],
      threadsStatusId: 0,
      categories: [],
      playIndex: null,
      scrollTop: 0,
    };
  },
  computed: {
    ...mapState({
      categoryId: state => state.session.categoryId,
      categoryIndex: state => state.session.categoryIndex,
    }),
  },
  created() {
    // #ifdef  H5
    this.isWeixin = appCommonH.isWeixin().isWeixin;
    this.isPhone = appCommonH.isWeixin().isPhone;
    // #endif
    // 发布帖子后首页追加最新帖子
    this.$u.event.$on('addThread', thread => this.threads.unshift(thread));
    // 详情页删除帖子后在首页删除
    this.$u.event.$on('deleteThread', thread =>
      this.threads.forEach((item, index) => {
        if (item._jv.id === thread) {
          this.threads.splice(index, 1);
        }
      }),
    );
    // 编辑删除图片后首页删除图片
    this.$u.event.$on('deletedImg', res => {
      this.threads.forEach(item => {
        if (item._jv.id === res.threadId) {
          item.firstPost.images.splice(res.index, 1);
        }
      });
    });
    // 置顶列表添加数据当详情页置顶时
    this.$u.event.$on('stickyThread', data => {
      this.sticky.unshift(data);
      this.threads.forEach((item, index) => {
        if (item._jv.id === data._jv.id) {
          this.threads.splice(index, 1);
        }
      });
    });
    // 详情页取消置顶时置顶列表中删除该置顶
    this.$u.event.$on('cancelSticky', data => {
      this.sticky.forEach((item, index) => {
        if (item._jv.id === data._jv.id) {
          this.sticky.splice(index, 1);
        }
      });
    });

    // 详情页编辑增加图片时首页增加图片
    this.$u.event.$on('refreshImg', res => {
      // eslint-disable-next-line no-restricted-syntax
      for (const index in this.threads) {
        if (this.threads[index]._jv.id === res.threadId) {
          const images = this.$store.getters['jv/get'](`posts/${res.id}`);
          this.threads[index].firstPost.images = images.attachments;
          this.$forceUpdate();
          break;
        }
      }
    });
    // h5微信分享
    // #ifdef H5
    this.wxShare({
      title: this.forums.set_site ? this.forums.set_site.site_name : '',
      desc: this.forums.set_site ? this.forums.set_site.site_introduction : '',
      logo: this.forums.set_site ? this.forums.set_site.site_logo : '',
    });
    // #endif
    this.ontrueGetList();
    uni.$on('logind', () => {
      this.ontrueGetList();
    });
  },
  destroyed() {
    uni.$off('logind');
  },
  mounted() {
    this.$u.event.$on('tagClick', tagId => {
      this.isResetList = true;
      this.setCategoryId(tagId);
      this.setCategoryIndex(this.getCategorieIndex(tagId));
      // 首页主题置顶列表
      this.loadThreadsSticky();
      // 首页主题内容列表
      this.loadThreads();
    });

    this.$uGetRect('#navId').then(rect => {
      this.navTop = rect.top;
      this.navHeight = rect.height;
    });
    if (this.forums.set_site) {
      uni.setNavigationBarTitle({
        title: this.forums.set_site.site_name,
      });
    }
  },
  methods: {
    ...mapMutations({
      setCategoryId: 'session/SET_CATEGORYID',
      setCategoryIndex: 'session/SET_CATEGORYINDEX',
    }),
    topMargin() {
      return ';';
    },
    scroll(event) {
      this.scrollTop = event.detail.scrollTop;
      if (!this.navbarHeight) {
        return;
      }
      if (event.detail.scrollTop + this.navbarHeight + 20 >= this.navTop) {
        this.headerShow = false;
        this.navBarTransform = 'none';
      } else {
        this.headerShow = true;
        this.navBarTransform = `translate3d(0, -${this.navbarHeight}px, 0)`;
      }
    },
    // 滑动到顶部
    toUpper() {
      this.headerShow = true;
    },
    // 初始化选中的选项卡
    getCategorieIndex(tagId) {
      for (let i = 0, len = this.categories.length; i < len; i += 1) {
        if (+this.categories[i]._jv.id === +tagId) {
          return i;
        }
      }
    },

    // 切换选项卡
    async toggleTab(dataInfo) {
      // 重置列表
      this.isResetList = true;
      this.pageNum = 1;
      this.checkoutTheme = true;
      this.threadEssence = '';
      this.threadFollow = 0;
      this.setCategoryId(dataInfo.id);
      this.setCategoryIndex(dataInfo.index);
      // 切换筛选框选中分类
      // eslint-disable-next-line
      this.filterList[0].data.map(item => {
        // eslint-disable-next-line
        item.selected = false;
      });
      this.filterList[0].data[dataInfo.index].selected = true;

      this.loadThreadsSticky();
      this.threads = [];
      await this.loadThreads();
      this.checkoutTheme = false;
    },
    // 筛选分类里的搜索
    searchClick() {
      uni.navigateTo({
        url: '/pages/site/search',
      });
      this.show = false;
    },
    // 点击置顶跳转到详情页
    stickyClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 内容部分点击评论跳到详情页
    commentClick(id) {
      uni.navigateTo({
        url: `/pages/topic/index?id=${id}`,
      });
    },
    // 内容部分点击跳转到详情页
    contentClick(thread) {
      if (thread.canViewPosts) {
        uni.navigateTo({
          url: `/pages/topic/index?id=${thread._jv.id}`,
        });
      } else {
        this.$store.getters['session/get']('auth').open();
        this.$refs.toast.show({ message: this.i18n.t('home.noPostingTopic') });
      }
    },
    // 点击头像调转到个人主页
    headClick(id) {
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 首页头部分享按钮弹窗
    open() {
      // #ifdef MP-WEIXIN
      this.$refs.popupHead.open();
      // 付费模式下不显示微信分享
      if (this.forums.set_site.site_mode === 'pay') {
        this.bottomData = [
          {
            text: this.i18n.t('home.generatePoster'),
            icon: 'icon-poster',
            name: 'wx',
            id: 1,
          },
        ];
      }
      // #endif

      // #ifdef H5
      if (this.isWeixin === true) {
        this.shareShow = true;
      } else {
        this.h5Share({
          title: this.forums.set_site ? this.forums.set_site.site_name : '',
          url: 'pages/home/index',
        });
      }
      // #endif
    },
    // #ifdef H5
    closeShare() {
      this.shareShow = false;
    },
    // #endif
    // 头部分享海报
    shareHead(index) {
      if (index === 0) {
        if (!this.$store.getters['session/get']('isLogin')) {
          this.$store.getters['session/get']('auth').open();
          return;
        }
        uni.navigateTo({
          url: '/pages/share/site',
        });
      }
      this.cancel();
    },
    // 取消按钮
    cancel() {
      this.$refs.popupContent.close();
      this.$refs.popupHead.close();
    },
    // 点赞调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    // 筛选选中确定按钮
    confirm(e) {
      // 重置列表
      this.isResetList = true;
      this.pageNum = 1;
      const filterSelected = { ...e };
      this.setCategoryId(filterSelected[0].data.value);
      this.setCategoryIndex(filterSelected[0].data.index);
      this.threadType = filterSelected[1].data.value;

      switch (filterSelected[2].data.value) {
        // 筛选精华帖
        case '1':
          this.threadEssence = 'yes';
          this.threadFollow = 0;
          break;
        // 筛选关注帖
        case '2':
          this.threadEssence = '';
          this.threadFollow = this.user.id; // TODO 当前用户 ID
          break;
        // 不筛选
        default:
          this.threadEssence = '';
          this.threadFollow = 0;
          break;
      }
      this.loadThreadsSticky();
      this.loadThreads();
    },
    // 筛选框
    changeType(e) {
      this.filterList = e;
    },
    // 首页导航栏筛选按钮
    showFilter() {
      // #ifdef MP-WEIXIN
      wx.createSelectorQuery()
        .in(this)
        .select('#navId')
        .boundingClientRect(rect => {
          this.filterTop = `${rect.bottom * 2}rpx`;
        })
        .exec();
      // #endif
      // #ifdef H5
      const obj = document.querySelector('#navId');
      const { bottom } = obj.getBoundingClientRect();
      this.filterTop = `${bottom}px`;
      // #endif
      this.show = !this.show;
      this.$refs.filter.setData();
      // this.navShow = true;
    },
    // 首页内容部分分享按钮弹窗
    handleClickShare(id) {
      // #ifdef MP-WEIXIN
      this.$emit('handleClickShare', id);
      this.nowThreadId = id;
      this.$refs.popupContent.open();
      // 付费模式下不显示微信分享
      if (this.forums.set_site.site_mode === 'pay') {
        this.bottomData = [
          {
            text: this.i18n.t('home.generatePoster'),
            icon: 'icon-poster',
            name: 'wx',
            id: 1,
          },
        ];
      }
      // #endif
      // #ifdef H5
      const shareThread = this.$store.getters['jv/get'](`threads/${id}`);
      if (shareThread.type === 1) {
        this.shareTitle = shareThread.title;
      } else {
        this.shareTitle = shareThread.firstPost.summaryText;
      }
      this.h5Share({
        title: this.shareTitle,
        id,
        url: 'pages/topic/index',
      });
      // #endif
    },
    // 内容部分分享海报,跳到分享海报页面
    shareContent(index) {
      if (index === 0) {
        uni.navigateTo({
          url: `/pages/share/topic?id=${this.nowThreadId}`,
        });
      }
      this.cancel();
    },
    // 首页导航栏分类列表数据
    loadCategories() {
      this.$store.dispatch('jv/get', ['categories', {}]).then(data => {
        const resData = [...data] || [];
        this.categories = [
          {
            _jv: {
              id: 0,
            },
            name: this.i18n.t('home.all'),
          },
          ...resData,
        ];
        const categoryFilterList = [
          {
            label: this.i18n.t('home.all'),
            value: 0,
            selected: true,
          },
        ];
        resData.forEach(item => {
          categoryFilterList.push({
            label: item.name,
            value: item._jv.id,
            selected: false,
          });
        });

        this.filterList[0].data = categoryFilterList;
      });
    },
    // 首页置顶列表数据
    loadThreadsSticky() {
      const params = {
        'filter[isSticky]': 'yes',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[categoryId]': this.categoryId,
        include: ['firstPost'],
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
        this.sticky = [...data];
      });
    },
    // 首页内容部分数据请求
    loadThreads() {
      const params = {
        'filter[isSticky]': 'no',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[categoryId]': this.categoryId,
        'filter[type]': this.threadType,
        'filter[isEssence]': this.threadEssence,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'category',
          'threadVideo',
        ],
      };
      if (this.threadType !== null) {
        params['filter[type]'] = this.threadType;
      }
      params['filter[fromUserId]'] = this.threadFollow;

      const threadsAction = status.run(() =>
        this.$store.dispatch('jv/get', ['threads', { params }]),
      );

      this.threadsStatusId = threadsAction._statusID;

      return threadsAction.then(res => {
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        delete res._jv;
        if (this.isResetList) {
          this.threads = res;
        } else {
          this.threads = [...this.threads, ...res];
        }
        this.isResetList = false;
      });
    },
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked) {
      if (!this.$store.getters['session/get']('isLogin')) {
        // #ifdef MP-WEIXIN
        this.$store.getters['session/get']('auth').open();
        // #endif
        // #ifdef H5
        if (!this.handleLogin()) {
          return;
        }
        // #endif
      }
      const params = {
        _jv: {
          type: 'posts',
          id,
        },
        isLiked: isLiked !== true,
      };
      this.$store.dispatch('jv/patch', params);
    },
    // 上拉加载
    pullDown() {
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.loadThreads();
    },
    // 视频禁止同时播放
    handleVideoPlay(index) {
      if (this.playIndex !== index && this.playIndex !== null) {
        this.$refs[`myVideo${this.playIndex}`][0].pauseVideo();
      }
      this.playIndex = index;
    },
    // 组件初始化请求接口
    ontrueGetList() {
      this.isResetList = true;
      // 首页导航栏分类列表
      this.loadCategories();
      // 首页主题置顶列表
      this.loadThreadsSticky();
      // 首页主题内容列表
      this.loadThreads();
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.home {
  min-height: 100vh;
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
}
.status-bar {
  position: fixed;
  z-index: 1;
  transition: 0.2s;
}
.nav {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: hidden;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  transition: box-shadow 0.2s, -webkit-transform 0.2s;

  &__box {
    position: absolute;
    right: 0;
    z-index: 2;
    display: block;
    float: right;
    width: 80rpx;
    height: 97rpx;
    background: --color(--qui-BG-2);
    &__icon {
      margin-left: 24rpx;
      line-height: 100rpx;
    }
  }
}

.scrolled .nav {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.filter-modal .filter-modal__content {
  max-height: 500rpx;
}

.sticky {
  margin: 30rpx auto;
}

.sticky__isSticky {
  display: flex;
  width: 710rpx;
  height: 80rpx;
  margin: 10rpx auto;
  font-size: $fg-f26;
  line-height: 80rpx;
  background: --color(--qui-BG-2);
  border-radius: 6rpx;
  box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.05);
  &__box {
    // display: block;
    width: 62rpx;
    height: 35rpx;
    margin-top: 27rpx;
    margin-left: 20rpx;
    font-size: $fg-f20;
    line-height: 35rpx;
    color: --color(--qui-FC-777);
    text-align: center;
    background: --color(--qui-BG-777);
    border-radius: 6rpx;
    transition: $switch-theme-time;
  }
  &__count {
    width: 572rpx;
    height: 100%;
    margin-top: 27rpx;
    margin-left: 21rpx;
    overflow: hidden;
    line-height: 35rpx;
    color: #777;
    text-overflow: ellipsis;
    white-space: nowrap;
    &__text {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
.horizonal-tab .active {
  color: --color(--qui-BG-HIGH-LIGHT);
}
.scroll-tab {
  z-index: 100;
  height: 100rpx;
  text-align: center;
  white-space: nowrap;
  border-bottom: 1rpx solid --color(--qui-BOR-EEE);
}
.scroll-tab-item {
  z-index: 1;
  display: inline-block;
  margin: 20rpx 30rpx;
  font-size: $fg-f26;
  line-height: 77rpx;
  color: --color(--qui-FC-777);
}
.active .scroll-tab-line {
  color: --color(--qui-BG-HIGH-LIGHT);
  border-bottom: 4rpx solid --color(--qui-BG-HIGH-LIGHT);
}
.uni-tab-bar .active {
  font-size: $fg-f28;
  font-weight: bold;
  color: --color(--qui-BG-HIGH-LIGHT);
}
.main {
  margin-bottom: 130rpx;
}

.scroll-y {
  // max-height: calc(100vh - 497rpx);
  // max-height: calc(100vh - 100rpx);
  height: calc(100vh - 119rpx);
}

.nav .filter-modal {
  position: absolute;
  z-index: 1000;
  width: 100%;
}
.sticky__isSticky__text {
  display: inline-block;
  width: 100%;
  height: 35rpx;
  line-height: 35rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.record {
  width: 100%;
  height: 40rpx;
  margin-top: -100rpx;
  font-size: $fg-f26;
  color: #b2b2b2;
  text-align: center;
}
</style>
