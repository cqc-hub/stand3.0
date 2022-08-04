<template>
	<view class="">
		<view class="container">
			<image
				class="user-avatar"
				:src="userSore.getAvatar"
				mode="widthFix"
			/>

			<view class="info">
				<text class="user-name">
					{{ userSore.name }}
				</text>
				<!-- {{ userSore.name }}dsahgdajs发个黄金时代风格复古大嫂尽快发货 -->

				<text class="user-id">就诊卡号：{{ userSore.patientId }}</text>
			</view>

			<view>{{ userSore.name }}cqc</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore, useMessageStore } from '@/stores';

const userSore = useUserStore();
</script>

<style lang="scss" scoped>
// @import '@/styles/index.scss';
.container {
	padding-top: 48upx;
	display: grid;
	grid-template-columns: 160upx 1fr 200upx;
	gap: 10upx;
	align-items: center;
	width: 100%;

	.user-avatar {
		width: 120upx;
		height: 120upx;
		margin-left: 20upx;
	}

	.info {
		max-width: 600upx;
		display: flex;
		flex-direction: column;
		.user-name {
			color: var(--h-color-dark);
			font-weight: var(--h-weight-1);
			font-size: var(--h-size-1);
		}

		.user-id {
			color: var(--h-color-grey);
			font-size: var(--h-size-2);

			white-space:nowrap;
		}
	}

	> view {
		border: 1px solid;
	}
}
</style>
