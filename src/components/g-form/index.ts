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
	disabled?: boolean;
	rule?: IRule | IRule[];
}

interface IInputInstance extends IBaseInstance {
	field: 'input-text';
}

interface ISelectInstance extends IBaseInstance {
	field: 'select';
	options: ISelectOptions[];
}

export type TInstance = IInputInstance | ISelectInstance;
