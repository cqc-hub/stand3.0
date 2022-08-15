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

interface ISelectInstance extends IBaseInstance {
	field: 'select';
	options: ISelectOptions[];
}

interface IAddressInstance extends IBaseInstance {
	field: 'address';
	options?: ISelectOptions[];
}

export type TInstance =
	| IInputInstance
	| ISelectInstance
	| IAddressInstance
	| IInputVerifyInstance
	| ISwitchInstance;
