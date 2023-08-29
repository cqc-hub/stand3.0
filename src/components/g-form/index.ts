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
//住院 配置参数接口 类型定义
export interface hosParam {
  inPatientPrePay: string;
  isHosDaylist?: string;
  isHosTotallist: string;
  tab?: nameList[];
  isQueryPreRecord?: string;
}
export interface nameList {
  value?: string;
  label?: string;
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
  subLabel?: string;
  placeholder?: string;
  required?: boolean;
  ocr?: boolean;
  ocrDisabled?: boolean;
  emptyMessage?: string;
  disabled?: boolean;
  rule?: IRule | IRule[];
  showSuffixArrowIcon?: boolean;
  rowStyle?: string;
  showBodyStyle?: string;
  labelStyle?: string;
  bodyStyle?: string;
  isHideRowBorder?: boolean;
  labelWidth?: string;
  isForShow?: boolean;
  direction?: 'vertical' | 'horizontal';
  validator?: (
    v: unknown,
    item: TInstance
  ) => Promise<
    | {
        success: false;
        message: string;
      }
    | {
        success: true;
        message?: string;
      }
  >;
  inputMask?: (v: string, item: TInstance) => string;
}

interface IInputInstance extends IBaseInstance {
  field: 'input-text';
  inputType?: TInputType;
  maxlength?: number;
}

export interface ISwitchInstance extends IBaseInstance {
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
  // submitVerify: (...args: any[]) => Promise<any>;
  phoneKey: string;
}

/**
 * @autoOptions 快速获取服务器上的静态列表数据
 */
interface ISelectInstance extends IBaseInstance {
  field: 'select';
  options: ISelectOptions[];
  autoOptions?: 'nationTerms' | 'patientTypeTerms' | 'idTypeTerms';
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
