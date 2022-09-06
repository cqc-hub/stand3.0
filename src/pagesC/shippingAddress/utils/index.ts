import type { TInstance } from '@/components/g-form/index';
import { cloneUtil } from '@/common';

/**
 * 新增收货地址页面
 */
export const formKey = <const>{
  senderName: 'senderName',
  senderPhone: 'senderPhone',
  address: 'address',
  detailedAddress: 'detailedAddress',
  postcode: 'postcode',
  defaultFalg: '1'
};

export type FormKey = typeof formKey;

export type TFormKeys = keyof FormKey;

export const tempList: TInstance[] = [
  {
    required: true,
    label: '收货人',
    field: 'input-text',
    placeholder: '请输入收货人姓名',
    key: formKey.senderName
  },
  {
    required: true,
    label: '手机号码',
    field: 'input-text',
    placeholder: '请输入收货人手机号码',
    key: formKey.senderPhone,
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
    label: '所在地区',
    placeholder: '请选择',
    key: formKey.address,
    field: 'address'
  },

  {
    required: true,
    label: '详细地址',
    field: 'input-text',
    placeholder: '请输入详细地址',
    key: formKey.detailedAddress,
    rowStyle: 'border-radius: 0 0 16rpx 16rpx;'
  },
  {
    required: true,
    maxlength: 6,
    label: '邮政编码',
    field: 'input-text',
    placeholder: '请输入邮政编码',
    key: formKey.postcode,
  },
  {
    field: 'switch',
    key: formKey.defaultFalg,
    label: '设为默认地址',
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
