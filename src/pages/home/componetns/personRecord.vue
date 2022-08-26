<template>
	<view class="">
		<view class="container">
			<image
				class="user-avatar"
				:src="userSore.getAvatar"
				mode="widthFix"
			/>

			<view class="info">
				<block v-if="globalStore.isLogin">
					<text class="user-name animate__animated animate__fadeIn">
						{{ userSore.name || userSore.cellPhoneNum }}
					</text>

					<text
						class="user-id text-ellipsis animate__animated animate__fadeIn"
					>
						就诊卡号：{{ userSore.patientId }}
					</text>
				</block>
				<block v-else>
					<!-- #ifdef MP-ALIPAY -->
					<button
						@click="aliLogin"
						class="user-name login-btn animate__animated animate__fadeIn"
					>
						请登录
					</button>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<button
						open-type="getPhoneNumber"
						@getphonenumber="wxLogin"
						class="user-name login-btn animate__animated animate__fadeIn"
					>
						请登录
					</button>
					<!-- #endif -->
				</block>
			</view>

			<view
				v-if="globalStore.isLogin"
				class="user-out animate__animated animate__slideInRight"
			>
				<view @click="outLogin" class="out-btn">退出登录</view>
			</view>
		</view>

		<view
			:class="`record-container ${
				recordList.length === 1 && 'record-container-row1'
			}`"
		>
			<view
				v-for="(record, i) in recordList"
				:key="i"
				:style="{
					'background-image': `url(${backImg[i]})`,
					'background-color': recordColors[i]
				}"
				:class="`record-item ${recordList.length === 1 && 'cr-center'}`"
				@tap="gotopath(record)"
			>
				<view class="record-label">
					<text>{{ record.title }}</text>
					<view
						v-if="recordList.length === 1"
						class="iconfont icon-size"
					>
						&#xe6a6;
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGlobalStore, useUserStore } from '@/stores';

import { aliLogin, wxLogin, outLogin, ServerStaticData } from '@/utils';
import global from '@/config/global';
import { useCommonTo } from '@/common/checkJump';

const userSore = useUserStore();
const globalStore = useGlobalStore();

const recordList = ref<IRoute[]>([]); //就医凭证

const jzIcon = global.BASE_IMG + 'v3-my-jzk.png';
const ybIcon = global.BASE_IMG + 'v3-my-pz.png';

onMounted(() => {
	getHomeConfig();
});

//获取配置数据
const getHomeConfig = async () => {
	const homeConfig = await ServerStaticData.getHomeConfig();
	if (homeConfig) {
		recordList.value = homeConfig[4].functionList;
	}
};

const gotopath = (item) => {
	useCommonTo(item);
};
// const recordList = ref([
// 	{
// 		title: '就诊卡二维码',
// 		path: '/xxx',
// 		query: {},
// 		iconfont: global.BASE_IMG + 'v3-my-jzk.png'
// 	},

// 	{
// 		// isNet: true,
// 		title: '医保电子凭证',
// 		path: 'https://xx',
// 		query: {},
// 		iconfont: global.BASE_IMG + 'v3-my-pz.png'
// 	}
// ]);

const backImg = [jzIcon, ybIcon];
const recordColors = ['#296FFF', '#00b39e'];
</script>

<style lang="scss" scoped>
.container {
	padding-top: 16upx;
	display: grid;
	grid-template-columns: 160upx 1fr 160upx;
	gap: 10upx;
	align-items: center;
	width: 100%;

	.user-avatar {
		width: 120upx;
		height: 120upx;
		margin: 0 35upx;
		border-radius: 60upx;
		border: 3rpx solid var(--hr-neutral-color-1);
	}

	.info {
		max-width: 370upx;
		display: flex;
		flex-direction: column;
		margin-left: 20upx;
		.user-name {
			color: var(--hr-neutral-color-10);
			font-weight: var(--h-weight-1);
			font-size: var(--hr-font-size-xxl);
		}

		.user-id {
			color: var(--hr-neutral-color-8);
			font-size: var(--hr-font-size-xs);
			margin-top: 10upx;
		}

		.login-btn {
			border: none !important;
			background-color: transparent;
			box-shadow: none !important;
			& button,
			& uni-button:after,
			& button:after {
				border: none !important;
				background-color: transparent;
				box-shadow: none !important;
			}
		}

		button {
			margin-left: 0;
			text-align: left;
		}

		button:after {
			border: none !important;
			background-color: transparent;
			box-shadow: none !important;
		}
	}

	.user-out {
		height: 100%;
		// display: flex;
		justify-content: flex-end;

		.out-btn {
			background-color: var(--hr-brand-color-2);
			border-radius: 32upx 0px 0px 32upx;
			text-align: center;
			padding: 10upx;
			// margin-right: 30upx;
			white-space: nowrap;
			color: var(--hr-neutral-color-10);
			font-size: var(--hr-font-size-xs);
		}
	}
}

.record-container {
	margin: 48upx 0;

	display: flex;
	gap: 16upx;
	height: 160upx;

	.record-item {
		flex: 1;
		height: 100%;
		color: var(--h-color-white);
		border-radius: 16upx;
		background-size: 200upx;
		background-repeat: no-repeat;
		background-position: right 0 bottom 0;
		font-size: var(--hr-font-size-base);

		.record-label {
			margin-top: 48upx;
			padding-left: 24upx;
			display: flex;
			align-items: center;

			.icon-size {
				margin-left: 20upx;
				font-size: var(--hr-font-size-base);
				opacity: 0.6;
			}
		}
	}
}

.record-container-row1 {
	height: 120upx;

	.record-item {
		display: flex;
		align-items: center;
		.record-label {
			margin-top: 0;
			padding-left: 44upx;
		}
	}
}
</style>
