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

const detailRes = {
  result: {
    costList: [
      {
        subCostTypeCode: 'B',
        subCost: '295.04',
        subCostTypeName: '中药',
        costList: [
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '26.2',
            subCostTypeCode: '0201289220',
            amount: '42',
            subCost: '0.62',
            itemClass: 'B',
            subCostTypeName: '当归配方颗粒（百神国）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '13.65',
            subCostTypeCode: '0205028220',
            amount: '42',
            subCost: '0.33',
            itemClass: 'B',
            subCostTypeName: '蒲黄配方颗粒（百神省）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '18.03',
            subCostTypeCode: '0201238220',
            amount: '35',
            subCost: '0.52',
            itemClass: 'B',
            subCostTypeName: '川芎配方颗粒（百神国）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '24.26',
            subCostTypeCode: '0201236220',
            amount: '42',
            subCost: '0.58',
            itemClass: 'B',
            subCostTypeName: '赤芍配方颗粒（百神）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '26.09',
            subCostTypeCode: '0206135220',
            amount: '42',
            subCost: '0.62',
            itemClass: 'B',
            subCostTypeName: '桃仁配方颗粒（百神国）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '22.19',
            subCostTypeCode: '0205021220',
            amount: '35',
            subCost: '0.63',
            itemClass: 'B',
            subCostTypeName: '红花配方颗粒（百神）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '11.53',
            subCostTypeCode: '0210051220',
            amount: '63',
            subCost: '0.18',
            itemClass: 'B',
            subCostTypeName: '五灵脂配方颗粒（百神）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '18.32',
            subCostTypeCode: '0206110220',
            amount: '42',
            subCost: '0.44',
            itemClass: 'B',
            subCostTypeName: '菟丝子配方颗粒（百神国）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '38.85',
            subCostTypeCode: '0201239220',
            amount: '42',
            subCost: '0.93',
            itemClass: 'B',
            subCostTypeName: '柴胡配方颗粒（百神国）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '20.22',
            subCostTypeCode: '0206114220',
            amount: '70',
            subCost: '0.29',
            itemClass: 'B',
            subCostTypeName: '醋香附配方颗粒（百神）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '8.27',
            subCostTypeCode: '0207062220',
            amount: '21',
            subCost: '0.39',
            itemClass: 'B',
            subCostTypeName: '甘草配方颗粒（百神国）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '13.91',
            subCostTypeCode: '0206142220',
            amount: '42',
            subCost: '0.33',
            itemClass: 'B',
            subCostTypeName: '栀子配方颗粒（百神国）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '17.64',
            subCostTypeCode: '0202044220',
            amount: '42',
            subCost: '0.42',
            itemClass: 'B',
            subCostTypeName: '黄柏配方颗粒（百神国）',
          },
          {
            itemSpec: '1g江西百神',
            units: '克',
            sumSubCost: '35.88',
            subCostTypeCode: '0201291630',
            amount: '28',
            subCost: '1.28',
            itemClass: 'B',
            subCostTypeName: '麸炒苍术配方颗粒（百神国）',
          },
        ],
      },
      {
        subCostTypeCode: 'Z',
        subCost: '3.50',
        subCostTypeName: '杂费',
        costList: [
          {
            itemSpec: '/',
            units: '剂',
            sumSubCost: '3.5',
            subCostTypeCode: 'Z000000074',
            amount: '7',
            subCost: '0.50',
            itemClass: 'Z',
            subCostTypeName: '中药调配（十五味及以下）',
          },
        ],
      },
    ],
    patName: '吴信华',
    payState: '0',
    qrCode: 'MzYwMTIxMjAwMDA5MTgyNDQx',
    hosName: '八一大道院区',
    totalCost: '298.54',
  },
  timeTaken: 395,
  code: '0',
  message: '成功',
  respCode: '999002',
};

// api.getClinicalPayDetailList = () => Promise.resolve(detailRes as any);
