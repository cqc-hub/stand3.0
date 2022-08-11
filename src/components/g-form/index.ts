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
}

export interface IRule {
	rule: RegExp;
	message: string;
}

interface IBaseInstance {
	key: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	emptyMessage?: string;
	disabled?: boolean;
	rule?: IRule | IRule[];
}

interface IInputInstance extends IBaseInstance {
	field: 'input-text';
	inputType?: TInputType;
}

/**
 * 一组最多一个验证码
 *
 * verifySecond  倒计时 s
 */
export interface IInputVerifyInstance extends IBaseInstance {
	field: 'input-verify';
	verifyBtnText: string;
	verifySecond: number;
	inputType?: TInputType;
}

interface ISelectInstance extends IBaseInstance {
	field: 'select';
	options: ISelectOptions[];
}

export type TInstance = IInputInstance | ISelectInstance | IInputVerifyInstance;
