<template>
	<view class="">
		<g-form v-model:value="formData" ref="gform" />
	</view>
</template>

<script lang="ts" setup>
import { nextTick, ref, onMounted } from 'vue';
import { patCardDetailTempList, PatCardKeys } from './utils';
import { GStores, PatientUtils } from '@/utils';

type PagePropType = Record<PatCardKeys, any>;

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

	console.log(formData.value);
	nextTick(() => {
		gform.value.setList(formList);
	});
});
</script>

<style lang="scss" scoped></style>
