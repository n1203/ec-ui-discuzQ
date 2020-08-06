<template>
  <text :style="{ color: color, 'font-size': size + 'rpx' }" :class="cssClass" @click="handleClick">
    <text v-if="dot" :class="dotClass">{{ badge }}</text>
  </text>
</template>

<script>
export default {
  name: 'QuiIcon',
  props: {
    name: {
      type: [String, Boolean],
      default: '',
    },
    size: {
      type: [Number, String],
      default: 28,
    },
    color: {
      type: String,
      default: '',
    },
    dot: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: [Number, String],
      default: '',
    },
  },
  computed: {
    cssClass() {
      const { name } = this;
      return `qui-icon ${name}`;
    },
    dotClass() {
      const { badge } = this;
      const base = 'qui-info';
      if (!badge.toString()) return `${base} qui-info--dot`;
      return base;
    },
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './font-icon.scss';
.qui-info {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 16px;
  padding: 0 3px;
  font-size: 12px;
  font-weight: bold;
  line-height: 14px;
  color: #fff;
  text-align: center;
  background-color: #ee0a24;
  border: 1px solid #ee0a24;
  border-radius: 16px;
  transform: translate(50%, -50%);
  transform-origin: 100%;
  box-sizing: border-box;

  &--dot {
    width: 8px;
    height: 8px;
    min-width: 0;
    background-color: #ee0a24;
    border-radius: 100%;
  }
}
</style>
