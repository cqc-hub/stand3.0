import { ref, computed } from 'vue';
import {
  GStores,
  debounce,
  type ISystemConfig,
  ServerStaticData,
  wait,
} from '@/utils';
import { joinQuery, joinQueryForUrl } from '@/common';
import {
  type IGPay,
  payMoneyOnline,
  toPayPull,
} from '@/components/g-pay/index';

import api from '@/service/api';

export const tradeType = {
  '1': '自费',
  '2': '医保',
  // '3': '普通医保',
  // '4': '城乡门特医保',
  // '5': '城职门特医保',
  // '6': '浙江省医保',
} as const;

type TTradeType = keyof typeof tradeType;

export type IPayListItem = {
  childOrder: string;
  deptId: string;
  deptName: string;
  docCode: string;
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
  costTypeName: string;
  costTypeCode: string;
  diseaseTypeName: string;
  diseaseTypeCode: string;
  visitDate: string;
  visitNo: string;
  _clinicType: string;
  tradeType: TTradeType;
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
  childOrder: string;
  deptId: string;
  docId: string;
  hosName: string;
  diseaseTypeName: string;
  costTypeName: string;
};

export type TCostList = {
  subCost: string;
  subCostTypeCode: string;
  subCostTypeName: string;
  serialNo: string;
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
  qrCode: string;
};

export type TPayConfirmPageProp = {
  hosId: string;
  serialNo: string;
  visitNo: string;
  visitDate: string;
  mergeOrder: string;
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

  let tabChange = (idx: number) => {
    tabCurrent.value = idx;

    getListData();
  };

  tabChange = debounce(tabChange, 80);

  const pageProps = ref(
    {} as {
      tabIndex?: '1';

      params?: string;
      deParams?: {
        cardNumber?: string;
        patientName?: string;
      };
    }
  );

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
    isPayListRequestComplete.value = false;
    let result: {
      clinicalSettlementResultList: IPayListItem[];
      cardNumber: '';
      patientName: '';
    };

    const desSecret = pageProps.value.params;
    if (desSecret) {
      const { result: r } = await api
        .getScanUnpaidClinicList<{
          clinicalSettlementResultList: IPayListItem[];
          cardNumber: '';
          patientName: '';
        }>({
          desSecret,
        })
        .finally(() => {
          isPayListRequestComplete.value = true;
        });

      result = r;

      if (result) {
        pageProps.value.deParams = {
          cardNumber: result.cardNumber,
          patientName: result.patientName,
        };
      }
    } else {
      const { result: r } = await api
        .getUnpaidClinicList<{
          clinicalSettlementResultList: IPayListItem[];
          cardNumber: '';
          patientName: '';
        }>({
          patientId,
        })
        .finally(() => {
          isPayListRequestComplete.value = true;
        });

      result = r;
    }

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

    // patientId = '10831082';
    isPayListRequestComplete.value = false;
    let result: {
      clinicPayListDetailResults: TPayedListItem[];
    };
    const desSecret = pageProps.value.params;

    if (desSecret) {
      const { result: r } = await api
        .getScanPrepaidClinicList<{
          clinicPayListDetailResults: TPayedListItem[];
        }>({
          desSecret,
        })
        .finally(() => {
          isPayListRequestComplete.value = true;
        });

      result = r;
    } else {
      const { result: r } = await api
        .getPrepaidClinicList<{
          clinicPayListDetailResults: TPayedListItem[];
        }>({
          patientId,
        })
        .finally(() => {
          isPayListRequestComplete.value = true;
        });

      result = r;
    }

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
        gStores.messageStore.showMessage(
          '不同院区的门诊缴费订单不支持合并支付！',
          1500
        );
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
      childOrder,
      deptId,
      docId,
      hosName,
      costTypeName,
      diseaseTypeName,
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

      childOrder,
      deptId,
      docId,
      hosName,
      costTypeName,
      diseaseTypeName,
    };

    // if (payState === '1') {
    //   pageData.patientId = '10831203';
    // } else {

    // }

    uni.navigateTo({
      url: joinQuery('/pagesA/clinicPay/payDetail', pageData),
    });
  };

  const getListData = async (isReset = true) => {
    if (isReset) {
      unPayList.value = [];
      payedList.value = [];
      selUnPayList.value = [];
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
      gStores.messageStore.showMessage('请选择至少一项进行缴费', 3000);
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
        const selList = selUnPayList.value;

        goConfirmPage({
          hosId: selList[0].hosId,
          serialNo: selList.map((o) => o.serialNo).join(';'),
          visitNo: selList.map((o) => o.visitNo).join(','),
          visitDate: selList.map((o) => o.visitDate).join(','),
          mergeOrder: selList.map((o) => o.childOrder).join(','),
        });
      } else {
        toPay();
      }
    }
  };

  const toPay = async () => {
    const selectList = selUnPayList.value;
    const { patientId } = gStores.userStore.patChoose;

    const _totalCost = totalCost.value + '';
    const source = gStores.globalStore.browser.source;

    const args: BaseObject = {
      businessType: '1',
      patientId,
      source,
      totalCost: _totalCost,
      mergeOrder: selectList.map((o) => o.childOrder).join(','),
      deptCode: selectList.map((o) => o.deptId).join(','),
      deptName: selectList.map((o) => o.deptName).join(','),
      docCode: selectList.map((o) => o.docId).join(','),
      docName: selectList.map((o) => o.docName).join(','),
      hosId: selectList.map((o) => o.hosId).join(','),
      hosName: selectList.map((o) => o.hosName).join(','),
      visitDate: selectList.map((o) => o.visitDate).join(','),
      serialNo: selectList.map((o) => o.serialNo).join(';'),
    };

    if (pageProps.value.deParams) {
      args.cardNumber = pageProps.value.deParams.cardNumber;
    }

    const {
      result: { phsOrderNo },
    } = await api.createClinicOrder(args);

    const payArg: BaseObject = {
      phsOrderNo,
      totalFee: _totalCost,
      phsOrderSource: '2',
      hosId: selectList[0].hosId,
      // hosId: '1279',
      hosName: selectList[0].hosName,
    };

    if (pageProps.value.deParams) {
      payArg.patientName = pageProps.value.deParams.patientName;
      payArg.cardNumber = pageProps.value.deParams.cardNumber;
    }

    const res = await payMoneyOnline(payArg);

    await toPayPull(res, '门诊缴费');
    payAfter();
  };

  const payAfter = async () => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();

    getListData(true);
    tabCurrent.value = 1;

    selUnPayList.value = [];
  };

  return {
    pageProps,
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

export const goConfirmPage = (data: TPayConfirmPageProp) => {
  uni.navigateTo({
    url: joinQueryForUrl('/pagesA/clinicPay/payConfirm', data),
  });
};

const dealPayList = (resList: IPayListItem[], { payState }) => {
  resList.map((o) => {
    const { clinicType } = o;

    o._clinicType = clinicType === '2' ? '网络医院' : '线下门诊';
    o.payState = payState;
  });
};
