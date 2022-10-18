export type TOutHosInfo = any;

/**
 订单状态
 (11支付成功（审核中）、
  12已邮寄（已邮寄）、
  13已签收（已签收）、
  14复印中（待发货）、
  15支付成功但通知失败（审核中）、
  16已退费（已退费）、
  17退款成功但通知失败（已退费）、
  18已结算（已结算）、
  19结算成功但通知失败（已结算）、
  20审核不通过（审核不通过 ） 、
  21审核不通过成功但通知失败（审核不通过 ）)
 */

export const applyOrderStatusMap = {
  '11': {
    title: '支付成功',
    color: 'var(--hr-brand-color-6)',
  },
  '12': {
    title: '已邮寄',
    color: 'var(--hr-brand-color-6)',
  },
  '13': {
    title: '已签收',
    color: 'var(--hr-brand-color-6)',
  },
  '14': {
    title: '待发货',
    color: 'var(--hr-brand-color-6)',
  },
  '15': {
    title: '审核中',
    color: 'var(--hr-brand-color-6)',
  },
  '16': {
    title: '已退费',
    color: 'var(--hr-brand-color-6)',
  },
  '17': {
    title: '已退费',
    color: 'var(--hr-brand-color-6)',
  },
  '18': {
    title: '已结算',
    color: 'var(--hr-brand-color-6)',
  },
  '19': {
    title: '已结算',
    color: 'var(--hr-brand-color-6)',
  },
  '20': {
    title: '审核不通过',
    color: 'var(--hr-neutral-color-7)',
  },
  '21': {
    title: '审核不通过',
    color: 'var(--hr-neutral-color-7)',
  },
} as const;

export type CaseCopyItem = {
  cardNumber: string;
  createTime: string;
  _createTime: string;
  fee: string;
  hosId: string;
  hosName: string;
  idCard: string;
  orderStatus: keyof typeof applyOrderStatusMap;
  patientName: string;
  phsOrderNo: string;
};
