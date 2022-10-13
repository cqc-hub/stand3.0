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
}

export const regInfoTempList: TInstance[] = [
  {
    label: '预约科室',
    field: 'input-text',
    disabled: true,
    key: 'deptName',
    isForShow: true,
  },
  {
    label: '预约号别',
    field: 'input-text',
    disabled: true,
    key: 'categorName',
    isForShow: true,
  },
  {
    label: '预约医生',
    field: 'input-text',
    disabled: true,
    key: 'docName',
    isForShow: true,
  },
  {
    label: '挂号序号',
    field: 'input-text',
    disabled: true,
    key: 'appointmentNumber',
    isForShow: true,
  },
  {
    label: '就诊时间',
    field: 'input-text',
    disabled: true,
    key: 'createTime',
    isForShow: true,
  },
  {
    label: '挂号金额',
    field: 'input-text',
    disabled: true,
    key: 'fee',
    isForShow: true,
  },
  {
    label: '就诊提示',
    field: 'input-text',
    disabled: true,
    key: 'createTime11',
    isForShow: true,
  },
];

regInfoTempList.map((o) => {
  o.labelWidth = '160rpx';
  o.bodyStyle = 'margin-top: 10rpx;'
});
