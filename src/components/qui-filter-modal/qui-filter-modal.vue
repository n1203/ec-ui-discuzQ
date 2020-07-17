<template>
  <view class="filter-modal" :class="{ show: showValue }" @tap.stop="cancel">
    <view class="filter-modal__content" v-if="showValue" @tap.stop :style="{ top: contentTop }">
      <view class="filter-modal__content__search" v-if="showSearch" @click="searchClick">
        <qui-icon class="icon-search" name="icon-search" size="26" color="#777"></qui-icon>
        {{ i18n.t('search.search') }}
      </view>
      <view v-for="(item, index) in filterList" class="filter-modal__content__item" :key="index">
        <view class="filter-modal__content__item-title">{{ item.title }}</view>
        <view
          v-for="(filterItem, filterIndex) in item.data"
          :class="!filterItem.selected ? '' : 'active'"
          :key="filterIndex"
          @click="changeSelected(filterItem, index, filterIndex)"
          class="filter-modal__content__item-detail"
        >
          {{ filterItem.label }}
        </view>
      </view>
      <view class="filter-modal__content__confirm" @tap.stop="confirm" v-if="ifNeedConfirm">
        {{ confirmText || i18n.t('search.filter') }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FilterModal',
  props: {
    confirmText: {
      type: String,
      default: '',
    },
    ifNeedConfirm: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
    multiSelect: {
      type: Boolean,
      default: false,
    },
    filterList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    contentTop: {
      type: String,
      default: '0',
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showValue: this.value,
      selectedData: [],
    };
  },
  watch: {
    value(n) {
      this.showValue = n;
    },
    showValue(n) {
      this.$emit('input', n);
    },
  },
  methods: {
    confirm() {
      this.showValue = false;
      // 如果没有选中默认给每项的第一项
      // const data = [];
      this.selectedData.forEach((v, i) => {
        if (v.data.length === 0) {
          this.filterList[i].data[0].selected = true;
          this.selectedData[i].data.push(this.filterList[i].data[0]);
        }
      });
      this.$emit('confirm', this.selectedData);
      this.$emit('change', this.filterList);
      this.selectedData = [];
    },
    cancel() {
      this.showValue = false;
      this.$emit('cancel');
      this.selectedData = [];
    },
    // dataIndex : 板块index  filterIndex : 细类index
    changeSelected(item, dataIndex, filterIndex) {
      // 区分单选多选
      if (!this.multiSelect) {
        const moduleData = this.filterList[dataIndex].data;
        moduleData.forEach((v, index) => {
          moduleData[index].selected = index === filterIndex;
        });
        this.selectedData[dataIndex].data = { ...item, index: filterIndex };
        // 不需要确定按钮
        if (!this.ifNeedConfirm) {
          this.confirm();
        }
      } else {
        // const moduleData = this.filterList[dataIndex].data;
        // if (moduleData.selected) {
        //   this.filterList[dataIndex].data.selected = false;
        //   this.filterList[dataIndex].data.splice(filterIndex, 1);
        // } else {
        //   this.filterList[dataIndex].data.selected = true;
        //   this.filterList[dataIndex].data.push(item);
        // }
      }
      // 动态改变数据
      this.$emit('change', this.filterList);
    },
    // 传入的值放入选中里面,保证按照分类顺序展示
    setData() {
      const selectedData = [];
      this.filterList.forEach((v, i) => {
        let flag = false;
        v.data.forEach(item => {
          if (item.selected) {
            flag = true;
            selectedData[i] = { title: v.title, data: item };
          }
        });
        if (!flag) {
          selectedData[i] = { title: v.title, data: [] };
        }
      });
      this.selectedData = selectedData;
    },
    // 搜索跳转
    searchClick(evt) {
      this.$emit('searchClick', evt);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
.filter-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
}
@keyframes fadeZoom {
  0% {
    opacity: 0.6;
    transform: scale(0.7);
  }
  80% {
    opacity: 0.3;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.filter-modal__content {
  position: absolute;
  width: 100%;
  max-height: 800rpx;
  padding: 30rpx;
  overflow-y: auto;
  background: --color(--qui-BG-2);
  box-sizing: border-box;
  animation: fadeZoom 0.15s linear;
}
.icon-search {
  margin-right: 19rpx;
}
.filter-modal__content__search {
  position: absolute;
  right: 30rpx;
  font-size: $fg-f28;
  color: --color(--qui-FC-777);
}
.filter-modal.show {
  opacity: 1;
  visibility: visible;
}
.filter-modal__content__confirm {
  height: 90rpx;
  margin-top: 40rpx;
  line-height: 90rpx;
  color: --color(--qui-BG-2);
  text-align: center;
  background: --color(--qui-BG-BTN);
  border-radius: 5rpx;
}
.filter-modal__content__item {
  text-align: left;
}
.filter-modal__content__item-title {
  padding-top: 10rpx;
  padding-bottom: 40rpx;
  font-size: $fg-f28;
  font-weight: bold;
}
.filter-modal__content__item-detail {
  display: inline-block;
  height: 70rpx;
  padding: 0 20rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 26rpx;
  line-height: 70rpx;
  color: --color(--qui-FC-TAG);
  background: --color(--qui-BG-F9F);
  border: 2rpx solid --color(--qui-BOR-CCDD);
  border-radius: 7rpx;
  &.active {
    color: --color(--qui-FC-FFF);
    background: --color(--qui-MAIN);
    border-color: transparent;
  }
}
</style>
