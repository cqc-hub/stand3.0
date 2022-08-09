<template>
	<view class="homePage">
		<view>
			<g-search :searchPlaceholder="searchPlaceholder"></g-search>
		</view>
		<view class="card">
			<view class="top-card flex-between">
				<view>
					<view class="iconfont icon-size">&#xe6a7;</view>
					<text>张三三</text>
				</view>
				<view class="switchPatient">切换就诊人</view>
			</view>
			<view class="top-menu">
				<uni-group mode="card">
					<g-grid :list="topMenuList" :type="1" />
				</uni-group>
			</view>
			<view class="notice flex-normal">
				<text class="icon-font img_announcement icon-size"></text>
				<text>浙江省人民医院互联网医院使用指南指南…</text>
			</view>
		</view>
		<view class="banner-menu"></view>
	</view>
</template>

<script setup lang="ts">
const searchPlaceholder = '搜索科室、医生或疾病';
const topMenuList = [
	{
		label: '预约挂号',
		url: '/xxx',
		icon: 'ico_sy_calendar1'
	},
	{
		label: '预约挂号',
		url: '/xxx',
		icon: 'ico_sy_calendar1'
	},
	{
		label: '预约挂号',
		url: '/xxx',
		icon: 'ico_sy_calendar1'
	},
	{
		label: '预约挂号',
		url: '/xxx',
		icon: 'ico_sy_calendar1'
	}
];
</script>

<style lang="scss" scoped>
.homePage {
	padding: 16rpx 32rpx;
	.card {
		margin-top: var(--h-margin-24);
		background-color: #dfe9ff;

		.top-card {
			padding-top: var(--h-margin-24);

			.icon-size {
				font-size: var(--h-iconfont-60);
				margin-left: 56rpx;
				display: inline-block;
			}

			text {
				font-size: var(--h-size-40);
				font-weight: var(--h-weight-2);
				text-align: left;
				color: var(--h-color-white);
				margin-left: 24rpx;
				line-height: 60rpx;
			}
			view.switchPatient {
				margin-right: 56rpx;
				width: 180rpx;
				height: 64rpx;
				background: linear-gradient(
					180deg,
					rgba(255, 255, 255, 0.9),
					rgba(255, 255, 255, 0.5)
				);
				border-radius: 200rpx 0 0 200rpx;
				font-size: var(--hr-font-size-xs);
				font-weight: 400;
				text-align: left;
				color: var(--hr-brand-color);
				line-height: 64rpx;
				text-align: center;
			}
		}
		.top-menu {
		}
		.notice {
			height: 78rpx;
			background: #fefefe;
			border-radius: 0 0 24rpx 24rpx;
			box-shadow: 0 2rpx 0 0 #dfe9ff inset;
			padding: 0 31rpx;

			.icon-size {
				width: 64rpx;
				height: 64rpx;
				margin-right: 16rpx;
			}
			text {
				color: var(--hr-neutral-color-9);
				font-size: var(--hr-font-size-xs);
			}
		}
	}
	.banner-menu {
		margin-top: var(--h-margin-24);
	}
}
</style>
+
