import type { TInstance } from '@/components/g-form/index';

export interface IPageProps {
  orderId: string;
  preWz?: '1'; // 第一次挂号进来
}

/**
 * @orderStatus
 *  dsds
 */

export const regInfoTempList: TInstance[] = [
  {
    label: '预约科室',
    field: 'input-text',
    key: 'deptName',
  },
  {
    label: '预约号别',
    field: 'input-text',
    key: '_category',
  },
  {
    label: '预约医生',
    field: 'input-text',
    key: 'docName',
  },
  {
    label: '挂号序号',
    field: 'input-text',
    key: 'appointmentNumber',
  },
  {
    label: '就诊地址',
    field: 'input-text',
    key: 'visitingArea',
  },
  {
    label: '就诊时间',
    field: 'input-text',
    key: '_appointmentDate',
  },
  {
    label: '挂号金额',
    field: 'input-text',
    key: '_fee',
  },
  {
    label: '就诊提示',
    field: 'input-text',
    rowStyle: 'border-radius: 8px;',
    key: 'hisResult',
  },
];

export const patientTempList: TInstance[] = [
  {
    label: '就诊人',
    field: 'input-text',
    key: 'patientNameEncry',
    rowStyle: 'border-radius: 8px;',
  },
  {
    label: '就诊号',
    field: 'input-text',
    key: 'patientId',
  },
  {
    label: '手机号码',
    field: 'input-text',
    key: 'patientPhone',
  },
  {
    label: '证件号码',
    field: 'input-text',
    key: 'idCard',
    rowStyle: 'border-radius: 8px;',
  },
];

export const formatterTemp = (list: TInstance[], modeOld = false) => {
  list.map((o) => {
    if (modeOld) {
      o.labelWidth = '180rpx';
    } else {
      o.labelWidth = '150rpx';
    }
    o.showBodyStyle = 'text-align: left;';
    o.labelStyle =
      'padding-top: 0; color: var(--hr-neutral-color-7);font-size: var(--hr-font-size-base);';
    o.bodyStyle = 'padding-top: 4rpx;font-size: var(--hr-font-size-base);';
    o.rowStyle = 'margin-top: -15rpx;margin-bottom: 16rpx;';

    o.disabled = true;
    o.isForShow = true;
  });
};

/**
 * 0 -》 取消 | 退号
 * 10 -》 立即支付
 */
export const orderStatusMap = {
  // 待支付
  '10': {
    headerClass: 'header-yellow',
    headerBgIcon: '',
    headerIcon: '&#xe6ea;',
    color: 'var( --hr-error-color-6)',
    title: '待支付',
    cardColr: 'var(--hr-warning-color-6)',
  },
  // 成功
  '0': {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已预约',
    cardColr: 'var(--hr-brand-color-6)',
  },
  // 已挂号
  '100': {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已挂号',
    cardColr: 'var(--hr-brand-color-6)',
  },
  '60': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '支付已过期',
    cardColr: 'var(--hr-brand-color-6)',
  },
  // 已就诊
  '70': {
    headerClass: 'header-green',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已就诊',
    cardColr: 'var(--hr-success-color-6)',
  },
  // 待就诊
  '75': {
    headerClass: 'header-green',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '待就诊',
    cardColr: 'var(--hr-brand-color-6)',
  },
  // 已退号
  '23': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已退号',
    cardColr: 'var(--hr-neutral-color-7)',
  },
  '43': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已退号',
    cardColr: 'var(--hr-neutral-color-7)',
  },
  // 已停诊
  '90': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已停诊',
    cardColr: 'var(--hr-neutral-color-7)',
  },
  // 挂号失败
  '20': {
    headerClass: 'header-yellow',
    color: 'var( --hr-error-color-6)',
    headerIcon: '&#xe6d5;',
    headerBgIcon: '',
    title: '失败',
    cardColr: 'var(--hr-error-color-6)',
  },
  // 已退号
  '42': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已退号',
    cardColr: 'var(--hr-neutral-color-7)',
  },
  // 已取消
  '45': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已取消',
    cardColr: 'var(--hr-neutral-color-7)',
  },
  '81': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已过号',
    cardColr: 'var(--hr-neutral-color-7)',
  },
  '82': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已结束',
    cardColr: 'var(--hr-neutral-color-7)',
  },
} as const;

export type OrderStatus = keyof typeof orderStatusMap | '--';

export interface IRegInfo {
  orderStatus: OrderStatus;
  patientId: string;
  cardNumber: string;
  patientName: string;
  patientPhone: string;
  herenId: string;
  idCard: string;
  hosGisLat: string; // 纬度
  hosGisLng: string; // 经度
  hosId: string;
  hosName: string;
  hosDocId: string;
  hosDeptId: string;
  hosOrderId: string;
  orderId: string;
  docName: string;
  categorName: string;
  _category: string;
  schQukCategor: string;
  _appointmentDate: string;
  appointmentDate: string;
  appointmentTime: string;
  ampmName: string;
  fee: string;
  _fee: string;
  clinicalType: string;
  deptName: string;
  qrCode: string;
  downTime?: number;
  source?: number;
  rateFlag?: 0 | 1;
  _source?: string;
}

export const getStatusConfig = (status: OrderStatus) => {
  if (orderStatusMap[status]) {
    return orderStatusMap[status];
  } else {
    return {
      title: '未知的状态',
      color: 'var(--hr-error-color-6)',

      headerClass: '',
      headerBgIcon: '&#xe6de;',
      headerIcon: '&#xe6d5;',
      cardColr: 'var(--hr-neutral-color-7)',
    };
  }
};

export const getOrderStatusTitle = (
  status: OrderStatus,
  isOrderPay
): string => {
  if (isOrderPay === '1' && status === '0') {
    return '已挂号';
  } else {
    return getStatusConfig(status).title;
  }
};
