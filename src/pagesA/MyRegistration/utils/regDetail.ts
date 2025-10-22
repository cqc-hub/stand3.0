import { Ref } from 'vue';
import type { TInstance } from '@/components/g-form/index';
import {
  GStores,
  ISystemConfig,
  ServerStaticData,
  wait,
  apiAsync,
  useTBanner,
} from '@/utils';
import api from '@/service/api';
import { joinQueryForUrl, setLocalStorage } from '@/common';
import {
  getMedicalAuthCode,
  getQxMedicalNation,
  getMedicalArgWithFamily,
  getMedicalNationInfo,
} from '@/pagesA/clinicPay/utils/clinicPayDetail';
import { IRegistrationCardItem } from './MyRegistration';
import md5s from 'js-md5';
import globalGl from '@/config/global';

export interface IPageProps {
  orderId: string;
  hosOrderId: string;
  patientId: string;
  hisResult?: string;
  cardNumber?: string;
  preWz?: '1'; // 第一次挂号进来
  thRegisterId?: string;
  needOrderStatus?: string; // 医保回来要不停调用接口（1次/3s/共2次）直到状态和这个一样
  orderStatus: string; // 挂号状态
  alternateId?: string; // orderStatus === 3 候补预约时候有
  _type?: 'waitReg' | 'znpz' | 'forwardReg'; // 候补预约  znpz 智能陪诊点进详情 forwardReg远期预约
  searchType?: '1'; // 省中区别app挂号  不传为查询3.0接口  传1  查询2.0接口
  typeId?: '1' | '2' | '3'; // 3 app挂号
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
    label: '就诊地址',
    field: 'input-text',
    key: 'visitingArea',
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
    // key: 'patientNameEncry',
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
    let baseSize = 150;
    const baseBateSize = 10;

    if (o.label.length > 4) {
      baseSize = 210;

      baseSize += baseBateSize * o.label.length;
    }
    if (modeOld) {
      o.labelWidth = `${baseSize + 30}rpx`;
    } else {
      o.labelWidth = `${baseSize}rpx`;
    }
    o.showBodyStyle = 'text-align: left;';
    o.labelStyle =
      'padding-top: 0; color: var(--hr-neutral-color-7);font-size: var(--hr-font-size-base);';
    // o.bodyStyle = 'font-size: var(--hr-font-size-base);';
    o.rowStyle = 'margin-top: -20rpx;margin-bottom: 16rpx;';

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
  '101': {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已预约',
    cardColor: 'var(--hr-brand-color-6)',
  },
  '110': {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已预约',
    cardColor: 'var(--hr-brand-color-6)',
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
  '3': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已过期',
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
  '80': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '未就诊',
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

export const waitOrderStatusMap = {
  // 候补挂号 0已挂号 1已登记(这个状态可以取消预约) 2待支付 3已过期 4已取消
  // 5候补失败 6已退号 7已停诊 8已就诊
  '0': {
    headerClass: 'header-blue',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '已兑现',
    cardColor: 'var(--hr-brand-color-6)',
  },

  '1': {
    headerClass: 'header-green',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '候补中',
    cardColor: 'var(--hr-brand-color-6)',
  },

  '2': orderStatusMap['10'],

  '3': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已过期',
    cardColor: 'var(--hr-brand-color-6)',
  },
  '31': {
    headerClass: 'header-green',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    color: '#fff',
    title: '候补失败，加号中',
    cardColor: 'var(--hr-brand-color-6)',
  },

  '4': orderStatusMap['45'],

  '5': {
    ...orderStatusMap['20'],
    title: '候补失败',
  },

  '6': orderStatusMap['42'],

  '7': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6de;',
    headerIcon: '&#xe6d5;',
    title: '已停诊',
    cardColor: 'var(--hr-neutral-color-7)',
  },

  '8': orderStatusMap['70'],
  '9': orderStatusMap['75'],
  '10': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    title: '已结束',
    cardColor: 'var(--hr-neutral-color-7)',
  },
  '11': {
    headerClass: 'header-dark',
    color: '#fff',
    headerBgIcon: '&#xe6d0;',
    headerIcon: '&#xe6c7;',
    title: '候补完成',
    cardColor: 'var(--hr-neutral-color-7)',
  },
};

export type OrderStatus = keyof typeof orderStatusMap;

export interface IRegInfo {
  orderStatus: string;
  patientId: string;
  createTime: string;
  hisResult: string;
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
  categor: string;
  _category: string;
  schQukCategor: string;
  _appointmentDate: string;
  appointmentDate: string;
  appointmentTime: string;
  ampmName: string;
  ampm: string;
  fee: number;
  _fee: string;
  clinicalType: string;
  deptName: string;
  qrCode: string;
  downTime?: number;
  source?: number;
  rateFlag?: 0 | 1;
  _source?: string;
  refundNeedAuth?: '0' | '1'; // 退费(微信国标医保)是否需要拉起授权 0需要 1不需要
  totalCost: string;
  hosAccountOffsetFee: string;
  _totalCost: string;
  _hosAccountOffsetFee: string;
  tradeType?: '1' | '2'; // 1 只能自费 2 宜兴存在, 表示要医保退号
  canUpdateStatus?: '0' | '1'; // 0 不可以 1 可以
  schId?: string;
}

export const getStatusConfig = (status: string, isWaitReg: boolean) => {
  if (isWaitReg && waitOrderStatusMap[status]) {
    return waitOrderStatusMap[status];
  } else if (orderStatusMap[status]) {
    return orderStatusMap[status];
  } else {
    return {
      title: `未知的状态 ${status}`,
      color: 'var(--hr-error-color-6)',

      headerClass: '',
      headerBgIcon: '&#xe6de;',
      headerIcon: '&#xe6d5;',
      cardColor: 'var(--hr-neutral-color-7)',
    };
  }
};

const getWaitRegStatusConfig = (status: string) => {
  if (waitOrderStatusMap[status]) {
    const gStores = new GStores();
    if (gStores.globalStore.sysCode === '1001035') {
      if (status === '0') {
        return {
          ...waitOrderStatusMap[status],
          title: '候补成功',
        };
      }
    }
    return waitOrderStatusMap[status];
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
  status: string,
  isOrderPay,
  isWaitReg: boolean
): string => {
  if (isWaitReg) {
    return getWaitRegStatusConfig(status).title;
  }
  if (isOrderPay === '1' && status === '0') {
    return '已挂号';
  } else {
    return getStatusConfig(status, isWaitReg).title;
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
    const { orderId, searchType } = this.prop.value;

    const { result } = await api.getRegOrderInfo<IRegInfo>({
      orderId,
      source: this.gStores.globalStore.browser.source,
      searchType,
    });


    return result;
  }
  /** 请求内部数据库 */
  async getForWardDetailData(): Promise<IRegInfo> {
    const { hosOrderId, _type, cardNumber } = this.prop.value;
    const query = {
      hosOrderId,
      source: this.gStores.globalStore.browser.source,
      cardNumber,
    };

    const { result } = await api.getRegRecordInfo(query);

    return {
      ...result,
      orderId: result.appointId,
      patientName: result.name,
      patientPhone: result.phone,
    };
  }

  async getDataDetail(): Promise<IRegInfo> {
    const { orderId, hosOrderId, _type } = this.prop.value;

    if (orderId) {
      this.orderRegInfo = await this.getDetailDataClassic();
    } else if (hosOrderId && this.getSourceInHos()) {
      await wait(200);
      // 院内数据库直接在列表全部返回了(数据全部拼接成url)
      this.orderRegInfo = <any>this.prop.value;
    } else if (hosOrderId && _type == 'forwardReg') {
      this.orderRegInfo = await this.getForWardDetailData();
      console.log();
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
      hisResult: this.prop.value.hisResult,
      hosOrderId: this.prop.value.hosOrderId,
    });
  }

  async cancelRegHos(
    opt: {
      returnUrl: string;
    } = {} as any
  ) {
    const { hosOrderId } = this.prop.value;
    const { patientId } = this.gStores.userStore.patChoose;
    const { hosId } = this.orderRegInfo;
    const { returnUrl = '/pagesA/MyRegistration/MyRegistration' } = opt;

    await api.cancelHosReg({
      hosOrderId,
      patientId,
      hosId,
      source: this.gStores.globalStore.browser.source,
    });

    const pages = getCurrentPages();
    if (pages && pages.length > 1) {
      const fullUrl: string = (pages[pages.length - 2] as any).$page.fullPath;
      if (fullUrl.includes('pagesA/MyRegistration/MyRegistration')) {
        uni.navigateBack({
          delta: 1,
        });
        return Promise.reject('不需要刷新数据11');
      }
    }
    uni.reLaunch({
      url: returnUrl,
    });

    return Promise.reject('不需要刷新数据22');
  }

  async cancelReg(
    opt: {
      returnUrl: string;
    } = {} as any
  ) {
    if (this.prop.value.orderId) {
      return await this.cancelRegClassic();
    } else if (this.prop.value.hosOrderId) {
      return await this.cancelRegHos(opt);
    }
  }

  async refoundOrder(
    opt: {
      returnUrl: string;
    } = {} as any
  ) {
    const { isOrderPay, wxOrderSubscribeMessage = [] } = this.orderConfig.value;
    let errMsg = '';

    // if (!Object.keys(this.orderRegInfo).length) {
    //   await this.getDataDetail();
    // }

    // #ifdef MP-WEIXIN
    if (wxOrderSubscribeMessage?.length) {
      // @ts-expect-error
      await apiAsync(uni.requestSubscribeMessage, {
        tmplIds: wxOrderSubscribeMessage,
      }).catch((e) => {
        console.error(e);
      });
    }
    // #endif

    if (isOrderPay === '1') {
      const { refundNeedAuth, source, tradeType } = this.orderRegInfo;
      const { orderId, searchType } = this.prop.value;
      const { ev } = this.gStores.globalStore;
      const args = {
        orderId,
        searchType,
        source: this.gStores.globalStore.browser.source,
        payAuthNo: '',
      };
      const medicalNationInfo = getMedicalNationInfo();

      if (refundNeedAuth === '0') {
        if (ev === 'alipay' && source === 19) {
          errMsg = '本次挂号属于微信医保挂号, 暂不支持支付宝端退费';
          this.gStores.messageStore.showMessage(errMsg, 3000);
        }

        if (ev === 'wx' && source === 21) {
          errMsg = '本次挂号属于支付宝医保挂号, 暂不支持微信端退费';
          this.gStores.messageStore.showMessage(errMsg, 3000);
        }

        if (errMsg) {
          this.gStores.messageStore.showMessage(errMsg, 1500);
          throw new Error(errMsg);
        }

        setLocalStorage({
          'get-wx-medical-auth-code-order': '1',
        });

        if (medicalNationInfo && medicalNationInfo.dongRuanMedicalInfo) {
          // 宜兴仅wx
          args.payAuthNo = await getMedicalAuthCode();
        } else {
          await getMedicalArgWithFamily();
          const authorize = await getQxMedicalNation({
            returnUrl: joinQueryForUrl(
              '/pagesA/MyRegistration/RegDetail',
              this.prop.value
            ),
          });

          args.payAuthNo = authorize.payAuthNo;
        }
      }

      uni.showLoading({});
      const { title, content } = await this.gStores.getSysAppMore('1100');
      const { confirm } = await new Promise<any>((closeCallBack) => {
        this.gStores.messageStore.showMessage(content, 0, {
          useDialog: true,
          dialogOpt: {
            title,
            isShowCancel: true,
          },
          closeCallBack,
        });
      });

      if (!confirm) {
        errMsg = '用户点击取消';
        throw new Error(errMsg);
      }

      // return
      await api.refundOrder(args);
    } else {
      const { confirm } = await new Promise<any>((closeCallBack) => {
        this.gStores.messageStore.showMessage('', 0, {
          useDialog: true,
          dialogOpt: {
            isShowCancel: true,
            title: '确认取消该订单?',
          },
          closeCallBack,
        });
      });

      if (!confirm) {
        errMsg = '用户点击取消';
        throw new Error(errMsg);
      }
      return await this.cancelReg(opt);
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

export const goAskForDoc1001048 = (orderInfo) => {
  const {
    hosDeptId: deptcode,
    cardNumber: hisid,
    hosOrderId: regno,
    createTime,
    deptName: deptname,
    patientName: name,
  } = orderInfo;

  const secretkey = 'V7lH3cKlj42kmZ3';
  const callback = '/pagesA/MyRegistration/MyRegistration';
  const needJm = `${deptcode}${regno}${hisid}${callback}${secretkey}`;
  const sign = md5s(needJm).toLowerCase();
  const url = `https://inquiry.iflyhealth.com/wx#/official/3202002?deptcode=${deptcode}&regno=${regno}&callback=${encodeURIComponent(
    callback
  )}&hisid=${hisid}&userid=${regno}&deptname=${deptname}&name=${name}&regtimestamp=${new Date(
    createTime
  ).getTime()}&sign=${sign}`;

  useTBanner({
    type: 'h5',
    path: url,
  });
};

// 郸城预问诊（wx）
export const goAskForDoc1001045 = async (orderInfo) => {
  const gStores = new GStores();
  const { patientId } = orderInfo;
  const { openId } = gStores.globalStore;

  const { result: path } = await api.getConsultationUrl({
    patientId,
    openId,
    appId: globalGl.wxAppid,
  });

  useTBanner({
    path,
    type: 'h5',
  });
};
