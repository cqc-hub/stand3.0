import { ref } from 'vue';
import {
  GStores,
  debounce,
  type ISystemConfig,
  ServerStaticData,
} from '@/utils';
import { joinQuery } from '@/common';
import {
  type IGPay,
  payMoneyOnline,
  toPayPull,
} from '@/components/g-pay/index';

import api from '@/service/api';

export type IPayListItem = {
  childOrder: string;
  deptId: string;
  deptName: string;
  payState: '0' | '1'; // 支付状态 1待支付，0已支付
  clinicType?: string;
  hosOrderId?: string;
  phsOrderId?: string;
  paySeq?: string;
  serialNo?: string;
  docId: string;
  docName: string;
  hosId: string;
  hosName: string;
  totalCost: string;
  visitDate: string;
  visitNo: string;
  _clinicType: string;
};

export type TPayedListItem = {} & IPayListItem;

export type TPayDetailProp = {
  hosId: string;
  payState: '0' | '1'; // 支付状态 1待支付，0已支付;
  deptName: string;
  docName: string;
  _clinicType: string;

  clinicType?: string;
  hosOrderId?: string;
  paySeq?: string;
  phsOrderId?: string;
  serialNo?: string;
  visitDate?: string;
  visitNo?: string;
};

export type TCostList = {
  subCost: string;
  subCostTypeCode: string;
  subCostTypeName: string;
  costList: {
    amount: string;
    itemPrice: string;
    itemSpec: string;
    subCost: string;
    sumSubCost: string;
    subCostTypeCode: string;
    subCostTypeName: string;
    units: string;
  }[];
}[];

export type TPayDetailInfo = {
  costList?: TCostList;
  hosId: string;
  hosName: string;
  medicalCost: string;
  payState: string;
  personCost: string;
  hospitalCost: string;
  totalCost: string;
  invoiceNumber: string; // 发票号
};

export const usePayPage = () => {
  const pageConfig = ref({} as ISystemConfig['pay']);
  const regDialogConfirm = ref<any>('');
  const confirmFgTitle = ref('');
  const gStores = new GStores();
  const tabCurrent = ref(0);
  const isPayListRequestComplete = ref(false);
  const tabField = [
    {
      label: '待缴费',
      key: 0,
    },
    {
      label: '已缴费',
      key: 1,
    },
  ];
  const refPay = ref<any>('');
  const payArg = ref<BaseObject>({});
  const refPayList = ref([
    {
      label: '在线支付',
      key: 'online',
    },
  ]);

  const tabChange = debounce((idx: number) => {
    tabCurrent.value = idx;

    getListData();
  }, 20);

  const unPayList = ref<IPayListItem[]>([]);
  const payedList = ref<TPayedListItem[]>([]);

  const getUnPayList = async () => {
    if (unPayList.value.length) {
      return;
    }
    unPayList.value = [];

    let { patientId } = gStores.userStore.patChoose;

    // patientId = '10831203';
    const arg = {
      patientId,
    };
    isPayListRequestComplete.value = false;
    const { result } = await api
      .getUnpaidClinicList<{
        clinicalSettlementResultList: IPayListItem[];
      }>(arg)
      .finally(() => {
        isPayListRequestComplete.value = true;
      });

    const resList = (result && result.clinicalSettlementResultList) || [];

    dealPayList(resList, { payState: '1' });

    unPayList.value = resList;
  };

  const getPayedList = async () => {
    if (payedList.value.length) {
      return;
    }
    payedList.value = [];
    let { patientId } = gStores.userStore.patChoose;

    patientId = '10831082';
    const arg = {
      patientId,
    };
    isPayListRequestComplete.value = false;
    const { result } = await api
      .getPrepaidClinicList<{
        clinicPayListDetailResults: TPayedListItem[];
      }>(arg)
      .finally(() => {
        isPayListRequestComplete.value = true;
      });

    const resList = (result && result.clinicPayListDetailResults) || [];

    dealPayList(resList, { payState: '0' });

    payedList.value = resList;
  };

  const selPayListItem = (item: IPayListItem) => {
    console.log('sel', item);
  };

  const goPayDetail = (item: IPayListItem) => {
    let { patientId } = gStores.userStore.patChoose;

    const {
      hosId,
      payState,
      clinicType,
      hosOrderId,
      paySeq,
      phsOrderId,
      serialNo,
      visitDate,
      visitNo,
      deptName,
      docName,
      _clinicType,
    } = item;

    const pageData = {
      patientId,
      hosId,
      payState,
      clinicType,
      hosOrderId,
      paySeq,
      phsOrderId,
      serialNo,
      visitDate,
      visitNo,
      deptName,
      _clinicType,
      docName,
    };

    // if (payState === '1') {
    //   pageData.patientId = '10831203';
    // } else {

    // }

    console.log(pageData);

    uni.navigateTo({
      url: joinQuery('/pagesA/clinicPay/payDetail', pageData),
    });
  };

  const getListData = async (isReset = false) => {
    if (isReset) {
      unPayList.value = [];
      payedList.value = [];
    }

    if (tabCurrent.value === 0) {
      await getUnPayList();
    } else {
      await getPayedList();
    }
  };

  const getSysConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('pay');
  };

  const handlerPay = async () => {
    if (pageConfig.value.confirmPayFg) {
      regDialogConfirm.value.show();
    } else {
      getPay();
    }
  };

  const getPay = async () => {
    refPay.value.show();
  };

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    if (item.key === 'online') {
      // 预结算
      if (pageConfig.value.isPreSettle === '1') {
        console.log('预结算');
      } else {
        toPay();
      }
    }
  };

  const toPay = async () => {};

  const payAfter = async () => {};

  return {
    pageConfig,
    getSysConfig,
    gStores,
    tabCurrent,
    tabField,
    tabChange,
    unPayList,
    payedList,
    getUnPayList,
    getPayedList,
    isPayListRequestComplete,
    goPayDetail,
    selPayListItem,
    getListData,
    regDialogConfirm,
    handlerPay,
    confirmFgTitle,
    getPay,
    refPay,
    refPayList,
    payArg,
    payAfter,
    getPayInfo,
    toPay,
  };
};

export const usePayDetailPage = () => {
  const detailData = ref({} as TPayDetailInfo);
  const gStores = new GStores();

  const getDetailData = async (arg: TPayDetailProp) => {
    let { patientId } = gStores.userStore.patChoose;

    const { result } = await api.getClinicalPayDetailList({
      ...arg,
      patientId,
    });

    detailData.value = result;
  };

  return {
    detailData,
    getDetailData,
  };
};

const dealPayList = (resList: IPayListItem[], { payState }) => {
  resList.map((o) => {
    const { clinicType } = o;

    o._clinicType = clinicType === '2' ? '网络医院' : '线下门诊';
    o.payState = payState;
  });
};
