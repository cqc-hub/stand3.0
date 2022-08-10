<template>
	<view class="menu-list">
		<view class="menu-tap">
			<text class="active">门诊就医</text>
			<text>门诊就医</text>
			<text>门诊就医</text>
		</view>
		<view>
			<g-grid :list="homeGrid" />
		</view>
	</view>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue';
interface IhomeMenu {
	typeName: string;
	functionList: IRoute[];
}
const props = withDefaults(
	defineProps<{
		list: IhomeMenu[];
	}>(),
	{
		list: () => [
			{
				typeName: '',
				functionList: []
			}
		]
	}
);

const homeGrid = [
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	},
	{
		title: '预约挂号',
		url: '/xxx',
		iconfont: 'ico_sy_calendar1'
	}
];
</script>

<style scoped lang="scss">
.menu-list {
	background: var(--h-color-white);
	border: 2rpx solid #f3f3f3;
	box-shadow: 0px 8rpx 24rpx 0px rgba(0, 0, 0, 0.05);
	.menu-tap {
		height: 88rpx;
		background: var(--hr-neutral-color-1);
		border-radius: 16rpx 16rpx 0px 0px;
		text {
			display: inline-block;
			font-size: var(--hr-font-size-base);
			width: 192rpx;
			line-height: 88rpx;
			color: var(--hr-neutral-color-7);
			font-weight: var(--h-weight-2);
			text-align: center;
		}
		.active {
			color: var(--hr-neutral-color-10);
			background: var(--h-color-white);
			// border: 2rpx solid #f3f3f3;
			box-shadow: 0px 84px 24rpx 0px rgba(0, 0, 0, 0.05);
			// padding-bottom: 8rpx;
		}
	}
}
</style>
