<template>
	<view class="page">
		<view class="card-content">
			<view class="card-header">电子就诊卡</view>

			<view class="card-body">
				<view class="card-qrcode">
					<w-barcode :options="options" />

					<view class="card-code">{{ options.code }}</view>

					<w-qrcode :options="options" />
				</view>

				<g-form v-model:value="formData" ref="gform" />
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { GStores, PatientUtils } from '@/utils';
import { patCardDetailList } from './utils';

const gform = ref<any>('');
const gStore = new GStores();
const { clickPat } = storeToRefs(gStore.userStore);

const options = ref({
	// 二维码
	size: 320,
	// 二维码log配置 非必传
	// img: {
	// 	src: '/static/logo.png', //可以是本地的或者网络 建议统一使用 uni.getImageInfo 获取图片地址
	// 	size: 60, // 图片大小
	// 	degree: 15, // 圆角大小 如果type为round生效
	// 	type: 'round', //图片展示类型 默认none 可选值  round圆角  circle圆 如果为round 可以传入degree设置圆角大小 默认 5
	// 	color: '#ffffff', //图片周围的白色边框
	// 	width: 8 //图片周围白色边框的宽度 默认5
	// }

	// 条形码
	width: 600, // 宽度 单位rpx
	height: 184, // 高度 单位rpx

	code: clickPat.value.patientId
});

const formData = ref({
	...clickPat.value
});

onMounted(() => {
	gform.value.setList(patCardDetailList);
});
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	background-color: var(--hr-brand-color-6);
}

.card-content {
	-webkit-animation-name: fadeInRight;
	animation-name: fadeInRight;

	animation-duration: 0.5s;

	padding: 32rpx;
	.card-header {
		background: linear-gradient(180deg, #53a8ff, var(--hr-brand-color-6));
		border: 1px solid #548cff;
		border-radius: 16rpx 16rpx 0 0;
		font-weight: 600;
		color: var(--h-color-white);
		padding: 32rpx;
	}

	.card-body {
		background-color: var(--hr-neutral-color-1);
		border-radius: 0 0 16rpx 16rpx;
		background-color: #fff;

		.card-qrcode {
			padding-top: 40rpx;
			padding-bottom: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.card-code {
				color: var(--hr-neutral-color-7);
				font-size: var(--hr-font-size-xs);
				padding-top: 16rpx;
				padding-bottom: 40rpx;
			}
		}
	}
}
</style>
