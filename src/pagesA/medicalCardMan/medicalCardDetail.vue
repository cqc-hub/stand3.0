<template>
	<view class="">
		<g-form v-model:value="formData" ref="gform" />

		<xy-dialog
			title=""
			content="是否删除该就诊人"
			:show="isShow"
			@cancelButton="isShow = false"
			@confirmButton="isShow = false"
		/>

		<view @click="isShow = true" class="btn del-btn btn-primary">
			<view class="del-btn-label">删除就诊人</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { nextTick, ref, onMounted } from 'vue';
import { patCardDetailTempList, PatCardKeys } from './utils';
import { GStores, PatientUtils } from '@/utils';
import xyDialog from '@/components/xy-dialog/xy-dialog.vue';

type PagePropType = Record<PatCardKeys, any>;
const isShow = ref(false);

const gStore = new GStores();
const formData = ref<PagePropType>({} as PagePropType);
const gform = ref<any>('');
let formList = patCardDetailTempList;

onMounted(() => {
	const pat = gStore.userStore.clickPat;

	formData.value = {
		...pat,
		defaultFlag: pat.defaultFlag === '0' ? false : true
	};

	nextTick(() => {
		gform.value.setList(formList);
	});
});
</script>

<style lang="scss" scoped>
.del-btn {
	color: var(--hr-error-color-6);
	font-weight: 600;

	background-color: var(--h-color-white);
	display: flex;
	justify-content: center;
	margin-top: 16rpx;
	padding: 26rpx 0;
	border-bottom: 1rpx solid var(--hr-neutral-color-2);
	border-radius: 0;
}
</style>
