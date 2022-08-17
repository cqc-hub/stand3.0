<template>
	<view>
		<g-form
			v-model:value="formData"
			@submit="formSubmit"
			@change="formChange"
			ref="gform"
		/>

		<!-- <view class="aa">
			{{ JSON.stringify(formData) }}
		</view> -->

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
import { ref, onMounted, computed } from 'vue';
import { PatientUtils, GStores } from '@/utils';
import { FormKey, pickTempItem, formKey, TFormKeys } from './utils';
import { joinQuery } from '@/common';

import api from '@/service/api';

const patientUtil = new PatientUtils();
const gStores = new GStores();
const gform = ref<any>('');
const formData = ref<BaseObject>({
	patientName: '大钢炮',
	patientPhone: '13868529891',
	[formKey.verify]: '2313',
	[formKey.medicalType]: '-1',
	[formKey.defaultFalg]: true
});

const formList = pickTempItem([
	'medicalType',
	'patientName',
	'patientPhone',
	'verify',
	'defaultFalg'
]);

const formSubmit = async ({ data }) => {
	try {
		const { result } = await api.getPatCardInfoByHospital(data);
		if (result) {
			const { jump, cardNumber, idCard, idType, patientSex } = result;
			const { patientPhone, patientName } = data;

			if (jump === 0) {
				await patientUtil.registerUser({
					idCard,
					idType,
					patientPhone,
					patientName
				});
			} else {
				uni.navigateTo({
					url: joinQuery('/pagesA/medicalCardMan/addMedical', data)
				});
			}
		}
	} catch (error) {
		const err = error as { respCode: number; message: string };

		if (err) {
			const { respCode, message } = err;

			if (respCode === 999301) {
				gStores.messageStore.showMessage(message, 0, {
					maskClickCallBack: () => {
						uni.navigateTo({
							url: joinQuery(
								'/pagesA/medicalCardMan/addMedical',
								data
							)
						});
					}
				});
			}
		}
	}
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

onMounted(() => {
	const { userName, mobile } = gStores.userStore.cacheUser;
	// 只有支付宝有
	if (userName && mobile) {
		formData.value[formKey.patientName] = userName;
		formData.value[formKey.patientPhone] = mobile;

		formList.map((o) => {
			const { key } = o;
			if (
				[formKey.patientName, formKey.patientPhone].includes(key as any)
			) {
				o.disabled = true;
			}
		});
	}

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
.aa {
	word-break: break-all;
}
</style>
