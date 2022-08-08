<template>
	<view class="">
		<view class="container">
			<image
				class="user-avatar"
				:src="userSore.getAvatar"
				mode="widthFix"
			/>

			<view class="info">
				<block v-if="isLogin">
					<text class="user-name">
						{{ userSore.name }}
					</text>

					<text class="user-id text-ellipsis">
						就诊卡号：{{ userSore.patientId }}
					</text>
				</block>
				<text v-else class="user-name">请登录</text>
			</view>

			<view v-if="isLogin" class="user-out">
				<view class="out-btn">退出登陆</view>
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
					'background-image': `url(${record.icon})`,
					'background-color': recordColors[i]
				}"
				:class="`record-item ${recordList.length === 1 && 'cr-center'}`"
			>
				<view class="record-label">
					<text>{{ record.label }}</text>
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
import { defineComponent, ref } from 'vue';
import { useUserStore, useMessageStore } from '@/stores';
import global from '@/config/global';

const userSore = useUserStore();

const recordList = ref<IRoute[]>([
	{
		label: '就诊卡二维码',
		url: '/xxx',
		query: {},
		icon: global.BASE_IMG + 'v3-my-jzk.png',
	},

	{
		isNet: true,
		label: '医保电子凭证',
		url: 'https://xx',
		query: {},
		icon: global.BASE_IMG + 'v3-my-pz.png',
	}
]);

const recordColors = ['#296FFF', '#00b39e'];

const isLogin = false;
</script>

<style lang="scss" scoped>
.container {
	padding-top: 48upx;
	display: grid;
	grid-template-columns: 160upx 1fr 160upx;
	gap: 10upx;
	align-items: center;
	width: 100%;

	.user-avatar {
		width: 120upx;
		height: 120upx;
		margin-left: 20upx;
	}

	.info {
		max-width: 370upx;
		display: flex;
		flex-direction: column;
		.user-name {
			color: var(--h-color-dark);
			font-weight: var(--h-weight-1);
			font-size: var(--h-size-48);
		}

		.user-id {
			color: var(--h-color-grey);
			font-size: var(--h-size-28);
		}
	}

	.user-out {
		height: 100%;
		// display: flex;
		justify-content: flex-end;

		.out-btn {
			background-color: var(--h-color-light-blue);
			border-radius: 32upx 0px 0px 32upx;
			text-align: center;
			padding: 10upx;
			// margin-right: 30upx;
			white-space: nowrap;
			color: var(--h-color-dark);
			font-size: var(--h-size-28);
		}
	}
}

.record-container {
	margin: 48upx 32upx;

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
		font-size: var(--h-size-32);

		.record-label {
			margin-top: 48upx;
			padding-left: 24upx;
			display: flex;
			align-items: center;

			.icon-size {
				margin-left: 20upx;
				font-size: var(--h-size-32);
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
