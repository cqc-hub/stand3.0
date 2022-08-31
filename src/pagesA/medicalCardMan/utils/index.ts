import type { TInstance } from '@/components/g-form/index';
import { cloneUtil } from '@/common';

/**
 * 完善、 新增就诊人页面
 */
// 修改值  需要单独修改 addMedical 页面的 prop
export const formKey = <const>{
	medicalType: 'medicalType',
	idType: 'idType',
	idCard: 'idCard',
	patientName: 'patientName',
	patientPhone: 'patientPhone',
	birthday: 'birthday',
	sex: 'sex',
	upName: 'upName',
	upIdCard: 'upIdCard',
	address: 'address',
	location: 'location',
	verify: 'verifyCode',
	defaultFalg: 'defaultFalg',
	nation: 'nation'
};

export type FormKey = typeof formKey;

export type TFormKeys = keyof FormKey;

export const tempList: TInstance[] = [
	{
		required: true,
		showSuffixArrowIcon: true,
		label: '就诊人类型',
		placeholder: '请选择',
		key: formKey.medicalType,
		field: 'select',
		options: [],
		autoOptions: 'patientTypeTerms',
		rowStyle: 'border-radius: 16rpx 16rpx 0 0;'
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '民族',
		placeholder: '请选择',
		key: formKey.nation,
		field: 'select',
		options: [],
		autoOptions: 'nationTerms'
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '证件类型',
		placeholder: '请选择',
		key: formKey.idType,
		field: 'select',
		options: [],
		autoOptions: 'idTypeTerms'
	},

	{
		required: true,
		label: '证件号码',
		field: 'input-text',
		placeholder: '请输入',
		key: formKey.idCard
	},

	{
		required: true,
		label: '真实姓名',
		field: 'input-text',
		placeholder: '请输入',
		key: formKey.patientName
	},

	{
		required: true,
		label: '手机号',
		field: 'input-text',
		placeholder: '请输入',
		key: formKey.patientPhone,
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
		key: formKey.birthday,
		field: 'time-picker',
		type: 'date',
		end: new Date().getTime()
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '性别',
		placeholder: '请选择',
		key: formKey.sex,
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
		placeholder: '请输入',
		key: formKey.upName
	},

	{
		required: true,
		label: '监护人证件号',
		field: 'input-text',
		placeholder: '请输入',
		key: formKey.upIdCard,
		labelWidth: '220rpx'
	},

	{
		required: true,
		showSuffixArrowIcon: true,
		label: '常住地址',
		placeholder: '请选择',
		key: formKey.address,
		field: 'address'
	},

	{
		required: true,
		label: '详细地址',
		field: 'input-text',
		placeholder: '具体到门牌号',
		key: formKey.location,
		rowStyle: 'border-radius: 0 0 16rpx 16rpx;'
	},

	{
		required: true,
		maxlength: 4,
		label: '验证码',
		field: 'input-verify',
		placeholder: '请输入',
		key: formKey.verify,
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
		key: formKey.defaultFalg,
		label: '设为默认就诊人',
		labelWidth: '260rpx',
		rowStyle: 'margin-top: 16rpx; border-radius: 16rpx;'
	}
];

export const pickTempItem = function <T = TFormKeys>(
	keys: TFormKeys[]
): TInstance[] {
	const dKeys = keys.map((key) => formKey[key]);

	return cloneUtil<TInstance[]>(tempList)
		.filter((item) => dKeys.includes(<any>item.key))
		.sort((a, b) => {
			const aIndex = dKeys.findIndex((key) => key === a.key);
			const bIndex = dKeys.findIndex((key) => key === b.key);
			return aIndex - bIndex;
		});
};

/**
 * 就诊人详情页面
 */
export const patCardDetailFormKey = <const>{
	patientType: 'patientType',
	patientName: 'patientName',
	idCard: 'idCard',
	patientPhone: 'patientPhone',
	nation: 'nation',
	address: 'address',
	patientSex: 'patientSex',
	upName: 'upName',
	upIdCard: 'upIdCard',
	defaultFlag: 'defaultFlag'
};

export type PatCardKeys = keyof typeof patCardDetailFormKey;

export const patCardDetailTempList: TInstance[] = [
	{
		label: '就诊人类型',
		key: patCardDetailFormKey.patientType,
		field: 'select',
		disabled: true,
		isForShow: true,
		options: [],
		autoOptions: 'patientTypeTerms'
	},

	{
		label: '真实姓名',
		field: 'input-text',
		disabled: true,
		key: patCardDetailFormKey.patientName,
		isForShow: true
	},

	{
		label: '证件号码',
		field: 'input-text',
		disabled: true,
		key: patCardDetailFormKey.idCard,
		isForShow: true
	},

	{
		label: '手机号',
		field: 'input-text',
		disabled: true,
		key: patCardDetailFormKey.patientPhone,
		isForShow: true
	},

	{
		label: '民族',
		field: 'input-text',
		key: patCardDetailFormKey.nation,
		disabled: true,
		isForShow: true
	},

	{
		label: '详细地址',
		field: 'input-text',
		key: patCardDetailFormKey.address,
		disabled: true,
		isForShow: true
	},

	{
		label: '性别',
		field: 'input-text',
		key: patCardDetailFormKey.patientSex,
		disabled: true,
		isForShow: true
	},

	{
		label: '监护人姓名',
		field: 'input-text',
		key: patCardDetailFormKey.upName,
		disabled: true,
		isForShow: true
	},

	{
		label: '监护人身份证号',
		field: 'input-text',
		key: patCardDetailFormKey.upIdCard,
		labelWidth: '260rpx',
		disabled: true,
		isForShow: true
	},

	{
		field: 'switch',
		key: patCardDetailFormKey.defaultFlag,
		label: '设为默认就诊人',
		labelWidth: '260rpx',
		rowStyle: 'margin-top: 16rpx;'
	}
];

/**
 * 电子就诊卡详情页面
 */
export const patCardDetailList: TInstance[] = [
	{
		label: '姓名',
		key: 'patientName',
		field: 'input-text',
		disabled: true,
		isForShow: true
	},

	{
		label: '院内ID/卡号',
		key: 'patientId',
		field: 'input-text',
		disabled: true,
		rowStyle: 'border-radius: 0 0 16rpx 16rpx;',
		labelWidth: '200rpx',
		isForShow: true
	}
];
