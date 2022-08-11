<template>
	<view class="">
		<g-form v-model:value="formData" @submit="formSubmit" ref="gform" />

		<view @tap="testSubmit">ttt</view>

		{{JSON.stringify(formData)}}
		<g-message />
	</view>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue';
import type { TInstance } from '@/components/g-form/index';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';

const gform = ref();
const formData = ref<BaseObject>({
	name: ''
});

const formList: TInstance[] = [
	{
		// required: true,
		label: '真实姓名',
		field: 'input-text',
		placeholder: '请输入真实姓名',
		key: 'name',
		rule: [
			{
				rule: /[\w\W]{3,}/,
				message: '长度3'
			},
			{
				rule: /cqc/,
				message: 'not cqc'
			}
		]
	},

	{
		// required: true,
		showSuffixArrowIcon: true,
		label: '就诊人类型',
		placeholder: '请选择',
		key: 'medicalType',
		field: 'select',
		options: [
			{
				label: 'type1',
				value: 233
			},
			{
				label: 'type2',
				value: 234
			}
		]
	},

	{
		required: true,
		label: '验证码',
		field: 'input-verify',
		placeholder: '请输入验证码',
		key: 'verify',
		verifyBtnText: '获取验证码',
		inputType: 'number',
		verifySecond: 5,
		rule: {
			message: '验证码必须是数字',
			rule: /\d+/
		}
	}
];

const testSubmit = () => {
	gform.value.submit();
};

const formSubmit = ({ data }) => {
	console.log(data, 'success');
};

onMounted(() => {
	gform.value.setList(formList);
});
</script>

<style lang="scss" scoped></style>
