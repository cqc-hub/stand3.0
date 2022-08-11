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

const gform = ref<any>('');
const formData = ref<BaseObject>({
	name: '',
	isDefault: true,
	medicalType: 233
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
				rule: /[\w\W]{3,}/,
				message: 'length 3'
			},
			{
				rule: /cqc/,
				message: 'not cqc'
			}
		]
	},

	{
		required: true,
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
		maxlength: 4,
		label: '验证码',
		field: 'input-verify',
		placeholder: '请输入验证码',
		key: 'verify',
		verifyBtnText: '获取验证码',
		inputType: 'number',
		verifySecond: 60,
		rule: {
			message: '验证码必须是数字',
			rule: /\d+/
		},
		rowStyle: 'margin-bottom: 16rpx;'
	},

	{
		field: 'switch',
		key: 'isDefault',
		label: '设为默认就诊人',
		labelWidth: '260rpx'
	}
];

const formSubmit = ({ data }) => {
	console.log(data, 'success');
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
