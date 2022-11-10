import { ref } from 'vue';
import { GStores, debounce } from '@/utils';
import { joinQuery } from '@/common';

import api from '@/service/api';

export type IPayListItem = {
  childOrder: string;
  deptId: string;
  deptName: string;
  payState?: string;
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
};

export type TPayedListItem = any;

export type TPayDetailProp = {
  hosId: string;
  payState: string;
  patientId: string;

  clinicType?: string;
  hosOrderId?: string;
  paySeq?: string;
  phsOrderId?: string;
  serialNo?: string;
  visitDate?: string;
  visitNo?: string;
};

export const usePayPage = () => {
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
    const { result } = await api.getUnpaidClinicList(arg).finally(() => {
      isPayListRequestComplete.value = true;
    });

    const resList = (result && result.clinicalSettlementResultList) || [];

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
    const { result } = await api.getPrepaidClinicList(arg).finally(() => {
      isPayListRequestComplete.value = true;
    });

    const resList = (result && result.clinicPayListDetailResults) || [];

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
    };

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

  return {
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
  const detailData = ref({});
  const getDetailData = async (arg: TPayDetailProp) => {
    await api.getClinicalPayDetailList({
      ...arg,
    });
  };

  return {
    detailData,
    getDetailData,
  };
};
