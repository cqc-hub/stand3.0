//获取住院信息 入参类型
export interface getInHospitalInfoParam {
  idType?: string;
  cardNumber?: string;
  hosId?: string;
  idCard?: string;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  phoneNumber?: string;
  sysCode?: string;
}
//获取住院信息 出参类型
export interface getInHospitalInfoResult {
  singleSelfPay?: string;
  prepaymentPayCount?: number;
  prepaymentQuota?: string;
  accountBalance?: string;
  beHosDate?: string;
  clinicDiagnosis?: string;
  costTypeCode?: string;
  costTypeName?: string;
  defrayFee?: string;
  hosId?: string;
  hosName?: string;
  hosOrderState?: string;
  inHospitalId?: string;
  inpatientBed?: string;
  inpatientWard?: string;
  insuranceFee?: string;
  needPay?: string;
  orderBedDept?: string;
  patientName?: string;
  prepaidCost: string;
  queryDate?: string;
  sex?: string;
  sexCode?: string;
  timesHospitalization?: string;
  totalCost?: string;
  treatDoc?: string;
  visitNo?: string;
  cardNumber?: string;
  patientNameDes?: string;
  choosePlaceFlag?: boolean;
  placeList?: any[];
  status?: string;
  extend?: string;
}
//获取住院费用日清单列表
export interface dailyParam {
  costType: string;
  inHospitalId?: string;
  patientId: string;
  sysCode: string;
  timesHospitalization?: string;
  hosId?: string;
}
//预缴记录
export interface hospitalPayResult {
  hospitalPayResultList: dailyList[];
}
//获取住院费用日清单列表 出参
// type IRoute = dailyResult;
export interface dailyResult {
  inHospitalDailyCostsResultList: dailyList[];
}
export interface dailyList {
  date: string;
  costSecondaries?: dailyLists[];
  hospitalPay?: dailyLists[];
}
export interface dailyLists {
  hosName?: string;
  costListResultList: dailySecList[];
}
export interface dailySecList {
  cost?: string;
  costDate?: string;
  hosId?: string;
  hosName?: string;
  inHospitalId?: string;
  moneyType?: string;
  payTime?: string;
  paymentAmount?: string;
  endDay?: string;
  inDay?: string;
  totalCost?: string;
  wardName?: string;
  inpStatus?: 'false' | 'true';
}
//创建住院订单 出参
export interface payOrderResult {
  phsOrderNo: string;
  paySign: string;
}
//和仁支付 入参
export interface payParam {
  hosId: string;
  patientId: string;
  phsOrderSource: string;
  source: string;
  sysCode: string;
  totalFee: string;
}
export interface inHospitalCostInfoParam {
  costDay?: string;
  costType: string;
  hosId: string;
  hospitalId?: string;
  patientId: string;
  sysCode: string;
  timesHospitalization?: string;
  isHosTotallist?: string;
  isHosDaylist?: string;
  startTime?: string;
  endTime?: string;
}
export interface inHospitalCostInfo {
  balance?: string;
  //余额
  costDay?: string;
  //支付时间/创建时间
  costList: costList[];
  costTypeCode?: string;
  //费用分类编码
  costTypeName?: string;
  //费用分类名称
  deptId?: string;
  //入院科室编号
  deptName?: string;
  //入院科室名称
  hosName?: string;
  //院区
  hospitalDate?: string;
  //入院日期2015-07-01
  hospitalWard?: string;
  //住院病区
  inpatientBed?: string;
  //床位号
  inpatientNo?: string;
  //住院号
  patName?: string;
  //患者姓名
  patientId?: string;
  //院内患者ID
  prepaidPayment?: string;
  //预交金
  totalCost?: string;
  //总费用
  patientNameDes?: string;
  patientName?: string;
  //开始时间
  inDay?: string;
  //结束时间
  endDay?: string;
  //脱敏姓名
  cardNumber?: string;
  //卡号
}
export interface costList {
  category?: string;
  //费用类别注射费、西药费、检查费等
  categoryCost?: string;
  //类别费用
  subCostList: subCostList[];
}
export interface subCostList {
  orderedDate?: string;
  costName?: string;
  //费用名称
  quantity?: string;
  //数量
  unit?: string;
  //单位
  unitPrice?: string;
  //单价
  valuationAmount?: string;
  //计价金额
}

export interface IPayListObj {
  digital: '1';
  channel: string;
  businessType: string;
}

//住院 配置参数接口 类型定义
export interface hosParam {
  inPatientPrePay: string;
  isHosDaylist?: string;
  isHosTotallist: string;
  tab?: IOptions[];
  isQueryPreRecord?: string;
  isHidePay?: string;
  /** 是否开启数字人民币支付 */
  payList?: {
    wx?: IPayListObj;
    alipay?: IPayListObj;
  };
}

export type TPayConfirmHosPageProp = {
  hosId: string;
  cardNumber: string;
  patientId: string;
  patientName: string;
  hospitalAccount: string;
  hosName: string;
  extend: string;
};

interface IGPay {
  label: string;
  key: 'online' | 'digital';
}
import { ref } from 'vue';
import {
  GStores,
  debounce,
  type ISystemConfig,
  ServerStaticData,
  wait,
  useTBanner,
  PatientUtils,
  apiAsync,
} from '@/utils';
import api from '@/service/api';

import { payMoneyOnline, toPayPull } from '@/components/g-pay/index';
import { usePayPage } from '../../clinicPay/utils/clinicPayDetail';
const { getIsDigitalPay, getDigitalPay } = usePayPage();

export const useHosPayPage = () => {
  const gStores = new GStores();
  const pageConfig = ref({} as ISystemConfig['hospitalCare']);
  const isConfigComplete = ref(false);
  const refPayList = ref([
    {
      label: '自费支付',
      key: 'online',
    },
  ]);
  const refPay = ref<any>('');

  const getSysConfig = async () => {
    isConfigComplete.value = false;
    pageConfig.value = await ServerStaticData.getSystemConfig(
      'hospitalCare'
    ).finally(() => {
      isConfigComplete.value = true;
    });
  };

  const getRefPay = async (fee?) => {
    if (!fee) {
      return;
    }
    if (isNaN(fee * 1)) {
      gStores.messageStore.showMessage('请输入正确金额');
      return;
    }

    if (!(fee * 1)) {
      gStores.messageStore.showMessage('请输入金额');
      return;
    }
    const isDigitalPay = getIsDigitalPay(pageConfig.value);

    if (isDigitalPay) {
      let labelPay = '自费支付';
      // #ifdef MP-WEIXIN
      labelPay = '微信自费支付';
      // #endif
      // #ifdef MP-ALIPAY
      labelPay = '支付宝自费支付';
      // #endif
      refPayList.value = [
        {
          label: labelPay,
          key: 'online',
        },

        {
          label: '数字人民币支付',
          key: 'digital',
        },
      ];
    }

    if (fee && fee == '0') {
      gStores.messageStore.showMessage('不支持充值0元，请输入其它金额！', 3000);
      return;
    }
    await wait(200);
    refPay.value.show();
  };

  /**
   * 创建订单 获取支付入参数据
   * 传参type 默认是预交金充值  outHos是出院结算
   */
  const getCreateInHospitalPayOrderData = async (data, fee, type?) => {
    const { patientName, cardNumber, hosId, hosName, visitNo } = data;
    let extend = {};
    if (data.extend) {
      if (typeof data.extend === 'string') {
        try {
          extend = JSON.parse(data.extend);
        } catch (error) {
          console.error('JSON parse error:', error);
        }
      }
    }

    if (data.reason) {
      extend = {
        ...extend,
        reason: data.reason,
      };
    }
    const { result } = await api.createInHospitalPayOrder<payOrderResult>({
      visitNo,
      fee,
      orderType: data.hospitalAccount ? data.hospitalAccount : '3',
      patientId: data.type == '1' ? '' : gStores.userStore.patChoose.patientId,
      patientName,
      cardNumber,
      hosId,
      hosName,
      leaveHos: type === 'outHos' ? '1' : '',
      // extend: data.extend,
      extend: JSON.stringify(extend),
    });
    const payArg: BaseObject = {
      phsOrderNo: result.phsOrderNo,
      paySign: result.paySign,
      totalFee: fee,
      phsOrderSource: data.hospitalAccount ? data.hospitalAccount : '3',
      source: gStores.globalStore.browser.source,
      ...data,
      patientId: data.type == '1' ? '' : gStores.userStore.patChoose.patientId,
    };
    return payArg;
  };

  /** 数字人民币支付 */
  const toDigitalPay = async (data, fee) => {
    const { alipay, wx } = pageConfig.value.payList!;
    let _businessType = '';
    let _channel = '';
    // #ifdef MP-ALIPAY
    if (alipay) {
      const { businessType, channel } = alipay;
      _businessType = businessType;
      _channel = channel;
    }
    // #endif

    // #ifdef  MP-WEIXIN
    if (wx) {
      const { businessType, channel } = wx;
      _businessType = businessType;
      _channel = channel;
    }
    // #endif
    //区分下 代缴 住院 门诊充值的回调地址
    let _returnUrl = '/pagesA/hospitalCare/hospitalCare';
    if (data.type == '1' || data.hosId) {
      _returnUrl = '/pages/home/home';
    }
    const payArg = await getCreateInHospitalPayOrderData(data, fee);
    const res = await payMoneyOnline({
      ...payArg,
      businessType: _businessType,
      channel: _channel,
      returnUrl: `https://h5.eheren.com/v3/#/pagesC/common/rmbNumber?pageUrl=${encodeURIComponent(
        _returnUrl
      )}`,
    });
    const { invokeData } = res;
    uni.navigateTo({
      url: `/pagesA/webView/webView?https=${encodeURIComponent(
        invokeData.payUrl!
      )}`,
    });
  };
  return {
    refPay,
    refPayList,
    isConfigComplete,
    pageConfig,
    getRefPay,
    getSysConfig,
    toDigitalPay,
    getCreateInHospitalPayOrderData,
  };
};
