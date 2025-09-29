import { ref, computed, nextTick } from 'vue';
import {
  getLocalStorage,
  joinQuery,
  joinQueryForUrl,
  setLocalStorage,
} from '@/common';

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

import {
  type IGPay,
  payMoneyOnline,
  toPayPull,
  getOpenId,
} from '@/components/g-pay/index';

import api from '@/service/api';
import globalGl from '@/config/global';
import { useCacheStore } from '@/stores';
import { ISConfig } from '@/config/sConfig';
import dayjs from 'dayjs';

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
  cityId?: string; // wx
  userName?: string; // wx
  loginIdCard?: string; // wx
  payAuthNo: string;
  userLongitudeLatitude: {
    latitude: string;
    longitude: string;
  };

  /**
   * 1001035 省中微信智捷付 独有
   */
  ocToken?: string;
  userCardNo?: string;
};
export type IPayListItem = {
  diseaseType?: string;
  medOrgOrd?: string;
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
  autoPay?: '1'; // when attribute autoPay in the page props, auto choose item and pay
  tradeType: TTradeType;
  tips?: string;
  costList?: TCostList;
};

export type TPayedListItem = {} & IPayListItem;

export type TPayDetailProp = {
  // 扫码有
  q?: string;
  // 直接扫码跳的详情, 目前只有濮阳有(体检缴费)
  _t?: '1';
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
  executionFlag: string; // 1 已执行
  subCostTypeCode: string;
  subCostTypeName: string;
  clinicId: string;
  serialNo: string;
  costList: {
    amount: string; // 总数
    itemPrice: string;
    itemSpec: string;
    subCost: string;
    sumSubCost: string;
    subCostTypeCode: string;
    subCostTypeName: string;
    units: string;
    detailNo: string;
    amountRem: string; // 可退费数量

    disabled?: boolean;
  }[];
}[];

export type TPayDetailInfo = {
  visitingMode?: string;
  medicineSpot: string;
  costList?: TCostList;
  patientName: string;
  cardNumber: string;
  hosId: string;
  hosName: string;
  medicalCost: string;
  payState: string;
  personCost: string;
  hospitalCost: string;
  totalCost: string;
  favoredReduce: string;
  invoiceNumber: string; // 发票号
  qrCode: string;
  invoiceInfo?: {
    appId: string;
    path: string;
    type: 'h5' | 'wx' | 'alipay';
  };
};

export type TPayConfirmPageProp = {
  hosId: string;
  serialNo: string;
  visitNo: string;
  visitDate: string;
  mergeOrder: string;
  cardNumber?: string;
  clinicType?: string;

  params?: string; // 扫码时候
  deParams?: {
    serialNo: string;
    visitNo: string;
    cardNumber: string;
    branchHosp: string; // 院内的院区id
  };
  mzParams?: string;
  payNextActionParams?: string; //扫码第三方缴费回调

  _type?: 'order' | 'yunUrl';
  orderId?: string;
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
  regAppTradeNo?: string;
};

// 定义支付类型枚举
export enum PayType {
  Online = 0,
  Offline = 1,
  Medicare = 2,
  BizType = 3,
  Digital = 4,
  NavToMini = 5,
}

type PayListItem = {
  label: string;
  key: string;
  sort: number;
};

type TMedicalConfig = Exclude<ISConfig['medicalMHelp'], undefined>;
export const getMedicalConfigInfo = ():
  | (TMedicalConfig['wx'] & TMedicalConfig['alipay'])
  | null => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  if (medicalMHelp) {
    const { alipay, wx } = medicalMHelp as any;
    // #ifdef MP-ALIPAY
    if (alipay) {
      return alipay;
    }
    // #endif

    // #ifdef  MP-WEIXIN
    if (wx) {
      return wx;
    }
    // #endif
  }

  return null;
};

export const getMedicalNationInfo = () => {
  const res = getMedicalConfigInfo();
  if (res) {
    return res.medicalNation;
  }

  return null;
};

/** 是否医保插件模式 */
export const getIsMedicalModePlugin = () => {
  return !!getMedicalConfigInfo()?.medicalPlugin;
};

/** 是否自动赋值医保状态 */
export const getIsMedicalTradeTypeDefault = () => {
  return !!getMedicalConfigInfo()?.medicalDefault;
};

/** 支付宝国标医保? */
export const getIsAliMedicalNation = () => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  return !!medicalMHelp?.alipay?.medicalNation;
};

/** 是否医保 */
export const getIsMedicalMode = () => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  if (getIsMedicalModePlugin()) return true;
  if (medicalMHelp) {
    const { wx, alipay } = medicalMHelp;

    // #ifdef  MP-WEIXIN
    if (wx) {
      const { medicalPlugin, medicalNation, medical1001035 } = wx;

      if (medicalPlugin === '1' || medicalNation || medical1001035) {
        return true;
      }
    }
    // #endif

    // #ifdef MP-ALIPAY
    if (!!alipay?.medicalNation) {
      return true;
    } else if (!!alipay?.navgateToZLminiProm) {
      return true;
    }
    // #endif
  }

  return false;
};

export const getMedicalAuthCode = async (opt?: {
  userName?: string;
  idCard?: string;
}): Promise<string> => {
  let fCode = '';

  const gStores = new GStores();
  const cacheStore = useCacheStore();

  const {
    sConfig: { medicalMHelp },
  } = globalGl;
  const { alipay, wx: _wx } = medicalMHelp!;

  // #ifdef MP-WEIXIN
  const qrCode =
    gStores.globalStore.appShowData.referrerInfo?.extraData?.authCode || '';

  if (!qrCode) {
    const w = _wx!;
    const { medicalNation } = w;
    let { appId, path, pathExtraData } = medicalNation!;
    if (pathExtraData) {
      path = joinQuery(path, pathExtraData);
    }

    setLocalStorage({
      'get-wx-medical-auth-code': '1',
    });

    await new Promise((success, j) => {
      let envVersion: any = globalGl.env === 'prod' ? 'release' : 'trial';
      uni.navigateToMiniProgram({
        appId,
        // path: path + `&familyId=${wMd5.hex_md5_32('王童蛟0738'.toUpperCase())}`,
        path: joinQuery(path, cacheStore.medicalPathArg),
        envVersion,
        fail({ errMsg }) {
          if (errMsg.includes('fail cancel')) {
            setLocalStorage({
              'get-wx-medical-auth-code': '',
            });

            gStores.messageStore.showMessage(
              '未完成电子医保凭证授权,无法继续医保结算'
            );
          }
          j('取消请求授权...');
        },
        success,
      });
    });

    return Promise.reject('请求授权...');
  } else {
    fCode = qrCode;

    gStores.globalStore.onAppShow({});
  }
  // #endif

  // #ifdef MP-ALIPAY
  const { authCode } = await apiAsync(my.getAuthCode, {
    scopes: ['nhsamp', 'auth_user'],
  });

  fCode = authCode;
  // #endif

  return fCode;
};

export const _getQxMedicalNation = async (
  payload = {} as {
    returnUrl?: string;
    params?: string;
  }
) => {
  const {
    returnUrl = '/pagesA/clinicPay/clinicPayDetail',
    params: enHosPatientId,
  } = payload;
  const gStores = new GStores();
  const cacheStore = useCacheStore();
  const qrCode = await getMedicalAuthCode();
  const { patientId } = gStores.userStore.patChoose;

  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  const { wx: _wx } = medicalMHelp!;
  let authorizeType = '1';
  let authorizeTypeDesc = '1';
  // #ifdef MP-ALIPAY
  authorizeType = '2';
  authorizeTypeDesc = '2';
  // #endif

  const requestArg = {
    ...cacheStore.medicalAuthArg,
    enHosPatientId: '',
    // patientId: (!enHosPatientId && patientId) || undefined,
    patientId: patientId || undefined,
    authorizeType,
    authorizeTypeDesc,
    aliPayUserId: '',
    callUrl: '',
    openId: '',
    qrCode,
  };

  //请亲付字段，先根据系统码判断添加，等待后端接口兼容
  // if (globalGl.SYS_CODE === '1001057') {
  requestArg.patientId = (!enHosPatientId && patientId) || undefined;
  if (enHosPatientId) {
    requestArg.enHosPatientId = enHosPatientId;
  }
  // }
  // #ifdef  MP-WEIXIN

  requestArg.openId = gStores.globalStore.openId;
  if (requestArg.openId === '') {
    requestArg.openId = await getOpenId();
  }
  // #endif

  // #ifdef MP-ALIPAY
  requestArg.aliPayUserId = gStores.globalStore.openId;
  if (!gStores.globalStore.openId) {
    requestArg.aliPayUserId = await getOpenId();
  }
  await api.authorization({
    ...cacheStore.medicalPathArg,
    accountType: 21,
    code: qrCode,
    userId: requestArg.aliPayUserId,
    scope: 'medical_ali_pay',
  });

  requestArg.callUrl = `alipays://platformapi/startapp?appId=${globalGl.systemInfo.alipayAppid}&page=${returnUrl}`;

  // #endif

  const { result } = await api.authorize<any>(requestArg);

  if (result.userLongitudeLatitude) {
    result.userLongitudeLatitude = JSON.parse(result.userLongitudeLatitude);
  }

  // #ifdef MP-ALIPAY
  let { latitude, longitude } = await apiAsync(uni.getLocation, {});
  if (!(longitude && latitude)) {
    gStores.messageStore.showMessage('获取定位失败, 无法继续医保结算...');
    return Promise.reject('获取定位失败, 无法继续医保结算...');
  }

  latitude = ((latitude * 1).toFixed(6) as unknown as number) * 1;
  longitude = ((longitude * 1).toFixed(6) as unknown as number) * 1;

  result.userLongitudeLatitude = {
    latitude,
    longitude,
  };
  // #endif
  result.payAuthNo = result.payAuthNo || result.familyPayAuthNo;
  result.loginIdCard = result.idCard;

  let playMedicalCount = getLocalStorage('playMedicalCount');
  if (!playMedicalCount) {
    playMedicalCount = 1;
    setLocalStorage({
      playMedicalCount,
    });
  }

  return <TWxAuthorize>result;
};

/** 获取国标授权 */
export const getQxMedicalNation = async (
  payload = {} as {
    returnUrl?: string;
    params?: string;
  }
) => {
  const gStores = new GStores();
  const medical1001035 = await getMedical1001035Info();
  if (medical1001035) {
    const { patientName } = gStores.userStore.patChoose;
    const { idCard } = await new PatientUtils().getPatientPersonalInfo({
      idCard: true,
    });

    const authorize = await getWxMedicalAuth1001035({
      userName: patientName,
      idCard,
    });

    return authorize as TWxAuthorize;
  }

  const { returnUrl = '/pagesA/clinicPay/clinicPayDetail', params } = payload;
  const result = (await _getQxMedicalNation({
    returnUrl,
    params,
  })) as any;

  // #ifdef MP-ALIPAY
  const { authUrl, payAuthNo } = result;
  if (!payAuthNo) {
    setLocalStorage({
      'get-ali-medical-auth-code': '1',
    });
    my.ap.navigateToAlipayPage({
      path: encodeURI(authUrl),
    });

    return Promise.reject('需要医保授权...');
  }
  // #endif

  return <TWxAuthorize>result;
};

/** 国标医保费用明细上传 */
export const medicalNationUpload = async (
  detail: Partial<
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
  const { userLongitudeLatitude, userName } = auth;
  let [longitude, latitude] = ['', ''];
  if (userLongitudeLatitude) {
    longitude = userLongitudeLatitude.longitude;
    latitude = userLongitudeLatitude.latitude;
  }

  const { patientId } = gStores.userStore.patChoose;
  const { source } = gStores.globalStore.browser;
  const requestArg = {
    ...auth,
    ...detail,
    ...additional,
    patientName: additional.patientName,
    mergeOrder: detail.childOrder,
    patientId,
    longitude,
    latitude,
    source,
    accountUseFlag: true,
    authorizeTypeDesc,
  };

  const actionApi =
    gStores.globalStore.sysCode === '1001035'
      ? api.medicalCostInfoUploadSz
      : api.medicalCostInfoUpload;

  const { result } = await actionApi<any>(requestArg, true);

  return <TMedicalNationUploadRes>result;
};

export const getMedicalArgWithFamily = async (params?: string) => {
  const medicalMHelp = getMedicalConfigInfo();
  const isOpenFamilyMedical = medicalMHelp?.isGbFamilyPayment === '1';
  const gStores = new GStores();
  const cacheStore = useCacheStore();

  if (isOpenFamilyMedical) {
    let args: any = {
      patientId: gStores.userStore.patChoose.patientId,
    };

    let actionApi = api.getFamilyId;
    if (params) {
      actionApi = api.getIdCardAfter;
      args = {
        signParam: params,
      };
    }

    const {
      result: { familyIdEncode },
    } = await actionApi(args);

    cacheStore.changeMedicalPathArg({
      familyId: familyIdEncode,
    });

    await wait(0);
  }
};

export const getMedicalAuthArg = async (params?: string) => {
  const cacheStore = useCacheStore();
  const gStores = new GStores();
  const { patientId } = gStores.userStore.patChoose;

  cacheStore.changeMedicalAuthArg({
    patientId: !params && patientId,
    enHosPatientId: params,
  });
};

let _isCanUseMedical: boolean | null = null;
/** 支付宝医保插件模式时候 校验就诊人是否能使用医保插件 */
export const isCanUseMedical = async (cardNumber: string): Promise<boolean> => {
  if (_isCanUseMedical !== null) {
    return _isCanUseMedical;
  }

  // #ifdef MP-ALIPAY
  await new Promise(async (resolve, reject) => {
    const { authCode } = await apiAsync(my.getAuthCode, {
      scopes: 'auth_user',
    });

    const { result } = await api.alipayVerifiSelf({
      cardNumber,
      code: authCode,
    });

    if (!result) {
      return reject(void 0);
    }

    let { isSelf } = result;
    _isCanUseMedical = isSelf;
    // _isCanUseMedical = true;
    setTimeout(() => {
      resolve(void 0);
    });
  });

  // #endif

  return !!_isCanUseMedical;
};

/** 只考虑登录时候 校验就诊人是否能使用国标医保 */
export const isCanUseMedicalNational = async (): Promise<boolean> => {
  const { relationship } = new GStores().userStore.patChoose;
  // return true
  return relationship === '本人';
};

/** 是否需要过滤医保 仅本人使用 */
export const _isMedicalSelf = async () => {
  return getIsMedicalMode();
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
export const isMedicalSelf = async (
  cardNumber: string,
  params?: string
): Promise<boolean> => {
  // #ifdef  MP-WEIXIN
  if (params) {
    return true;
  }
  // #endif

  if (await _isMedicalSelf()) {
    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    const { alipay, wx } = medicalMHelp!;

    // #ifdef MP-ALIPAY
    if (alipay) {
      const { medicalPlugin, medicalNation, isFamilyPayment } = alipay;

      /**
       * 支付宝医保插件模式只能是本人
       * 插件医保 亲情付 不需要本人判断
       */
      if (medicalPlugin || medicalNation) {
        if (isFamilyPayment === '1') {
          return true;
        } else {
          //支付宝插件模式必须判断本人，不然会导致给其他就诊人医保支付
          return await isCanUseMedical(cardNumber);
          // return true;
        }
      }
    }
    // #endif

    // #ifdef  MP-WEIXIN
    if (wx) {
      const { medicalNation, medicalPlugin, medical1001035 } = wx;

      if (medicalNation || medicalPlugin || medical1001035) {
        return true;
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
  const cacheStore = useCacheStore();
  const selHosRef = ref('' as any);
  const tabCurrent = ref(0);
  const hosId = ref('');
  const isPayListRequestComplete = ref(false);
  const tabField = computed(() => [
    {
      label: '待' + kw1.value,
      key: 0,
    },
    {
      label: '已' + kw1.value,
      key: 1,
    },
  ]);

  const kw1 = computed(() =>
    gStores.globalStore.sysCode === '1001035' ? '交费' : '缴费'
  );

  const refPay = ref<any>('');
  const payArg = ref<BaseObject>({});
  const refPayList = ref([
    {
      label: '自费支付',
      key: 'online',
    },
  ]);
  const wxPryMoneyMedicalDialog = ref('' as any);
  const wxCrossProgramInfo = ref({
    appId: '',
    bizType: '',
    bizTypeReg: '',
    extInfo: {},
  });

  const isWx = ref(false);

  // #ifdef  MP-WEIXIN
  isWx.value = true;
  const {
    sConfig: { medicalMHelp },
    systemConfig: { alipayAppid },
  } = globalGl;
  if (medicalMHelp) {
    const { wx } = medicalMHelp;
    if (wx) {
      const clinicBizType = wx?.crossProgramBizType?.clinic || '';
      const regBizType = wx?.crossProgramBizType?.reg || '';
      if (clinicBizType || regBizType) {
        wxCrossProgramInfo.value = {
          appId: alipayAppid,
          bizType: clinicBizType,
          bizTypeReg: regBizType,
          extInfo: {},
        };
      }
    }
  }
  // #endif

  let tabChange = (idx: number) => {
    tabCurrent.value = idx;

    getListData();
  };

  tabChange = debounce(tabChange, 80, false);

  const pageProps = ref(
    {} as {
      tabIndex?: '1';
      visitNo?: string; // 此时获取待缴费列表后应该选中并 采取缴费操作
      hosId?: string;

      params?: string;
      deParams: {
        cardNumber?: string;
        patientName?: string;
      };
      payNextActionParams?: string; // 携带优于配置参数TButtonConfig

      // -----------
      // 药品配送模式, 此时不显示tab, 内容已取药 点击列表去取药页面
      mode?: 'medicalHelp';
    }
  );

  const unPayList = ref<IPayListItem[]>([]);
  const selUnPayList = ref<IPayListItem[]>([]);
  const payedList = ref<TPayedListItem[]>([]);
  const totalCost = computed(() => {
    let _subCount = selUnPayList.value.reduce((prev, curr) => {
      return prev + (curr.totalCost as unknown as number) * 1;
    }, 0);
    if (isListCanPayedItem.value) {
      _subCount =
        selUnPayList.value[0]?.costList?.reduce((prev, curr) => {
          return prev + (curr.subCost as unknown as number) * 1;
        }, 0) || 0;
    }

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

  // 模式-药品配送
  const isModeMedicalHelp = computed(() => {
    return pageProps.value.mode === 'medicalHelp';
  });

  //模式-门诊缴费列表分项支付
  const isListCanPayedItem = computed(() => {
    return pageConfig.value?.isListCanPayedItem === '1' || false;
  });

  // 可以选择性支付
  const isCanSelServerFee = computed(() => {
    let isMedicalPay = false;
    const isMedicalModePlugin = getIsMedicalModePlugin();
    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    if (isMedicalModePlugin) {
      isMedicalPay = true;

      if (medicalMHelp) {
        const { wx: _wx } = medicalMHelp;
        // #ifdef  MP-WEIXIN
        if (_wx) {
          const { medicalNation } = _wx;

          if (medicalNation) {
            // 微信国标可以选择缴费
            isMedicalPay = false;
          }
        }
        // #endif
      }
    }

    isMedicalPay = isMedicalPay && selUnPayList.value[0].costTypeCode === '2';

    return (
      pageConfig.value.isSubitemPay === '1' && !isMedicalPay // 医保不支持选择
    );
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
        pageProps.value.deParams = {};
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

      uni.hideLoading();
      pageProps.value.deParams = {};
    }

    unPayList.value = [];

    const { clinicalSettlementResultList, cardNumber, patientName } =
      result || {};

    dealPayList(clinicalSettlementResultList, { payState: '1' });
    unPayList.value = clinicalSettlementResultList;
    if (cardNumber) {
      pageProps.value.deParams = {
        cardNumber,
        patientName,
      };
    }
    if (isListCanPayedItem.value) {
      const allPromise: any = [];
      unPayList.value.forEach((item, index) => {
        const actionApi = desSecret
          ? api.getScanClinicalPayDetailList
          : api.getClinicalPayDetailList;
        let promise = new Promise(async (rl, rj) => {
          const requestArg: any = {
            ...item,
            patientId,
            source: gStores.globalStore.browser.source,
          };
          if (desSecret) {
            requestArg.patientId = undefined as unknown as any;
            requestArg.desSecret = desSecret;
          }
          const { result } = await actionApi<TPayDetailInfo>(requestArg);
          if (result) {
            const { costList } = result;

            costList &&
              costList.map(({ costList }) => {
                costList.map((o) => {
                  const { amountRem } = o;

                  if (amountRem === '0') {
                    o.disabled = true;
                  }
                });
              });
            unPayList.value[index].costList = costList;
          }
          rl('success');
        });
        allPromise.push(promise);
      });
      await Promise.all(allPromise);
    }
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
      let actionApi = api.getPrepaidClinicList;
      const arg = {
        patientId,
        hosId: hosId.value,
      };

      if (isModeMedicalHelp.value) {
        Object.assign(arg, {
          endDate: dayjs().format('YYYY-MM-DD'),
          startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
          type: 0,
        });

        const { result: r = [] } = await api
          .getOutpatientHospitalList(arg)
          .finally(() => {
            isPayListRequestComplete.value = true;
          });

        r.map((o) => {
          o.visitDate = o.admissionTime;
        });
        result = {
          clinicPayListDetailResults: r,
          cardNumber: gStores.userStore.patChoose.cardNumber,
          patientName: gStores.userStore.patChoose.patientName,
        } as any;
      } else {
        const { result: r } = await actionApi<{
          clinicPayListDetailResults: TPayedListItem[];
        }>(arg).finally(() => {
          isPayListRequestComplete.value = true;
        });

        result = r;
      }
    }

    const resList = (result && result.clinicPayListDetailResults) || [];

    dealPayList(resList, { payState: '0' });

    payedList.value = resList;

    if (result) {
      pageProps.value.deParams = {
        cardNumber: result.cardNumber,
        patientName: result.patientName,
      };
    } else {
      pageProps.value.deParams = {};
    }
  };

  /**
   * - childOrder 是唯一标识， 重复会跪
   * - subIds 同样表示可以一起勾选
   *
   * @param item
   */
  const selPayListItem = (item: IPayListItem, type?: 'notMerge') => {
    const { childOrder } = item;

    const idx = selUnPayList.value.findIndex(
      (o) => o.childOrder === childOrder
    );

    if (idx === -1) {
      if (isUnPayListSelRadio.value || type === 'notMerge') {
        selUnPayList.value = [{ ...item }];
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
      if (
        type === 'notMerge' &&
        selUnPayList.value[0]?.costList?.length !== item?.costList?.length
      ) {
        selUnPayList.value = [{ ...item }];
        return;
      }
      selUnPayList.value.splice(idx, 1);
    }
  };

  const selDeailtItem = (item: IPayListItem, detailItem: TCostList[number]) => {
    // selUnPayList.value[0]=
    if (
      !selUnPayList?.value?.length ||
      item.childOrder != selUnPayList.value[0].childOrder
    ) {
      selUnPayList.value = [{ ...item, costList: [] }];
    }
    const { serialNo, clinicId } = detailItem;
    const idx = selUnPayList.value[0]?.costList?.findIndex(
      (o) => o.serialNo === serialNo
    );
    if (idx === -1) {
      const allItem = item.costList!.filter(
        (o) => o.serialNo === serialNo || (clinicId && o.clinicId == clinicId)
      );
      selUnPayList.value[0]?.costList?.push(...allItem);
    } else {
      selUnPayList.value[0].costList = selUnPayList.value[0]?.costList?.filter(
        (o) => o.serialNo !== serialNo
      );
      if (!selUnPayList.value[0].costList?.length) {
        selUnPayList.value = [];
      }
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
      hosId: hosId || pageProps.value.hosId,
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
      cardNumber:
        pageProps.value.deParams?.cardNumber ||
        gStores.userStore.patChoose.cardNumber,
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

  let isGetListDataFirst = true;
  let getListData = async (isReset = true) => {
    if (isReset) {
      const isKeepSel = getLocalStorage('keepSelUnPayList') === '1';
      unPayList.value = [];
      payedList.value = [];

      // 医保回来保存数据
      if (isKeepSel) {
        setLocalStorage({
          keepSelUnPayList: '',
        });
      } else {
        selUnPayList.value = [];
      }
    }

    if (tabCurrent.value === 0) {
      await getUnPayList();

      if (tabCurrent.value === 0 && isGetListDataFirst) {
        isGetListDataFirst = false;
        if (pageProps.value.visitNo) {
          unPayList.value.map((o) => {
            if (o.visitNo === pageProps.value.visitNo) {
              selUnPayList.value.push(o);
            }
          });

          if (selUnPayList.value.length) {
            nextTick(() => {
              handlerPay();
            });
          }
        }
      }
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

  /**
   * 创建订单 获取支付入参数据
   */

  const payBeforeCreateData = async () => {
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
      patientId: pageProps.value.params ? '' : patientId,
      source,
      totalCost: _totalCost,
      hosId: selectList[0].hosId,
      hosName: selectList[0].hosName,
      visitDate: selectList[0].visitDate,
      mergeOrder: selectList.map((o) => o.childOrder).join(','),
      medOrgOrd: selectList.map((o) => o.medOrgOrd).join(','),
      deptCode: selectList.map((o) => o.deptId).join(','),
      deptName: selectList.map((o) => o.deptName).join(','),
      docCode: selectList.map((o) => o.docId).join(','),
      docName: selectList.map((o) => o.docName).join(','),
      recipeNo: selectList.map((o) => o.recipeNo).join(','),
      serialNo: selectList.map((o) => o.serialNo).join(';'),

      diseaseTypeCode: selectList
        .map((o) => o.diseaseTypeCode)
        .filter((o) => o)
        .join(','),
      diseaseTypeName: selectList
        .map((o) => o.diseaseTypeName)
        .filter((o) => o)
        .join(','),
      diseaseType: selectList
        .map((o) => o.diseaseType)
        .filter((o) => o)
        .join(','),
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
      patientId: pageProps.value.params ? undefined : patientId,
    };

    if (pageProps.value.deParams) {
      payArg.patientName = pageProps.value.deParams.patientName;
      payArg.cardNumber = pageProps.value.deParams.cardNumber;
    } else {
      payArg.patientName = patientName;
    }
    return payArg;
  };

  const payDetailBeforeCreateData = async () => {
    const { patientId, patientName } = gStores.userStore.patChoose;
    const _totalCost = totalCost.value + '';
    const source = gStores.globalStore.browser.source;
    const { cardNumber: _cardNumber, patientName: _patientName } =
      gStores.userStore.patChoose;
    let {
      childOrder,
      deptId,
      docId,
      hosName,
      deptName,
      docName,
      hosId,
      visitDate,
      costTypeCode,
      cardNumber = _cardNumber,
      recipeNo,
    } = selUnPayList.value[0];
    const _patientId = pageProps.value.params ? '' : patientId;
    let personalPayFee: any;
    personalPayFee =
      ((!costTypeCode || costTypeCode === '1') && totalCost.value) || undefined;

    const serialNo = selUnPayList.value[0]?.costList
      ?.map((o) => o.serialNo)
      .filter((o) => o)
      .join(',');
    const args: any = {
      personalPayFee,
      patientName: _patientName,
      businessType: '1',
      patientId: _patientId,
      source,
      totalCost: _totalCost,
      mergeOrder: childOrder,
      deptCode: deptId,
      hosName,
      deptName,
      docCode: docId,
      docName,
      hosId,
      visitDate,
      cardNumber,
      recipeNo,
      serialNo,
    };
    console.log('args', args);
    const {
      result: { phsOrderNo },
    } = await api.createClinicOrder(args);

    const payArg: BaseObject = {
      phsOrderNo,
      totalFee: _totalCost,
      phsOrderSource: '2',
      hosId,
      hosName,
      patientName: _patientName || patientName,
      cardNumber,
      patientId: _patientId,
    };
    return payArg;
  };

  /**
   * 是否开启数字人民币支付
   * @returns boolean
   */

  const getIsDigitalPay = (data) => {
    const { payList } = data;
    if (payList) {
      const { alipay, wx } = payList!;

      // #ifdef MP-ALIPAY
      if (alipay) {
        const { digital } = alipay;

        if (digital) {
          return true;
        }
      }
      // #endif

      // #ifdef  MP-WEIXIN
      if (wx) {
        const { digital } = wx;

        if (digital) {
          return true;
        }
      }
      // #endif
    }

    return false;
  };

  /**
   * 是否跳转浙里医保小程序
   * @returns boolean
   */

  const getIsNavToMini = () => {
    let flag = false;
    // #ifdef MP-ALIPAY
    const medicalMHelp = getMedicalConfigInfo() as any;
    try {
      const hosId = selUnPayList.value[0].hosId;
      flag = !!medicalMHelp?.navgateToZLminiProm?.orgId[hosId];
    } catch (e) {
      console.warn('未获取到跳转浙里医保小程序对应医院的orgId', e);
    }
    // #endif
    return flag;
  };

  const handlerPay = async () => {
    if (!selUnPayList.value.length) {
      gStores.messageStore.showMessage('请选择至少一项进行缴费', 3000);
      return;
    }

    if (pageConfig.value.confirmPayFg) {
      const isMedicalMode = getIsMedicalMode();

      if (isMedicalMode) {
        const { cardNumber } = gStores.userStore.patChoose;
        const isOpenFamilyMedical =
          getMedicalConfigInfo()?.isGbFamilyPayment === '1';
        let flag =
          isOpenFamilyMedical ||
          (await isMedicalSelf(
            pageProps.value.deParams?.cardNumber || cardNumber
          ));
        flag = true;
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

  const determinePayType = (opt: {
    isMedicalMode: boolean;
    isDigitalPay: boolean;
    hasMedicalItem: boolean;
    isMedicalSelf: boolean;
    isBizTypeMedical: boolean;
    isMedicalPlugin: boolean;
    isNavgateToZLminiProm: boolean;
  }) => {
    const {
      isMedicalMode,
      isDigitalPay,
      hasMedicalItem,
      isMedicalSelf,
      isBizTypeMedical,
      isMedicalPlugin,
      isNavgateToZLminiProm,
    } = opt;
    let payTypeList = [PayType.Online];
    if (isMedicalMode) {
      if (hasMedicalItem || isDefaultMedical()) {
        if (isMedicalSelf) {
          // #ifdef MP-ALIPAY
          payTypeList.push(PayType.Medicare);
          // #endif
          // #ifdef MP-WEIXIN
          if (!isMedicalPlugin || !isBizTypeMedical) {
            payTypeList.push(PayType.Medicare);
          }
          // #endif
        }
        if (isBizTypeMedical) {
          payTypeList.push(PayType.BizType);
        }
        if (isNavgateToZLminiProm) {
          payTypeList.push(PayType.NavToMini);
        }
      }
    }
    if (isDigitalPay) {
      payTypeList.push(PayType.Digital);
    }

    return payTypeList;
  };

  const getPay = async () => {
    const isMedicalMode = getIsMedicalMode();
    const isDigitalPay = getIsDigitalPay(pageConfig.value);
    const hasMedicalItem = selUnPayList.value.some(
      (o) => o.costTypeCode === '2'
    );
    const medicalMHelp = getMedicalConfigInfo() || {};
    const { isFamilyPayment, isGbFamilyPayment } = medicalMHelp;

    const isOpenFamilyMedical =
      isGbFamilyPayment === '1' || isFamilyPayment === '1';
    const isBizTypeMedical =
      medicalMHelp?.crossProgramBizType?.clinic !== undefined;
    const isMedicalPlugin = medicalMHelp?.medicalPlugin === '1';
    const isNavgateToZLminiProm = getIsNavToMini();
    const payTypeList = determinePayType({
      isMedicalMode,
      isDigitalPay,
      hasMedicalItem,
      isMedicalSelf:
        isOpenFamilyMedical ||
        (await isMedicalSelf(
          pageProps.value.deParams?.cardNumber ||
            gStores.userStore.patChoose.cardNumber,
          pageProps.value.params
        )),
      isBizTypeMedical,
      isMedicalPlugin,
      isNavgateToZLminiProm,
    });

    let additionalList: any[] = [];
    if (globalGl.SYS_CODE === '1001052') {
      additionalList.push({
        label: '医保账户支付',
        key: 'online',
        sort: 3,
      });
    }

    changeRefPayList(payTypeList, additionalList);
    await wait(200);
    refPay.value.show();
  };

  const getPayListLabel = () => {
    const {
      sConfig: { medicalMHelp },
      systemConfig: { isvAlipayAppid },
    } = globalGl;
    const wx = medicalMHelp?.wx;

    // 定义支付方式配置
    const payMethodConfig = {
      labelPay: '自费支付',
      medicalPay: '医保支付',
    };

    // #ifdef MP-WEIXIN
    payMethodConfig.medicalPay = '微信医保支付';
    if (wx) {
      const { medicalNation, medicalPlugin } = wx!;

      if (medicalPlugin === '1') {
        payMethodConfig.medicalPay = '支付宝医保支付';
      }
    }
    payMethodConfig.labelPay = '微信自费支付';
    // #endif

    // #ifdef MP-ALIPAY
    payMethodConfig.labelPay = '支付宝自费支付';
    if (getIsFamilyPayment()) {
      payMethodConfig.medicalPay = '支付宝医保支付(支持亲情付)';
    }
    // #endif

    return payMethodConfig;
  };

  const changeRefPayList = (
    typeList: PayType[],
    additionalList: PayListItem[] = []
  ) => {
    const { labelPay, medicalPay } = getPayListLabel();

    const tList: PayListItem[] = [
      {
        label: '到院支付',
        key: 'offline',
        sort: 1,
      },
      {
        label: labelPay,
        key: 'online',
        sort: 2,
      },
      // #ifdef MP-WEIXIN
      {
        label: '支付宝医保支付',
        key: 'bizType',
        sort: 4,
      },
      // #endif
      {
        label: '数字人民币支付',
        key: 'digital',
        sort: 5,
      },
      {
        label: medicalPay,
        key: 'medicare',
        sort: 3,
      },
      // #ifdef MP-ALIPAY
      {
        label: '浙里医保小程序结算',
        key: 'navToMini',
        sort: 6,
      },
      // #endif
    ] as const;

    const rList: string[] = ['online'];

    typeList.map((item) => {
      switch (item) {
        case PayType.Offline:
          rList.push('offline');
          break;
        case PayType.Medicare:
          rList.push('medicare');
          break;
        // #ifdef MP-WEIXIN
        case PayType.BizType:
          rList.push('bizType');
          break;
        // #endif
        case PayType.Digital:
          rList.push('digital');
          break;
        case PayType.NavToMini:
          rList.push('navToMini');
          break;
      }
    });

    const arr = tList.filter((o) => rList.includes(o.key));
    arr.push(...additionalList);
    refPayList.value = arr.sort((a, b) => a.sort - b.sort);
  };

  const getPayInfo = async ({ item }: { item: IGPay }) => {
    setLocalStorage({
      selUnPayList: selUnPayList.value,
    });

    if (isListCanPayedItem.value) {
      if (item.key === 'online') {
        setLocalStorage({
          selUnPayDetailList: {
            selList: selUnPayList.value[0].costList,
          },
        });

        const payArg = await payDetailBeforeCreateData();
        const res = await payMoneyOnline(payArg);
        await toPayPull(res, '门诊缴费');
        payAfter();
      } else {
        gStores.messageStore.showMessage('暂仅支持在线自费缴费');
      }
      return;
    }
    // item.key = 'medicare'

    // 自费
    if (item.key === 'online') {
      // 预结算
      if (pageConfig.value.isPreSettle === '1') {
        const selList = selUnPayList.value;

        goConfirmPage({
          hosId: selList[0].hosId,
          clinicType: selList[0].clinicType,
          serialNo: selList.map((o) => o.serialNo).join(';'),
          visitNo: selList.map((o) => o.visitNo).join(','),
          visitDate: selList.map((o) => o.visitDate).join(','),
          mergeOrder: selList.map((o) => o.childOrder).join(','),
          cardNumber: pageProps.value.deParams?.cardNumber,
          mzParams: pageProps.value.params,
          payNextActionParams: pageProps.value.payNextActionParams,
        });
      } else {
        toPay();
      }
    } else if (item.key === 'medicare') {
      const isMedicalMode = getIsMedicalMode();
      if (
        gStores.globalStore.sysCode === '1001033' &&
        selUnPayList.value.length > 1
      ) {
        gStores.messageStore.showMessage(
          '医保支付不能勾选多个单据，请逐一结算',
          1500
        );
        return;
      }

      if (isMedicalMode) {
        const medicalNationInfo = getMedicalNationInfo();
        const cardNumber = pageProps.value.params
          ? pageProps.value.deParams?.cardNumber
          : '';

        if (
          globalGl.sConfig.medicalMHelp?.isOpenPatToMedicalPat &&
          gStores.globalStore.sysCode !== '1001046'
        ) {
          await new PatientUtils().upToMedicalPat({
            pat: gStores.userStore.patChoose,
            cardNumber,
          });
        }
        await getMedicalArgWithFamily(pageProps.value.params);

        // #ifdef MP-ALIPAY
        if (getIsAliMedicalNation()) {
          payAliMedicalNation();
        } else {
          payMoneyMedicalPlugin();
        }
        // #endif

        // #ifdef  MP-WEIXIN
        if (medicalNationInfo && medicalNationInfo.dongRuanMedicalInfo) {
          const resultConfig = {
            cancelUrl: '/pagesA/clinicPay/clinicPayDetail',
            successUrl: '/pagesA/clinicPay/clinicPayDetail?tabIndex=1',
          };
          const medOrgOrd = selUnPayList.value
            .map((item) => item.serialNo)
            .join(',');

          handlerMedicalPayDongRuan({
            resultConfig,
            medOrgOrd,
          });
        } else {
          wxPayMoneyMedicalPlugin(medicalNationWx);
        }
        // #endif
      }
    } else if (item.key === 'digital') {
      let payArg = await payBeforeCreateData();
      getDigitalPay(
        pageConfig.value.payList!,
        '/pagesA/clinicPay/clinicPayDetail?tabIndex=1',
        payArg
      );
    } else if (item.key === 'bizType') {
      const {
        sConfig: { medicalMHelp },
      } = globalGl;

      const { wx } = medicalMHelp!;

      const clinicBizType = wx?.crossProgramBizType?.clinic;
      if (clinicBizType) {
        const curPagesList = getCurrentPages();
        const curPages: any = curPagesList[curPagesList.length - 1];

        const { openFunc } = curPages.selectComponent('#codePlugin');
        openFunc();
      }
    } else if (item.key === 'navToMini') {
      const {
        sConfig: { medicalMHelp },
      } = globalGl;

      const { alipay } = medicalMHelp!;
      const { hosId, hosName } = selUnPayList.value[0];
      const orgId = alipay?.navgateToZLminiProm?.orgId[hosId];
      useTBanner({
        type: 'otherProgram',
        path: `pages/loading/index?orgId=${orgId}&orgName=${hosName}`,
        appId: '2021003155652649',
      });
    }
  };

  /** ali 国标医保 */
  const payAliMedicalNation = async () => {
    uni.showLoading({
      title: '拉取医保授权码',
      mask: true,
    });

    const authorize = await getQxMedicalNation();

    uni.showLoading({
      title: '拉取缴费详情',
      mask: true,
    });

    const item = selUnPayList.value[0]!;
    const { getDetailData, detailData } = usePayDetailPage();
    const pat = gStores.userStore.patChoose;
    const cardNumber = pageProps.value.deParams?.cardNumber || pat.cardNumber;
    const patientName =
      pageProps.value.deParams?.patientName || pat.patientName;

    await getDetailData({
      cardNumber,
      ...pageProps.value,
      ...item,
    });

    uni.showLoading({
      title: '正在预结算...',
      mask: true,
    });

    const uploadRes = await medicalNationUpload(
      {
        ...item,
        ...detailData.value,
      },
      authorize,
      {
        // businessType: '1',
        cardNumber,
        patientName,
      }
    );

    uni.hideLoading();
    const info = {
      ...item,
      patientName,
      extend: authorize,
      // businessType: '1',
      phsOrderSource: '2',
      payAuthNo: authorize.payAuthNo,
      cardNumber: pageProps.value.deParams?.cardNumber || pat.cardNumber,
      patientId: pageProps.value.deParams?.cardNumber ? '' : pat.patientId,
      totalCost: detailData.value.totalCost,
      params: pageProps.value.params,
    };

    gStores.globalStore.assignCacheData({
      uploadRes,
      info,
    });

    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayMedical',
    });
  };

  // /** 数字人民币支付 */
  const getDigitalPay = async (configData, returnUrl, payArg) => {
    const { alipay, wx } = configData;
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
    const payArgNew: BaseObject = {
      ...payArg,
      channel: _channel,
      businessType: _businessType,
      returnUrl: `https://h5.eheren.com/v3/#/pagesC/common/rmbNumber?pageUrl=${encodeURIComponent(
        returnUrl
      )}`,
    };

    const res = await payMoneyOnline(payArgNew);
    const { invokeData } = res;
    uni.navigateTo({
      url: `/pagesA/webView/webView?https=${encodeURIComponent(
        invokeData.payUrl!
      )}`,
    });
  };

  /**
   * 是否开启医保亲情付（目前仅支付宝）
   * @returns
   */
  const getIsFamilyPayment = () => {
    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    let isFamilyPay = false;

    if (medicalMHelp) {
      const { alipay } = medicalMHelp;

      // #ifdef MP-ALIPAY
      if (alipay?.isFamilyPayment) {
        isFamilyPay = true;
      }
      // #endif
    }

    return isFamilyPay;
  };

  /** 插件亲情付 新增入参 */
  const getFamilyArgs = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { result } = await api.getAliMedicalPat({
      hosId: selUnPayList.value[0].hosId,
      patientId: patientId,
    });
    return result;
  };

  /** 微信医保国标模式  获取到授权 */
  const medicalNationWx = async (payload: TWxAuthorize) => {
    // 医保必然是单选的(后端设置)
    const item = selUnPayList.value[0]!;
    const { getDetailData, detailData } = usePayDetailPage();
    const pat = gStores.userStore.patChoose;

    const cardNumber = pageProps.value.deParams?.cardNumber || pat.cardNumber;
    const patientName =
      pageProps.value.deParams?.patientName || pat.patientName;

    // if (gStores.globalStore.sysCode === '1001035') {
    // } else {
    //   await getDetailData({
    //     cardNumber,
    //     ...pageProps.value,
    //     ...item,
    //   });
    // }
    await getDetailData({
      cardNumber,
      ...pageProps.value,
      ...item,
    });

    uni.showLoading({
      title: '正在预结算...',
      mask: true,
    });
    const uploadRes = await medicalNationUpload(
      {
        ...item,
        ...detailData.value,
      },
      payload,
      {
        businessType: '1',
        cardNumber,
        patientName,
      }
    );
    uni.hideLoading();
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

    gStores.globalStore.assignCacheData({
      uploadRes,
      info,
    });

    const medical1001035 = await getMedical1001035Info();

    if (medical1001035) {
      // await payBeforeCreateData();
      api.sendMedicalMessage({
        phsOrderId: uploadRes.payOrderId,
        hosId: item.hosId,
      });

      handlerMedicalPay1001035({
        phsOrderSource: '2',
      });
      return;
    }

    uni.navigateTo({
      url: '/pagesA/clinicPay/clinicPayMedical',
    });
  };

  // 支付宝 插件医保
  const payMoneyMedicalPlugin = async () => {
    const isMedicalModePlugin = getIsMedicalModePlugin();

    const {
      sConfig: { medicalMHelp },
    } = globalGl;

    if (isMedicalModePlugin) {
      const { alipay } = medicalMHelp!;

      const { medicalPlugin, isFamilyPayment } = alipay!;
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

      const params: any = {
        orgId,
        cardType,
        cardNo,
        medOrgOrd,
      };

      if (isFamilyPayment === '1') {
        const { anotherIdNo, anotherName } = await getFamilyArgs();
        params.anotherIdNo = anotherIdNo;
        params.anotherName = anotherName;
      }

      const { authCode } = await apiAsync(my.getAuthCode, {
        scopes: ['auth_user', 'nhsamp'],
      });

      authPayPlugin.toAuthAndPay({
        // 授权获取的authCode
        authCode,
        // 请求接口所需参数
        params,
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
      systemConfig: { isvAlipayAppid },
    } = globalGl;

    const { wx } = medicalMHelp!;
    const patientUtil = new PatientUtils();

    if (wx) {
      const { medicalNation, medicalPlugin } = wx!;

      const medical1001035 = await getMedical1001035Info();
      if (medical1001035) {
        // 省中医保需要 name + idCard， 目前仅先接入登录流程
        if (pageProps.value.params) {
          throw new Error('暂未接入扫码医保');
        }
        const { patientName } = gStores.userStore.patChoose;
        const { idCard } = await patientUtil.getPatientPersonalInfo({
          idCard: true,
        });

        const authorize = await getWxMedicalAuth1001035({
          userName: patientName,
          idCard,
        });

        if (authorize) {
          callback(authorize as TWxAuthorize);
          return authorize;
        }
      } else if (medicalPlugin === '1') {
        wxPryMoneyMedicalDialog.value.show();
      } else if (medicalNation) {
        const authorize = await getQxMedicalNation({
          params: pageProps.value.params,
        });
        callback(authorize);
        return authorize;
      }
    }
  };

  const toPay = async () => {
    const payArg = await payBeforeCreateData();
    const res = await payMoneyOnline(payArg);

    await toPayPull(res, '门诊缴费');
    payAfter();
  };

  const payAfter = async () => {
    uni.showLoading({});
    await wait(1000);
    uni.hideLoading();

    // if(pageConfig.value?.isDrugPreemption){
    //   //释放库存

    // }
    const cardNumber =
      pageProps.value.deParams?.cardNumber ||
      gStores.userStore.patChoose.cardNumber;
    const { clinicType } = selUnPayList.value[0];

    const btnAdditionalData = {
      ...pageProps.value,
    };

    for (const key in btnAdditionalData) {
      btnAdditionalData[key] = encodeURIComponent(btnAdditionalData[key]);
    }

    await executeConfigPayAfter(clinicType, cardNumber, btnAdditionalData);

    selUnPayList.value = [];
    payedList.value = [];
    tabChange(1);

    setTimeout(async () => {
      if (!pageProps.value.params && globalGl.sConfig.isDrugDelivery === '1') {
        getDrugDeliveryList();
      }
      if (
        !pageProps.value.params &&
        pageConfig.value.isQueryChineseMedicine === '1'
      ) {
        getChineseMedicineList();
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
            gStores.messageStore.showMessage(error, 3000, {
              closeCallBack() {
                uni.reLaunch({ url: successCallBackUrl });
              },
            });
          },

          /**
           * 测试插件 v0.0.6 及以上，正式插件 v0.0.12 及以上
           * @param status 'ALIPAID'
           * @param ampTraceId
           * 支付宝支付成功回调, 执行时机详见流程图
           */
          aliPayDone: (status: string, ampTraceId: string) => {
            // do something
            uni.showLoading({});
            setTimeout(() => {
              uni.hideLoading();
              uni.reLaunch({
                url: joinQueryForUrl(successCallBackUrl, {
                  tabIndex: 1,
                }),
              });
            }, 5000);
          },

          // 支付模块-取消医保授权（处理逻辑示例，建议直接回跳至订单待支付页面）
          payCancelAuth: () => {
            uni.reLaunch({ url: successCallBackUrl });
          },

          /**
           * 第三个状态枚举值仅在测试插件 v0.0.8 及以上，正式插件 v0.0.14 及以上生效
           * 支付完成（成功或者失败）回调函数
           *
           * @param status 订单详细状态
           * @param ampTraceId id
           * @param finalStatus 状态简化版 SUCCESS-支付成功，FAIL-支付失败，EXP-异常，PENDING-查询中
           */
          payComplete: (
            status: string,
            ampTraceId: string,
            finalStatus: 'SUCCESS' | 'FAIL' | 'EXP' | 'PENDING'
          ) => {
            // do something
            // 建议跳转到小程序结果页面
            console.warn('payComplete payload----', {
              status,
              ampTraceId,
              finalStatus,
            });

            if (finalStatus === 'SUCCESS') {
              uni.showLoading({});
              setTimeout(() => {
                uni.hideLoading();
                uni.reLaunch({
                  url: joinQueryForUrl(successCallBackUrl, {
                    tabIndex: 1,
                  }),
                });
              }, 5000);
            } else {
              uni.reLaunch({ url: successCallBackUrl });
            }
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

  /** 查询草药代煎数据 */
  const getChineseMedicineList = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const cardNumber =
      pageProps.value.deParams?.cardNumber ||
      gStores.userStore.patChoose.cardNumber;

    try {
      const { result } = await api.getChineseMedicineList({
        cardNumber,
        patientId,
      });
      if (result?.results && result.results.length) {
        const { confirm, cancel } = await apiAsync(uni.showModal, {
          content: '本次缴费项目中含有中草药处方，是否需要代煎？',
          cancelText: '我要自煎',
          confirmText: '选药代煎',
        });

        if (confirm) {
          uni.navigateTo({
            url: joinQuery('/pagesA/clinicPay/medicineDecoce', {
              patientId,
              cardNumber,
            }),
          });
        }
        if (cancel) {
          uni.navigateTo({
            url: '/pagesB/medicationAssistant/medicalHelp',
          });
        }
      } else {
        uni.navigateTo({
          url: '/pagesB/medicationAssistant/medicalHelp',
        });
      }
    } catch (error) {
      console.error('获取中药代煎数据失败:', error);
    }
  };

  return {
    hosId,
    payMoneyMedicalPlugin,
    patChange,
    changeRefPayList,
    hookInit,
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
    wxCrossProgramInfo,
    wxPayMoneyMedicalPlugin,
    getDigitalPay,
    getIsDigitalPay,
    cacheStore,
    getFamilyArgs,
    isModeMedicalHelp,
    getChineseMedicineList,
    kw1,
    isListCanPayedItem,
    isCanSelServerFee,
    selDeailtItem,
  };
};

export const usePayDetailPage = () => {
  const detailData = ref({} as TPayDetailInfo);
  const gStores = new GStores();

  const getDetailData = async (arg: TPayDetailProp) => {
    let { patientId } = gStores.userStore.patChoose;

    const requestArg: any = {
      ...arg,
      patientId,
      source: gStores.globalStore.browser.source,
    };

    if (arg.params) {
      requestArg.patientId = undefined as unknown as any;
      requestArg.desSecret = arg.params;
    }

    const actionApi =
      arg._t === '1'
        ? api.getScanClinicalPayDetailList
        : api.getClinicalPayDetailList;

    const { result } = await actionApi<TPayDetailInfo>(requestArg);

    if (result) {
      const { costList } = result;

      costList &&
        costList.map(({ costList }) => {
          costList.map((o) => {
            const { amountRem } = o;

            if (amountRem === '0') {
              o.disabled = true;
            }
          });
        });
    }
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
  clinicType?: string, // '1' | '2' | '3'
  cardNumber?: string,
  additionData: any = {}
) => {
  //新增定制跳转 温附二互联网缴费跳转三方
  const { payNextActionParams } = additionData;

  if (payNextActionParams) {
    useTBanner(JSON.parse(payNextActionParams), 'redirectTo');
    return Promise.reject(void 0);
  }

  const { pageNextAdress, payNextAction } =
    await ServerStaticData.getSystemConfig('pay');

  if (pageNextAdress || payNextAction) {
    const configItem =
      pageNextAdress && pageNextAdress[clinicType as '1' | '2' | '3'];

    if (configItem) {
      const { mode, extraData: _extraData } = configItem;
      const extraData = _extraData || {};
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
              extraData,
            },
            'reLaunch'
          );

          return Promise.reject(void 0);

        // 药品助手
        case '2':
          useTBanner(
            {
              type: 'self',
              path: 'pagesB/medicationAssistant/medicalHelp',
              extraData: {
                _hosPd: cardNumber,
                ...extraData,
              },
            },
            'reLaunch'
          );

          return Promise.reject(void 0);

        // 门诊取号
        case '3':
          useTBanner(
            {
              type: 'self',
              path: 'pagesC/takeNumber/takeNumber',
              extraData: {
                ...extraData,
              },
            },
            'reLaunch'
          );
          return Promise.reject(void 0);
        default:
          break;
      }
    } else if (payNextAction) {
      useTBanner(payNextAction, 'redirectTo', additionData);
      return Promise.reject(void 0);
    }
  }
};

const dealPayList = (
  resList: IPayListItem[],
  {
    payState,
  }: {
    payState: '1' | '0';
  }
) => {
  const setCostTypeCodeDefault = getIsMedicalTradeTypeDefault();

  resList.map((o, i) => {
    o.payState = payState;

    if (setCostTypeCodeDefault && !o.costTypeCode) {
      o.costTypeCode = '2';
    }
  });
};

type TConstListItem = TCostList[number]['costList'][number];
export const compareDetailCostItem = (o: TConstListItem, k: TConstListItem) => {
  return k.detailNo === o.detailNo;
};
//医保建档
export const dealMedicalFiling = async (patientId, type = 'first') => {
  const authCode = await getMedicalAuthCode();
  const {
    sConfig: { medicalMHelp },
  } = globalGl;
  const gStores = new GStores();
  const patientUtil = new PatientUtils();
  // #ifdef MP-ALIPAY

  const { alipay } = medicalMHelp!;
  const { medicalPlugin } = alipay!;
  const authPayPlugin = requirePlugin('auth-pay-plugin');
  let orgId = '';
  Object.entries(medicalPlugin!.orgId).forEach(([k, v]) => {
    orgId = v;
  });
  let token = await authPayPlugin.toArchive({
    // 授权获取的authCode
    authCode,
    // 机构ID
    orgId,
  });
  if (type === 'first') {
    uni.setStorageSync('yibaoPatientId', patientId);
  } else {
    uni.removeStorageSync('yibaoPatientId');
  }

  if (token) {
    const res = await api
      .updateHosInfo({
        insPsnToken: token,
        patientId: patientId,
        herenId: patientUtil.globalStore.herenId,
        source: gStores.globalStore.browser.source,
      })
      .catch(async (err) => {
        await patientUtil.getPatCardList();
        setTimeout(() => {
          my.reLaunch({ url: `/pagesA/medicalCardMan/medicalCardMan` });
        }, 1600);
        throw new Error(err);
      });
    if (res && res.result) {
      uni.showToast({
        title: '您已更新为医保用户！',
        icon: 'none',
      });
      if (type === 'first') {
        return true;
      }
    }
  }
  await patientUtil.getPatCardList();
  setTimeout(() => {
    my.reLaunch({ url: `/pagesA/medicalCardMan/medicalCardMan` });
  }, 1600);
  // #endif
};

export const reDealMedicalFiling = async () => {
  let yibaoPatientId = '';
  const patientUtil = new PatientUtils();
  if (uni.getStorageSync('yibaoPatientId')) {
    yibaoPatientId = uni.getStorageSync('yibaoPatientId');
    uni.removeStorageSync('yibaoPatientId');
  } else {
    return;
  }
  // #ifdef MP-ALIPAY
  const authPayPlugin = requirePlugin('auth-pay-plugin');
  authPayPlugin.initMethods({
    // 获取建档返回的token
    getArchiveToken: async (token) => {
      if (token) dealMedicalFiling(yibaoPatientId, 'second');
      else {
        await patientUtil.getPatCardList();
        setTimeout(() => {
          my.reLaunch({ url: `/pagesA/medicalCardMan/medicalCardMan` });
        }, 1600);
      }
    },
  });
  // #endif
};

export const getMedical1001035Info = async () => {
  const {
    sConfig: { medicalMHelp },
  } = globalGl;

  const gStores = new GStores();
  const { wx: mwx } = medicalMHelp || {};
  if (gStores.globalStore.ev === 'wx' && mwx) {
    return mwx.medical1001035;
  }
};

// 省中微信智捷付
export const getWxMedicalAuth1001035 = async ({ userName, idCard }) => {
  const gStores = new GStores();
  const { ev } = gStores.globalStore;
  const medicalConfig1001035 = await getMedical1001035Info();

  if (medicalConfig1001035 && ev === 'wx') {
    const authInfo =
      gStores.globalStore.appShowData.referrerInfo?.extraData || {};
    const { ocToken, payAuthNo, userCardNo } = authInfo;

    if (ocToken && payAuthNo) {
      gStores.globalStore.onAppShow({});

      return {
        ocToken,
        payAuthNo,
        userCardNo,
        userName: authInfo.userName,
      };
    }

    const { extraData } = medicalConfig1001035.auth;
    await new Promise((success, j) => {
      setLocalStorage({
        'get-wx-medical-auth-code': '1',
      });
      uni.navigateToMiniProgram({
        ...medicalConfig1001035.auth,
        envVersion: globalGl.env === 'prod' ? 'release' : 'trial',
        extraData: {
          ...extraData,
          userName,
          idCard,
        },

        fail({ errMsg }) {
          if (errMsg.includes('fail cancel')) {
            setLocalStorage({
              'get-wx-medical-auth-code': '',
            });

            gStores.messageStore.showMessage(
              '未完成电子医保凭证授权,无法继续医保结算'
            );
          }
          j('取消请求授权...');
        },
        success,
      });
    });

    return Promise.reject('请求授权...');
  }
};

/**
 *
 * @param opt phsOrderSource 1-挂号 2-门诊
 * @returns
 */
export const handlerMedicalPay1001035 = async (opt: {
  phsOrderSource: '1' | '2';
}) => {
  const { phsOrderSource } = opt;
  const medical1001035 = await getMedical1001035Info();

  const gStores = new GStores();

  if (medical1001035) {
    const { uploadRes, info } = gStores.globalStore.cacheData;
    const {
      ocToken: octoken,
      payAuthNo: payAuthno,
      userName: familyName,
      userCardNo: familyIdNo,
    } = info.extend;
    const { payOrderId: orderId } = uploadRes;

    const extraData = {
      ...medical1001035.pay.extraData,
      ...uploadRes,
      sourcebusinessBj: phsOrderSource === '1' ? '11' : '12',
      orderId,
      payAuthno,
      octoken,
      familyName,
      familyIdNo,
    };
    console.log('拉医保extraData---');
    console.log(extraData);

    const { confirm } = await apiAsync(uni.showModal, {
      content: '即将打开医保小程序?',
    });

    if (!confirm) {
      return Promise.reject('客户取消支付');
    }

    uni.navigateToMiniProgram({
      ...medical1001035.pay,
      extraData,
      envVersion: globalGl.env === 'prod' ? 'release' : 'trial',
    });
  }
};

/**
 * 东软医保
 * @example
 *  resultConfig = {
 *    cancelUrl: '/pagesA/clinicPay/clinicPayDetail',
 *    successUrl: '/pagesA/clinicPay/clinicPayDetail?tabIndex=1
 *  }
 *
 */
export const handlerMedicalPayDongRuan = async ({
  medOrgOrd,
  resultConfig,
}: {
  /**
   * - cancelUrl 失败、取消回调
   * - successUrl 成功支付回调
   */
  resultConfig: {
    cancelUrl: string;
    successUrl: string;
  };
  medOrgOrd: string;
}) => {
  const medicalNationInfo = getMedicalNationInfo();
  const gStores = new GStores();
  const cacheStore = useCacheStore();

  if (!medicalNationInfo) {
    throw new Error('不存在医保配置');
  }
  const pathExtraData = medicalNationInfo.pathExtraData!;
  const dongRuanMedicalInfo = medicalNationInfo.dongRuanMedicalInfo!;
  const { orgCodg, orgAppId: appId } = pathExtraData;
  const authCode = await getMedicalAuthCode();
  cacheStore.changeCacheData2(resultConfig);
  // 溧阳亲情付拦截就诊中必须带 “本人” 标识的就诊人
  if (gStores.globalStore.sysCode === '1001084') {
    const { patList, patChoose } = gStores.userStore;
    if (patChoose.relationshipCode !== '1') {
      const selfPat = patList.find((o) => o.relationshipCode === '1');
      if (!selfPat) {
        gStores.messageStore.showMessage(
          '请先绑定本人就诊人信息再继续医保支付，如已绑定但无法操作可从家庭成员中删除然后重新绑定！',
          5000,
          {
            closeCallBack() {
              uni.navigateTo({
                url: joinQueryForUrl(globalGl.addPersonUrl, {
                  _url: resultConfig.cancelUrl,
                }),
              });
            },
          }
        );
        return;
      }
      await api.familyPayment({
        medOrgOrd,
        status: '1',
      });
    }
  }
  // https://ybj.jscz.org.cn/tiap/hsa-pmc-tiap-ui/
  await wait(20);
  const pageArg: any = {
    openid: gStores.globalStore.openId,
    medOrgOrd,
    orgCodg,
    appId,
    authCode,
  };

  // if (gStores.globalStore.sysCode === '1001048') {
  //   const {
  //     cancelUrl: cancelAuthRedirectUrl,
  //     successUrl: orderStatusRedirectUrl,
  //   } = resultConfig;

  //   pageArg.resultConfig = JSON.stringify({
  //     cancelAuthRedirectUrl,
  //     orderStatusRedirectUrl,
  //   });
  // }
  const url = joinQueryForUrl(
    `${dongRuanMedicalInfo.h5BaseUrl}/#/pay-loading`,
    pageArg
  );

  console.log(url);
  // return
  useTBanner({
    type: 'h5',
    path: url,
  });
};

declare const exports: any;
exports.getWxMedicalAuth1001035 = getWxMedicalAuth1001035;
