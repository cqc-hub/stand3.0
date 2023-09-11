import { Flatten, NotNullable } from '@/typeUtils';
import { IMedicalPhotoMode } from '@/types';

export type TOutHosInfo = {
  admissionTime: string;
  deptName: string;
  diagnosis: string;
  docName: string;
  hosId: string;
  hosName: string;
  hospitalWard: string;
  inpatientBed: string;
  outTime: string;
  visitNo: string;
  _id: string;
};

/**
 订单状态
 (11支付成功（审核中）、
  12已发货（已发货）、
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
  '10': {
    title: '未支付',
    color: 'var(--hr-brand-color-6)',
    detailColor: '#fff',
    headerClass: 'header-blue',
  },

  '11': {
    title: '审核中',
    color: 'var(--hr-brand-color-6)',
    detailColor: '#fff',
    headerClass: 'header-blue',
  },

  '12': {
    title: '已发货',
    detailColor: '#fff',
    headerClass: 'header-blue',
    color: 'var(--hr-brand-color-6)',
  },
  '13': {
    detailColor: '#fff',
    title: '已签收',
    headerClass: 'header-blue',
    color: 'var(--hr-brand-color-6)',
  },
  '14': {
    detailColor: '#fff',
    title: '待发货',
    headerClass: 'header-blue',
    color: 'var(--hr-brand-color-6)',
  },
  '15': {
    title: '审核中',
    detailColor: '#fff',
    headerClass: 'header-blue',
    color: 'var(--hr-brand-color-6)',
  },
  '16': {
    title: '已取消',
    detailColor: '#fff',
    color: 'var(--hr-neutral-color-7)',
    headerClass: 'header-dark',
  },
  '17': {
    title: '已取消',
    detailColor: '#fff',
    headerClass: 'header-dark',
    color: 'var(--hr-neutral-color-7)',
  },
  '18': {
    // title: '已结算',
    // detailColor: '#fff',
    // headerClass: 'header-blue',
    // color: 'var(--hr-brand-color-6)',

    title: '已发货',
    detailColor: '#fff',
    headerClass: 'header-blue',
    color: 'var(--hr-brand-color-6)',
  },
  '19': {
    title: '已结算',
    detailColor: '#fff',
    headerClass: 'header-blue',
    color: 'var(--hr-brand-color-6)',
  },
  '20': {
    title: '审核不通过',
    headerClass: 'header-yellow',
    detailColor: 'var(--hr-error-color-6)',
    color: 'var(--hr-neutral-color-7)',
  },
  '21': {
    title: '审核不通过',
    headerClass: 'header-yellow',
    color: 'var(--hr-neutral-color-7)',
    detailColor: 'var(--hr-error-color-6)',
  },
} as const;

type Express_1 = {
  opOrgCode: string;
  opGis: string;
  traceNo: string;
  opDesc: string;
  operatorNo: string;
  operatorName: string;
  opTime: string;
  opName: string;
  opCode: string;
  opOrgName: string;
  deliverCode: string;
  opOrgProvName: string;
  opOrgCity: string;
};

type Express_2 = {
  mailno: string;
  accept_address: string;
  accept_date: string;
  remark: string;
  opcode: string;
  accept_time: string;
  accept_totaltime: string;
};

type TOutInfo = {
  deptName: string;
  hospitalWard?: string;
  inpatientBed?: string;
  diagnosis?: string[];
  hosId?: string;
  type?: string;
  diagnosisC?: string;
  docName?: string;
  attendingDoctor?: string;
  hosName?: string;
  visitNo: string;
  outTime: string;
  isOneself?: '0' | '1'; // 手动添加？ 0 shi 1 fou
  admissionTime: string;
  clinicOnLine?: string;
  inHosTime?: string;
  count?: number;
};

export type CaseCopyItem = {
  cardNumber: string;
  createTime: string;
  refundReason: string;
  _createTime: string;
  acceptTime: string;
  _expressTime?: string;
  _expressDesc?: string;
  fee: string;
  hosId: string;
  hosName: string;
  idCard: string;
  orderStatus: keyof typeof applyOrderStatusMap;
  patientName: string;
  phsOrderNo: string;
  expressParam?: string;
  _expressParam?: Express_1 | Express_2;
  outInfo: string;
  expressNo: string;
  expressCompany: string;
  _outInfo: TOutInfo[];
  /** 补交状态 1 待补交 2 已补交 */
  supplement?: 1 | 2;
  /** 补交金额 */
  supplementFee?: string;
  supplementId?: string;
};

type deParams = string;

export type CaseCopeItemDetail = Flatten<
  Omit<CaseCopyItem, 'hosId' | 'hosName'> & {
    addresseeAddress: deParams;
    addresseeName: deParams;
    addresseePhone: deParams;
    copyAim: string;
    detailedAddress: deParams;
    handIdCardUrl: string;
    handIdCardFrontUrl: string;
    censusRegisterUrl: string;
    endIdCardUrl: string;
    frontIdCardUrl: string;
    outInfo: string;
    id: string;
    printCount?: { purpose: string; count: number }[];
    expressStatus: string;
    _outInfo?: TOutInfo[];
    expressFee?: string;
    refundFee?: string;
    refundReason: string;
    remark: string;
    expressNo: string;
    expressCompany: string;
    hosId: string;
    imageJson?: IMedicalPhotoMode['children'];
  }
>;

export const CACHE_KEY = 'recordApply-list';

/** 邮政 */
export const isExpress1 = (item: any): item is Express_1 => {
  return item && item.traceNo;
};

// 顺丰
export const isExpress2 = (item: any): item is Express_2 => {
  return item && item.mailno;
};

export const isWaitForPay = (
  item: Pick<CaseCopyItem, 'orderStatus' | 'supplement'>
) => !['20', '21'].includes(item.orderStatus) && item.supplement === 1;
