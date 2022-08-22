<template>
	<view class="">
		<view class="add-pat-box" @click="addPatPage">
			<view class="add-pat g-flex-rc-cc">
				<view class="iconfont icon-resize">&#xe6ab;</view>
				<text>添加就诊人</text>
			</view>
		</view>

		<pat-List
			:list="gStore.userStore.patList"
			@profile-click="profileClick"
			@card-click="cardClick"
		/>
	</view>
</template>

<script lang="ts" setup>
import patList from './components/patList.vue';

import { joinQuery } from '@/common';
import { GStores, PatientUtils } from '@/utils';
import { IPat } from '@/stores';

const gStore = new GStores();

const addPatPage = () => {
	uni.navigateTo({
		url: '/pagesA/medicalCardMan/perfectReal'
	});
};

const profileClick = (pat: IPat) => {
	gStore.userStore.updatePatClick(pat);
	uni.navigateTo({
		url: '/pagesA/medicalCardMan/medicalCardDetail'
	});
};

const cardClick = (pat: IPat) => {
	gStore.userStore.updatePatClick(pat);
	uni.navigateTo({
		url: '/pagesA/medicalCardMan/electronicMedicalCard'
	});
};
</script>

<style lang="scss" scoped>
.add-pat-box {
	margin: 16rpx 32rpx;
	padding: 40rpx 0;
	background-color: var(--h-color-white);
	border-radius: 16rpx;
	color: var(--hr-brand-color-6);
	font-weight: var(--h-weight-2);

	.icon-resize {
		font-size: 48rpx;
		margin-right: 10rpx;
	}
}
</style>
