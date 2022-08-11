<template>
	<view class="login-center">
		<g-message />
		<view class="top-bg" />

		<view @click="goRoute">2333</view>

		<personRecord />
		<view class="my-menu">
			<view class="list">
				<view class="title">我的订单</view>
				<g-grid />
			</view>
			<view class="list">
				<view class="title">我的服务</view>
				<g-grid />
			</view>
			 <view class="list">
			 	<view class="title">我的工具</view>
			 	<g-grid />
			 </view>

		</view>
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { useUserStore, useMessageStore } from '@/stores';
import { onLoad } from '@dcloudio/uni-app';
import personRecord from './componetns/personRecord.vue';

const messageStore = useMessageStore();

const msg = () => {
	messageStore.showMessage('dskad的苦瓜撒接口都会感111慨', 1000);
};

const goRoute = function() {
	uni.navigateTo({
		url: '/pagesA/medicalCardMan/addMedical'
	})
}
</script>

<style lang="scss" scoped>
.login-center {
	width: 100%;
	height: 100vh;
	position: relative;

	.top-bg {
		height: 500upx;
		width: 100%;
		box-shadow: 0 200upx 500upx 30upx #13b8ff32;
		position: absolute;
		top: -500upx;
		pointer-events: none;
	}
}


.my-menu {
	padding: 0 32rpx;
	.list {
		background: var(--h-color-white);
		border: 2px solid #f3f3f3;
		border-radius: 16rpx;
		box-shadow: 0px 8rpx 24rpx 0px rgba(0, 0, 0, 0.05);
		padding-bottom: 12rpx;
		margin-bottom: 16rpx;

		.title {
			padding: 32rpx 32rpx 16rpx 32rpx;
			color: var(--hr-neutral-color-10);
			font-weight: var(--h-weight-2);
		}
	}
}
</style>
