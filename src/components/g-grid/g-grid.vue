<template>
	<view :class="props.type == 2 ? 'normal' : 'diff'">
		<uni-grid :showBorder="false" :square="false" :column="3">
			<uni-grid-item v-for="(item, i) in list" :key="i">
				<view class="grid-item-box">
					<!-- 绿色能量角标 -->
					<!-- <view class="gree-label">绿色能量</view> -->
					<!-- v-if="item.enabled == 0 "  -->
					<!-- <view class="weihu">维护中</view> -->
					<text :class="`icon-font grid-resize ${item.iconfont}`" />
					<view class="grid-label">{{ item.title }}</view>
					<text class="grid-title">{{ item.detail }}</text>
				</view>

				<!-- <view class="grid-dot">
						disabled
					</view> -->
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script lang="ts" setup>
import { withDefaults, ref } from 'vue';
interface IGridProps {
	list: IRoute[];
	type: 1 | 2; //首页图标样式1 默认2
}

const props = withDefaults(defineProps<IGridProps>(), {
	list: () => [
		{
			title: '医院介绍',
			url: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			url: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			url: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			url: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			url: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			url: '/xxx',
			iconfont: 'ico_sy_paper5'
		},
		{
			title: '医院介绍',
			url: '/xxx',
			iconfont: 'ico_sy_paper5'
		}
	],
	type: 2
});
</script>

<style lang="scss" scoped>
// 样式一
.diff {
	.uni-grid-wrap {
		padding: 60rpx 0 40rpx 0;
	}
	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.grid-resize {
			width: 88upx;
			height: 88upx;
			position: relative;
		}

		.grid-label {
			margin-top: 8upx;
			font-size: var(--hr-font-size-s);
			color: var(--hr-neutral-color-10);
			font-weight: var(--h-weight-2);
		}
		.grid-title {
			font-size: var(--hr-font-size-xxxs);
			text-align: center;
			color: var(--hr-neutral-color-7);
			line-height: 34rpx;
		}
	}
}
// 样式二
.normal {
	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;

		.grid-resize {
			width: 54upx;
			height: 54upx;
			position: relative;
		}

		.grid-label {
			margin-top: 12upx;
			font-size: var(--hr-font-size-xxs);
		}
		.grid-dot {
			position: absolute;
			top: 5px;
			right: 15px;
		}
	}
}
.gree-label {
	position: absolute;
	background: #ffffff;
	border: 1rpx solid var(--hr-success-color-6);
	border-radius: 17rpx;
	color: var(--hr-success-color-6);
	line-height: 32rpx;
	font-size: var(--h-size-18);
	padding: 0 8rpx;
	z-index: 100;
	right: 5rpx;
	top: 5rpx;
	background-color: var(--h-color-white);
	box-sizing: border-box;
}
.weihu {
	width: 90rpx;
	height: 32rpx;
	line-height: 32rpx;
	color: var(--h-color-white);
	background: var(--hr-error-color-6);
	border: 2rpx solid var(--h-color-white);
	border-radius: 200rpx;
	// box-shadow: 0 4rpx 8rpx 0 rgba(210, 1, 1, 0.5);
	box-shadow: 0 8rpx 40rpx 0r rgba(0, 0, 0, 0.06);
	border-radius: 24rpx;
	text-align: center;
	font-size: var(--hr-font-size-xxxs);
	position: absolute;
	z-index: 100;
	right: 5rpx;
	top: 5rpx;
}
</style>
