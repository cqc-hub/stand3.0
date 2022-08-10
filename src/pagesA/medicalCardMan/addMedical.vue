<template>
	<view class="">
		{{ formData }}
		<g-form v-model:value="formData" ref="gform" />

		<view @tap="testSubmit">ttt</view>
		<g-message />
	</view>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue';
import type { TInstance } from '@/components/g-form/index';
import { useGlobalStore, useUserStore, useMessageStore } from '@/stores';

const gform = ref();
const formData = ref<BaseObject>({
	name: '233'
});

const formList: TInstance[] = [
	{
		required: true,
		label: '真实姓名',
		field: 'input-text',
		placeholder: '请输入真实姓名',
		key: 'name',
		rule: [
			{
				rule: /233/,
				message: 'dsad'
			}
		]
	},

	{
		required: true,
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
	}
];

const testSubmit = () => {
	gform.value.submit();
};

onMounted(() => {
	gform.value.setList(formList);
});
</script>

<style lang="scss" scoped></style>
