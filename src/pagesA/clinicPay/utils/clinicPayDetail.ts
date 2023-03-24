import { ref, computed } from 'vue';
import {
  GStores,
  debounce,
  type ISystemConfig,
  ServerStaticData,
  wait,
  useTBanner,
} from '@/utils';
import {
  joinQuery,
  joinQueryForUrl,
  setLocalStorage,
  getLocalStorage,
} from '@/common';
import {
  type IGPay,
  payMoneyOnline,
  toPayPull,
  getOpenid,
  getOpenid2,
} from '@/components/g-pay/index';

import api from '@/service/api';
import globalGl from '@/config/global';

export const tradeType = {
  '1': '自费',
  '2': '医保',
  // '3': '普通医保',
  // '4': '城乡门特医保',
  // '5': '城职门特医保',
  // '6': '浙江省医保',
} as const;

type TTradeType = keyof typeof tradeType;

export type TWxAuthorize = {
  cityId: string;
  payAuthNo: string;
  userLongitudeLatitude: {
    latitude: string;
    longitude: string;
  };
  userName: string;
};

export type IPayListItem = {
  childOrder: string; // 唯一 !!
  deptId: string;
  deptName: string;
  docCode: string;
  payState: '0' | '1'; // 支付状态 1待支付，0已支付
  subIds: string; // 可合并 id
  clinicType?: '1' | '2' | '3';
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
  clinicTypeName: string;
  visitNo: string;
  traceNo: string;
  cardNumber?: string;
  recipeNo?: string;
  tradeType: TTradeType;
};

export type TPayedListItem = {} & IPayListItem;

export type TPayDetailProp = {
  hosId: string;
  payState: '0' | '1'; // 支付状态 1待支付，0已支付;
  deptName: string;
  docName: string;
  clinicTypeName: string;

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
  cardNumber?: string;
  patientName?: string;
  costTypeCode?: string;
  params?: string; //扫码的加密参数
  traceNo?: string;
  recipeNo?: string;
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
  cardNumber?: string;

  params?: string; // 扫码时候
  deParams?: {
    serialNo: string;
    visitNo: string;
    cardNumber: string;
    branchHosp: string; // 院内的院区id
  };
  mzParams?: string;
};

/** 国标医保明细上传结果 */
export type TMedicalNationUploadRes = {
  requestContent: string;
  paySign: string;
  totalFee: string;
  idCard: string;
  orderStatus: string;
  medicarePersonalFee: string;
  personalPayFee: string;
  medicarePlanFee: string;
  medicareTotalFee: string;
  phsOrderNo: string;
  extend: string;
  idType: string;
  payOrderId: string;
  serialNo: string;
};

/** 是否医保插件模式 */
export const getIsMedicalModePlugin = () => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  let isMedicalPay = false;

  if (medicalMHelp) {
    const { alipay, wx } = medicalMHelp;

    // #ifdef MP-ALIPAY
    if (alipay?.medicalPlugin) {
      isMedicalPay = true;
    }
    // #endif

    // #ifdef  MP-WEIXIN
    if (wx) {
      const { medicalPlugin, medicalNation } = wx;

      if (medicalPlugin || medicalNation) {
        isMedicalPay = true;
      }
    }
    // #endif
  }

  return isMedicalPay;
};

/** 是否自动赋值医保状态 */
export const getIsMedicalTradeTypeDefault = () => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  let setTradeTypeDefault = false;

  if (medicalMHelp) {
    const { alipay, wx } = medicalMHelp;

    // #ifdef MP-ALIPAY
    if (alipay?.medicalDefault === '1') {
      setTradeTypeDefault = true;
    }
    // #endif

    // #ifdef  MP-WEIXIN
    if (wx) {
      const { medicalDefault } = wx;

      if (medicalDefault === '1') {
        setTradeTypeDefault = true;
      }
    }
    // #endif
  }

  return setTradeTypeDefault;
};

/** 获取国标授权 */
export const getQxMedicalNation = async () => {
  const gStores = new GStores();
  const qrCode =
    gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode || '';

  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  const { alipay, wx: _wx } = medicalMHelp!;
  let authorizeType = '1';
  // #ifdef MP-ALIPAY
  authorizeType = '2';
  // #endif

  const requestArg = {
    authorizeType,
    authorizeTypeDesc: authorizeType,
    aliPayUserId: '',
    callUrl: '',
    openId: gStores.globalStore.openId,
    qrCode,
  };

  // #ifdef  MP-WEIXIN
  if (!qrCode) {
    const { appId, path } = _wx!.medicalNation!;

    setLocalStorage({
      'get-wx-medical-auth-code': '1',
    });

    wx.navigateToMiniProgram({
      appId,
      path,
      envVersion: globalGl.env === 'prod' ? 'release' : 'trial',
    });

    return Promise.reject('请求授权...');
  }

  if (gStores.globalStore.openId === '') {
    await getOpenid().then((openId) => {
      requestArg.openId = openId;
    });
  } else {
    requestArg.openId = gStores.globalStore.openId;
  }
  // #endif

  // #ifdef MP-ALIPAY
  requestArg.aliPayUserId = gStores.globalStore.openId;
  if (!gStores.globalStore.openId) {
    requestArg.aliPayUserId = await getOpenid2();
  }
  // #endif

  // return;

  //  qrcode 只能使用一次
  gStores.globalStore.onAppShow({});

  const { result } = await api.authorize<any>(requestArg);
  if (result.userLongitudeLatitude) {
    result.userLongitudeLatitude = JSON.parse(result.userLongitudeLatitude);
  }

  return <TWxAuthorize>result;
};

type OptionalType<T> = {
  [P in keyof T]?: T[P];
};

/** 国标医保费用明细上传 */
export const medicalNationUpload = async (
  detail: OptionalType<
    TPayDetailInfo & {
      childOrder: string;
    }
  >,
  auth: TWxAuthorize,
  additional: BaseObject = {}
) => {
  let authorizeTypeDesc = '1';
  // #ifdef MP-ALIPAY
  authorizeTypeDesc = '2';
  // #endif

  const gStores = new GStores();
  const {
    userLongitudeLatitude: { longitude, latitude },
  } = auth;

  const { patientId } = gStores.userStore.patChoose;
  const { source } = gStores.globalStore.browser;

  const requestArg = {
    ...auth,
    ...detail,
    ...additional,
    mergeOrder: detail.childOrder,
    patientId,
    longitude,
    latitude,
    source,
    accountUseFlag: true,
    authorizeTypeDesc,
  };

  const { result } = await api.medicalCostInfoUpload<any>(requestArg);

  return <TMedicalNationUploadRes>result;
};

let _isCanUseMedical: boolean | null = null;
/** 支付宝医保插件模式时候 校验就诊人是否能使用医保插件 */
export const isCanUseMedical = async (cardNumber: string): Promise<boolean> => {
  if (_isCanUseMedical !== null) {
    return _isCanUseMedical;
  }

  // #ifdef MP-ALIPAY
  await new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes: 'auth_user',
      success: async ({ authCode }) => {
        const { result } = await api.alipayVerifiSelf({
          cardNumber,
          code: authCode,
        });

        if (result) {
          const { isSelf } = result;
          _isCanUseMedical = isSelf;

          setTimeout(() => {
            resolve(void 0);
          });
        } else {
          reject(void 0);
        }
      },
      fail: reject,
    });
  });

  // #endif

  return !!_isCanUseMedical;
};

/** 只考虑登录时候 校验就诊人是否能使用国标医保 */
export const isCanUseMedicalNational = async (): Promise<boolean> => {
  const { relationship } = new GStores().userStore.patChoose;

  return relationship === '本人';
};

/** 是否需要过滤医保 仅本人使用 */
export const _isMedicalSelf = async () => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  if (medicalMHelp) {
    const { alipay, wx } = medicalMHelp;

    // #ifdef MP-ALIPAY
    if (alipay) {
      const { medicalPlugin } = alipay;

      if (medicalPlugin) {
        return true;
      }
    }
    // #endif

    // #ifdef  MP-WEIXIN
    if (wx) {
      const { medicalNation } = wx;

      if (medicalNation) {
        return true;
      }
    }
    //#endif
  }

  return false;
};

/** 是否默认携带医保标签 (部分项目不返回 costTypeCode 标志) */
export const isDefaultMedical = () => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  if (medicalMHelp) {
    const { alipay, wx } = medicalMHelp;

    // #ifdef MP-ALIPAY
    return alipay?.medicalDefault === '1';
    // #endif

    // #ifdef  MP-WEIXIN
    return wx?.medicalDefault === '1';
    //#endif
  }

  return false;
};

/**
 *
 * @param cardNumber
 * @returns boolean  本人医保?
 */
export const isMedicalSelf = async (cardNumber: string): Promise<boolean> => {
  if (await _isMedicalSelf()) {
    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    const { alipay, wx } = medicalMHelp!;

    // #ifdef MP-ALIPAY
    if (alipay) {
      const { medicalPlugin } = alipay;

      /**
       * 支付宝医保插件模式只能是本人
       */
      if (medicalPlugin) {
        return await isCanUseMedical(cardNumber);
      }
    }
    // #endif

    // #ifdef  MP-WEIXIN
    if (wx) {
      const { medicalNation } = wx;

      if (medicalNation) {
        return await isCanUseMedicalNational();
      }
    }
    // #endif
  }
  return false;
};

export const usePayPage = () => {
  const pageConfig = ref({} as ISystemConfig['pay']);
  const regDialogConfirm = ref<any>('');
  const regDialogConfirmExpress = ref<any>('');
  const confirmFgTitle = ref('');
  const gStores = new GStores();
  const hosId = ref<string>();
  const selHosRef = ref('' as any);
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
  const wxPryMoneyMedicalDialog = ref('' as any);

  let tabChange = (idx: number) => {
    tabCurrent.value = idx;

    getListData();
  };

  tabChange = debounce(tabChange, 80, false);

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
  const isUnPayListSelRadio = computed(() => {
    const fList: string[] = [];
    unPayList.value.map(({ subIds }) => {
      if (!fList.includes(subIds)) {
        fList.push(subIds);
      }
    });

    return fList.length === unPayList.value.length;
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
      } else {
        pageProps.value.deParams = undefined;
      }
    } else {
      const { result: r } = await api
        .getUnpaidClinicList<{
          clinicalSettlementResultList: IPayListItem[];
          cardNumber: '';
          patientName: '';
        }>({
          patientId,
          hosId: hosId.value,
        })
        .finally(() => {
          isPayListRequestComplete.value = true;
        });

      result = r;
      pageProps.value.deParams = undefined;
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
      patientName?: string;
      cardNumber?: string;
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
          hosId: hosId.value,
        })
        .finally(() => {
          isPayListRequestComplete.value = true;
        });

      result = r;
    }

    const resList = (result && result.clinicPayListDetailResults) || [];

    dealPayList(resList, { payState: '0' });

    payedList.value = resList;

    if (result && result.patientName) {
      pageProps.value.deParams = {
        cardNumber: result.cardNumber,
        patientName: result.patientName,
      };
    } else {
      pageProps.value.deParams = undefined;
    }
  };

  const selPayListItem = (item: IPayListItem) => {
    const { childOrder } = item;

    const idx = selUnPayList.value.findIndex(
      (o) => o.childOrder === childOrder
    );

    if (idx === -1) {
      if (isUnPayListSelRadio.value) {
        selUnPayList.value = [item];
      } else {
        const sels = [
          ...new Set([...selUnPayList.value, item].map((o) => o.subIds)),
        ];

        if (sels.length < 2) {
          selUnPayList.value.push(item);
        } else {
          gStores.messageStore.showMessage(
            '您选择的门诊缴费订单不支持合并支付',
            1500
          );
        }
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
      childOrder,
      deptId,
      docId,
      hosName,
      costTypeName,
      diseaseTypeName,
      clinicTypeName,
      costTypeCode,
      recipeNo,
    } = item;

    const pageData = {
      ...item,
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
      docName,
      clinicTypeName,

      childOrder,
      deptId,
      docId,
      hosName,
      costTypeName,
      diseaseTypeName,
      cardNumber: pageProps.value.deParams?.cardNumber,
      patientName: pageProps.value.deParams?.patientName,

      params: pageProps.value.params,
      costTypeCode,
      recipeNo,
    };

    // if (payState === '1') {
    //   pageData.patientId = '10831203';
    // } else {

    // }

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/clinicPay/payDetail', pageData),
    });
  };

  let getListData = async (isReset = true) => {
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

  getListData = debounce(getListData, 120, false);

  const getSysConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('pay');
  };

  // 待缴费列表页面是否隐藏金额
  const isWaitPayListHidePrice = computed(() => {
    return pageConfig.value.isScanListHideMoney === '1';
  });

  const handlerPay = async () => {
    if (!selUnPayList.value.length) {
      gStores.messageStore.showMessage('请选择至少一项进行缴费', 3000);
      return;
    }

    if (pageConfig.value.confirmPayFg) {
      const isMedicalModePlugin = getIsMedicalModePlugin();

      if (isMedicalModePlugin) {
        const { cardNumber } = gStores.userStore.patChoose;
        const flag = await isMedicalSelf(
          pageProps.value.deParams?.cardNumber || cardNumber
        );

        if (flag) {
          getPay();
        } else {
          regDialogConfirm.value.show();
        }
      } else {
        regDialogConfirm.value.show();
      }
    } else {
      getPay();
    }
  };

  const getPay = async () => {
    const isMedicalModePlugin = getIsMedicalModePlugin();

    if (isMedicalModePlugin) {
      if (selUnPayList.value.length) {
        const payMedicalItem = selUnPayList.value.find(
          (o) => o.costTypeCode === '2'
        );

        // 医保 类型
        if (payMedicalItem || isDefaultMedical()) {
          const { cardNumber } = gStores.userStore.patChoose;

          const flag = await isMedicalSelf(
            pageProps.value.deParams?.cardNumber || cardNumber
          );

          if (flag) {
            changeRefPayList(1);
          } else {
            changeRefPayList(0);
          }
        } else {
          changeRefPayList(0);
        }
      }
    }

    await wait(200);
    refPay.value.show();
  };

  const changeRefPayList = (type: 0 | 1 | 2) => {
    if (type === 0) {
      refPayList.value = [
        {
          label: '在线支付',
          key: 'online',
        },
      ];
    } else if (type === 1) {
      refPayList.value = [
        {
          label: '在线支付',
          key: 'online',
        },
        {
          label: '医保支付',
          key: 'medicare',
        },
      ];
    } else if (type === 2) {
      refPayList.value = [
        {
          label: '在线支付',
          key: 'online',
        },
        {
          label: '医保支付',
          key: 'medicare',
        },
        {
          label: '到院支付',
          key: 'offline',
        },
      ];
    }
  };

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    // 自费
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
          cardNumber: pageProps.value.deParams?.cardNumber,
          mzParams: pageProps.value.params,
        });
      } else {
        toPay();
      }
    } else if (item.key === 'medicare') {
      const isMedicalModePlugin = getIsMedicalModePlugin();

      if (isMedicalModePlugin) {
        // #ifdef MP-ALIPAY
        payMoneyMedicalPlugin();
        // #endif

        // #ifdef  MP-WEIXIN
        wxPayMoneyMedicalPlugin(medicalNationWx);
        // #endif
      }
    }
  };

  /** 微信医保国标模式  获取到授权 */
  const medicalNationWx = async (payload: TWxAuthorize) => {
    // 医保必然是单选的
    const item = selUnPayList.value[0]!;
    const { getDetailData, detailData } = usePayDetailPage();
    const pat = gStores.userStore.patChoose;

    await getDetailData({
      ...pageProps.value,
      ...item,
    });

    const uploadRes = await medicalNationUpload(
      {
        ...item,
        ...detailData.value,
      },
      payload,
      {
        businessType: '1',
        cardNumber: pageProps.value.deParams?.cardNumber || pat.cardNumber,
      }
    );

    const info = {
      ...item,
      // businessType: '1',
      phsOrderSource: '2',
      cardNumber: pageProps.value.deParams?.cardNumber || pat.cardNumber,
      patientId: pageProps.value.deParams?.cardNumber ? '' : pat.patientId,
      patientName: pageProps.value.deParams?.patientName || pat.patientName,
      payAuthNo: payload.payAuthNo,
      totalCost: detailData.value.totalCost,
      params: pageProps.value.params,
      extend: payload,
    };

    console.log({
      uploadRes,
      info,
    });

    gStores.globalStore.assignCacheData({
      uploadRes,
      info,
    });

    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayMedical',
    });
  };

  // 支付宝 插件医保
  const payMoneyMedicalPlugin = () => {
    const isMedicalModePlugin = getIsMedicalModePlugin();

    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    if (isMedicalModePlugin) {
      const { alipay } = medicalMHelp!;

      const { medicalPlugin } = alipay!;
      // #ifdef MP-ALIPAY
      const authPayPlugin = requirePlugin('auth-pay-plugin');
      // 合并缴费后端控制 医保不能跨院区, 不能和自费混缴
      const hosId = selUnPayList.value[0].hosId;
      const orgId = medicalPlugin!.orgId[hosId];
      const cardType = medicalPlugin!.cardType;
      const medOrgOrd = selUnPayList.value.map((o) => o.traceNo).join(',');
      const cardNo =
        pageProps.value.deParams?.cardNumber ||
        gStores.userStore.patChoose.cardNumber;

      const params = {
        orgId,
        cardType,
        cardNo,
        medOrgOrd,
        // medOrgOrd: medOrgOrd.split(',')[0],
      };

      my.getAuthCode({
        scopes: ['auth_user', 'nhsamp'],
        success: (res) => {
          const { authCode } = res;
          authPayPlugin.toAuthAndPay({
            // 授权获取的authCode
            authCode,
            // 请求接口所需参数
            params,
          });
        },
      });

      // #endif
    }
  };

  // 医保国标授权

  // 微信 & 医保
  const wxPayMoneyMedicalPlugin = async (
    callback: (authorize: TWxAuthorize) => any = () => {}
  ) => {
    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    const { wx } = medicalMHelp!;
    const { medicalNation, medicalPlugin } = wx!;

    if (medicalPlugin === '1') {
      wxPryMoneyMedicalDialog.value.show();
    } else if (medicalNation) {
      const authorize = await getQxMedicalNation();

      callback(authorize);
    }
  };

  const toPay = async () => {
    const selectList = selUnPayList.value;
    const { patientId, patientName } = gStores.userStore.patChoose;

    const _totalCost = totalCost.value + '';
    const source = gStores.globalStore.browser.source;
    // const costTypeCode = selectList[0].costTypeCode;
    const personalPayFee = selectList.reduce((p, o) => {
      const { costTypeCode } = o;

      if (!costTypeCode || costTypeCode === '1') {
        p += (o.totalCost as any) * 1;
      }
      return p;
    }, 0);

    const args: BaseObject = {
      personalPayFee: personalPayFee || undefined,
      patientName: pageProps.value.deParams?.patientName,
      businessType: '1',
      patientId,
      source,
      totalCost: _totalCost,
      mergeOrder: selectList.map((o) => o.childOrder).join(','),
      deptCode: selectList.map((o) => o.deptId).join(','),
      deptName: selectList.map((o) => o.deptName).join(','),
      docCode: selectList.map((o) => o.docId).join(','),
      docName: selectList.map((o) => o.docName).join(','),
      recipeNo: selectList.map((o) => o.recipeNo).join(','),
      hosId: selectList[0].hosId,
      // hosId: selectList.map((o) => o.hosId).join(','),
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
    } else {
      payArg.patientName = patientName;
    }

    const res = await payMoneyOnline(payArg);

    await toPayPull(res, '门诊缴费');
    payAfter();
  };

  const payAfter = async () => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();

    //
    const cardNumber =
      pageProps.value.deParams?.cardNumber ||
      gStores.userStore.patChoose.cardNumber;
    const { clinicType } = selUnPayList.value[0];

    if (clinicType) {
      await executeConfigPayAfter(clinicType, cardNumber);
    }

    selUnPayList.value = [];
    payedList.value = [];
    tabChange(1);

    setTimeout(async () => {
      if (!pageProps.value.params && globalGl.sConfig.isDrugDelivery === '1') {
        getDrugDeliveryList();
      }
    }, 500);
  };

  // 药品配送数据
  const getDrugDeliveryList = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const args = {
      takenDrug: '0',
      patientId,
      clinicCate: 0,
    };

    const { result } = await api.getDrugDelivery(args);
    let rList = result && result.drugList;
    if (rList && rList.length) {
      rList = rList.filter((o) => o.takenDrugType === '0');

      if (rList.length) {
        setTimeout(() => {
          regDialogConfirmExpress.value.show();
        }, 500);
      }
    }
  };

  const goDrugDelivery = () => {
    uni.navigateTo({
      url: '/pagesB/medicationAssistant/medicalHelp',
    });
  };

  const hookInit = async (initMethods = <BaseObject>{}) => {
    _isCanUseMedical = null;
    const isMedicalModePlugin = getIsMedicalModePlugin();
    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    if (isMedicalModePlugin) {
      if (medicalMHelp?.alipay?.medicalPlugin) {
        const { params } = pageProps.value;
        let successCallBackUrl = '/pagesA/clinicPay/clinicPayDetail';
        if (params) {
          successCallBackUrl = `/pagesA/clinicPay/clinicPayDetail?params=${encodeURIComponent(
            params
          )}`;
        }

        // #ifdef MP-ALIPAY
        const authPayPlugin = requirePlugin('auth-pay-plugin');

        authPayPlugin.initMethods({
          // 医保授权后（支付授权/建档授权），loading 页面接口报错回调函数（处理逻辑示例）
          /**
           * pay - 支付模块，archive - 建档模块
           */
          catchException: (error: string, type: 'pay' | 'archive') => {
            console.log('error: ', error);
            uni.reLaunch({ url: successCallBackUrl });
          },

          /**
           * 测试插件 v0.0.6 及以上，正式插件 v0.0.12 及以上
           * @param status 'ALIPAID'
           * @param ampTraceId
           * 支付宝支付成功回调, 执行时机详见流程图
           */
          aliPayDone: (status: string, ampTraceId: string) => {
            // do something
            uni.reLaunch({
              url: successCallBackUrl + '&tabIndex=1',
            });
          },

          // 支付模块-取消医保授权（处理逻辑示例，建议直接回跳至订单待支付页面）
          payCancelAuth: () => {
            uni.reLaunch({ url: successCallBackUrl });
          },

          ...initMethods,
        });

        // #endif
      }
    }
  };

  const patChange = () => {
    _isCanUseMedical = null;
    getListData(true);
  };

  return {
    patChange,
    changeRefPayList,
    hookInit,
    hosId,
    selHosRef,
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
    regDialogConfirmExpress,
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
    getDrugDeliveryList,
    goDrugDelivery,
    isWaitPayListHidePrice,
    wxPryMoneyMedicalDialog,
    wxPayMoneyMedicalPlugin,
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

export const executeConfigPayAfter = async (
  clinicType: string, // '1' | '2' | '3'
  cardNumber = ''
) => {
  const { pageNextAdress } = await ServerStaticData.getSystemConfig('pay');

  if (pageNextAdress) {
    const configItem = pageNextAdress[clinicType as '1' | '2' | '3'];

    if (configItem) {
      const mode = configItem.mode;

      switch (mode) {
        // 电子导诊单
        case '1':
          useTBanner(
            {
              type: 'h5',
              isSelfH5: '1',
              path: 'pagesC/medicalAssistant/medicalAssistant',
              addition: {
                herenId: 'herenId',
                token: 'token',
                cardNumber: '_hosPd',
              },
            },
            'reLaunch'
          );

          return Promise.reject(void 0);

        case '2':
          uni.reLaunch({
            url: joinQueryForUrl('/pagesB/medicationAssistant/medicalHelp', {
              _hosPd: cardNumber,
            }),
          });

          return Promise.reject(void 0);

        default:
          break;
      }
    }
  }
};

const dealPayList = (resList: IPayListItem[], { payState }) => {
  const setCostTypeCodeDefault = getIsMedicalTradeTypeDefault();

  resList.map((o) => {
    o.payState = payState;

    if (setCostTypeCodeDefault && !o.costTypeCode) {
      o.costTypeCode = '2';
    }
  });
};
