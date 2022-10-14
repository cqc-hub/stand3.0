import type { TInstance } from '@/components/g-form/index';

export interface IPageProps {
  orderId: string;
}

/**
 * @orderStatus
 *  dsds
 */
export interface IRegInfo {
  orderStatus: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  herenId: string;
  idCard: string;
  hosGisLat: string; // 纬度
  hosGisLng: string; // 经度
  hosId: string;
  hosName: string;
  hosOrderId: string;
  orderId: string;
  categorName: string;
  schQukCategor: string;
  _appointmentDate: string;
  appointmentDate: string;
  appointmentTime: string;
  ampmName: string;
  fee: string;
  _fee: string;
}

export const regInfoTempList: TInstance[] = [
  {
    label: '预约科室',
    field: 'input-text',
    key: 'deptName',
  },
  {
    label: '预约号别',
    field: 'input-text',
    key: 'categorName',
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
    label: '预约时间',
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
    key: 'createTime11',
  },
];

export const patientTempList: TInstance[] = [
  {
    label: '就诊人',
    field: 'input-text',
    key: 'patientName',
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
    rowStyle: 'border-radius: 8px;',
  },
];

const formatterTemp = (list: TInstance[]) => {
  list.map((o) => {
    o.labelWidth = '160rpx';
    o.showBodyStyle = 'margin-top: 4rpx; text-align: left;';
    o.labelStyle = 'padding-top: 0;';
    o.bodyStyle = 'padding-top: 0;';

    o.disabled = true;
    o.isForShow = true;
  });
};

formatterTemp(regInfoTempList);
formatterTemp(patientTempList);

export const orderStatusMap: Record<
  string,
  {
    headerClass:
      | 'header-yellow'
      | 'header-blue'
      | 'header-green'
      | 'header-dark';
    headerBgIcon: string;
    headerIcon: string;
    color: string;
    title: string;
  }
> = {
  // 待支付
  10: {
    headerClass: 'header-yellow',
    headerBgIcon: '',
    headerIcon: '&#xe6ea;',
    color: 'var( --hr-error-color-6)',
    title: '待支付',
  },
  // 成功
  0: {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '预约成功',
  },
  // 已挂号
  100: {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已挂号',
  },
  // 已就诊
  70: {
    headerClass: 'header-green',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已就诊',
  },
  // 待就诊
  75: {
    headerClass: 'header-green',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '待就诊',
  },
  // 已退号
  23: {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已退号',
  },
  // 挂号失败
  20: {
    headerClass: 'header-yellow',
    color: 'var( --hr-error-color-6)',
    headerIcon: '&#xe6d5;',
    headerBgIcon: '',
    title: '挂号失败',
  },
  // 已取消
  45: {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已取消',
  },
};
