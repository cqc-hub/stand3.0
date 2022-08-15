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
import type { TInstance } from '@/components/g-form/index';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';
import { PatientUtils } from '@/utils';
import api from '@/service/api';

const props = defineProps<{
	name?: 'string';
}>();
const globalStore = useGlobalStore();
const userStore = useUserStore();
const gform = ref<any>('');
const formData = ref<BaseObject>({
	patientName: '',
	patientPhone: ''
});

const formList: TInstance[] = [
	// {
	// 	required: true,
	// 	showSuffixArrowIcon: true,
	// 	label: '就诊人类型',
	// 	placeholder: '请选择',
	// 	key: 'medicalType',
	// 	field: 'select',
	// 	options: globalStore.patientTypeTerms
	// },

	{
		required: true,
		label: '真实姓名',
		field: 'input-text',
		placeholder: '请输入真实姓名',
		key: 'patientName'
	},

	{
		required: true,
		label: '手机号',
		field: 'input-text',
		placeholder: '请输入手机号',
		key: 'patientPhone'
	}

	// {
	// 	required: true,
	// 	showSuffixArrowIcon: true,
	// 	label: '常驻地址',
	// 	placeholder: '请选择常驻地址',
	// 	key: 'address',
	// 	field: 'address'
	// },

	// {
	// 	required: true,
	// 	maxlength: 4,
	// 	label: '验证码',
	// 	field: 'input-verify',
	// 	placeholder: '请输入验证码',
	// 	key: 'verify',
	// 	verifyBtnText: '获取验证码',
	// 	inputType: 'number',
	// 	verifySecond: 60,
	// 	rule: {
	// 		message: '验证码必须是数字',
	// 		rule: /\d+/
	// 	},
	// 	rowStyle: 'margin-bottom: 16rpx;'
	// },

	// {
	// 	field: 'switch',
	// 	key: 'isDefault',
	// 	label: '设为默认就诊人',
	// 	labelWidth: '260rpx'
	// }
];

const formSubmit = async ({ data }) => {
	console.log(data, 'success');
	const { result } = await api.getPatCardInfoByHospital(data);
	if (result) {
		const { jump, cardNumber, idCard, idType, patientSex } = result;

		if (jump === 0) {
			const patientUtil = new PatientUtils();
			// await patientUtil.registerUser({
			// 	...result,
			// 	...data
			// });

			patientUtil.getPatCardList();
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
	const { userName, mobile } = userStore.cacheUser;
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
