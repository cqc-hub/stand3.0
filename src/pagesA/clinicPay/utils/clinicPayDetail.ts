import { ref } from 'vue';
import {
  GStores,
  debounce,
  type ISystemConfig,
  ServerStaticData,
} from '@/utils';
import { joinQuery } from '@/common';

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
  payState: string;
  patientId: string;
  deptName: string;
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
  totalCost: string;
};

export const usePayPage = () => {
  const pageConfig = ref({} as ISystemConfig['pay']);
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

  let tabChange = (idx: number) => {
    tabCurrent.value = idx;
    getListData();
  };

  tabChange = debounce(tabChange, 20);

  const unPayList = ref<IPayListItem[]>([]);
  const payedList = ref<TPayedListItem[]>([]);

  const getUnPayList = async () => {
    if (payedList.value.length) {
      return;
    }
    unPayList.value = [];

    let { patientId } = gStores.userStore.patChoose;

    patientId = '10831203';
    const arg = {
      patientId,
      visitDate: '23',
      visitNo: '23',
      hosId: '23',
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
      visitDate: '23',
      visitNo: '23',
      hosId: '23',
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
  };
};

export const usePayDetailPage = () => {
  const detailData = ref({} as TPayDetailInfo);
  const getDetailData = async (arg: TPayDetailProp) => {
    const { result } = await api.getClinicalPayDetailList({
      ...arg,
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
