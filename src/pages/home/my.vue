<template>
	<view class="login-center">
		<view @click="ttt">2333</view>
		<scroll-view class="scroll-container" scroll-y>
			<ls-skeleton
				:skeleton="skeletonProps.skeleton"
				:loading="skeletonProps.loading"
			>
				<view class="top-bg" />
				<personRecord />
				<view class="my-menu">
					<view class="list">
						<view class="title">我的订单</view>
						<g-grid :list="menu1List" />
					</view>
					<view class="list">
						<view class="title">我的服务</view>
						<g-grid :list="menu2List" />
					</view>
					<view class="list">
						<view class="title">我的工具</view>
						<g-grid :list="menu3List" />
					</view>
				</view>
			</ls-skeleton>
		</scroll-view>

		<home-Tabbar />
		<g-message />
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref, nextTick, onMounted } from 'vue';
import { useUserStore, useMessageStore } from '@/stores';
import { onLoad } from '@dcloudio/uni-app';
import personRecord from './componetns/personRecord.vue';
import homeTabbar from './componetns/homeTabbar.vue';
import { ServerStaticData } from '@/utils';

//骨架屏配置
const skeletonProps = {
	loading: true,
	skeleton: [
		'circle+line-sm*2',
		56,
		'card+card',
		24,
		'line-sm',
		'card+card+card+card',
		16,
		'line-sm',
		'card+card+card+card',
		16,
		'line-sm',
		'card+card+card+card'
	]
};

const props = defineProps<{
	isWarningLogin?: '1';
}>();

const messageStore = useMessageStore();

const menu1List = ref([]); //我的订单
const menu2List = ref([]); //我的服务
const menu3List = ref([]); //我的工具

onMounted(() => {
	getHomeConfig();
	if (props.isWarningLogin) {
		messageStore.showMessage('未登录,请先登陆', 1000);
	}
});
//获取配置数据
const getHomeConfig = async () => {
	skeletonProps.loading = true;
	const homeConfig = await ServerStaticData.getHomeConfig();
	if (homeConfig) {
		menu1List.value = homeConfig[5].functionList;
		menu2List.value = homeConfig[6].functionList;
		menu3List.value = homeConfig[7].functionList;
		skeletonProps.loading = false;
	}
};

const ttt = () => {
	uni.reLaunch({
		url: '/pagesA/medicalCardMan/perfectReal?pageType=perfectReal'
	});
};
</script>

<style lang="scss" scoped>
.login-center {
	background-color: var(--h-color-white);
	width: 100%;
	height: 100vh;
	position: relative;
	flex-direction: column;

	display: flex;

	.scroll-container {
		height: 1px;
		flex: 1;
	}

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
	// padding: 0 32rpx;
	margin-bottom: 188rpx;
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
.page {
	margin: 32rpx;
}
</style>
