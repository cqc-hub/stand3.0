import { computed, ref } from 'vue';
import type { TInstance } from '@/components/g-form/index';
import { cloneUtil, joinQueryForUrl } from '@/common';
import { decryptDes } from '@/common/des';
import {
  idValidator,
  ServerStaticData,
  GStores,
  AliPayLoginHandler,
  apiAsync,
  wait,
  PatientUtils,
  routerJump,
  getH5OpenidParam,
  useTBanner,
  LoginUtils,
  useOcr,
  ISystemConfig,
  rulePhone,
  TPersonExtraKey,
} from '@/utils';
import api from '@/service/api';
import globalGl, { SYS_CODE } from '@/config/global';
import { IPat } from '@/stores';

/**
 * 完善、 新增就诊人页面
 */
// 修改值  需要单独修改 addMedical 页面的 prop
export const formKey = <const>{
  relationship: 'relationship',
  relationshipCode: 'relationshipCode',
  patientType: 'patientType',
  // patientType: 'patientType',
  idType: 'idType',
  idCard: 'idCard',
  patientName: 'patientName',
  patientPhone: 'patientPhone',
  birthday: 'birthday',
  sex: 'sex',
  upName: 'upName',
  upIdCard: 'upIdCard',
  upPhone: 'upPhone',
  address: 'address',
  location: 'location',
  verifyCode: 'verifyCode',
  defaultFalg: 'defaultFalg',
  nation: 'nation',
  isUserInfoShareAgree: 'isUserInfoShareAgree',
  referenceId: 'referenceId',
  countries: 'countries',
  height: 'height',
  weight: 'weight',
};

export type TCardPat = {
  inHospitalId: string;
  cardBalance: string;
  cardNumber: string;
  cardType: string;
  createTime: string;
  patientName: string;
  idTypeName: string;
  idCard: string;
};

export type FormKey = typeof formKey;

export type TFormKeys = keyof FormKey;

export const tempList: TInstance[] = [
  {
    required: true,
    showSuffixArrowIcon: true,
    label: '就诊人类型',
    placeholder: '请选择',
    key: formKey.patientType,
    field: 'select',
    options: [],
    autoOptions: 'patientTypeTerms',
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '关系',
    placeholder: '请选择',
    key: formKey.relationship,
    field: 'select',
    options: [],
    autoOptions: 'RelationShipList',
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '民族',
    placeholder: '请选择',
    key: formKey.nation,
    field: 'select',
    options: [],
    autoOptions: 'nationTerms',
    labelWidth: '220rpx',
    filterOptions(opt, search) {
      if (search) {
        return opt.filter((o) => {
          const { label } = o;

          return label.includes(search);
        });
      }
      return opt;
    },
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '国籍',
    placeholder: '请选择',
    key: formKey.countries,
    field: 'select',
    options: [],
    autoOptions: 'countries',
    // rowStyle: 'margin-bottom: 16rpx;',
    labelWidth: '220rpx',
    filterOptions(opt, search) {
      if (search) {
        return opt.filter((o) => {
          const { label, name_en, name_zh, pinyin, short_lower, short_upper } =
            o;

          return (
            label.includes(search) ||
            name_en.includes(search) ||
            name_zh.includes(search) ||
            pinyin.includes(search) ||
            short_lower.includes(search) ||
            short_upper.includes(search)
          );
        });
      }
      return opt;
    },
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '证件类型',
    placeholder: '请选择',
    key: formKey.idType,
    field: 'select',
    options: [],
    autoOptions: 'idTypeTerms',
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '证件号码',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.idCard,
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '真实姓名',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.patientName,
    labelWidth: '220rpx',
    maxlength: 50,
    validator(value) {
      const v = <string>value;

      if (v) {
        if (v.length < 2) {
          return Promise.resolve({
            success: false,
            message: '真实姓名需要大于2个字符',
          });
        }
        const isEng = v.match(/^[A-Za-z]+\s?[A-Za-z]+$/);

        if (isEng) {
          return Promise.resolve({
            success: true,
          });
        } else {
          // const result = v.match(
          //   /^[\u4e00-\u9fa5]{1,10}\.?\·?[\u4e00-\u9fa5]{1,10}$/
          // );

          // if (!result) {
          //   return Promise.resolve({
          //     success: false,
          //     message: '中文名字不能大于 20 个字符',
          //   });
          // }

          if (v.length > 50) {
            return Promise.resolve({
              success: false,
              message: '真实姓名不能大于 50 个字符 ',
            });
          }
        }
      }

      return Promise.resolve({
        success: true,
      });
    },
  },

  {
    required: true,
    label: '手机号',
    field: 'input-text',
    placeholder: '请输入',
    maxlength: 11,
    key: formKey.patientPhone,
    rule: [
      {
        message: '请确认手机号是否有误',
        rule: rulePhone,
      },
    ],
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '出生日期',
    placeholder: '请选择',
    key: formKey.birthday,
    field: 'time-picker',
    type: 'date',
    end: new Date().getTime(),
    start: '1900-01-01',
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '性别',
    placeholder: '请选择',
    key: formKey.sex,
    field: 'select',
    options: [
      {
        label: '男',
        value: '男',
      },
      {
        label: '女',
        value: '女',
      },
    ],
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '监护人姓名',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.upName,
    labelWidth: '220rpx',
    maxlength: 50,
  },

  {
    required: true,
    label: '身高(厘米)',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.height,
    labelWidth: '220rpx',
    maxlength: 50,
    inputType: 'digit',
  },

  {
    required: true,
    label: '体重(公斤)',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.weight,
    labelWidth: '220rpx',
    maxlength: 50,
    inputType: 'digit',
  },

  {
    required: true,
    label: '监护人证件号',
    field: 'input-text',
    placeholder: '请输入',
    key: formKey.upIdCard,
    validator: async (v: unknown, item: any) => {
      if (typeof v === 'string' && v && idValidator.checkIdCardNo(v)) {
        const { ageGuardian } =
          await ServerStaticData.getSystemConfig('person');

        const info = idValidator.getIdCardInfo(v);

        if (info.age < ageGuardian) {
          return Promise.resolve({
            success: false,
            message: `监护人年龄必须大于: ${ageGuardian}岁`,
          });
        }

        return Promise.resolve({
          success: true,
        });
      }

      return Promise.resolve({
        success: false,
        message: '请确认证件号码是否有误',
      });
    },
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '监护人手机号',
    field: 'input-text',
    placeholder: '请输入',
    maxlength: 11,
    key: formKey.upPhone,
    rule: [
      {
        message: '请确认手机号是否有误',
        rule: rulePhone,
      },
    ],
    labelWidth: '220rpx',
  },

  {
    required: true,
    showSuffixArrowIcon: true,
    label: '所在地区',
    placeholder: '请选择',
    key: formKey.address,
    field: 'address',
    labelWidth: '220rpx',
  },

  {
    required: true,
    label: '详细地址',
    field: 'input-text',
    placeholder: '请输入街道、小区、门牌号等',
    key: formKey.location,
    rowStyle: 'border-radius: 0 0 16rpx 16rpx;',
    maxlength: 100,
    labelWidth: '220rpx',
    validator(value) {
      const v = <string>value;

      if (v) {
        if (v.length < 4) {
          return Promise.resolve({
            success: false,
            message: '详细地址需要大于4个字符',
          });
        }
      }

      return Promise.resolve({
        success: true,
      });
    },
  },

  {
    required: true,
    maxlength: 6,
    label: '验证码',
    field: 'input-verify',
    placeholder: '请输入',
    key: formKey.verifyCode,
    verifyBtnText: '获取验证码',
    inputType: 'number',
    verifySecond: 60,
    rule: {
      message: '验证码必须是数字',
      rule: /\d+/,
    },
    phoneKey: formKey.patientPhone,
    labelWidth: '220rpx',
  },

  {
    field: 'switch',
    key: formKey.isUserInfoShareAgree,
    label: '允许该平台访问院内此用户的就诊数据',
    showRequireIcon: true,
    required: true,
    emptyMessage: '请允许该平台访问院内此用户的就诊数据',
    validator(v) {
      if (!v) {
        return Promise.resolve({
          success: false,
          message: '请允许该平台访问院内此用户的就诊数据',
        });
      }

      return Promise.resolve({
        success: true,
      });
    },
  },

  {
    label: '备注',
    field: 'input-text',
    placeholder: '请输入',
    key: 'referenceId',
    labelWidth: '220rpx',
    maxlength: 50,
  },

  {
    field: 'switch',
    key: formKey.defaultFalg,
    label: '设为默认就诊人',
    labelWidth: '260rpx',
    rowStyle: 'margin-top: 16rpx;',
  },
];

export const pickTempItem = function <T = TFormKeys>(
  keys: TFormKeys[]
): TInstance[] {
  const dKeys = keys.map((key) => formKey[key]);

  return cloneUtil<TInstance[]>(tempList)
    .filter((item) => dKeys.includes(<any>item.key))
    .sort((a, b) => {
      const aIndex = dKeys.findIndex((key) => key === a.key);
      const bIndex = dKeys.findIndex((key) => key === b.key);
      return aIndex - bIndex;
    });
};

/**
 * 就诊人详情页面
 */
export const patCardDetailFormKey = <const>{
  patientType: 'patientType',
  patientName: 'patientName',
  idType: 'idType',
  idCard: 'idCard',
  patientPhone: 'patientPhone',
  nation: 'nation',
  address: 'address',
  patientSex: 'patientSex',
  upName: 'upName',
  upIdCard: 'upIdCard',
  defaultFlag: 'defaultFlag',
  relationship: 'relationship',
};

export type PatCardKeys = keyof typeof patCardDetailFormKey;

export const patCardDetailTempList: TInstance[] = [
  {
    label: '就诊人类型',
    key: patCardDetailFormKey.patientType,
    field: 'select',
    disabled: true,
    isForShow: true,
    options: [],
    autoOptions: 'patientTypeTerms',
  },

  {
    label: '真实姓名',
    field: 'input-text',
    disabled: true,
    key: patCardDetailFormKey.patientName,
    isForShow: true,
  },

  {
    label: '性别',
    field: 'input-text',
    key: patCardDetailFormKey.patientSex,
    disabled: true,
    isForShow: true,
  },

  {
    label: '证件类型',
    field: 'select',
    disabled: true,
    isForShow: true,
    options: [],
    key: formKey.idType,
    autoOptions: 'idTypeTerms',
  },
  {
    label: '证件号码',
    field: 'input-text',
    disabled: true,
    key: patCardDetailFormKey.idCard,
    isForShow: true,
  },

  {
    label: '手机号',
    field: 'input-text',
    disabled: true,
    key: patCardDetailFormKey.patientPhone,
    isForShow: true,
  },

  {
    label: '民族',
    field: 'input-text',
    key: patCardDetailFormKey.nation,
    disabled: true,
    isForShow: true,
  },

  {
    label: '详细地址',
    field: 'input-text',
    key: patCardDetailFormKey.address,
    disabled: true,
    isForShow: true,
  },

  {
    label: '监护人姓名',
    field: 'input-text',
    key: patCardDetailFormKey.upName,
    disabled: true,
    isForShow: true,
  },

  {
    label: '监护人身份证号',
    field: 'input-text',
    key: patCardDetailFormKey.upIdCard,
    labelWidth: '260rpx',
    disabled: true,
    isForShow: true,
  },

  {
    field: 'switch',
    key: patCardDetailFormKey.defaultFlag,
    label: '设为默认就诊人',
    labelWidth: '260rpx',
    rowStyle: 'margin-top: 16rpx; padding: 10rpx 32rpx;',
  },
];

/**
 * 获取姓名、手机号 默认值
 * @param pageType
 * @returns
 */
export const getDefaultFormData = async (
  pageType: 'addPatient' | 'perfectReal'
) => {
  const pageConfig = await ServerStaticData.getSystemConfig('person');
  const data: Record<string, any> = {};
  const gStores = new GStores();
  const { ev } = gStores.globalStore;

  // 默认身份证
  if (!data[formKey.idType]) {
    data[formKey.idType] = '01';
  }

  // 默认成人,儿童 有证件
  if (!data[formKey.patientType]) {
    data[formKey.patientType] = '-1';
  }

  if (pageType === 'perfectReal') {
    if (ev === 'alipay') {
      const { userName, mobile } = gStores.userStore.cacheUser;
      data[formKey.patientName] = userName;
      data[formKey.patientPhone] = mobile;
    }

    if (ev === 'wx') {
      const wxPhone = decryptDes(gStores.userStore.phoneNum, 'N1@ae^T:phone');
      data[formKey.patientPhone] = wxPhone;
    }

    // 完善默认展示本人
    if (globalGl.SYS_CODE === '1001082') {
      data[formKey.relationship] = '本人'; //仅限健康温州  正常relationship为1
      data[formKey.relationshipCode] = '1';
    }
  } else if (ev === 'alipay') {
    const patList = gStores.userStore.patList;

    if (!patList.length) {
      const { userName, mobile, certNo } = gStores.userStore.cacheUser;
      if (userName) {
        data[formKey.patientName] = userName;
      }
      if (mobile) {
        data[formKey.patientPhone] = mobile;
      }
      if (certNo) {
        data[formKey.idCard] = certNo;
      }
    }
  }
  if (pageConfig?.formNotDisableKeysInQuickAddPatPage) {
    pageConfig?.formNotDisableKeysInQuickAddPatPage.forEach((item) => {
      delete data[item.key];
    });
  }
  return data;
};

export const getHealthCardCode = async (): Promise<{
  success: boolean;
  res: any;
}> => {
  // #ifdef  MP-WEIXIN
  const plugin = requirePlugin('healthCardPlugins');

  return new Promise((resolve) => {
    uni.showLoading({
      title: '请求授权中',
      mask: true,
    });

    plugin.login(
      (isok, res) => {
        uni.hideLoading();
        if (res.result.type !== 3) {
          // 用户在微信授权过，可直接获取登录信息
          resolve({
            success: true,
            res,
          });
        } else {
          // 未授权 显示 healthCardLogin 登录组件，引导用户同意授权
          resolve({
            success: false,
            res,
          });
        }
      },
      {
        wechatcode: true,
      }
    );
  });
  // #endif
};

/** 对提交后的数据重新过滤格式化 */
export const formatterSubPatientData = (data: BaseObject) => {
  const cloneData = {
    ...data,
  };

  const patientName = <string>cloneData.patientName;

  if (patientName) {
    // 新疆要求不要有英文的 '•' -> '·'
    cloneData.patientName = patientName.replace(/\•/g, '·');
  }

  return cloneData;
};

export const loginAuthAlipay = async (init: Function) => {
  const gStores = new GStores();

  const { cacheUser, patList } = gStores.userStore;

  const { userName, certNo } = cacheUser;
  // #ifdef MP-ALIPAY
  if (!certNo) {
    await new AliPayLoginHandler()
      .handlerAuth({ onlyLogin: true })
      .catch((e) => {
        gStores.messageStore.showMessage(
          '授权获取用户数据失败, 请重新进入授权',
          3000,
          {
            closeCallBack() {
              uni.reLaunch({
                url: '/pages/home/my',
              });
            },
          }
        );
        throw new Error(e);
      });

    init && init();
  }
  // #endif
};

export const useProgramPaySign = () => {
  const gStores = new GStores();
  const regDialogConfirmSign = ref(<any>'');
  const flagTitle1203 = ref('温馨提示');
  const patientUtils = new PatientUtils();
  // 存在签约功能?
  const isSignExist = ref(false);
  let isAfterSign = false;
  let _patientId = '';

  let containerEnv: 'wx' | 'ali';
  // #ifdef MP-WEIXIN
  containerEnv = <any>'wx';
  // #endif

  // #ifdef MP-ALIPAY
  containerEnv = <any>'ali';
  // #endif
  const isAgreeSign = ref(false);
  const disagreeSign = () => {
    isAgreeSign.value = false;
    // const pages = getCurrentPages();
    // if (pages && pages.length > 1) {
    //   uni.navigateBack({
    //     delta: 1,
    //   });
    // } else {
    //   uni.reLaunch({
    //     url: '/pages/home/home',
    //   });
    // }
  };

  let signAfterCount = 0;
  type TSingnPayload = {
    type: 'addPat' | 'order';
    cb?: any;
  };
  const signAfterOnPageShow = async (payload = {} as TSingnPayload) => {
    const { type = 'addPat', cb } = payload;
    // 目前只有微信是异步的
    if (
      !isAfterSign ||
      // 微信点击开通的签约授权
      gStores.globalStore.appShowData?.referrerInfo?.extraData?.return_code !==
        'SUCCESS'
    ) {
      return;
    }

    isAfterSign = false;
    signAfterCount = 0;
    if (type === 'addPat') {
      await signAfter(_patientId);
    } else {
      await orderSignAfter(_patientId, cb);
    }
  };

  const signAfter = async (patientId?: string) => {
    if (++signAfterCount > 2) {
      uni.hideLoading();
      gStores.messageStore.showMessage(
        '查询免密代扣签约失败, 添加就诊人可能失败, 请稍后再试',
        0,
        {
          useDialog: true,
          dialogOpt: {
            title: '提示',
          },
        }
      );

      throw new Error('查询免密代扣签约失败');
    }

    const {
      browser: { source },
    } = gStores.globalStore;

    uni.showLoading({
      title: '查询签约中...',
      mask: true,
    });
    await wait(5000);
    const {
      result: { message, signFlag, showFlag },
    } = await api.patSign({
      patientId,
      source,
    });

    if (showFlag) {
      await signAfter(patientId);
    } else if (signFlag) {
      await patientUtils.getPatCardList();
      routerJump('/pages/home/home');
    } else {
      gStores.messageStore.closeMessage();
      await wait(20);
      gStores.messageStore.showMessage(message, 0, {
        useDialog: true,
        dialogOpt: {
          title: '提示',
        },
      });
      throw new Error('查询免密代扣签约失败');
    }
    // await patientUtils.getPatCardList();
    // const pat = gStores.userStore.patList.find(
    //   (o) => o.patientId === patientId
    // );
    // if (!pat) {
    //   return await signAfter(patientId);
    // }
  };

  const orderSignAfter = async (patientId: string, cb: any = () => {}) => {
    if (++signAfterCount > 2) {
      uni.hideLoading();
      gStores.messageStore.showMessage(
        '查询免密代扣签约失败, 就诊人授权免密代扣可能失败, 请稍后再试',
        0,
        {
          useDialog: true,
          dialogOpt: {
            title: '提示',
          },
        }
      );

      throw new Error('查询免密代扣签约失败');
    }

    const {
      browser: { source },
    } = gStores.globalStore;

    uni.showLoading({
      title: '查询签约中...',
      mask: true,
    });
    await wait(5000);
    const {
      result: { message, signFlag, showFlag },
    } = await api.patSign({
      patientId,
      source,
    });

    if (showFlag) {
      await orderSignAfter(patientId, cb);
    } else if (signFlag) {
      await patientUtils.getPatCardList();
      await cb();
    } else {
      gStores.messageStore.closeMessage();
      await wait(20);
      gStores.messageStore.showMessage(message, 0, {
        useDialog: true,
        dialogOpt: {
          title: '提示',
        },
      });
      throw new Error('查询免密代扣签约失败');
    }
  };

  return {
    signAfterOnPageShow,
    disagreeSign,
    isAgreeSign,
    async getFreeSignData(patientId) {
      const { result } = await api.findSign({
        patientId,
        source: gStores.globalStore.browser.source,
      });

      return result as {
        freeSignData: string;
        [key: string]: any;
      };
    },
    isAgreeSignChange(v) {
      if (v) {
        regDialogConfirmSign.value.show();
      } else {
        isAgreeSign.value = v;
      }
    },
    flagTitle1203,
    regDialogConfirmSign,
    isSignExist,
    async initSign() {
      const { isPayWithoutSecretAuth } =
        await ServerStaticData.getSystemConfig('person');

      if (isPayWithoutSecretAuth === '1') {
        // regDialogConfirmSign.value.show();
        isSignExist.value = true;
      }
    },

    async goPaySign(patientId, payload = {} as TSingnPayload) {
      const { type = 'addPat', cb } = payload;

      const { isPayWithoutSecretAuth } =
        await ServerStaticData.getSystemConfig('person');
      if (isPayWithoutSecretAuth !== '1') {
        return;
      }
      let { phoneNum, cacheUser, cellPhoneNum } = gStores.userStore;
      const {
        browser: { source },
        openId: _openId,
      } = gStores.globalStore;
      let channel = 'WX_JSAPI_SIGN';
      let payType = 'WX_MINI';
      let openId = '';
      let userId = '';
      // await new AliPayLoginHandler().handlerAuth()

      // #ifdef MP-WEIXIN
      channel = 'WX_MINI_SIGN';
      openId = _openId;
      // #endif

      // #ifdef MP-ALIPAY
      channel = 'ALI_MINI_SIGN';
      payType = 'ALI_MINI';
      userId = _openId;

      // if (!cacheUser.certNo) {
      //   await new AliPayLoginHandler().handlerAuth();
      // }

      // #endif

      const args = {
        channel,
        openId,
        userId,
        patientId,
        source,
        payType,
        phone: phoneNum,
        // buyerAccount: cacheUser.mobile,
        buyerAccount: cellPhoneNum,
        userIdCard: cacheUser.certNo,
        userName: cacheUser.userName,
        showUrl: '/pagesA/medicalCardMan/sign?isBack=1',
      };
      const {
        result: { invokeData, continueWxSign },
      } = await api.applyForSign(args);
      _patientId = patientId;

      if (containerEnv === 'wx') {
        if (!continueWxSign) {
          const { confirm } = await apiAsync(uni.showModal, {
            content: '是否拉起签约授权?',
          });

          if (!confirm) {
            gStores.messageStore.showMessage('拉起签约失败', 1500);
            throw new Error('用户拒绝拉起签约');
          }

          await apiAsync(wx.navigateToMiniProgram, {
            appId: 'wxbd687630cd02ce1d',
            path: 'pages/index/index',
            extraData: invokeData,
          });
          isAfterSign = true;
          // 微信签约成功后需要在 onShow 中继续走
          throw new Error('签约');
        }
      } else if (containerEnv === 'ali') {
        const { result: _aliRes, resultStatus } = await apiAsync(
          my.paySignCenter,
          {
            signStr: encodeURIComponent(invokeData.signStr),
          }
        );
        if (resultStatus !== '7000') {
          throw new Error('未签约');
        }
        let aliRes: any = {};
        try {
          aliRes = JSON.parse(_aliRes);
        } catch (error) {
          aliRes = {};
        }

        if (
          aliRes &&
          aliRes.alipay_user_agreement_page_sign_response?.code === '10000'
        ) {
          if (type === 'addPat') {
            await signAfter(_patientId);
          } else {
            await orderSignAfter(_patientId, cb);
          }
        } else {
          throw new Error('签约异常');
        }
      }
    },
  };
};
const commonQuery = {
  sysCode: globalGl.SYS_CODE,
};
export const healthCardQuery = {
  ...commonQuery,

  domainChannel: 3,
  faceUrl: '/pagesA/medicalCardMan/medicalCardMan',
  failRedirectUrl:
    `mini:${globalGl.addPersonUrl}?_healthType=failRedirect&regInfoCode=` +
    '${regInfoCode}',
  successRedirectUrl:
    `mini:/pagesA/medicalCardMan/medicalCardMan?_healthType=associate&healthCode=` +
    '${healthCode}',
  verifyFailRedirectUrl:
    'mini:/pagesA/medicalCardMan/medicalCardMan?_healthType=verifyFail',
  userFormPageUrl:
    `mini:${globalGl.addPersonUrl}?_healthType=addPat&authCode=` +
    '${authCode}',
  verifyUrl: '',
  // userFormPageUrl:
  // `mini:${globalGl.addPersonUrl}?_healthType=addPat&authCode=` +
  // '${authCode}',
};
export const healthCardBind = async () => {
  const gStores = new GStores();
  const globalStore = gStores.globalStore;
  const { success, res } = await getHealthCardCode();
  if (success) {
    const {
      result: { wechatCode },
    } = res;
    const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;
    const requestArg = {
      hospitalId,
      wechatCode,
      herenId: gStores.globalStore.herenId,
      openId: gStores.globalStore.openId,
      source: gStores.globalStore.browser.source,
      ...healthCardQuery,
    };
    const {
      result: { bindCardUrl: h5Url },
    } = await api.registerHealthCardPreAuth(requestArg);
    useTBanner(
      {
        type: 'h5',
        path: h5Url,
      },
      'redirectTo'
    );
  } else {
    throw new Error('未授权， 请再次点击进行授权');
  }
};

export const healthCardLink = async (healthCode: string, cb?: Function) => {
  uni.showLoading({
    title: '关联电子健康卡中...',
    mask: true,
  });
  const gStores = new GStores();
  const globalStore = gStores.globalStore;
  if (globalGl.systemInfo.isOpenHealthCard && healthCode) {
    // #ifdef MP-WEIXIN
    const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;

    const requestArg = {
      healthCode,
      hospitalId,
      herenId: globalStore.herenId,
      source: globalStore.browser.source,
    };

    getH5OpenidParam(requestArg);
    await api
      .quickLinkHealthCardWithLoad(requestArg)
      .then(() => {
        uni.hideLoading();
        gStores.messageStore.showMessage('关联成功', 1500, {
          closeCallBack() {
            uni.hideLoading();
            //刷新就诊人列表
            new PatientUtils().getPatCardList();
            if (cb) {
              cb.call(this);
            } else {
              uni.reLaunch({
                url: '/pages/home/home',
              });
            }
          },
        });
      })
      .catch(async (e) => {
        uni.hideLoading();
        const { respCode, message } = e;
        console.error('quickLinkHealthCardWithLoad error', respCode, message);
        if (respCode === 884801) {
          gStores.messageStore.closeMessage();
          const { confirm } = await apiAsync(uni.showModal, {
            content: '患者存在建档记录但手机号不匹配，是否立即修改？',
          });
          if (confirm) {
            await api.mofHosPhone({
              healthCode,
              source: gStores.globalStore.browser.source,
            });
          }
        } else {
          gStores.messageStore.showMessage(message, 3000);
          const { confirm } = await apiAsync(uni.showModal, {
            content: '电子健康卡关联失败，是否直接绑定就诊人？',
          });
          if (confirm) {
            uni.navigateTo({
              url: `${globalGl.addPersonUrl}`,
            });
          }
        }
      });
    // #endif
  } else {
    gStores.messageStore.showMessage('绑定失败', 1500, {});
  }
};

export const gotoChosseVerifyPage = async (
  requestData,
  authCode: string,
  type?: 'quickRegisterHealthCard' | 'registerHealthCardPreFill',
  errCB?: Function
) => {
  const gStores = new GStores();
  const globalStore = gStores.globalStore;
  const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;
  if (type !== 'quickRegisterHealthCard') {
    const {
      idCard: idNumber,
      patientPhone: phone1,
      patientName: name,
      nation,
    } = requestData;
    const list = await ServerStaticData.getNationTerms();
    const nationItem: any = list.find((o) => o.value === nation);
    const idCardInfo = getInfoFromIdCard(idNumber);
    const requestArg = {
      ...requestData,
      ...idCardInfo,
      ...healthCardQuery,
      herenId: gStores.globalStore.herenId,
      openId: gStores.globalStore.openId,
      source: gStores.globalStore.browser.source,
      nation: nationItem.label,
      authCode,
      phone1,
      name,
      idNumber,
      hospitalId,
    };
    const {
      result: { verifyUrl: h5Url },
    } = await api.registerHealthCardPreFill(requestArg);
    healthCardQuery.verifyUrl = h5Url;
    useTBanner(
      {
        type: 'h5',
        path: h5Url,
      },
      'redirectTo'
    );
  } else {
    const requestArg = {
      ...requestData,
      ...healthCardQuery,
      herenId: gStores.globalStore.herenId,
      openId: gStores.globalStore.openId,
      source: gStores.globalStore.browser.source,
      authCode,
      hospitalId,
    };
    const {
      result: { verifyUrl: h5Url },
    } = await api.quickRegisterHealthCard(requestArg).catch((err) => {
      errCB && errCB(err);
      return { result: { verifyUrl: '' } };
    });
    healthCardQuery.verifyUrl = h5Url;
    h5Url &&
      useTBanner(
        {
          type: 'h5',
          path: h5Url,
        },
        'redirectTo'
      );
  }
};

export const backWithFaceVerify = async (
  orderId: string,
  redirectUrl: string,
  verifyType: string
) => {
  uni.showLoading({
    title: '验证中...',
    mask: true,
  });
  const gStores = new GStores();
  const globalStore = gStores.globalStore;
  const hospitalId = globalGl.systemInfo.isOpenHealthCard!.hospitalId;
  const requestOrderArg = {
    herenId: gStores.globalStore.herenId,
    openId: gStores.globalStore.openId,
    source: gStores.globalStore.browser.source,
    ...commonQuery,
    orderId,
    verifyType: parseInt(verifyType),
    hospitalId,
  };
  const {
    result: { userData, userIdKey },
  } = await api.getOrderInfoByOrderId(requestOrderArg);
  const { verifyResult } = await wxFacialVerifyByKey(userIdKey, redirectUrl);
  const { success, res } = await getHealthCardCode();
  let wechatCode = '';
  if (success) wechatCode = res.result.wechatCode;
  else {
    uni.hideLoading();
    gStores.messageStore.showMessage('授权失败', 3000);
    return;
  }
  const requestResultArg = {
    ...requestOrderArg,
    userData,
    result: verifyResult && '01',
    wechatCode,
  };
  const {
    result: { verifyBool, verifyOrderId },
  } = await api.registerRealPersonAuthOrder(requestResultArg);
  if (verifyBool) {
    useTBanner(
      {
        type: 'h5',
        path: decodeURIComponent(
          `${redirectUrl}&verify_order_id=${verifyOrderId}`
        ),
      },
      'redirectTo'
    );
  } else {
    useTBanner(
      {
        type: 'h5',
        path: decodeURIComponent(`${redirectUrl}&verify_order_id=-1`),
      },
      'redirectTo'
    );
  }
  uni.hideLoading();
};

const wxFacialVerifyByKey = async (
  userIdKey: string,
  redirectUrl: string
): Promise<{ verifyResult: string; errCode: string; errMsg: string }> => {
  const gStores = new GStores();
  return new Promise((rl, rj) => {
    uni.showLoading({ title: '加载中'});;
    wx.checkIsSupportFacialRecognition({
      checkAliveType: 2,
      success() {
        wx.startFacialRecognitionVerify({
          checkAliveType: 2,
          userIdKey,
          success(e: { verifyResult: string; errCode: '0'; errMsg: string }) {
            //识别成功
            console.warn('人脸识别成功', e);
            uni.hideLoading();
            rl(e);
          },
          async fail(err) {
            //识别失败
            uni.hideLoading();
            gStores.messageStore.showMessage(
              '人脸识别失败,请重新选择验证方式',
              2000
            );
            console.log('看看是不是走到这', healthCardQuery);
            await wait(2000);
            if (redirectUrl) {
              useTBanner(
                {
                  type: 'h5',
                  path: decodeURIComponent(`${redirectUrl}&verify_order_id=-1`),
                },
                'redirectTo'
              );
            } else if (healthCardQuery?.verifyUrl) {
              useTBanner(
                {
                  type: 'h5',
                  path: healthCardQuery.verifyUrl,
                },
                'redirectTo'
              );
            }
            rj(err);
          },
        });
      },
      fail(err) {
        //识别失败
        uni.hideLoading();
        gStores.messageStore.showMessage('当前设备不支持人脸识别', 3000);
        console.error('当前设备不支持人脸识别', err);
        rj(err);
      },
    });
  });
};

export const getInfoFromIdCard = (idCard) => {
  if (idCard.length !== 18) {
    throw new Error('Invalid ID card length');
  }
  const gender = parseInt(idCard.charAt(16), 10) % 2 === 1 ? '男' : '女';
  const birthday = idCard.substring(6, 14);
  const year = parseInt(birthday.substring(0, 4), 10);
  const month = parseInt(birthday.substring(4, 6), 10);
  const day = parseInt(birthday.substring(6, 8), 10);
  const btd = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  let age = new Date().getFullYear() - new Date(btd).getFullYear();
  const monthDiff = new Date().getMonth() - new Date(btd).getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && new Date().getDate() < new Date(btd).getDate())
  ) {
    age--;
  }
  return {
    age,
    gender,
    birthday: btd,
  };
};

export const useAuthPerson = () => {
  const gStores = new GStores();
  const pageConfig = ref(<ISystemConfig['person']>{});
  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });
  const getRealNameAuth = computed(() => {
    return pageConfig.value.realNameAuth || [];
  });

  const realNameAuthOcr = async (pat: IPat) => {
    const { patientId } = pat;
    const { source } = gStores.globalStore.browser;
    const { pdata } = await useOcr(false, {
      aliThroughByEnd: true,
      imgCanvas,
    });

    await api.upRealNameAuth({
      patientId,
      source,
      pdata,
    });
  };

  const realNameAuthFace = async (pat: IPat) => {
    const { patientId } = pat;
    const { source } = gStores.globalStore.browser;

    const { pData } = await new LoginUtils().faceVerifyAndPDataForPat(pat);

    await api.upRealNameAuth({
      patientId,
      source,
      pdata: pData,
    });
  };

  const realNameAuth = async (pat: IPat) => {
    const tip = '选择认证方式';
    let authType = getRealNameAuth.value[0];

    if (getRealNameAuth.value.length > 1) {
      const listMap = [
        {
          label: 'ocr 认证',
          key: 'ocrVerify',
        },
        {
          label: '人脸认证',
          key: 'faceVerify',
        },
      ] as const;

      const list = listMap.filter((o) => getRealNameAuth.value.includes(o.key));
      const { tapIndex } = await apiAsync(uni.showActionSheet, {
        title: tip,
        alertText: tip,
        itemList: list.map((o) => o.label),
      });

      authType = list[tapIndex].key;
    }

    if (authType === 'ocrVerify') {
      const { title, content } = await gStores.getSysAppMore('1220');
      await new Promise<{ confirm: boolean }>((r) => {
        gStores.messageStore.showMessage(content, 0, {
          useDialog: true,
          dialogOpt: {
            title,
            isShowCancel: false,
          },
          closeCallBack: r,
        });
      });
      await realNameAuthOcr(pat);
    } else if (authType === 'faceVerify') {
      await realNameAuthFace(pat);
    }

    // await patientUtils.getPatCardList();
    // routerJump();
  };

  const init = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('person');
  };

  return {
    realNameAuth,
    init,
    imgCanvas,
    getRealNameAuth,
  };
};

export const isShowAddPatCardNo = (
  pat: IPat,
  config: ISystemConfig['person']
) => {
  const { isCanAddPatCardNo, isGuardianWithIdCard } = config;
  const {
    idCardEncry,
    // idType,
    patientAge,
    upIdCardEncry,
  } = pat;

  let r = false;

  // && idType === '01'
  if (isCanAddPatCardNo === '1') {
    let isChildren = false;
    if (isGuardianWithIdCard) {
      isChildren =
        (patientAge as unknown as number) * 1 <= isGuardianWithIdCard * 1;
    }

    if (isChildren && !upIdCardEncry) {
      r = true;
    }

    if (!idCardEncry) {
      r = true;
    }
  }

  return r;
};

export const insertSortFormExtraKey = (
  list: Exclude<TPersonExtraKey, string>[],
  insertList: string[]
) => {
  let formListKeyLen = 0;
  while (formListKeyLen < insertList.length) {
    const idxsNow = list.filter((o) => o.sort === formListKeyLen);
    if (idxsNow.length) {
      insertList.splice(formListKeyLen, 0, ...idxsNow.map((o) => o.key as any));
    }

    formListKeyLen++;
  }

  return insertList;
};

export const goEditPhone = async (pat: IPat) => {
  const gStores = new GStores();
  const personConfig = await ServerStaticData.getSystemConfig('person');
  const { isChangeHosPhoneWay } = personConfig;

  if (isChangeHosPhoneWay) {
    let q: any = {};
    const chooseList = [
      {
        label: '使用人脸验证',
        value: 'face',
      },
      {
        label: '上传证件验证',
        value: 'ocr',
      },
      // @ts-expect-error
    ].filter((o) => isChangeHosPhoneWay.includes(o.value));

    if (chooseList.length === 1) {
      q.verifyType = chooseList[0].value;
    } else {
      const { tapIndex } = await apiAsync(uni.showActionSheet, {
        title: '选择验证方式',
        alertText: '选择验证方式',
        itemList: chooseList.map((o) => o.label),
      });

      q.verifyType = chooseList[tapIndex].value;
    }
    gStores.userStore.updatePatClick(pat);

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/medicalCardMan/editPhone', q),
    });
  }
};
