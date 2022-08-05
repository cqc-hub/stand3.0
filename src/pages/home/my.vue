<template>
	<view class="login-center">
		<view class="top-bg" />

		<personRecord />

		<uni-group mode="card">
			<view>分组内容</view>
			<view>分组内容</view>
			<view>分组内容</view>
			<view>分组内容</view>
		</uni-group>

		<!-- <text class="re icon-font img_announcement"></text> -->
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { useUserStore, useMessageStore } from '@/stores';
import personRecord from './componetns/personRecord.vue';

const messageStore = useMessageStore();
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

.re {
	width: 100rpx;
	height: 50rpx;
}
</style>
