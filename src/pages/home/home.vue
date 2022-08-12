<template>
	<view class="homePage">
		<view>
			<g-search :searchPlaceholder="searchPlaceholder"></g-search>
		</view>
		<view class="card">
			<view class="top-card flex-normal-between">
				<view class="flex-normal">
					<view class="iconfont icon-size">&#xe6a7;</view>
					<text>张三三</text>
				</view>
				<view class="switchPatient" @tap="chooseAction">
					切换就诊人
				</view>
			</view>
			<view class="top-menu">
				<view class="box">
					<g-grid :list="topMenuList" :type="1" />
				</view>
				<view class="notice flex-normal">
					<text class="icon-font img_announcement icon-size"></text>
					<text>浙江省人民医院互联网医院使用指南指南…</text>
				</view>
			</view>
		</view>
		<view class="banner-menu">
			<homeBanner />
		</view>
		<view class="fun-list">
			<homeMenu />
		</view>
		<choose-pat-action ref="actionSheet" />
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import homeBanner from './componetns/homeBanner.vue';
import homeMenu from './componetns/homeMenu.vue';
import ChoosePatAction from '@/components/g-choose-pat/choose-pat-action.vue';
import { useViewConfigStore } from '@/stores';

import { onLoad } from '@dcloudio/uni-app';
import api from '@/service/api';

// 就诊人
const actionSheet = ref<InstanceType<typeof ChoosePatAction>>();
const chooseAction = () => {
	if (actionSheet.value) {
		actionSheet.value.show();
	}
};

const viewConfigStore = useViewConfigStore();

const searchPlaceholder = '搜索科室、医生或疾病';
const topMenuList = [
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

onLoad(() => {
	// viewConfigStore.updateHomeConfig();
});
</script>

<style lang="scss" scoped>
.homePage {
	padding: 16rpx 32rpx;

	.card {
		margin-top: var(--h-margin-24);
		// color:var(--h-color-white)

		// background-color: #dfe9ff;
		.top-card {
			padding-top: var(--h-margin-24);
			margin: 0 26rpx;
			position: relative;
			box-sizing: border-box;

			// width: 100%;
			border: 2rpx solid #dfe9ff;
			backdrop-filter: blur(30rpx);
			border-radius: 24rpx;

			height: 100rpx;

			:after {
				width: 100%;
				height: 112rpx;
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
				content: '';
				// border-radius: 24rpx;

				border-radius: 24rpx 24rpx 15% 15%;

				background: var(--hr-brand-color-6);
			}

			.icon-size {
				font-size: var(--h-iconfont-60);
				margin-left: 56rpx;
				display: inline-block;
				color: var(--h-color-white);
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
				// margin-right: 56rpx;
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
				color: var(--hr-brand-color-6);
				line-height: 64rpx;
				text-align: center;
			}
		}

		.top-menu {
			background: #f2f6ff;
			border: 2rpx solid #dfe9ff;
			border-radius: 24rpx;
			box-shadow: 0px 8rpx 40rpx 0rpx rgba(0, 0, 0, 0.06);

			.box {
				padding: 60rpx 0 40rpx 0;
			}
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
				// margin-top: rpx;
			}

			text {
				color: var(--hr-neutral-color-9);
				font-size: var(--hr-font-size-xs);
				display: inline-block;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				// width: 100%;
			}
		}
	}

	.banner-menu {
		margin-top: var(--h-margin-24);
	}

	.fun-list {
		margin-top: var(--h-margin-24);
	}
}
</style>
+
