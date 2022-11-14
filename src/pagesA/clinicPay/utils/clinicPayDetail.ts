import { ref, computed } from 'vue';
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
  clinicId: string; // 唯一
  subIds: string; // 可合并 id
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
  const selUnPayList = ref<IPayListItem[]>([]);
  const payedList = ref<TPayedListItem[]>([]);
  const totalCost = computed(() => {
    const _subCount = selUnPayList.value.reduce((prev, curr) => {
      return prev + (curr.totalCost as unknown as number) * 1;
    }, 0);

    return Number((_subCount * 100).toFixed(2)) / 100;
  });
  const isShowSelectAll = computed(() => {
    if (unPayList.value.length > 1) {
      const sIds = [...new Set([...unPayList.value.map((o) => o.subIds)])];
      return sIds.length === 1;
    } else {
      return false;
    }
  });
  const isSelectAll = computed(
    () =>
      selUnPayList.value.length &&
      selUnPayList.value.length === unPayList.value.length
  );

  const chooseAll = () => {
    if (isSelectAll.value) {
      selUnPayList.value = [];
    } else {
      selUnPayList.value = [...unPayList.value];
    }
  };

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
    const { clinicId } = item;

    const idx = selUnPayList.value.findIndex((o) => o.clinicId === clinicId);

    if (idx === -1) {
      const sels = [
        ...new Set([...selUnPayList.value, item].map((o) => o.subIds)),
      ];

      if (sels.length < 2) {
        selUnPayList.value.push(item);
      } else {
        gStores.messageStore.showMessage('暂不支持跨院区缴费', 1500);
      }
    } else {
      selUnPayList.value.splice(idx, 1);
    }
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
    if (!selUnPayList.value.length) {
      gStores.messageStore.showMessage('请选择某一项进行缴费', 3000);
      return;
    }

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

  const toPay = async () => {
    console.log('23');
  };

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
    selUnPayList,
    totalCost,
    isShowSelectAll,
    isSelectAll,
    chooseAll,
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

const a: any = {
  result: {
    clinicalSettlementResultList: [
      {
        deptName: '眼科',
        childOrder: '517',
        clinicId: '0',
        docName: '林优',
        subIds: '0',
        docId: '0000003060',
        deptId: '10206000',
        hosId: '10',
        visitDate: '2022-11-14',
        hosName: '横街路院区',
        totalCost: '200.49',
        visitNo: '20221114000007',
      },
      {
        deptName: '眼科',
        childOrder: '517',
        clinicId: '01',
        docName: '林优',
        subIds: '0',
        docId: '0000003060',
        deptId: '10206000',
        hosId: '10',
        visitDate: '2022-11-14',
        hosName: '横街路院区',
        totalCost: '200.49',
        visitNo: '20221114000007',
      },
      {
        deptName: '眼科',
        childOrder: '517',
        clinicId: '02',
        docName: '林优',
        subIds: '0',
        docId: '0000003060',
        deptId: '10206000',
        hosId: '10',
        visitDate: '2022-11-14',
        hosName: '横街路院区',
        totalCost: '200.49',
        visitNo: '20221114000007',
      },
    ],
  },
  timeTaken: 220,
  code: 0,
  functionVersion:
    '[{"functionType":"2","version":"v0.0.8"},{"functionType":"1","version":"v0.0.5"}]',
  message: '成功',
  respCode: 999002,
};

api.getUnpaidClinicList = () => Promise.resolve(a);
