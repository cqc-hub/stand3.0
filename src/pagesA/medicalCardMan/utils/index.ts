import type { TInstance } from '@/components/g-form/index';
import { cloneUtil } from '@/common';

export enum FormKey {
	medicalType = 'medicalType',
	idType = 'idType',
	idCard = 'idCard',
	patientName = 'patientName',
	patientPhone = 'patientPhone',
	birthday = 'birthday',
	sex = 'sex',
	upName = 'upName',
	upIdCard = 'upIdCard',
	address = 'address',
	location = 'location',
	verify = 'verify',
	defaultFalg = 'defaultFalg',
	nation = 'nation',
}

type TFormKeys = keyof typeof FormKey;

export const tempList: TInstance[] = [
	{
		required: true,
		showSuffixArrowIcon: true,
		label: '就诊人类型',
		placeholder: '请选择',
		key: FormKey.medicalType,
		field: 'select',
		options: [],
		autoOptions: 'patientTypeTerms'
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '民族',
		placeholder: '请选择',
		key: FormKey.nation,
		field: 'select',
		options: [],
		autoOptions: 'nationTerms'
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '证件类型',
		placeholder: '请选择',
		key: FormKey.idType,
		field: 'select',
		options: [],
		autoOptions: 'idTypeTerms'
	},

	{
		required: true,
		label: '证件号码',
		field: 'input-text',
		placeholder: '请输入真实姓名',
		key: FormKey.idCard
	},

	{
		required: true,
		label: '真实姓名',
		field: 'input-text',
		placeholder: '请输入真实姓名',
		key: FormKey.patientName
	},

	{
		required: true,
		label: '手机号',
		field: 'input-text',
		placeholder: '请输入手机号',
		key: FormKey.patientPhone,
		rule: [
			{
				message: '请确认手机号是否有误',
				rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
			}
		]
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '出生日期',
		placeholder: '请选择',
		key: FormKey.birthday,
		field: 'time-picker',
		type: 'date',
		end: new Date().getTime()
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '性别',
		placeholder: '请选择',
		key: FormKey.sex,
		field: 'select',
		options: [
			{
				label: '男',
				value: '男'
			},
			{
				label: '女',
				value: '女'
			}
		]
	},

	{
		required: true,
		label: '监护人姓名',
		field: 'input-text',
		placeholder: '请输入监护人姓名',
		key: FormKey.upName
	},

	{
		required: true,
		label: '监护人证件号',
		field: 'input-text',
		placeholder: '请输入监护人证件号',
		key: FormKey.upIdCard,
		labelWidth: '220rpx'
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '常住地址',
		placeholder: '请选择常住地址',
		key: FormKey.address,
		field: 'address'
	},

	{
		required: true,
		label: '详细地址',
		field: 'input-text',
		placeholder: '具体到门牌号',
		key: FormKey.location
	},

	{
		required: true,
		maxlength: 4,
		label: '验证码',
		field: 'input-verify',
		placeholder: '请输入验证码',
		key: FormKey.verify,
		verifyBtnText: '获取验证码',
		inputType: 'number',
		verifySecond: 60,
		rule: {
			message: '验证码必须是数字',
			rule: /\d+/
		}
	},

	{
		field: 'switch',
		key: FormKey.defaultFalg,
		label: '设为默认就诊人',
		labelWidth: '260rpx',
		rowStyle: 'margin-top: 16rpx;'
	}
];

export const pickTempItem = function (keys: TFormKeys[]): TInstance[] {
	return cloneUtil<TInstance[]>(tempList)
		.filter((item) => keys.includes(<TFormKeys>item.key))
		.sort((a, b) => {
			const aIndex = keys.findIndex((key) => key === a.key);
			const bIndex = keys.findIndex((key) => key === b.key);
			return aIndex - bIndex;
		});
};
