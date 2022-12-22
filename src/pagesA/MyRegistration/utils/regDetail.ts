import type { TInstance } from '@/components/g-form/index';

export interface IPageProps {
  orderId: string;
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

const formatterTemp = (list: TInstance[]) => {
  list.map((o) => {
    o.labelWidth = '150rpx';
    o.showBodyStyle = 'margin-top: 4rpx; text-align: left;';
    o.labelStyle = 'padding-top: 0;';
    o.bodyStyle = 'padding-top: 0;';
    o.rowStyle = 'margin-top: -15rpx;'

    o.disabled = true;
    o.isForShow = true;
  });
};

formatterTemp(regInfoTempList);
formatterTemp(patientTempList);

/**
 //0 成功
success("0","成功"),

//01 挂号成功，转诊未成功
success_refunded("01","挂号成功，转诊未成功"),

//10 待支付
read_to_payment("10","待支付"),

//11 医保挂号
success_medicare("11","医保挂号"),

//16 当日挂号即唤起支付
day_reg_pay("16","当日挂号即唤起支付"),

//20 失败
failuer("20","失败"),
//30已退号待退费
returned_schId_wait_to_return_fee("30","已退号待退费"),
// 31 已退费待回执
return_fee_wait_to_ACK("31","已退费待回执"),
// 32已退费已回执
return_fee_success_had_ACK("32","已退费已回执"),
// 33已退号待退费
returned_schId_wait_to_fee("33","已退号待退费"),
//40 已受理退费、待退号
return_fee_wait_to_return_schId("40","已受理退费、待退号"),
//41 退费成功、待退号 、体检待通知院内
return_fee_success_to_return_schId("41","退费成功、待退号 、体检待通知院内"),
//42已退号、退费成功
return_fee_success_and_return_schId_success("42","已退号、退费成功"),
//43 已退号
return_schId_no_payment("43","已退号"),
//44、已退费，再次通知院内失败
REFUNDED_NOTICE_HOS_FAILURE_AGAIN("44","已退费，再次通知院内失败"),
//45 已取消
cancel_success("45","已取消"),
//HIS取消成功，转诊平台取消失败
cancel_success_referral_failuer("4501","取消成功，转诊平台取消失败"),
//46 逻辑删除 ,30分钟未支付逻辑删除
del_order("46","逻辑删除 ,30分钟未支付逻辑删除"),
//平台已取消,支付组件支付成功
cancel_success_paid("47","平台已取消,支付组件支付成功"),
//50 已支付待回执
paid_wait_to_ack("50","已支付待回执"),
//51 已支付已回执
paid_had_ACK("51","已支付已回执"),
//52 已支付充值失败
paid_recharge_fail("52","已支付充值失败"),
//53 已支付挂号失败
paid_register_fail("53","已支付挂号失败"),
//60 支付逾期
payment_timeout("60","支付逾期"),
//平台支付逾期，支付组件支付成功
payment_timeout_paid("61","平台支付逾期，支付组件支付成功"),
//70已就诊  、已体检
visited("70","已就诊"),
//75待就诊
wait_visited("75","待就诊"),
//80 未就诊 、未体检
no_clinical_visit("80","未就诊"),
//81 已过号
passed("81","已过号"),
//82 已结束
finished("82","已结束"),
//85已过号但患者已支付
passed_paid("85","已过号但患者已支付"),
//90 停诊
stopping("90","停诊"),
//100 已挂号
is_registration("100","已挂号"),
//101 待取号
stay_payment("101","待取号"),
//110 已预约
is_already("110","已预约"),
//其他终端已付费
paid_other_client("210","其他终端已付费"),
//其他终端退费
refund_other_client("310","其他终端退费"),
//怕闹事退费
refund_trouble_client("410","怕闹事退费");
 */

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
  _source?: string;
}
