<template>
  <view v-if="show" class="u-loading u-loading-circle" :style="[cricleStyle]"></view>
</template>

<script>
/* eslint-disable */
	/**
	 * loading 加载动画
	 * @description 警此组件为一个小动画，目前用在uView的loadmore加载更多和switch开关等组件的正在加载状态场景。
	 * @tutorial https://www.uviewui.com/components/loading.html
	 * @property {String} color 动画活动区域的颜色，只对 mode = flower 模式有效（默认#c7c7c7）
	 * @property {String Number} size 加载图标的大小，单位rpx（默认34）
	 * @property {Boolean} show 是否显示动画（默认true）
	 * @example <u-loading mode="circle"></u-loading>
	 */
	export default {
		name: "u-loading",
		props: {
			// 动画的颜色
			color: {
				type: String,
				default: '#c7c7c7'
			},
			// 加载图标的大小，单位rpx
			size: {
				type: [String, Number],
				default: '34'
			},
			// 是否显示动画
			show: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			// 加载中圆圈动画的样式
			cricleStyle() {
				let style = {};
				style.width = this.size + 'rpx';
				style.height = this.size + 'rpx';
				style.borderColor = `#e4e4e4 #e4e4e4 #e4e4e4 ${this.color ? this.color : '#c7c7c7'}`;
				return style;
			},
		}
	}
</script>

<style lang="scss" scoped>
/* stylelint-disable */
	.u-loading-circle {
		display: inline-block;
		vertical-align: middle;
		width: 28rpx;
		height: 28rpx;
		background: 0 0;
		border-radius: 50%;
		border: 2px solid;
		border-color: #e5e5e5 #e5e5e5 #e5e5e5 #1878f3;
		animation: u-circle 1s linear infinite;
	}

	@keyframes u-circle {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
