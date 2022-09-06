<template>
	<view>
		<view class="container">
			<g-form
				v-model:value="formData"
				@submit="formSubmit"
				@change="formChange"
				@address-change="addressChange"
				bodyBold
				ref="gform"
			/>
		</view>

		<g-message />
		<view class="footer">
			<button
				@click="gform.submit"
				:class="{
					'btn-disabled': btnDisabled
				}"
				class="btn btn-primary"
			>
				保存
			</button>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, withDefaults } from 'vue';
import { PatientUtils, GStores, routerJump } from '@/utils';
import { FormKey, pickTempItem, formKey, TFormKeys } from './utils';
import { joinQuery } from '@/common';
import { onReady } from '@dcloudio/uni-app';

import api from '@/service/api';

const props = withDefaults(
	defineProps<{
		pageType: 'edit' | 'add';
	}>(),
	{
		pageType: 'add'
	}
);
const patientUtil = new PatientUtils();
const gStores = new GStores();
const gform = ref<any>('');
const formData = ref<BaseObject>({
	senderName: '大钢炮22',
	senderPhone: '13868529891',
	address: '123',
	detailedAddress: '',
	postcode: '123',
	defaultFalg: '1'
});
const addressChoose = {
	province: '',
	city: '',
	county: ''
};

const formList = pickTempItem([
	'senderName',
	'senderPhone',
	'address',
	'detailedAddress',
	'postcode',
	'defaultFalg'
]);

const addressChange = (e) => {
	const { value } = e;
	const [addressProvince, addressCity, addressCounty] = value;
	addressChoose.province = addressProvince.text;
	addressChoose.city = addressCity.text;
	addressChoose.county = addressCounty.value;
};

const formSubmit = async ({ data }) => {
	console.log(999, data);

	const { result } = await api.addExpressAddress({
		herenId: gStores.globalStore.herenId,
		...data,
		...addressChoose
	});
};

const formChange = ({ item, value }) => {};

const btnDisabled = computed(() => {
	let isDisabled = false;
	const formKeys = formList.map((o) => o.key);
	Object.entries(formData.value).map(([key, value]) => {
		if (formKeys.includes(key) && value === '') {
			isDisabled = true;
		}
	});
	return isDisabled;
});

onReady(() => {
	if (props.pageType === 'edit') {
		uni.setNavigationBarTitle({
			title: '编辑收货地址'
		});
	}
});

onMounted(() => {
	// const { userName, mobile } = gStores.userStore.cacheUser;
	// // 只有支付宝有
	// if (userName && mobile && props.pageType === 'perfectReal') {
	// 	formData.value[formKey.patientName] = userName;
	// 	formData.value[formKey.patientPhone] = mobile;
	// 	formList.map((o) => {
	// 		const { key } = o;
	// 		if (
	// 			[formKey.patientName, formKey.patientPhone].includes(key as any)
	// 		) {
	// 			o.disabled = true;
	// 		}
	// 	});
	// }
	gform.value.setList(formList);
});
</script>

<style lang="scss" scoped>
.footer {
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
	background-color: var(--h-color-white);
	padding: 32rpx 32rpx 68rpx;
}
</style>
