import { Ref } from 'vue';
import type { TInstance } from '@/components/g-form/index';
import { GStores, ISystemConfig, wait } from '@/utils';
import api from '@/service/api';

export interface IPageProps {
  orderId: string;
  hosOrderId: string;
  preWz?: '1'; // 第一次挂号进来
  thRegisterId?: string;
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
    cardColor: 'var(--hr-warning-color-6)',
  },
  // 成功
  '0': {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已预约',
    cardColor: 'var(--hr-brand-color-6)',
  },
  // 已挂号
  '100': {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已挂号',
    cardColor: 'var(--hr-brand-color-6)',
  },
  '60': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '支付已过期',
    cardColor: 'var(--hr-brand-color-6)',
  },
  // 已就诊
  '70': {
    headerClass: 'header-green',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已就诊',
    cardColor: 'var(--hr-success-color-6)',
  },
  // 待就诊
  '75': {
    headerClass: 'header-green',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '待就诊',
    cardColor: 'var(--hr-brand-color-6)',
  },
  // 已退号
  '23': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已退号',
    cardColor: 'var(--hr-neutral-color-7)',
  },
  '43': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已退号',
    cardColor: 'var(--hr-neutral-color-7)',
  },
  // 已停诊
  '90': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已停诊',
    cardColor: 'var(--hr-neutral-color-7)',
  },
  // 挂号失败
  '20': {
    headerClass: 'header-yellow',
    color: 'var( --hr-error-color-6)',
    headerIcon: '&#xe6d5;',
    headerBgIcon: '',
    title: '失败',
    cardColor: 'var(--hr-error-color-6)',
  },
  // 已退号
  '42': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已退号',
    cardColor: 'var(--hr-neutral-color-7)',
  },
  // 已取消
  '45': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已取消',
    cardColor: 'var(--hr-neutral-color-7)',
  },
  '81': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已过号',
    cardColor: 'var(--hr-neutral-color-7)',
  },
  '82': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已结束',
    cardColor: 'var(--hr-neutral-color-7)',
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
  refundNeedAuth?: '0' | '1'; // 退费(微信国标医保)是否需要拉起授权 0需要 1不需要
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
      cardColor: 'var(--hr-neutral-color-7)',
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

export class RegDetailUtil {
  gStores = new GStores();
  orderRegInfo = <IRegInfo>{};

  private constructor(
    public prop: Ref<IPageProps>,
    public orderConfig: Ref<ISystemConfig['order']>
  ) {}

  getSourceInHos() {
    return this.orderConfig.value.isCanSelOrderStatus === '1';
  }

  /** 请求内部数据库 */
  async getDetailDataClassic(): Promise<IRegInfo> {
    const { orderId } = this.prop.value;
    const { result } = await api.getRegOrderInfo<IRegInfo>({
      orderId,
      source: this.gStores.globalStore.browser.source,
    });

    return result;
  }

  async getDataDetail(): Promise<IRegInfo> {
    const { orderId, hosOrderId } = this.prop.value;

    if (orderId) {
      this.orderRegInfo = await this.getDetailDataClassic();
    } else if (hosOrderId && this.getSourceInHos()) {
      await wait(200);
      // 院内数据库直接在列表全部返回了(数据全部拼接成url)
      this.orderRegInfo = <any>this.prop.value;
    } else {
      this.gStores.messageStore.showMessage('入参错误, 调用详情失败');
      throw new Error('入参错误, 调用详情失败');
    }

    return this.orderRegInfo;
  }

  async cancelRegClassic() {
    return await api.cancelReg({
      orderId: this.prop.value.orderId,
      source: this.gStores.globalStore.browser.source,
    });
  }

  async cancelRegHos() {
    const { hosOrderId } = this.prop.value;
    const { patientId } = this.gStores.userStore.patChoose;

    await api.cancelHosReg({
      hosOrderId,
      patientId,
      source: this.gStores.globalStore.browser.source,
    });

    uni.reLaunch({
      url: '/pagesA/MyRegistration/MyRegistration',
    });
    return Promise.reject('不需要刷新数据');
  }

  async cancelReg() {
    if (this.prop.value.orderId) {
      return await this.cancelRegClassic();
    } else if (this.prop.value.hosOrderId && this.getSourceInHos()) {
      return await this.cancelRegHos();
    }
  }

  static getInstance = (function () {
    let inst: RegDetailUtil;

    return function (
      payload?: {
        prop: Ref<IPageProps>;
        orderConfig: Ref<ISystemConfig['order']>;
      },
      init?: boolean
    ) {
      if (!inst || init) {
        if (payload) {
          inst = new RegDetailUtil(payload.prop, payload.orderConfig);
        } else {
          throw new Error('RegDetailUtil 参数为空');
        }
      }

      return inst;
    };
  })();
}
