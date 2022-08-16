type TInputType =
	| 'text'
	| 'textarea'
	| 'password'
	| 'number'
	| 'idcard'
	| 'digit';

export interface ISelectOptions {
	label: string;
	value: any;

	children?: ISelectOptions[];
}

export interface IRule {
	rule: RegExp;
	message: string;
}

/**
 * rowStyle: 'margin-bottom: 16rpx;'
 */
interface IBaseInstance {
	key: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	emptyMessage?: string;
	disabled?: boolean;
	rule?: IRule | IRule[];
	showSuffixArrowIcon?: boolean;
	rowStyle?: string;
	labelWidth?: string;
}

interface IInputInstance extends IBaseInstance {
	field: 'input-text';
	inputType?: TInputType;
	maxlength?: number;
}

export interface ISwitchInstance extends Omit<IBaseInstance, 'placeholder'> {
	field: 'switch';
}

/**
 * 一组最多一个验证码
 *
 * verifySecond  倒计时 s
 */
export interface IInputVerifyInstance extends Omit<IInputInstance, 'field'> {
	field: 'input-verify';
	verifyBtnText: string;
	verifySecond: number;
}

/**
 * @autoOptions 快速获取服务器上的静态列表数据
 */
interface ISelectInstance extends IBaseInstance {
	field: 'select';
	options: ISelectOptions[];
	autoOptions?:
		| 'sysTerms'
		| 'nationTerms'
		| 'patientTypeTerms'
		| 'idTypeTerms';
}

interface IAddressInstance extends IBaseInstance {
	field: 'address';
	options?: ISelectOptions[];
}

interface ITimePickerInstance extends IBaseInstance {
	field: 'time-picker';
	type: 'date' | 'daterange' | 'datetime' | 'datetimerange';
	start?: string | number;
	end?: string | number;
}

export type TInstance =
	| IInputInstance
	| ISelectInstance
	| IAddressInstance
	| IInputVerifyInstance
	| ITimePickerInstance
	| ISwitchInstance;
