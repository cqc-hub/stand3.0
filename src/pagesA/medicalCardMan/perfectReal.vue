<template>
	<view>
		<g-form
			v-model:value="formData"
			@submit="formSubmit"
			@change="formChange"
			ref="gform"
		/>

		<view class="aa">
			{{ JSON.stringify(formData) }}
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
import { ref, nextTick, onMounted, computed } from 'vue';
import { PatientUtils, GStores } from '@/utils';
import { FormKey, tempList, pickTempItem } from './utils';

import api from '@/service/api';

const gStores = new GStores();
const gform = ref<any>('');
const formData = ref<BaseObject>({
	patientName: '',
	patientPhone: ''
});

const formList = pickTempItem([
	FormKey.medicalType,
	FormKey.patientName,
	FormKey.patientPhone,
	FormKey.verify
]);

const formSubmit = async ({ data }) => {
	const { result } = await api.getPatCardInfoByHospital(data);
	if (result) {
		const { jump, cardNumber, idCard, idType, patientSex } = result;
		const { patientPhone, patientName } = data;

		if (jump === 0) {
			const patientUtil = new PatientUtils();
			await patientUtil.registerUser({
				idCard,
				idType,
				patientPhone,
				patientName
			});

			patientUtil.getPatCardList();
		} else {
		}
	}
};

const formChange = ({ item, value }) => {
	console.log({
		item,
		value
	});
};

const btnDisabled = computed(() => {
	return !Object.values(formData.value).every((v) => v !== '');
});

onMounted(() => {
	const { userName, mobile } = gStores.userStore.cacheUser;
	// 只有支付宝有
	if (userName && mobile) {
		formData.value.patientName = userName;
		formData.value.patientPhone = mobile;

		formList.map((o) => {
			const { key } = o;
			if (['patientName', 'patientPhone'].includes(key)) {
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
