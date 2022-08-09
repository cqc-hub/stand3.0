<template>
	<view class="choose-pat">
		<view class="container">
			<image
				class="user-avatar"
				:src="userSore.getAvatar"
				mode="widthFix"
			/>

			<view class="user-info text-ellipsis">
				{{
					`${userSore.name}  233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234233213235gdgdf4234`
				}}
			</view>

			<text :class="`icon-font icon-resize ico_arrow`" />
		</view>
	</view>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';

const userSore = useUserStore();
</script>

<style lang="scss" scoped>
.choose-pat {
	&::after {
		content: '';
		display: block;
		width: 100%;
		height: 1rpx;
		background-color: #eee;
	}
}
.container {
	padding: 20rpx 40rpx;
	padding-right: 20rpx;
	background-color: var(--h-color-white);

	display: flex;
	align-items: center;

	.user-avatar {
		width: 48rpx;
		border-radius: 100px;
		margin-right: 20rpx;
	}

	.user-info {
		flex: 1;
		width: 1px;
	}

	.icon-resize {
		width: 48rpx;
		height: 48rpx;
	}
}
</style>
