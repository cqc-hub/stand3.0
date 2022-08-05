<template>
	<view class="login-center">
		<g-message />
		<view class="top-bg" />

		<personRecord />

		<uni-group mode="card">
			<view @click="msg">分组内容</view>
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
import { onLoad } from '@dcloudio/uni-app';
import personRecord from './componetns/personRecord.vue';

const messageStore = useMessageStore();

const msg = () => {
	messageStore.showMessage('dskad的苦瓜撒接口都会感111慨', 1000);
};

onLoad((opt) => {
	messageStore.showMessage('dskad的苦瓜撒接口都会感慨');
	setTimeout(() => {
		messageStore.showMessage('都会感慨', 2000);
	}, 2000);
});
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
